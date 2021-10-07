<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('imagetools.pixelbuild.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('imagetools.pixelbuild.long')"></div>
      <p v-show="errormsg" class="errormsg">{{errormsg}}</p>
      <div class="row">
        <div id="preview" class="col-9">
          <canvas id="canvas" v-bind:width="width" v-bind:height="height"></canvas>
        </div>
        <div class="col-3">
          <input type="button" id="draw" name="draw" :value="$t('buttons.show')" class="btn btn-primary mr-2 mb-2" v-on:click="drawPixels">
          <div class="box">
            <div class="box-header">{{$t('pixelbuild.input')}}</div>
            <div class="box-body">
              <textarea id="message" class="form-control" ref="message" :placeholder="$t('labels.message')" rows=10 cols=50 v-model='message'></textarea>
            </div>
          </div>
          <div class="box">
            <div class="box-header">{{$t('pixelbuild.options')}}</div>
            <div class="box-body">
              <div class="form-inline">
                <label class="form-label mb-2 mr-2" for="imgheight">{{$t('exifscanner.height')}}</label>
                <input type='number' id="imgheight" ref="imgheight" v-model="imgHeight" class="form-control mb-2">
              </div>
              <div class="form-inline">
                <label class="form-label mb-2 mr-2" for="imgwidth">{{$t('exifscanner.width')}}</label>
                <input type='number' id="imgwidth" ref="imgwidth" v-model="imgWidth" class="form-control mb-2">
              </div>
              <div class="form-inline">                
                <table class='table table-sm table-borderless'>
                  <thead><tr>
                    <th>{{$t('labels.variable')}}</th>
                    <th>{{$t('labels.color')}}</th>
                  </tr></thead>
                  <tr>
                    <td><input type='text' id="v0" v-model="vars[0]" class="form-control" size="1"></td>
                    <td>
                      <select id="c0" class="custom-select" v-model='cols[0]'>
                        <option v-for="c in coloptions" :key="c.value" :value="c.value">{{c.label}}</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td><input type='text' id="v1" v-model="vars[1]" class="form-control" size="1"></td>
                    <td>
                      <select id="c1" class="custom-select" v-model='cols[1]'>
                        <option v-for="c in coloptions" :key="c.value" :value="c.value">{{c.label}}</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td><input type='text' id="v2" v-model="vars[2]" class="form-control" size="1"></td>
                    <td>
                      <select id="c2" class="custom-select" v-model='cols[2]'>
                        <option v-for="c in coloptions" :key="c.value" :value="c.value">{{c.label}}</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td><input type='text' id="v3" v-model="vars[3]" class="form-control" size="1"></td>
                    <td>
                      <select id="c3" class="custom-select" v-model='cols[3]'>
                        <option v-for="c in coloptions" :key="c.value" :value="c.value">{{c.label}}</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td><input type='text' id="v4" v-model="vars[4]" class="form-control" size="1"></td>
                    <td>
                      <select id="c4" class="custom-select" v-model='cols[4]'>
                        <option v-for="c in coloptions" :key="c.value" :value="c.value">{{c.label}}</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td><input type='text' id="v5" v-model="vars[5]" class="form-control" size="1"></td>
                    <td>
                      <select id="c5" class="custom-select" v-model='cols[5]'>
                        <option v-for="c in coloptions" :key="c.value" :value="c.value">{{c.label}}</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td><input type='text' id="v6" v-model="vars[6]" class="form-control" size="1"></td>
                    <td>
                      <select id="c6" class="custom-select" v-model='cols[6]'>
                        <option v-for="c in coloptions" :key="c.value" :value="c.value">{{c.label}}</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td><input type='text' id="v7" v-model="vars[7]" class="form-control" size="1"></td>
                    <td>
                      <select id="c7" class="custom-select" v-model='cols[7]'>
                        <option v-for="c in coloptions" :key="c.value" :value="c.value">{{c.label}}</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td><input type='text' id="v8" v-model="vars[8]" class="form-control" size="1"></td>
                    <td>
                      <select id="c8" class="custom-select" v-model='cols[8]'>
                        <option v-for="c in coloptions" :key="c.value" :value="c.value">{{c.label}}</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td><input type='text' id="v9" v-model="vars[9]" class="form-control" size="1"></td>
                    <td>
                      <select id="c9" class="custom-select" v-model='cols[9]'>
                        <option v-for="c in coloptions" :key="c.value" :value="c.value">{{c.label}}</option>
                      </select>
                    </td>
                  </tr>
                </table> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  name: 'PixelBuild',

  props: {
    msg: String
  },

  data: function() {
    return {
      errormsg: "",
      canvas: null,
      ctx: null,
      width: 800,
      height: 800,
      img: null,
      imgHeight: null,
      imgWidth: null,
      vars: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],      
      cols: ["#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#888888", "#444444"],
      coloptions: [
        { value: "#FFFFFF", label : this.$t('colors.white') },
        { value: "#000000", label : this.$t('colors.black') },
        { value: "#FF0000", label : this.$t('colors.red') },
        { value: "#00FF00", label : this.$t('colors.green') },
        { value: "#0000FF", label : this.$t('colors.blue') },
        { value: "#FFFF00", label : this.$t('colors.yellow') },
        { value: "#FF00FF", label : this.$t('colors.cyan') },
        { value: "#00FFFF", label : this.$t('colors.magenta') },
        { value: "#888888", label : this.$t('colors.grey') },
        { value: "#444444", label : this.$t('colors.darkgrey') }
      ],
      message: ""     
    }
  },

  mounted: function() {

    // Set focus on file input
    this.$refs.message.focus();

    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    let pv = document.getElementById("preview");
    this.width = pv.offsetWidth - 10;
    this.height = this.width;

  },

  methods: {

    drawPixels: function () {

      let lines = this.message.split(/\n/g)
      
      // Number of rectangels to draw
      let h, w;
      if (this.imgHeight) {
        h = this.imgHeight
      } else {
        h = lines.length;
      }
      if (this.imgWidth) {
        w = this.imgWidth
      } else {
        w = lines[0].length
      }

      // Size of a rectangle
      let rectHeight = Math.trunc(this.canvas.height / h);
      let rectWidth = Math.trunc(this.canvas.width / w);

      // Draw rectangles
      for (let r = 0; r < h; r++) {
        for (let c = 0; c < w; c++) {
          this.ctx.fillStyle = "rgba(0,0,0,0)";
          for (let i = 0; i < 10; i++)
            if (lines[r][c] == this.vars[i]) this.ctx.fillStyle = this.cols[i];
          this.ctx.fillRect(c*rectWidth+5, r*rectHeight, rectWidth, rectHeight)
        }
      }

    },


  }
}
</script>
