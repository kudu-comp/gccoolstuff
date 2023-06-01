<template>
  <div
    id="nav"
    class="text-center"
  >
    <router-link to="/other/sudokusolver">
      {{ $t('othertools.sudokusolver.title') }}
    </router-link> |
    <router-link to="/other/mmsolver">
      {{ $t('othertools.mmsolver.title') }}
    </router-link> |
    <router-link to="/other/periodictable">
      {{ $t('othertools.periodictable.title') }}
    </router-link> |
    <router-link to="/other/countries">
      {{ $t('othertools.countries.title') }}
    </router-link> |
    <router-link to="/other/unitconvertor">
      {{ $t('othertools.unitconvertor.title') }}
    </router-link> |
    <router-link to="/other/usastates">
      {{ $t('othertools.usastates.title') }}
    </router-link> |
    <router-link to="/other/countryregions">
      {{ $t('othertools.countryregions.title') }}
    </router-link> |
    <router-link to="/other/dnacode">
      {{ $t('othertools.dnacode.title') }}
    </router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['OtherIntro'].includes($route.name)">
    <div class="container">
      <p
        class="intro"
        v-html="$t('othertools.intro')"
      />
      <va-item
        :showitem="show[0]"
        @toggle="show[0]=!show[0]"
      >
        <template #header>
          <router-link to="/other/sudokusolver">
            {{ $t('othertools.sudokusolver.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('othertools.sudokusolver.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[1]"
        @toggle="show[1]=!show[1]"
      >
        <template #header>
          <router-link to="/other/mmsolver">
            {{ $t('othertools.mmsolver.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('othertools.mmsolver.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[2]"
        @toggle="show[2]=!show[2]"
      >
        <template #header>
          <router-link to="/other/periodictable">
            {{ $t('othertools.periodictable.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('othertools.periodictable.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[3]"
        @toggle="show[3]=!show[3]"
      >
        <template #header>
          <router-link to="/other/countries">
            {{ $t('othertools.countries.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('othertools.countries.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[4]"
        @toggle="show[4]=!show[4]"
      >
        <template #header>
          <router-link to="/other/unitconvertor">
            {{ $t('othertools.unitconvertor.title') }}
          </router-link>
        </template>
        <template #content>
          <sapn v-html="$t('othertools.unitconvertor.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[5]"
        @toggle="show[5]=!show[5]"
      >
        <template #header>
          <router-link to="/other/usastates">
            {{ $t('othertools.usastates.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('othertools.usastates.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[6]"
        @toggle="show[6]=!show[6]"
      >
        <template #header>
          <router-link to="/other/countryregions">
            {{ $t('othertools.countryregions.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('othertools.countryregions.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[7]"
        @toggle="show[7]=!show[7]"
      >
        <template #header>
          <router-link to="/other/dnacode">
            {{ $t('othertools.dnacode.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('othertools.dnacode.long')" />
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from "@/components/inputs/VaItem.vue"

export default {

  name: 'OtherIntro',

  components: {
    VaItem,
  },

  data: function () {
    return {
      title: "OtherIntro",
      show: Array(10).fill(true)
    }
  },

}
</script>
