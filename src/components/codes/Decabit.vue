<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('codes.decabit.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('codes.decabit.long')" />
      <div class="form-inline mt-2">
        <label for="selenc" class="form-label mb-2 mr-2">{{$t('decabit.selenc')}}</label>
        <select v-model="format" id="selenc" class="custom-select mb-2 mr-2">
          <option value="0">{{$t('decabit.selnum')}}</option>
          <option value="1">{{$t('decabit.selascii')}}</option>
          <option value="2">{{$t('decabit.selalpha')}}</option>
        </select>
      </div>
      <div class="form-row mb-2">
        <textarea id="message" name="message" class="form-control" ref="message" :placeholder="$t('labels.message')" rows=10 v-model='message'></textarea>
      </div>
      <input type="button" id="enc" name="enc" :value="$t('buttons.encode')" class="btn btn-primary mb-2 mr-2" v-on:click="encodeDeca">
      <input type="button" id="dec" name="dec" :value="$t('buttons.decode')" class="btn btn-primary mb-2 mr-2" v-on:click="decodeDeca">
      <div class="card card-text p-2">{{result}}</div>
      <p v-show="errormsg" class="errormsg mt-2">{{errormsg}}</p>
    </div>
  </div>
</template>

<script>

export default {

  name: 'Decabit',

  data: function () {
    return {
      message: "",
      result : this.$t('labels.result'),
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