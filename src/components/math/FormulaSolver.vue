<template>

  <header class="page-header">
    <h1>{{ t('formulasolver.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('formulasolver.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('formulasolver.formula') }}</label>
          <input type="text" v-model="formula" ref="formulaInput">
        </div>
        <div class="form-horizontal">
          <label>{{ t('formulasolver.base') }}</label>
          <input type="number" v-model="base" min="2" max="16">
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="unique">
          <span class="checkmark"></span>
          {{ t('formulasolver.unique') }}
        </label>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <CalculateButton @calculate="solveFormula" :disabled="working" />
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div
          v-if="results.length > 0"
          class="resultbox"
        >
          <template v-for="(res, idx) in results">
            {{ printSolution(idx) }}<br>
          </template>
        </div>
        <div v-else class="resultbox">
          {{ result }}
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { evaluate } from 'mathjs';
import CalculateButton from '@/components/generic/CalculateButton.vue';
import VCard from '@/components/generic/VCard.vue';

defineOptions({
  name: 'MathFormula'
});

const { t } = useI18n();

// --- State ---
const formula = ref("");
const varnames = ref(""); // String of unique letters
const base = ref(10);
const unique = ref(true);
const errormsg = ref("");
const result = ref("");
const results = ref([]);
const working = ref(false);

// --- Template Ref ---
const formulaInput = ref(null);
const startOpen = window.innerWidth > 768;

onMounted(() => {
  formulaInput.value?.focus();
});

// --- Logic Helpers ---

/**
 * Formats a specific solution for display
 */
const printSolution = (idx) => {
  let str = "";
  const solDigits = results.value[idx];
  const digitsRef = "0123456789abcdef";

  // Build key (A=1 | B=2...)
  for (let i = 0; i < varnames.value.length; i++) {
    const digitVal = digitsRef.indexOf(solDigits[i]);
    str += `${varnames.value[i]}=${digitVal} | `;
  }

  // Build substituted formula
  let ucform = formula.value.toUpperCase();
  for (let i = 0; i < varnames.value.length; i++) {
    ucform = ucform.replaceAll(varnames.value[i], solDigits[i]);
  }
  
  return str + ucform;
};

/**
 * Checks if the current digit assignment satisfies the equation
 */
const checkSolution = (currentDigits) => {
  let ucform = formula.value.toUpperCase();

  for (let v = 0; v < currentDigits.length; v++) {
    ucform = ucform.replaceAll(varnames.value[v], currentDigits[v]);
  }

  // Split equation at '='
  const sides = ucform.match(/[^=]+/g);
  if (!sides || sides.length < 2) return false;

  try {
    return evaluate(sides[0]) === evaluate(sides[1]);
  } catch (e) {
    return false;
  }
};

/**
 * Recursive Brute-force Generator
 */
const genVars = (depth, currentAssignment, isUnique, currentBase, resultsArr) => {
  const digitChars = "0123456789abcdef";

  if (depth < varnames.value.length) {
    for (let v = 0; v < currentBase; v++) {
      const char = digitChars[v];
      
      // Skip if digit is already used (if unique mode is on)
      if (isUnique && currentAssignment.includes(char)) continue;

      currentAssignment[depth] = char;
      genVars(depth + 1, currentAssignment, isUnique, currentBase, resultsArr);
      currentAssignment[depth] = ""; // Backtrack
    }
  } else {
    // We have a full assignment, verify it
    if (checkSolution(currentAssignment)) {
      resultsArr.push(currentAssignment.join(""));
    }
  }
};

// --- Main Action ---

const solveFormula = () => {
  // Reset
  result.value = "";
  errormsg.value = "";
  results.value = [];
  varnames.value = "";
  
  if (!formula.value) {
    errormsg.value = t('errors.noinput');
    return;
  }

  // 1. Identify unique variables in the formula
  let uniqueLetters = "";
  for (let c of formula.value.toUpperCase()) {
    if (uniqueLetters.indexOf(c) < 0 && /[A-Z]/.test(c)) {
      uniqueLetters += c;
    }
  }
  varnames.value = uniqueLetters;

  // 2. Validation
  if (varnames.value.length > base.value) {
    errormsg.value = t('formulasolver.toomanyvars');
    return;
  }

  working.value = true;

  // 3. Recursive solve wrapped in a slight delay to allow UI to show 'working' state
  setTimeout(() => {
    try {
      let currentAssignment = new Array(varnames.value.length).fill("");
      
      genVars(0, currentAssignment, unique.value, base.value, results.value);

      if (results.value.length === 0) {
        result.value = t('formulasolver.nosol');
      }
    } catch (e) {
      console.error(e);
      errormsg.value = t('formulasolver.exprerror');
    } finally {
      working.value = false;
    }
  }, 50);
};
</script>

<i18n locale="en">
{
  "formulasolver": {
    "formula": "Formula",
    "unique": "Unique numbers",
    "base": "Base for calculations",
    "nosol": "There are no solutions",
    "exprerror": "Error evaluating expression, please check the formula",
    "toomanyvars": "Too many variables, increase base or change formule"
  }
}
</i18n>

<i18n locale="nl">
{
  "formulasolver": {
    "formula": "Formule",
    "unique": "Nummers zijn uniek",
    "base": "Getalstelsel",
    "nosol": "Er zijn geen oplossingen",
    "exprerror": "Fout bij het evalueren van de expressie. Controleer de formule.",
    "toomanyvars": "Te veel variabelen, verhoog getalstelsel of pas de formule aan."
  }
}
</i18n>