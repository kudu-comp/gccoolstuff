<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('menu.htmlscanner') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('htmlscanner.long')"
      />
      <div class="form-row mb-2">
        <textarea
          id="gchtml"
          ref="gchtml"
          v-model="gchtml"
          name="gchtml"
          class="form-control"
          :placeholder="$t('htmlscanner.ph')"
          rows="3"
        />
      </div>
      <div class="form-inline mb-2">
        <input
          id="scan"
          type="button"
          name="scan"
          :value="$t('htmlscanner.btnscan')"
          class="btn btn-primary mr-2"
          @click="scanHTML"
        >{{ scanresult }}
      </div>
      <p
        v-show="errormsg"
        class="errormsg mt-2"
      >
        {{ errormsg }}
      </p>
      <va-item
        v-show="links.length>0"
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('htmlscanner.links') }}
        </template>
        <template #content>
          <select
            v-model="selectedlink"
            class="custom-select"
            @change="openLink(selectedlink)"
          >
            <option
              v-for="l in links"
              :key="l"
              :value="l.url"
            >
              {{ l.name }} - {{ l.url }}
            </option>
          </select>
        </template>
      </va-item>
      <va-item
        v-show="images.length>0"
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('htmlscanner.images') }}
        </template>
        <template #content>
          <select
            v-model="selectedimage"
            class="custom-select"
            @change="openLink(selectedimage)"
          >
            <option
              v-for="i in images"
              :key="i"
              :value="i.url"
            >
              {{ i.name }} - {{ i.url }}
            </option>
          </select>
        </template>
      </va-item>
      <va-item
        v-show="bgimages.length>0"
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('htmlscanner.bgimages') }}
        </template>
        <template #content>
          <select
            v-model="selectedbgimage"
            class="custom-select"
            @change="openLink(selectedbgimage)"
          >
            <option
              v-for="i in bgimages"
              :key="i"
              :value="i.url"
            >
              {{ i.name }} - {{ i.url }}
            </option>
          </select>
        </template>
      </va-item><va-item
        v-show="comments.length>0"
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('htmlscanner.comms') }}
        </template>
        <template #content>
          <div v-html="comments" />
        </template>
      </va-item>
      <va-item
        v-show="whites.length>0"
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('htmlscanner.white') }}
        </template>
        <template #content>
          <div v-html="whites" />
        </template>
      </va-item>
      <va-item
        v-show="sizes.length>0"
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('htmlscanner.size') }}
        </template>
        <template #content>
          <div v-html="sizes" />
        </template>
      </va-item>
      <va-item
        v-show="strongs.length>0"
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('htmlscanner.strong') }}
        </template>
        <template #content>
          <div v-html="strongs" />
        </template>
      </va-item>
      <va-item
        v-show="bolds.length>0"
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('htmlscanner.bold') }}
        </template>
        <template #content>
          <div v-html="bolds" />
        </template>
      </va-item>
      <va-item
        v-show="italics.length>0"
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('htmlscanner.ital') }}
        </template>
        <template #content>
          <div v-html="italics" />
        </template>
      </va-item>
      <va-item
        v-show="sups.length>0"
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('htmlscanner.sup') }}
        </template>
        <template #content>
          <div v-html="sups" />
        </template>
      </va-item>
      <va-item
        v-show="subs.length>0"
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('htmlscanner.sub') }}
        </template>
        <template #content>
          <div v-html="subs" />
        </template>
      </va-item>
      <va-item
        v-show="dels.length>0"
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('htmlscanner.del') }}
        </template>
        <template #content>
          <div v-html="dels" />
        </template>
      </va-item>
      <va-item
        v-show="ems.length>0"
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('htmlscanner.em') }}
        </template>
        <template #content>
          <div v-html="ems" />
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from '@/components/inputs/VaItem.vue'

