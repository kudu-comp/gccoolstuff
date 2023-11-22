<template>
  <div class="d-flex flex-column mx-4">
    <div class="row justify-content-around">
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="@/assets/images/math.jpg" alt="Text" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.mathtools')}}</h5>
          <p class="card-text" v-html="$t('mathtools.intro')"></p>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mathtools.baseconvert.title')}}</h5>
          <p class="card-text" v-html="$t('mathtools.baseconvert.long')"></p>
          <router-link to="/baseconvertor"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mathtools.decimals.title')}}</h5>
          <p class="card-text" v-html="$t('mathtools.decimals.long')"></p>
          <router-link to="/countdigits"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mathtools.primes.title')}}</h5>
          <p class="card-text" v-html="$t('mathtools.primes.long')"></p>
          <router-link to="/primes"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mathtools.romans.title')}}</h5>
          <p class="card-text" v-html="$t('mathtools.romans.long')"></p>
          <router-link to="/romans"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mathtools.fibonacci.title')}}</h5>
          <p class="card-text" v-html="$t('mathtools.fibonacci.long')"></p>
          <router-link to="/fibonacci"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mathtools.primegcdlcm.title')}}</h5>
          <p class="card-text" v-html="$t('mathtools.primegcdlcm.long')"></p>
          <router-link to="/gcdandlcm"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mathtools.formulasolver.title')}}</h5>
          <p class="card-text" v-html="$t('mathtools.formulasolver.long')"></p>
          <router-link to="/formulasolv"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mathtools.numberprop.title')}}</h5>
          <p class="card-text" v-html="$t('mathtools.numberprop.long')"></p>
          <router-link to="/numberproperties"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mathtools.bignum.title')}}</h5>
          <p class="card-text" v-html="$t('mathtools.bignum.long')"></p>
          <router-link to="/bignumbers"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mathtools.nimbers.title')}}</h5>
          <p class="card-text" v-html="$t('mathtools.nimbers.long')"></p>
          <router-link to="/nimbers"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mathtools.sequences.title')}}</h5>
          <p class="card-text" v-html="$t('mathtools.sequences.long')"></p>
          <router-link to="/sequences"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mathtools.palindrome.title')}}</h5>
          <p class="card-text" v-html="$t('mathtools.palindrome.long')"></p>
          <router-link to="/palindromecounter"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>
