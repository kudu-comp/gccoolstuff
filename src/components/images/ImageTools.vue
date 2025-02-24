<template>
  <div class="d-flex flex-column mx-4">
    <div class="row justify-content-around">
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="@/assets/images/images.jpg" alt="Text" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.imagetools')}}</h5>
          <p class="card-text" v-html="$t('imagetools.intro')"></p>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('colorpicker.title')}}</h5>
          <p class="card-text" v-html="$t('colorpicker.long')"></p>
          <router-link to="/colorpicker"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('exifscanner.title')}}</h5>
          <p class="card-text" v-html="$t('exifscanner.long')"></p>
          <router-link to="/exifscanner"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('filltool.title')}}</h5>
          <p class="card-text" v-html="$t('filltool.long')"></p>
          <router-link to="/filltool"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('pixeldata.title')}}</h5>
          <p class="card-text" v-html="$t('pixeldata.long')"></p>
          <router-link to="/pixeldata"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('pixelbuild.title')}}</h5>
          <p class="card-text" v-html="$t('pixelbuild.long')"></p>
          <router-link to="/pixelbuild"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('imagetransform.title')}}</h5>
          <p class="card-text" v-html="$t('imagetransform.long')"></p>
          <router-link to="/imagetransform"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('textextractor.title')}}</h5>
          <p class="card-text" v-html="$t('textextractor.long')"></p>
          <router-link to="/textextractor"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('barcode.title')}}</h5>
          <p class="card-text" v-html="$t('barcode.long')"></p>
          <router-link to="/barcode"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
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
