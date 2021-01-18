<template>
  <div id="nav" class="text-center">
    <router-link to="/text/textwordvalue">{{$t('texttools.wordvalue.title')}}</router-link> |
    <router-link to="/text/textcodes">{{$t('texttools.charcodes.title')}}</router-link> |
    <router-link to="/text/smartreplace">{{$t('texttools.smartreplace.title')}}</router-link> |
    <router-link to="/text/textanalyzer">{{$t('texttools.analyze.title')}}</router-link> |
    <router-link to="/text/texttonumbers">{{$t('texttools.texttonumbers.title')}}</router-link> |
    <router-link to="/text/textkeyboards">{{$t('texttools.keyboards.title')}}</router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['TextToolbox'].includes($route.name)">
    <div class="container">
      <va-item v-bind:showitem='show[0]' v-on:toggle='toggleItem(0)'>
        <template v-slot:header>{{$t('texttools.wordvalue.title')}}</template>
        <template v-slot:content>
          <strong><router-link to="/text/textwordvalue">{{$t('texttools.wordvalue.title')}}</router-link></strong> - {{$t('texttools.wordvalue.long')}}
        </template>
      </va-item>
      <va-item v-bind:showitem='show[1]' v-on:toggle='toggleItem(1)'>
        <template v-slot:header>{{$t('texttools.charcodes.title')}}</template>
        <template v-slot:content>
          <strong><router-link to="/text/textcodes">{{$t('texttools.charcodes.title')}}</router-link></strong> - {{$t('texttools.charcodes.long')}}
        </template>
      </va-item>
      <va-item v-bind:showitem='show[2]' v-on:toggle='toggleItem(2)'>
        <template v-slot:header>{{$t('texttools.smartreplace.title')}}</template>
        <template v-slot:content>
          <strong><router-link to="/text/smartreplace">{{$t('texttools.smartreplace.title')}}</router-link></strong> - {{$t('texttools.smartreplace.long')}}
        </template>
      </va-item>
      <va-item v-bind:showitem='show[3]' v-on:toggle='toggleItem(3)'>
        <template v-slot:header>{{$t('texttools.analyze.title')}}</template>
        <template v-slot:content>
          <strong><router-link to="/text/textanalyzer">{{$t('texttools.analyze.title')}}</router-link></strong> - {{$t('texttools.analyze.long')}}
        </template>
      </va-item>
      <va-item v-bind:showitem='show[4]' v-on:toggle='toggleItem(4)'>
        <template v-slot:header>{{$t('texttools.texttonumbers.title')}}</template>
        <template v-slot:content>
          <strong><router-link to="/text/textanalyzer">{{$t('texttools.texttonumbers.title')}}</router-link></strong> - {{$t('texttools.texttonumbers.long')}}
        </template>
      </va-item>
      <va-item v-bind:showitem='show[5]' v-on:toggle='toggleItem(5)'>
        <template v-slot:header>{{$t('texttools.keyboards.title')}}</template>
        <template v-slot:content>
          <strong><router-link to="/text/textkeyboards">{{$t('texttools.keyboards.title')}}</router-link></strong> {{$t('texttools.keyboards.long')}}
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from '@/components/inputs/VaItem.vue'

export default {
  name: 'TextTools',

  props: {
    msg: String
  },

  components: {
    VaItem,
  },

  data: function () {
    return {
      show: [true, true, true, true, true, true],
    }
  },

  methods: {

    toggleItem: function(itemnr) {
      this.show[itemnr] = !this.show[itemnr];
    },

  },
}
</script>
