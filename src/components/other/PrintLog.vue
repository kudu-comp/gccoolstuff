<template>

  <header class="page-header">
    <h1>{{ t('printlog.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('printlog.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
          <label>{{ t('printlog.header') }} 1</label>
          <input type="text" v-model="hdr1">
        </div>        
        <div class="form-horizontal">
          <label>{{ t('printlog.header') }} 2</label>
          <input type="text" v-model="hdr2">
        </div>        
        <div class="form-horizontal">
          <label>{{ t('printlog.header') }} 3</label>
          <input type="text" v-model="hdr3">
        </div>        
        <div class="form-horizontal">
          <label>{{ t('printlog.ncol') }}</label>
          <input type="number" v-model="ncol">
        </div>
        <div class="form-horizontal">
          <label>{{ t('printlog.lpl') }}</label>
          <input type="number" v-model="linesperlog">
        </div>
        <div class="form-horizontal">
          <CustomDropdown
            :title = "t('printlog.lh')"
            :options = lhOpt
            v-model = lh
          />
        </div>
        <div class="form-horizontal">
          <label>{{ t('printlog.hdrcol') }}</label>
          <input type="color" v-model="hdrcol">
        </div>
        <div class="form-horizontal">
          <label>{{ t('printlog.txtcol') }}</label>
          <input type="color" v-model="txtcol">
        </div>
        <div class="form-horizontal">
          <label>{{ t('printlog.linecol') }}</label>
          <input type="color" v-model="linecol">
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="nolines">
          <span class="checkmark"></span>
          {{ t('printlog.nolines') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="showimg">
          <span class="checkmark"></span>
          {{ t('printlog.showimg') }}
        </label>
        <div v-if="showimg" class="form-horizontal">
          <label>{{ t('printlog.selimg') }}</label>
          <input type="file" @change="selectFile">
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="showlbl">
          <span class="checkmark"></span>
          {{ t('printlog.nmdttm') }}
        </label>
        <div v-if = 'showlbl' class="form-horizontal">
          <label>Label 1</label>
          <input type="text" v-model="lbl1">
        </div>
        <div v-if = 'showlbl' class="form-horizontal">
          <label>Label 2</label>
          <input type="text" v-model="lbl2">
        </div>
        <div v-if = 'showlbl' class="form-horizontal">
          <label>Label 3</label>
          <input type="text" v-model="lbl3">
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="showftf">
          <span class="checkmark"></span>
          {{ t('printlog.printftf') }}
        </label>
        <div v-if="showftf" class="form-horizontal">
          <label>{{ t('printlog.ftfcol') }}</label>
          <input type="color" v-model="ftfcol">
        </div>
        <div class="button-row mt-2">
          <button class="btn btn-primary" @click="save">
            {{ t('printlog.savepdf')}}
          </button>
          <button class="btn btn-primary" @click="savepng">
            {{ t('printlog.savepng')}}
          </button>
        </div>
        <p
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
        </p>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard title="Preview">
        <canvas ref="canvasRef"></canvas>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { jsPDF } from "jspdf";
import VCard from '@/components/generic/VCard.vue';
import CustomDropdown from '@/components/generic/CustomDropdown.vue'

defineOptions({
  name: "PrintLog"
});

const { t } = useI18n();

// --- Template Refs ---
const canvasRef = ref(null);
const hdr1Input = ref(null);

// --- State ---
const ncol = ref(5);
const showimg = ref(false);
const img = shallowRef(null);
const hdr1 = ref("GC Name");
const hdr2 = ref("GC Owner");
const hdr3 = ref("Bonus info");
const width = ref(800);
const height = ref(800 * 1.55);
const errormsg = ref("");
const linesperlog = ref(3);
const lh = ref(27);
const hdrcol = ref("#000000");
const txtcol = ref("#000000");
const linecol = ref("#000000");
const ftfcol = ref("#000000");
const showlbl = ref(false);
const lbl1 = ref(t('labels.name'));
const lbl2 = ref(t('labels.date'));
const lbl3 = ref(t('labels.time'));
const showftf = ref(false);
const nolines = ref(false);

const lhOpt = [
  { value : 15, label : t('printlog.lh1')},
  { value : 21, label : t('printlog.lh2')},
  { value : 27, label : t('printlog.lh3')},
  { value : 33, label : t('printlog.lh4')},
  { value : 39, label : t('printlog.lh5')},
]

// Non-reactive context
let ctx = null;

// --- Logic Methods ---

const drawImageScaled = (image, x, y, colwidth) => {
  if (!image) return 0;
  // Print image, shrink but don't enlarge
  const ratio = Math.min(colwidth / image.width, 1);
  const xoffset = x + Math.max(0, (colwidth - image.width * ratio) / 2);
  
  ctx.drawImage(
    image, 
    0, 0, image.width, image.height, 
    xoffset, y, image.width * ratio, image.height * ratio
  );

  return Math.floor(image.height * ratio);
};

const redraw = () => {
  if (!canvasRef.value || !ctx) return;

  // Clean the canvas
  ctx.clearRect(0, 0, width.value, height.value);

  // Set styles
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.strokeStyle = linecol.value;
  ctx.fillStyle = txtcol.value;
  ctx.font = "15px Helvetica";

  const margin = 4;
  const lineHeight = parseInt(lh.value);
  const headerLh = 18;

  // Draw the border box
  if (!nolines.value) {
    ctx.beginPath();
    ctx.rect(1, 1, width.value - 2, height.value - 2);
    ctx.stroke();
  }

  // Draw lines between columns
  const colWidth = Math.floor(width.value / ncol.value);
  if (!nolines.value) {
    for (let i = 1; i < ncol.value; i++) {
      ctx.beginPath();
      ctx.moveTo(i * colWidth, 0);
      ctx.lineTo(i * colWidth, height.value);
      ctx.stroke();
    }
  }

  // Draw each column
  for (let i = 0; i < ncol.value; i++) {
    let currentY = margin;

    // Draw img at top if available
    if (showimg.value && img.value) {
      currentY += drawImageScaled(img.value, i * colWidth + margin, currentY, colWidth - 2 * margin);
    }

    // Draw titles centered and bold
    currentY += margin;
    ctx.textAlign = 'center';
    ctx.font = "bold 15px Helvetica";
    ctx.fillStyle = hdrcol.value;

    if (hdr1.value) {
      currentY += headerLh;
      ctx.fillText(hdr1.value, i * colWidth + colWidth / 2, currentY, colWidth - margin);
    }
    if (hdr2.value) {
      currentY += headerLh;
      ctx.fillText(hdr2.value, i * colWidth + colWidth / 2, currentY, colWidth - margin);
    }
    if (hdr3.value) {
      currentY += headerLh;
      ctx.fillText(hdr3.value, i * colWidth + colWidth / 2, currentY, colWidth - margin);
    }

    ctx.textAlign = 'left';
    ctx.font = "15px Helvetica";
    ctx.fillStyle = txtcol.value;
    currentY += margin;

    // Calculate number of logs in column
    const sizeOfLog = linesperlog.value * lineHeight + margin;
    const nlogs = Math.trunc((height.value - currentY) / sizeOfLog);

    // Draw each log area
    for (let j = 0; j < nlogs; j++) {
      // Draw solid line between logs
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.moveTo(i * colWidth + margin, currentY);
      ctx.lineTo(i * colWidth + colWidth - margin, currentY);
      ctx.stroke();

      // Draw dashed lines in each log
      ctx.beginPath();
      ctx.setLineDash([5]);
      for (let k = 0; k < linesperlog.value; k++) {
        currentY += lineHeight;
        let offset = 0;

        // Print Podium (FTF/STF/TTF)
        if (showftf.value && i === 0 && k === 0 && j < 3) {
          ctx.fillStyle = ftfcol.value;
          const podium = j === 0 ? 'FTF' : j === 1 ? 'STF' : 'TTF';
          ctx.fillText(podium, i * colWidth + margin, currentY, Math.trunc(0.25 * colWidth - margin));
          offset += Math.trunc(0.25 * colWidth - margin) + margin;
          ctx.fillStyle = txtcol.value;
        }

        // Print labels
        const isPodiumSpace = showftf.value && i === 0 && j < 3;
        if (showlbl.value && !isPodiumSpace) {
          let label = "";
          if (k === 0) label = lbl1.value;
          if (k === 1) label = lbl2.value;
          if (k === 2) label = lbl3.value;
          
          if (label) {
            ctx.fillText(label, i * colWidth + margin, currentY, Math.trunc(0.25 * colWidth - margin));
            offset += Math.trunc(0.25 * colWidth - margin) + margin;
          }
        }

        // Print writing line
        ctx.moveTo(i * colWidth + offset + margin, currentY);
        ctx.lineTo(i * colWidth + colWidth - margin, currentY);
      }
      ctx.stroke();
      currentY += margin;
    }
  }
};

// --- Action Handlers ---

const selectFile = (event) => {
  errormsg.value = "";
  const input = event.target;

  if (input.files && input.files[0]) {
    const newImg = new Image();
    newImg.crossOrigin = 'anonymous';
    newImg.src = URL.createObjectURL(input.files[0]);

    newImg.onerror = () => {
      errormsg.value = t('errors.loadingimage');
    };

    newImg.onload = () => {
      try {
        img.value = newImg;
        showimg.value = true;
        redraw();
      } catch (err) {
        errormsg.value = t('errors.generic');
      }
    };
  }
};

const save = () => {
  redraw();
  const doc = new jsPDF('p', 'mm');
  const imgData = canvasRef.value.toDataURL('image/png');
  // Usable size is 180mm by 267mm
  doc.addImage(imgData, 'PNG', 15, 15, 180, 267);
  doc.setFontSize(7);
  doc.text('Generated via jsPDF', 10, 292);
  doc.save('gclog.pdf');
};

const savepng = () => {
  const link = document.createElement('a');
  link.download = 'gclog.png';
  link.href = canvasRef.value.toDataURL();
  link.click();
};

// --- Watchers for Auto-Redraw ---
// This makes the UI feel very responsive
watch([ncol, hdr1, hdr2, hdr3, lh, linesperlog, nolines, showimg, showlbl, showftf, linecol, txtcol, hdrcol, ftfcol], () => {
  redraw();
});

// --- Lifecycle ---
onMounted(() => {
  const canvas = canvasRef.value;
  ctx = canvas.getContext("2d");
  
  canvas.width = width.value;
  canvas.height = height.value;
  
  redraw();
  hdr1Input.value?.focus();
});
</script>

<style scoped>

canvas {
  width: 100%;
  height: 100%;
}

</style>
