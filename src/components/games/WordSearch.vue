<template>

  <header class="page-header">
    <h1>{{ t('wordsearch.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('wordsearch.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('wordsearch.ignore') }}</label>
          <input type="text" v-model="ignore" lenght="1">
        </div>
        <div class="card-grid mb-2">
          <div class="form-row">
            <label>{{ t('wordsearch.grid') }}</label>
            <textarea
              v-model="grid"
              rows="10"
            />
          </div>
          <div class="form-row">
            <label>{{ t('wordsearch.words') }}</label>
            <textarea
              v-model="words"
              rows="10"
            />
          </div>
        </div>
        <p v-show="errormsg" class="errormsg mb-2">
          {{ errormsg }}.
        </p>
        <div class="button-row">
          <button class="btn btn-primary"  :disabled="working" @click="solve">
            {{ t('buttons.solve') }}
          </button>
        </div>
      </VCard>
      <VCard :title="t('labels.result')">
        <div class="resultbox" >
          {{ result }}
          <div v-if="result" class="button-row mb-2">
            <DownloadButton v-model:canvas="puzzleCanvas" />
          </div>
          <div class="canvas-container">
            <canvas ref="puzzleCanvas"></canvas>
          </div>
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import VCard from '@/components/generic/VCard.vue';
import DownloadButton from '@/components/generic/DownloadButton.vue';

defineOptions({
  name: "WordSearch"
});

const { t } = useI18n();

// --- State ---
const grid = ref("");
const words = ref("");
const gridarr = ref([]);
const checkarr = ref([]);
const nrow = ref(0);
const ncol = ref(0);
const ignore = ref("-");
const result = ref("");
const errormsg = ref("");
const working = ref(false)

// Styling Settings
const boxsize = ref(30);
const bgcolor = ref("#fafafa");
const txtcolor = ref("#84a98c");
const strikecolor = ref("#c05d4d");
const circlecolor = ref("#6b8e23");

// --- Template Refs ---
const puzzleCanvas = ref(null);
const startOpen = window.innerWidth > 768;

// --- Directional Logic ---
const moves = [
  [-1, 0],  // 0: North
  [-1, 1],  // 1: Northeast
  [0, 1],   // 2: East
  [1, 1],   // 3: Southeast
  [1, 0],   // 4: South
  [1, -1],  // 5: Southwest
  [0, -1],  // 6: West
  [-1, -1], // 7: Northwest
];

// --- Drawing Methods ---

const drawCanvas = () => {
  const canvas = puzzleCanvas.value;
  if (!canvas) return;

  canvas.width = ncol.value * boxsize.value;
  canvas.height = nrow.value * boxsize.value;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = bgcolor.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = txtcolor.value;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "20px courier"; // Adjusted font size for default boxsize

  for (let r = 0; r < nrow.value; r++) {
    for (let c = 0; c < ncol.value; c++) {
      ctx.fillText(
        gridarr.value[r][c],
        (c + 0.5) * boxsize.value,
        (r + 0.5) * boxsize.value
      );
    }
  }
};

const strikethroughWord = (startr, startc, endr, endc) => {
  const ctx = puzzleCanvas.value.getContext("2d");
  ctx.strokeStyle = strikecolor.value;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo((startc + 0.5) * boxsize.value, (startr + 0.5) * boxsize.value);
  ctx.lineTo((endc + 0.5) * boxsize.value, (endr + 0.5) * boxsize.value);
  ctx.stroke();
};

const circleRemainingLetters = () => {
  const ctx = puzzleCanvas.value.getContext("2d");
  ctx.strokeStyle = circlecolor.value;
  ctx.lineWidth = 2;

  for (let r = 0; r < nrow.value; r++) {
    for (let c = 0; c < ncol.value; c++) {
      if (!checkarr.value[r][c] && gridarr.value[r][c] !== ignore.value) {
        ctx.beginPath();
        ctx.arc(
          (c + 0.5) * boxsize.value,
          (r + 0.5) * boxsize.value,
          boxsize.value * 0.4,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }
    }
  }
};

// --- Search Logic ---

const tryDir = (r, c, dir, w) => {
  for (let i = 1; i < w.length; i++) {
    const nextR = r + moves[dir][0] * i;
    const nextC = c + moves[dir][1] * i;
    if (gridarr.value[nextR][nextC] !== w[i]) return false;
  }

  // Cross the used letters
  for (let i = 0; i < w.length; i++) {
    checkarr.value[r + moves[dir][0] * i][c + moves[dir][1] * i] = true;
  }

  strikethroughWord(
    r,
    c,
    r + moves[dir][0] * (w.length - 1),
    c + moves[dir][1] * (w.length - 1)
  );
  return true;
};

const tryPos = (r, c, w) => {
  for (let dir = 0; dir < 8; dir++) {
    const dr = moves[dir][0];
    const dc = moves[dir][1];

    // Boundary check
    const finalR = r + dr * (w.length - 1);
    const finalC = c + dc * (w.length - 1);

    if (finalR < 0 || finalR >= nrow.value || finalC < 0 || finalC >= ncol.value) {
      continue;
    }

    if (tryDir(r, c, dir, w)) return true;
  }
  return false;
};

// --- Main Action ---

const solve = async () => {
  result.value = "";
  errormsg.value = "";
  gridarr.value = [];
  checkarr.value = [];
  working.value = true

  // Parse Grid
  let gridlines = grid.value.trim().toUpperCase().split(/[\n\r]+/g);
  if (gridlines.length === 0 || gridlines[0].length === 0) {
    errormsg.value = t('errors.noinput');
    return;
  }

  let width = gridlines[0].length;
  for (let i = 0; i < gridlines.length; i++) {
    if (gridlines[i].length !== width) {
      errormsg.value = t("wordsearch.griderror");
      return;
    }
    gridarr.value.push([...gridlines[i]]);
    checkarr.value.push(new Array(width).fill(false));
  }

  nrow.value = gridarr.value.length;
  ncol.value = width;

  // Draw Background Grid
  await nextTick();
  drawCanvas();

  // Parse and Sort Words (longest first)
  let wordList = words.value.trim().toUpperCase().split(/[\n\r]+/g)
    .map(w => w.replace(/\s+/g, ''))
    .filter(w => w.length > 0)
    .sort((a, b) => b.length - a.length);

  if (wordList.length === 0) {
    errormsg.value = t('errors.noinput');
    return;
  }

  // Find Words
  setTimeout(() => { 
    for (let w = 0; w < wordList.length; w++) {
      const currentWord = wordList[w];
      let found = false;

      for (let r = 0; r < nrow.value && !found; r++) {
        for (let c = 0; c < ncol.value && !found; c++) {
          if (gridarr.value[r][c] === currentWord[0]) {
            found = tryPos(r, c, currentWord);
          }
        }
      }

      if (!found) {
        errormsg.value = currentWord + " " + t('wordsearch.notfound');
        working.value =false;
        return;
      }
    }

    // Final Result Generation
    circleRemainingLetters();
    let remaining = "";
    for (let r = 0; r < nrow.value; r++) {
      for (let c = 0; c < ncol.value; c++) {
        if (!checkarr.value[r][c] && gridarr.value[r][c] !== ignore.value) {
          remaining += gridarr.value[r][c];
        }
      }
    }
    
    result.value = t('wordsearch.remletters') + ": " + remaining;
    working.value =false;
  }, 50)

};
</script>

<style scoped>
.canvas-container {
  max-width: 100%;
  display: flex;
  justify-content: center;
}
canvas {
  image-rendering: crisp-edges;
}
</style>

<i18n locale="en">
{
  "wordsearch": {
    "grid": "The grid",
    "words": "Words to find",
    "ignore": "Character indicating unused positions",
    "griderror": "Not all lines in the grid are the same length",
    "remletters": "Remaining letters: ",
    "notfound": " cannot be found."
  }
}
</i18n>

<i18n locale="nl">
{
  "wordsearch": {
    "grid": "Het zoekvierkant",
    "words": "Te vinden woorden",
    "ignore": "Karakter voor ongebruikte posities",
    "griderror": "Niet alle regels in het zoekvierkant hebben dezelfde lengte",
    "remletters": "Overgebleven letters: ",
    "notfound": " kan niet worden gevonden."
  }
}
</i18n>