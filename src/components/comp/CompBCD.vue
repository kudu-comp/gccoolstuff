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
      <div class="form-inline">
        <select
          v-model="selBCD"
          class="custom-select mb-2 mr-2"
        >
          <option
            v-for="(code, index) in bcdformats.vars"
            :key="index"
            :value="index"
          >
            {{ code.name }}
          </option>
        </select>
        <div class="custom-control custom-checkbox">
          <input
            id="packed"
            v-model="packed"
            type="checkbox"
            name="packed"
            class="custom-control-input mr-2 mb-2"
          >
          <label
            for="packed"
            class="custom-control-label mb-2 mr-2"
          >{{ $t('compbcd.packed') }}</label>
        </div>
        <label
          for="fill"
          class="form-label mr-2 mb-2"
        >{{ $t('compbcd.fill') }}</label>
        <select
          v-model="fill"
          class="custom-select mb-2"
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
      <div class="form-row mb-2">
        <textarea
          id="message"
          ref="message"
          v-model="message"
          name="message"
          class="form-control"
          :placeholder="$t('labels.message')"
          rows="10"
        />
      </div>
      <div class="form-inline">
        <input
          id="bcdfrom"
          type="button"
          name="bcdfrom"
          :value="$t('compbcd.bcdfrom')"
          class="btn btn-primary mb-2 mr-2"
          @click="fromBCD"
        >
        <input
          id="bcdto"
          type="button"
          name="bcdto"
          :value="$t('compbcd.bcdto')"
          class="btn btn-primary mb-2 mr-2"
          @click="toBCD"
        >
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
