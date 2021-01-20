<template>
  <div id="nav" class="text-center">
    <router-link to="/images/exifscanner">{{$t('imagetools.exifscanner.title')}}</router-link> |
    <router-link to="/images/colorpicker">{{$t('imagetools.colorpicker.title')}}</router-link> |
    <router-link to="/images/filltool">{{$t('imagetools.filltool.title')}}</router-link> |
    <router-link to="/images/pixeldata">{{$t('imagetools.pixeldata.title')}}</router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['ImageTools'].includes($route.name)">
    <div class="container">
      <va-item v-bind:showitem='show[0]' v-on:toggle='show[0] = !show[0]'>
        <template v-slot:header>{{$t('imagetools.colorpicker.title')}}</template>
        <template v-slot:content>
          <router-link to="/images/colorpicker">{{$t('imagetools.colorpicker.title')}}</router-link> - {{$t('imagetools.colorpicker.long')}}.<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[1]' v-on:toggle='show[1] = !show[1]'>
        <template v-slot:header>{{$t('imagetools.exifscanner.title')}}</template>
        <template v-slot:content>
          <router-link to="/images/exifscanner">{{$t('imagetools.exifscanner.title')}}</router-link> - {{$t('imagetools.exifscanner.long')}}.<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[2]' v-on:toggle='show[2] = !show[2]'>
        <template v-slot:header>{{$t('imagetools.filltool.title')}}</template>
        <template v-slot:content>
          <router-link to="/images/filltool">{{$t('imagetools.filltool.title')}}</router-link> - {{$t('imagetools.filltool.long')}}.<br>
        </template>
      </va-item>
      <va-item v-bind:showitem='show[3]' v-on:toggle='show[2] = !show[3]'>
        <template v-slot:header>{{$t('imagetools.pixeldata.title')}}</template>
        <template v-slot:content>
          <router-link to="/images/pixeldata">{{$t('imagetools.pixeldata.title')}}</router-link> - {{$t('imagetools.pixeldata.long')}}.<br>
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from "@/components/inputs/VaItem.vue"

export default {

  name: 'ImageTools',

  props: {
    msg: String
  },

  components: {
    VaItem,
  },

  data: function () {
    return {
      title: "Mathtools",
      show: [true, true, true, true, true, true, true, true]
    }
  },


}
</script>
