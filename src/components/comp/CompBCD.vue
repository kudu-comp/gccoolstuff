<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('comptools.compbcd.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('comptools.compbcd.long')"
      />
      <div class="row">
        <label for="meth" class="form-label sm-size">{{ $t('compbcd.seltype') }}</label>
        <select
          id="meth"
          v-model="selBCD"
          class="form-select mb-2 md-size"
        >
          <option
            v-for="(code, index) in bcdformats.vars"
            :key="index"
            :value="index"
          >
            {{ code.name }}
          </option>
        </select>
      </div>
      <div class="row">
        <label
          for="fill"
          class="form-label sm-size mb-2"
        >{{ $t('compbcd.fill') }}</label>
        <select
          id="fill"
          v-model="fill"
          class="form-select md-size mb-2"
          @checked="fill = ''"
        >
          <option value="" />
          <option value="0000">
            0000
          </option>
          <option value="1111">
            1111
          </option>
        </select>
      </div>
      <div class="form-check">
        <input
          id="packed"
          v-model="packed"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="packed"
          class="form-check-label mb-2 sm-size"
        >{{ $t('compbcd.packed') }}</label>
      </div>
      <input
        id="bcdfrom"
        type="button"
        :value="$t('compbcd.bcdfrom')"
        class="btn mb-2 me-2"
        @click="fromBCD"
      >
      <input
        id="bcdto"
        type="button"
        :value="$t('compbcd.bcdto')"
        class="btn mb-2"
        @click="toBCD"
      >
      <textarea
        id="message"
        ref="message"
        v-model="message"
        name="message"
        class="form-control mb-2"
        :placeholder="$t('labels.message')"
        rows="5"
      />
      <div>
        
      </div>
      <p
        v-show="errormsg"
        class="errormsg mt-2"
      >
        {{ errormsg }}
      </p>
      <div
        v-if="result"
        class="resultbox"
      >
        {{ result }}
      </div>
    </div>
  </div>
</template>

<script>
import * as bcd from '@/scripts/bcd.js'

export default {

  name: 'CompBCD',

  data: function () {
    return {
      message: "",
      result : "",
      selBCD : 0,
      packed : false,
      bcdformats: [],
      fill: "",
      errormsg: "",
      showinfo: true,
    }
  },

  mounted: function() {
    this.$refs.message.focus();
    this.bcdformats = bcd.formats;
  },

  methods: {

    // Translate the input
    fromBCD : function () {

      // Reset error flag
      this.errormsg = "";
      this.result = "";

      try {
        
        this.result += bcd.BCD2Code(this.message, this.selBCD, this.packed, this.fill);

      } catch (e) {

        this.error = true;
        this.errormsg = this.$t('errors.invalidinput');
        console.log(e);

      }
    },

    // Translate the input
    toBCD : function () {

      // Reset error flag
      this.errormsg = "";
      this.result = "";

      try {
        
        // For each word convert and add to the output
        this.result = bcd.code2BCD(this.message, this.selBCD, this.packed, this.fill);

      } catch (e) {

        this.errormsg = this.$t('errors.invalidinput');
        console.log(e);

      }
    },

  },
}
</script>

<style scoped>
</style>
