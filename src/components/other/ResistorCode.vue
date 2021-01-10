<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
        <div class="text-center">  {{this.$t('menu.resistorcode')}}</div>
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('resistorcode.info')"></div>
      <div class="row" style="text-align:center">
        <div class="col-3 col-md-2 col-xl-1">{{this.$t('resistorcode.band')}} 1</div>
        <div class="col-3 col-md-2 col-xl-1">{{this.$t('resistorcode.band')}} 2</div>
        <div class="col-3 col-md-2 col-xl-1">{{this.$t('resistorcode.band')}} 3</div>
        <div class="col-3 col-md-2 col-xl-1">{{this.$t('resistorcode.mult')}}</div>
      </div>
      <div class="form-inline">
        <vd-color class="col-3 col-md-2 col-xl-1" v-model:color="band1" @change="calcResistance"></vd-color>
        <vd-color class="col-3 col-md-2 col-xl-1" v-model:color="band2" @change="calcResistance"></vd-color>
        <vd-color class="col-3 col-md-2 col-xl-1" v-model:color="band3" @change="calcResistance"></vd-color>
        <vd-color class="col-3 col-md-2 col-xl-1" v-model:color="mult" @change="calcResistance">
          <template v-slot:addcolors>
            <option value="-1" style="background-color: gold; color: black">Gold</option>
            <option value="-2" style="background-color: silver; color: black">Silver</option>
          </template>
        </vd-color>
      </div>
      <input type="button" id="calc" name="calc" :value="$t('buttons.calc')" class="btn btn-primary mb-2 mr-2" v-on:click="calcResistance">
      <p v-show="error" class="errormsg">{{errormsg}}</p>
      <div class="card card-text p-2 mb-2" v-html="result"></div>
    </div>
  </div>
</template>

<script>

import VdColor from '@/components/inputs/VdColor.vue'

export default {

  name: 'ResistorCode',

  // Prop initcipher is parameter passed by route (optional)
  props: {
    msg: String
  },

  // Data include variables to dynamically set appearnce and labels
  data: function () {
    return {
      message: "",
      translatedmessage: "",
      error: false,
      errormsg: "",
      result: this.$t('labels.result'),
      band1: 0,
      band2: 0,
      band3: 0,
      mult: 0,
    }
  },

  components: {
    VdColor
  },

  mounted: function() {
    // No actions
  },

  methods: {

    // Get elements from name
    calcResistance: function() {

      // Reset flags
      this.error = false;
      this.result = this.$t('resistorcode.res');

      let value = (parseInt(this.band1) * 100 + parseInt(this.band2) * 10 + parseInt(this.band3)) * (10 ** this.mult);

      this.result += "<br>"+ value + "Ω<br>"
      this.result += (value/1000).toFixed(4) + "kΩ<br>"
      this.result += (value/1000000).toFixed(4) + "MΩ"
    }


  },
}
</script>
