<template>

  <header class="page-header">
    <h1>{{ $t('dictsearch.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('dictsearch.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <v-language v-model:dict="dict" v-model:dictloading="dictloading" />
        <div class="form-horizontal mt-4">
          <label>{{ $t('dictsearch.searchstr') }}</label>
          <input type="text" v-model="searchstr" ref="searchRef">
        </div>
        <div class="form-horizontal">
          <label>{{ $t('dictsearch.maxlength') }}</label>
          <input type="number" v-model="maxlen">
        </div>
        <div class="form-horizontal">
          <label>{{ $t('dictsearch.minlength') }}</label>
          <input type="number" v-model="minlen">
        </div>
        <div class="radio-group">
          <label>{{ $t('dictsearch.searchfor') }}</label>
          <div class="radio-options-vertical">
            <label class="radio-item" v-for="r in radios" :key="r">
              <input type="radio" :value="r.value" v-model="sf">
              <span class="radio-mark"></span> {{ r.label }}
            </label>
          </div>
        </div>
        <p
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <button :disabled="dictloading" class="btn btn-primary" @click="dictsearch()">
            {{$t('buttons.search')}}
          </button>
        </div>
    </VCard>
  </div>
  <div class="card-stack">
    <VCard :title="$t('labels.result')">
      <div v-if="result" class="card resultbox" v-html="result" />
    </VCard>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import VLanguage from "@/components/generic/VLanguage.vue";
import { wordValueSimple } from "@/scripts/texthelper.js";
import VCard from '@/components/generic/VCard.vue';

defineOptions({
  name: "DictSearch"
});

const { t } = useI18n();

// --- State ---
const result = ref("");
const errormsg = ref("");
const searchstr = ref("");
const letters = ref("");
const maxlen = ref(0);
const minlen = ref(0);
const maxl = ref(0);
const minl = ref(0);
const cnt = ref(0);
const maxcnt = 2500;
const finds = ref([]);
const dict = ref({});
const dictloading = ref(true);
const sf = ref("1");
const chunk = ref("");

const radios = [
  { label: t('dictsearch.pattern'), value : 1},
  { label: t('dictsearch.start'), value : 2},
  { label: t('dictsearch.end'), value : 3},
  { label: t('dictsearch.contains'), value : 4},
  { label: t('dictsearch.regex'), value : 5},
  { label: t('dictsearch.longest'), value : 6},
  { label: t('dictsearch.values'), value : 7}
]

const searchRef = ref(null)

// Internal logic variable for longest anagram search
let lword = "";

// --- Helper Methods ---

const nextTry = (word) => {
  // Check if we have too many words
  if (cnt.value > maxcnt) {
    errormsg.value = t("dictsearch.toomany");
    return;
  }

  if (word.length === searchstr.value.length) {
    // Check if word exists in dictionary
    if (dict.value.find(word)) {
      finds.value.push(word);
      cnt.value++;
    }
  } else {
    let pos = word.length;
    if (searchstr.value[pos] === "?") {
      for (let j = 0; j < letters.value.length; j++) {
        nextTry(word + letters.value[j]);
      }
    } else {
      nextTry(word + searchstr.value[pos]);
    }
  }
};

const findPattern = () => {

  letters.value = dict.value.alphabet;
  nextTry("");

  // Remove duplicates and sort
  let uniqueFinds = [...new Set(finds.value)].sort();

  result.value = uniqueFinds.length + t("dictsearch.wordsfound") + "<br><br>";
  result.value += uniqueFinds.join("<br>");
};

const nextTryLongest = (anagram) => {
  let hword = "";
  for (let i = 0; i < anagram.length; i++) {
    hword += searchstr.value[anagram[i]];
  }

  // Find the anagram
  let fullmatch = dict.value.findWord(hword);

  // Check if current string is at least the start of a valid word
  let partmatch = fullmatch.word
    ? dict.value.compStr(
        dict.value.cleanStr(fullmatch.word.slice(0, hword.length)),
        dict.value.cleanStr(hword)
      ) === 0
    : true;

  if (!partmatch) return;

  // Track the longest valid word found
  if (fullmatch.fnd && hword.length > lword.length) {
    lword = hword;
  }

  if (anagram.length === searchstr.value.length) return;

  // Recursive permutations
  for (let i = 0; i < searchstr.value.length; i++) {
    if (anagram.indexOf(i) >= 0) continue;
    anagram.push(i);
    nextTryLongest(anagram);
    anagram.pop();
  }
};

const findLongest = () => {
  lword = "";
  nextTryLongest([]);
  result.value = lword || t("errors.noresult");
};

const findStart = () => {
  let count = 0;
  let fnd = dict.value.findWord(searchstr.value);
  let pos = fnd.pos;
  let output = "";

  while (
    pos < dict.value.words.length &&
    dict.value.words[pos].startsWith(searchstr.value)
  ) {
    const word = dict.value.words[pos];
    if (word.length <= maxl.value && word.length >= minl.value) {
      output += word + "<br>";
      count++;
    }
    pos++;
  }
  result.value = count + t("dictsearch.wordsfound") + "<br><br>" + output;
};

const findEnd = () => {
  let count = 0;
  let output = "";
  const target = searchstr.value;

  for (let i = 0; i < dict.value.words.length; i++) {
    const word = dict.value.words[i];
    if (word.endsWith(target) && word.length <= maxl.value && word.length >= minl.value) {
      output += word + "<br>";
      count++;
    }
  }
  result.value = count + t("dictsearch.wordsfound") + "<br><br>" + output;
};

const findContains = () => {
  let count = 0;
  let output = "";
  for (let i = 0; i < dict.value.words.length; i++) {
    const word = dict.value.words[i];
    if (word.includes(searchstr.value) && word.length <= maxl.value && word.length >= minl.value) {
      output += word + "<br>";
      count++;
    }
  }
  result.value = count + t("dictsearch.wordsfound") + "<br><br>" + output;
};

const findRegex = () => {
  if (!searchstr.value) {
    errormsg.value = t("errors.noinput");
    return;
  }

  try {
    let count = 0;
    let output = "";
    let regex = new RegExp(searchstr.value, 'i');

    for (let i = 0; i < dict.value.words.length; i++) {
      const word = dict.value.words[i];
      if (word.match(regex) && word.length <= maxl.value && word.length >= minl.value) {
        output += word + "<br>";
        count++;
      }
    }
    result.value = count + t("dictsearch.wordsfound") + "<br><br>" + output;
  } catch (e) {
    errormsg.value = t("errors.invalid_regex");
  }
};

const findWordValue = () => {
  let count = 0;
  let output = "";
  let wv = parseInt(searchstr.value);

  if (!wv || wv === 0) {
    errormsg.value = t("errors.noinput");
    return;
  }

  for (let i = 0; i < dict.value.words.length; i++) {
    const word = dict.value.words[i];
    if (wordValueSimple(word, dict.value.alphabet) === wv) {
      output += word + "<br>";
      count++;
    }
  }
  result.value = count + t("dictsearch.wordsfound") + "<br><br>" + output;
};

// --- Main Action ---

const dictsearch = () => {
  // Reset outputs
  result.value = "";
  errormsg.value = "";
  cnt.value = 0;
  finds.value = [];

  // Prep search strings via dictionary-specific cleaning
  searchstr.value = dict.value.cleanStr(searchstr.value.trim());

  // Set bounds
  minl.value = minlen.value < 1 ? 1 : minlen.value;
  maxl.value = maxlen.value === 0 ? 99999 : maxlen.value;

  switch (parseInt(sf.value)) {
    case 1: findPattern(); break;
    case 2: findStart(); break;
    case 3: findEnd(); break;
    case 4: findContains(); break;
    case 5: findRegex(); break;
    case 6: findLongest(); break;
    case 7: findWordValue(); break;
  }
};

onMounted(() => {
  searchRef.value?.focus()
})

</script>

