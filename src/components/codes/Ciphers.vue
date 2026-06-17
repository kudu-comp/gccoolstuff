<template>
  <header class="page-header">
    <h1>{{ t('ciphers.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <div class="card-stack">
      <!-- 1. Intro & Selection Card -->
      <VCard :title="t('labels.intro')">
        <div class="infoblock mb-3" v-html="t('ciphers.long')" />

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

        <div class="mt-3 p-3 bg-light border rounded small">
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

const { t } = useI18n({
  useScope: 'local'
});
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
  explanation.value = t("ciphers." + current.ref + ".info");
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

<i18n locale="en">

</i18n>

<i18n locale="nl">

</i18n>