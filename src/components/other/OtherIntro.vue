<template>
  <div class="card-grid mb-2">
    <!-- Intro Card -->
    <VCard :title="t('menu.other')">
      <img class="card-img-top" src="@/assets/images/other.jpg" alt="Other" style="width: 100%; height: 200px; object-fit: cover;">
      <div class="card-body">
        <p class="card-text" v-html="t('othertools.intro')"></p>
      </div>
    </VCard>

    <!-- Tool Cards -->
    <VCard 
      v-for="tool in otherTools" 
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
import VCard from "@/components/generic/VCard.vue"
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

const otherTools = [
  'printlog',
  'genlog',
  'htmlparser',
  'unitconvertor',
  'datecalc',
  'randomizer',
  'periodictable',
  'countries',
  'usastates',
  'regions',
  'dnacode',
  'booksearch'
]
</script>