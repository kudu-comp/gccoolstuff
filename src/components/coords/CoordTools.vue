<template>
  <div class="d-flex flex-column mx-4">
    <div class="row justify-content-around">
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="@/assets/images/coordinates.jpg" alt="Text" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.coordinates')}}</h5>
          <p class="card-text" v-html="$t('coordinates.intro')"></p>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('convert.title')}}</h5>
          <p class="card-text" v-html="$t('convert.long')"></p>
          <router-link to="/convert"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('project.title')}}</h5>
          <p class="card-text" v-html="$t('project.long')"></p>
          <router-link to="/project"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('mapmaker.title')}}</h5>
          <p class="card-text" v-html="$t('mapmaker.long')"></p>
          <router-link to="/mapmaker"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('incomplete.title')}}</h5>
          <p class="card-text" v-html="$t('incomplete.long')"></p>
          <router-link to="/incomplete"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('lines.title')}}</h5>
          <p class="card-text" v-html="$t('lines.long')"></p>
          <router-link to="/lines"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('triangles.title')}}</h5>
          <p class="card-text" v-html="$t('triangles.long')"></p>
          <router-link to="/triangles"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('circles.title')}}</h5>
          <p class="card-text" v-html="$t('circles.long')"></p>
          <router-link to="/circles"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('antipode.title')}}</h5>
          <p class="card-text" v-html="$t('antipode.long')"></p>
          <router-link to="/antipode"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('w3w.title')}}</h5>
          <p class="card-text" v-html="$t('w3w.long')"></p>
          <router-link to="/w3w"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('revwherigo.title')}}</h5>
          <p class="card-text" v-html="$t('revwherigo.long')"></p>
          <router-link to="/revwherigo"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>
