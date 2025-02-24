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
          <h5 class="card-title">{{$t('ciphers.title')}}</h5>
          <p class="card-text" v-html="$t('ciphers.long')"></p>
          <router-link to="/ciphers"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('rotciphers.title')}}</h5>
          <p class="card-text" v-html="$t('rotciphers.long')"></p>
          <router-link to="/rotcipher"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('substcipher.title')}}</h5>
          <p class="card-text" v-html="$t('substcipher.long')"></p>
          <router-link to="/substcipher"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('codebook.title')}}</h5>
          <p class="card-text" v-html="$t('codebook.long')"></p>
          <router-link to="/codebook"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('fonts.title')}}</h5>
          <p class="card-text" v-html="$t('fonts.long')"></p>
          <router-link to="/fonts"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('segment.title')}}</h5>
          <p class="card-text" v-html="$t('segment.long')"></p>
          <router-link to="/segment"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('resistor.title')}}</h5>
          <p class="card-text" v-html="$t('resistor.long')"></p>
          <router-link to="/resistor"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('decabit.title')}}</h5>
          <p class="card-text" v-html="$t('decabit.long')"></p>
          <router-link to="/decabit"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('freqanal.title')}}</h5>
          <p class="card-text" v-html="$t('freqanal.long')"></p>
          <router-link to="/freqanal"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>
