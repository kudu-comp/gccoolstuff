<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('beatnik.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('beatnik.long')"
      />
      <div class="row">
        <label
          class="form-label mb-2 sm-size"
          for="alphabet"
        >{{ $t('labels.alphabet') }}</label>
        <select
          id="alphabet"
          v-model="selectedalphabet"
          class="form-select mb-2 lg-size"
          style="width: 150px;"
        >
          <option
            v-for="a in alphabets"
            :key="a"
            :value="a.name"
          >
            {{ a.name }} - {{ a.alphabet }}
          </option>
        </select>
      </div>
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          for="input"
        >{{ $t('brainfuck.input') }}</label>
        <input
          id="input"
          v-model="input"
          type="text"
          class="form-control xl-size mb-2"
        >
      </div>
      <div class="form-check">
        <input
          id="debug"
          v-model="debug"
          type="checkbox"
          class="form-check-input mb-2"
        >
        <label
          for="debug"
          class="form-check-label mb-2"
        >{{ $t('brainfuck.debug') }}</label>
      </div>
      <button id="run" class="btn mb-2 me-2" @click="runBeatnik">
        {{ $t('brainfuck.run') }}
      </button>
      <div class="mb-2">
        <textarea
          id="code"
          ref="code"
          v-model="message"
          class="form-control"
          :placeholder="$t('brainfuck.code')"
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

import * as textHelper from '@/scripts/texthelper.js';

export default {

  name: 'Beatnik',

  data: function () {
    return {
      message: "",
      result : "",
      input: "",
      debug: false,
      errormsg: "",
      selectedalphabet: "Scrabble English",
      alphabets: []
    }
  },

  mounted: function() {
    this.$refs.code.focus();
    this.alphabets = textHelper.extalphabets.slice(1);
  },

  methods: {

    // Translate the input
    runBeatnik : function () {

      // reset interpreter
      this.result = "";
			let stack = [];
      let a1,a2, n;
      
      try {

        // Get commands (needs a better regex for words)
        let cmds = this.message.match(/[A-Z]+/ig);
        if (!cmds) {
          console.log("No input");
          return;
        }
        
        // Read inputs (anything but white space goes)
        let inputs = this.input.match(/[^\s]{1}/ig);
        let nextinput = 0;
        console.log(cmds);
        
        for (let i = 0; i < cmds.length; i++) {
        
          let cmd = textHelper.wordValue(cmds[i], false, false, this.selectedalphabet);
          
          if (this.debug) {
            console.log(`Command: ${cmds[i]} Value: ${cmd} Pointer: ${i}`);
          }

          switch (cmd) {        
            case 5 :
              // Push next word on stack
              stack.push(textHelper.wordValue(cmds[++i], false, false, this.selectedalphabet));
              break;
            case 6 :
              // Pop stack and discard
              stack.pop();
              break;
            case 7 :
              // Pop two numbers and add them, push result
              stack.push(stack.pop() + stack.pop());
              break;
            case 8 :
              // Input a character and push its value
              if (nextinput >= inputs.length) throw("Not enough inputs");
              stack.push(inputs[nextinput++].charCodeAt(0));
              break;
            case 9 :
              // Pop number and output its character
              this.result += String.fromCharCode(stack.pop());
              break;
            case 10 :
              // Pop two numbers, subtract the first from the second push the result
              stack.push(-stack.pop() + stack.pop());
              break;
            case 11 :
              // Pop two numbers, swap them, and push them back.
              a1 = stack.pop();
              a2 = stack.pop();
              stack.push(a1);
              stack.push(a2);
              break;
            case 12 :
              //Pop a number and push it twice
              a1 = stack.pop();
              stack.push(a1);
              stack.push(a1);
              break;
            case 13 :
              // Pop a number and skip ahead n (actually n+1) words if the number is zero.
              a1 = stack.pop();
              if (a1 == 0) {
                n = textHelper.wordValue(cmds[++i], false, false, this.selectedalphabet);
                i += n;
              }
              break;
            case 14 :
              // Skip ahead n (actually n+1) words if the number isn't zero.
              a1 = stack.pop();
              if (a1 != 0) {
                n = textHelper.wordValue(cmds[++i], false, false, this.selectedalphabet);
                i += n;
              }
              break;
            case 15 :
              // Skip back n words if the number is zero.
              a1 = stack.pop();
              if (a1 == 0) {
                n = textHelper.wordValue(cmds[i+1], false, false, this.selectedalphabet);
                i = i - n;
              }
              break;
            case 16 :
              // Skip back n words if the number isn't zero.
              a1 = stack.pop();
              if (a1 != 0) {
                n = textHelper.wordValue(cmds[i+1], false, false, this.selectedalphabet);
                i = i - n;
              }
              break;
            case 17 :
              // Stop the program
              i = cmds.length;
              break;
            default :
              // Ignore as comment
              console.log("Comment: " + cmds[i]);        
          }
          
          if (this.debug) {
            console.log(`Stack after command: ${stack} - Pointer ${i}\n`);        
          }

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
