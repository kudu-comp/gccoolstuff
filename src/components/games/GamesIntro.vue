<template>
  <div class="card-grid mb-2">
    <!-- Intro Card -->
    <VCard :title="$t('menu.games')">
      <img class="card-img-top" src="@/assets/images/games.jpg" alt="Games" style="width: 100%; height: 200px; object-fit: cover;">
      <div class="card-body">
        <p class="card-text" v-html="$t('games.intro')"></p>
      </div>
    </VCard>

    <!-- Game Cards (Looped) -->
    <VCard 
      v-for="game in games" 
      :key="game" 
      :title="$t(`${game}.title`)"
    >
      <div class="card-body">
        <p class="card-text" v-html="$t(`${game}.long`)"></p>
        <router-link :to="`/${game}`">
          <span class="btn">{{ $t('labels.letsgo') }}</span>
        </router-link>
      </div>
    </VCard>
  </div>
</template>

<script setup>
import VCard from '@/components/generic/VCard.vue'

const games = [
  'sudokusolv',
  'mmsolver',
  'wordsearch',
  'dictsearch',
  'anagrams',
  'wordle',
  'cryptosolver',
  'gameoflife'
]
</script>