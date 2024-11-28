<template>
  <div class="d-flex flex-column mx-4">
    <div class="row justify-content-around">
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="@/assets/images/other.jpg" alt="Text" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.other')}}</h5>
          <p class="card-text" v-html="$t('othertools.intro')"></p>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('printlog.title')}}</h5>
          <p class="card-text" v-html="$t('printlog.long')"></p>
          <router-link to="/printlog"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('htmlparser.title')}}</h5>
          <p class="card-text" v-html="$t('htmlparser.long')"></p>
          <router-link to="/htmlparser"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('sudokusolv.title')}}</h5>
          <p class="card-text" v-html="$t('sudokusolv.long')"></p>
          <router-link to="/sudokusolv"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mmsolver.title')}}</h5>
          <p class="card-text" v-html="$t('mmsolver.long')"></p>
          <router-link to="/mmsolver"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('unitconvertor.title')}}</h5>
          <p class="card-text" v-html="$t('unitconvertor.long')"></p>
          <router-link to="/unitconvertor"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('datecalc.title')}}</h5>
          <p class="card-text" v-html="$t('datecalc.long')"></p>
          <router-link to="/datecalc"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('randomizer.title')}}</h5>
          <p class="card-text" v-html="$t('randomizer.long')"></p>
          <router-link to="/randomizer"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('periodictable.title')}}</h5>
          <p class="card-text" v-html="$t('periodictable.long')"></p>
          <router-link to="/periodictable"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('countries.title')}}</h5>
          <p class="card-text" v-html="$t('countries.long')"></p>
          <router-link to="/countries"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('usastates.title')}}</h5>
          <p class="card-text" v-html="$t('usastates.long')"></p>
          <router-link to="/usastates"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('regions.title')}}</h5>
          <p class="card-text" v-html="$t('regions.long')"></p>
          <router-link to="/regions"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('dnacode.title')}}</h5>
          <p class="card-text" v-html="$t('dnacode.long')"></p>
          <router-link to="/regions"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('gameoflife.title')}}</h5>
          <p class="card-text" v-html="$t('gameoflife.long')"></p>
          <router-link to="/gameoflife"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('booksearch.title')}}</h5>
          <p class="card-text" v-html="$t('booksearch.long')"></p>
          <router-link to="/booksearch"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>
