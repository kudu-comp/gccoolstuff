<template>
  <div class="d-flex flex-column mx-4">
    <div class="row justify-content-around">
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="@/assets/images/whatsnew.jpg" alt="Text" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.other')}}</h5>
          <p class="card-text" v-html="$t('othertools.intro')"></p>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.htmlscanner')}}</h5>
          <p class="card-text" v-html="$t('htmlscanner.long')"></p>
          <router-link to="/sudokusolver"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('othertools.sudokusolver.title')}}</h5>
          <p class="card-text" v-html="$t('othertools.sudokusolver.long')"></p>
          <router-link to="/sudokusolver"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('othertools.mmsolver.title')}}</h5>
          <p class="card-text" v-html="$t('othertools.mmsolver.long')"></p>
          <router-link to="/mmsolver"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('othertools.unitconvertor.title')}}</h5>
          <p class="card-text" v-html="$t('othertools.unitconvertor.long')"></p>
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
          <h5 class="card-title">{{$t('othertools.periodictable.title')}}</h5>
          <p class="card-text" v-html="$t('othertools.periodictable.long')"></p>
          <router-link to="/periodictable"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('othertools.countries.title')}}</h5>
          <p class="card-text" v-html="$t('othertools.countries.long')"></p>
          <router-link to="/countries"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('othertools.usastates.title')}}</h5>
          <p class="card-text" v-html="$t('othertools.usastates.long')"></p>
          <router-link to="/usastates"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('othertools.countryregions.title')}}</h5>
          <p class="card-text" v-html="$t('othertools.countryregions.long')"></p>
          <router-link to="/countryregions"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('othertools.dnacode.title')}}</h5>
          <p class="card-text" v-html="$t('othertools.dnacode.long')"></p>
          <router-link to="/countryregions"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>
