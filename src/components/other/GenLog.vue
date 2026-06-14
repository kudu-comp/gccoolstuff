<template>

  <header class="page-header">
    <h1>{{ $t('genlog.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('genlog.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <div class="form-horizontal">
          <label>{{ $t('genlog.n') }}</label>
          <input type="number" v-model="n" min="1">
        </div>
        <div class="form-horizontal">
          <label>{{ $t('genlog.tot') }}</label>
          <input type="number" v-model="tot" min="1">
        </div>
        <div class="form-horizontal">
          <label>{{ $t('genlog.day') }}</label>
          <input type="number" v-model="tot" min="1">
        </div>
        <p
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <button class="btn btn-primary"  @click="random">
            {{ $t('genlog.random') }}
          </button>
        </div>
      </VCard>
      <VCard :title="$t('labels.result')">
        <div v-if="result" class="card resultbox" >
          {{ result }}
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <template v-for="t, index) in txt" :key index>
        <VCard :title="'Template ' + (index+1)">
          <textarea
            id="txt"
            class="form-control mb-2"
            v-model="txt[index]"
            rows="5"
            :placeholder="$t('genlog.ph')"
          />
          <div class="button-row mt-2">
            <button @click="genlog(index)" class="btn btn-primary">
              {{$t('genlog.template')}} {{ index + 1 }}
            </button>
          </div>
        </VCard>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import VCard from '@/components/generic/VCard.vue';


defineOptions({
  name: "GenLog"
});

// --- State ---
const result = ref("");
const errormsg = ref("");
const n = ref(2);      // Number of templates
const tot = ref(1);    // Total counter
const day = ref(1);    // Daily counter
const txt = ref(["", ""]); // Array of template strings

// --- Methods ---

/**
 * Adjusts the size of the template array based on 'n'
 */
const updateTemp = () => {
  const currentLength = txt.value.length;
  if (n.value < currentLength) {
    // Shrink array
    txt.value.splice(n.value);
  } else if (n.value > currentLength) {
    // Grow array
    for (let i = currentLength; i < n.value; i++) {
      txt.value.push("");
    }
  }
};

/**
 * Picks a random template and generates a log
 */
const random = () => {
  const randomIdx = Math.floor(Math.random() * n.value);
  genlog(randomIdx);
};

/**
 * Generates the log string, increments counters, and copies to clipboard
 */
const genlog = async (idx) => {
  // Reset
  result.value = "";
  errormsg.value = "";

  const template = txt.value[idx];
  if (!template) return;

  try {
    // Replace placeholders and increment counters
    // Note: Use .value for all refs
    let generated = template.replace("%tot%", tot.value++);
    generated = generated.replace("%day%", day.value++);

    result.value = generated;

    // Copy to clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(result.value);
    }
  } catch (e) {
    console.error(e);
    errormsg.value = "Failed to generate or copy log.";
  }
};

// --- Watchers ---
// Automatically resize the txt array whenever n changes
watch(n, () => {
  updateTemp();
});
</script>

