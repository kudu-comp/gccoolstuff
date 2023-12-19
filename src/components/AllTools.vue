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
          ref="searchstr"
          v-model:search="searchstr"
          @keyup.enter="goSearch"
        />
        <button id="btnsearch" class="sm-size btn mb-2 me-2" @click="goSearch" >
          <i class="fa-solid fa-search"></i>          
        </button>
      </div>
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <!-- Result area or use v-html -->
      <div v-if="result" class="resultbox" >
        {{ result }} 
      </div>
      <!-- 
        Build a list of all tools from menuitems array
        Add sublist for codepages, fonts, ciphers
      -->

      <div>

      </div>
    </div>
  </div>
</template>

<script>

import VSearch from '@/components/inputs/VSearch.vue'
import { codepages } from '@/scripts/codebook.js'
import { fontdefs} from '@/scripts/fontspecials.js'
import { ciphers} from '@/scripts/ciphers.js'
 
export default {

  name: "AllTools",

  components: {
    VSearch
  },

  data() {
    return {
      result: "",
      errormsg: "",
      searchstr: "",
      alltools: null,
      // read name and description of every record in the array
      // use name as clickable link to init codebook on the right page
      codes: null,
      // read font of every record in the array
      // use id as clickable link and to init fonts
      fonts: null,
      // read long text (maybe title) from locale of even fields
      // odd fiels contain path, use title as clickable link
      // ! means skip for search and organize for list
      menuitems: [
        '!coordinates', 'CoordTools',
        'coordinates.convert', 'CoordConvert',
        'coordinates.project', 'CoordProject',
        'coordinates.mapmaker', 'CoordMapMaker',
        'coordinates.incomplete', 'CoordIncomplete',
        'coordinates.lines', 'CoordLines',
        'coordinates.triangles', 'CoordTriangles',
        'coordinates.circles', 'CoordCircles',
        'coordinates.antipode', 'CoordAntipode',
        'coordinates.w3w', 'CoordW3W',
        'coordinates.revwherigo', 'ReverseWherigo',
        'cp', "EncoderDecoder"
      ],
      // read ref of each ciper in array
      // read cp.ref.info from locale use ref for link
      ciphers: null
    };
  },

  mounted: function() {
    
    this.codes = codepages;
    this.fonts = fontdefs;
    this.ciphers = ciphers;

    // Build tool list
    this.alltools = [];

  },

  methods: {

    goSearch: function () {

      // Reset
      this.result = "";
      this.errormsg = "Not implemented";

    },

  },
};

</script>

<style scoped>
</style>
