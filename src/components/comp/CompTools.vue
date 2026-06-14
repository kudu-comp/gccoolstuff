<template>
  <div class="card-grid mb-2">
    <!-- Intro Card -->
    <VCard :title="$t('menu.comptools')">
      <img class="card-img-top" src="@/assets/images/comp.jpg" alt="Computer" style="width: 100%; height: 200px; object-fit: cover;">
      <div class="card-body">
        <p class="card-text" v-html="$t('comptools.intro')"></p>
      </div>
    </VCard>

    <!-- Computer Tool Cards (Looped) -->
    <VCard 
      v-for="tool in compTools" 
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

const compTools = [
  'bintotext',
  'bcd',
  'encryption',
  'hashes',
  'brainfuck',
  'cow',
  'beatnik',
  'deadfish',
  'duckspeak',
  'checksum',
  'truthtable',
  'passwordgen'
]
</script>