<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('alltools.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('alltools.long')"
      />
      <div class="row">
        <v-search
          id="searchstr"
          v-model:search="searchstr"
          @keyup.enter="goSearch"
        />
        <button id="btnsearch" class="sm-size btn mb-2 ms-2 me-2" @click="goSearch" :title="$t('buttons.search')">
          <i class="fa-solid fa-search"></i>          
        </button>
        <button id="bnreset" class="sm-size btn mb-2 me-2" :title="$t('buttons.reset')" @click="showAll" >
          <i class="fa-solid fa-refresh"></i>          
        </button>
        <button
          id="collapseall"
          class="md-size btn mb-2 me-2"
          :title="$t('buttons.collall')"
          @click="collapseAll"
        >
          {{ $t('buttons.collall') }}
        </button>
        <button
          id="expandall"
          class="md-size btn mb-2 me-2"
          :title="$t('buttons.expall')"
          @click="expandAll"
        >
          {{ $t('buttons.expall') }}
        </button>
      </div>
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <!-- Show tools -->
      <div class="level1" v-for="l1 in alltools">
        <span v-show="l1.l2 && l1.show" @click="l1.expand=!l1.expand">
          <span v-if="l1.expand">
            <i class="levelbtn fa-solid fa-caret-down"></i>
          </span>
          <span v-if="!l1.expand">
            <i class="levelbtn fa-solid fa-caret-right"></i>
          </span>
        </span>
        <a v-show="l1.show" :href="l1.href">{{ l1.name }}</a>
        <div class="level2" v-show="l1.l2 && l1.expand && l1.show" v-for="l2 in l1.l2">
          <span v-show="l2.l3 && l2.show" @click="l2.expand=!l2.expand">
            <span v-if="l2.expand">
              <i class="levelbtn fa-solid fa-caret-down"></i>
            </span>
            <span v-if="!l2.expand">
              <i class="levelbtn fa-solid fa-caret-right"></i>
            </span>
          </span>
          <a v-show="l2.show" :href="l2.href">{{ l2.name }}</a>
          <div class="level3" v-show="l2.l3 && l2.expand && l2.show" v-for="l3 in l2.l3">
            <a v-show="l3.show" :href="l3.href">{{ l3.name }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import VSearch from '@/components/inputs/VSearch.vue'
import { codepages } from '@/scripts/codebook.js'
import { fontdefs } from '@/scripts/fontspecials.js'
import { ciphers } from '@/scripts/ciphers.js'
 
export default {

  name: "AllTools",

  components: {
    VSearch
  },

  // Prop cphr is parameter passed by route (optional)
  props: {
    s: {
      type: String,
      required: false,
      default: "atbash"
    },
  },
  
  data() {
    return {
      errormsg: "",
      searchstr: "",
      codes: null,
      fonts: null,
      ciphers: null,
      alltools: [
        {
          href: "/helpcoord",          name: this.$t('menu.coordinates'), show : true, expand: false,
          l2: [
            { href: "/convert",        name: "", show : true       },
            { href: "/project",        name: "", show : true       },
            { href: "/mapmaker",       name: "", show : true       },
            { href: "/incomplete",     name: "", show : true       },
            { href: "/lines",          name: "", show : true       },
            { href: "/triangles",      name: "", show : true       },
            { href: "/circles",        name: "", show : true       },
            { href: "/antipode",       name: "", show : true       },
            { href: "/w3w",            name: "", show : true       },
            { href: "/revwherigo",     name: "", show : true       }
          ],
        },
        {
          href: "/helptext",           name: this.$t('menu.texttools'), show : true, expand: false,
          l2: [
            { href: "/tryanswers",     name: "", show : true       },
            { href: "/wordvalue",      name: "", show : true       },
            { href: "/charcodes",      name: "", show : true       },
            { href: "/wordsearch",     name: "", show : true       },
            { href: "/analtxt",        name: "", show : true       },
            { href: "/texttonum",      name: "", show : true       },
            { href: "/keyboards",      name: "", show : true       },
            { href: "/texttoss",       name: "", show : true       },
            { href: "/numerology",     name: "", show : true       },
            { href: "/textchunks",     name: "", show : true       },
            { href: "/anagrams",       name: "", show : true       }
          ]
        },
        {
          href: "/helpcodes",          name: this.$t('menu.codes'), show : true, expand: false,
          l2: [
            { 
              href: "/ciphers",         name: "", show : true, expand: false,
              l3 : [
                // Add ciphers here in mounted ()
              ]
            },
            { href: "/rotciphers",     name: "", show : true            },
            { href: "/substcipher",    name: "", show : true            },
            { href: "/codebook",       name: "", show : true, expand: false,          
              l3 : [
                // Add codes here in mounted ()
              ]
            },
            { href: "/fonts",          name: "", show : true, expand: false,          
              l3 : [
                // Add fonts here in mounted ()
              ]
            },
            { href: "/segment",     name: "", show : true            },
            { href: "/resistor",    name: "", show : true            },
            { href: "/decabit",     name: "", show : true            },
            { href: "/freqanal",    name: "", show : true            },
          ],
        },
        {
          href: "/helpimage",          name: this.$t('menu.imagetools'), show : true, expand: false,
          l2: [
            { href: "/exifscanner",         name: "", show : true,        },
            { href: "/colorpicker",         name: "", show : true,        },
            { href: "/filltool",            name: "", show : true,        },
            { href: "/pixeldata",           name: "", show : true,        },
            { href: "/imagetransform",      name: "", show : true,        },
            { href: "/textextractor",       name: "", show : true,        }
          ]
        },
        {
          href: "/helpmath",          name: this.$t('menu.mathtools'), show : true, expand: false,
          l2: [
            {  href: "/baseconv",            name: "", show : true,        },
            {  href: "/digits",              name: "", show : true,        },
            {  href: "/primes",              name: "", show : true,        },
            {  href: "/romans",              name: "", show : true,        },
            {  href: "/fibonacci",           name: "", show : true,        },
            {  href: "/gcdandlcm",           name: "", show : true,        },
            {  href: "/formulasolver",       name: "", show : true,        },
            {  href: "/numberprop",          name: "", show : true,        },
            {  href: "/bignumbers",          name: "", show : true,        },
            {  href: "/cryptosolver",        name: "", show : true,        },
            {  href: "/sequences",           name: "", show : true,        },
            {  href: "/combinations",        name: "", show : true,        },
            {  href: "/equations",           name: "", show : true,        },
            {  href: "/palindrome",          name: "", show : true,        },
            {  href: "/nimbers",             name: "", show : true,        }
          ]
        },
        {
          href: "/helpcomp",          name: this.$t('menu.comptools'), show : true, expand: false,
          l2: [
            { href: "/bintotext",           name: "", show : true,        },
            { href: "/bcd",                 name: "", show : true,        },
            { href: "/encryption",          name: "", show : true,        },
            { href: "/hashes",              name: "", show : true,        },
            { href: "/brainfuck",           name: "", show : true,        },
            { href: "/cow",                 name: "", show : true,        },
            { href: "/beatnik",             name: "", show : true,        },
            { href: "/deadfish",            name: "", show : true,        },
            { href: "/duckspeak",           name: "", show : true,        },
            { href: "/checksum",            name: "", show : true,        },
            { href: "/truthtable",          name: "", show : true,        }
          ]
        },
        {
          href: "/helpother",          name: this.$t('menu.other'), show : true, expand: false,
          l2: [
            { href: "/printlog",            name: "", show : true,        }, 
            { href: "/htmlparser",          name: "", show : true,        },
            { href: "/sudokusolv",          name: "", show : true,        },
            { href: "/mmsolver",            name: "", show : true,        },
            { href: "/unitconvertor",       name: "", show : true,        },
            { href: "/datecalc",            name: "", show : true,        },
            { href: "/randomizer",          name: "", show : true,        },
            { href: "/periodictable",       name: "", show : true,        },
            { href: "/countries",           name: "", show : true,        },
            { href: "/usastates",           name: "", show : true,        },
            { href: "/regions",             name: "", show : true,        },
            { href: "/dnacode",             name: "", show : true,        },
            { href: "/gameoflife",          name: "", show : true,        },
            { href: "/booksearch",          name: "", show : true,        }
          ]
        }
      ],
    };
  },

  mounted: function() {
    
    this.codes = codepages;
    this.fonts = fontdefs;
    this.ciphers = ciphers;
    for (let i of this.alltools) {
      i.show = true;
      i.expand = false;
      if (i.l2) {
        for (let j of i.l2) {
          j.name = this.$t(j.href.slice(1) + ".title");
          j.show = true;
          if (j.href === "/ciphers") {
            // Add all ciphers, add idx to facilitate search
            j.expand = false;
            for (let [idx, c] of this.ciphers.entries()) {
              j.l3.push( { name : c.name, href : j.href + "/" + c.ref, show : true, idx : idx })
            }
          }
          if (j.href === "/fonts") {
            j.expand = false;
            // Add all fonts
            for (let [idx, c] of this.fonts.entries()) {
              j.l3.push( { name : c.id, href : j.href + "/" + c.id, show : true, idx : idx }) 
            }
          }
          if (j.href === "/codebook") {
            j.expand = false;
            // Add all codes
            for (let [idx, c] of this.codes.entries()) {
              j.l3.push( { name : c.name, href : j.href + "/" + c.imagename.slice(0,-4), show : true, idx : idx }) 
            }
          }
        }
      }
    }
    console.log(this.$route);
    if (this.$route.query.s) {
      this.searchstr = this.$route.query.s;
      this.goSearch();
    }
  },

  methods: {

    expandAll: function() {
      for (let l1 of this.alltools) {
        l1.expand = true;
        if (l1.l2) {
          for (let l2 of l1.l2) {
            l1.expand = true;
            if (l2.l3) {
              l2.expand = true;
            }
          }
        }
      }
    },

    collapseAll: function() {
      for (let l1 of this.alltools) {
        l1.expand = false;
        if (l1.l2) {
          for (let l2 of l1.l2) {
            l1.expand = false;
            if (l2.l3) {
              l2.expand = false;
            }
          }
        }
      }
    },

    showAll: function () {
      // Build tool list
      for (let l1 of this.alltools) {
        l1.show = true;
        if (l1.l2) {
          for (let l2 of l1.l2) {
            l2.show = true;
            l1.expand = false;
            if (l2.l3) {
              l2.expand = false;
              for (let l3 of l2.l3) {
                l3.show = true;
              }
            }
          }
        }
      }
      this.collapseAll();
    },

    goSearch: function () {

      // Reset
      this.errormsg = "";

      let s = this.searchstr.toLowerCase();
      if (s === "") return;

      // Scan info of tools
      for (let l1 of this.alltools) {

        // info = this.$t(l1.href.slice(1)+".long");
        l1.show = false;

        if (l1.l2) {

          // Search level 2
          for (let l2 of l1.l2) {

            l2.show = false;
            
            if (l2.l3) {
              // Search level 3
              for (let l3 of l2.l3) {
                switch (l2.href) {
                  case "/ciphers" :
                    l3.show = false;
                    if (this.$t('ciphers.' + this.ciphers[l3.idx].ref + '.info').toLowerCase().indexOf(s) >= 0) l3.show = true;
                    if (this.ciphers[l3.idx].name.toLowerCase().indexOf(s) >= 0) l3.show = true;
                    break;
                  case "/codebook" :
                    l3.show = false;
                    if (this.codes[l3.idx].name.toLowerCase().indexOf(s) >= 0) l3.show = true;
                    if (this.codes[l3.idx].description.toLowerCase().indexOf(s) >= 0) l3.show = true;
                    for (let t of this.codes[l3.idx].tags) {
                      if (t.toLowerCase() === s) l3.show = true;
                    }
                    break;
                  case "/fonts" :
                    l3.show = (this.fonts[l3.idx].font.toLowerCase().indexOf(s) >= 0);
                    break;
                  default :
                    l3.show = false;
                }
                if (l3.show) {
                  l2.show = true;
                  l2.expand = true;
                  l1.show = true;
                  l1.expand = true;
                }
              }
            } else {

              if (this.$t(l2.href.slice(1)+".long").toLowerCase().indexOf(s) >= 0) l2.show = true;
              if (this.$t(l2.href.slice(1)+".title").toLowerCase().indexOf(s) >= 0) l2.show = true;
              if (l2.show) {
                l1.show = true;
                l1.expand = true;
              }
            }
          } 
        }

      }
    },
  },
};

</script>

<style scoped>

.level1 {
  margin-left: 20px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.level2 {
  margin-left: 40px;
  margin-top: 3px;
  margin-bottom: 3px;
}

.level3 {
  margin-left: 60px;
  margin-top: 0px;
  margin-bottom: 0px;
}

.levelbtn {
  width: 20px;
  text-align: left;
}

</style>
