<template>

  <header class="page-header">
    <h1>{{ $t('deadfish.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('deadfish.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="debug">
          <span class="checkmark"></span>
          {{ $t('brainfuck.debug') }}
        </label>
        <div class="form-horizontal">
          <textarea
            ref="codeRef"
            v-model="message"
            :placeholder="$t('brainfuck.code')"
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
            {{ $t('brainfuck.run') }}
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="$t('labels.result')">
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
      case "c": // Added "c" as the XKCD variant specified in the table comment
        res += acc + " ";
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

