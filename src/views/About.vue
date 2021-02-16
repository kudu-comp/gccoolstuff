<template>
  <div class="container">
    <div class="mainpage">
      <div class="infoblock">
        {{$t('dialogabout.info')}}
      </div>
      <va-item v-bind:hidebutton='hidebutton' v-bind:showitem="show">
        <template v-slot:header>About</template>
        <template v-slot:content>
          I love to solve mystery geocaches. I've been doing it for years. There are some great websites out there to help you,
          but sometimes I needed tools for unknown problems. So I started programming. Then I got the idea to make a
          website out of it. There are a few tools here which I haven't seen before such as the HTML scanner, the Map Maker, quite a
          few of the ciphers and some of the math tools. Others are expanded versions of well known tools, e.g. word value supports many
          alphabets, text &amp; codes supports a dozen of codepages. Try the tools and let me know your suggestions.<br><br>
          This website is also optimized for mobile. It is small and responsive.
        </template>
      </va-item>
      <va-item v-bind:hidebutton='hidebutton' v-bind:showitem="show">
        <template v-slot:header>Contact</template>
        <template v-slot:content>
          If you have suggestions or remarks please contact me. Our geocaching name is Team Chaenaan or you can send an email to info@gccooltools.nl.
        </template>
      </va-item>
      <va-item v-bind:hidebutton='hidebutton' v-bind:showitem="show">
        <template v-slot:header>To do list</template>
        <template v-slot:content>
          <ul>
            <li>Fix refresh issue for Sudoku, Image tools, Math tools (only on hosting server)</li>
            <li>Fix resize HTML canvas, pick color and color editor</li>
            <li>Math tools - postfix, infix and prefix</li>
            <li>Codebook - add more codes</li>
            <li>Coordinates - improve accuracy (do not use grid)</li>
            <li>Image Tools - load from URL</li>
            <li>Browse codebook use srcset</li>
            <li>A tool to hack hashes of coordinates</li>
            <li>HTML Scanner - add option to retrieve with geocache id</li>
            <li>Tooltips for ciphers to show the translation table for morse, kenny, etc</li>
          </ul>
        </template>
      </va-item>
      <va-item v-bind:hidebutton='hidebutton' v-bind:showitem="show">
        <template v-slot:header>Under construction</template>
        <template v-slot:content>
          This website is continuously under construction. I also use it to practice my coding skills on JavaScript, Vue.js, Vue-router, Bootstrap
          and PHP. The front end is build as components and using Vue-cli. The front end compiler minimizes the code and does the tree shaking
          keeping the website as small and as fast as possible.
          Some tools (ciphers, some of the math, sudoku solver) runs on the server, either to keep the size of the HTML small (e.g. it wouldn't be smart to
          load 7MB of digits) or because I had some PHP code that I wanted to reuse.
        </template>
      </va-item>
    </div>
    <h6 class="text-center"> &copy; 2021 Kool Interim</h6>
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
