<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('duckspeak.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('duckspeak.long')"
      />
      <div class="row">
        <label
          class="form-label mb-2 sm-size"
          for="selds"
        >{{ $t('duckspeak.format') }} </label>
        <select
          id="selds"
          v-model="selDS"
          class="form-select mb-2 sm-size"
        >
          <option value="0">
            {{ $t('duckspeak.ascii') }}
          </option>
          <option value="1">
            {{ $t('duckspeak.hex') }}
          </option>
          <option value="2">
            {{ $t('duckspeak.dec') }}
          </option>
        </select>
      </div>
      <div class="mb-2">
        <button id="enc" class="btn mb-2 me-2" @click="encode">
          {{ $t('buttons.encode') }}
        </button>
        <button id="dec" class="btn mb-2" @click="decode">
          {{ $t('buttons.decode') }}
        </button>
      </div>
      <textarea
        id="code"
        ref="code"
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

  name: 'Duckspeak',

  data: function () {
    return {
      message: "",
      result : "",
      selDS : "0",
      errormsg: "",
      commands: [
        "Nak", "Nanak",
        "Nananak", "Nanananak",
        "Nak?", "nak?",
        "Naknak", "Naknaknak",
        "Nak.", "Naknak.",
        "Naknaknaknak", "nanak",
        "naknak", "nak!",
        "nak.", "naknaknak"
      ],
    }
  },

  mounted: function() {
    this.$refs.code.focus();
  },

  methods: {

    // Translate the input
    encode : function () {

      // Reset 
      this.result = "";
      this.errormsg = "";
      let inputarr;
      let h = 0;

      try {
        
        // read input
        switch (this.selDS) {
          case "0" : // ASCII
            inputarr = this.message.split("");
            break;
          case "1" : // Hex
            inputarr = this.message.match(/[0-9A-F]{1}/ig);
            break;
          case "2" : // Dec
            inputarr = this.message.match(/[0-9]+/g);
            break;
        }


        if (!inputarr) {
          this.errormsg = this.$t('errors.noinput');
          return;
        }
        
        // Start conversion
        for (let i=0; i < inputarr.length; i++) {
          
          switch (this.selDS) {
            case "0" : // ASCII
              h = inputarr[i].charCodeAt(0);
              this.result += this.commands[ Math.trunc(h/16) ] + " ";
              this.result += this.commands[ h % 16 ];  
              break;
            case "1" : // Hex
              h = parseInt(inputarr[i].toUpperCase(), 16);
              this.result += this.commands[h];
              break;
            case "2" : // Dec
              h = parseInt(inputarr[i]);
              if (h < 0 || h > 255) {
                this.errormsg += h + this.$t('duckspeak.invalidint');
                continue;
              }
              this.result += this.commands[ Math.trunc(h/16) ] + " ";
              this.result += this.commands[ h % 16 ];  
              break;
          }
          this.result += " ";

        }

      } catch (e) {

        this.errormsg = this.$t('errors.generic');
        console.log(e);

      }
    },

    decode: function() {

      // reset interpreter
      this.result = "";
      this.errormsg = "";
      let h1 = "";

      try {

        // Get command
        let cmds = this.message.match(/[NAKnak.?]+/g);
        if (!cmds) {
          this.errormsg = this.$t('errors.noinput');
          return;
        }

        for (let i = 0; i < cmds.length; i++) {

          // Find cmd
          let val = this.commands.indexOf(cmds[i]);

          // If valid cmd
          if (val >= 0) {
            h1 += val.toString(16).toUpperCase();
            if (h1.length == 2) {
              switch (this.selDS) {
                case "0" : // ASCII output
                  this.result += String.fromCharCode(parseInt(h1, 16));
                  break;
                case "1" : // HEX output
                  this.result += h1 + " ";
                  break;
                case "2" : // Decimal output
                  this.result += parseInt(h1, 16) + " ";
                  break;
              }
              h1 = "";
            }

          } else {
            this.errormsg = cmds[i] + this.$t('duckspeak.invalidcmd');
          }
        }
      } catch (e) {

        this.errormsg = this.$t('errors.generic');
        console.log(e);

      }
     
    }

  },
}
</script>

<style scoped>
</style>
