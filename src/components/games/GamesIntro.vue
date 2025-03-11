<template>
  <div class="d-flex flex-column mx-4">
    <div class="row justify-content-around">
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="@/assets/images/games.jpg" alt="Text" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.games')}}</h5>
          <p class="card-text" v-html="$t('games.intro')"></p>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('sudokusolv.title')}}</h5>
          <p class="card-text" v-html="$t('sudokusolv.long')"></p>
          <router-link to="/sudokusolv"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mmsolver.title')}}</h5>
          <p class="card-text" v-html="$t('mmsolver.long')"></p>
          <router-link to="/mmsolver"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('dictsearch.title')}}</h5>
          <p class="card-text" v-html="$t('dictsearch.long')"></p>
          <router-link to="/dictsearch"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('anagrams.title')}}</h5>
          <p class="card-text" v-html="$t('anagrams.long')"></p>
          <router-link to="/anagrams"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('wordle.title')}}</h5>
          <p class="card-text" v-html="$t('wordle.long')"></p>
          <router-link to="/wordle"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('wordsearch.title')}}</h5>
          <p class="card-text" v-html="$t('wordsearch.long')"></p>
          <router-link to="/wordsearch"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('gameoflife.title')}}</h5>
          <p class="card-text" v-html="$t('gameoflife.long')"></p>
          <router-link to="/gameoflife"><span class="btn">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>
