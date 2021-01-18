<template>
  <div id="nav" class="text-center">
    <router-link to="/other/sudokusolver">{{$t('othertools.sudokusolver.title')}}</router-link> |
    <router-link to="/other/mmsolver">{{$t('othertools.mmsolver.title')}}</router-link> |
    <router-link to="/other/periodictable">{{$t('othertools.periodictable.title')}}</router-link> |
    <router-link to="/other/countries">{{$t('othertools.countries.title')}}</router-link> |
    <router-link to="/other/usastates">{{$t('othertools.usastates.title')}}</router-link> |
    <router-link to="/other/nlprovinces">{{$t('othertools.nlprovinces.title')}}</router-link> |
    <router-link to="/other/resistorcode">{{$t('othertools.resistorcode.title')}}</router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['OtherTools'].includes($route.name)">
    <div class="container">
      <va-item v-bind:showitem='show[0]' v-on:toggle='toggleItem(0)'>
        <template v-slot:header>{{$t('othertools.sudokusolver.title')}}</template>
        <template v-slot:content>
          <router-link to="/other/sudokusolver">{{$t('othertools.sudokusolver.title')}}</router-link> - {{$t('othertools.sudokusolver.long')}}.<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[1]' v-on:toggle='toggleItem(1)'>
        <template v-slot:header>{{$t('othertools.mmsolver.title')}}</template>
        <template v-slot:content>
          <router-link to="/other/mmsolver">{{$t('othertools.mmsolver.title')}}</router-link> - {{$t('othertools.mmsolver.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[6]' v-on:toggle='toggleItem(6)'>
        <template v-slot:header>{{$t('othertools.periodictable.title')}}</template>
        <template v-slot:content>
          <router-link to="/other/periodictable">{{$t('othertools.periodictable.title')}}</router-link> - {{$t('othertools.periodictable.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[3]' v-on:toggle='toggleItem(3)'>
        <template v-slot:header>{{$t('othertools.countries.title')}}</template>
        <template v-slot:content>
            <router-link to="/other/countries">{{$t('othertools.countries.title')}}</router-link> - {{$t('othertools.countries.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[4]' v-on:toggle='toggleItem(4)'>
        <template v-slot:header>{{$t('othertools.usastates.title')}}</template>
        <template v-slot:content>
            <router-link to="/other/usastates">{{$t('othertools.usastates.title')}}</router-link> - {{$t('othertools.usastates.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[5]' v-on:toggle='toggleItem(5)'>
        <template v-slot:header>{{$t('othertools.nlprovinces.title')}}</template>
        <template v-slot:content>
            <router-link to="/other/nlprovinces">{{$t('othertools.nlprovinces.title')}}</router-link> - {{$t('othertools.nlprovinces.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[2]' v-on:toggle='toggleItem(2)'>
        <template v-slot:header>{{$t('othertools.resistorcode.title')}}</template>
        <template v-slot:content>
          <router-link to="/other/resistorcode">{{$t('othertools.resistorcode.title')}}</router-link> - {{$t('othertools.resistorcode.long')}}<br>
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from "@/components/inputs/VaItem.vue"

export default {

  name: 'OtherIntro',

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
