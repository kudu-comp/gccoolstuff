<template>
  <div class="card-grid mb-2">
    <!-- Intro Card -->
    <VCard :title="$t('menu.mathtools')">
      <img class="card-img-top" src="@/assets/images/math.jpg" alt="Math" style="width: 100%; height: 200px; object-fit: cover;">
      <div class="card-body">
        <p class="card-text" v-html="$t('mathtools.intro')"></p>
      </div>
    </VCard>

    <!-- Math Tool Cards (Looped) -->
    <VCard 
      v-for="tool in mathTools" 
      :key="tool" 
      :title="$t(`${tool}.title`)"
    >
      <div class="card-body">
        <p class="card-text" v-html="$t(`${tool}.long`)"></p>
        <router-link :to="`/${tool}`">
          <span class="btn">{{ $t('labels.letsgo') }}</span>
        </router-link>
      </div>
    </VCard>
  </div>
</template>

<script setup>
import VCard from '@/components/generic/VCard.vue';

const mathTools = [
  'baseconv',
  'digits',
  'primes',
  'romans',
  'fibonacci',
  'gcdandlcm',
  'formulasolver',
  'numberprop',
  'bignumbers',
  'sequences',
  'combinations',
  'equations',
  'nimbers'
]
</script>