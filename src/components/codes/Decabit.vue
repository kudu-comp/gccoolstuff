<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('decabit.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('decabit.long')"
      />
      <div class="row mt-2">
        <label
          for="selenc"
          class="form-label mb-2 sm-size"
        >{{ $t('decabit.selenc') }}</label>
        <select
          id="selenc"
          v-model="format"
          class="form-select mb-2 md-size"
        >
          <option value="0">
            {{ $t('decabit.selnum') }}
          </option>
          <option value="1">
            {{ $t('decabit.selascii') }}
          </option>
          <option value="2">
            {{ $t('decabit.selalpha') }}
          </option>
        </select>
      </div>
      <input
        id="enc"
        type="button"
        :value="$t('buttons.encode')"
        class="btn mb-2 me-2"
        @click="encodeDeca"
      >
      <input
        id="dec"
        type="button"
        :value="$t('buttons.decode')"
        class="btn mb-2"
        @click="decodeDeca"
      >
      <textarea
        id="message"
        ref="message"
        v-model="message"
        class="form-control"
        :placeholder="$t('labels.message')"
        rows="5"
      />
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

export default {

  name: 'DecaBit',

  data: function () {
    return {
      message: "",
      result : "",
      errormsg: "",
      format: 0,
      decabit: [
        "--+-+++-+-", "+--+++--+-", "+--++-+-+-", "+--+-++-+-",
        "----+++-++", "++--+++---",	"++--++--+-", "++--+-+-+-",
        "++---++-+-",	"---++++-+-", "+-+-+++---", "+-+-+-+-+-",
        "+-+--++-+-", "+---++-++-", "+---++--++", "--+++-++--",
        "---++-+++-", "+---+-++-+", "+--++--+-+", "+--++-+--+",
        "+-+++--+--", "+--+++-+--", "++--+-++--", "-+-++-++--",
        "+--++--++-", "+-+++-+---", "++-+--++--",	"+-+-+-++--",
        "+--+-+++--",	"+--+--++-+", "+-++-++---", "+-++-+-+--",
        "+-+-++-+--", "+---++++--", "+-+--+-++-", "+++--++---",
        "+++--+-+--", "+++---++--",	"++---+++--", "--+-++++--",
        "++--++-+--", "-+-+-+-++-", "++----+++-", "+----+-+++",
        "++---+-+-+", "++-+-+-+--", "++-+-+--+-", "+++----++-",
        "++--+--++-", "+--+-+-++-", "++++----+-", "++-++---+-",
        "+-+++---+-", "-++++---+-", "+-+-+---++", "+++-++----",
        "+++-+-+---", "+-+-+--++-", "-++-+--++-", "+++-+----+",
        "++++-+----", "-+++-++---", "-+-+-++-+-", "++---++--+",
        "++-+--+--+", "++-+++----", "++++--+---", "+--++++---",
        "-+-++++---", "++-+--+-+-", "-++---+++-", "+---+-+++-",
        "--+-+-+++-", "+----++++-", "--+--++++-", "+++---+-+-",
        "+-++---++-", "+--+--+++-", "--++--+++-", "+-+---+-++",
        "-+++--+-+-", "-+-++-+-+-", "-+++---++-", "-+-++--++-",
        "-+---++++-", "-++++--+--", "-++-++-+--", "--++++-+--",
        '--++-+++--', "--++-+-++-", "+-++++----", "--++++--+-",
        "--++-++-+-", "+--+-+--++", "+-++----++", "-+-+++--+-",
        "-++-+-+-+-", "-+--++-++-", "---+++-++-", "-+--+-+++-",
        "+---+++-+-", "-+--+++-+-", "+-+-++--+-", "+--++-++--",
        "++-++--+--",	"+-++--++--",	"+-+--+++--", "-++--+++--",
        "++---+-++-", "++-+---++-",	"+++-+---+-",	"+++-+--+--",
        "++-+-++---", "++-++-+---", "+-+---+++-", "+-++--+-+-",
        "-+-+--+++-", "-+++-+-+--", "+-++-+--+-", "-++-+++---",
        "+++--+--+-", "+++++-----", "-+++++----",	"--+++++---",
        "---+++++--", "----+++++-", "++++++++++"
      ]
    }
  },

  mounted: function() {
    this.$refs.message.focus();
  },

  methods: {

    encodeDeca: function () {

      // Reset
      this.errormsg = "";
      this.result = "";

      try {

        let words = (this.format == 0) ? this.message.match(/[0-9]+/g) : this.message.match(/./g)
        
        if (!words) {
          this.errormsg = this.$t('errors.cannotparse');
          return
        }
        
        for (let w of words) {
        
          let idx = 0;
          if (this.format == 0) {
            // Input numbers
            idx = parseInt(w);
          } else if (this.format == 1) {
            // Input ASCII
            idx = w.charCodeAt(0)
          } else {
            // Input alphabet order
            idx = w.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
          }
          if (idx >= 0 && idx <= 126) 
            this.result += this.decabit[idx] + " "
          else {
            this.errormsg += this.$t('errors.unknowninput') + w + " ";
          }

        }
      
      } catch (e) {
      
        console.log(e);
        this.errormsg = e;
        
      }

    },

    decodeDeca: function () {

      // Reset
      this.errormsg = "";
      this.result = "";
        
      try {
      
        let words = this.message.match(/[-+]{10}/g);
      
        if (!words) {
          this.errormsg = this.$t('errors.cannotparse');
          return
        }
        
        for (let w of words) {
        
          let idx = this.decabit.indexOf(w);
          
          if (idx < 0) {
            this.errormsg += this.$t('errors.unknowninput') + w + " ";
          } else {

            if (this.format == 0) {
              // Input numbers
              this.result += idx + " ";
            } else if (this.format == 1) {
              // Input ASCII
              this.result += String.fromCharCode(idx)
            } else {
              // Input alphabet order
              this.result += String.fromCharCode("A".charCodeAt(0) + idx);
            }

          }
          
        }
        
      } catch (e) {
      
        this.errormsg = this.$t('error.generic');
        console.log(e);

      }
    }

  }

}

</script>