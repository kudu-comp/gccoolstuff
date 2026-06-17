<template>

  <header class="page-header">
    <h1>{{ t('beatnik.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('beatnik.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <CustomDropdown
            :options="alphabets"
            v-model="selectedalphabet"
            :title="t('labels.alphabet')"
          />
        </div>
        <div class="form-horizontal">
          <label>{{ t('beatnik.input') }}</label>
          <input type="text" v-model="input">
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="debug">
          <span class="checkmark"></span>
          {{ t('beatnik.debug') }}
        </label>
        <div class="form-horizontal">
          <textarea
            ref="codeInput"
            v-model="message"
            :placeholder="t('beatnik.code')"
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
          <button class="btn btn-primary"  @click="runBeatnik">
            {{ t('brainfuck.run') }}
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
import * as textHelper from '@/scripts/texthelper.js';
import VCard from '@/components/generic/VCard.vue';
import CustomDropdown from '@/components/generic/CustomDropdown.vue'

defineOptions({
  name: 'Beatnik'
});

const { t } = useI18n();

// --- State ---
const message = ref("");
const result = ref("");
const input = ref("");
const debug = ref(false);
const errormsg = ref("");
const selectedalphabet = ref("Scrabble English");
const alphabets = ref([]);

// --- Template Ref ---
const codeRef = ref(null);

// --- Lifecycle ---
onMounted(() => {
  if (codeRef.value) {
    codeRef.value.focus();
  }
  // Load alphabet options from helper
  alphabets.value = textHelper.extalphabets.slice(1).map(a => ({ label: a.name + " - " + a.alphabet, value: a.name }));
});

// --- Interpreter Logic ---
const runBeatnik = () => {
  // Reset outputs
  result.value = "";
  errormsg.value = "";
  
  let stack = [];
  let a1, a2, n;

  try {
    // 1. Tokenize input message into words
    const cmds = message.value.match(/[A-Z]+/ig);
    if (!cmds) {
      console.warn("Beatnik: No commands found in message.");
      return;
    }

    // 2. Tokenize program input (characters)
    const inputs = input.value.match(/[^\s]{1}/ig) || [];
    let nextinput = 0;

    // 3. Execution Loop
    for (let i = 0; i < cmds.length; i++) {
      // Calculate Scrabble score of the current word
      const cmd = textHelper.wordValue(cmds[i], false, false, selectedalphabet.value);

      if (debug.value) {
        console.log(`Command: ${cmds[i]} Value: ${cmd} Pointer: ${i}`);
      }

      switch (cmd) {
        case 5:
          // Push next word's value on stack
          stack.push(textHelper.wordValue(cmds[++i], false, false, selectedalphabet.value));
          break;
        case 6:
          // Pop stack and discard
          stack.pop();
          break;
        case 7:
          // Pop two numbers and add them, push result
          stack.push(stack.pop() + stack.pop());
          break;
        case 8:
          // Input a character and push its value
          if (nextinput >= inputs.length) throw new Error("Not enough inputs");
          stack.push(inputs[nextinput++].charCodeAt(0));
          break;
        case 9:
          // Pop number and output its character
          result.value += String.fromCharCode(stack.pop());
          break;
        case 10:
          // Pop two numbers, subtract first from second, push result
          stack.push(-stack.pop() + stack.pop());
          break;
        case 11:
          // Pop two numbers, swap them
          a1 = stack.pop();
          a2 = stack.pop();
          stack.push(a1);
          stack.push(a2);
          break;
        case 12:
          // Duplicate top of stack
          a1 = stack.pop();
          stack.push(a1);
          stack.push(a1);
          break;
        case 13:
          // Pop and skip ahead n words if zero
          a1 = stack.pop();
          if (a1 === 0) {
            n = textHelper.wordValue(cmds[++i], false, false, selectedalphabet.value);
            i += n;
          }
          break;
        case 14:
          // Pop and skip ahead n words if not zero
          a1 = stack.pop();
          if (a1 !== 0) {
            n = textHelper.wordValue(cmds[++i], false, false, selectedalphabet.value);
            i += n;
          }
          break;
        case 15:
          // Skip back n words if zero
          a1 = stack.pop();
          if (a1 === 0) {
            n = textHelper.wordValue(cmds[i + 1], false, false, selectedalphabet.value);
            i = i - n;
          }
          break;
        case 16:
          // Skip back n words if not zero
          a1 = stack.pop();
          if (a1 !== 0) {
            n = textHelper.wordValue(cmds[i + 1], false, false, selectedalphabet.value);
            i = i - n;
          }
          break;
        case 17:
          // Halt
          i = cmds.length;
          break;
        default:
          if (debug.value) console.log("Comment: " + cmds[i]);
      }

      if (debug.value) {
        console.log(`Stack: [${stack}] | Pointer: ${i}`);
      }
    }
  } catch (e) {
    errormsg.value = t('errors.generic');
    console.error("Beatnik Error:", e);
  }
};
</script>

<i18n locale="en">
{
  "beatnik": {
    "debug": "Debug to console",
    "code": "Program code",
    "input": "Input variables",
    "run": "Run Beatnik"
  }
}
</i18n>

<i18n locale="nl">
{
  "beatnik": {
    "code": "Programmacode",
    "debug": "Debug info naar console",
    "input": "Input variabelen",
    "run": "Run Beatnik"
  }
}
</i18n>