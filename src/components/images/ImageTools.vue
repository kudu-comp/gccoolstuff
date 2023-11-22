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
          <h5 class="card-title">{{$t('imagetools.colorpicker.title')}}</h5>
          <p class="card-text" v-html="$t('imagetools.colorpicker.long')"></p>
          <router-link to="/colorpicker"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('imagetools.exifscanner.title')}}</h5>
          <p class="card-text" v-html="$t('imagetools.exifscanner.long')"></p>
          <router-link to="/exifscanner"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('imagetools.filltool.title')}}</h5>
          <p class="card-text" v-html="$t('imagetools.filltool.long')"></p>
          <router-link to="/filltool"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('imagetools.pixeldata.title')}}</h5>
          <p class="card-text" v-html="$t('imagetools.pixeldata.long')"></p>
          <router-link to="/pixeldata"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('imagetools.pixelbuild.title')}}</h5>
          <p class="card-text" v-html="$t('imagetools.pixelbuild.long')"></p>
          <router-link to="/pixelbuild"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('imagetools.imagetransform.title')}}</h5>
          <p class="card-text" v-html="$t('imagetools.imagetransform.long')"></p>
          <router-link to="/imagetransform"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('imagetools.textextractor.title')}}</h5>
          <p class="card-text" v-html="$t('imagetools.textextractor.long')"></p>
          <router-link to="/textextractor"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
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
