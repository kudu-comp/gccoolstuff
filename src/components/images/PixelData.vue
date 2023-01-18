<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('imagetools.pixeldata.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('imagetools.pixeldata.long')"
      />
      <div class="form-inline">
        <input
          id="file"
          ref="file"
          type="file"
          name="file"
          class="form-control-file mb-2"
          @change="selectFile"
        >
      </div>
      <div class="row">
        <div class="col-6">
          <div class="form-group">
            <p>{{ $t('pixeldata.sum') }}</p>
            <input
              id="sum"
              type="button"
              name="btnsearch"
              :value="$t('buttons.sum')"
              class="btn btn-primary mr-2 mb-2"
              @click="pixelSum(img)"
            >
          </div>
          <div class="form-group">
            <p>{{ $t('pixeldata.count') }}</p>
            <div class="form-inline">
              <label
                class="form-label col-2 mb-2"
                for="red"
              >{{ $t('colors.red') }}</label>
              <input
                id="red"
                v-model="red"
                type="number"
                min="0"
                max="255"
                class="form-control mr-2 mb-2"
              >
            </div>
            <div class="form-inline">
              <label
                class="form-label col-2 mb-2"
                for="green"
              >{{ $t('colors.green') }}</label>
              <input
                id="green"
                v-model="green"
                type="number"
                min="0"
                max="255"
                class="form-control mr-2 mb-2"
              >
            </div>
            <div class="form-inline">
              <label
                class="form-label col-2 mb-2"
                for="blue"
              >{{ $t('colors.blue') }}</label>
              <input
                id="blue"
                v-model="blue"
                type="number"
                min="0"
                max="255"
                class="form-control mr-2 mb-2"
              >
            </div>
            <input
              id="restore"
              type="button"
              name="btnsearch"
              :value="$t('buttons.count')"
              class="btn btn-primary mr-2 mb-2"
              @click="pixelCount(img)"
            >
          </div>
          <p
            v-show="errormsg"
            class="errormsg"
          >
            {{ errormsg }}
          </p>
          <div
            class="card card-text p-2"
            v-html="result"
          />
        </div>
        <div
          id="preview"
          class="col-6"
        >
          <canvas
            id="canvas"
            :width="width"
            :height="height"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  name: 'PixelData',

  data: function() {
    return {
      fileurl: "",
      errormsg: "",
      ctx: null,
      img: null,
      width: 400,
      height: 400,
      red: 0,
      green: 0,
      blue: 0,
      result: this.$t('labels.result')
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

    // Draw the previewed image
    drawImageScaled: function (img) {

      let canvas = this.ctx.canvas ;
      let hRatio = canvas.width  / img.width    ;
      let vRatio =  canvas.height / img.height  ;
      let ratio  = Math.min ( hRatio, vRatio );
      let centerShift_x = ( canvas.width - img.width*ratio ) / 2;
      // let centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
      let centerShift_y = 0;
      this.ctx.clearRect(0,0,canvas.width, canvas.height);
      this.ctx.drawImage(img, 0, 0, img.width, img.height,
                         centerShift_x, centerShift_y, img.width*ratio, img.height*ratio); 

    },

    // Print header for result
    printHeader: function () {
      this.result = this.$t('exifscanner.width') + ": " + this.img.width + "<br>";
      this.result += this.$t('exifscanner.height') + ": " + this.img.height + "<br>";
      this.result += this.$t('exifscanner.npixels') + ": " + this.img.width * this.img.height + "<br><br>";
    },

    // Get the pixel data
    pixelSum: function (img) {

      // Create a canvas the size of the image in memory 
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      let context = canvas.getContext('2d');
      context.drawImage(img, 0, 0, img.width, img.height);

      let r = 0;
      let g = 0;
      let b = 0;
      
      // Make a copy of the imagedata
      let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Get the sum of RGB values
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];      // red
        g += data[i + 1];  // green
        b += data[i + 2];  // blue
      }

      this.printHeader();
      this.result += this.$t('labels.sum') + " " + this.$t('colors.red') + ": " + r + "<br>"
      this.result += this.$t('labels.sum') + " " + this.$t('colors.green') + ": " + g + "<br>"
      this.result += this.$t('labels.sum') + " " + this.$t('colors.blue') + ": " + b;

    },

    // Get the pixel data
    pixelCount: function (img) {

      // Create a canvas the size of the image in memory 
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      let context = canvas.getContext('2d');
      context.drawImage(img, 0, 0, img.width, img.height);

      // Make a copy of the imagedata
      let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let count = 0;
      // Get the sum of RGB values
      // console.log( this.red);
      // console.log( this.green);
      // console.log( this.blue);
      // console.log( data.length);

      for (let i = 0; i < data.length; i += 4) {
        if ( (data[i] == this.red) && (data[i+1] == this.green) && (data[i+2] == this.blue) ) {
          count++;
          // console.log(i);
        }
      }

      this.printHeader();
      this.result += this.$t('labels.count') + " " + this.$t('colors.red') + "/"
      this.result += this.$t('colors.green') + "/" + this.$t('colors.blue') + ":" + count

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
              this.printHeader();

            } catch(err) {

              console.log(err);
              this.errormsg = this.$t('errors.generic')
            
            }
        }

      }
    },

  }
}
</script>

<style scoped>
</style>
