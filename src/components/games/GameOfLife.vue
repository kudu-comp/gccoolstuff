<template>

  <header class="page-header">
    <h1>{{ t('gameoflife.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('gameoflife.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
          <CustomDropdown
            :title="t('gameoflife.fillgrid')"
            :options="genOptions"
            v-model="sel"
          />
        </div>
        <div class="form-horizontal">
          <label>{{ t('gameoflife.rows') }}</label>
          <input type="number" v-model="rows">
        </div>
        <div class="form-horizontal">
          <label>{{ t('gameoflife.cols') }}</label>
          <input type="number" v-model="cols">
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="chgrules">
          <span class="checkmark"></span>
          {{ t('gameoflife.chgrules') }}
        </label>
        <div class="input-box" v-if="chgrules">
          <div class="form-horizontal mt-2">
            <label>{{ t('gameoflife.diebelow') }}</label>
            <input type="number" v-model="diebelow">
          </div>
          <div class="form-horizontal">
            <label>{{ t('gameoflife.dieabove') }}</label>
            <input type="number" v-model="dieabove">
          </div>
          <div class="form-horizontal">
            <label>{{ t('gameoflife.bornbelow') }}</label>
            <input type="number" v-model="bornbelow">
          </div>
          <div class="form-horizontal">
            <label>{{ t('gameoflife.bornabove') }}</label>
            <input type="number" v-model="bornabove">
          </div>
        </div>
         <p v-show="errormsg"class="errormsg">
          {{ errormsg }}
          </p>
         <div class="button-row mt-2">
          <button class="btn btn-primary"  @click="fillGrid">
            {{ t('gameoflife.newgrid') }}
          </button>
          <button class="btn btn-primary"  @click="step">
            {{ t('gameoflife.step') }}
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div class="card resultbox">
          {{  result1 }}<br>
          {{  result2 }}<br><br>
          <canvas ref="canvasRef" @mousedown="cellClicked" style="cursor: crosshair; display: block;"></canvas>
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import CustomDropdown from '@/components/generic/CustomDropdown.vue'
import VCard from '@/components/generic/VCard.vue';

defineOptions({
  name: "GameOfLife"
});

const { t } = useI18n();

// --- Constants ---
const szCell = 25;

// --- State ---
const sel = ref(0);
const rows = ref(10);
const cols = ref(10);
const diebelow = ref(2);
const dieabove = ref(3);
const bornabove = ref(3);
const bornbelow = ref(3);
const errormsg = ref("");
const result1 = ref("");
const result2 = ref("");
const gen = ref(0);
const cellsalive = ref(0);
const chgrules = ref(false);
const genOptions = [
  { label : t('gameoflife.empty'), value: 0},
  { label : t('gameoflife.random'), value: 1},
  { label : t('gameoflife.rndsym'), value: 2},
]

let game = [];

// --- Template Refs ---
const canvasRef = ref(null);
const selRef = ref(null);

onMounted(() => {
  selRef.value?.focus();
  fillGrid();
});

// --- Methods ---

const drawGame = () => {
  result1.value = `${t('gameoflife.gen')}${gen.value}`;
  result2.value = `${t('gameoflife.cellsalive')}${cellsalive.value}`;

  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Grid Lines
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#aaaaaa";

  for (let i = 0; i <= rows.value; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * szCell);
    ctx.lineTo(canvas.width, i * szCell);
    ctx.stroke();
  }
  for (let i = 0; i <= cols.value; i++) {
    ctx.beginPath();
    ctx.moveTo(i * szCell, 0);
    ctx.lineTo(i * szCell, canvas.height);
    ctx.stroke();
  }

  // Draw Alive Cells
  ctx.fillStyle = "#84a98c";
  for (let r = 1; r <= rows.value; r++) {
    for (let c = 1; c <= cols.value; c++) {
      if (game[r][c] === 1) {
        ctx.fillRect((c - 1) * szCell, (r - 1) * szCell, szCell, szCell);
      }
    }
  }
};

const fillGrid = () => {
  gen.value = 0;
  cellsalive.value = 0;

  const canvas = canvasRef.value;
  if (canvas) {
    canvas.width = szCell * cols.value;
    canvas.height = szCell * rows.value;
  }

  // Create grid with padding (rows+2, cols+2) to handle boundaries easily
  game = new Array(rows.value + 2)
    .fill(null)
    .map(() => new Array(cols.value + 2).fill(0));

  let maxcells = 0;

  switch (sel.value) {
    case 0: // Empty
      break;
    case 1: // Random
      maxcells = Math.trunc(0.5 * cols.value * rows.value);
      for (let i = 0; i < maxcells; i++) {
        let x = Math.trunc(Math.random() * cols.value * rows.value);
        let c = x % cols.value;
        let r = Math.trunc(x / cols.value);
        game[r + 1][c + 1] = 1;
      }
      break;
    case 2: // Symmetric
      maxcells = Math.trunc(0.125 * cols.value * rows.value);
      let co = Math.round(cols.value / 2);
      let ro = Math.round(rows.value / 2);
      for (let i = 0; i < maxcells; i++) {
        let x = Math.trunc(Math.random() * co * ro);
        let c = x % co;
        let r = Math.trunc(x / co);
        game[r + 1][c + 1] = 1;
        game[r + 1][cols.value - c] = 1;
        game[rows.value - r][c + 1] = 1;
        game[rows.value - r][cols.value - c] = 1;
      }
      break;
  }

  // Initial alive count
  let count = 0;
  for (let r = 1; r <= rows.value; r++) {
    for (let c = 1; c <= cols.value; c++) {
      if (game[r][c] === 1) count++;
    }
  }
  cellsalive.value = count;
  drawGame();
};

const cellClicked = (event) => {
  const c = Math.trunc(event.offsetX / szCell);
  const r = Math.trunc(event.offsetY / szCell);

  // Safety check for bounds
  if (game[r + 1] !== undefined && game[r + 1][c + 1] !== undefined) {
    game[r + 1][c + 1] = game[r + 1][c + 1] === 0 ? 1 : 0;

    // Update live count
    let count = 0;
    for (let rowIdx = 1; rowIdx <= rows.value; rowIdx++) {
      for (let colIdx = 1; colIdx <= cols.value; colIdx++) {
        if (game[rowIdx][colIdx] === 1) count++;
      }
    }
    cellsalive.value = count;
    drawGame();
  }
};

const step = () => {
  const newGame = new Array(rows.value + 2)
    .fill(null)
    .map(() => new Array(cols.value + 2).fill(0));

  let currentAlive = 0;

  for (let r = 1; r <= rows.value; r++) {
    for (let c = 1; c <= cols.value; c++) {
      // Sum the 8 neighbors
      let neighborCount =
        game[r - 1][c - 1] + game[r - 1][c] + game[r - 1][c + 1] +
        game[r][c - 1]     +                  game[r][c + 1] +
        game[r + 1][c - 1] + game[r + 1][c] + game[r + 1][c + 1];

      if (game[r][c] === 1) {
        // Survival rules
        if (neighborCount >= diebelow.value && neighborCount <= dieabove.value) {
          newGame[r][c] = 1;
          currentAlive++;
        }
      } else {
        // Birth rules
        if (neighborCount >= bornabove.value && neighborCount <= bornbelow.value) {
          newGame[r][c] = 1;
          currentAlive++;
        }
      }
    }
  }

  gen.value++;
  cellsalive.value = currentAlive;
  game = newGame;
  drawGame();
};
</script>

<style scoped>
.canvas-container {
  max-width: 100%;
  background-color: #f0f0f0;
}
</style>

