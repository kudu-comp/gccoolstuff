<template>
  <div id="nav" class="text-center">
    <router-link to="/coord/coordconvert">{{$t('coordinates.convert.title')}}</router-link> |
    <router-link to="/coord/coordproj">{{$t('coordinates.project.title')}}</router-link> |
    <router-link to="/coord/coordmapmaker">{{$t('coordinates.mapmaker.title')}}</router-link> |
    <router-link to="/coord/coordincomplete">{{$t('coordinates.incomplete.title')}}</router-link> |
    <router-link to="/coord/coordlines">{{$t('coordinates.lines.title')}}</router-link> |
    <router-link to="/coord/coordtriangles">{{$t('coordinates.triangles.title')}}</router-link> |
    <router-link to="/coord/coordcircles">{{$t('coordinates.circles.title')}}</router-link> |
    <router-link to="/coord/coordantipode">{{$t('coordinates.antipode.title')}}</router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['Coord'].includes($route.name)">
    <div class="container">
      <va-item v-bind:showitem="show[0]" v-on:toggle="toggleItem(0)">
        <template v-slot:header>{{$t('coordinates.convert.title')}}</template>
        <template v-slot:content>
          <strong><router-link to="/coord/coordconvert">{{$t('coordinates.convert.title')}}</router-link></strong> - {{$t('coordinates.convert.long')}}
        </template>
      </va-item>
      <va-item v-bind:showitem="show[1]" v-on:toggle="toggleItem(1)">
        <template v-slot:header>{{$t('coordinates.project.title')}}</template>
        <template v-slot:content>
          <strong><router-link to="/coord/coordproj">{{$t('coordinates.project.title')}}</router-link></strong> - {{$t('coordinates.project.long')}}
        </template>
      </va-item>
      <va-item v-bind:showitem="show[2]" v-on:toggle="toggleItem(2)">
        <template v-slot:header>{{$t('coordinates.mapmaker.title')}}</template>
        <template v-slot:content>
          <strong><router-link to="/coord/coordmapmaker">{{$t('coordinates.mapmaker.title')}}</router-link></strong> - {{$t('coordinates.mapmaker.long')}}
        </template>
      </va-item>
      <va-item v-bind:showitem="show[4]" v-on:toggle="toggleItem(4)">
        <template v-slot:header>{{$t('coordinates.incomplete.title')}}</template>
        <template v-slot:content>
          <strong><router-link to="/coord/coordincomplete">{{$t('coordinates.incomplete.title')}}</router-link></strong> - {{$t('coordinates.incomplete.long')}}
        </template>
      </va-item>
      <va-item v-bind:showitem="show[5]" v-on:toggle="toggleItem(5)">
        <template v-slot:header>{{$t('coordinates.lines.title')}}</template>
        <template v-slot:content>
          <strong><router-link to="/coord/coordlines">{{$t('coordinates.lines.title')}}</router-link></strong> - {{$t('coordinates.lines.long')}}
        </template>
      </va-item>
      <va-item v-bind:showitem="show[6]" v-on:toggle="toggleItem(6)">
        <template v-slot:header>{{$t('coordinates.triangles.title')}}</template>
        <template v-slot:content>
          <strong><router-link to="/coord/coordtriangles">{{$t('coordinates.triangles.title')}}</router-link></strong> - {{$t('coordinates.triangles.long')}}
        </template>
      </va-item>
      <va-item v-bind:showitem="show[7]" v-on:toggle="toggleItem(7)">
        <template v-slot:header>{{$t('coordinates.circles.title')}}</template>
        <template v-slot:content>
          <strong><router-link to="/coord/coordtriangles">{{$t('coordinates.circles.title')}}</router-link></strong> - {{$t('coordinates.circles.long')}}
        </template>
      </va-item>
      <va-item v-bind:showitem="show[8]" v-on:toggle="toggleItem(8)">
        <template v-slot:header>{{$t('coordinates.antipode.title')}}</template>
        <template v-slot:content>
          <strong><router-link to="/coord/coordantipode">{{$t('coordinates.antipode.title')}}</router-link></strong> - {{$t('coordinates.antipode.long')}}
        </template>
      </va-item>
      <va-item v-bind:showitem="show[9]" v-on:toggle="toggleItem(9)">
        <template v-slot:header>{{$t('coordinates.support.title')}}</template>
        <template v-slot:content>
          {{$t('coordinates.support.long')}}
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from "@/components/inputs/VaItem.vue"

export default {
  name: 'CoordToolbox',
  props: {
    msg: String
  },

  components: {
    VaItem,
  },

  data: function () {
    return {
      hidebutton: true,
      show: [true, true, true, true, true, true, true, true, true, true]
    }
  },

  methods: {

    toggleItem: function(itemnr) {
      this.show[itemnr] = !this.show[itemnr];
    },

  },
}
</script>
