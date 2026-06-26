<template>

<div class="input-wrapper">
    <label
    >{{t('language')}}</label>
    <div class="custom-select-container mb-2" v-click-outside="() => isDropdownOpen = false">
      <div class="custom-select-trigger" @click="isDropdownOpen = !isDropdownOpen" :class="{ 'is-active': isDropdownOpen }">
        {{ selectedCategoryLabel }}
        <span class="chevron">▾</span>
      </div>
      <transition name="fade-slide">
        <div v-if="isDropdownOpen" class="custom-options-list">
          <div 
            v-for="(d, idx) in dicts" 
            :key="idx" 
            class="custom-option" 
            :class="{ 
              'selected': selectedName === d.name,
              'ís-disabled': d.disabled
            }"
            @click="updateDict(idx)"
          >
            {{ d.name }} 
            <span v-if="selectedName === d.name" class="check">✓</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
  <div v-if="dictloading" class="spinner-border ms-2" role="status">
    <span class="sr-only">Loading...</span>
  </div>
  <div v-if="!dictloading">
    <label for="len" class="form-label md-size mb-2">{{t('lettersused')}}</label>
    <span class="md-size ms-2 mb-2">{{dict.alphabet}}</span>
  </div>
</template>


//
// VLanguage component enables the user to select a language dictionary
// It exports a couple of standard functions that can be overruled in the dictionary file
//
// Functions:
// The dictionary is used to clean a word so it matches the dictionary rules
// The dictionary is used to compare two words in the dictionary
// The dictionary is used to check if a word is in the dictionary
// The dictionary is used to find the next word in the dictionary
// The dictionary contains a list of words
// The dictionary is dynamically loaded from a file to reduce the initial load time
//

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  dict: {
    type: Object,
    required: true,
  },
  dictloading: {
    type: Boolean,
    required: false,
    default: false
  },
});

const emit = defineEmits([
  "update:dict",
  "update:dictloading"
]);

// --- State ---
const isDropdownOpen = ref(false);
const dicts = ref([
  { name: "Standard dictionaries", disabled: true },
  { name: "English standard (49.000 words)", file: "en-small.js", dict: null },
  { name: "Dutch standard (118,000 words)", file: "nl-small.js", dict: null },
  { name: "Czech standard (514,000 words)", file: "cz-small.js", dict: null },
  { name: "Danish standard (146,000 words)", file: "dk-small.js", dict: null },
  { name: "French standard (73,000 words)", file: "fr-small.js", dict: null },
  { name: "German standard (162,000 words)", file: "de-small.js", dict: null },
  { name: "Italian standard (94,000 words)", file: "it-small.js", dict: null },
  { name: "Norwegian standard (320,000 words)", file: "no-small.js", dict: null },
  { name: "Polish standard (274,000 words)", file: "pl-small.js", dict: null },
  { name: "Portugese standard (252,000 words)", file: "pt-small.js", dict: null },
  { name: "Spanish standard (65,000 words)", file: "es-small.js", dict: null },
  { name: "Swedish standard (72,000 words)", file: "se-small.js", dict: null },
  { name: "10k most common dictionaries", disabled: true },
  { name: "English most common", file: "en-10k.js", dict: null },
  { name: "Dutch most common", file: "nl-10k.js", dict: null },
  { name: "Czech most common", file: "cz-10k.js", dict: null },
  { name: "Danish most common", file: "dk-10k.js", dict: null },
  { name: "French most common", file: "fr-10k.js", dict: null },
  { name: "German most common", file: "de-10k.js", dict: null },
  { name: "Italian most common", file: "it-10k.js", dict: null },
  { name: "Norwegian most common", file: "no-10k.js", dict: null },
  { name: "Polish most common", file: "pl-10k.js", dict: null },
  { name: "Portugese most common", file: "pt-10k.js", dict: null },
  { name: "Spanish most common", file: "es-10k.js", dict: null },
  { name: "Swedish most common", file: "se-10k.js", dict: null },
]);

