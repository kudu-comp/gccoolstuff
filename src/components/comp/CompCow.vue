<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('comptools.cow.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('comptools.cow.long')"
      />
      <div class="row mb-2">
        <label
          class="form-label md-size"
          for="input"
        >{{ $t('compbf.input') }}</label>
        <input
          id="input"
          v-model="input"
          type="text"
          class="form-control lg-size"
        >
      </div>
      <div class="form-check">
        <input
          id="debug"
          v-model="debug"
          type="checkbox"
          class="form-check-input mr-2 mb-2"
        >
        <label
          for="debug"
          class="form-check-label mb-2"
        >{{ $t('compbf.debug') }}</label>
      </div>
      <button id="run" class="btn mb-2 mr-2" @click="runCow">
        {{ $t('compbf.run') }}
      </button>
      <div class="form-row mb-2">
        <textarea
          id="code"
          ref="code"
          v-model="message"
          class="form-control"
          :placeholder="$t('compbf.code')"
          rows="5"
        />
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

  name: 'CompCow',

  data: function () {
    return {
      message: "",
      result : "",
      selBF : 0,
      input: "",
      debug: false,
      fill: "",
      errormsg: ""
    }
  },

  mounted: function() {
    this.$refs.code.focus();
  },

  methods: {

    // Translate the input
    runCow : function () {

      // reset interpreter
      this.result = "";
			let regs = [0];
      let current = 0;
      let loops = [];
      let cache = null;
      let rep = false;
      let cmdidx = ["moo", "mOo", "moO", "mOO", "Moo", "MOo", "MoO", "MOO", "OOO", "MMM", "OOM", "oom"]
      
      try {

        // Get command
        let cmds = this.message.match(/[mo]{3}/ig);
        
        if (!cmds) {
          console.log("No input");
          return;
        }
        
        // Read inputs
        let inputs = this.input.match(/[A-Z0-9]+/ig);
        let nextinput = 0;
        
        for (let i = 0; i < cmds.length; i++) {
        
          let cmd = cmds[i];
          
          do {
          
            rep = false;
    
            if (this.debug) {
              console.log(`Command: ${cmd} Current: ${current} Cache: ${cache}`);
              console.log(`Registers: ${regs}`);        
            }
            
            switch (cmd) {        
              case 'moo' :
                // end of loop
                if (regs[current] != 0) {
                  i = loops[loops.length-1];
                } else {
                  loops.pop();          
                }
                break;
              case 'mOo' :
                // back one register
                current = Math.max(0, current-1);
                break;
              case 'moO' :
                // forward one register
                if (current == regs.length-1) regs.push(0);
                current++;
                break;
              case 'mOO' :
                // Check if current register is valid command
                if (regs[current] < 0 || regs[current] == 3 || regs[current] > 11) {
                  throw ("Illegal command");
                }
                // Execute current register as a command
                rep = true;
                cmd = cmdidx[regs[current]];
                break;
              case 'Moo' :
                // If 0 read input ASCII, else print ASCII
                if (regs[current] == 0) {
                  if (nextinput >= inputs.length) throw("Not enough inputs");
                  regs[current] = inputs[nextinput++].charCodeAt(0);
                } else {
                  this.result += String.fromCharCode(regs[current]);          
                }
                break;
              case 'MOo' :
                // Decrement current register
                regs[current]--;
                break;
              case 'MoO' :
                regs[current]++;
                break;
              case 'MOO' :
                // Start of loop
                loops.push(i);
                if (regs[current] == 0) {
                  // Find end of loop skipping next statement
                  while (cmds[i+2] != "moo" && i < this.text.length) i++;
                  loops.pop();
                }
                break;
              case 'OOO' :
                // Reset
                regs[current] = 0;
                break;
              case 'MMM' :
                // Use cache
                if (cache === null) {
                  cache = regs[current]
                } else {
                  regs[current] = cache;
                  cache = null
                }
                break;
              case 'OOM' :
                // Print as integer
                this.result += regs[current];
                break;
              case 'oom' :
                // Read as integer
                if (nextinput >= inputs.length) throw("Not enough inputs");
                regs[current] = parseInt(inputs[nextinput++]);
                break;
              default :
                // Ignore as comment
                console.log("Comment" + cmd);        
                
            }      

          } while (rep);

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
