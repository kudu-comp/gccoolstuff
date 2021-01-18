<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('imagetools.filltool.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('filltool.info')"></div>
      <div class="form-inline">
        <input type="file" ref="file" name="file" id="file" class="form-control-file mb-2" @change="selectFile">
      </div>
      <p v-show="error" class="errormsg">{{errormsg}}</p>
      <div class="row">
        <div id="preview" class="col-9">
          <canvas id="canvas" v-bind:width="width" v-bind:height="height" @click="fillColor"></canvas>
        </div>
        <div class="col-3">
          <input type="button" id="restore" name="btnsearch" :value="$t('buttons.original')" class="btn btn-primary mr-2 mb-2" v-on:click="restore">
          <div class="box">
            <div class="box-header">{{$t('filltool.fill')}}</div>
            <div class="box-body">
              <p>{{$t('filltool.fillinfo')}}</p>
              <div class="form-inline">
                <label class="form-label mr-2" for="pick">{{$t('filltool.selfill')}}</label>
                <select id="pick" class="custom-select mr-2 mb-2" v-model="selfill">
                  <option value="0">{{$t('colors.white')}}</option>
                  <option value="1">{{$t('colors.black')}}</option>
                  <option value="2">{{$t('colors.red')}}</option>
                  <option value="3">{{$t('colors.green')}}</option>
                  <option value="4">{{$t('colors.blue')}}</option>
                  <option value="5">{{$t('colors.yellow')}}</option>
                  <option value="6">{{$t('colors.cyan')}}</option>
                  <option value="7">{{$t('colors.magenta')}}</option>
                </select>
              </div>
              <label class="form-label mr-2 mb-2" for="tol">{{$t('filltool.tol')}}: {{tol}}</label>
              <vue-slider v-model="tol" v-bind="toloptions" class="ml-2 mr-2"></vue-slider>
            </div>
          </div>
          <div class="box">
            <div class="box-header">{{$t('filltool.conbri')}}</div>
            <div class="box-body">
              <label class="form-label mr-2" for="brigh">{{$t('filltool.brigh')}}: {{brigh}}</label>
              <vue-slider v-model="brigh" v-bind="controptions" class="ml-2 mr-2 mb-2"></vue-slider>
              <label class="form-label mr-2" for="contr">{{$t('filltool.contr')}}: {{contr}}</label>
              <vue-slider v-model="contr" v-bind="controptions" class="ml-2 mr-2 mb-2"></vue-slider>
              <input type="button" id="conbri" name="conbri" :value="$t('buttons.apply')" class="btn btn-primary mr-2 mb-2" v-on:click="contrastBrightness">
            </div>
          </div>
          <div class="box">
            <div class="box-header">{{$t('filltool.filter')}}</div>
            <div class="box-body">
              <div class="form-inline">
                <select id="filter" class="custom-select mr-2 mb-2" v-model="selfilt">
                  <option value="0">{{$t('filltool.gray')}}</option>
                  <option value="1">{{$t('filltool.invert')}}</option>
                  <option value="2">{{$t('filltool.sepia')}}</option>
                  <option value="3">{{$t('colors.red')}}</option>
                  <option value="4">{{$t('colors.green')}}</option>
                  <option value="5">{{$t('colors.blue')}}</option>
                  <option value="6">{{$t('colors.cyan')}}</option>
                  <option value="7">{{$t('colors.magenta')}}</option>
                  <option value="8">{{$t('colors.yellow')}}</option>
                </select>
                <input type="button" id="filter" name="filter" :value="$t('buttons.apply')" class="btn btn-primary mb-2" v-on:click="filterColor">
              </div>
            </div>
          </div>
          <div class="box">
            <div class="box-header">{{$t('filltool.colordepth')}}</div>
            <div class="box-body">
              <div class="form-inline">
                <select id="filter" class="custom-select mr-2 mb-2" v-model="cdepth">
                  <option value="1">3 bits - 8 {{$t('filltool.colors')}}</option>
                  <option value="2">6 bits - 64 {{$t('filltool.colors')}}</option>
                  <option value="3">9 bits - 512 {{$t('filltool.colors')}}</option>
                  <option value="4">12 bits - 4k {{$t('filltool.colors')}}</option>
                  <option value="5">15 bits - 32k {{$t('filltool.colors')}}</option>
                  <option value="6">18 bits - 256k {{$t('filltool.colors')}}</option>
                </select>
                <input type="button" id="conbri" name="conbri" :value="$t('buttons.apply')" class="btn btn-primary mb-2" v-on:click="colorDepth">
              </div>
            </div>
          </div>
          <div class="box">
            <div class="box-header">{{$t('filltool.transform')}}</div>
            <div class="box-body">
              <input type="button" id="fliph" :value="$t('filltool.fliph')" class="btn btn-primary mr-2 mb-2" v-on:click="flipH">
              <input type="button" id="flipv" :value="$t('filltool.flipv')" class="btn btn-primary mr-2 mb-2" v-on:click="flipV">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import VueSlider from 'vue-slider-component'
import '@/components/css/slidertheme.css'

export default {
  name: 'ColorPicker',

  props: {
    msg: String
  },

  components: {
    VueSlider,
  },

  data: function() {
    return {
      fileurl: "",
      error: false,
      errormsg: "",
      ctx: null,
      img: null,
      width: 800,
      height: 800,
      selfill: 1,
      selfilt: 0,
      tol: 0,
      toloptions: {
        min: 0,
        max: 255,
        height: 8
      },
      brigh: 0,
      contr: 0,
      controptions: {
        min: -100,
        max: 100,
        height: 8
      },
      cdepth: 1
    }
  },

  mounted: function() {

    // Set focus on file input
    // this.$refs.file.focus();

    const canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');

    // Resize canvas
    this.resizeCanvas();

  },

  methods: {

    resizeCanvas: function () {

      // Resize canvas
      let pv = document.getElementById("preview");
      this.width = pv.offsetWidth - 10;
      
    },

    drawImageScaled: function (img) {

      let canvas = this.ctx.canvas ;
      let hRatio = canvas.width  / img.width    ;
      let vRatio =  canvas.height / img.height  ;
      let ratio  = Math.min ( hRatio, vRatio );
      let centerShift_x = ( canvas.width - img.width*ratio ) / 2;
      let centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
      this.ctx.clearRect(0,0,canvas.width, canvas.height);
      this.ctx.drawImage(img, 0, 0, img.width, img.height,
                         centerShift_x, centerShift_y, img.width*ratio, img.height*ratio); 

    },

    // Restore original loaded image
    restore: function () {
      this.drawImageScaled(this.img);
    },

    // Draw grayscale
    grayScale: function () {

      // Make a copy of the imagedata
      const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      const data = imageData.data;

      // Grayscale is average of RGB
      for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i]     = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }

      // Draw the new image
      this.ctx.putImageData(imageData, 0, 0);

    },

    // Apply color filter
    filterColor: function () {

      if (this.selfilt == 0) {
        this.grayScale();
        return;
      }

      if (this.selfilt == 1) {
        this.invertImage();
        return;
      }

      const filters = [
        ["gray"],      // grayscale not defined
        ["invert"],    // invert not defined
        [ [0.393, 0.769, 0.189], [0.349, 0.686, 0.168], [0.272, 0.534, 0.131] ], // sepia
        [ [1,0,0], [0, 0, 0], [0, 0, 0] ],    // red
        [ [0,0,0], [0, 1, 0], [0, 0, 0] ],    // green
        [ [0,0,0], [0, 0, 0], [0, 0, 1] ],    // blue
        [ [0,0,0], [0, 1, 0], [0, 0, 1] ],    // cyan
        [ [1,0,0], [0, 0, 0], [0, 0, 1] ],    // magenta
        [ [1,0,0], [0, 1, 0], [0, 0, 0] ],    // yellow
      ];

      // Set fill color
      let filter = filters[parseInt(this.selfilt)];
      
      // Make a copy of the imagedata
      const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      const data = imageData.data;

      // Apply filter to each pixel
      for (let i = 0; i < data.length; i += 4) {
        data[i]     = Math.min (Math.round(data[i]   * filter[0][0] + data[i+1] * filter[0][1]  + data[i+2] * filter[0][2]), 255); // red
        data[i + 1] = Math.min (Math.round(data[i]   * filter[1][0] + data[i+1] * filter[1][1]  + data[i+2] * filter[1][2]), 255); // green
        data[i + 2] = Math.min (Math.round(data[i]   * filter[2][0] + data[i+1] * filter[2][1]  + data[i+2] * filter[2][2]), 255); // blue
      }

      // Draw the new image
      this.ctx.putImageData(imageData, 0, 0);
    },

    // Change brightness and contrast
    contrastBrightness: function () {

      // Make a copy of the imagedata
      const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      const data = imageData.data;

      // Get contrast factor
      let f = (105 * (this.contr + 100)) / (100 * (105 - this.contr));
      let b = this.brigh * 1.27;

      // Apply filter to each pixel
      for (let i = 0; i < data.length; i += 4) {

        data[i]     = Math.max (Math.min ( Math.round( f * (data[i]   -128) + 128 + b), 255), 0); // red
        data[i+1]   = Math.max (Math.min ( Math.round( f * (data[i+1] -128) + 128 + b), 255), 0); // red
        data[i+2]   = Math.max (Math.min ( Math.round( f * (data[i+2] -128) + 128 + b), 255), 0); // red
      }

      // Draw the new image
      this.ctx.putImageData(imageData, 0, 0);

    },

    // Fill color
    fillColor: function () {

      const colors = [
        [255, 255, 255],    // white
        [0, 0, 0],          // black
        [255, 0, 0],        // red
        [0, 255, 0],        // green
        [0, 0, 255],        // blue
        [255,255,0],        // yellow
        [0,255,255],        // cyan
        [255,0,255],        // magenta
      ];

      // Set fill color
      let fill = colors[parseInt(this.selfill)];

      // Get the color of the selected pixel
      let x = event.layerX;
      let y = event.layerY;
      let pixel = this.ctx.getImageData(x, y, 1, 1);
      let repl  = pixel.data;

      // Make a copy of the imagedata
      const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      const data = imageData.data;

      // If color to be replaced matches fill with fill color
      for (let i = 0; i < data.length; i += 4) {
        if (Math.abs(data[i] - repl[0]) <= this.tol && 
            Math.abs(data[i+1] - repl[1]) <= this.tol && 
            Math.abs(data[i+2] - repl[2]) <= this.tol) {
          data[i]     = fill[0]; // red
          data[i + 1] = fill[1]; // green
          data[i + 2] = fill[2]; // blue
        }
      }

      // Draw the new image
      this.ctx.putImageData(imageData, 0, 0);
    },

    // Invert the image
    invertImage: function () {

      // Make a copy of the imagedata
      const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      const data = imageData.data;

      // Invert the image
      for (let i = 0; i < data.length; i += 4) {
        data[i]     = 255 - data[i]; // red
        data[i + 1] = 255 - data[i+1]; // green
        data[i + 2] = 255 - data[i+2]; // blue
      }

      // Draw the new image
      this.ctx.putImageData(imageData, 0, 0);
    },

    // Invert the image
    colorDepth: function () {

      // Make a copy of the imagedata
      const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      const data = imageData.data;

      // Set color bandwidth
      let bw = 2 ** (7 - this.cdepth);
      console.log(bw);

      // Invert the image
      for (let i = 0; i < data.length; i += 4) {
        data[i]     = Math.min ( Math.round(data[i]   / bw) * bw, 255); // red
        data[i + 1] = Math.min ( Math.round(data[i+1] / bw) * bw, 255); // green
        data[i + 2] = Math.min ( Math.round(data[i+2] / bw) * bw, 255); // blue
      }

      // Draw the new image
      this.ctx.putImageData(imageData, 0, 0);
    },

    flipH: function () {

      // Make a copy of the imagedata
      const width = this.ctx.canvas.width;
      const height = this.ctx.canvas.height;
      const imageData = this.ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Invert the image
      let idx1, idx2, h = 0;

      for (let r = 0; r < height; r++) {
        for (let c = 0; c < (width / 2); c++) {
          idx1 = (r * width + c) * 4;
          idx2 = ((r + 1) * width - c - 1) * 4
          h = data[idx1];    data[idx1]   = data[idx2];    data[idx2]   = h;
          h = data[idx1+1];  data[idx1+1] = data[idx2+1];  data[idx2+1] = h;
          h = data[idx1+2];  data[idx1+2] = data[idx2+2];  data[idx2+2] = h;
        }
      }

      // Draw the new image
      this.ctx.putImageData(imageData, 0, 0);
    },

    flipV: function () {

      // Make a copy of the imagedata
      const width = this.ctx.canvas.width;
      const height = this.ctx.canvas.height;
      const imageData = this.ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Invert the image
      let idx1, idx2, h = 0;

      for (let c = 0; c < width; c++) {
        for (let r = 0; r < (height / 2); r++) {
          idx1 = (r * width + c) * 4;
          idx2 = ((height - r - 1) * width + c) * 4
          h = data[idx1];    data[idx1]   = data[idx2];    data[idx2]   = h;
          h = data[idx1+1];  data[idx1+1] = data[idx2+1];  data[idx2+1] = h;
          h = data[idx1+2];  data[idx1+2] = data[idx2+2];  data[idx2+2] = h;
        }
      }

      // Draw the new image
      this.ctx.putImageData(imageData, 0, 0);
    },

    // Triggered when the file is loaded
    selectFile: function (event) {

      // Reset error flag
      this.error = false;

      // Get the input file
      let input = event.target;

      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {

        // create a new image
        this.img = new Image();
        this.img.crossOrigin = 'anonymous';
        this.img.src = URL.createObjectURL(input.files[0]);

        // Define a callback function to run, when image has loaded finishes its job
        this.img.onload = () => {

            try {

              this.drawImageScaled(this.img);

            } catch(err) {

              console.log(err);
              this.error = true;
              this.errormsg = this.$t('colorpicker.error')
            
            }
        }

      }
    },

  }
}
</script>

<style scoped>
</style>
