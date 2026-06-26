<template>
  <header class="page-header">
    <h1>{{ t('ciphers.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <div class="card-stack">
      <!-- 1. Intro & Selection Card -->
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div class="infoblock mb-2" v-html="t('ciphers.long')" />
        <div class="form-horizontal">
          <CustomDropdown
            :title="t('ciphers.selcipher')"
            :options="cipherOptions"
            v-model="selcp"
            @change="selCipher"
          />
          <!-- <label for="selcp">{{ t('ciphers.selcipher') }}</label>
          <select id="selcp" v-model="selcp" class="form-select" @change="selCipher">
            <option v-for="(o, idx) in cp" :key="idx" :value="idx">
              {{ o.name }}
            </option>
          </select> -->
        </div>

        <div>
          {{ explanation }}
        </div>
      </VCard>

      <!-- 2. Cipher Keys Card -->
      <VCard :title="t('labels.settings')">
        <div v-for="(item, idx) in cp[selcp].keys" :key="idx" class="mb-2">
          <!-- Text Key -->
          <div v-if="item.type === 'txt'" class="form-horizontal">
            <label>{{ labels[idx] }}</label>
            <input type="text" v-model="keys[idx]" />
          </div>

          <!-- Numeric Key -->
          <div v-if="item.type === 'num'" class="form-horizontal">
            <label>{{ labels[idx] }}</label>
            <input type="number" :min="item.min" :max="item.max" v-model.number="keys[idx]" />
          </div>

          <!-- Selection Key -->
          <div v-if="item.type === 'sel'" class="form-horizontal">
            <label>{{ labels[idx] }}</label>
            <select v-model="keys[idx]" class="form-select">
              <option v-for="o in item.sels" :key="o.ref" :value="o.ref">
                {{ o.label }}
              </option>
            </select>
          </div>

          <!-- Checkbox Key -->
          <div v-if="item.type === 'chk'">
            <input :id="'chk' + idx" type="checkbox" v-model="keys[idx]" class="form-check-input" />
            <label :for="'chk' + idx" class="form-check-label">{{ labels[idx] }}</label>
          </div>
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="expertmode">
          <span class="checkmark"></span>
          {{ expertmode ? t('ciphers.hideexpertmode') : t('ciphers.expertmode') }}
        </label>
      </VCard>

      <!-- 3. Expert Mode Card -->
      <VCard v-if="expertmode" :title="t('ciphers.expertmode')">

        <div class="expert-settings border-top pt-3">
          <div class="form-horizontal mb-2">
            <label>{{ t('labels.alphabet') }}</label>
            <input v-model="alphabet" type="text" class="form-control" />
          </div>

          <label class="checkbox-container mb-2">
            <input type="checkbox" v-model="keepcase">
            <span class="checkmark"></span>
            {{ t('ciphers.keepcase') }}
          </label>
          <label class="checkbox-container mb-2">
            <input type="checkbox" v-model="keepdiacrit">
            <span class="checkmark"></span>
            {{ t('ciphers.keepdiacrit') }}
          </label>
          <label class="checkbox-container mb-2">
            <input type="checkbox" v-model="keepunknown">
            <span class="checkmark"></span>
            {{ t('ciphers.keepunknown') }}
          </label>
          <label class="checkbox-container mb-2">
            <input type="checkbox" v-model="replacechars">
            <span class="checkmark"></span>
            {{ t('ciphers.replacechars') }}
          </label>
          <div v-if="replacechars" class="form-horizontal mt-2">
            <label>{{ t('ciphers.repl') }}</label>
            <input v-model="replacements" type="text" placeholder="J=I, U=V" />
          </div>
          <label class="checkbox-container mb-2">
            <input type="checkbox" v-model="formatoutput">
            <span class="checkmark"></span>
            {{ t('ciphers.formatoutput') }}
          </label>
          <div v-if="formatoutput">
            <div class="form-horizontal">
              <label>{{ t('ciphers.bs') }}</label>
              <input type="number" v-model.number="blocksize" min="1" max="9" class="form-control form-control-sm" />
            </div>
            <div class="form-horizontal">
              <CustomDropdown
                :title="t('ciphers.sep')"
                :options="[
                  { value : ' ', label : 'Space'},
                  { value : '-', label : '-'},
                  { value : '/', label : '/'}
                ]"
                v-model="separator"
              />
            </div>
          </div>
        </div>
      </VCard>
    </div>

    <!-- 4. Input/Output Card -->
    <div class="card-stack">
      <VCard :title="t('labels.input')">
        <textarea
          ref="messageRef"
          v-model="message"
          :placeholder="t('labels.message')"
          rows="5"
          class="mb-2"
        />

        <p v-if="errormsg" class="errormsg mb-2">{{ errormsg }}</p>

        <div class="button-row">
          <button class="btn btn-primary" @click="toEncode" :disabled="cp[selcp]?.noencode">
            {{ t('buttons.encode') }}
          </button>
          <button class="btn btn-primary" @click="toDecode" :disabled="cp[selcp]?.nodecode">
            {{ t('buttons.decode') }}
          </button>
        </div>

      </VCard>

      <VCard :title="t('labels.result')" >
        <div class="button-row mb-2">
          <CopyButton :content="result" />
        </div>
        <div v-if="result" class="resultbox">
          {{ result }}
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import * as textHelper from '@/scripts/texthelper.js';
import VCard from '@/components/generic/VCard.vue';
import CustomDropdown from '@/components/generic/CustomDropdown.vue';
import { ciphers } from "@/scripts/ciphers.js";
import CopyButton from '@/components/generic/CopyButton.vue'

const { t } = useI18n();
const route = useRoute();

// --- State ---
const selcp = ref(0);
const keys = ref([]);
const cp = ref(ciphers);
const labels = ref([]);
const modals = ref([]);
const cipher = ref("");
const expertmode = ref(false);
const keepcase = ref(false);
const keepdiacrit = ref(false);
const keepunknown = ref(false);
const replacechars = ref(false);
const formatoutput = ref(false);
const cleandecode = ref(true);
const message = ref("");
const result = ref("");
const errormsg = ref("");
const separator = ref(' ');
const blocksize = ref(5);
const alphabet = ref('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
const codealphabet = ref("");
const replacements = ref('');
const explanation = ref('');
const messageRef = ref(null);
const startOpen = window.innerWidth > 768;

const phpurl = `${window.location.protocol}//${window.location.hostname}/cipher-toolkit/encoderdecoder.php`;

const cipherOptions = ciphers.map ( (c, idx) => ({ value: idx, label : c.name }));

// --- Methods ---

const removeUnknown = (msg, alf) => {
  let s = "";
  for (let i = 0; i < msg.length; i++)
    if (alf.indexOf(msg[i]) >= 0) s += msg[i];
  return s;
};

const replaceCharacters = (msg) => {
  let arr = replacements.value.match(/[A-Za-z]=[A-Za-z]/g);
  if (arr !== null)
    for (let a of arr)
      msg = msg.replace(new RegExp(a[0], "g"), a[2]);
  return msg;
};

const cleanString = (msg, alf) => {
  if (!keepdiacrit.value) msg = textHelper.removeDiacritics(msg);
  if (!keepcase.value) msg = msg.toUpperCase();
  if (replacechars.value) msg = replaceCharacters(msg);
  if (!keepunknown.value) msg = removeUnknown(msg, alf);
  return msg;
};

const formatMessage = (msg) => {
  let s = "";
  for (let i = 0; i < msg.length; i++) {
    if ((i % blocksize.value == 0) && (i > 0)) s += separator.value;
    s += msg[i];
  }
  return s;
};

const selCipher = () => {
  const current = cp.value[selcp.value];
  result.value = "";
  errormsg.value = "";
  cipher.value = current.ref;
  cleandecode.value = current.cleandec;
  alphabet.value = current.alphabet;
  codealphabet.value = current.codealph;
  explanation.value = t("ciphers.info." + current.ref );
  keepcase.value = current.keepcase;
  keepunknown.value = current.keepunkn;
  keepdiacrit.value = current.keepdiac;
  replacechars.value = current.repl;
  replacements.value = current.replchar;

  // Init Keys
  keys.value = new Array(current.keys.length).fill("");
  labels.value = new Array(current.keys.length).fill("");
  modals.value = new Array(current.keys.length).fill(false);

  current.keys.forEach((k, i) => {
    if (k.dflt !== undefined) {
      keys.value[i] = k.dflt;
    } else {
      keys.value[i] = k.type === "num" ? 0 : k.type === "chk" ? false : k.type === "sel" ? k.sels[0].ref : "";
    }
    labels.value[i] = t("ciphers." + current.ref + ".k" + (i + 1));
  });
};

const checkKeys = () => {
  const current = cp.value[selcp.value];
  for (let i = 0; i < current.keys.length; i++) {
    if (current.keys[i].req && current.keys[i].type === "txt") {
      if (!keys.value[i] || keys.value[i].trim() === "") {
        errormsg.value = labels.value[i] + t('cperrors.isrequired');
        return false;
      }
    }
  }
  // Simplified validation check - logic matches original
  return true;
};

const toEncode = async () => {
  if (!checkKeys()) return;
  errormsg.value = "";

  const msg = cleanString(message.value.trim(), alphabet.value);
  if (!msg) { errormsg.value = t("cperrors.nothingtodo"); return; }

  const data = {
    alphabet: alphabet.value,
    removeunknown: !keepunknown.value,
    replacements: replacements.value,
    cipher: cipher.value,
    enordecode: 'encode',
    message: msg,
    transmessage: "",
    key1: keys.value[0],
    key2: keys.value[1],
    key3: keys.value[2]
  };

  try {
    const response = await fetch(phpurl, { method: 'POST', body: JSON.stringify(data) });
    const json = await response.json();
    result.value = formatoutput.value ? formatMessage(json.transmessage) : json.transmessage;
  } catch (e) {
    errormsg.value = t('ciphers.errenc');
  }
};

const toDecode = async () => {
  if (!checkKeys()) return;
  errormsg.value = "";

  const alf = codealphabet.value || alphabet.value;
  const msg = cleandecode.value ? cleanString(message.value.trim(), alf) : message.value;
  if (!msg) { errormsg.value = t("cperrors.nothingtodo"); return; }

  const data = {
    alphabet: alphabet.value,
    removeunknown: !keepunknown.value,
    replacements: replacements.value,
    cipher: cipher.value,
    enordecode: 'decode',
    message: "",
    transmessage: msg,
    key1: keys.value[0],
    key2: keys.value[1],
    key3: keys.value[2]
  };

  try {
    const response = await fetch(phpurl, { method: 'POST', body: JSON.stringify(data) });
    const json = await response.json();
    result.value = json.message;
  } catch (e) {
    errormsg.value = t('ciphers.errdec');
  }
};

// --- Lifecycle ---
onMounted(() => {
  if (route.params.cphr) {
    const found = cp.value.findIndex(e => e.ref === route.params.cphr);
    selcp.value = found >= 0 ? found : 0;
  }
  selCipher();
  messageRef.value?.focus();
});
</script>

<style scoped>
.expert-settings {
  background-color: var(--bg-light);
  border-radius: 4px;
}
.settings-grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
</style>

<!-- 
All language definitions 
But info and long should be global as they are used in menus and search 
-->
<i18n locale="en">
{
  "ciphers": {
    "cipher": "Cipher",
    "selcipher": "Select cipher",
    "keepcase": "Keep lowercase characters",
    "keepdiacrit": "Keep diacritics (do not change to normal letters)",
    "keepunknown": "Keep letters that are not in the alphabet",
    "replacechars": "Replace characters as specified below",
    "formatoutput": "Format output in blocks with separator as specified below",
    "expertmode": "Expert mode",
    "hideexpertmode": "Standard mode",
    "gensq": "Generate square",
    "genalp": "Generate alphabet",
    "errdec": "Message could not be decoded, please check.",
    "errenc": "Message could not be encoded, please check.",
    "sep": "Separator",
    "bs": "Block size",
    "repl": "Replacements",
    "adfgvx": { "k1": "Square", "k2": "Column transposition key" },
    "affine": { "k1": "A (greater than 1)", "k2": "B (greater than 0)" },
    "amsco": { "k1": "Column transposition key:" },
    "autokey": { "k1": "Enter key:" },
    "bacon": { "k1": "Version (1 or 2)", "k2": "Value to use for A", "k3": "Value to use for B" },
    "bazeries": { "k1": "Square 1", "k2": "Square 2", "k3": "Numeric key" },
    "beaufort": { "k1": "Key (mandatory)" },
    "bifid": { "k1": "Enter key" },
    "burrowswheeler": { "k1": "End of file character" },
    "cadenus": { "k1": "Columnar transposition key" },
    "caesar": { "k1": "Shift" },
    "rot13": { "k1": "Shift" },
    "chaocipher": { "k1": "Left starting alphabet", "k2": "Right starting alphabet" },
    "collon": {
      "k1": "Select order of digrams", "k2": "Polybius square", "k3": "Period:",
      "s1": {
        "rfcl": "Row first, column last", "rlcl": "Row last, column last", "rfcf": "Row first, column first",
        "rlcf": "Row last, column first", "clrl": "Column last, row last", "clrf": "Column last, row first",
        "cfrf": "Column first, row first", "cfrl": "Column first, row last"
      }
    },
    "columnartransposition": { "k1": "Columnar transposition key" },
    "condi": { "k1": "Key for the cipher alphabet", "k2": "Initial offset" },
    "digrafid": { "k1": "Key first grid", "k2": "Key second grid", "k3": "Period (required)" },
    "foursquare": { "k1": "Square 1", "k2": "Square 2" },
    "graycode": { "k1": "Number of digits:" },
    "gromark": { "k1": "Key (required)", "k2": "Primer (5 digits)" },
    "gronsfeld": { "k1": "Enter key (numeric)" },
    "monomedinome": { "k1": "Key to reorder the alphabet", "k2": "Key for transposition (min 10 chars)" },
    "morbit": { "k1": "Enter key (9 letters)" },
    "myszkowski": { "k1": "Key for columnar transposition (should contain double letters):" },
    "nicodemus": { "k1": "Key for columnar transposition and Vigenere:" },
    "nesw": { "k1": "Square" },
    "nihilist": { "k1": "Polybius square", "k2": "Key to be added" },
    "nihilisttransposition": {
      "k1": "Key for columnar transposition", "k2": "Read by rows or columns",
      "s1": { "row": "Rows", "col": "Columns" }
    },
    "onetimepad": { "k1": "Enter pad" },
    "phillips": { "k1": "Polybius square" },
    "playfair": { "k1": "Polybius square" },
    "polybius": { "k1": "Square", "k2": "Rows", "k3": "Columns" },
    "pollux": { "k1": "Characters for .", "k2": "Characters for -", "k3": "Characters for x" },
    "porta": { "k1": "Enter key (required)" },
    "portax": { "k1": "Enter key" },
    "ragbaby": { "k1": "Enter key" },
    "railfence": { "k1": "Number of rails (greater than 1):", "k2": "Initial offset" },
    "redefence": { "k1": "Number of rails (greater than 1):", "k2": "Initial offset", "k3": "Sequence of rails" },
    "rot5": { "k1": "Shift" },
    "rot47": { "k1": "Shift" },
    "scytale": { "k1": "Number of turns" },
    "skip": { "k1": "Skip value", "k2": "Start at" },
    "substitution": { "k1": "Substitutes" },
    "syllabary": { "k1": "Key to generate square", "k2": "Left (row) labels", "k3": "Top (column) labels" },
    "trevanion": { "k1": "Punctation", "k2": "Offset" },
    "trifid": { "k1": "Enter key" },
    "trisquare": { "k1": "Square 1", "k2": "Square 2", "k3": "Square 3" },
    "vatsyayana": { "k1": "First half", "k2": "Second half" },
    "vigenere": { "k1": "Enter key (required)" },
    "zygazyfa": { "k1": "Enter key" }
  },
  "cperrors" : {
    "nothingtodo": "No message to encode or decode.",
    "isrequired" : " is required.",
    "mustbegreaterthen1" : " must be greater than 1.",
    "mustbegreaterthen0" : " must be greater than 0.",
    "mustbe1or2": " must be 1 or 2.",
    "mustbe1char": " must be one character.",
    "mustbeeof": " must be one character that is not in the alphabet.",
    "mustbenumeric": " must be a number.",
    "mustbehalfalf" : " must be half the length of the alphabet.",
    "mustbe10ormore" : " must be 10 or more characters.",
    "mustbe9": " must be 9 characters.",
    "msg25key": "Message must be 25 times de key length long.",
    "msgmustbesquareofkey" : " message size must be square of key length.",
    "keylongerthenmsg" : " must be at least as long as the message.",
    "keymustbesqrroot" : " must be square root of length of alphabet.",
    "keymustbealph" : " must be the same length as the alphabet.",
    "keyfromalph" : " must be composed of the alphabet.",
    "keymustbenumeric" : " must be numeric."
  }
}
</i18n>

<i18n locale="nl">
{
  "ciphers": {
    "cipher": "Geheimschrift",
    "selcipher": "Selecteer cipher",
    "keepcase": "Behoud kleine letters",
    "keepdiacrit": "Behoud diakrieten (vervang niet door normale letters)",
    "keepunknown": "Behoud letters die niet voorkomen in het alfabet",
    "replacechars": "Vervang de letters zoals hieronder opgegeven",
    "formatoutput": "Verdeel de output in blokken zoals hieronder opgegeven",
    "expertmode": "Expert mode",
    "hideexpertmode": "Standaard mode",
    "gensq": "Genereer vierkant",
    "genalp": "Genereer alfabet",
    "errdec": "Bericht kan niet worden gedecodeerd. Er gaat iets fout.",
    "errenc": "Bericht kan niet worden gecodeerd. Er gaat iets fout.",
    "sep": "Scheidingsteken",
    "bs": "Lengte blokken",
    "repl": "Vervangingen",
    "adfgvx": { "k1": "Vierkant", "k2": "Transpositiesleutel" },
    "affine": { "k1": "A (groter dan 1)", "k2": "B (groter dan 0)" },
    "amsco": { "k1": "Transpositiesleutel" },
    "autokey": { "k1": "Sleutel" },
    "bacon": { "k1": "Versie (1 of 2)", "k2": "Vervang A door", "k3": "Vervang B door" },
    "bazeries": { "k1": "Vierkant 1", "k2": "Vierkant 2", "k3": "Transpositiesleutel (numeriek)" },
    "beaufort": { "k1": "Sleutel (verplicht)" },
    "bifid": { "k1": "Transpositiesleutel" },
    "burrowswheeler": { "k1": "End-of-file karakter" },
    "cadenus": { "k1": "Transpositiesleutel" },
    "caesar": { "k1": "Verschuiving" },
    "rot13": { "k1": "Verschuiving" },
    "chaocipher": { "k1": "Linker startalfabet", "k2": "Rechter startalfabet" },
    "collon": {
      "k1": "Volgorde van bigrams:",
      "k2": "Polybiusvierkant",
      "k3": "Periode",
      "s1": {
        "rfcl": "Rij eerst, kolom laatst",
        "rlcl": "Rij laatst, kolom laatst",
        "rfcf": "Rij eerst, kolom eerst",
        "rlcf": "Rij laatst, kolom eerst",
        "clrl": "Kolom laatste, rij laatst",
        "clrf": "Kolom laatste, rij eerst",
        "cfrf": "Kolom eerst, rij eerst",
        "cfrl": "Kolom eerst, rij laatst"
      }
    },
    "columnartransposition": { "k1": "Transpositiesleutel" },
    "condi": { "k1": "Sleutel voor het cijferalfabet", "k2": "Start met verschuiving" },
    "digrafid": { "k1": "Sleutel tableau 1", "k2": "Sleutel tableau 2", "k3": "Periode (verplicht)" },
    "foursquare": { "k1": "Vierkant 1", "k2": "Vierkant 2" },
    "graycode": { "k1": "Aantal bits" },
    "gromark": { "k1": "Sleutel (verplicht)", "k2": "Primer (5 cijfers)" },
    "gronsfeld": { "k1": "Sleutel (numeriek)" },
    "monomedinome": { "k1": "Sleutel voor het alfabet", "k2": "Sleutel voor rij/kolom (min 10 letters)" },
    "morbit": { "k1": "Sleutel (9 letters)" },
    "myszkowski": { "k1": "Transpositiesleutel (met dubbele letters)" },
    "nesw": { "k1": "Vierkant" },
    "nicodemus": { "k1": "Sleutel" },
    "nihilist": { "k1": "Polybius vierkant", "k2": "Sleutel om op te tellen" },
    "nihilisttransposition": {
      "k1": "Transpositiesleutel",
      "k2": "Per kolom / per rij",
      "s1": { "row": "Rij", "col": "Kolom" }
    },
    "onetimepad": { "k1": "Pad" },
    "phillips": { "k1": "Polybius vierkant" },
    "playfair": { "k1": "Polybius vierkant" },
    "polybius": { "k1": "Vierkant", "k2": "Rijen", "k3": "Kolommen" },
    "pollux": { "k1": "Tekens voor .", "k2": "Tekens voor -", "k3": "Tekens voor x" },
    "porta": { "k1": "Sleutel (verplicht)" },
    "portax": { "k1": "Transpositiesleutel" },
    "ragbaby": { "k1": "Sleutel" },
    "railfence": { "k1": "Aantal rails (groter dan 1)", "k2": "Offset" },
    "redefence": { "k1": "Aantal rails (groter dan 1)", "k2": "Offset", "k3": "Volgorde van de rails" },
    "rot5": { "k1": "Verschuiving" },
    "rot47": { "k1": "Verschuiving" },
    "scytale": { "k1": "Aantal wikkelingen" },
    "skip": { "k1": "Skipwaarde", "k2": "Beginpositie" },
    "substitution": { "k1": "Cijferalfabet" },
    "syllabary": { "k1": "Sleutel voor tabel", "k2": "Linker (rij) labels", "k3": "Top (kolom) labels" },
    "trevanion": { "k1": "Leestekens", "k2": "Offset" },
    "trifid": { "k1": "Sleutel" },
    "trisquare": { "k1": "Vierkant 1", "k2": "Vierkant 2", "k3": "Vierkant 3" },
    "vatsyayana": { "k1": "Eerste helft van de paren", "k2": "Tweede helft van de paren" },
    "vigenere": { "k1": "Sleutel (verplicht)" },
    "zygazyfa": { "k1": "Sleutel" }
},
"cperrors" : {
    "nothingtodo": "Geen bericht om te coderen of te decoderen.",
    "isrequired" : " is verplicht.",
    "mustbegreaterthen1" : " moet groter dan 1 zijn.",
    "mustbegreaterthen0" : " moet groter dan 0 zijn.",
    "mustbe1or2": " moet 1 of 2 zijn.",
    "mustbe1char": " moet precies 1 teken zijn.",
    "mustbeeof": " moet een teken zijn dat niet in het alfabet voorkomt.",
    "mustbenumeric": " moet een getal zijn.",
    "mustbehalfalf" : " moet de halve lengte van het alfabet zijn.",
    "msg25key": "Bericht moet 25 keer de lengte van de sleutel lang zijn.",
    "mustbe10ormore" : " moet 10 of meer tekens lang zijn.",
    "mustbe9": " moet precies 9 tekens lang zijn.",
    "msgmustbesquareofkey" : "Bericht moet het kwadraat van de lengte van de sleutel lang zijn.",
    "keylongerthenmsg" : " moet net zo lang of langer zijn dan de lengte van het bericht.",
    "keymustbesqrroot" : " sleutel moet de wortel van de lengte van het alfabet lang zijn.",
    "keymustbealph" : " moet dezelfde lengte hebben als het alfabet.",
    "keyfromalph" : " moet zijn samengesteld uit het alfabet.",
    "keymustbenumeric" : " moet numeriek zijn."
  }
}
</i18n>