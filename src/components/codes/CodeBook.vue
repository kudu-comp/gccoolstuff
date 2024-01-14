<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('codebook.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('codebook.long')"
      />
      <div class="row">
        <v-search
          id="searchstr"
          ref="searchstr"
          v-model:search="searchstr"
          @keyup.enter="goSearch"
        />
        <label
          for="listoftags"
          class="form-label sm-size mb-2"
        >{{ $t('codebook.availtags') }}:</label>
        <select
          id="listoftags"
          v-model="selectedtag"
          class="form-select lg-size mb-2 me-2"
        >
          <option
            v-for="t in tags"
            :key="t"
            :value="t"
          >
            {{ t }}
          </option>
        </select>
        <button id="btnsearch" class="btn mb-2 me-2" style="width:3em;" @click="goSearch" >
          <i class="fa-solid fa-search"></i>          
        </button>
        <button id="prev" class="btn mb-2 me-2" style="width:3em;" @click="getPrev" >
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <button id="next" class="btn mb-2" style="width:3em;" @click="getNext" >
          <i class="fa-solid fa-arrow-right"></i>
        </button>
        <span class="form-label mb-2">{{ foundpages.length }}&nbsp;{{ $t('codebook.pagesfound') }}</span>
      </div>
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}.
      </p>
      <div class="text-center">       
        <div class="imagearea">
          <va-item
            :showitem="showitem"
            :hidebutton="hidebutton"
          >
            <template #header>
              {{ codepageheader }}
              <span style="text-align: right; float: right; right: 10px;">{{ currentpage+1 }} / {{ foundpages.length }}</span>
            </template>
            <template #content>
              {{ codepagedescription }}<hr>
              {{ codepagetags }}
            </template>
          </va-item>
          <div>
            <img
              class="img-fluid rounded"
              :src="codepageImage"
              :alt="codepageheader"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VSearch from '@/components/inputs/VSearch.vue'
import { codepages } from '@/scripts/codebook.js'
import VaItem from '@/components/inputs/VaItem.vue'

export default {
  name: 'CodeBook',

  components: {
    VSearch,
    VaItem,
  },

  // Prop cphr is parameter passed by route (optional)
  props: {
    code: {
      type: String,
      required: false,
      default: "atbash"
    },
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
      foundpages: [],
      tags: null,
      errormsg: "",
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
      return new URL(`../../assets/codebook/${fileName}`, import.meta.url).href;
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
    this.currentpage = 0;

    // If code is passed as a param make that the current page
    // Use imagename as it has no spaces
    if (this.$route.params.code) {
      for (let i=0; i < codepages.length; i++) {
        if (codepages[i].imagename.slice(0,-4) === this.$route.params.code) this.currentpage = i;
      }
    }
    this.selectCodepage();
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
