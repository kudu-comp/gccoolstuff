<template>
  <div
    id="nav"
    class="text-center"
  >
    <router-link to="/coord/coordconvert">
      {{ $t('coordinates.convert.title') }}
    </router-link> |
    <router-link to="/coord/coordproj">
      {{ $t('coordinates.project.title') }}
    </router-link> |
    <router-link to="/coord/coordmapmaker">
      {{ $t('coordinates.mapmaker.title') }}
    </router-link> |
    <router-link to="/coord/coordincomplete">
      {{ $t('coordinates.incomplete.title') }}
    </router-link> |
    <router-link to="/coord/coordlines">
      {{ $t('coordinates.lines.title') }}
    </router-link> |
    <router-link to="/coord/coordtriangles">
      {{ $t('coordinates.triangles.title') }}
    </router-link> |
    <router-link to="/coord/coordcircles">
      {{ $t('coordinates.circles.title') }}
    </router-link> |
    <router-link to="/coord/coordantipode">
      {{ $t('coordinates.antipode.title') }}
    </router-link> |
    <router-link to="/coord/coordw3w">
      {{ $t('coordinates.w3w.title') }}
    </router-link> |
    <router-link to="/coord/reversewherigo">
      {{ $t('coordinates.revwherigo.title') }}
    </router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['CoordTools'].includes($route.name)">
    <div class="container">
      <p
        class="intro"
        v-html="$t('coordinates.intro')"
      />
      <va-item
        :showitem="show[0]"
        @toggle="show[0]=!show[0]"
      >
        <template #header>
          <router-link to="/coord/coordconvert">
            {{ $t('coordinates.convert.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('coordinates.convert.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[1]"
        @toggle="show[1]=!show[1]"
      >
        <template #header>
          <router-link to="/coord/coordproj">
            {{ $t('coordinates.project.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('coordinates.project.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[2]"
        @toggle="show[2]=!show[2]"
      >
        <template #header>
          <router-link to="/coord/coordmapmaker">
            {{ $t('coordinates.mapmaker.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('coordinates.mapmaker.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[3]"
        @toggle="show[3]=!show[3]"
      >
        <template #header>
          <router-link to="/coord/coordincomplete">
            {{ $t('coordinates.incomplete.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('coordinates.incomplete.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[4]"
        @toggle="show[4]=!show[4]"
      >
        <template #header>
          <router-link to="/coord/coordlines">
            {{ $t('coordinates.lines.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('coordinates.lines.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[5]"
        @toggle="show[5]=!show[5]"
      >
        <template #header>
          <router-link to="/coord/coordtriangles">
            {{ $t('coordinates.triangles.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('coordinates.triangles.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[6]"
        @toggle="show[6]=!show[6]"
      >
        <template #header>
          <router-link to="/coord/coordtriangles">
            {{ $t('coordinates.circles.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('coordinates.circles.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[7]"
        @toggle="show[7]=!show[7]"
      >
        <template #header>
          <router-link to="/coord/coordantipode">
            {{ $t('coordinates.antipode.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('coordinates.antipode.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[8]"
        @toggle="show[8]=!show[8]"
      >
        <template #header>
          <router-link to="/coord/coordw3w">
            {{ $t('coordinates.w3w.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('coordinates.w3w.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[9]"
        @toggle="show[9]=!show[9]"
      >
        <template #header>
          <router-link to="/coord/reversewherigo">
            {{ $t('coordinates.revwherigo.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('coordinates.revwherigo.long')" />
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from "@/components/inputs/VaItem.vue"

export default {
  
  name: 'CoordTools',

  components: {
    VaItem,
  },

  data: function () {
    return {
      show: [true, true, true, true, true, true, true, true, true, true, true, true]
    }
  },

}
</script>
