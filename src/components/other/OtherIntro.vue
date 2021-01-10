<template>
  <div id="nav" class="text-center">
    <router-link to="/other/sudokusolver">{{$t('menu.sudokusolver')}}</router-link> |
    <router-link to="/other/mmsolver">{{$t('menu.mmsolver')}}</router-link> |
    <router-link to="/other/periodictable">{{$t('menu.periodictable')}}</router-link> |
    <router-link to="/other/countries">{{$t('menu.countries')}}</router-link> |
    <router-link to="/other/usastates">{{$t('menu.usastates')}}</router-link> |
    <router-link to="/other/nlprovinces">{{$t('menu.nlprovinces')}}</router-link> |
    <router-link to="/other/resistorcode">{{$t('menu.resistorcode')}}</router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['OtherTools'].includes($route.name)">
    <div class="container">
      <va-item v-bind:showitem='show[0]' v-on:toggle='toggleItem(0)'>
        <template v-slot:header>{{$t('menu.sudokusolver')}}</template>
        <template v-slot:content>
          <router-link to="/other/sudokusolver">{{$t('menu.sudokusolver')}}</router-link> - {{$t('sudoku.long')}}.<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[1]' v-on:toggle='toggleItem(1)'>
        <template v-slot:header>{{$t('menu.mmsolver')}}</template>
        <template v-slot:content>
          <router-link to="/other/mmsolver">{{$t('menu.mmsolver')}}</router-link> - {{$t('mmsolver.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[6]' v-on:toggle='toggleItem(6)'>
        <template v-slot:header>{{$t('menu.periodictable')}}</template>
        <template v-slot:content>
          <router-link to="/other/periodictable">{{$t('menu.periodictable')}}</router-link> - {{$t('periodictable.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[3]' v-on:toggle='toggleItem(3)'>
        <template v-slot:header>{{$t('menu.countries')}}</template>
        <template v-slot:content>
            <router-link to="/other/countries">{{$t('menu.countries')}}</router-link> - {{$t('countries.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[4]' v-on:toggle='toggleItem(4)'>
        <template v-slot:header>{{$t('menu.usastates')}}</template>
        <template v-slot:content>
            <router-link to="/other/usastates">{{$t('menu.usastates')}}</router-link> - {{$t('usastates.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[5]' v-on:toggle='toggleItem(5)'>
        <template v-slot:header>{{$t('menu.nlprovinces')}}</template>
        <template v-slot:content>
            <router-link to="/other/nlprovinces">{{$t('menu.nlprovinces')}}</router-link> - {{$t('nlprovinces.long')}}<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[2]' v-on:toggle='toggleItem(2)'>
        <template v-slot:header>{{$t('menu.resistorcode')}}</template>
        <template v-slot:content>
          <router-link to="/other/resistorcode">{{$t('menu.resistorcode')}}</router-link> - {{$t('resistorcode.long')}}<br>
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
