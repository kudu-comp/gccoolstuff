<template>
  <div id="nav" class="text-center">
    <router-link to="/comp/charcodes">{{$t('texttools.charcodes.title')}}</router-link> |
    <router-link to="/comp/bintotext">{{$t('comptools.compbintotext.title')}}</router-link> |
    <router-link to="/comp/bcd">{{$t('comptools.compbcd.title')}}</router-link> | 
    <router-link to="/comp/brainfuck">{{$t('comptools.compbrainfuck.title')}}</router-link> |
    <router-link to="/comp/deadfish">{{$t('comptools.compdeadfish.title')}}</router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['Comp'].includes($route.name)">
    <div class="container">
      <va-item v-bind:showitem='show[0]' v-on:toggle='toggleItem(0)'>
        <template v-slot:header><router-link to="/comp/charcodes">{{$t('texttools.charcodes.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('texttools.charcodes.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[0]' v-on:toggle='toggleItem(4)'>
        <template v-slot:header><router-link to="/comp/bintotext">{{$t('comptools.compbintotext.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('comptools.compbintotext.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[0]' v-on:toggle='toggleItem(1)'>
        <template v-slot:header><router-link to="/comp/bcd">{{$t('comptools.compbcd.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('comptools.compbcd.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[0]' v-on:toggle='toggleItem(2)'>
        <template v-slot:header><router-link to="/comp/brainfuck">{{$t('comptools.compbrainfuck.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('comptools.compbrainfuck.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[0]' v-on:toggle='toggleItem(3)'>
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

  methods: {

    toggleItem: function(itemnr) {
      this.show[itemnr] = !this.show[itemnr];
    }

  },
}
</script>
