<template>
  <div id="nav" class="text-center">
    <router-link to="/math/baseconvertor">{{$t('mathtools.baseconvert.title')}}</router-link> |
    <router-link to="/math/countdigits">{{$t('mathtools.decimals.title')}}</router-link> |
    <router-link to="/math/primes">{{$t('mathtools.primes.title')}}</router-link> |
    <router-link to="/math/fibonacci">{{$t('mathtools.fibonacci.title')}}</router-link> |
    <router-link to="/math/gcdandlcm">{{$t('mathtools.primegcdlcm.title')}}</router-link> |
    <router-link to="/math/formulasolv">{{$t('mathtools.formulasolver.title')}}</router-link> |
    <router-link to="/math/numberproperties">{{$t('mathtools.numberprop.title')}}</router-link> |
    <router-link to="/math/nimbers">{{$t('mathtools.nimbers.title')}}</router-link> |
    <router-link to="/math/sequences">{{$t('mathtools.sequences.title')}}</router-link> |
    <router-link to="/math/palindromecounter">{{$t('mathtools.palindrome.title')}}</router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['Math'].includes($route.name)">
    <div class="container">
      <va-item v-bind:showitem='show[0]' v-on:toggle='toggleItem(0)'>
        <template v-slot:header>{{$t('mathtools.baseconvert.title')}}</template>
        <template v-slot:content>
          <router-link to="/math/baseconvertor">{{$t('mathtools.baseconvert.title')}}</router-link> - {{$t('mathtools.baseconvert.long')}}.<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[1]' v-on:toggle='toggleItem(1)'>
        <template v-slot:header>{{$t('mathtools.decimals.title')}}</template>
        <template v-slot:content>
          <router-link to="/math/countdigits">{{$t('mathtools.decimals.title')}}</router-link> - {{$t('mathtools.decimals.long')}})<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[9]' v-on:toggle='toggleItem(9)'>
        <template v-slot:header>{{$t('mathtools.primes.title')}}</template>
        <template v-slot:content>
            <router-link to="/math/primes">{{$t('mathtools.primes.title')}}</router-link> - {{$t('mathtools.primes.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[2]' v-on:toggle='toggleItem(2)'>
        <template v-slot:header>{{$t('mathtools.fibonacci.title')}}</template>
        <template v-slot:content>
            <router-link to="/math/fibonacci">{{$t('mathtools.fibonacci.title')}}</router-link> - {{$t('mathtools.fibonacci.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[3]' v-on:toggle='toggleItem(3)'>
        <template v-slot:header>{{$t('mathtools.primegcdlcm.title')}}</template>
        <template v-slot:content>
          <router-link to="/math/gcdandlcm">{{$t('mathtools.primegcdlcm.title')}}</router-link> - {{$t('mathtools.primegcdlcm.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[8]' v-on:toggle='toggleItem(8)'>
        <template v-slot:header>{{$t('mathtools.formulasolver.title')}}</template>
        <template v-slot:content>
          <router-link to="/math/formulasolv">{{$t('mathtools.formulasolver.title')}}</router-link> - {{$t('mathtools.formulasolver.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[4]' v-on:toggle='toggleItem(4)'>
        <template v-slot:header>{{$t('mathtools.numberprop.title')}}</template>
        <template v-slot:content>
          <router-link to="/math/numberproperties">{{$t('mathtools.numberprop.title')}}</router-link> - {{$t('mathtools.numberprop.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[5]' v-on:toggle='toggleItem(5)'>
        <template v-slot:header>{{$t('mathtools.nimbers.title')}}</template>
        <template v-slot:content>
          <router-link to="/math/nimbers">{{$t('mathtools.nimbers.title')}}</router-link> - {{$t('mathtools.nimbers.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[6]' v-on:toggle='toggleItem(6)'>
        <template v-slot:header>{{$t('mathtools.sequences.title')}}</template>
        <template v-slot:content>
          <router-link to="/math/sequences">{{$t('mathtools.sequences.title')}}</router-link> - {{$t('mathtools.sequences.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[7]' v-on:toggle='toggleItem(7)'>
        <template v-slot:header>{{$t('mathtools.palindrome.title')}}</template>
        <template v-slot:content>
          <router-link to="/math/palindromecounter">{{$t('mathtools.palindrome.title')}}</router-link> - {{$t('mathtools.palindrome.long')}}<br>
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from "@/components/inputs/VaItem.vue"

export default {
  name: 'Mathtools',

  props: {
    msg: String
  },

  components: {
    VaItem,
  },

  data: function () {
    return {
      title: "Mathtools",
      show: [true, true, true, true, true, true, true, true, true, true]
    }
  },

  methods: {

    toggleItem: function(itemnr) {
      this.show[itemnr] = !this.show[itemnr];
    }

  },
}
</script>
