<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('texttoss.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('texttoss.long')"
      />
      <div class="mb-2">
        <span class="form-label">{{ $t('texttoss.mode') }}</span>
        <div class="form-check">
          <input
            id="mode3"
            v-model="mode"
            type="radio"
            value="3"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="mode3"
          >{{ $t('texttoss.mode3') }}</label>
        </div>
        <div class="form-check">
          <input
            id="mode2"
            v-model="mode"
            type="radio"
            value="2"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="mode2"
          >{{ $t('texttoss.mode2') }}</label>
        </div>
        <div class="form-check">
          <input
            id="mode1"
            v-model="mode"
            type="radio"
            value="1"
            class="form-check-input"
          >
          <label
            class="form-check-label"
            for="mode1"
          >{{ $t('texttoss.mode1') }}</label>
        </div>
      </div>
      <input
        id="toss"
        type="button"
        :value="$t('buttons.calc')"
        class="btn mb-2 mr-2"
        @click="tossWords"
      >
      <textarea
        id="message"
        ref="message"
        v-model="message"
        class="form-control"
        :placeholder="$t('labels.message')"
        rows="5"
        @input="translateKeyboard"
      />
      <p
        v-show="errormsg"
        class="errormsg mb-2"
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

export default {
  name: 'TextToss',

  data: function () {
    return {
      message: "",
      result : "",
      mode : 3,
      errormsg: ""
    }
  },

  mounted: function() {
    this.$refs.message.focus();
  },

  methods: {

    // Translate form one keyboard to another
    tossWords : function () {

      // Reset error flag
      this.errormsg = "";
      this.result = "";

      // Modes
      // Mode 3 - keep first and last position
      // Mode 2 - keep first position
      // Mode 1 - keep no position

      try {

        // Parse text into words, keep the stuff between words
        const regex = /([^\s;:.,?!'`"]+)([\s;:.,?!'`"]*)/gm;
      
        // Process all words one by one using iterator
        for (let m of this.message.matchAll(regex)) {
        
          let w = m[1];
              
          // Move letters to 2nd position randomly
          for (let j = 0; j < w.length - this.mode; j++) {
            
            let idx = Math.floor(Math.random() * (w.length - this.mode));
            if (this.mode == 1)
              w = w[idx] + w.slice(0,idx) + w.slice(idx+1)
            else {
              idx+=2
              w = w[0] + w[idx] + w.slice(1,idx) + w.slice(idx+1);
            }
          }

          this.result += w + m[2];
        
        }

      } catch (e) {

        this.errormsg = this.$t('errors.generic');
        console.log(e);

      }
    },

  },
}
</script>

<style scoped>
</style>
