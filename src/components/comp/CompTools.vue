<template>
  <div
    id="nav"
    class="text-center"
  >
    <router-link to="/comp/charcodes">
      {{ $t('texttools.charcodes.title') }}
    </router-link> |
    <router-link to="/comp/bintotext">
      {{ $t('comptools.compbintotext.title') }}
    </router-link> |
    <router-link to="/comp/bcd">
      {{ $t('comptools.compbcd.title') }}
    </router-link> | 
    <router-link to="/comp/encryption">
      {{ $t('comptools.encryption.title') }}
    </router-link> |
    <router-link to="/comp/hashes">
      {{ $t('comptools.hashes.title') }}
    </router-link> |
    <router-link to="/comp/brainfuck">
      {{ $t('comptools.compbrainfuck.title') }}
    </router-link> |
    <router-link to="/comp/cow">
      {{ $t('comptools.cow.title') }}
    </router-link> |
    <router-link to="/comp/beatnik">
      {{ $t('comptools.beatnik.title') }}
    </router-link> |
    <router-link to="/comp/deadfish">
      {{ $t('comptools.compdeadfish.title') }}
    </router-link> |
    <router-link to="/comp/duckspeak">
      {{ $t('comptools.duckspeak.title') }}
    </router-link>
  </div>
  <router-view :key="$route.path" />
  <div v-if="['Comp'].includes($route.name)">
    <div class="container">
      <p
        class="intro"
        v-html="$t('comptools.intro')"
      />
      <va-item
        :showitem="show[0]"
        @toggle="show[0] = !show[0]"
      >
        <template #header>
          <router-link to="/comp/charcodes">
            {{ $t('texttools.charcodes.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('texttools.charcodes.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[1]"
        @toggle="show[1] = !show[1]"
      >
        <template #header>
          <router-link to="/comp/bintotext">
            {{ $t('comptools.compbintotext.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('comptools.compbintotext.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[2]"
        @toggle="show[2] = !show[2]"
      >
        <template #header>
          <router-link to="/comp/bcd">
            {{ $t('comptools.compbcd.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('comptools.compbcd.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[3]"
        @toggle="show[3] = !show[3]"
      >
        <template #header>
          <router-link to="/comp/encryption">
            {{ $t('comptools.encryption.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('comptools.encryption.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[4]"
        @toggle="show[4] = !show[4]"
      >
        <template #header>
          <router-link to="/comp/hashes">
            {{ $t('comptools.hashes.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('comptools.hashes.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[5]"
        @toggle="show[5] = !show[5]"
      >
        <template #header>
          <router-link to="/comp/brainfuck">
            {{ $t('comptools.compbrainfuck.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('comptools.compbrainfuck.long')" />
        </template>
      </va-item>
      <va-item
        :showitem="show[6]"
        @toggle="show[6] = !show[6]"
      >
        <template #header>
          <router-link to="/comp/cow">
            {{ $t('comptools.cow.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('comptools.cow.long')" />
        </template>
      </va-item>     
      <va-item
        :showitem="show[7]"
        @toggle="show[7] = !show[7]"
      >
        <template #header>
          <router-link to="/comp/beatnik">
            {{ $t('comptools.beatnik.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('comptools.beatnik.long')" />
        </template>
      </va-item>     
      <va-item
        :showitem="show[8]"
        @toggle="show[8] = !show[8]"
      >
        <template #header>
          <router-link to="/comp/deadfish">
            {{ $t('comptools.compdeadfish.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('comptools.compdeadfish.long')" />
        </template>
      </va-item>    
      <va-item
        :showitem="show[9]"
        @toggle="show[9] = !show[9]"
      >
        <template #header>
          <router-link to="/comp/duckspeak">
            {{ $t('comptools.duckspeak.title') }}
          </router-link>
        </template>
        <template #content>
          <span v-html="$t('comptools.duckspeak.long')" />
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from "@/components/inputs/VaItem.vue"

export default {
  name: 'CompTools',

  components: {
    VaItem,
  },

  data: function () {
    return {
      title: "CompTools",
      show: [true, true, true, true, true, true, true, true, true, true, true]
    }
  },

}
</script>
