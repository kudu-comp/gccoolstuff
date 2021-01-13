<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('menu.htmlscanner')}}
    </div>
    <div class="mainpage">
      <div class="infoblock">
        {{$t('htmlscanner.long')}}
      </div>
      <div class="form-row mb-2">
        <textarea id="gchtml" name="gchtml" class="form-control" ref="gchtml" :placeholder="$t('htmlscanner.ph')" rows=3 v-model='gchtml'></textarea>
      </div>
      <div class="form-inline mb-2">
        <input type="button" id="scan" name="scan" :value="$t('htmlscanner.btnscan')" class="btn btn-primary mr-2" v-on:click="scanHTML">{{scanresult}}
      </div>
      <va-item v-show="links.length>0" v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
        <template v-slot:header>{{$t('htmlscanner.links')}}</template>
        <template v-slot:content>
          <select class="custom-select" v-model="selectedlink" @change="openLink()">
            <option v-for="l in links" :key="l" :value="l.url">{{l.name}} - {{l.url}}</option>
          </select>
        </template>
      </va-item>
      <va-item v-show="images.length>0" v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
        <template v-slot:header>{{$t('htmlscanner.images')}}</template>
        <template v-slot:content>
          <select class="custom-select" v-model="selectedimage" @change="openImage()">
            <option v-for="i in images" :key="i" :value="i.url">{{i.name}} - {{i.url}}</option>
          </select>
        </template>
      </va-item>
      <va-item v-show="comments.length>0" v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
        <template v-slot:header>{{$t('htmlscanner.comms')}}</template>
        <template v-slot:content>
          <div v-html="comments" />
        </template>
      </va-item>
      <va-item v-show="whites.length>0" v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
        <template v-slot:header>{{$t('htmlscanner.white')}}</template>
        <template v-slot:content>
          <div v-html="whites" />
        </template>
      </va-item>
      <va-item v-show="strongs.length>0" v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
        <template v-slot:header>{{$t('htmlscanner.strong')}}</template>
        <template v-slot:content>
          <div v-html="strongs" />
        </template>
      </va-item>
      <va-item v-show="bolds.length>0" v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
        <template v-slot:header>{{$t('htmlscanner.bold')}}</template>
        <template v-slot:content>
          <div v-html="bolds" />
        </template>
      </va-item>
      <va-item v-show="italics.length>0" v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
        <template v-slot:header>{{$t('htmlscanner.ital')}}</template>
        <template v-slot:content>
          <div v-html="italics" />
        </template>
      </va-item>
      <va-item v-show="sups.length>0" v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
        <template v-slot:header>{{$t('htmlscanner.sup')}}</template>
        <template v-slot:content>
          <div v-html="sups" />
        </template>
      </va-item>
      <va-item v-show="subs.length>0" v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
        <template v-slot:header>{{$t('htmlscanner.sub')}}</template>
        <template v-slot:content>
          <div v-html="subs" />
        </template>
      </va-item>
      <p v-show="error" class="errormsg mt-2">{{errormsg}}</p>
    </div>
  </div>
</template>

<script>

import VaItem from '@/components/inputs/VaItem.vue'

export default {
  name: 'HtmlParser',

  props: {
    msg: String,
  },

  components: {
    VaItem,
  },

  data: function () {
    return {
      gchtml: "",
      scanresult: "",
      error: false,
      errormsg: "",
      cacheNode: null,
      images: [],
      selectedimage: "",
      links: [],
      selectedlink: "",
      comments: [],
      strongs: "",
      whites: [],
      bolds: "",
      italics: "",
      sups: "",
      subs: "",
      showitem: true,
      hidebutton: true
    }
  },

  mounted: function() {
    this.$refs.gchtml.focus();
  },

  methods: {

    // Open a selected link from the dropdown with links
    openLink: function () {
      window.open(this.selectedlink);
    },

    // Open an image from the dropdown with images
    openImage: function () {
      window.open(this.selectedimage);
    },

    // Get all the nodes with a certain tag return a string
    listTags: function (tag) {
      let nodes = this.cacheNode.getElementsByTagName(tag);
      let tags ="";
      for (let node of nodes) {
        // console.log(node);
        tags += node.textContent + " ";
      }
      return tags;
    },

    // Scan the HTML
    scanHTML: function () {

      // Reset error flag
      this.error = false;
      this.result = "";
      this.scanresult = "";

      // Clear previous scan
      this.images = [];
      this.links = [];
      this.comments = [];
      this.strongs = "";
      this.whites = [];
      this.bolds = "";
      this.italics = "";
      this.sups = "";
      this.subs = "";

      try {
        // Scan the XML
        let parser = new DOMParser();
        let xmlTree = parser.parseFromString(this.gchtml,"text/html");

        // First find the div with id cachedetails
        this.cacheNode = xmlTree.getElementById("ctl00_ContentBody_LongDescription");

        // Check if cacheNode exists
        if (!this.cacheNode) {
          this.error = true;
          this.errormsg = this.$t("htmlscanner.nocache");
          return;
        }

        // Find the links
        this.links = [];
        let nodes = this.cacheNode.getElementsByTagName("a");
        for (let node of nodes) {
          // console.log(node);
          this.links.push({ name: node.textContent, url: node.getAttribute("href") });
        }

        // Find the links in maps
        nodes = this.cacheNode.getElementsByTagName("area");
        for (let node of nodes) {
          // console.log(node);
          this.links.push({ name: "Link mapped in image", url: node.getAttribute("href") });
        }

        // Find the images
        this.images = [];
        nodes = this.cacheNode.getElementsByTagName("img");
        for (let node of nodes) {
          // console.log(node);
          this.images.push({ name: node.getAttribute("alt"), url: node.getAttribute("src") });
        }

        // Find the comments using XPath
        let x = xmlTree.evaluate("//span[@id='ctl00_ContentBody_LongDescription']//comment()", xmlTree, null, XPathResult.ANY_TYPE, null);
        let comment = x.iterateNext();
        this.showcomments = (comment != null);
        this.comments = "";
        while (comment) {
          this.comments += comment.textContent + "<br>";
          comment = x.iterateNext();
        }

        // Find white text using XPath matches style and font white and font FFFFFF
        x = xmlTree.evaluate(
          "//span[@id='ctl00_ContentBody_LongDescription']//font[@color='white'] | " +
          "//span[@id='ctl00_ContentBody_LongDescription']//font[@color='#FFFFFF'] | " +
          "//span[@id='ctl00_ContentBody_LongDescription']//*[contains(@style,'color:white') or contains(@style,'color:#FFFFFF')]", xmlTree, null, XPathResult.ANY_TYPE, null);
        let white = x.iterateNext();
        this.showwhites = (white != null);
        this.whites = "";
        while (white) {
          this.whites += white.textContent + "<br>";
          white = x.iterateNext();
        }

        // Find strong printed letters
        this.strongs = this.listTags("strong");
        // Find bold printed letters
        this.bolds = this.listTags("b");
        // Find italic letters
        this.italics = this.listTags("i");
        // Find superscript letters
        this.sups = this.listTags("sup");
        // Find subscript letters
        this.subs = this.listTags("sub");

        // Display scan completed messages
        this.scanresult = this.$t('htmlscanner.complete');

      } catch (e) {

        this.error = true;
        this.errormsg = this.$t('htmlscanner.error');
        console.log(e);

      }
    },
  },
}

</script>

<style scoped>
</style>
