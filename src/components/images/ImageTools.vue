<template>
  <div id="nav" class="text-center">
    <router-link to="/images/exifscanner">{{$t('imagetools.exifscanner.title')}}</router-link> |
    <router-link to="/images/colorpicker">{{$t('imagetools.colorpicker.title')}}</router-link> |
    <router-link to="/images/filltool">{{$t('imagetools.filltool.title')}}</router-link> |
    <router-link to="/images/pixeldata">{{$t('imagetools.pixeldata.title')}}</router-link> |
    <router-link to="/images/pixelbuild">{{$t('imagetools.pixelbuild.title')}}</router-link> |
    <router-link to="/images/imagetransform">{{$t('imagetools.imagetransform.title')}}</router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['ImageTools'].includes($route.name)">
    <div class="container">
      <va-item v-bind:showitem='show[0]' v-on:toggle='show[0] = !show[0]'>
        <template v-slot:header><router-link to="/images/colorpicker">{{$t('imagetools.colorpicker.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('imagetools.colorpicker.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[1]' v-on:toggle='show[1] = !show[1]'>
        <template v-slot:header><router-link to="/images/exifscanner">{{$t('imagetools.exifscanner.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('imagetools.exifscanner.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[2]' v-on:toggle='show[2] = !show[2]'>
        <template v-slot:header><router-link to="/images/filltool">{{$t('imagetools.filltool.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('imagetools.filltool.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[3]' v-on:toggle='show[3] = !show[3]'>
        <template v-slot:header><router-link to="/images/pixeldata">{{$t('imagetools.pixeldata.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('imagetools.pixeldata.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[3]' v-on:toggle='show[3] = !show[3]'>
        <template v-slot:header><router-link to="/images/pixelbuild">{{$t('imagetools.pixelbuild.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('imagetools.pixelbuild.long')" />
        </template>
      </va-item>
      <va-item v-bind:showitem='show[3]' v-on:toggle='show[4] = !show[4]'>
        <template v-slot:header><router-link to="/images/imagetransform">{{$t('imagetools.imagetransform.title')}}</router-link></template>
        <template v-slot:content>
           <span v-html="$t('imagetools.imagetransform.long')" />
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
