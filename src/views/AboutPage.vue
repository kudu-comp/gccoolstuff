<template>
  <div class="d-flex flex-column mx-4">
    <div class="mainpage">
      <div class="infoblock">
        {{ $t('dialogabout.info') }}
      </div>
      <va-item
        :hidebutton="hidebutton"
        :showitem="show"
      >
        <template #header>
          About
        </template>
        <template #content>
          I love to solve mystery geocaches. I've been doing it for years. There are some great websites out there to help you,
          but sometimes I needed tools for unknown problems. So I started programming. Then I got the idea to make a
          website out of it. There are a few tools here which I haven't seen before such as the HTML scanner, the Map Maker, quite a
          few of the ciphers and some of the math tools. Others are expanded versions of well known tools, e.g. word value supports many
          alphabets, text &amp; codes supports a dozen of codepages. Try the tools and let me know your suggestions.<br><br>
          This website is also optimized for mobile. It is small and responsive.
        </template>
      </va-item>
      <va-item
        :hidebutton="hidebutton"
        :showitem="show"
      >
        <template #header>
          Free to use
        </template>
        <template #content>
          You are free to use GC Tools. There are no cookies, no commercial messages, no subscription fees.
        </template>
      </va-item>
      <va-item
        :hidebutton="hidebutton"
        :showitem="show"
      >
        <template #header>
          Contact
        </template>
        <template #content>
          If you have suggestions or remarks please contact me. Our geocaching name is Team Chaenaan.
        </template>
      </va-item>
      <va-item
        :hidebutton="hidebutton"
        :showitem="show"
      >
        <template #header>
          Under construction
        </template>
        <template #content>
          This website is continuously under construction. I also use it to practice my coding skills on JavaScript, Vue3, Vue-router, Vuex
          and PHP. The front end is build as components and using Vite. There is a great set of Javascript modules in use. Leaflet is used for maps, proj4 is
          used for coordinate conversions, crypto-js for digital encryptions. I use the vue-i18n plugin to support multiple languages.
          Some tools (ciphers, some of the math, sudoku solver) runs on the server, either to keep the size of the HTML small (e.g. it wouldn't be smart to
          load 1GB of digits) or because I had some PHP code that I wanted to reuse.
        </template>
      </va-item>
    </div>
    <h6 class="text-center">
      &copy; 2021 - 2023 Kool Interim
    </h6>
  </div>
</template>

<script>

import VaItem from '@/components/inputs/VaItem.vue'

export default {

  components: {
    VaItem,
  },

  data: function () {
    return {
      hidebutton: true,
      show: true
    };
  },

}

</script>
