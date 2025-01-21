<template>
  <div class="d-flex flex-column mx-4">
    <h1>GC Tools</h1>
    <div class="row justify-content-around">
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/welcome.jpg" alt="Welcome" style="height: 200px;">
        <div class="card-body">
          <h5 class="card-title">{{$t('labels.welcome')}}</h5>
          <p class="card-text" v-html="$t('home.intro')"></p>
          <router-link to="/alltools"><span class="btn">{{$t('labels.alltools')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('home.whatare')}}</h5>
          <div class="input-group input-group-sm">
            <input
              type="text"
              class="form-control"
              aria-label="Example text with button addon"
              aria-describedby="btn1"
              v-model="searchstr"
            />
            <div class="input-group-append">
              <button
                class="btn"
                style="border-radius: 0px 5px 5px 0px;"
                id="btn1"
                @click="goSearch()"
              >
                <i class="fa fa-search"></i>
              </button>
            </div>
          </div>
          <h5 class="card-title mt-2">{{$t('home.favs')}}</h5>
          <div class="card-text">
            <ul>
              <li>
                <router-link to="/wordvalue">{{$t('wordvalue.title')}}</router-link>
              </li>
              <li>
                <router-link to="/printlog">{{$t('printlog.title')}}</router-link>
              </li>
              <li>
                <router-link to="/ciphers/rot13">ROT13</router-link>
              </li>
              <li>
                <router-link to="/tryanswers">{{$t('tryanswers.title')}}</router-link>
              </li>
              <li>
                <router-link to="/convert">{{$t('convert.title')}} {{$t('menu.coordinates')}}</router-link>
              </li>
              <li>
                <router-link to="/codebook">{{$t('codebook.title')}}</router-link>
              </li>
              <li>
                <router-link to="/htmlparser">{{$t('htmlparser.title')}}</router-link>
              </li>
              <li>
                <router-link to="/sudokusolv">{{$t('sudokusolv.title')}}</router-link>
              </li>
            </ul>
          </div>
          <h5 class="card-title mt-2">{{$t('home.contact')}}</h5>
          <div class="card-text">
            {{$t('home.contacttxt')}}
          </div>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/featured.jpg" alt="Featured" style="height: 200px;">
        <div class="card-body">
          <h5 class="card-title">{{$t('labels.featured')}} - {{$t('tryanswers.title')}}</h5>
          <p class="card-text" v-html="$t('tryanswers.short')">
          </p>
          <router-link to="/tryanswers"><span class="btn">{{$t('labels.moreinfo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/coordinates.jpg" alt="Coordinates" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.coordinates')}}</h5>
          <p class="card-text" v-html="$t('coordinates.intro')"></p>
          <router-link to="/helpcoord"><span class="btn">{{$t('labels.moreinfo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/codes.jpg" alt="Codes" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.codes')}}</h5>
          <p class="card-text" v-html="$t('codes.intro')"></p>
          <router-link to="/helpcodes"><span class="btn">{{$t('labels.moreinfo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/text.jpg" alt="Text" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.texttools')}}</h5>
          <p class="card-text" v-html="$t('texttools.intro')"></p>
          <router-link to="/helptext"><span class="btn">{{$t('labels.moreinfo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/math.jpg" alt="Mathematics" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.mathtools')}}</h5>
          <p class="card-text" v-html="$t('mathtools.intro')"></p>
          <router-link to="/helpmath"><span class="btn">{{$t('labels.moreinfo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/images.jpg" alt="Images" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.imagetools')}}</h5>
          <p class="card-text" v-html="$t('imagetools.intro')"></p>
          <router-link to="/helpimage"><span class="btn">{{$t('labels.moreinfo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/comp.jpg" alt="Programming" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.comptools')}}</h5>
          <p class="card-text" v-html="$t('comptools.intro')"></p>
          <router-link to="/helpcomp"><span class="btn">{{$t('labels.moreinfo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/other.jpg" alt="Other tools" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.other')}}</h5>
          <p class="card-text" v-html="$t('othertools.intro')"></p>
          <router-link to="/helpcomp"><span class="btn">{{$t('labels.moreinfo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  
  data() {
    return {
      searchstr: ""
    }
  },

  methods: {
    
    goSearch: function() {
      this.$router.push({ name: 'AllTools', query: { s: this.searchstr } })
    }
  }

}
</script>
