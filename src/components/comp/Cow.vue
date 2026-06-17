<template>

  <header class="page-header">
    <h1>{{ t('cow.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('cow.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('cow.input') }}</label>
          <input type="text" v-model="input">
        </div>
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="debug">
          <span class="checkmark"></span>
          {{ t('cow.debug') }}
        </label>
        <div class="form-horizontal">
          <textarea
            ref="codeInput"
            v-model="message"
            :placeholder="t('cow.code')"
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
          <button class="btn btn-primary"  @click="runCow">
            {{ t('cow.run') }}
          </button>
          <button class="btn btn-primary"  @click="writeCow(message)">
            {{ t('cow.write') }}
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div v-if="result" class="button-row mb-2">
          <button @click="copyToClipboard" class="btn btn-small btn-primary" :class="{ copied: copiedStatus }">
            {{ copiedStatus ? '✓' : t('buttons.copy') }}
          </button>
        </div>
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
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VCard from '@/components/generic/VCard.vue';

defineOptions({
  name: 'CompCow'
})

const { t } = useI18n()

// --- State ---
const message = ref("")
const result = ref("")
const input = ref("")
const debug = ref(false)
const errormsg = ref("")
const copiedStatus = ref(false);

// --- Template Ref ---
const codeInput = ref(null)

onMounted(() => {
  codeInput.value?.focus()
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(result.value);
    copiedStatus.value = true;
    setTimeout(() => copiedStatus.value = false, 2000);
  } catch (err) {
    console.error('Failed to copy!', err);
  }
};

// Write cow
/**
 * Generates a COW program that prints the provided text string.
 * @param {string} text - The input string.
 * @returns {string} - The resulting COW code.
 */
const writeCow = (text) => {
    let cow = "";
    let currentCellValue = 0;

    for (let i = 0; i < text.length; i++) {
        const targetValue = text.charCodeAt(i);
        const delta = targetValue - currentCellValue;

        if (delta > 0) {
            // MoO is increment (+)
            cow += "MoO ".repeat(delta);
        } else if (delta < 0) {
            // MOo is decrement (-)
            cow += "MOo ".repeat(Math.abs(delta));
        }

        // Moo is output (.)
        // (Note: In COW, Moo performs output if the cell is > 0)
        cow += "Moo "; 
        
        currentCellValue = targetValue;
    }

    result.value = cow.trim();
}

// --- Interpreter Logic ---
const runCow = () => {
  // Reset state
  result.value = ""
  errormsg.value = ""
  
  let regs = [0]
  let current = 0
  let loops = []
  let cache = null
  let rep = false
  const cmdidx = ["moo", "mOo", "moO", "mOO", "Moo", "MOo", "MoO", "MOO", "OOO", "MMM", "OOM", "oom"]

  try {
    // Parse commands (only triplets of m/o)
    const cmds = message.value.match(/[mo]{3}/ig)
    if (!cmds) {
      console.log("No COW commands found")
      return
    }

    // Parse inputs
    const inputs = input.value.match(/[A-Z0-9]+/ig) || []
    let nextinput = 0

    for (let i = 0; i < cmds.length; i++) {
      let cmd = cmds[i]

      do {
        rep = false

        if (debug.value) {
          console.log(`Command: ${cmd} | Current Reg: ${current} | Value: ${regs[current]} | Cache: ${cache}`)
          console.log(`Memory:`, regs)
        }

        switch (cmd) {
          case 'moo': // End of loop
            if (regs[current] !== 0) {
              i = loops[loops.length - 1]
            } else {
              loops.pop()
            }
            break

          case 'mOo': // Previous register
            current = Math.max(0, current - 1)
            break

          case 'moO': // Next register
            if (current === regs.length - 1) regs.push(0)
            current++
            break

          case 'mOO': // Execute register value as command
            if (regs[current] < 0 || regs[current] === 3 || regs[current] > 11) {
              throw new Error("Illegal command in register")
            }
            rep = true
            cmd = cmdidx[regs[current]]
            break

          case 'Moo': // Input/Output ASCII
            if (regs[current] === 0) {
              if (nextinput >= inputs.length) throw new Error("Not enough inputs")
              regs[current] = inputs[nextinput++].charCodeAt(0)
            } else {
              result.value += String.fromCharCode(regs[current])
            }
            break

          case 'MOo': // Decrement
            regs[current]--
            break

          case 'MoO': // Increment
            regs[current]++
            break

          case 'MOO': // Start of loop
            loops.push(i)
            if (regs[current] === 0) {
              // Find end of loop skipping next statement
              while (i < cmds.length && cmds[i + 2] !== "moo") {
                i++
              }
              loops.pop()
            }
            break

          case 'OOO': // Set current to 0
            regs[current] = 0
            break

          case 'MMM': // Cache current value
            if (cache === null) {
              cache = regs[current]
            } else {
              regs[current] = cache
              cache = null
            }
            break

          case 'OOM': // Print as integer
            result.value += regs[current]
            break

          case 'oom': // Read as integer
            if (nextinput >= inputs.length) throw new Error("Not enough inputs")
            regs[current] = parseInt(inputs[nextinput++])
            break

          default:
            if (debug.value) console.log("Comment: " + cmd)
        }
      } while (rep)
    }
  } catch (e) {
    errormsg.value = t('errors.generic')
    console.error(e)
  }
}
</script>

<i18n locale="en">
{
  "cow": {
    "debug": "Debug to console",
    "code": "Program code",
    "input": "Input variables",
    "run": "Run Cow",
    "write": "Create Cow program"
  }
}
</i18n>

<i18n locale="nl">
{
  "cow": {
    "code": "Programmacode",
    "debug": "Debug info naar console",
    "input": "Input variabelen",
    "run": "Run Cow",
    "write": "Schrijf Cow programma"
  }
}
</i18n>