export default {
  name: 'HtmlParser',

  components: {
    VaItem,
  },

  data: function () {
    return {
      gchtml: "",
      scanresult: "",
      errormsg: "",
      cacheNode: null,
      images: [],
      selectedimage: "",
      bgimages: [],
      selectedbgimage: "",
      links: [],
      selectedlink: "",
      comments: "",
      strongs: "",
      whites: "",
      sizes: "",
      bolds: "",
      italics: "",
      sups: "",
      subs: "",
      dels: "",
      ems: "",
      showitem: true,
      hidebutton: true
    }
  },

  mounted: function() {
    this.$refs.gchtml.focus();
  },

  methods: {

    // Open a selected link from the dropdown with links
    openLink: function (link) {
      window.open(link);
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
      this.errormsg = "";
      this.result = "";
      this.scanresult = "";

      // Clear previous scan
      this.images = [];
      this.bgimages = [];
      this.links = [];
      this.comments = "";
      this.strongs = "";
      this.whites = "";
      this.sizes = "";
      this.bolds = "";
      this.italics = "";
      this.sups = "";
      this.subs = "";
      this.dels = "";

      try {
        // Scan the XML
        let parser = new DOMParser();
        let xmlTree = parser.parseFromString(this.gchtml,"text/html");

        // First find the div with id cachedetails
        this.cacheNode = xmlTree.getElementById("ctl00_ContentBody_LongDescription");

        // Check if cacheNode exists
        if (!this.cacheNode) {
          this.errormsg = this.$t("htmlscanner.nocache");
          return;
        }

        // Find the links
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
        nodes = this.cacheNode.getElementsByTagName("img");
        for (let node of nodes) {
          // console.log(node);
          this.images.push({ name: node.getAttribute("alt"), url: node.getAttribute("src") });
        }

        // Find bgimages in styles
        let x = xmlTree.evaluate(
          "//span[@id='ctl00_ContentBody_LongDescription']//*[contains(@style,'background-image')]", xmlTree, null, XPathResult.ANY_TYPE, null);
        let bgimage = x.iterateNext();
        while (bgimage) {
          // Parse url using regex
          let url = bgimage.getAttribute('style').match(/background-image[:\s]*url\s*\(\s*['|"]*(\S*)['|"]\s*\)/);
          this.bgimages.push({ name: bgimage.textContent, url: url[1] });
          bgimage = x.iterateNext();
        }

        // Find background image in body tag
        // let body = xmlTree.evaluate("//body", xmlTree, null, XPathResult.ANY_TYPE, null);
        // if (body.size != 1) throw ("There should be exactly 1 body tag not " + body.size);
        // let bgbody = body.getAttribute('background');
        // console.log(bgbody);

        // Find the comments using XPath
        x = xmlTree.evaluate("//span[@id='ctl00_ContentBody_LongDescription']//comment()", xmlTree, null, XPathResult.ANY_TYPE, null);
        let comment = x.iterateNext();
        while (comment) {
          this.comments += comment.textContent + "<br>";
          comment = x.iterateNext();
        }

        // Find white text using XPath matches style and font white and font FFFFFF
        x = xmlTree.evaluate(
          "//span[@id='ctl00_ContentBody_LongDescription']//font[@color='white'] | " +
          "//span[@id='ctl00_ContentBody_LongDescription']//font[@color='#FFFFFF'] | " +
          "//span[@id='ctl00_ContentBody_LongDescription']//font[@color='rgb(255, 255, 255)'] | " +
          "//span[@id='ctl00_ContentBody_LongDescription']//*[contains(@style,'color:white') or contains(@style,'color:#FFFFFF') or contains(@style,'color:rgb(255, 255, 255)')]", xmlTree, null, XPathResult.ANY_TYPE, null);
        let white = x.iterateNext();
        while (white) {
          this.whites += white.textContent + "<br>";
          white = x.iterateNext();
        }

        // Find different sized text using XPath 
        x = xmlTree.evaluate(
          "//span[@id='ctl00_ContentBody_LongDescription']//*[contains(@style,'font-size')]", xmlTree, null, XPathResult.ANY_TYPE, null);
        let size = x.iterateNext();
        while (size) {
          this.sizes += size.textContent + "<br>";
          size = x.iterateNext();
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
        // Find deleted letters
        this.dels = this.listTags("del");
        // Find emphasized letters
        this.dels = this.listTags("em");

        // Display scan completed messages
        this.scanresult = this.$t('htmlscanner.complete');

      } catch (e) {

        this.errormsg = this.$t('htmlscanner.error');
        console.log(e);

      }
    },
  },
}

</script>

<style scoped>
</style>
