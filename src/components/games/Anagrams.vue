<template>

  <header class="page-header">
    <h1>{{ t('anagrams.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('anagrams.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <v-language v-model:dict="dict" v-model:dictloading="dictloading" />
        <div class="form-horizontal mt-4">
          <label>{{ t('anagrams.letters') }}</label>
          <input type="text" v-model="letters" ref="lettersRef">
        </div>
        <div class="form-horizontal">
          <label>{{ t('anagrams.maxw') }}</label>
          <input type="number" v-model="maxw">
        </div>
        <div class="form-horizontal">
          <label>{{ t('anagrams.minl') }}</label>
          <input type="number" v-model="minl">
        </div>
        <div class="form-horizontal">
          <label>{{ t('anagrams.maxl') }}</label>
          <input type="number" v-model="maxl">
        </div>
        <p v-show="errormsg" class="errormsg mb-2">
          {{ errormsg }}
        </p>
        <div class="button-row">
          <button :disabled="dictloading || working" class="btn btn-primary" @click="runAnagramSearch">
            {{t('buttons.search')}}
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div class="button-row mb-2">
          <CopyButton 
            :content="resultsContainer"
            :is-html="true"
          />
        </div>
        <div v-if="result" class="resultbox" v-html="result" ref="resultsContainer"/>
      </VCard>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import VLanguage from "@/components/generic/VLanguage.vue";
import VCard from '@/components/generic/VCard.vue';
import CopyButton from '@/components/generic/CopyButton.vue';

defineOptions({
  name: "Anagrams"
});

const { t } = useI18n();

// --- State ---
const result = ref("");
const errormsg = ref("");
const letters = ref("");
const maxw = ref(1);
const minl = ref(1);
const maxl = ref(999);
const dict = ref({});
const dictloading = ref(true);
const working = ref(false);
const finds = ref([]);
const base = ref("");
const maxcnt = 2500;
const lettersRef=ref(null)
const resultsContainer=ref(null)
const startOpen = window.innerWidth > 768;

onMounted(() => {
  lettersRef.value?.focus()
})
// --- Logic Methods ---

/**
 * Recursive function to try permutations and word breaks
 */
const nextTry = (anagram, wordbreaks, start) => {
  // Check if we have too many finds
  if (finds.value.length > maxcnt) {
    errormsg.value = t("anagrams.toomany");
    return;
  }

  // Build the string for the current anagram segment
  let hword = "";
  for (let i = start; i < anagram.length; i++) {
    hword += base.value[anagram[i]];
  }

  // Find the anagram segment in dictionary
  const fullmatch = dict.value.findWord(hword);

  // Check if the anagram is at least the start of a word
  const partmatch = fullmatch.word
    ? dict.value.compStr(
        dict.value.cleanStr(fullmatch.word.slice(0, hword.length)),
        dict.value.cleanStr(hword)
      ) === 0
    : true;

  if (!partmatch) return;

  // We got a full anagram match
  if (
    fullmatch.fnd &&
    anagram.length === base.value.length &&
    hword.length >= minl.value
  ) {
    let finalString = "";
    // Build the full sequence
    for (let j = 0; j < base.value.length; j++) {
      finalString += base.value[anagram[j]];
    }
    // Insert spaces at word breaks (reverse order to keep indices valid)
    for (let j = wordbreaks.length - 1; j >= 1; j--) {
      finalString =
        finalString.slice(0, wordbreaks[j]) + " " + finalString.slice(wordbreaks[j]);
    }
    finds.value.push(finalString);
    return;
  }

  // If max individual word length is exceeded, stop this branch
  if (hword.length >= maxl.value) return;

  // Branching: If we found a word and haven't hit the max word count, try starting a new word
  if (
    fullmatch.fnd &&
    maxw.value > wordbreaks.length &&
    hword.length >= minl.value
  ) {
    wordbreaks.push(anagram.length);
    for (let i = 0; i < base.value.length; i++) {
      if (anagram.indexOf(i) >= 0) continue;
      anagram.push(i);
      nextTry(anagram, wordbreaks, anagram.length - 1);
      anagram.pop();
    }
    wordbreaks.pop();
  }

  // Branching: Continue extending the current word
  for (let i = 0; i < base.value.length; i++) {
    if (anagram.indexOf(i) >= 0) continue;
    anagram.push(i);
    nextTry(anagram, wordbreaks, start);
    anagram.pop();
  }
};

/**
 * Entry point for search
 */
const runAnagramSearch = () => {
  // Reset
  result.value = "";
  errormsg.value = "";
  finds.value = [];

  // Sanitize input using dictionary rules
  base.value = dict.value.cleanStr(letters.value.replace(/\s/g, ""));
  if (!base.value) {
    errormsg.value = t('anagrams.noletters') 
    return;
  }

  // Kick off recursion
  working.value = true;
  setTimeout(() => {  
    for (let i = 0; i < base.value.length; i++) {
      nextTry([i], [0], 0);
    }
    // Filter unique results and sort
    const uniqueFinds = [...new Set(finds.value)].sort();

    // Print results
    let output = t("anagrams.wordsfound", uniqueFinds.length ) + "<br><br>";
    output += uniqueFinds.join("<br>");

    working.value = false;
    result.value = output;
  }, 50);

};
</script>

<i18n locale="en">
{
  "anagrams": {
    "noletters": "Please provide some letters from the alphabet.",
    "maxw": "Max # words",
    "minl": "Min word length",
    "maxl": "Max word length",
    "letters": "Letters that must be present",
    "wordsfound": "No anagrams found|{n} anagram found|{n} anagrams found.",
    "toomany": "Maximum number of anagrams reached."
  }
}
</i18n>

<i18n locale="nl">
{
  "anagrams": {
    "noletters": "Geen geldige letters, gebruik letters uit het alfabet.",
    "maxw": "Max # woorden",
    "minl": "Min woord lengte",
    "maxl": "Max woord lengte",
    "letters": "Te gebruiken letters",
    "wordsfound": "Geen anagrammen gevonden|{n} anagram gevonden|{n} anagrammen gevonden.",
    "toomany": "Maximum aantal anagrammen gevonden."
  }
}
</i18n>