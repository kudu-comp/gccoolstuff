<template>

  <header class="page-header">
    <h1>{{ t('deadfish.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('deadfish.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="ascii">
          <span class="checkmark"></span>
          {{ t('deadfish.ascii') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="tilde">
          <span class="checkmark"></span>
          {{ t('deadfish.tilde') }}
        </label>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="debug">
          <span class="checkmark"></span>
          {{ t('deadfish.debug') }}
        </label>
        <div class="form-horizontal">
          <textarea
            ref="codeRef"
            v-model="message"
            :placeholder="t('deadfish.code')"
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
          <button class="btn btn-primary"  @click="runCode">
            {{ t('deadfish.run') }}
          </button>
          <button class="btn btn-primary"  @click="writeDeadfish(message, tilde)">
            {{ t('deadfish.write') }}
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div
          v-if="result"
          class="card resultbox"
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

// Component name is optional in script setup, 
// but can be defined via defineOptions for devtools
defineOptions({
  name: 'Deadfish'
});

const { t } = useI18n();

// --- State ---
const message = ref("");
const result = ref("");
const errormsg = ref("");
const debug = ref(false);
const tilde = ref(false);
const ascii = ref(false);

// --- Template Ref ---
// Must match the 'ref' attribute in your template (ref="codeRef")
const codeRef = ref(null);

// --- Lifecycle ---
onMounted(() => {
  if (codeRef.value) {
    codeRef.value.focus();
  }
});

// --- Methods ---

/**
 * Generates a Deadfish program.
 * @param {string} text - The input string to convert.
 * @param {boolean} isAsciiMode - If true, uses 'c' for ASCII output. If false, uses 'o' for integers.
 * @returns {string} - The resulting Deadfish program.
 */
const writeDeadfish = (text, isAsciiMode = false) => {
    let df = "";
    let accumulator = 0;
    const outputCmd = isAsciiMode ? "c" : "o";

    for (let i = 0; i < text.length; i++) {
        const target = text.charCodeAt(i);

        // Standard Deadfish can't handle values > 255
        if (target > 255) {
            console.warn(`Character '${text[i]}' (ASCII ${target}) is out of Deadfish range and will be skipped.`);
            continue;
        }

        // Navigate the accumulator to the target value
        while (accumulator !== target) {
            const squared = accumulator * accumulator;

            // Optimization: Use 's' if squaring gets us closer to target without hitting the 256 reset
            // We only square if accumulator > 1 (squaring 0 or 1 is useless)
            if (accumulator > 1 && squared <= target && squared !== 256) {
                df += "s";
                accumulator = squared;
            } else if (accumulator < target) {
                accumulator++;
                df += "i";
                // Deadfish reset rule
                if (accumulator === 256) accumulator = 0;
            } else {
                accumulator--;
                df += "d";
                // Deadfish reset rule
                if (accumulator === -1) accumulator = 0;
            }
        }

        df += outputCmd;
    }

    return result.value = df;
}

/**
 * Core Deadfish Interpreter Logic
 */
const runDeadfish = (code) => {

  /* Standard Deadfish   │   XKCD Variant   │    Meaning
    ─────────────────────┼──────────────────┼────────────────────────────────────
          i              │        x         │    Increment accumulator
          d              │        d         │    Decrement accumulator
          s              │        k         │    Square ( acc = acc * acc )
          o              │        c         │    Output accumulator, as a number
  */
    
  let acc = 0;
  let res = "";
  
  for (let c of code) {
    switch (c) {
      case "i":
      case "x":
        acc++;
        break;
      case "d":
        acc--;
        break;
      case "s":
      case "k":
        acc *= acc;
        break;
      case "o":
        if (ascii.value) {
          res += String.fromCharCode(acc);
        } else {
          res += acc + " ";
        }
        break;
      case "c": // Added "c" as the XKCD variant specified in the table comment
        res += String.fromCharCode(acc);
        break;
      default:
        // Original logic appends newline for unknown characters
        res += "\n";
    }

    // Deadfish specific reset rule
    if (acc === 256 || acc === -1) {
      acc = 0;
    }

    if (debug.value) {
      console.log(`Command: ${c} - Accumulator after command: ${acc}`);
    }
  }
  return res;
};

/**
 * Triggered by the UI to execute the code
 */
const runCode = () => {
  errormsg.value = "";
  
  try {
    // We pass message.value to the function
    result.value = runDeadfish(message.value);
  } catch (e) {
    // Localized error message
    errormsg.value = t('errors.genericerror');
    console.error(e);
  }
};
</script>


<i18n locale="en">
{
  "deadfish": {
    "debug": "Debug to console",
    "tilde": "Use c for ASCII output when coding",
    "ascii": "Force ASCII output even for o (output) command",
    "code": "Program code",
    "input": "Input variables",
    "run": "Run Deadfish",
    "write": "Write Deadfish program"
  }
}
</i18n>

<i18n locale="nl">
{
  "deadfish": {
    "code": "Programmacode",
    "tilde": "Gebruik c voor ASCII output bij het programmeren",
    "ascii": "Print altijd ASCII output ook voor het o (output) commando",
    "debug": "Debug info naar console",
    "input": "Input variabelen",
    "run": "Run Deadfish",
    "write": "Schrijf Deadfish programma"
  }
}
</i18n>