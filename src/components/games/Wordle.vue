<template>

  <header class="page-header">
    <h1>{{ t('wordle.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('wordle.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <v-language v-model:dict="dict" v-model:dictloading="dictloading" />
          <div class="form-horizontal mt-4">
            <label>{{ t('wordle.length') }}</label>
            <input type="number" v-model="len">
          </div>
          <div class="form-horizontal">
            <label>{{ t('wordle.pattern') }}</label>
            <input type="text" v-model="wordlePattern">
          </div>
          <div class="form-horizontal">
            <label>{{ t('wordle.yellows') }}</label>
            <input type="text" v-model="yellows">
          </div>
          <div class="form-horizontal">
            <label>{{ t('wordle.greys') }}</label>
            <input type="text" v-model="greys">
          </div>
          <p
            v-show="errormsg"
            class="errormsg"
          >
            {{ errormsg }}
          </p>
          <div class="button-row mt-2">
            <button :disabled="dictloading" class="btn btn-primary"  @click="findwordle">
              {{ t('buttons.search') }}
            </button>
          </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div v-if="result" class="card resultbox" v-html="result" />
      </VCard>  
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import VLanguage from "@/components/generic/VLanguage.vue";
import VCard from '@/components/generic/VCard.vue';

defineOptions({
  name: "WordleSolver"
});

const { t } = useI18n();

// --- State ---
const result = ref("");
const errormsg = ref("");
const wordlePattern = ref("?????"); // pattern input
const yellows = ref("");
const greys = ref("");
const len = ref(5);
const cnt = ref(0);
const finds = ref([]);
const dict = ref({});
const dictloading = ref(true);

const maxcnt = 2500;
let availableLetters = ""; // Local variable used during recursion

// --- Logic Methods ---

/**
 * Recursive backtracking function to generate candidates matching the pattern
 */
const nextTry = (word) => {
  // 1. Safety check for performance
  if (cnt.value > maxcnt) {
    errormsg.value = t("wordle.toomany");
    return;
  }

  // 2. Base case: we reached the target length
  if (word.length === wordlePattern.value.length) {
    // Check if the candidate contains all the "yellow" (mandatory) letters
    for (let i = 0; i < yellows.value.length; i++) {
      if (word.indexOf(yellows.value[i]) < 0) return;
    }

    // Lookup word in the loaded dictionary
    if (dict.value.find(word)) {
      finds.value.push(word);
      cnt.value++;
    }
  } else {
    // 3. Recursive step: build the word position by position
    const pos = word.length;
    const charAtPos = wordlePattern.value[pos];

    if (charAtPos === "?") {
      // Try every letter in the filtered alphabet
      for (let j = 0; j < availableLetters.length; j++) {
        nextTry(word + availableLetters[j]);
      }
    } else {
      // Use the fixed letter from the pattern
      nextTry(word + charAtPos);
    }
  }
};

/**
 * Main execution function
 */
const findwordle = () => {
  // Reset outputs
  result.value = "";
  errormsg.value = "";
  cnt.value = 0;
  finds.value = [];

  // 1. Validate and clean inputs using dictionary rules
  if (!dict.value.cleanStr) return;

  wordlePattern.value = dict.value.cleanStr(wordlePattern.value.trim());
  yellows.value = dict.value.cleanStr(yellows.value.trim());
  greys.value = dict.value.cleanStr(greys.value.trim());

  // 2. Initial checks
  if (len.value !== wordlePattern.value.length) {
    errormsg.value = t("wordle.errpattern");
    return;
  }

  // 3. Prepare the allowed alphabet (Alphabet minus Grey letters)
  availableLetters = dict.value.alphabet;
  for (let i = 0; i < greys.value.length; i++) {
    // Escape special characters just in case, though usually A-Z
    const char = greys.value[i];
    availableLetters = availableLetters.split(char).join("");
  }

  // 4. Start search
  nextTry("");

  // 5. Deduplicate and sort results
  const uniqueFinds = [...new Set(finds.value)].sort();
  
  // 6. Format result for display
  if (uniqueFinds.length === 0) {
    result.value = t("errors.noresult") || "No words found.";
  } else {
    let output = uniqueFinds.length + t("wordle.wordsfound") + "<br><br>";
    output += uniqueFinds.join("<br>");
    result.value = output;
  }
};
</script>
