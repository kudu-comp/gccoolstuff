<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('texttools.texttoss.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('texttools.texttoss.long')" />
      <div class="mb-2">
        <label class="form-label" for="mode">{{$t('txttoss.mode')}}</label>
        <div class="form-check">
          <input type="radio" id="mode3" name="mode" value="3" class="form-check-input" v-model="mode">
          <label class="form-check-label" for="mode3">{{$t('txttoss.mode3')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="mode2" name="mode" value="2" class="form-check-input" v-model="mode">
          <label class="form-check-label" for="mode2">{{$t('txttoss.mode2')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="mode1" name="mode" value="1" class="form-check-input" v-model="mode">
          <label class="form-check-label" for="mode1">{{$t('txttoss.mode1')}}</label>
        </div>
      </div>
      <div>
        <div class="form-row mb-2">
          <textarea id="message" name="message" class="form-control" ref="message" :placeholder="$t('labels.message')" rows=10 v-model='message' @input="translateKeyboard"></textarea>
        </div>
        <input type="button" id="toss" name="toss" :value="$t('buttons.calc')" class="btn btn-primary mb-2 mr-2" v-on:click="tossWords">
      </div>
      <p v-show="errormsg" class="errormsg mb-2">{{errormsg}}</p>
      <div v-if="result" class="resultbox">{{result}}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TextToss',

  data: function () {
    return {
      message: "",
      result : this.$t('labels.result'),
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
