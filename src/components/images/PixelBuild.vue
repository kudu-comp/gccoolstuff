<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('imagetools.pixelbuild.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('imagetools.pixelbuild.long')"
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
            :width="width"
            :height="height"
          />
        </div>
        <div class="col-3">
          <input
            id="draw"
            type="button"
            name="draw"
            :value="$t('buttons.show')"
            class="btn btn-primary mr-2 mb-2"
            @click="drawPixels"
          >
          <v-download 
            v-model:canvas ="canvas"
          />
          <div class="box">
            <div class="box-header">
              {{ $t('pixelbuild.input') }}
            </div>
            <div class="box-body">
              <textarea
                id="message"
                ref="message"
                v-model="message"
                class="form-control"
                :placeholder="$t('labels.message')"
                rows="10"
                cols="50"
              />
            </div>
          </div>
          <div class="box">
            <div class="box-header">
              {{ $t('pixelbuild.options') }}
            </div>
            <div class="box-body">
              <div class="form-inline">
                <label
                  class="form-label mb-2 mr-2"
                  for="imgheight"
                >{{ $t('exifscanner.height') }}</label>
                <input
                  id="imgheight"
                  ref="imgheight"
                  v-model="imgHeight"
                  type="number"
                  class="form-control mb-2"
                >
              </div>
              <div class="form-inline">
                <label
                  class="form-label mb-2 mr-2"
                  for="imgwidth"
                >{{ $t('exifscanner.width') }}</label>
                <input
                  id="imgwidth"
                  ref="imgwidth"
                  v-model="imgWidth"
                  type="number"
                  class="form-control mb-2"
                >
              </div>
              <div class="form-inline">                
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
                        class="form-control"
                        size="1"
                      >
                    </td>
                    <td>
                      <select
                        id="c0"
                        v-model="cols[0]"
                        class="custom-select"
                      >
                        <option
                          v-for="c in coloptions"
                          :key="c.value"
                          :value="c.value"
                        >
                          {{ c.label }}
                        </option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v1"
                        v-model="vars[1]"
                        type="text"
                        class="form-control"
                        size="1"
                      >
                    </td>
                    <td>
                      <select
                        id="c1"
                        v-model="cols[1]"
                        class="custom-select"
                      >
                        <option
                          v-for="c in coloptions"
                          :key="c.value"
                          :value="c.value"
                        >
                          {{ c.label }}
                        </option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v2"
                        v-model="vars[2]"
                        type="text"
                        class="form-control"
                        size="1"
                      >
                    </td>
                    <td>
                      <select
                        id="c2"
                        v-model="cols[2]"
                        class="custom-select"
                      >
                        <option
                          v-for="c in coloptions"
                          :key="c.value"
                          :value="c.value"
                        >
                          {{ c.label }}
                        </option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v3"
                        v-model="vars[3]"
                        type="text"
                        class="form-control"
                        size="1"
                      >
                    </td>
                    <td>
                      <select
                        id="c3"
                        v-model="cols[3]"
                        class="custom-select"
                      >
                        <option
                          v-for="c in coloptions"
                          :key="c.value"
                          :value="c.value"
                        >
                          {{ c.label }}
                        </option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v4"
                        v-model="vars[4]"
                        type="text"
                        class="form-control"
                        size="1"
                      >
                    </td>
                    <td>
                      <select
                        id="c4"
                        v-model="cols[4]"
                        class="custom-select"
                      >
                        <option
                          v-for="c in coloptions"
                          :key="c.value"
                          :value="c.value"
                        >
                          {{ c.label }}
                        </option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v5"
                        v-model="vars[5]"
                        type="text"
                        class="form-control"
                        size="1"
                      >
                    </td>
                    <td>
                      <select
                        id="c5"
                        v-model="cols[5]"
                        class="custom-select"
                      >
                        <option
                          v-for="c in coloptions"
                          :key="c.value"
                          :value="c.value"
                        >
                          {{ c.label }}
                        </option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v6"
                        v-model="vars[6]"
                        type="text"
                        class="form-control"
                        size="1"
                      >
                    </td>
                    <td>
                      <select
                        id="c6"
                        v-model="cols[6]"
                        class="custom-select"
                      >
                        <option
                          v-for="c in coloptions"
                          :key="c.value"
                          :value="c.value"
                        >
                          {{ c.label }}
                        </option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v7"
                        v-model="vars[7]"
                        type="text"
                        class="form-control"
                        size="1"
                      >
                    </td>
                    <td>
                      <select
                        id="c7"
                        v-model="cols[7]"
                        class="custom-select"
                      >
                        <option
                          v-for="c in coloptions"
                          :key="c.value"
                          :value="c.value"
                        >
                          {{ c.label }}
                        </option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v8"
                        v-model="vars[8]"
                        type="text"
                        class="form-control"
                        size="1"
                      >
                    </td>
                    <td>
                      <select
                        id="c8"
                        v-model="cols[8]"
                        class="custom-select"
                      >
                        <option
                          v-for="c in coloptions"
                          :key="c.value"
                          :value="c.value"
                        >
                          {{ c.label }}
                        </option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        id="v9"
                        v-model="vars[9]"
                        type="text"
                        class="form-control"
                        size="1"
                      >
                    </td>
                    <td>
                      <select
                        id="c9"
                        v-model="cols[9]"
                        class="custom-select"
                      >
                        <option
                          v-for="c in coloptions"
                          :key="c.value"
                          :value="c.value"
                        >
                          {{ c.label }}
                        </option>
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
