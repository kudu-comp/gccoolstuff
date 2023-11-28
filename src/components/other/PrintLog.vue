<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('printlog.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('printlog.long')"
      />
      <!-- Form fields -->
      <!-- Text input -->
      <div class="row">
        <div class='col-4'>
          <div class="row">
            <label for="hdr1" class="form-label mb-2 sm-size">{{ $t('printlog.header')}} 1</label>
            <input
              id="hdr1"
              class="form-control mb-2 md-size"
              type="text"
              length="20"
              v-model="hdr1"
              @change='redraw()'
            />
          </div>
          <div class="row">
            <label for="hdr2" class="form-label mb-2 sm-size">{{ $t('printlog.header')}} 2</label>
            <input
              id="hdr2"
              class="form-control mb-2 md-size"
              type="text"
              length="20"
              v-model="hdr2"
              @change='redraw()'
            />
          </div>
          <div class="row">
            <label for="hdr3" class="form-label mb-2 sm-size">{{ $t('printlog.header')}} 3</label>
            <input
              id="hdr3"
              class="form-control mb-2 md-size"
              type="text"
              length="20"
              v-model="hdr3"
              @change='redraw()'
            />
          </div>
          <div class="row">
            <label for="ncol" class="form-label sm-size mb-2">{{ $t('printlog.ncol')}}</label>
            <input
              id="ncol"
              type="number"
              v-model="ncol"
              class="form-control mb-2 sm-size"
              min="1"
              @change='redraw()'
            />
          </div>
          <div class="row">
            <label for="nlpl" class="form-label sm-size mb-2">{{ $t('printlog.lpl')}}</label>
            <input
              id="nlpl"
              type="number"
              v-model="linesperlog"
              class="form-control mb-2 sm-size"
              min="1"
              @change='redraw()'
            />
          </div>
          <div class="row">
            <label
              class="form-label mb-2 sm-size"
              for="lh"
            >{{ $t('printlog.lh') }}</label>    
            <select
              id="lh"
              v-model="lh"
              class="form-select mb-2 sm-size"
              @change='redraw()'
            >
              <option value="15">{{ $t('printlog.lh1') }}</option>
              <option value="21">{{ $t('printlog.lh2') }}</option>
              <option value="27">{{ $t('printlog.lh3') }}</option>
              <option value="33">{{ $t('printlog.lh4') }}</option>
              <option value="39">{{ $t('printlog.lh5') }}</option>
            </select>
          </div>
          <div class='row'>
            <label for='txtcol' class='form-label sm-size mb-2'>{{ $t('printlog.txtcol')}}</label>
            <input id='txtcol' type='color' v-model='txtcol' class='form-control mb-2 sm-size' @change='redraw()' />
          </div>
          <div class='row'>
            <label for='linecol' class='form-label mb-2 sm-size'>{{ $t('printlog.linecol')}}</label>
            <input id='linecol' type='color' v-model='linecol' class='form-control mb-2 sm-size' @change='redraw()' />
          </div>
          <div class='row'><h4>{{ $t('printlog.extra')}}</h4></div>
          <div class='form-check'>
            <input type='checkbox' id='showimg' class='form-check-input mb-2' v-model='showimg' @change='redraw()' />
            <label for='showimg' class='form-check-label mb-2'>{{ $t('printlog.showimg')}}</label>
          </div>
          <div class='row' v-show='showimg'>
            <label for='selfile' class='form-label mb-2'>{{ $t('printlog.selimg')}}</label>
            <input id='selfile' type='file' class='form-control mb-2' @change="selectFile"/>
          </div>
          <div class='form-check'>
            <input type='checkbox' id='showlbl' class='form-check-input mb-2' v-model='showlbl' @change='redraw()' />
            <label for='showlbl' class='form-check-label mb-2'>{{ $t('printlog.nmdttm')}}</label>
          </div>
          <div class='row' v-show='showlbl'>
            <label for='lbl1' class='form-label mb-2 sm-size'>Label 1</label>
            <input id='lbl1' type='text' class='form-control mb-2 sm-size' v-model='lbl1' @change='redraw()' />
          </div>
          <div class='row' v-show='showlbl'>
            <label for='lbl2' class='form-label mb-2 sm-size'>Label 2</label>
            <input id='lbl2' type='text' class='form-control mb-2 sm-size' v-model='lbl2' @change='redraw()' />
          </div>
          <div class='row' v-show='showlbl'>
            <label for='lbl3' class='form-label mb-2 sm-size'>Label 3</label>
            <input id='lbl3' type='text' class='form-control mb-2 sm-size' v-model='lbl3' @change='redraw()' />
          </div>
          <div class='form-check'>
            <input type='checkbox' id='showftf' class='form-check-input mb-2' v-model='showftf' @change='redraw()' />
            <label for='showftf' class='form-check-label mb-2'>{{ $t('printlog.printftf')}}</label>
          </div>
          <div class='row' v-show='showftf'>
            <label for='ftfcol' class='form-label mb-2 sm-size'>{{ $t('printlog.ftfcol')}}</label>
            <input id='ftfcol' type='color' v-model='ftfcol' class='form-control mb-2 sm-size' @change='redraw()' />
          </div>
          <div class='row'>
            <button @click="save()" class="btn sm2-size mb-2 me-2"><i class="fa-solid fa-file-pdf"></i>
              {{ $t('printlog.savepdf')}}
            </button>
            <button @click="savepng()" class="btn sm2-size mb-2"><i class="fa-solid fa-file-image"></i>
              {{ $t('printlog.savepng')}}
            </button>
          </div>
          <!-- Error message -->
          <p
            v-show="errormsg"
            class="errormsg"
          >
            {{ errormsg }}
          </p>
        </div>
        <div class='col-7 m-2 p-2' id='preview' style='background-color: #FFF;'>
          <canvas id="logCanvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { jsPDF } from "jspdf";

export default {

  name: "PrintLog",

  data() {
    return {
      ncol: 5,
      showimg: false,
      img: null,
      hdr1: "GC Name",
      hdr2: "GC Owner",
      hdr3: "Bonus info",
      width : 0,
      height: 0,
      canvas: null,
      ctx: null,
      errormsg: "",
      linesperlog: 3,
      lh: "27",
      txtcol: '#000000',
      linecol: '#000000',
      ftfcol: '#000000',
      showlbl: false,
      lbl1: this.$t('labels.name'),
      lbl2: this.$t('labels.date'),
      lbl3: this.$t('labels.time'),
      showftf: false
    };
  },

  mounted: function () {

    // get canvas and context
    this.canvas = document.getElementById("logCanvas");
    this.ctx = this.canvas.getContext("2d");
    // set widht and height = width*ratio
    this.width = 800;
    this.height = this.width * 1.55;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    // call redraw
    this.redraw();

  },


  methods: {

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
              this.redraw();
            } catch(err) {
              this.errormsg = this.$t('errors.generic')
            }
        }

      }
    },

    drawImageScaled: function (img, x, y, colwidth) {

      // If no image return
      if (!img) return 0;

      // Print image, shrink but don't enlarge
      let ratio = Math.min(colwidth  / img.width, 1);
      let xoffset = x + Math.max(0,(colwidth - img.width)/2);
      this.ctx.drawImage(img, 0, 0, img.width, img.height, xoffset, y, img.width*ratio, img.height*ratio);

      // Return space used
      return Math.floor(img.height * ratio);
    },

    redraw: function () {

      // Clean the canvas
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Set styles
      this.ctx.lineWidth = "1";
      this.ctx.setLineDash([]);
      this.ctx.strokeStyle = this.linecol;
      this.ctx.fillStyle = this.txtcol;
      this.ctx.font = "15px Helvetica";
      let margin = 4;
      let lineHeight = parseInt(this.lh);
      let headerLh = 18;

      // Draw the box
      this.ctx.beginPath();
      this.ctx.rect(1, 1, this.width-2, this.height-2);
      this.ctx.stroke();

      // Draw lines between columns
      let colWidth = Math.floor(this.width / this.ncol);
      for (let i = 1; i < this.ncol; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(i*colWidth, 0);
        this.ctx.lineTo(i*colWidth, this.height);
        this.ctx.stroke();
      }

      // Draw each column
      for (let i = 0; i < this.ncol; i++) {

        let currentY = margin;
        // Draw img at top if available
        if (this.showimg) {
          let imgSize = 
          currentY += this.drawImageScaled(this.img, i*colWidth + margin, currentY, colWidth - 2*margin);
        }

        // Draw titles centered and bold
        currentY += margin;
        this.ctx.textAlign = 'center';
        this.ctx.font = "bold 15px Helvetica";
        if (this.hdr1) {
          currentY += headerLh;
          this.ctx.fillText(this.hdr1, i*colWidth + colWidth/2, currentY, colWidth-margin);
        }
        if (this.hdr2) {
          currentY += headerLh;
          this.ctx.fillText(this.hdr2, i*colWidth + colWidth/2 + margin, currentY, colWidth-margin);
        }
        if (this.hdr3) {
          currentY += headerLh;
          this.ctx.fillText(this.hdr3, i*colWidth + colWidth/2 + margin, currentY, colWidth-margin);
        }
        this.ctx.textAlign = 'left';
        this.ctx.font = "15px Helvetica";
        currentY += margin;

        // Calculate number of logs in column
        let sizeOfLog = this.linesperlog * lineHeight + margin;
        let nlogs = Math.trunc((this.height - currentY) / sizeOfLog);

        // Draw each log area
        for (let j = 0; j < nlogs; j++) {

          // Draw solid line between logs
          this.ctx.beginPath();
          this.ctx.setLineDash([]);
          this.ctx.moveTo(i*colWidth + margin, currentY);
          this.ctx.lineTo(i*colWidth + colWidth - margin, currentY);
          this.ctx.stroke();

          // Draw dashed lines in each log
          // Print labels and podium if selected
          this.ctx.beginPath();
          this.ctx.setLineDash(['5']);
          for (let k = 0; k < this.linesperlog; k++) {
            currentY += lineHeight;
            let offset = 0;

            // Print top three
            if (k === 0 && this.showftf && j === 0 && i === 0) {
              this.ctx.fillStyle = this.ftfcol;
              this.ctx.fillText('FTF', i*colWidth + margin, currentY, Math.trunc(0.25*colWidth-margin));
              offset += Math.trunc(0.25*colWidth-margin) + margin;
              this.ctx.fillStyle = this.txtcol;
            }
            if (k === 0 && this.showftf && j === 1 && i === 0) {
              this.ctx.fillStyle = this.ftfcol;
              this.ctx.fillText('STF', i*colWidth + margin, currentY, Math.trunc(0.25*colWidth-margin));
              offset += Math.trunc(0.25*colWidth-margin) + margin;
              this.ctx.fillStyle = this.txtcol;
            }
            if (k === 0 && this.showftf && j === 2 && i === 0) {
              this.ctx.fillStyle = this.ftfcol;
              this.ctx.fillText('TTF', i*colWidth + margin, currentY, Math.trunc(0.25*colWidth-margin));
              offset += Math.trunc(0.25*colWidth-margin) + margin;
              this.ctx.fillStyle = this.txtcol;
            }

            // Print labels, use 25% of the width
            if (this.showlbl && k === 0 && this.lbl1 && (!this.showftf || j>2 || i>0)) {
              this.ctx.fillText(this.lbl1, i*colWidth + margin, currentY, Math.trunc(0.25*colWidth-margin));
              offset += Math.trunc(0.25*colWidth-margin) + margin;
            }
            if (this.showlbl && k === 1 && this.lbl2) {
              this.ctx.fillText(this.lbl2, i*colWidth + margin, currentY, Math.trunc(0.25*colWidth-margin));
              offset += Math.trunc(0.25*colWidth-margin) + margin;
            }
            if (this.showlbl && k === 2 && this.lbl3) {
              this.ctx.fillText(this.lbl3, i*colWidth + margin, currentY, Math.trunc(0.25*colWidth-margin));
              offset += Math.trunc(0.25*colWidth-margin) + margin;
            }

            // Print line
            this.ctx.moveTo(i*colWidth + offset + margin, currentY);
            this.ctx.lineTo(i*colWidth + colWidth - margin, currentY)
          }
          this.ctx.stroke();
          currentY += margin;
        }

      }

    },

    save: function () {

      // Redraw just in case
      this.redraw();

      // Save to jsPDF// Default export is a4 paper, portrait, using millimeters for units
      const doc = new jsPDF( 'p', 'mm');

      // A4 is 210 x 297 mm - leave 15mm margin)
      // So usable size is 180mm by 267mm, ratio 1.55
      const imgData = this.canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 15, 15, 180, 267);
      doc.setFontSize(7);
      doc.text('jsPDF Copyright (c) 2010-2021 James Hall, https://github.com/MrRio/jsPDF (c) 2015-2021 yWorks GmbH, https://www.yworks.com/', 10, 292)
      doc.save('gclog.pdf'); 

    },

    savepng: function() {

      // Download canvas
      const link = document.createElement('a');
      link.download = 'gclog.png';
      link.href = this.canvas.toDataURL();
      link.click();
      link.delete;

    }
  },
};

</script>

<style scoped>

canvas {
  width: 100%;
  height: 100%;
}

</style>
