<template>
  <div class="d-flex flex-column mx-4">
    <div class="row justify-content-around">
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="@/assets/images/text.jpg" alt="Text" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.texttools')}}</h5>
          <p class="card-text" v-html="$t('texttools.intro')"></p>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('tryanswers.title')}}</h5>
          <p class="card-text" v-html="$t('tryanswers.long')"></p>
          <router-link to="/tryanswers"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('wordvalue.title')}}</h5>
          <p class="card-text" v-html="$t('wordvalue.long')"></p>
          <router-link to="/wordvalue"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('charcodes.title')}}</h5>
          <p class="card-text" v-html="$t('charcodes.long')"></p>
          <router-link to="/charcodes"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('analtxt.title')}}</h5>
          <p class="card-text" v-html="$t('analtxt.long')"></p>
          <router-link to="/analtxt"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('texttonum.title')}}</h5>
          <p class="card-text" v-html="$t('texttonum.long')"></p>
          <router-link to="/texttonum"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('keyboards.title')}}</h5>
          <p class="card-text" v-html="$t('keyboards.long')"></p>
          <router-link to="/keyboards"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('texttoss.title')}}</h5>
          <p class="card-text" v-html="$t('texttoss.long')"></p>
          <router-link to="/texttoss"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('piglatin.title')}}</h5>
          <p class="card-text" v-html="$t('piglatin.long')"></p>
          <router-link to="/piglatin"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('numerology.title')}}</h5>
          <p class="card-text" v-html="$t('numerology.long')"></p>
          <router-link to="/numerology"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('textchunks.title')}}</h5>
          <p class="card-text" v-html="$t('textchunks.long')"></p>
          <router-link to="/textchunks"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>
