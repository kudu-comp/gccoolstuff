<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('comptools.duckspeak.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('comptools.duckspeak.long')"
      />
      <div class="form-row mb-2">
        <textarea
          id="code"
          ref="code"
          v-model="message"
          name="code"
          class="form-control"
          :placeholder="$t('labels.message')"
          rows="10"
        />
      </div>
      <div class="form-inline">
        <label
          class="form-label mb-2 mr-2"
          for="selenc"
        >{{ $t('compds.format') }} </label>
        <select
          v-model="selDS"
          class="custom-select mb-2 mr-2"
          style="width: 150px;"
        >
          <option value="0">
            {{ $t('compds.ascii') }}
          </option>
          <option value="1">
            {{ $t('compds.hex') }}
          </option>
          <option value="2">
            {{ $t('compds.dec') }}
          </option>
        </select>
      </div>
      <div class="form-inline">
        <input
          id="run"
          type="button"
          name="encode"
          :value="$t('buttons.encode')"
          class="btn btn-primary mb-2 mr-2"
          @click="encode"
        >
        <input
          id="run"
          type="button"
          name="decode"
          :value="$t('buttons.decode')"
          class="btn btn-primary mb-2 mr-2"
          @click="decode"
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

export default {

  name: 'CompDuckspeak',

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
                this.errormsg += h + this.$t('compds.invalidint');
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
            this.errormsg = cmds[i] + this.$t('compds.invalidcmd');
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
