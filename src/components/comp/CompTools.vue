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
          <h5 class="card-title">{{$t('charcodes.title')}}</h5>
          <p class="card-text" v-html="$t('charcodes.long')"></p>
          <router-link to="/charcodes"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('bintotext.title')}}</h5>
          <p class="card-text" v-html="$t('bintotext.long')"></p>
          <router-link to="/bintotext"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('bcd.title')}}</h5>
          <p class="card-text" v-html="$t('bcd.long')"></p>
          <router-link to="/bcd"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('encryption.title')}}</h5>
          <p class="card-text" v-html="$t('encryption.long')"></p>
          <router-link to="/encryption"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('hashes.title')}}</h5>
          <p class="card-text" v-html="$t('hashes.long')"></p>
          <router-link to="/hashes"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('brainfuck.title')}}</h5>
          <p class="card-text" v-html="$t('brainfuck.long')"></p>
          <router-link to="/brainfuck"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('cow.title')}}</h5>
          <p class="card-text" v-html="$t('cow.long')"></p>
          <router-link to="/cow"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('beatnik.title')}}</h5>
          <p class="card-text" v-html="$t('beatnik.long')"></p>
          <router-link to="/beatnik"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('deadfish.title')}}</h5>
          <p class="card-text" v-html="$t('deadfish.long')"></p>
          <router-link to="/deadfish"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('duckspeak.title')}}</h5>
          <p class="card-text" v-html="$t('duckspeak.long')"></p>
          <router-link to="/duckspeak"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('checksum.title')}}</h5>
          <p class="card-text" v-html="$t('checksum.long')"></p>
          <router-link to="/checksum"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('truthtable.title')}}</h5>
          <p class="card-text" v-html="$t('truthtable.long')"></p>
          <router-link to="/truthtable"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>
