<template>

  <header class="page-header">
    <h1>{{ $t('sudokusolv.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('sudokusolv.long')" />
      </VCard>
      <VCard :title="$t('labels.settings')">
         <div class="form-horizontal">
          <CustomDropdown
            :title="$t('sudokusolv.type')"
            :options="[
              { label: 'Sudoku', value: 'Sudoku'} ,
              { label: 'Sudoku X', value: 'SudokuX' }
            ]"
            v-model="sudokutype"
            @update="changeType"
          />
         </div>
         <div class="form-horizontal">
          <CustomDropdown
            :title="$t('sudokusolv.size')"
            :options="[
              { label: '2', value: '2'},
              { label: '3', value: '3'}
            ]"
            v-model="size"
            @update="changeSize"
          />
         </div>
      </VCard>
      <VCard :title="$t('labels.input')">
      <!-- Reactive Sudoku Table -->
         <div class="form-row mb-2">
          <label>Grid</label>
          <div class="p-table">
            <table class="sudoku-table">
              <tr v-for="(row, rIdx) in grid" :key="'row-' + rIdx">
                <td 
                  v-for="(cell, cIdx) in row" 
                  :key="'cell-' + rIdx + '-' + cIdx"
                  :class="getBorderClass(rIdx, cIdx)"
                >
                  <input
                    type="text"
                    v-model="grid[rIdx][cIdx]"
                    maxlength="1"
                    class="form-control text-center sudoku-input"
                    :style="getBoxStyle(rIdx, cIdx)"
                  />
                </td>
              </tr>
            </table>
          </div>
        </div>
         <div class="form-row">
          <label>{{ $t('sudokusolv.alt') }}</label>
          <input type="text" v-model="knownnumbers">
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}.
        </p>
        <div class="button-row mt-2">
          <button class="btn btn-primary"  @click="solveSudoku">
            {{ $t('buttons.solve') }}
          </button>
          <button class="btn btn-primary"  @click="resetSudoku">
            {{ $t('buttons.reset') }}
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="$t('labels.result')">
        <div
          v-show="solved"
          class="mb-2"
        >
          <span style="font-weight:bold;">
            {{ $t('sudokusolv.thereare') }} {{ numberofsolutions }} {{ $t('sudokusolv.sols') }}
          </span>
          <div class="form-inline mb-2">
            <select
              id="listofresults"
              v-model="selectedsolution"
              class="form-select"
              @change="printSolution"
            >
              <option
                v-for="result in results"
                :key="result"
              >
                {{ result }}
              </option>
            </select>
          </div>
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue'
import CustomDropdown from '@/components/generic/CustomDropdown.vue'

defineOptions({ name: 'SudokuSolv' })

const { t } = useI18n()

// --- Constants ---
const CODES = "123456789ABCDEFG"
const PHP_URL = `${window.location.protocol}//${window.location.hostname}/sudokusolver/sudokusolver.php`

// --- State ---
const size = ref('3') 
const sudokutype = ref("Sudoku")
const grid = ref([]) 
const solved = ref(false)
const results = ref([])
const numberofsolutions = ref(0)
const selectedsolution = ref("")
const errormsg = ref("")

const sideLength = computed(() => size.value ** 2)

/**
 * Initializes the grid. 
 */
const initGrid = () => {
  const side = sideLength.value
  grid.value = Array.from({ length: side }, () => Array(side).fill(''))
  solved.value = false
  results.value = []
}

// Watch for size changes to resize the grid automatically
watch(size, () => {
  initGrid()
}, { immediate: true })

/**
 * CSS Logic to draw the thick lines between sub-grids
 */
const getBorderClass = (r, c) => {
  const side = sideLength.value
  const blockSize = size.value
  let classes = []

  // Vertical thick lines
  if ((c + 1) % blockSize === 0 && (c + 1) !== side) {
    classes.push('thick-right')
  }
  // Horizontal thick lines
  if ((r + 1) % blockSize === 0 && (r + 1) !== side) {
    classes.push('thick-bottom')
  }

  return classes.join(' ')
}

const getBoxStyle = (r, c) => {
  const side = sideLength.value
  const style = { 
    width: side > 9 ? '2rem' : '2.8rem', 
    height: side > 9 ? '2rem' : '2.8rem', 
    fontSize: side > 9 ? '0.9rem' : '1.2rem'
  }
  
  if (sudokutype.value === "SudokuX") {
    if (r === c || r + c === side - 1) {
      style.backgroundColor = '#e9ecef'
    }
  }
  return style
}

const generateKnownNumbers = () => {
  let hints = []
  const side = sideLength.value
  for (let r = 0; r < side; r++) {
    for (let c = 0; c < side; c++) {
      const val = grid.value[r][c].toUpperCase()
      if (val !== "") {
        const valIdx = CODES.indexOf(val)
        if (valIdx !== -1) {
          hints.push(`${CODES[r]}${CODES[c]}${CODES[valIdx]}`)
        }
      }
    }
  }
  return hints.join(',')
}

const printSolution = () => {
  if (!selectedsolution.value) return
  const sol = selectedsolution.value
  const side = sideLength.value
  for (let r = 0; r < side; r++) {
    for (let c = 0; c < side; c++) {
      grid.value[r][c] = sol[(r * side) + c]
    }
  }
}

const resetSudoku = () => {
  initGrid()
}

const solveSudoku = async () => {
  errormsg.value = ""
  const payload = {
    sudokutype: sudokutype.value,
    size: size.value,
    knownnumbers: generateKnownNumbers(),
  }

  try {
    const response = await fetch(PHP_URL, { method: 'POST', body: JSON.stringify(payload) })
    const data = await response.json()
    solved.value = true
    results.value = data.results || []
    numberofsolutions.value = data.numberofsolutions
    if (results.value.length > 0) {
      selectedsolution.value = results.value[0]
      printSolution()
    } else {
      errormsg.value = t('sudokusolv.no_solution') || "No solution found"
    }
  } catch (error) {
    errormsg.value = t('sudokusolv.error')
  }
}
</script>

<style scoped>
.sudoku-table {
  border: 3px solid #333;
  border-collapse: collapse;
}

.sudoku-table td {
  border: 1px solid #ccc;
  padding: 0;
}

/* Thick borders for the sub-squares */
.thick-right {
  border-right: 3px solid #333 !important;
}
.thick-bottom {
  border-bottom: 3px solid #333 !important;
}

.sudoku-input {
  border: none;
  border-radius: 0;
  background-color: transparent;
  padding: 0;
  margin: 0;
  font-weight: bold;
  text-align: center;
  align-content: center;
}

</style>

