<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('numberprop.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('numberprop.long')"
      />
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          for="n"
        >{{ $t('numberprop.num') }}</label>
        <input
          id="n"
          ref="n"
          v-model="n"
          type="number"
          min="1"
          max="1000000000"
          class="form-control md-size mb-2 me-2"
          @keyup.enter="getProperties"
        >
        <v-calculate class="sm-size" @calculate = "getProperties" :disabled="working"></v-calculate>
        <div v-if="working" class="spinner-border ms-2" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <h4>
        {{ $t('numberprop.t1') }}
      </h4>
      <table>
        <tr v-for="p in props" :key="p.ref">
          <td v-if="!p.group">
            <div v-show="p.value">
              &#x2713;
            </div><div v-show="!p.value">
              &#x2717;
            </div>
          </td>
          <td v-if="!p.group">{{ $t('numberprop.' + p.ref) }}</td>
          <td v-if="p.group" colspan="2"><h6>{{ $t('numberprop.' + p.ref) }}</h6></td>
        </tr>          
      </table>
    </div>
  </div>
</template>

<script>

import VCalculate from '@/components/inputs/VCalculate.vue';
import * as mathtools from '../../scripts/mathtools';

export default {
  name: 'MathProperties',

  components: {
    VCalculate
  },

  data: function () {
    return {
      n: 0,
      result: 0,
      working: false,
      props: [],
      errormsg: ""
    }
  },

  mounted: function() {
    this.$refs.n.focus();
    this.props = mathtools.numprops;
  },

  methods: {

    getProperties: function() {

      // Reset error
      this.errormsg = "";
      this.working = true

      // Check if n is too big
      if (this.n > 1000000000) {
          this.errormsg = this.$t('numberprop.toobig');
          return;
      }

      // Update all properties
      for (let p of this.props) {
        if (!p.group) p.value = p.func(this.n);
      }
      this.working = false;

      
    },
  },
}
</script>

