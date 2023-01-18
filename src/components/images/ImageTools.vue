<template>
  <div
    id="nav"
    class="text-center"
  >
    <router-link to="/images/exifscanner">
      {{ $t('imagetools.exifscanner.title') }}
    </router-link> |
    <router-link to="/images/colorpicker">
      {{ $t('imagetools.colorpicker.title') }}
    </router-link> |
    <router-link to="/images/filltool">
      {{ $t('imagetools.filltool.title') }}
    </router-link> |
    <router-link to="/images/pixeldata">
      {{ $t('imagetools.pixeldata.title') }}
    </router-link> |
    <router-link to="/images/pixelbuild">
      {{ $t('imagetools.pixelbuild.title') }}
    </router-link> |
    <router-link to="/images/imagetransform">
      {{ $t('imagetools.imagetransform.title') }}
    </router-link> |
    <router-link to="/images/textextractor">
      {{ $t('imagetools.textextractor.title') }}
    </router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['ImageTools'].includes($route.name)">
    <div class="container">
      <p
        class="intro"
        v-html="$t('imagetools.intro')"
      />
      <va-item
        :showitem="show[0]"
        @toggle="show[0] = !show[0]"
      >
        <template #header>
          <router-link to="/images/colorpicker">
            {{ $t('imagetools.colorpicker.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('imagetools.colorpicker.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[1]"
        @toggle="show[1] = !show[1]"
      >
        <template #header>
          <router-link to="/images/exifscanner">
            {{ $t('imagetools.exifscanner.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('imagetools.exifscanner.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[2]"
        @toggle="show[2] = !show[2]"
      >
        <template #header>
          <router-link to="/images/filltool">
            {{ $t('imagetools.filltool.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('imagetools.filltool.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[3]"
        @toggle="show[3] = !show[3]"
      >
        <template #header>
          <router-link to="/images/pixeldata">
            {{ $t('imagetools.pixeldata.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('imagetools.pixeldata.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[4]"
        @toggle="show[4] = !show[4]"
      >
        <template #header>
          <router-link to="/images/pixelbuild">
            {{ $t('imagetools.pixelbuild.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('imagetools.pixelbuild.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[5]"
        @toggle="show[5] = !show[5]"
      >
        <template #header>
          <router-link to="/images/imagetransform">
            {{ $t('imagetools.imagetransform.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('imagetools.imagetransform.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[6]"
        @toggle="show[6] = !show[6]"
      >
        <template #header>
          <router-link to="/images/textextractor">
            {{ $t('imagetools.textextractor.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('imagetools.textextractor.long')" />
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from "@/components/inputs/VaItem.vue"

export default {

  name: 'ImageTools',

  components: {
    VaItem,
  },

  data: function () {
    return {
      show: [true, true, true, true, true, true, true, true, true]
    }
  },


}
</script>
