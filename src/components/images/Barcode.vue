<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('barcode.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('barcode.long')"
      />
      <!-- Form fields -->
      <!-- Selection dropdown -->
      <div class="row">
        <label
          class="form-label mb-2 sm-size"
          for="bctype"
        >{{ $t('barcode.bctype') }}</label>    
        <select
          id="bctype"
          v-model="bctype"
          class="form-select mb-2 md-size"
        >
          <optgroup label="2D">
            <option value="qrcode">QR Code</option>
            <option value="datamatrix">Data matrix</option>
            <option value="azteccode">Aztec code</option>
            <option value="pdf417">PDF417</option>
          </optgroup>
          <optgroup label="1D">
            <option value="ean13">EAN13</option>
            <option value="ean8">EAN8</option>
            <option value="upca">UPCA</option>
            <option value="upce">UPCE</option>
            <option value="isbn">ISBN</option>
            <option value="code39">CODE39</option>
            <option value="code93">CODE93</option>
            <option value="code128">CODE128</option>
            <option value="rationalizedCodabar">CODABAR</option>
            <option value="itf14">ITF14</option>
            <option value="msi">MSI</option>
            <option value="pharmacode">Pharmacode</option>
          </optgroup>
        </select>
      </div>
      <div class="row">
        <label
          class="form-label mb-2 sm-size"
          for="msg"
        >{{$t('barcode.msg')}}</label>
        <input
          id="msg"
          v-model="msg"
          type="text"
          class="form-control md-size mb-2 me-2"
        >
      </div>
      <div class="form-check">
        <input
          id="showtxt"
          v-model="showtxt"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="showtxt"
          class="form-check-label mb-2"
        >{{ $t('barcode.showtxt') }}</label>
      </div>
      <div class='row'>
        <label for='clr' class='form-label sm-size mb-2'>{{ $t('barcode.clr')}}</label>
        <input id='clr' type='color' v-model='clr' class='form-control mb-2 sm-size' />
      </div>
      <div class='row'>
        <label for='bgclr' class='form-label sm-size mb-2'>{{ $t('barcode.bgclr')}}</label>
        <input id='bgclr' type='color' v-model='bgclr' class='form-control mb-2 sm-size' />
      </div>
      <!-- Action buttons -->
      <button class="btn md-size mb-2" id="btn1" @click="generate()">{{$t('buttons.generate')}}</button>
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <div>
        <canvas id="barcode"></canvas>
      </div>
    </div>
  </div>
</template>

<script>

import bwipjs from "bwip-js";

export default {

  name: "Barcode",

  components: {
        
  },

  data() {
    return {
      errormsg: "",
      msg: "",
      num1: 0,
      bctype: "qrcode",
      showtxt: true,
      clr: "#000000",
      bgclr: "#FFFFFF"
    };
  },

  methods: {

    generate: function () {

      // Reset
      this.result = "";
      this.errormsg = "";
      let canvas = document.getElementById("barcode");

      // Generate the code
      let options = {
        bcid: this.bctype,
        text: this.msg,
        backgroundcolor: this.bgclr,
        padding: 8,
        barcolor: this.clr,
        textcolor: this.clr,
        includetext: this.showtxt
      }

      try {
        bwipjs.toCanvas(canvas, options);
      } catch (e) {
        this.errormsg = e;
      }

    },

  },
};

</script>

<style scoped>
</style>
