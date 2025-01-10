<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('pixelbuild.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('pixelbuild.long')"
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
          />
        </div>
        <div class="col-3">
          <button id="draw" class="btn me-2 mb-2" @click="drawPixels">
              {{ $t('buttons.show') }}
          </button>
          <v-download 
            v-model:canvas = "canvas"
          />
          <div class="box">
            <div class="box-header">
              {{ $t('pixelbuild.input') }}
            </div>
            <div class="box-body">
              <textarea
                id="message"
                v-model="message"
                ref="message"
                class="form-control"
                :placeholder="$t('labels.message')"
                rows="5"
              />
            </div>
          </div>
          <div class="box">
            <div class="box-header">
              {{ $t('pixelbuild.options') }}
            </div>
            <div class="box-body">
              <div class="row mx-1">
                <label
                  class="form-label mb-2 sm-size"
                  for="imgheight"
                >{{ $t('exifscanner.height') }}</label>
                <input
                  id="imgheight"
                  v-model="imgHeight"
                  type="number"
                  class="form-control mb-2 sm-size"
                >
              </div>
              <div class="row mx-1">
                <label
                  class="form-label mb-2 sm-size"
                  for="imgwidth"
                >{{ $t('exifscanner.width') }}</label>
                <input
                  id="imgwidth"
                  v-model="imgWidth"
                  type="number"
                  class="form-control mb-2 sm-size"
                >
              </div>
              <div class="row mx-1">                
                <table class="table table-sm table-borderless">
                  <thead>
                    <tr>
                      <th>{{ $t('labels.variable') }}</th>
                      <th>{{ $t('labels.color') }}</th>
                    </tr>
                  </thead>
                  <tr>
                    <td>
                      <input
                        id="v0"
                        v-model="vars[0]"
                        type="text"
                        class="form-control sm-size"
                      >
                    </td>
                    <td>
                      <input type="color"
                        id="c1"
                        v-model="cols[0]"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v1"
                        v-model="vars[1]"
                        type="text"
                        class="form-control sm-size"
                      >
                    </td>
                    <td>
                      <input type="color"
                        id="c2"
                        v-model="cols[1]"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v2"
                        v-model="vars[2]"
                        type="text"
                        class="form-control sm-size"
                      >
                    </td>
                    <td>
                      <input type="color"
                        id="c3"
                        v-model="cols[2]"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v3"
                        v-model="vars[3]"
                        type="text"
                        class="form-control sm-size"
                      >
                    </td>
                    <td>
                      <input type="color"
                        id="c4"
                        v-model="cols[3]"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v4"
                        v-model="vars[4]"
                        type="text"
                        class="form-control sm-size"
                      >
                    </td>
                    <td>
                      <input type="color"
                        id="c5"
                        v-model="cols[4]"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v5"
                        v-model="vars[5]"
                        type="text"
                        class="form-control sm-size"
                     >
                    </td>
                    <td>
                      <input type="color"
                        id="c6"
                        v-model="cols[5]"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v6"
                        v-model="vars[6]"
                        type="text"
                        class="form-control sm-size"
                      >
                    </td>
                    <td>
                      <input type="color"
                        id="c7"
                        v-model="cols[6]"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v7"
                        v-model="vars[7]"
                        type="text"
                        class="form-control sm-size"
                      >
                    </td>
                    <td>
                      <input type="color"
                        id="c2"
                        v-model="cols[8]"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v8"
                        v-model="vars[8]"
                        type="text"
                        class="form-control sm-size"
                      >
                    </td>
                    <td>
                      <input type="color"
                        id="c9"
                        v-model="cols[8]"
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v9"
                        v-model="vars[9]"
                        type="text"
                        class="form-control sm-size"
                      >
                    </td>
                    <td>
                      <input type="color"
                        id="c10"
                        v-model="cols[9]"
                      >
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

import VDownload from '@/components/inputs/VDownload.vue'

export default {

  name: 'PixelBuild',

  components: {
    VDownload
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
      message: ""     
    }
  },

  mounted: function() {

    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.canvas.getBoundingClientRect().width
    this.canvas.height = this.canvas.width;
    this.$refs.message.focus();

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

<style scoped>

canvas {
  width: 100%;
  height: 100%;
}

</style>