<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('menu.codebook')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('codebook.long')" />
      <div class="form-inline">
        <v-search id="searchstr" ref="searchstr" v-model:search="searchstr"></v-search>
        <label for="listoftags" class="form-label mr-2 mb-2">{{$t('codebook.availtags')}}:</label>
        <select id="listoftags" class="custom-select mr-2 mb-2" v-model="selectedtag">
          <option v-for="t in tags" :key="t" :value="t">{{t}}</option>
        </select>
        <input type="button" id="btnsearch" name="btnsearch" :value="$t('buttons.search')" class="btn btn-primary mb-2" v-on:click="goSearch">
      </div>
      <div class="row">
        <div class="col-2 col-sm-1">
          <input type="button" id="prev" name="prev" value="&leftarrow;" class="btn btn-primary" v-on:click="getPrev">
        </div>
        <div class="imagearea col-8 col-sm-10">
          <va-item v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
            <template v-slot:header>{{codepageheader}}</template>
            <template v-slot:content>
              {{codepagedescription}}<hr>
              {{codepagetags}}
            </template>
          </va-item>
          <div class="text-center">
            <img class="img-fluid rounded" :src="codepageImage" :alt="codepageheader">
          </div>
        </div>
        <div class="col-2 col-sm-1">
          <input type="button" id="next" name="next" value="&rightarrow;" class="btn btn-primary" v-on:click="getNext">
        </div>
      </div>
      <p v-show="error" class="errormsg">{{errormsg}}.</p>
    </div>
  </div>
</template>

<script>
import VSearch from '@/components/inputs/VSearch.vue'
import { codepages } from '@/scripts/codebook.js'
import VaItem from '@/components/inputs/VaItem.vue'

export default {
  name: 'CodeBook',

  props: {
    msg: String
  },

  components: {
    VSearch,
    VaItem,
  },

  data: function () {
    return {
      searchstr: "",
      currentpage: 0,
      selectedtag: "",
      codepageheader: "",
      codepagedescription: "",
      codepagetags: "",
      codepagefile: "",
      foundpages: null,
      tags: null,
      error: false,
      errormsg: this.$t('errors.generic'),
      showitem: true,
      hidebutton: true,
    }
  },

  computed: {
    codepageImage() {
      // Possibly add srcset here later
      // If the filename is not set return (otherwise you get an error and page loading stops)
      if (!this.codepagefile) {
        return;
      }
      const fileName = this.codepagefile.toLowerCase();

      // Request the image as a webpack module
      return require(`@/assets/codebook/${fileName}`);
    },
  },

  mounted: function() {
    // Fill tags, use Set as it only has unique values
    // Set array with found pages to all available pages
    let tags = new Set();
    this.foundpages = [];
    for (let i=0; i < codepages.length; i++) {
      this.foundpages.push(i);
      for (let j=0; j < codepages[i].tags.length; j++) {
        tags.add( codepages[i].tags[j] );
      }
    }
    tags.add("");
    this.tags = Array.from(tags).sort();
    this.selectCodepage(this.currentpage-1);
  },
  methods: {

    // Display the codepage with the right index in the array of found pages
    selectCodepage: function() {
      this.codepageheader = codepages[this.foundpages[this.currentpage]].name;
      this.codepagedescription = codepages[this.foundpages[this.currentpage]].description;
      this.codepagetags = "Tags: ";
      for (let i=0; i < codepages[this.foundpages[this.currentpage]].tags.length; i++)
        this.codepagetags += codepages[this.foundpages[this.currentpage]].tags[i] + ", ";
      this.codepagetags = this.codepagetags.slice(0, this.codepagetags.length-2);
      this.codepagefile = codepages[this.foundpages[this.currentpage]].imagename;
    },

    // Get the previous page from the array of found pages (or restart at the last one)
    getPrev: function() {
      (this.currentpage == 0) ? this.currentpage = this.foundpages.length-1 : this.currentpage--;
      this.selectCodepage();
    },

    // Get the next page from the array of found pages (or restart at the first one)
    getNext: function() {
      (this.currentpage < this.foundpages.length-1) ? this.currentpage++ : this.currentpage = 0;
      this.selectCodepage();
    },

    // Search using the search string and tags and creates a new array of found pages
    goSearch: function() {

      // Clear the array with found pages, we will fill it again
      this.foundpages = [];

      // If no search is specified add all pages again
      if (!this.selectedtag && !this.searchstr) {
        for (let i = 0; i < codepages.length; i++) {
          this.foundpages.push(i);
        }
      } else {

        // Search tags, desription and name
        // Generate the regular expression case insentive if needed
        if (this.searchstr) {
          var srex = new RegExp (this.searchstr, "i");
        }

        // Scan all the codepages, if either the tag or the searchstr is a match add the page (only once)
        for (let i=0; i < codepages.length; i++) {

          // If the tag is present add the page as found
          if (codepages[i].tags.findIndex( (e) => e == this.selectedtag) >= 0) {
            this.foundpages.push(i);
          } else if (this.searchstr) {

            // If the name has a match add the page as found
            if (codepages[i].name.search(srex) >= 0)
              this.foundpages.push(i);

            // If the description has a match add the page as found
            else if(codepages[i].description.search(srex) >= 0)
              this.foundpages.push(i);
          }
        }
      }

      this.currentpage = 0;
      this.selectCodepage();
    },
  },
}
</script>
