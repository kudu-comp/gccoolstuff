<template>
  <div id="nav" class="text-center">
    <router-link to="/codes/codebook">{{$t('codes.codebook.title')}}</router-link> |
    <router-link to="/codes/fonts">{{$t('codes.fonts.title')}}</router-link> |
    <router-link to="/codes/segment">{{$t('codes.segment.title')}}</router-link> |
    <router-link to="/codes/resistorcode">{{$t('codes.resistorcode.title')}}</router-link> |
    <router-link to="/codes/decabit">{{$t('codes.decabit.title')}}</router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['Codes'].includes($route.name)">
    <div class="container">
      <p class="intro" v-html="$t('codes.intro')"></p>
      <va-item v-bind:showitem='show[0]' v-on:toggle='show[0] = !show[0]'>
        <template v-slot:header><router-link to="/codes/codebook">{{$t('codes.codebook.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('codes.codebook.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[1]' v-on:toggle='show[1] = !show[1]'>
        <template v-slot:header><router-link to="/codes/fonts">{{$t('codes.fonts.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('codes.fonts.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[2]' v-on:toggle='show[2] = !show[2]'>
        <template v-slot:header><router-link to="/codes/segment">{{$t('codes.segment.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('codes.segment.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[3]' v-on:toggle='show[3] = !show[3]'>
        <template v-slot:header><router-link to="/codes/resistorcode">{{$t('codes.resistorcode.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('codes.resistorcode.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[4]' v-on:toggle='show[4] = !show[4]'>
        <template v-slot:header><router-link to="/codes/decabit">{{$t('codes.decabit.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('codes.decabit.long')" />
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from "@/components/inputs/VaItem.vue"

export default {
  name: 'CodesIntro',

  props: {
    msg: String
  },

  components: {
    VaItem,
  },

  data: function () {
    return {
      title: "CodesIntro",
      show: [true, true, true, true, true, true, true, true, true, true]
    }
  }

}
</script>
