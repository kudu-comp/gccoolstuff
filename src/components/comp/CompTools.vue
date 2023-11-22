<template>
  <div class="d-flex flex-column mx-4">
    <div class="row justify-content-around">
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="@/assets/images/comp.jpg" alt="Text" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.comptools')}}</h5>
          <p class="card-text" v-html="$t('comptools.intro')"></p>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('texttools.charcodes.title')}}</h5>
          <p class="card-text" v-html="$t('texttools.charcodes.long')"></p>
          <router-link to="/charcodes"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('comptools.compbintotext.title')}}</h5>
          <p class="card-text" v-html="$t('comptools.compbintotext.long')"></p>
          <router-link to="/bintotext"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('comptools.compbcd.title')}}</h5>
          <p class="card-text" v-html="$t('comptools.compbcd.long')"></p>
          <router-link to="/bcd"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('comptools.encryption.title')}}</h5>
          <p class="card-text" v-html="$t('comptools.encryption.long')"></p>
          <router-link to="/encryption"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('comptools.hashes.title')}}</h5>
          <p class="card-text" v-html="$t('comptools.hashes.long')"></p>
          <router-link to="/hashes"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('comptools.compbrainfuck.title')}}</h5>
          <p class="card-text" v-html="$t('comptools.compbrainfuck.long')"></p>
          <router-link to="/brainfuck"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('comptools.cow.title')}}</h5>
          <p class="card-text" v-html="$t('comptools.cow.long')"></p>
          <router-link to="/cow"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('comptools.beatnik.title')}}</h5>
          <p class="card-text" v-html="$t('comptools.beatnik.long')"></p>
          <router-link to="/beatnik"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('comptools.compdeadfish.title')}}</h5>
          <p class="card-text" v-html="$t('comptools.compdeadfish.long')"></p>
          <router-link to="/deadfish"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('comptools.duckspeak.title')}}</h5>
          <p class="card-text" v-html="$t('comptools.duckspeak.long')"></p>
          <router-link to="/duckspeak"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>
