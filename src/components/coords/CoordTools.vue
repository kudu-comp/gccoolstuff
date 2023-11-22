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
          <h5 class="card-title">{{$t('coordinates.convert.title')}}</h5>
          <p class="card-text" v-html="$t('coordinates.convert.long')"></p>
          <router-link to="/coordconvert"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('coordinates.project.title')}}</h5>
          <p class="card-text" v-html="$t('coordinates.project.long')"></p>
          <router-link to="/coordproj"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('coordinates.mapmaker.title')}}</h5>
          <p class="card-text" v-html="$t('coordinates.mapmaker.long')"></p>
          <router-link to="/coordmapmaker"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('coordinates.incomplete.title')}}</h5>
          <p class="card-text" v-html="$t('coordinates.incomplete.long')"></p>
          <router-link to="/coordincomplete"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('coordinates.lines.title')}}</h5>
          <p class="card-text" v-html="$t('coordinates.lines.long')"></p>
          <router-link to="/coordlines"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('coordinates.triangles.title')}}</h5>
          <p class="card-text" v-html="$t('coordinates.triangles.long')"></p>
          <router-link to="/coordtriangles"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('coordinates.circles.title')}}</h5>
          <p class="card-text" v-html="$t('coordinates.circles.long')"></p>
          <router-link to="/coordcircles"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('coordinates.antipode.title')}}</h5>
          <p class="card-text" v-html="$t('coordinates.antipode.long')"></p>
          <router-link to="/coordantipode"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('coordinates.w3w.title')}}</h5>
          <p class="card-text" v-html="$t('coordinates.w3w.long')"></p>
          <router-link to="/coordw3w"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <div class="card-body">
          <h5 class="card-title">{{$t('coordinates.revwherigo.title')}}</h5>
          <p class="card-text" v-html="$t('coordinates.revwherigo.long')"></p>
          <router-link to="/reversewherigo"><span class="btn btn-primary">{{$t('labels.letsgo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>
