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
          <h5 class="card-title">{{$t('baseconv.title')}}</h5>
          <p class="card-text" v-html="$t('baseconv.long')"></p>
          <router-link to="/baseconv"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('digits.title')}}</h5>
          <p class="card-text" v-html="$t('digits.long')"></p>
          <router-link to="/digits"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('primes.title')}}</h5>
          <p class="card-text" v-html="$t('primes.long')"></p>
          <router-link to="/primes"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('romans.title')}}</h5>
          <p class="card-text" v-html="$t('romans.long')"></p>
          <router-link to="/romans"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('fibonacci.title')}}</h5>
          <p class="card-text" v-html="$t('fibonacci.long')"></p>
          <router-link to="/fibonacci"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('gcdandlcm.title')}}</h5>
          <p class="card-text" v-html="$t('gcdandlcm.long')"></p>
          <router-link to="/gcdandlcm"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('formulasolver.title')}}</h5>
          <p class="card-text" v-html="$t('formulasolver.long')"></p>
          <router-link to="/formulasolv"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('numberprop.title')}}</h5>
          <p class="card-text" v-html="$t('numberprop.long')"></p>
          <router-link to="/numberprop"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('bignumbers.title')}}</h5>
          <p class="card-text" v-html="$t('bignumbers.long')"></p>
          <router-link to="/bignumbers"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('cryptosolver.title')}}</h5>
          <p class="card-text" v-html="$t('cryptosolver.long')"></p>
          <router-link to="/cryptosolver"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('sequences.title')}}</h5>
          <p class="card-text" v-html="$t('sequences.long')"></p>
          <router-link to="/sequences"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('combinations.title')}}</h5>
          <p class="card-text" v-html="$t('combinations.long')"></p>
          <router-link to="/combinations"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('equations.title')}}</h5>
          <p class="card-text" v-html="$t('equations.long')"></p>
          <router-link to="/equations"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('palindrome.title')}}</h5>
          <p class="card-text" v-html="$t('palindrome.long')"></p>
          <router-link to="/palindrome"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('nimbers.title')}}</h5>
          <p class="card-text" v-html="$t('nimbers.long')"></p>
          <router-link to="/nimbers"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>
