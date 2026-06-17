<template>
  <div class="card-grid mb-2">
    <!-- Intro Card -->
    <VCard :title="t('menu.codes')">
      <img class="card-img-top" src="@/assets/images/codes.jpg" alt="Codes" style="width: 100%; height: 200px; object-fit: cover;">
      <div class="card-body">
        <p class="card-text" v-html="t('codes.intro')"></p>
      </div>
    </VCard>

    <!-- Code Tool Cards (Looped) -->
    <VCard 
      v-for="tool in codeTools" 
      :key="tool" 
      :title="t(`${tool}.title`)"
    >
      <div class="card-body">
        <p class="card-text" v-html="t(`${tool}.long`)"></p>
        <router-link :to="`/${tool}`">
          <span class="btn">{{ t('labels.letsgo') }}</span>
        </router-link>
      </div>
    </VCard>
  </div>
</template>

<script setup>
import VCard from '@/components/generic/VCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  useScope: 'local'
});

const codeTools = [
  'ciphers',
  'rotciphers',
  'substcipher',
  'freqanal',
  'codebook',
  'segment',
  'morsecode',
  'resistor',
  'vanitycode',
  'fonts',
  'decabit'
]
</script>