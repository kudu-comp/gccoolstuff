<template>
  <header class="page-header">
    <h1>{{ t('datecalc.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <div class="card-stack">
      <!-- Intro Card -->
      <VCard :title="t('labels.intro')">
        <div v-html="t('datecalc.long')" />
      </VCard>

      <!-- Input Card -->
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal mb-2">
          <label for="date1">{{ t('datecalc.date1') }}</label>
          <input 
            ref="date1Input"
            type="date" 
            v-model="date1" 
            class="form-control"
          />
        </div>
        <div class="form-horizontal">
          <label for="date2">{{ t('datecalc.date2') }}</label>
          <input 
            type="date" 
            v-model="date2" 
            class="form-control"
          />
        </div>
        <div class="form-horizontal">
          <label for="extradays">{{ t('datecalc.days') }}</label>
          <input 
            type="number" 
            min="0" 
            v-model.number="extradays" 
            class="form-control"
          />
        </div>
      </VCard>
    </div>

    <!-- Results Card -->
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div v-if="date1 && date2" class="resultbox">
          <div class="subhead mb-2">{{ results.diff }}</div>
          <div class="subhead">{{ t('datecalc.date1') }}:</div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item px-0">
              {{ results.add }}
            </li>
            <li class="list-group-item px-0">
              {{ results.sub }}
            </li>
            <li class="list-group-item px-0">
              {{ results.dayOfYear }}
            </li>
            <li class="list-group-item px-0">
              {{ results.dayOfWeek }}
            </li>
            <li class="list-group-item px-0">
              {{ results.daysInYear }}
            </li>
            <li class="list-group-item px-0 pb-0">
              {{ results.daysInMonth }}
            </li>
          </ul>
        </div>
        <div v-else class="text-center p-4 text-muted">
          {{ t('labels.no_result') }}
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import VCard from '@/components/generic/VCard.vue';

defineOptions({ name: 'DateCalc' });

const { t, locale } = useI18n();

// --- State ---
// Initialize with today's date for a better UX
const today = new Date().toISOString().substr(0, 10);
const date1 = ref(today);
const date2 = ref(today);
const extradays = ref(0);

// Template Ref for autofocus
const date1Input = ref(null);

onMounted(() => {
  date1Input.value?.focus();
});

// --- Logic (Computed Results) ---

const results = computed(() => {

  if (!date1.value || !date2.value) return {};

  const d1 = new Date(date1.value);
  const d2 = new Date(date2.value);
  
  // Basic date validation
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return {};

  const year = d1.getFullYear();
  const msPerDay = 1000 * 3600 * 24;

  // 1. Difference between dates
  const daysDiff = Math.round((d2 - d1) / msPerDay);
  const diffStr = t('datecalc.res1a') + daysDiff + t('datecalc.res1b');

  // 2. Adding days
  const dAdd = new Date(d1.getTime() + extradays.value * msPerDay);
  const addStr = t('datecalc.res2a') + extradays.value + t('datecalc.res2b') + d1.toLocaleDateString() + ": " + dAdd.toLocaleDateString();

  // 3. Subtracting days
  const dSub = new Date(d1.getTime() - extradays.value * msPerDay);
  const subStr = t('datecalc.res3a') + extradays.value + t('datecalc.res3b') + d1.toLocaleDateString() + ": " + dSub.toLocaleDateString();

  // 4. Day in year (Ordinal)
  const startOfYear = new Date(d1.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((d1 - startOfYear) / msPerDay);
  const dayOfYearStr = t('datecalc.res7') + year + " is " + dayOfYear;

  // 5. Day of the week (Localized)
  const dayNames = locale.value === "nl" 
    ? ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"]
    : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeekStr = t('datecalc.res4') + dayNames[d1.getDay()];

  // 6. Leap Year / Days in year
  const isLeap = (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
  const daysInYearStr = t('datecalc.res5') + year + " is " + (isLeap ? "366" : "365");

  // 7. Days in month
  const daysInMonthCount = new Date(year, d1.getMonth() + 1, 0).getDate();
  const daysInMonthStr = t('datecalc.res6') + year + "-" + (d1.getMonth() + 1) + " is " + daysInMonthCount;

  return {
    diff: diffStr,
    add: addStr,
    sub: subStr,
    dayOfYear: dayOfYearStr,
    dayOfWeek: dayOfWeekStr,
    daysInYear: daysInYearStr,
    daysInMonth: daysInMonthStr
  };
});
</script>

<style scoped>
.result-content {
  background: white;
}

.list-group-item {
  border-color: rgba(0,0,0,0.05);
  font-size: 0.95rem;
  line-height: 1.4;
}

input[type="date"] {
  min-width: 150px;
}
</style>