<template>

  <header class="page-header">
    <h1>{{ $t('equations.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('equations.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <div class="form-horizontal">
          <label>{{ $t('equations.numvar') }}</label>
          <input type="number" v-model="size" ref="sizeInput" min="1" max="26" @change="updateMatrixSize()">
        </div>
        <table class="mb-2">
          <tbody>
            <tr v-for="(row, rIdx) in matrix" :key="'row-' + rIdx">
              <template v-for="(col, cIdx) in row" :key="'col-' + cIdx">
                <td>
                  <input
                    type="text"
                    v-model="matrix[rIdx][cIdx]"
                    style="width: 70px;"
                  />
                </td>
                <td>
                  {{ varname[cIdx] }} {{ cIdx === size - 1 ? '=' : '+' }}
                </td>
              </template>
              <td>
                <input
                  type="text"
                  v-model="constants[rIdx]"
                  style="width: 70px;"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="radio-group">
          <label>{{$t('equations.output')}}</label>
          <div class="radio-options">
            <label class="radio-item">
              <input type="radio" value="1" v-model="format">
              <span class="radio-mark"></span> {{ $t('equations.fractions') }}
            </label>
            <label class="radio-item">
              <input type="radio" value="2" v-model="format">
              <span class="radio-mark"></span> {{ $t('equations.decimals') }}
            </label>
          </div>
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <v-calculate class="mb-2" id="calc" @calculate="solve()"></v-calculate>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="$t('labels.result')">
        <div v-if="result" class="card resultbox" v-html="result">
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { fraction, lusolve, format as mathFormat, floor, subtract, isZero } from "mathjs";
import VCalculate from '@/components/generic/VCalculate.vue';
import VCard from '@/components/generic/VCard.vue';

defineOptions({
  name: "Equations"
});

const { t } = useI18n();

// --- State ---
const size = ref(2);
const format = ref("1");
const result = ref("");
const errormsg = ref("");
const varname = "xyzabcdefghijklmnopqrstuvw";

// Reactive data structures for the grid
const matrix = ref([["", ""], ["", ""]]);
const constants = ref(["", ""]);

// --- Template Ref ---
const sizeInput = ref(null);

onMounted(() => {
  sizeInput.value?.focus();
});

/**
 * Updates the reactive matrix and constants array when size changes.
 * It tries to preserve existing data.
 */
const updateMatrixSize = () => {
  if (size.value < 1 || size.value > 26) {
    errormsg.value = "Size must be between 1 and 26";
    return;
  }
  errormsg.value = "";

  const newMatrix = [];
  const newConstants = [];

  for (let r = 0; r < size.value; r++) {
    newMatrix[r] = [];
    newConstants[r] = constants.value[r] || "";
    for (let c = 0; c < size.value; c++) {
      // Keep old value if exists, otherwise empty string
      newMatrix[r][c] = (matrix.value[r] && matrix.value[r][c]) ? matrix.value[r][c] : "";
    }
  }

  matrix.value = newMatrix;
  constants.value = newConstants;
};

/**
 * Solves the linear system using mathjs
 */
const solve = () => {
  result.value = "";
  errormsg.value = "";

  try {
    // 1. Convert input strings to mathjs fractions
    const A = matrix.value.map(row => 
      row.map(val => (val === "" ? 0 : fraction(val)))
    );
    const b = constants.value.map(val => 
      (val === "" ? 0 : fraction(val))
    );

    // 2. Solve using LU decomposition
    const sols = lusolve(A, b);

    if (sols) {
      let output = "";
      for (let i = 0; i < size.value; i++) {
        let ns = "";
        let rs = "";
        const val = sols[i][0];

        if (format.value === "1") {
          // Fraction Format
          let n = floor(val);
          let r = subtract(val, n);
          
          ns = !isZero(n) ? mathFormat(n, { fraction: "decimal" }) : "";
          rs = !isZero(r) ? mathFormat(r, { fraction: "ratio" }) : "";
          
          if (ns === "" && rs === "") ns = "0";
        } else {
          // Decimal Format
          ns = mathFormat(val, {
            fraction: "decimal",
            notation: "fixed",
            precision: 5,
          });
        }
        
        output += `${varname[i]} = ${ns} ${rs}<br>`;
      }
      result.value = output;
    } else {
      result.value = t("equations.nosol");
    }
  } catch (e) {
    console.error(e);
    result.value = t("equations.nosol");
  }
};

</script>
