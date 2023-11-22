<template>
  <div class="d-flex flex-column mx-4">
    <div class="row justify-content-around">
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="@/assets/images/codes.jpg" alt="Text" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.codes')}}</h5>
          <p class="card-text" v-html="$t('codes.intro')"></p>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.ciphers')}}</h5>
          <p class="card-text" v-html="$t('cp.long')"></p>
          <router-link to="/codebook"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('rotciphers.title')}}</h5>
          <p class="card-text" v-html="$t('rotciphers.long')"></p>
          <router-link to="/rotcipher"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('codes.codebook.title')}}</h5>
          <p class="card-text" v-html="$t('codes.codebook.long')"></p>
          <router-link to="/codebook"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('codes.fonts.title')}}</h5>
          <p class="card-text" v-html="$t('codes.fonts.long')"></p>
          <router-link to="/fonts"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('codes.segment.title')}}</h5>
          <p class="card-text" v-html="$t('codes.segment.long')"></p>
          <router-link to="/segment"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('codes.resistorcode.title')}}</h5>
          <p class="card-text" v-html="$t('codes.resistorcode.long')"></p>
          <router-link to="/resistorcode"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('codes.decabit.title')}}</h5>
          <p class="card-text" v-html="$t('codes.decabit.long')"></p>
          <router-link to="/decabit"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('freqanal.title')}}</h5>
          <p class="card-text" v-html="$t('freqanal.long')"></p>
          <router-link to="/freqanal"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>
