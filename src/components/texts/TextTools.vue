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
          <h5 class="card-title">{{$t('texttools.wordvalue.title')}}</h5>
          <p class="card-text" v-html="$t('texttools.wordvalue.long')"></p>
          <router-link to="/textwordvalue"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('texttools.charcodes.title')}}</h5>
          <p class="card-text" v-html="$t('texttools.charcodes.long')"></p>
          <router-link to="/textcodes"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('texttools.smartreplace.title')}}</h5>
          <p class="card-text" v-html="$t('texttools.smartreplace.long')"></p>
          <router-link to="/smartreplace"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('texttools.analyze.title')}}</h5>
          <p class="card-text" v-html="$t('texttools.analyze.long')"></p>
          <router-link to="/textanalyzer"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('texttools.texttonumbers.title')}}</h5>
          <p class="card-text" v-html="$t('texttools.texttonumbers.long')"></p>
          <router-link to="/texttonumbers"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('texttools.keyboards.title')}}</h5>
          <p class="card-text" v-html="$t('texttools.keyboards.long')"></p>
          <router-link to="/textkeyboards"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('texttools.texttoss.title')}}</h5>
          <p class="card-text" v-html="$t('texttools.texttoss.long')"></p>
          <router-link to="/texttoss"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>
