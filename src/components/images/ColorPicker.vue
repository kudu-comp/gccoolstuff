<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('colorpicker.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('colorpicker.long')"
      />
      <input
        id="file"
        type="file"
        ref="file"
        class="form-control mb-2"
        @change="selectFile"
      >
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
            @click="selColor"
          />
        </div>
        <div class="col-3">
          <table class="table table-sm table-borderless">
            <tr>
              <td colspan="2" class="subhead" >
                {{ $t('colorpicker.selcolor') }}
              </td>
            </tr>
            <tr>
              <td
                id="selcolor"
                colspan="2"
                style="height: 50px"
              />
            </tr>
            <tr>
              <td
                colspan="2"
                class="subhead"
              >
                {{ $t('colorpicker.rgbval') }}
              </td>
            </tr>
            <tr><td>{{ $t('colors.red') }}</td><td>{{ slr }}</td></tr>
            <tr><td>{{ $t('colors.green') }}</td><td>{{ slg }}</td></tr>
            <tr><td>{{ $t('colors.blue') }}</td><td>{{ slb }}</td></tr>
            <tr><td>{{ $t('colorpicker.alpha') }}</td><td>{{ sla }}</td></tr>
            <tr>
              <td
                colspan="2"
                class="subhead"
              >
                {{ $t('colorpicker.hexval') }}
              </td>
            </tr>
            <tr><td>{{ $t('colorpicker.hex') }}</td><td>{{ slx }}</td></tr>
            <tr>
              <td
                colspan="2"
                class="subhead"
              >
                {{ $t('colorpicker.hslval') }}
              </td>
            </tr>
            <tr><td>{{ $t('colorpicker.hue') }}</td><td>{{ hue }}</td></tr>
            <tr><td>{{ $t('colorpicker.sat') }}</td><td>{{ sat }}</td></tr>
            <tr><td>{{ $t('colorpicker.lum') }}</td><td>{{ lum }}</td></tr>
            <tr>
              <td
                colspan="2"
                class="subhead"
              >
                {{ $t('colorpicker.hsvval') }}
              </td>
            </tr>
            <tr><td>{{ $t('colorpicker.hue') }}</td><td>{{ hue2 }}</td></tr>
            <tr><td>{{ $t('colorpicker.sat') }}</td><td>{{ sat2 }}</td></tr>
            <tr><td>{{ $t('colorpicker.bri') }}</td><td>{{ bri }}</td></tr>
            <tr>
              <td
                colspan="2"
                class="subhead"
              >
                {{ $t('colorpicker.cmykval') }}
              </td>
            </tr>
            <tr><td>{{ $t('colors.cyan') }}</td><td>{{ c }}</td></tr>
            <tr><td>{{ $t('colors.magenta') }}</td><td>{{ m }}</td></tr>
            <tr><td>{{ $t('colors.yellow') }}</td><td>{{ y }}</td></tr>
            <tr><td>{{ $t('colors.black') }}</td><td>{{ k }}</td></tr>
            <tr>
              <td
                colspan="2"
                class="subhead"
              >
                {{ $t('colorpicker.cmyval') }}
              </td>
            </tr>
            <tr><td>{{ $t('colors.cyan') }}</td><td>{{ c2 }}</td></tr>
            <tr><td>{{ $t('colors.magenta') }}</td><td>{{ m2 }}</td></tr>
            <tr><td>{{ $t('colors.yellow') }}</td><td>{{ y2 }}</td></tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ColorPicker',

  data: function() {
    return {
      fileurl: "",
      errormsg: "",
      ctx: null,
      img: null,
      slr: 0, 
      slg: 0, 
      slb: 0, 
      sla: 0,
      slx: "#",
      hue: 0,
      sat: 0,
      lum: 0,
      hue2: 0,
      sat2: 0,
      bri: 0,
      c: 0,
      m: 0,
      y: 0,
      k: 0,
      c2: 0,
      m2: 0,
      y2: 0
    }
  },

  mounted: function() {

    // Set focus on file input
    this.$refs.file.focus();

    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.canvas.getBoundingClientRect().width
    this.canvas.height = this.canvas.width;

  },

  methods: {

    rgbToHsl: function (r, g, b) {

      // Source https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/

      let rf = r / 255;
      let gf = g / 255;
      let bf = b / 255;
      let min = Math.min(rf, gf, bf);
      let max = Math.max(rf, gf, bf);

      let l = Math.round((max + min) / 2 * 100)
      let s = 0;
      let h = 0;

      if (min == max) {

        // Min == max there is no saturation
        s = 0;
        h = 0;

      } else {

        // Min != max, so there is saturation
        
        if (l <= 50) {
          s = (max-min)/(max+min)
        } else {
          s = (max-min)/(2.0-max-min)
        }
        s = Math.round(s*100);

        if (rf == max) h = (gf - bf)/(max - min);
        if (gf == max) h = 2.0 + (bf - rf)/(max-min);
        if (bf == max) h = 4.0 + (rf - gf)/(max-min);
        h = h * 60;
        h = Math.round(h);
        if (h < 0) h += 360;

      }

      return {
        h: h,
        s: s,
        l: l
      }

    },

    rgbToHsv: function (r, g, b) {

      // Source https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/

      let rf = r / 255;
      let gf = g / 255;
      let bf = b / 255;
      let min = Math.min(rf, gf, bf);
      let max = Math.max(rf, gf, bf);

      let s = 0;
      let h = 0;

      if (min == max) {

        // Min == max there is no saturation
        s = 0;
        h = 0;

      } else {

        // Min != max, so there is saturation
        
        s = (max-min)/max;
        s = Math.round(s*100);

        if (rf == max) h = (gf - bf)/(max - min);
        if (gf == max) h = 2.0 + (bf - rf)/(max-min);
        if (bf == max) h = 4.0 + (rf - gf)/(max-min);
        h = h * 60;
        h = Math.round(h);
        if (h < 0) h += 360;

      }

      return {
        h: h,
        s: s,
        v: Math.round(max*100)
      }

    },

     rgbToCmy: function (r, g, b) {

      let rf = r/255;
      let gf = g/255;
      let bf = b/255;

      this.c2 = Math.round( (1 - rf) * 100) + "%";
      this.m2 = Math.round( (1 - gf) * 100) + "%";
      this.y2 = Math.round( (1 - bf) * 100) + "%";

    },

    rgbToCmyk: function (r, g, b) {

      let rf = r/255;
      let gf = g/255;
      let bf = b/255;
      let k = 1 - Math.max(rf,gf,bf);

      this.c = Math.round( (1 - rf - k) / (1 - k) * 100) + "%";
      this.m = Math.round( (1 - gf - k) / (1 - k) * 100) + "%";
      this.y = Math.round( (1 - bf - k) / (1 - k) * 100) + "%";
      this.k = Math.round( k * 100) + "%";

    },

    selColor: function (event) {

      // x and y are in CSS pixels, but the canvas still has the original drawing size
      // (unless we would implement resize drawing)
      // Read https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html

      let x = Math.floor(event.offsetX * this.canvas.width / this.canvas.clientWidth);
      let y = Math.floor(event.offsetY * this.canvas.height / this.canvas.clientHeight);

      let pixel = this.ctx.getImageData(x, y, 1, 1);
      let data = pixel.data;
      let destination = document.getElementById('selcolor');

      // Set color in table
      const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
      destination.style.background = rgba;

      // RGB values
      this.slr = data[0];
      this.slg = data[1];
      this.slb = data[2];
      this.sla = (data[3]/255).toFixed(4);

      // RGB value as hex
      this.slx = "#"+ data[0].toString(16).padStart(2,'0') + data[1].toString(16).padStart(2,'0') + data[2].toString(16).padStart(2,'0');

      // HSL values
      let hsl = this.rgbToHsl (data[0], data[1], data[2]);
      this.hue = hsl.h;
      this.sat = hsl.s + "%";
      this.lum = hsl.l + "%";
      
      // HSV values
      let hsv = this.rgbToHsv (data[0], data[1], data[2]);
      this.hue2 = hsv.h;
      this.sat2 = hsv.s + "%";
      this.bri  = hsv.v + "%";

      // CMYK values
      this.rgbToCmyk (data[0], data[1], data[2]);
      this.rgbToCmy (data[0], data[1], data[2]);
      
    },

    drawImageScaled: function (img) {

      let canvas = this.ctx.canvas ;
      let hRatio = canvas.width  / img.width    ;
      let vRatio =  canvas.height / img.height  ;
      let ratio  = Math.min ( hRatio, vRatio );
      // let centerShift_x = ( canvas.width - img.width*ratio ) / 2;
      let centerShift_x = 0;
      // let centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
      let centerShift_y = 0;
      this.ctx.clearRect(0,0,canvas.width, canvas.height);
      this.ctx.drawImage(img, 0, 0, img.width, img.height,
                         centerShift_x, centerShift_y, img.width*ratio, img.height*ratio); 

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


.subhead {
  font-weight: bold;
}

canvas {
  width: 100%;
  height: 100%;
}

</style>
