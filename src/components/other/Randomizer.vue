<template>
  <header class="page-header">
    <h1>{{ $t('randomizer.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <div class="card-stack">
      <!-- Intro Card -->
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('randomizer.long')" />
      </VCard>

      <!-- Settings Card -->
      <VCard :title="$t('labels.settings')">
        <div class="form-group-vertical">
          <!-- Selection Mode -->
          <div class="form-horizontal">
            <CustomDropdown
              :title="$t('randomizer.sel') "
              :options="[
                { value: 0, label: $t('randomizer.selbin')},
                { value: 1, label: $t('randomizer.selrng')},
                { value: 2, label: $t('randomizer.seltxt')},
                { value: 3, label: $t('randomizer.selcol')},
                { value: 4, label: $t('randomizer.selascii')},
              ]"
              v-model="sel"
            />
          </div>

          <!-- Quantity -->
          <div class="form-horizontal">
            <label for="cnt">{{ $t('randomizer.numberof') }}</label>
            <input
              id="cnt"
              type="number"
              v-model.number="cnt"
              class="form-control"
              min="1"
            />
          </div>

          <!-- Min / Max (Only show for Range mode) -->
          <div v-if="sel === 1" class="form-horizontal mb-3">
            <label>{{ $t('randomizer.minmax') }}</label>
            <input type="number" v-model.number="min" class="form-control" placeholder="Min">
            <input type="number" v-model.number="max" class="form-control" placeholder="Max">
          </div>

          <!-- Character Set (Only show for Characters mode) -->
          <div v-if="sel === 2" class="form-horizontal mb-3">
            <label for="txt">{{ $t('randomizer.chars') }}</label>
            <input id="txt" type="text" v-model="txt" class="form-control" />
          </div>

          <!-- Collection (Only show for Collection mode) -->
          <div v-if="sel === 3" class="form-horizontal mb-3">
            <label for="coll">{{ $t('randomizer.coll') }}</label>
            <input id="coll" type="text" v-model="coll" class="form-control" />
          </div>

          <!-- Separator -->
          <div class="form-horizontal mb-3">
            <CustomDropdown
              :title="$t('randomizer.sep')"
              :options="[
                { value: '', label: $t('randomizer.sepnone')},
                { value: ' ', label: $t('randomizer.sepspace')},
                { value: ',', label: $t('randomizer.sepcomma')},
                { value: ':', label: $t('randomizer.sepcolon')},
                { value: '-', label: $t('randomizer.sephyphen')},
              ]"
              v-model="sep"
            />
          </div>
          <p v-if="errormsg" class="errormsg">
            {{ errormsg }}
          </p>
          <div class="button-row">
            <VCalculate @calculate="generate" />
          </div>
        </div>
      </VCard>
    </div>

    <!-- Result Card -->
    <div class="card-stack">
      <VCard :title="$t('labels.result')">
        <div v-if="result" class="resultbox font-monospace">
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
import VCalculate from '@/components/generic/VCalculate.vue';
import CustomDropdown from '@/components/generic/CustomDropdown.vue';

defineOptions({ name: 'Randomizer' });

const { t } = useI18n();

// --- State ---
const sel = ref(0);
const cnt = ref(10);
const max = ref(9);
const min = ref(0);
const txt = ref("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const coll = ref("purple,indigo,blue,green,yellow,orange,red");
const sep = ref("");
const result = ref("");
const errormsg = ref("");

// Template Ref
const selRef = ref(null);

onMounted(() => {
  selRef.value?.focus();
});

// --- Methods ---

const generate = () => {
  result.value = "";
  errormsg.value = "";

  let maxgen = 0;
  let mingen = 0;
  const collArray = coll.value.split(",");

  // 1. Determine the logical range based on selection
  switch (sel.value) {
    case 0: // Binary
      mingen = 0;
      maxgen = 1;
      break;
    case 1: // Range
      mingen = min.value;
      maxgen = max.value;
      break;
    case 2: // Characters
      mingen = 0;
      maxgen = txt.value.length - 1;
      break;
    case 3: // Collection
      mingen = 0;
      maxgen = collArray.length - 1;
      break;
    case 4: // ASCII
      mingen = 33;
      maxgen = 126;
      break;
  }

  // 2. Range validation
  if (maxgen < mingen) {
    errormsg.value = "Error: Max is smaller than min.";
    return;
  }

  const range = maxgen - mingen + 1;
  let builder = "";

  // 3. Generation Loop
  for (let i = 0; i < cnt.value; i++) {
    const randomVal = Math.floor(Math.random() * range) + mingen;

    switch (sel.value) {
      case 0:
      case 1:
        builder += randomVal.toString();
        break;
      case 2:
        builder += txt.value[randomVal];
        break;
      case 3:
        builder += collArray[randomVal].trim();
        break;
      case 4:
        builder += String.fromCharCode(randomVal);
        break;
    }

    // Add separator if not the last item
    if (sep.value !== "" && i < cnt.value - 1) {
      builder += sep.value;
    }
  }

  result.value = builder;
};
</script>

<style scoped>
.resultbox {
  min-height: 100px;
  line-height: 1.6;
  word-break: break-word;
}
.font-monospace {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
</style>