// --- Standard Dictionary Helpers (Fallbacks) ---

const compStr = (s1, s2) => {
  if (s1 < s2) return -1;
  else if (s1 > s2) return 1;
  else return 0;
};

const cleanStr = (s1) => {
  s1 = s1.replace(/[äáàâåąã]/gi, "a");
  s1 = s1.replace(/[ëéèêěę]/gi, "e");
  s1 = s1.replace(/[ïíìî]/gi, "i");
  s1 = s1.replace(/[öóòôøõ]/gi, "o");
  s1 = s1.replace(/[üúùûů]/gi, "u");
  s1 = s1.replace(/[çčć]/gi, "c");
  s1 = s1.replace(/[ď]/gi, "d");
  s1 = s1.replace(/[ł]/gi, "l");
  s1 = s1.replace(/[ñňń]/gi, "n");
  s1 = s1.replace(/[ř]/gi, "r");
  s1 = s1.replace(/[šś]/gi, "s");
  s1 = s1.replace(/[ť]/gi, "t");
  s1 = s1.replace(/[ý]/gi, "y");
  s1 = s1.replace(/[žźż]/gi, "z");
  s1 = s1.replace(/[ß]/gi, "ss");
  s1 = s1.replace(/[æ]/gi, "ae");
  return s1.toUpperCase();
};

const findWord = (s1) => {
  let start = 0;
  let end = props.dict.words.length - 1;

  while (start <= end) {
    let middle = Math.floor((start + end) / 2);
    let h = props.dict.compStr(props.dict.words[middle], s1);
    if (h === 0) {
      return { fnd: true, pos: middle, word: props.dict.words[middle] };
    } else if (h === -1) {
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }

  if (props.dict.compStr(props.dict.words[end], s1) === -1) end++;
  return { fnd: false, pos: end, word: props.dict.words[end] };
};

const find = (s1) => {
  let start = 0;
  let end = props.dict.words.length - 1;

  while (start <= end) {
    let middle = Math.floor((start + end) / 2);
    let h = props.dict.compStr(props.dict.words[middle], s1);
    if (h === 0) return true;
    else if (h === -1) start = middle + 1;
    else end = middle - 1;
  }
  return false;
};

// --- Computed ---

const selectedCategoryLabel = computed(() => {
  if (dicts.value.length === 0 || props.dictloading) {
    return 'Loading...';
  }
  const found = dicts.value.find(a => a.name === props.dict.name);
  return found ? found.name : 'Select a dictionary';
});

// --- Methods ---

const updateDict = (index) => {
  const target = dicts.value[index];
  if (!target || target.disabled) return;

  // Close dropdown upon selection
  isDropdownOpen.value = false;

  if (target.dict === null) {
    emit("update:dictloading", true);
    
    // Construct the dynamic URL for the dictionary file
    const url = new URL(`/dicts/${target.file}`, window.location.origin).href;
    
    import(/* @vite-ignore */ url).then((mod) => {
      const newDict = mod.dict;
      
      // Inject standard functions if not present in the module
      if (!newDict.find) newDict.find = find;
      if (!newDict.findWord) newDict.findWord = findWord;
      if (!newDict.cleanStr) newDict.cleanStr = cleanStr;
      if (!newDict.compStr) newDict.compStr = compStr;
      
      target.dict = newDict;
      emit("update:dict", newDict);
      emit("update:dictloading", false);
    }).catch(err => {
      console.error("Failed to load dictionary:", err);
      emit("update:dictloading", false);
    });
  } else {
    emit("update:dict", target.dict);
  }
};

onMounted(() => {
  updateDict(1); // Load default dictionary
});

</script>

<i18n locale="en">
{
    "lettersused": "Letters in alphabet"
}
</i18n>

<i18n locale="nl">
{
    "lettersused": "Letters in alfabet"
}
</i18n>