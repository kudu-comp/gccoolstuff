<template>
  <header class="page-header">
    <h1>{{ $t('substcipher.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="$t('labels.intro')">
      <div v-html="$t('substcipher.long')" />
    </VCard>
    <VCard :title="$t('labels.settings')">
      <div class="form-group-vertical">
        <div class="radio-group">
          <label>{{ $t('substcipher.highlight') }}</label>
          <div class="radio-options-vertical">
            <label class="radio-item">
              <input type="radio" value="red" v-model="highlightflag">
              <span class="radio-mark"></span> {{ $t('colors.red') }}
            </label>
            <label class="radio-item">
              <input type="radio" value="blue" v-model="highlightflag">
              <span class="radio-mark"></span> {{ $t('colors.blue') }}
            </label>
            <label class="radio-item">
              <input type="radio" value="yellow" v-model="highlightflag">
              <span class="radio-mark"></span> {{ $t('colors.yellow') }}
            </label>
            <label class="radio-item">
              <input type="radio" value="bold" v-model="highlightflag">
              <span class="radio-mark"></span> {{ $t('highlights.bold') }}
            </label>
            <label class="radio-item">
              <input type="radio" value="upper" v-model="highlightflag">
              <span class="radio-mark"></span> {{ $t('highlights.upper') }}
            </label>
          </div>
        </div>
        <div class="radio-group">
          <label>{{ $t('language') }}</label>
          <div class="radio-options-vertical">
            <label class="radio-item">
              <input type="radio" value="en" v-model="language" @change="setLanguage">
              <span class="radio-mark"></span> {{ $t('languages.english') }}
            </label>
            <label class="radio-item">
              <input type="radio" value="nl" v-model="language" @change="setLanguage">
              <span class="radio-mark"></span> {{ $t('languages.dutch') }}
            </label>
            <label class="radio-item">
              <input type="radio" value="de" v-model="language" @change="setLanguage">
              <span class="radio-mark"></span> {{ $t('languages.german') }}
            </label>
            <label class="radio-item">
              <input type="radio" value="fr" v-model="language" @change="setLanguage">
              <span class="radio-mark"></span> {{ $t('languages.french') }}
            </label>
            <label class="radio-item">
              <input type="radio" value="es" v-model="language" @change="setLanguage">
              <span class="radio-mark"></span> {{ $t('languages.spanish') }}
            </label>
          </div>
        </div>
          <label class="checkbox-container">
            <input type="checkbox" v-model="remdiacr">
            <span class="checkmark"></span>
            {{$t('wordvalue.replacediac')}}
          </label>
          <label class="checkbox-container">
            <input type="checkbox" v-model="casesens">
            <span class="checkmark"></span>
            {{$t('substcipher.casesens')}}
          </label>
      </div>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="$t('labels.input')">
      <div class="form-group-vertical">
        <div class="input-wrapper mb-2">
          <label
          >{{ $t('substcipher.orig') }}</label>
          <input
            v-model="from"
            type="text"
            size="50"
            @keyup="replaceInput"
          >{{ error1 }}
          <label
          >{{ $t('substcipher.repl') }}</label>
          <input
            v-model="to"
            type="text"
            size="50"
            @keyup="replaceInput"
          >{{ error2 }}
          <label
          >{{ $t('labels.input') }}</label>
          <textarea
            ref="messageRef"
            v-model="message"
            :placeholder="$t('labels.message')"
            rows="5"
            @keyup="replaceInput"
          />
        </div>
      </div>
      <div class="button-row">
        <button id="hint1" class="btn btn-primary"  @click="printHints">
          {{ $t('substcipher.get') }}
        </button>
        <button id="hint2" class="btn btn-primary"  @click="applyHints">
          {{ $t('substcipher.apply') }}
        </button>
      </div>
    </VCard>
     <VCard :title="$t('labels.result')">
        <p
          class="col-6 card resultbox"
          v-html="result"
        />
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="$t('substcipher.hint')">
      <div v-html="hints" />      
    </VCard>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as textHelper from '@/scripts/texthelper.js';
import VCard from '@/components/generic/VCard.vue';

defineOptions({
  name: 'SubstCipher'
});

const { t } = useI18n();

// --- State (formerly data) ---
const alphabet = ref("");
const from = ref("");
const to = ref("");
const error1 = ref("");
const error2 = ref("");
const input = ref("");
const message = ref("");
const highlightflag = ref("red");
const casesens = ref(false);
const remdiacr = ref(true);
const result = ref("");
const percentages = ref([]);
const freq = ref("");
const freqperc = ref([]);
const hints = ref("");
const language = ref("nl");

// --- Template Ref ---
const messageRef = ref(null);

// --- Methods ---

const checkDouble = (str) => {
  for (let i = 0; i < str.length; i++) {
    if (str.indexOf(str[i], i + 1) > 0) return true;
  }
  return false;
};

const setLanguage = () => {
  switch (language.value) {
    case "nl":
      alphabet.value = "abcdefghijklmnopqrstuvwxyz";
      freq.value = "enatirodslgvhkmubpwjzcfxyq";
      freqperc.value = ["18.9", "10.0", "7.5", "6.8", "6.5", "6.4", "6.1", "6.0", "3.7", "3.6", "3.4", "2.9", "2.4", "2.3", "2.2", "2.0", "1.58", "1.57", "1.52", "1.46", "1.39", "1.24", "0.81", "0.04", "0.04", "0.02"];
      break;
    case "en":
      alphabet.value = "abcdefghijklmnopqrstuvwxyz";
      freq.value = "etaoinshrdlucmwfgypbvkxjqz";
      freqperc.value = ["13.0", "9.1", "8.2", "7.5", "7.0", "6.7", "6.3", "6.1", "6.0", "4.3", "4.0", "2.8", "2.8", "2.4", "2.4", "2.2", "2.0", "2.0", "1.97", "1.49", "0.98", "0.77", "0.15", "0.15", "0.10", "0.08"];
      break;
    case "de":
      alphabet.value = "abcdefghijklmnopqrstuvwxyzäöüß";
      freq.value = "ensraitdhulgcomwbfkzüvpäößjyxq";
      freqperc.value = ["16.4", "9.8", "7.2", "7.0", "6.5", "6.5", "6.2", "5.1", "4.6", "4.2", "3.4", "3.0", "2.7", "2.6", "2.5", "1.9", "1.8", "1.7", "1.4", "1.1", "1.0", "0.9", "0.7", "0.6", "0.4", "0.3", "0.27", "0.04", "0.03", "0.02"];
      break;
    case "fr":
      alphabet.value = "abcdefghijklmnopqrstuvwxyzàâœçéêèëîïôùû";
      freq.value = "esaitnruoldcmpvéqfbghjàxzèêyçkûùâwîôœëï";
      freqperc.value = ["14.7", "7.9", "7.6", "7.5", "7.2", "7.1", "6.7", "6.3", "5.8", "5.5", "3.7", "3.3", "3.0", "2.5", "1.83", "1.05", "1.36", "1.06", "0.90", "0.87", "0.74", "0.61", "0.49", "0.43", "0.33", "0.27", "0.22", "0.13", "0.09", "0.07", "0.06", "0.06", "0.05", "0.05", "0.05", "0.02", "0.02", "0.01", "0.01"];
      break;
    case "es":
      alphabet.value = "abcdefghijklmnopqrstuvwxyzáéíñóúü";
      freq.value = "eaosrnidltcmupbgvyqóíhfájzéñxüwúk";
      freqperc.value = ["12.2", "11.5", "8.6", "8.0", "6.8", "6.7", "6.2", "5.0", "4.9", "4.6", "4.0", "3.1", "2.9", "2.5", "2.2", "1.77", "1.14", "1.00", "0.88", "0.83", "0.73", "0.70", "0.69", "0.50", "0.49", "0.46", "0.43", "0.31", "0.22", "0.17", "0.02", "0.01", "0,01"];
      break;
  }
  printHints();
};

const printHints = () => {
  let countletters = [];
  let length = 0;

  for (let i = 0; i < message.value.length; i++) {
    if (" \n\r\t".indexOf(message.value[i]) >= 0) continue;
    length++;

    const charToCount = casesens.value ? message.value[i] : message.value[i].toLowerCase();
    const idx = countletters.findIndex((c) => c.char === charToCount);

    if (idx < 0) {
      countletters.push({ char: charToCount, count: 1 });
    } else {
      countletters[idx].count++;
    }
  }

  const calculatedPercentages = countletters.map(item => ({
    char: item.char,
    count: (item.count / length) * 100
  }));

  calculatedPercentages.sort((a, b) => b.count - a.count);
  percentages.value = calculatedPercentages;

  let html = "<div class='table-responsive'><table class='p-table'><tbody><tr><td>Letter</td>";
  for (let i = 0; i < freq.value.length; i++) html += "<td>" + freq.value[i] + "</td>";
  html += "</tr><tr><td>Frequency</td>";
  for (let i = 0; i < freqperc.value.length; i++) html += "<td>" + freqperc.value[i] + "</td>";
  html += "</tr><tr><td>Hint letters</td>";
  for (let i = 0; i < percentages.value.length; i++) html += "<td>" + percentages.value[i].char + "</td>";
  html += "</tr><tr><td>Hint freq</td>";
  for (let i = 0; i < percentages.value.length; i++) html += "<td>" + percentages.value[i].count.toFixed(1) + "</td>";
  html += "</tr></tbody></table><div>";
  
  hints.value = html;
};

const applyHints = () => {
  printHints();
  from.value = freq.value.slice(0, 8);
  let toVal = "";
  for (let i = 0; i < Math.min(percentages.value.length, 8); i++) {
    toVal += percentages.value[i].char;
  }
  to.value = toVal;
  replaceInput();
};

const replaceInput = () => {
  error1.value = "";
  error2.value = "";
  
  const toStr = !casesens.value ? to.value.toLowerCase() : to.value;
  const hmsg = remdiacr.value ? textHelper.removeDiacritics(message.value) : message.value;

  if (to.value.length !== from.value.length) {
    error1.value = t('substcipher.errorlength');
    error2.value = t('substcipher.errorlength');
  } else if (checkDouble(to.value)) {
    error2.value = t('substcipher.errordouble');
  } else if (checkDouble(from.value)) {
    error1.value = t('substcipher.errordouble');
  } else {
    let html = "";
    for (let i = 0; i < hmsg.length; i++) {
      const char = hmsg[i];
      const lookupChar = casesens.value ? char : char.toLowerCase();
      const idx = toStr.indexOf(lookupChar);

      if (idx >= 0) {
        let c = from.value[idx];
        // Handle case preservation if not case sensitive
        if (!casesens.value && char === char.toUpperCase() && char !== char.toLowerCase()) {
          c = c.toUpperCase();
        }

        switch (highlightflag.value) {
          case 'red':
          case 'yellow':
          case 'blue':
            html += `<span style="color: ${highlightflag.value}">${c}</span>`;
            break;
          case 'bold':
            html += `<b>${c}</b>`;
            break;
          case 'uppercase':
            html += c.toUpperCase();
            break;
        }
      } else {
        if (char === "<") html += "&lt;";
        else if (char === ">") html += "&gt;";
        else if (char === "&") html += "&amp;";
        else if (char === "\n") html += "<br>";
        else html += char;
      }
    }
    result.value = html;
  }
};

// --- Lifecycle & Watchers ---

onMounted(() => {
  if (messageRef.value) messageRef.value.focus();
  setLanguage();
});

watch(language, () => {
  setLanguage();
});
</script>

<style scoped>
.result {
  word-wrap: break-word;
}
</style>
