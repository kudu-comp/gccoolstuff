<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('vanitycode.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('vanitycode.long')"
      />
      <img width="400px" max-width="100%" src="~@\assets\images\vanitycode.png">
      <!-- Form fields -->
      <!-- Text input -->
      <div class="mt-2 mb-2">
        <textarea
          id="msg"
          v-model="msg"
          class="form-control"
          :placeholder="$t('labels.msg')"
          rows="5"
          @input="updateResult"
        />
      </div>
      <!-- Checkbox -->
      <div class="form-check">
        <input
          id="chk1"
          v-model="spaces"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="chk1"
          class="form-check-label mb-2"
        >{{ $t('vanitycode.spaces') }}</label>
      </div>
      <div class="form-check">
        <input
          id="chk2"
          v-model="ignorespaces"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="chk2"
          class="form-check-label mb-2"
        >{{ $t('vanitycode.ignorespaces') }}</label>
      </div>
      <!-- Radios-->
        <span
          class="form-label mb-2"
        >{{ $t('vanitycode.sel') }}</span>
        <div class="form-check">
            <input
            id="number1"
            v-model="sel"
            type="radio"
            value="0"
            class="form-check-input"
            >
            <label
            class="form-check-label"
            for="number1"
            >{{ $t('buttons.encode') }}</label>
        </div>
        <div class="form-check">
            <input
            id="number2"
            v-model="sel"
            type="radio"
            value="1"
            class="form-check-input"
            >
            <label
            class="form-check-label"
            for="number2"
            >{{ $t('buttons.decode') }}</label>
        </div>
      <button class="btn mt-2 mb-2" id="btn1" @click="addSpaces()">{{$t('vanitycode.addspaces')}}</button>  
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <!-- Result area or use v-html -->
      <div v-if="result" class="resultbox" >
        {{ result }} 
      </div>
    </div>
  </div>
</template>

<script>

export default {

  name: "ComponentName",

  components: {
        
  },

  data() {
    return {
      result: "",
      errormsg: "",
      spaces: true,
      ignorespaces: true,
      sel: "1",
      msg: "",
      vanity: [
        { "char": " ", "code": "1" },
        { "char": "a", "code": "2" },
        { "char": "b", "code": "22" },
        { "char": "c", "code": "222" },
        { "char": "d", "code": "3" },
        { "char": "e", "code": "33" },
        { "char": "f", "code": "333" },
        { "char": "g", "code": "4" },
        { "char": "h", "code": "44" },
        { "char": "i", "code": "444" },
        { "char": "j", "code": "5" },
        { "char": "k", "code": "55" },
        { "char": "l", "code": "555" },
        { "char": "m", "code": "6" },
        { "char": "n", "code": "66" },
        { "char": "o", "code": "666" },
        { "char": "p", "code": "7" },
        { "char": "q", "code": "77" },
        { "char": "r", "code": "777" },
        { "char": "s", "code": "7777" },
        { "char": "t", "code": "8" },
        { "char": "u", "code": "88" },
        { "char": "v", "code": "888" },
        { "char": "w", "code": "9" },
        { "char": "x", "code": "99" },
        { "char": "y", "code": "999" },
        { "char": "z", "code": "9999" },
        { "char": "1", "code": "11" },
        { "char": "2", "code": "2222" },
        { "char": "3", "code": "3333" },
        { "char": "4", "code": "4444" },
        { "char": "5", "code": "5555" },
        { "char": "6", "code": "6666" },
        { "char": "7", "code": "77777" },
        { "char": "8", "code": "8888" },
        { "char": "9", "code": "9999" }
      ]
    };
  },

  methods: {

    addSpaces: function name(params) {
      this.msg = this.msg.match(/1{1,4}|2{1,4}|3{1,4}|4{1,4}|5{1,4}|6{1,4}|7{1,4}|8{1,4}|9{1,4}|[^1-9]+/gm  ).join(" ");
      this.updateResult();
    },

    updateResult: function () {

      // Reset
      this.result = "";
      this.errormsg = "";

      // Automatically encode or decode based on selection
      if (this.sel === "0") {
        this.result = this.code(this.msg, this.spaces);
      } else {
        this.result = this.decode(this.msg, this.spaces);
      }

    },

    code: function (msg, spaces) {
      let h = "";
      let idx = 0
      for (let i = 0; i < this.msg.length; i++) {
        if (this.msg[i] === " " && this.ignorespaces) continue;
        idx = this.vanity.findIndex((item) => item.char === this.msg[i].toLowerCase());
        if (idx === -1) {
          this.errormsg += this.msg[i] + " ";
          continue;
        }
        h += this.vanity[idx].code;
        if (spaces && i < this.msg.length - 1) {
          h += " ";
        }
      }
      if (this.errormsg) {
        this.errormsg = this.$t('vanitycode.unknownchar') + ": " + this.errormsg;
      }
      return h;
    },

    decode: function (msg, spaces) {
      let h = "";
      let idx = 0
      let codes = this.msg.trim().split(/\s+/);
      for (let c = 0; c < codes.length; c++) {
        idx = this.vanity.findIndex((item, idx) => item.code === codes[c]);
        if (idx === -1) {
          this.errormsg += codes[c] + " ";
          continue;
        }
        h += this.vanity[idx].char;
        if (spaces && c < codes.length - 1) {
          h += " ";
        }
      }
      if (this.errormsg) {
        this.errormsg = this.$t('vanitycode.unknowncode') + ": " + this.errormsg;
      }
      return h;;
    },

}

};

</script>

<style scoped>
</style>
