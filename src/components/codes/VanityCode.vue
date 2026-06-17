<template>

  <header class="page-header">
    <h1>{{ t('vanitycode.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.intro')">
      <div v-html="t('vanitycode.long')" />
      <img width="200px" max-width="100%" src="~@\assets\images\vanitycode.png">
    </VCard>
    <VCard :title="t('labels.settings')">
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="spaces">
        <span class="checkmark"></span>
        {{ t('vanitycode.spaces') }}
      </label>
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="ignorespaces">
        <span class="checkmark"></span>
        {{ t('vanitycode.ignorespaces') }}
      </label>
      <div class="radio-group">
        <label>{{ t('labels.selaction') }}</label>
        <div class="radio-options">
          <label class="radio-item">
            <input type="radio" value="0" v-model="sel">
            <span class="radio-mark"></span> {{ t('buttons.encode') }}
          </label>
          <label class="radio-item">
            <input type="radio" value="1" v-model="sel">
            <span class="radio-mark"></span> {{ t('buttons.decode') }}
          </label>
        </div>
      </div>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.input')">
      <textarea
        v-model="msg"
        :placeholder="t('labels.message')"
        rows="5"
        class="mb-2"
        @input="updateResult"
      />
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <div class="button-row">
        <button class="btn btn-primary" id="btn1" @click="addSpaces()">{{t('vanitycode.addspaces')}}</button>
      </div>
      <!-- Result area or use v-html -->
    </VCard>
    <VCard :title="t('labels.result')">
      <div v-if="result" class="card resultbox" >
        {{ result }}
      </div>
    </VCard>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import VCard from '@/components/generic/VCard.vue';

defineOptions({
  name: "VanityCode"
});

const { t } = useI18n();

// --- Static Data ---
const vanity = [
  { "char": " ", "code": "1" }, { "char": "a", "code": "2" }, { "char": "b", "code": "22" },
  { "char": "c", "code": "222" }, { "char": "d", "code": "3" }, { "char": "e", "code": "33" },
  { "char": "f", "code": "333" }, { "char": "g", "code": "4" }, { "char": "h", "code": "44" },
  { "char": "i", "code": "444" }, { "char": "j", "code": "5" }, { "char": "k", "code": "55" },
  { "char": "l", "code": "555" }, { "char": "m", "code": "6" }, { "char": "n", "code": "66" },
  { "char": "o", "code": "666" }, { "char": "p", "code": "7" }, { "char": "q", "code": "77" },
  { "char": "r", "code": "777" }, { "char": "s", "code": "7777" }, { "char": "t", "code": "8" },
  { "char": "u", "code": "88" }, { "char": "v", "code": "888" }, { "char": "w", "code": "9" },
  { "char": "x", "code": "99" }, { "char": "y", "code": "999" }, { "char": "z", "code": "9999" },
  { "char": "1", "code": "11" }, { "char": "2", "code": "2222" }, { "char": "3", "code": "3333" },
  { "char": "4", "code": "4444" }, { "char": "5", "code": "5555" }, { "char": "6", "code": "6666" },
  { "char": "7", "code": "77777" }, { "char": "8", "code": "8888" }, { "char": "9", "code": "9999" }
];

// --- Reactive State (Inputs) ---
const msg = ref("");
const sel = ref("1"); // "0" for Encode, "1" for Decode
const spaces = ref(true);
const ignorespaces = ref(true);

// --- Computed Logic ---

const translation = computed(() => {
  let outputText = "";
  let errorChars = "";
  const currentMsg = msg.value;
  const useSpaces = spaces.value;

  if (!currentMsg) return { text: "", error: "" };

  if (sel.value === "0") {
    // ENCODING LOGIC
    for (let i = 0; i < currentMsg.length; i++) {
      const char = currentMsg[i].toLowerCase();
      if (char === " " && ignorespaces.value) continue;

      const found = vanity.find((item) => item.char === char);
      if (!found) {
        errorChars += currentMsg[i] + " ";
        continue;
      }
      outputText += found.code;
      if (useSpaces && i < currentMsg.length - 1) outputText += " ";
    }
  } else {
    // DECODING LOGIC
    const codes = currentMsg.trim().split(/\s+/);
    for (let c = 0; c < codes.length; c++) {
      const found = vanity.find((item) => item.code === codes[c]);
      if (!found) {
        errorChars += codes[c] + " ";
        continue;
      }
      outputText += found.char;
      if (useSpaces && c < codes.length - 1) outputText += " ";
    }
  }

  // Determine localized error message
  let finalError = "";
  if (errorChars) {
    const errorPrefix = sel.value === "0"
      ? t('vanitycode.unknownchar')
      : t('vanitycode.unknowncode');
    finalError = `${errorPrefix}: ${errorChars.trim()}`;
  }

  return {
    text: outputText,
    error: finalError
  };
});

// Helper computed properties for use in the template
const result = computed(() => translation.value.text);
const errormsg = computed(() => translation.value.error);

// --- Actions (User interactions that change input) ---

const addSpaces = () => {
  // We modify the input ref, which triggers the computed 'translation' automatically
  const matches = msg.value.match(/1{1,4}|2{1,4}|3{1,4}|4{1,4}|5{1,4}|6{1,4}|7{1,4}|8{1,4}|9{1,4}|[^1-9]+/gm);
  if (matches) {
    msg.value = matches.join(" ");
  }
};
</script>

<style scoped>
img { max-width: 100%; max-height: 200px; display: block; margin: 0 auto; }
</style>
