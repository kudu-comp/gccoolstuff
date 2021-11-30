<template>
  <div id="nav" class="text-center">
    <router-link to="/comp/charcodes">{{$t('texttools.charcodes.title')}}</router-link> |
    <router-link to="/comp/bintotext">{{$t('comptools.compbintotext.title')}}</router-link> |
    <router-link to="/comp/bcd">{{$t('comptools.compbcd.title')}}</router-link> | 
    <router-link to="/comp/encryption">{{$t('comptools.encryption.title')}}</router-link> |
    <router-link to="/comp/hashes">{{$t('comptools.hashes.title')}}</router-link> |
    <router-link to="/comp/brainfuck">{{$t('comptools.compbrainfuck.title')}}</router-link> |
    <router-link to="/comp/cow">{{$t('comptools.cow.title')}}</router-link> |
    <router-link to="/comp/beatnik">{{$t('comptools.beatnik.title')}}</router-link> |
    <router-link to="/comp/deadfish">{{$t('comptools.compdeadfish.title')}}</router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['Comp'].includes($route.name)">
    <div class="container">
      <p class="intro" v-html="$t('comptools.intro')"></p>
      <va-item v-bind:showitem='show[0]' v-on:toggle='show[0] = !show[0]'>
        <template v-slot:header><router-link to="/comp/charcodes">{{$t('texttools.charcodes.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('texttools.charcodes.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[1]' v-on:toggle='show[1] = !show[1]'>
        <template v-slot:header><router-link to="/comp/bintotext">{{$t('comptools.compbintotext.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('comptools.compbintotext.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[2]' v-on:toggle='show[2] = !show[2]'>
        <template v-slot:header><router-link to="/comp/bcd">{{$t('comptools.compbcd.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('comptools.compbcd.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[6]' v-on:toggle='show[5] = !show[6]'>
        <template v-slot:header><router-link to="/comp/encryption">{{$t('comptools.encryption.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('comptools.encryption.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[8]' v-on:toggle='show[8] = !show[8]'>
        <template v-slot:header><router-link to="/comp/hashes">{{$t('comptools.hashes.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('comptools.hashes.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[3]' v-on:toggle='show[3] = !show[3]'>
        <template v-slot:header><router-link to="/comp/brainfuck">{{$t('comptools.compbrainfuck.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('comptools.compbrainfuck.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[4]' v-on:toggle='show[4] = !show[4]'>
        <template v-slot:header><router-link to="/comp/cow">{{$t('comptools.cow.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('comptools.cow.long')" />
        </template>
      </va-item>     
      <va-item v-bind:showitem='show[7]' v-on:toggle='show[7] = !show[7]'>
        <template v-slot:header><router-link to="/comp/beatnik">{{$t('comptools.beatnik.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('comptools.beatnik.long')" />
        </template>
      </va-item>     
      <va-item v-bind:showitem='show[5]' v-on:toggle='show[5] = !show[5]'>
        <template v-slot:header><router-link to="/comp/deadfish">{{$t('comptools.compdeadfish.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('comptools.compdeadfish.long')" />
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from "@/components/inputs/VaItem.vue"

export default {
  name: 'CompTools',

  props: {
    msg: String
  },

  components: {
    VaItem,
  },

  data: function () {
    return {
      title: "CompTools",
      show: [true, true, true, true, true, true, true, true, true, true]
    }
  },

}
</script>
