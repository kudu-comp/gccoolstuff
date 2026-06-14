<template>

  <header class="page-header">
    <h1>{{ $t('truthtable.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('truthtable.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <div class="form-horizontal">
          <label>{{ $t('truthtable.expr') }}</label>
          <input type="text" v-model="expr">
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <v-calculate class="mb-2" id="calc" @calculate="calculate()"></v-calculate>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="$t('labels.result')">
        <div
          v-if="result"
          v-html="result"
          class="card resultbox"
        >
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { evaluate } from "mathjs";
import VCalculate from '@/components/generic/VCalculate.vue';
import VCard from '@/components/generic/VCard.vue';

defineOptions({
  name: "TruthTable"
});

const { t } = useI18n();

// --- State ---
const expr = ref("");
const result = ref("");
const errormsg = ref("");

// These variables are used during the calculation process
let vararr = [];
let cleanexpr = "";

// --- Template Ref ---
const exprInput = ref(null);

onMounted(() => {
  exprInput.value?.focus();
});

// --- Logic Helpers ---

/**
 * Recursive function to generate all T/F combinations
 */
const nextOption = (scope, cnt) => {
  if (cnt === vararr.length) {
    // Base Case: We have a full set of variable assignments
    let vars = {};
    let rowHtml = "<tr>";

    for (let i = 0; i < scope.length; i++) {
      vars[vararr[i]] = scope[i];
      rowHtml += `<td>${scope[i]}</td>`;
    }

    try {
      // Evaluate the expression with mathjs using the current scope
      const evalResult = evaluate(cleanexpr, vars);
      rowHtml += `<td><strong>${evalResult}</strong></td></tr>`;
      result.value += rowHtml;
    } catch (e) {
      rowHtml += `<td>Error</td></tr>`;
      result.value += rowHtml;
    }
  } else {
    // Recursive Case: Try both false and true for the current variable
    scope[cnt] = false;
    nextOption(scope, cnt + 1);
    scope[cnt] = true;
    nextOption(scope, cnt + 1);
  }
};

/**
 * Main calculation function
 */
const calculate = () => {
  // Reset
  result.value = "";
  errormsg.value = "";
  vararr = [];
  cleanexpr = expr.value.trim();

  if (cleanexpr === "") {
    errormsg.value = t('errors.noinput');
    return;
  }

  // 1. Replace logical operators with mathjs literal versions
  const replacements = [
    [/&&/gi, " and "],
    [/\|\|/gi, " or "],
    [/~/gi, " not "],
    [/∧/gi, " and "],
    [/∨/gi, " or "],
    [/¬/gi, " not "],
    [/\*/gi, " and "],
    [/\+/gi, " or "],
    [/!/gi, " not "],
  ];

  replacements.forEach(([regex, replacement]) => {
    cleanexpr = cleanexpr.replace(regex, replacement);
  });

  // 2. Extract unique variables
  const tokens = cleanexpr.matchAll(/\b(\w+)\b/g);
  const uniqueVars = new Set();
  const reserved = ["AND", "OR", "NOT", "XOR", "TRUE", "FALSE"];

  for (const token of tokens) {
    const word = token[0];
    if (!reserved.includes(word.toUpperCase()) && isNaN(word)) {
      uniqueVars.add(word);
    }
  }
  vararr = Array.from(uniqueVars);

  if (vararr.length > 10) {
    errormsg.value = "Too many variables (max 10)";
    return;
  }

  // 3. Build Table Header
  let tableHtml = "<table class='p-table'><thead><tr>";
  vararr.forEach(v => {
    tableHtml += `<th scope='col'>${v}</th>`;
  });
  tableHtml += `<th scope='col'>${expr.value}</th></tr></thead><tbody>`;
  
  result.value = tableHtml;

  // 4. Generate permutations recursively
  const optarr = new Array(vararr.length).fill(false);
  nextOption(optarr, 0);

  // 5. Close Table
  result.value += "</tbody></table>";
};
</script>

<style scoped>
</style>
