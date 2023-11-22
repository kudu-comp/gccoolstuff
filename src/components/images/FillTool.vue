<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('imagetools.filltool.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('imagetools.filltool.long')"
      />
      <input
        id="file"
        type="file"
        class="form-control mb-2"
        @change="selectFile"
      />
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <div class="row">
        <div
          id="preview"
          class="col-9"
        >
          <canvas
            id="canvas"
            @click="fillColor"
          />
        </div>
        <div class="col-3">
          <input
            id="restore"
            type="button"
            name="btnsearch"
            :value="$t('buttons.original')"
            class="btn me-2 mb-2"
            @click="restore"
          >
          <v-download 
            v-model:canvas ="canvas"
          />
          <div class="box">
            <div class="box-header">
              {{ $t('filltool.fill') }}
            </div>
            <div class="box-body">
              <p>{{ $t('filltool.fillinfo') }}</p>
              <div class="row mb-2">
                <label
                  class="form-label sm-size"
                  for="pick"
                >{{ $t('filltool.selfill') }}</label>
                <input id="pick" v-model="selfill" type="color" class="form-control sm-size" />
              </div>
              <div>
                <label 
                  class="form-label mr-2"
                  for="tol"
                >{{ $t('filltool.tol') }}: {{ tol }}</label>
                <vue-slider
                  v-model="tol"
                  v-bind="toloptions"
                  class="ml-2 mr-2"
                />
              </div>
            </div>
          </div>
          <div class="box">
            <div class="box-header">
              {{ $t('filltool.conbri') }}
            </div>
            <div class="box-body">
              <label
                class="form-label mr-2"
                for="brigh"
              >{{ $t('filltool.brigh') }}: {{ brigh }}</label>
              <vue-slider
                v-model="brigh"
                v-bind="controptions"
                class="ml-2 mr-2 mb-2"
              />
              <label
                class="form-label mr-2"
                for="contr"
              >{{ $t('filltool.contr') }}: {{ contr }}</label>
              <vue-slider
                v-model="contr"
                v-bind="controptions"
                class="ml-2 mr-2 mb-2"
              />
              <input
                id="conbri"
                type="button"
                :value="$t('buttons.apply')"
                class="btn mr-2 mb-2"
                @click="contrastBrightness"
              >
            </div>
          </div>
          <div class="box">
            <div class="box-header">
              {{ $t('filltool.filter') }}
            </div>
            <div class="box-body">
              <select id="filter" v-model="selfilt" class="form-select me-2 mb-2">
                <option value="0">
                  {{ $t('filltool.gray1') }}
                </option>
                <option value="1">
                  {{ $t('filltool.gray2') }}
                </option>
                <option value="2">
                  {{ $t('filltool.invert') }}
                </option>
                <option value="3">
                  {{ $t('filltool.sepia') }}
                </option>
                <option value="4">
                  {{ $t('colors.red') }}
                </option>
                <option value="5">
                  {{ $t('colors.green') }}
                </option>
                <option value="6">
                  {{ $t('colors.blue') }}
                </option>
                <option value="7">
                  {{ $t('colors.cyan') }}
                </option>
                <option value="8">
                  {{ $t('colors.magenta') }}
                </option>
                <option value="9">
                  {{ $t('colors.yellow') }}
                </option>
              </select>
              <input
                id="colfil"
                type="button"
                :value="$t('buttons.apply')"
                class="btn mb-2"
                @click="filterColor"
              >
            </div>
          </div>
          <div class="box">
            <div class="box-header">
              {{ $t('filltool.colordepth') }}
            </div>
            <div class="box-body">
              <select
                id="cdepth"
                v-model="cdepth"
                class="form-select mb-2"
              >
                <option value="0">
                  1 bits - 2 {{ $t('filltool.colors') }}
                </option>
                <option value="1">
                  3 bits - 8 {{ $t('filltool.colors') }}
                </option>
                <option value="2">
                  6 bits - 64 {{ $t('filltool.colors') }}
                </option>
                <option value="3">
                  9 bits - 512 {{ $t('filltool.colors') }}
                </option>
                <option value="4">
                  12 bits - 4k {{ $t('filltool.colors') }}
                </option>
                <option value="5">
                  15 bits - 32k {{ $t('filltool.colors') }}
                </option>
                <option value="6">
                  18 bits - 256k {{ $t('filltool.colors') }}
                </option>
              </select>
              <input
                id="coldep"
                type="button"
                :value="$t('buttons.apply')"
                class="btn mb-2"
                @click="colorDepth"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import VueSlider from 'vue-slider-component'
import VDownload from '@/components/inputs/VDownload.vue'
import '@/components/css/slidertheme.css'

export default {
  name: 'FillTool',

  components: {
    VueSlider,
    VDownload
  },

 data: function() {
    return {
      fileurl: "",
      errormsg: "",
      ctx: null,
      canvas: null,
      img: null,
      selfill: "#FF0000",
      selfilt: 0,
      tol: 5,
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

    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    // Resize canvas
    this.canvas.width = this.canvas.getBoundingClientRect().width
    this.canvas.height = this.canvas.width;

  },

  methods: {

    drawImageScaled: function (img) {

      let canvas = this.ctx.canvas ;
      let hRatio = canvas.width  / img.width    ;
      let vRatio =  canvas.height / img.height  ;
      let ratio  = Math.min ( hRatio, vRatio );
      //let centerShift_x = ( canvas.width - img.width*ratio ) / 2;
      //let centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
      let centerShift_x = 0;
      let centerShift_y = 0;
      this.ctx.clearRect(0,0,canvas.width, canvas.height);
      this.ctx.drawImage(img, 0, 0, img.width, img.height,
                         centerShift_x, centerShift_y, img.width*ratio, img.height*ratio); 

    },

    // Restore original loaded image
    restore: function () {
      this.drawImageScaled(this.img);
    },

    // Apply color filter
    filterColor: function () {

      if (this.selfilt == 2) {
        this.invertImage();
        return;
      }

      const filters = [
        [ [0.333, 0.333, 0.333], [0.333, 0.333, 0.333], [0.333, 0.333, 0.333] ], // grayscale average
        [ [0.299, 0.587, 0.114], [0.299, 0.587, 0.114], [0.299, 0.587, 0.114] ], // Gray scale luminance PAL
        [ "invert" ],    // invert not defined
        [ [0.393, 0.769, 0.189], [0.349, 0.686, 0.168], [0.272, 0.534, 0.131] ], // sepia
        [ [1,0,0], [0, 0, 0], [0, 0, 0] ],    // reds only
        [ [0,0,0], [0, 1, 0], [0, 0, 0] ],    // greens only
        [ [0,0,0], [0, 0, 0], [0, 0, 1] ],    // blues only
        [ [0,0,0], [0, 1, 0], [0, 0, 1] ],    // cyan (no red)
        [ [1,0,0], [0, 0, 0], [0, 0, 1] ],    // magenta (no green)
        [ [1,0,0], [0, 1, 0], [0, 0, 0] ],    // yellow (no blue)
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
    fillColor: function (event) {

      // Set fill color
      let r = parseInt(this.selfill.slice(1,3),16);
      let g = parseInt(this.selfill.slice(3,5),16);
      let b = parseInt(this.selfill.slice(5,7),16);

      // Get the color of the selected pixel
      let x = Math.floor(event.offsetX * this.canvas.width / this.canvas.clientWidth);
      let y = Math.floor(event.offsetY * this.canvas.height / this.canvas.clientHeight);

      let pixel = this.ctx.getImageData(x, y, 1, 1);
      let repl  = pixel.data;

      // Make a copy of the imagedata
      const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      const data = imageData.data;

      // If color to be replaced matches fill with fill color
      for (let i = 0; i < data.length; i += 4) {
        if (Math.abs(data[i]   - repl[0]) <= this.tol && 
            Math.abs(data[i+1] - repl[1]) <= this.tol && 
            Math.abs(data[i+2] - repl[2]) <= this.tol) {
          data[i] = r;
          data[i+1] = g;
          data[i+2] = b;
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
      let bwcol = 0;
      
      // Invert the image
      for (let i = 0; i < data.length; i += 4) {
        if (this.cdepth == 0) {

          // 1 bit color (black white) if avg colors < or > than 3*128
          bwcol = (data[i] + data[i+1] + data[i+2] < 384) ? 0 : 255;
          data[i] = bwcol;
          data[i+1] = bwcol;
          data[i+2] = bwcol;

        } else {

          // Colordepth defined by dividing 256 positions in depth blocks
          data[i]     = Math.min ( Math.round(data[i]   / bw) * bw, 255); // red
          data[i + 1] = Math.min ( Math.round(data[i+1] / bw) * bw, 255); // green
          data[i + 2] = Math.min ( Math.round(data[i+2] / bw) * bw, 255); // blue

        }
      }

      // Draw the new image
      this.ctx.putImageData(imageData, 0, 0);
    },

    // Triggered when the file is loaded
    selectFile: function (event) {

      // Reset error flag
      this.errormsg = "";

      // Get the input file
      let input = event.target;

      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {

        // create a new image
        this.img = new Image();
        this.img.crossOrigin = 'anonymous';
        this.img.src = URL.createObjectURL(input.files[0]);

        // Define a callback function to run, when image has errors loading
        this.img.onerror = () => {
          this.errormsg = this.$t('errors.loadingimage')        
        }

        // Define a callback function to run, when image has loaded finishes its job
        this.img.onload = () => {

            try {

              this.drawImageScaled(this.img);

            } catch(err) {

              this.errormsg = this.$t('colorpicker.error')
            
            }
        }
          
      }
    },

  }
}
</script>

<style scoped>

canvas {
  width: 100%;
  height: 100%;
}

</style>
