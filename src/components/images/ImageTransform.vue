<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('imagetools.imagetransform.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('imagetransform.info')"></div>
      <div class="form-inline">
        <input type="file" ref="file" name="file" id="file" class="form-control-file mb-2" @change="selectFile">
      </div>
      <p v-show="error" class="errormsg">{{errormsg}}</p>
      <div class="row">
        <div id="preview" class="col-9">
          <canvas id="canvas" v-bind:width="width" v-bind:height="height" @click="fillColor"></canvas>
        </div>
        <div class="col-3">
          <input type="button" id="restore" :value="$t('buttons.original')" class="btn btn-primary mr-2 mb-2" v-on:click="restore">
          <input type="button" id="undo" :value="$t('buttons.undo')" class="btn btn-primary mr-2 mb-2" v-on:click="undoEdit">
          <div class="box">
            <div class="box-header">{{$t('imagetransform.shift')}}</div>
            <div class="box-body">
              <p>{{$t('imagetransform.shiftinfo')}}</p>
              <label class="form-label mr-2" for="shiftr">{{$t('imagetransform.shiftr')}}: {{shiftr}}</label>
              <vue-slider v-model="shiftr" v-bind="controptions2" class="ml-2 mr-2 mb-2"></vue-slider>
              <input type="button" id="shiftr" name="shiftr" :value="$t('buttons.apply')" class="btn btn-primary mr-2 mb-2" v-on:click="shiftRows">
              <label class="form-label mr-2" for="shiftr">{{$t('imagetransform.shiftr')}}: {{shiftc}}</label>
              <vue-slider v-model="shiftc" v-bind="controptions2" class="ml-2 mr-2 mb-2"></vue-slider>
              <input type="button" id="shiftc" name="shiftc" :value="$t('buttons.apply')" class="btn btn-primary mr-2 mb-2" v-on:click="shiftCols">
            </div>
          </div>
          <div class="box">
            <div class="box-header">{{$t('imagetransform.fliphalf')}}</div>
            <div class="box-body">
              <p>{{$t('imagetransform.shiftinfo')}}</p>
              <label class="form-label mr-2" for="shiftr">{{$t('imagetransform.shiftr')}}: {{flipr}}</label>
              <vue-slider v-model="flipr" v-bind="controptions" class="ml-2 mr-2 mb-2"></vue-slider>
              <input type="button" id="shiftr" name="shiftr" :value="$t('buttons.apply')" class="btn btn-primary mr-2 mb-2" v-on:click="flipRows">
              <label class="form-label mr-2" for="shiftr">{{$t('imagetransform.shiftr')}}: {{flipc}}</label>
              <vue-slider v-model="flipc" v-bind="controptions" class="ml-2 mr-2 mb-2"></vue-slider>
              <input type="button" id="shiftc" name="shiftc" :value="$t('buttons.apply')" class="btn btn-primary mr-2 mb-2" v-on:click="flipCols">
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
      shiftr: 0,
      shiftc: 0,
      flipr : 1,
      flipc : 1,
      controptions: {
        min: 0,
        max: 100,
        height: 8
      },
      controptions2: {
        min: -100,
        max: 100,
        height: 8
      },
      // Position of image on canvas
      dx : 0,
      dy : 0,
      // Stack of images
      undo: []
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

      // Resize canvas called
      let pv = document.getElementById("preview");
      this.width = pv.offsetWidth - 10;
      this.heigth = pv.offsetHeigth - 10;

      // if (this.img) this.drawImageScaled(this.img);
      
    },

    drawImageScaled: function (img) {

      let canvas = this.ctx.canvas ;
      let hRatio = canvas.width  / img.width    ;
      let vRatio =  canvas.height / img.height  ;
      let ratio  = Math.min ( hRatio, vRatio );

      // Upperleft corner coordinates
      this.dx = Math.floor(( canvas.width - img.width*ratio ) / 2);
      // this.dy = Math.floor(( canvas.height - img.height*ratio ) / 2);
      this.dy = 0;
      this.dw = Math.floor(img.width*ratio);
      this.dh = Math.floor(img.height*ratio);

      // console.log('Canvas width  ' + canvas.width);
      // console.log('Canvas height ' + canvas.height);
      // console.log('Image width  ' + img.width);
      // console.log('Image height ' + img.height);
      // console.log('HRatio  ' + hRatio);
      // console.log('VRatio  ' + vRatio);
      // console.log('Dx ' + this.dx);
      // console.log('Dy ' + this.dy);
      // console.log('Dw ' + this.dw);
      // console.log('Dh ' + this.dh);

      this.ctx.clearRect(0,0,canvas.width, canvas.height);
      this.ctx.drawImage(img, 0, 0, img.width, img.height,
                         this.dx, this.dy, this.dw, this.dh); 

    },

    // Restore original loaded image
    restore: function () {
      this.drawImageScaled(this.img);
    },

    // Undo latest change
    undoEdit: function () {
      if (this.undo.length > 0) {
        console.log("Undo " + this.undo.length + "/" + this.undo[0].length);
        let imageData = this.ctx.getImageData(this.dx, this.dy, this.dw, this.dh);

        // Read only object need to use setter to copy the data back
        imageData.data.set (Array.from(this.undo.pop()));

        // Redraw the new image
        this.ctx.putImageData(imageData, this.dx, this.dy);
      }
    },

    // Shifting rows, x pixels to the right (cumulative)
    shiftRows: function () {

      // Make a copy of the imagedata
      const imageData = this.ctx.getImageData(this.dx, this.dy, this.dw, this.dh);
      const width = imageData.width;
      const height = imageData.height;
      const data = imageData.data;

      // Make a copy of the image
      const olddata = Array.from(data);
      this.undo.push(Array.from(data));

      let idx1, idx2, c2;
      let shift = this.shiftr;

      for (let r = 0; r < height; r++) {

        for (let c = 0; c < width; c++) {
          idx1 = (r * width + c) * 4;
          c2   = (c + shift) % width;
          idx2 = (r * width + c2) * 4
          data[idx2]   = olddata[idx1];
          data[idx2+1] = olddata[idx1+1];
          data[idx2+2] = olddata[idx1+2];
        }

        // Calculate shift for next row
        shift = (shift + this.shiftr + width) % width
      }

      // Draw the new image
      this.ctx.putImageData(imageData, this.dx, this.dy);

    },

    // Shifting columns, x pixels to downwards (cumulative)
    shiftCols: function () {

      // Make a copy of the imagedata
      const imageData = this.ctx.getImageData(this.dx, this.dy, this.dw, this.dh);
      const width = imageData.width;
      const height = imageData.height;
      const data = imageData.data;

      // Make a copy of the image
      const olddata = Array.from(data)

      let idx1, idx2, r2;
      let shift = this.shiftc;

      for (let c = 0; c < width; c++) {

        for (let r = 0; r < height; r++) {
          idx1 = (r * width + c) * 4;
          r2   = (r + shift) % height;
          idx2 = (r2 * width + c) * 4
          data[idx2]   = olddata[idx1];
          data[idx2+1] = olddata[idx1+1];
          data[idx2+2] = olddata[idx1+2];
        }

        // Calculate shift for next row
        shift = (shift + this.shiftc + height) % height
      }

      // Draw the new image
      this.ctx.putImageData(imageData, this.dx, this.dy);

    },

    // Flip half of the rows horizontally, flipping flipr rows at a time
    flipRows: function () {

      // Make a copy of the imagedata
      const imageData = this.ctx.getImageData(this.dx, this.dy, this.dw, this.dh);
      const width = imageData.width;
      const height = imageData.height;
      const data = imageData.data;

      let idx1, idx2, h;
      let flip = true;

      for (let r = 0; r < height; r++) {
        if ((r-1) % this.flipr == 0) flip = !flip;
        if (!flip) continue;
        for (let c = 0; c < (width / 2); c++) {
          idx1 = (r * width + c) * 4;
          idx2 = ((r + 1) * width - c - 1) * 4
          h = data[idx1];    data[idx1]   = data[idx2];    data[idx2]   = h;
          h = data[idx1+1];  data[idx1+1] = data[idx2+1];  data[idx2+1] = h;
          h = data[idx1+2];  data[idx1+2] = data[idx2+2];  data[idx2+2] = h;
        }
      }

      // Draw the new image
      this.ctx.putImageData(imageData, this.dx, this.dy);

    },

    // Flip half of the columns vertically, flipping flipc columns at a time
    flipCols: function () {

      // Make a copy of the imagedata
      const imageData = this.ctx.getImageData(this.dx, this.dy, this.dw, this.dh);
      const width = imageData.width;
      const height = imageData.height;
      const data = imageData.data;

      // Invert the image
      let idx1, idx2, h = 0;
      let flip = true;

      for (let c = 0; c < width; c++) {
        if ((c-1) % this.flipc == 0) flip = !flip;
        if (!flip) continue;
        for (let r = 0; r < (height / 2); r++) {
          idx1 = (r * width + c) * 4;
          idx2 = ((height - r - 1) * width + c) * 4
          h = data[idx1];    data[idx1]   = data[idx2];    data[idx2]   = h;
          h = data[idx1+1];  data[idx1+1] = data[idx2+1];  data[idx2+1] = h;
          h = data[idx1+2];  data[idx1+2] = data[idx2+2];  data[idx2+2] = h;
        }
      }

      // Draw the new image
      this.ctx.putImageData(imageData, this.dx, this.dy);
    },


    flipH: function () {

      // Make a copy of the imagedata
      const imageData = this.ctx.getImageData(this.dx, this.dy, this.dw, this.dh);
      const width = imageData.width;
      const height = imageData.height;
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
      this.ctx.putImageData(imageData, this.dx, this.dy);
    },

    flipV: function () {

      // Make a copy of the imagedata
      const imageData = this.ctx.getImageData(this.dx, this.dy, this.dw, this.dh);
      const width = imageData.width;
      const height = imageData.height;
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
      this.ctx.putImageData(imageData, this.dx, this.dy);
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
