<template>

  <header class="page-header">
    <h1>{{ t('duckspeak.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('duckspeak.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <CustomDropdown
            :title="t('duckspeak.format')"
            :options="[
              { value: '0', label: t('duckspeak.ascii') },
              { value: '1', label: t('duckspeak.hex') },
              { value: '2', label: t('duckspeak.dec') }
            ]"
            v-model="selDS"
          />
        </div>
        <div class="form-horizontal">
          <textarea
            ref="codeInput"
            v-model="message"
            :placeholder="t('duckspeak.code')"
            rows="5"
          />
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <button class="btn btn-primary"  @click="encode">
            {{ t('buttons.encode') }}
          </button>
          <button class="btn btn-primary"  @click="decode">
            {{ t('buttons.decode') }}
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div v-if="result" class="button-row mb-2">
          <CopyButton 
            :content="result"
          />
        </div>
        <div
          v-if="result"
          class="resultbox"
        >
          {{ result }}
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import VCard from '@/components/generic/VCard.vue';
import CustomDropdown from '@/components/generic/CustomDropdown.vue'
import CopyButton from '@/components/generic/CopyButton.vue';

defineOptions({
  name: 'Duckspeak'
});

const { t } = useI18n();

// --- Constants ---
const COMMANDS = [
  "Nak", "Nanak",
  "Nananak", "Nanananak",
  "Nak?", "nak?",
  "Naknak", "Naknaknak",
  "Nak.", "Naknak.",
  "Naknaknaknak", "nanak",
  "naknak", "nak!",
  "nak.", "naknaknak"
];

// --- State ---
const message = ref("");
const result = ref("");
const selDS = ref("0"); // 0: ASCII, 1: Hex, 2: Dec
const errormsg = ref("");

// --- Template Ref ---
const codeInput = ref(null);
const startOpen = window.innerWidth > 768;

onMounted(() => {
  if (codeInput.value) {
    codeInput.value.focus();
  }
});

// --- Methods ---

const encode = () => {
  result.value = "";
  errormsg.value = "";
  let inputarr = null;

  try {
    // 1. Prepare input based on selection
    if (selDS.value === "0") {
      inputarr = message.value.split("");
    } else if (selDS.value === "1") {
      inputarr = message.value.match(/[0-9A-F]/ig);
    } else if (selDS.value === "2") {
      inputarr = message.value.match(/[0-9]+/g);
    }

    if (!inputarr) {
      errormsg.value = t('errors.noinput');
      return;
    }

    let encodedResult = "";

    // 2. Conversion Loop
    for (let i = 0; i < inputarr.length; i++) {
      let h = 0;

      switch (selDS.value) {
        case "0": // ASCII (Two nibbles)
          h = inputarr[i].charCodeAt(0);
          encodedResult += COMMANDS[Math.trunc(h / 16)] + " " + COMMANDS[h % 16];
          break;

        case "1": // Hex (Single nibble per char)
          h = parseInt(inputarr[i].toUpperCase(), 16);
          encodedResult += COMMANDS[h];
          break;

        case "2": // Dec (Two nibbles)
          h = parseInt(inputarr[i]);
          if (h < 0 || h > 255) {
            errormsg.value += h + t('duckspeak.invalidint') + " ";
            continue;
          }
          encodedResult += COMMANDS[Math.trunc(h / 16)] + " " + COMMANDS[h % 16];
          break;
      }
      encodedResult += " ";
    }
    
    result.value = encodedResult.trim();

  } catch (e) {
    errormsg.value = t('errors.generic');
    console.error(e);
  }
};

const decode = () => {
  result.value = "";
  errormsg.value = "";
  let hexBuffer = "";

  try {
    // Extract words that look like Duckspeak commands
    const cmds = message.value.match(/[NAKnak.?!]+/g);
    
    if (!cmds) {
      errormsg.value = t('errors.noinput');
      return;
    }

    let decodedResult = "";

    for (let i = 0; i < cmds.length; i++) {
      const val = COMMANDS.indexOf(cmds[i]);

      if (val >= 0) {
        // Build hex string from nibbles
        hexBuffer += val.toString(16).toUpperCase();

        // If we have two nibbles (one byte) or we are in Hex mode
        // Note: Hex mode (selDS "1") interprets every single command as a hex char
        if (selDS.value === "1") {
          decodedResult += hexBuffer + " ";
          hexBuffer = "";
        } else if (hexBuffer.length === 2) {
          const byteVal = parseInt(hexBuffer, 16);
          
          if (selDS.value === "0") {
            decodedResult += String.fromCharCode(byteVal);
          } else {
            decodedResult += byteVal + " ";
          }
          hexBuffer = "";
        }
      } else {
        errormsg.value = cmds[i] + t('duckspeak.invalidcmd');
      }
    }
    
    result.value = decodedResult;

  } catch (e) {
    errormsg.value = t('errors.generic');
    console.error(e);
  }
};
</script>

<i18n locale="en">
{
  "duckspeak": {
    "code": "Program code",
    "invalidint": " is not valid number\n",
    "format": "Input/output format",
    "ascii": "Text (ASCII)",
    "hex": "Hexadecimal",
    "dec": "Numbers (decimal",
    "invalidcmd": " it not duckspeak\n"
  }
}
</i18n>

<i18n locale="nl">
{
  "duckspeak": {
    "code": "Programmacode",
    "invalidint": " is een ongeldig getal\n",
    "format": "Invoer/uitvoer formaat",
    "ascii": "Tekst (ASCII)",
    "hex": "Hexadecimaal",
    "dec": "Getallen (decimaal",
    "invalidcmd": " is geen duckspeak\n"
  }
}
</i18n>