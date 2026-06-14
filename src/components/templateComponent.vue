<template>

  <header class="page-header">
    <h1>{{ $t('compname.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('compname.long')" />
      </VCard>
      <VCard :title="$t('labels.settings')">
      </VCard>
      <VCard :title="$t('labels.input')">
        <textarea
          ref="messageInput"
          v-model="message"
          :placeholder="$t('labels.message')"
          rows="5"
          @input="doSomething"
        />
        <p v-show="errormsg" class="errormsg mt-2">
          {{ errormsg }}.
        </p>
        <div class="button-row mt-2">
          <button class="btn btn-primary"  @click="doSomething">
            {{ $t('buttons.convert') }}
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
      <VCard title="Preview">
     </VCard>
      <VCard :title="$t('labels.addinfo')">
     </VCard>
    </div>
  </div>

  <div class="form-horizontal">
    <label>{{ $t('compname.label') }}</label>
    <input type="number" v-model="count">
  </div>

  <div class="form-horizontal">
    <label>{{ $t('compname.label') }}</label>
    <input type="text" v-model="text">
  </div>

  <div class="form-horizontal">
    <label>{{ $t('compname.label') }}</label>
    <input type="range" v-model="range" min="0" max="100" class="range-input">
  </div>

  <label class="checkbox-container mb-2">
    <input type="checkbox" v-model="chk">
    <span class="checkmark"></span>
    {{ $t('compname.label') }}
  </label>

  <CustomDropdown
    v-model="fontFamily"
    :options="fontdef"
    :title="$t('fonts.selfont')"
  />

  <label>{{ $t('compname.label') }}</label>
  <div class="custom-select-container" v-click-outside="() => isDropdownOpen = false">
    <div class="custom-select-trigger" @click="isDropdownOpen = !isDropdownOpen" :class="{ 'is-active': isDropdownOpen }">
      {{ categories.find(c => c.value === formData.category).label }}
      <span class="chevron">▾</span>
    </div>
    <transition name="fade-slide">
      <div v-if="isDropdownOpen" class="custom-options-list">
        <div v-for="opt in categories" :key="opt.value" class="custom-option" :class="{ 'selected': formData.category === opt.value }" @click="selectCategory(opt.value)">
          {{ opt.label }}
          <span v-if="formData.category === opt.value" class="check">✓</span>
        </div>
      </div>
    </transition>
  </div>

  <div class="radio-group">
    <label>{{ $t('compname.label') }}</label>
    <div class="radio-options">
      <label class="radio-item" v-for="lvl in ['Low', 'Med', 'High']" :key="lvl">
        <input type="radio" :value="lvl" v-model="formData.priority">
        <span class="radio-mark"></span> {{ lvl }}
      </label>
    </div>
  </div>

</template>

<script setup>

import { ref, reactive, computed } from 'vue';
import VMenu from '@/components/generic/VMenu.vue';
import VCard from '@/components/generic/VCard.vue';
import CustomDropdown from '@/components/generic/CustomDropdown.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const lettersRef=ref(null)

onMounted(() => {
  lettersRef.value?.focus()
})

</script>