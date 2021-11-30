<template>
  <div id="nav" class="text-center">
    <router-link to="/text/textwordvalue">{{$t('texttools.wordvalue.title')}}</router-link> |
    <router-link to="/text/textcodes">{{$t('texttools.charcodes.title')}}</router-link> |
    <router-link to="/text/smartreplace">{{$t('texttools.smartreplace.title')}}</router-link> |
    <router-link to="/text/textanalyzer">{{$t('texttools.analyze.title')}}</router-link> |
    <router-link to="/text/texttonumbers">{{$t('texttools.texttonumbers.title')}}</router-link> |
    <router-link to="/text/textkeyboards">{{$t('texttools.keyboards.title')}}</router-link> |
    <router-link to="/text/texttoss">{{$t('texttools.texttoss.title')}}</router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['TextToolbox'].includes($route.name)">
    <div class="container">
      <p class="intro" v-html="$t('texttools.intro')"></p>
      <va-item v-bind:showitem='show[0]' v-on:toggle='show[0]=!show[0]'>
        <template v-slot:header><router-link to="/text/textwordvalue">{{$t('texttools.wordvalue.title')}}</router-link></template>
        <template v-slot:content>
          <span v-html="$t('texttools.wordvalue.long')"/>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[1]' v-on:toggle='show[1]=!show[1]'>
        <template v-slot:header><router-link to="/text/textcodes">{{$t('texttools.charcodes.title')}}</router-link></template>
        <template v-slot:content>
          <span v-html="$t('texttools.charcodes.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[2]' v-on:toggle='show[2]=!show[2]'>
        <template v-slot:header><router-link to="/text/smartreplace">{{$t('texttools.smartreplace.title')}}</router-link></template>
        <template v-slot:content>
          <span v-html="$t('texttools.smartreplace.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[3]' v-on:toggle='show[3]=!show[3]'>
        <template v-slot:header><router-link to="/text/textanalyzer">{{$t('texttools.analyze.title')}}</router-link></template>
        <template v-slot:content>
          <span v-html="$t('texttools.analyze.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[4]' v-on:toggle='show[4]=!show[4]'>
        <template v-slot:header><router-link to="/text/textanalyzer">{{$t('texttools.texttonumbers.title')}}</router-link></template>
        <template v-slot:content>
          <span v-html="$t('texttools.texttonumbers.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[5]' v-on:toggle='show[5]=!show[5]'>
        <template v-slot:header><router-link to="/text/textkeyboards">{{$t('texttools.keyboards.title')}}</router-link></template>
        <template v-slot:content>
          <span v-html="$t('texttools.keyboards.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[5]' v-on:toggle='show[6]=!show[6]'>
        <template v-slot:header><router-link to="/text/texttoss">{{$t('texttools.texttoss.title')}}</router-link></template>
        <template v-slot:content>
          <span v-html="$t('texttools.texttoss.long')" />
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
      show: [true, true, true, true, true, true, true, true],
    }
  },

  methods: {

  },
}
</script>
