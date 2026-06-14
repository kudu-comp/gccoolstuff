<template>
  <header class="page-header">
    <h1>{{ $t('unitconvertor.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('unitconvertor.long')" />
      </VCard>

      <VCard :title="$t('labels.settings')">
        <div class="form-group-vertical">
          <div class="form-horizontal">
            <CustomDropdown
              v-model="cat"
              :options="categoryOptions"
              :title="$t('unitconvertor.selcat')"
            />
          </div>
          <div class="desc" v-if="definedUnits[cat]">
            {{ $t('unitconvertor.cat.' + definedUnits[cat].category + '.desc') }}
          </div>
          <div class="form-horizontal">
            <CustomDropdown
              v-model="idfrom"
              :options="unitOptions[cat]"
              :title="$t('unitconvertor.unitfrom')"
            />
          </div>
          <div class="form-horizontal">
          <CustomDropdown
            v-model="idto"
            :options="unitOptions[cat]"
            :title="$t('unitconvertor.unitto')"
          />
          </div>
        </div>
      </VCard>

      <VCard :title="$t('labels.input')">
        <div class="form-horizontal">
          <label>{{ $t('unitconvertor.value') }}</label>
          <input type="number" v-model.number="valfrom" class="form-control">
        </div>
      </VCard>
    </div>

    <div class="card-stack">
      <VCard :title="$t('labels.result')">
        <div v-if="valfrom !== null" class="result-content">
          <!-- Simple string result -->
          <h4>{{ valfrom }} {{ sourceUnit.name }} = {{ targetValue.toFixed(5) }} {{ targetUnit.name }}</h4>

          <!-- Full conversion table -->
          <table class="p-table-small">
            <thead>
              <tr>
                <th class="text-end">{{ $t('unitconvertor.amount') }}</th>
                <th>{{ $t('unitconvertor.symbol') }}</th>
                <th>{{ $t('unitconvertor.unit') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(item, index) in allConversions" 
                :key="index"
                :class="{ 'table-primary fw-bold': index === idto }"
              >
                <td class="text-end font-monospace">{{ item.value.toFixed(5) }}</td>
                <td>{{ item.symbol }}</td>
                <td>{{ item.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center p-4 text-muted">
          {{ $t('labels.no_result') }}
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { definedUnits, convertUnit } from '@/scripts/unitconvertor.js';
import VCard from '@/components/generic/VCard.vue';
import CustomDropdown from '@/components/generic/CustomDropdown.vue';

defineOptions({ name: 'UnitConvertor' });

const { t } = useI18n();

// --- State ---
const valfrom = ref(1);
const cat = ref(0);
const idfrom = ref(0);
const idto = ref(0);

// --- Dropdown Options ---
const categoryOptions = definedUnits.map((item, index) => ({
  label: t('unitconvertor.cat.' + item.category + '.name'),
  value: index
}));

const unitOptions = definedUnits.map((group) => {
  return group.units.map((unit, index) => ({
    label: `${unit.name} (${unit.symbol})`,
    value: index
  }));
});

// --- Logic ---

// Reset unit indices when category changes
watch(cat, () => {
  idfrom.value = 0;
  idto.value = 0;
});

// Helper for current selected category
const currentCategory = computed(() => definedUnits[cat.value]);

// Helper for specific units
const sourceUnit = computed(() => currentCategory.value.units[idfrom.value]);
const targetUnit = computed(() => currentCategory.value.units[idto.value]);

// Main Target Value
const targetValue = computed(() => {
  return convertUnit(valfrom.value || 0, cat.value, idfrom.value, idto.value);
});

// Full table data
const allConversions = computed(() => {
  return currentCategory.value.units.map((u, index) => ({
    name: u.name,
    symbol: u.symbol,
    value: convertUnit(valfrom.value || 0, cat.value, idfrom.value, index)
  }));
});
</script>

<style scoped>
.desc {
  font-size: 0.9em;
}
</style>
