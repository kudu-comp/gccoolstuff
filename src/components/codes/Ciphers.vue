<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      <div class="text-center">
        {{ cp[selcp].name }} {{ $t('ciphers.title') }}
      </div>
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('ciphers.long')"
      />
      <div class="row">
        <label for="selciphers" class="form-label sm-size mb-2">{{ $t('ciphers.selcipher') }}</label>
        <select
          v-model="selcp"
          id="selcp"
          class="form-control sm-size mb-2"
          @change="selCipher()"
        >
          <option v-for="(o, idx) in cp" :value="idx">
            {{ o.name }}
          </option>
        </select>
      </div>
      <div class="infoblock">
        {{ explanation }}
      </div>
      <div v-for="(item, idx) in cp[selcp].keys">
        <div class="row" v-show="item.type === 'txt'">
          <label for="txt" class="form-label mb-2 md-size">{{ labels[idx] }}</label>
          <input
            id="txt"
            class="form-control mb-2 md-size"
            type="text"
            v-model="keys[idx]"
          />
          <button 
            v-show="item.showgen" 
            class="btn md-size mb-2 ms-2" 
            @click="modals[idx] = true"
          >
            {{ $t('ciphers.gensq') }}
          </button>
          <v-polybius
            v-if="modals[idx]"
            v-model:polybiussquare="keys[idx]"
            @close="modals[idx] = false"
          />
        </div>
        <div class="row" v-show="item.type === 'num'">
          <label for="cnt" class="form-label md-size mb-2">{{ labels[idx] }}</label>
          <input
            id="cnt"
            type="number"
            :min="item.min"
            :max="item.max"
            v-model="keys[idx]"
            class="form-control sm-size mb-2"
          />
        </div>
        <div class="row" v-show="item.type === 'sel'">
          <label for="sel" class="form-label md-size mb-2">{{ labels[idx] }}</label>
          <select v-model="keys[idx]" id="sel" class="form-control md-size mb-2">
            <option v-for="o in item.sels" :value="o.ref">
              {{ o.label }}
            </option>
          </select>
        </div>
        <div v-show="item.type === 'chk'" class="row form-check">
          <label for="chk" class="form-check-label md-size mb-2">{{ labels[idx] }}</label>
          <input
            id="chk"
            type="checkbox"
            v-model="keys[idx]"
            class="form-check-input mb-2"
            min="0"
          />
        </div>
      </div>
      <button
        id="encode"
        class="btn mb-2 me-2"
        @click="toEncode"
        :disabled="cp[selcp].noencode"
      >
        {{ $t('buttons.encode')  }}
      </button>
      <button
        id="decode"
        class="btn mb-2 me-2"
        @click="toDecode"
        :disabled="cp[selcp].nodecode"
      >
        {{ $t('buttons.decode') }}
      </button>
      <button 
        class="btn mb-2 md-size" 
        @click="expertmode=!expertmode"
        v-show="!expertmode"
      > <i class="fa-solid fa-gears"></i>
        {{ $t('ciphers.expertmode') }}
      </button>
      <button 
        class="btn mb-2 md-size" 
        @click="expertmode=!expertmode" 
        v-show="expertmode"
      > <i class="fa-solid fa-gears"></i>
        {{ $t('ciphers.hideexpertmode') }}
      </button>
      <div v-if="expertmode" class="box p-2">
        <div class="row">
          <label
            class="form-label mb-2 sm-size"
            for="alphabet"
          >{{$t('labels.alphabet')}}</label>
          <input
            id="alphabet"
            v-model="alphabet"
            type="text"
            class="form-control md-size mb-2 me-2"
          >
        </div>
        <div class="form-check">
          <input
            id="keepcase"
            v-model="keepcase"
            type="checkbox"
            class="form-check-input me-2 mb-2"
          >
          <label
            for="keepcase"
            class="form-check-label mb-2"
          >{{ $t('ciphers.keepcase') }}</label>
        </div>
        <div class="form-check">
          <input
            id="keepdiacrit"
            v-model="keepdiacrit"
            type="checkbox"
            class="form-check-input me-2 mb-2"
          >
          <label
            for="keepdiacrit"
            class="form-check-label mb-2"
          >{{ $t('ciphers.keepdiacrit') }}</label>
        </div>
        <div class="form-check">
          <input
            id="keepunknown"
            v-model="keepunknown"
            type="checkbox"
            class="form-check-input me-2 mb-2"
          >
          <label
            for="keepunknown"
            class="form-check-label mb-2"
          >{{ $t('ciphers.keepunknown') }}</label>
        </div>
        <div class="form-check">
          <input
            id="replacechars"
            v-model="replacechars"
            type="checkbox"
            class="form-check-input me-2 mb-2"
          >
          <label
            for="replacechars"
            class="form-check-label mb-2"
          >{{ $t('ciphers.replacechars') }}</label>
          <div class="row">
            <label
                class="form-label mb-2 sm-size"
                for="replacements"
            >{{ $t('ciphers.repl') }}</label>
            <input
              id="replacements"
              v-model="replacements"
              type="text"
              placeholder="Example J=I, U=V"
              size="12"
              class="form-control md-size mb-2"
            >
          </div>
        </div>
        <div class="form-check">
          <input
            id="formatoutput"
            v-model="formatoutput"
            type="checkbox"
            class="form-check-input mb-2"
          >
          <label
            for="formatoutput"
            class="form-check-label mb-2"
          >{{ $t('ciphers.formatoutput') }}</label>
          <div class="row">
            <label
              class="form-label mb-2 sm-size"
              for="blocksize"
            >{{ $t('ciphers.bs') }}</label>
            <input
              id="blocksize"
              v-model="blocksize"
              type="number"
              min="1"
              max="9"
              class="form-control mb-2 md-size"
            >
          </div>
          <div class="row">
            <label
              class="form-label mb-2 sm-size"
              for="separator"
            >{{ $t('ciphers.sep') }}</label>    
            <select
              id="separator"
              v-model="separator"
              class="form-select mb-2 md-size"
            >
              <option value=" "> </option>
              <option>-</option>
              <option>/</option>
            </select>
          </div>
        </div>      
      </div>
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <div class="mb-2">
        <textarea
          id="message"
          v-model="message"
          class="form-control"
          :placeholder="$t('labels.message')"
          rows="5"
        />
      </div>
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
import VPolybius from '@/components/inputs/VPolybius.vue';
import { ciphers } from "@/scripts/ciphers.js";


export default {
  name: 'EncoderDecoder',

  components: {
    VPolybius,
  },

  // Prop cphr is parameter passed by route (optional)
  props: {
    cphr: {
      type: String,
      required: false,
      default: "atbash"
    },
  },

  // Data include variables to dynamically set appearnce and labels
  data: function () {
    return {
      selcp: 0,
      keys: [],
      cp: [{}],
      labels: [],
      modals: [],
      cipher: "",
      expertmode: false,
      keepcase: false,
      keepdiacrit: false,
      keepunknown: false,
      replacechars: false,
      formatoutput: false,
      cleandecode : true,
      message: "",
      result: "",
      errormsg: "",
      separator: ' ',
      blocksize: 5,
      cipher: '',
      showalphabet: true,
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      codealphabet: "",
      replacements: '',
      explanation: '',
      phpurl: window.location.protocol + "//"  + window.location.hostname + "/cipher-toolkit/encoderdecoder.php",
    }
  },

  mounted: function() {
    this.cp = ciphers;
    if (this.$route.params.cphr) {
      this.selcp = this.cp.findIndex ( (e) => e.ref === this.$route.params.cphr);
    } else {
      this.selcp = 0;
    }
    this.selCipher();
  },

  methods: {

    // Remove characters not present in alphabet from message
    removeUnknown: function(msg, alf) {
      let s = "";
      for (let i=0; i < msg.length; i++)
        if (alf.indexOf(msg[i]) >= 0) s += msg[i];
      return s;
    },

    // Replace characters in message
    replaceCharacters: function (msg) {

      let arr = this.replacements.match(/[A-Za-z]=[A-Za-z]/g);

      if (arr !== null) 
        for (let a of arr)
          msg = msg.replace(new RegExp(a[0], "g"), a[2]);

      return msg;
    },

    // Clean input
    cleanString: function (msg, alf) {

      // Clean the input when not in expert mode or using expert flags
      if (!this.keepdiacrit) msg = textHelper.removeDiacritics(msg);
      if (!this.keepcase) msg = msg.toUpperCase();
      if (this.replacechars) msg = this.replaceCharacters(msg);
      if (!this.keepunknown) msg = this.removeUnknown(msg, alf);
      return msg;
    },

    // Add separators to transmsg
    formatMessage: function(msg) {
      let s = "";
      for (let i = 0; i < msg.length; i++) {
        if ((i % this.blocksize == 0) && (i>0)) s += this.separator;
        s += msg[i];
      }
      if (s[s.length-1] == this.separator) s = s.slice(0, s.length-2);
      return s;
    },

    // Decode transmsg
    toDecode: function() {

      // Reset
      this.errormsg = "";
      this.result="";

      // Validate keys
      if (!this.checkKeys()) return;

      // Clean input
      let alf = (this.codealphabet) ? this.codealphabet : this.alphabet;
      let msg = (this.cleandecode) ? this.cleanString(this.message.trim(), alf) : this.message;

      // Clean all keys needed
      let keys = new Array(this.cp[this.selcp].keys.length);
      for (let i = 0; i < this.cp[this.selcp].keys.length; i++) {
        if (this.cp[this.selcp].keys[i].clean) {
          keys[i] = this.cleanString(this.keys[i].trim(), this.alphabet);
        } else {
          keys[i] = this.keys[i];
        }
      }

      if (!msg) {
        this.errormsg = this.$t("cperrors.nothingtodo"); 
        return;
      }
      
      // Create data object
      let data = {
        alphabet: this.alphabet,
        removeunknown: !this.keepunknown,
        replacements: this.replacements,
        cipher: this.cipher,
        enordecode: 'decode',
        message: "",
        transmessage: msg,
        key1: keys[0],
        key2: keys[1],
        key3: keys[2]
      };

      try {
    
        // Call PHP script on server
        fetch(this.phpurl, {
            method: 'POST',
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => {
              this.result = data.message;
          })
          .catch((error) => {
              console.log('Error ', error);
              this.errormsg = this.$t('ciphers.errdec');
          });

      } catch (e) {

        console.log('Error ', e);
        this.errormsg = this.$t('ciphers.errdec');

      }

    },

    // Encode message
    toEncode: function() {

      // Reset
      this.errormsg = "";
      this.result = "";

      // Validate keys
      if (!this.checkKeys()) return;

      // Clean input
      let msg  = this.cleanString(this.message.trim(), this.alphabet);
      
      // Clean all keys needed
      let keys = new Array(this.cp[this.selcp].keys.length);
      for (let i = 0; i < this.cp[this.selcp].keys.length; i++) {
        if (this.cp[this.selcp].keys[i].clean) {
          keys[i] = this.cleanString(this.keys[i].trim(), this.alphabet);
        } else {
          keys[i] = this.keys[i];
        }
      }

      if (!msg) {
        this.errormsg = this.$t("cperrors.nothingtodo"); 
        return;
      }

      // Create data object
      let data = {
          alphabet: this.alphabet,
          removeunknown: !this.keepunknown,
          replacements: this.replacements,
          cipher: this.cipher,
          enordecode: 'encode',
          message: msg,
          transmessage: "",
          key1: keys[0],
          key2: keys[1],
          key3: keys[2]
      };

      // Call PHP script on server
      try {

        fetch(this.phpurl, {
            method: 'POST',
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => {

              if (this.formatoutput) {
                this.result = this.formatMessage(data.transmessage);
              } else {
                this.result = data.transmessage
              }
          })
          .catch((error) => {
              console.log('Error ', error);
              this.errormsg = this.$t('ciphers.errenc');
          });

      } catch (e) {

          console.log('Error ', e);
          this.errormsg = this.$t('ciphers.errenc');

      }

    },

    checkKeys: function() {

      // Check required for text keys
      for (let i = 0; i < this.cp[this.selcp].keys.length; i++) {
        if (this.cp[this.selcp].keys[i].req && this.cp[this.selcp].keys[i].type === "txt") {
          if (this.keys[i].trim() === "") {
            this.errormsg = this.labels[i] + this.$t('cperrors.isrequired'); 
            return false;
          }
        }
      }

      // Clean all keys needed
      let keys = new Array(this.cp[this.selcp].keys.length);
      for (let i = 0; i < this.cp[this.selcp].keys.length; i++) {
        if (this.cp[this.selcp].keys[i].clean) {
          keys[i] = this.cleanString(this.keys[i].trim(), this.alphabet);
        } else {
          keys[i] = this.keys[i];
        }
      }
      
      let re = new RegExp ("^[" + this.alphabet + "]*$", "gi");
      let re2 = /^[0-9]+$/;
          
      switch (this.cipher) {
        case 'affine' :
          if (keys[0] < 2) {
            this.errormsg = this.labels[0] + this.$t('cperrors.mustbegreaterthen1'); return false;
          }
          if (keys[1] < 1) {
            this.errormsg = this.labels[0] + this.$t('cperrors.mustbegreaterthen0'); return false;
          }
          break;
        case 'bacon' :
          if (keys[0] < 1 || keys[0] > 2) {
            this.errormsg = this.labels[0] + this.$t('cperrors.mustbe1or2'); return false;
          }
          if (keys[1].length !== 1) {
            this.errormsg = this.labels[1] + this.$t('cperrors.mustbe1char'); return false;
          }
          if (keys[2].length !== 1) {
            this.errormsg = this.labels[2] + this.$t('cperrors.mustbe1char'); return false;
          }
          break;
        case 'burrowswheeler' :
          if (keys[0].length !== 1 || this.alphabet.indexOf(keys[0].toUpperCase()) >= 0) {
            this.errormsg = this.labels[0] + this.$t('cperrors.mustbeeof'); return false;
          }
          break;
        case 'cadenus' :
          let l = this.cleanString(this.message, this.alphabet).length;
          let k = keys[0].length;
          if (k*25 !== l) {
            this.errormsg = this.$t('cperrors.msg25key'); return false;
          }
          break;
        case 'chaocipher' : {
          let k = this.keys[0].length;
          if (this.alphabet.length !== k) {
            this.errormsg = this.labels[0] + this.$t('cperrors.keymustbealph'); return false;
          }
          k = keys[1].length;
          if (this.alphabet.length !== k) {
            this.errormsg = this.labels[1] + this.$t('cperrors.keymustbealph'); return false;
          }
          break;
        }
        case 'collon' :
          if (keys[2] < 1) {
            this.errormsg = this.labels[2] + this.$t('cperrors.mustbegreaterthen0'); return false;
          }
          break;
        case 'digrafid' :
          if (keys[2] < 1) {
            this.errormsg = this.labels[2] + this.$t('cperrors.mustbegreaterthen0'); return false;
          }
          break;
        case 'gronsfeld' :
          if (!keys[0].match(re2) ) {
            this.errormsg = this.labels[0] + this.$t('cperrors.keymustbenumeric'); return false;
          }
          break;
          break;
        case 'vatsyayana' :
          let k0 = keys[0].length;
          if (k0 !== this.alphabet.length / 2) {
            this.errormsg = this.labels[0] + this.$t('cperrors.mustbehalfalf'); return false;
          }
          let k1 = keys[1].length;
          if (k1 !== this.alphabet.length / 2) {
            this.errormsg = this.labels[1] + this.$t('cperrors.mustbehalfalf'); return false;
          }
          break;
        case 'monomedinome' :
          if (keys[1].trim().length < 10) {
            this.errormsg = this.labels[1] + this.$t('cperrors.mustbe10ormore'); return false;
          }
          break;
        case 'morbit' :
          if (keys[0].trim().length !== 9) {
            this.errormsg = this.labels[0] + this.$t('cperrors.mustbe9'); return false;
          }
          break;
        case 'myszkowski' :
          if (!keys[0].match(re) ) {
            this.errormsg = this.labels[0] + this.$t('cperrors.keyfromalph'); return false;
          }
          break;
        case 'nihilisttransposition' : {
          if (this.message.length !== keys[0].length**2) {
            this.errormsg = this.$t('cperrors.msgmustbesquareofkey'); return false;
          }
          break;
        }
        case 'onetimepad' : {
          if (this.cleanString(this.message, this.alphabet).length > keys[0].length) {
            this.errormsg = this.labels[0] + this.$t('cperrors.keylongerthenmsg'); return false;
          }
          break;
        }
        case 'polybius' : {
          if (this.alphabet.length !== keys[1].length**2) {
            this.errormsg = this.labels[1]+ this.$t('cperrors.keymustbesqrroot'); return false;
          }
          if (this.alphabet.length !== keys[2].length**2) {
            this.errormsg = this.labels[2] + this.$t('cperrors.keymustbesqrroot'); return false;
          }
          break;
        }
        case 'portax' : {
          if (!keys[0].match(re) ) {
            this.errormsg = this.labels[0] + this.$t('cperrors.keyfromalph'); return false;
          }
          break;
        }
        case 'railfence' :
        case 'redefence':
        case 'scytale': {
          if (keys[0] < 2) {
            this.errormsg = this.labels[0] + this.$t('cperrors.mustbegreaterthen1'); return false;
          }
          break;
        }
        case 'skip' : {
          if (keys[0] < 1) {
            this.errormsg = this.labels[0] + this.$t('cperrors.mustbegreaterthen0'); return false;
          }
          if (keys[1] < 1) {
            this.errormsg = this.labels[1] + this.$t('cperrors.mustbegreaterthen0'); return false;
          }
          break;
        }
        case 'substitution' : {
          if (this.alphabet.length !== keys[0].trim().length) {
            this.errormsg = this.labels[0] + this.$t('cperrors.keymustbealph'); return false;
          }
          break;
        }
      	case 'syllabary' : {
          if (!keys[1].match(/^[0-9]{10}$/g)) {
            this.errormsg = this.labels[1] + this.$t('cperrors.mustbe10digits'); return false;
          }
          if (!keys[2].match(/^[0-9]{10}$/g)) {
            this.errormsg = this.labels[2] + this.$t('cperrors.mustbe10digits'); return false;
          }
        }
        case 'vigenere' : {
          if (!keys[0].match(re) ) {
            this.errormsg = this.labels[0] + this.$t('cperrors.keyfromalph'); return false;
          }
          break;
        }
      }

      return true;

    },

    // Change the cipher, reset defaults and set required inputs
    selCipher: function() {

      // Reset all
      this.result = "";
      this.errormsg = "";
      this.cipher = this.cp[this.selcp].ref;
      this.showalphabet = true;
      this.cleandecode = this.cp[this.selcp].cleandec;
      this.alphabet = this.cp[this.selcp].alphabet;
      this.codealphabet = this.cp[this.selcp].codealph;
      this.explanation = this.$t("ciphers." + this.cp[this.selcp].ref + ".info");
      this.keepcase = this.cp[this.selcp].keepcase;
      this.keepunknown = this.cp[this.selcp].keepunkn;
      this.keepdiacrit = this.cp[this.selcp].keepdiac;
      this.replacechars = this.cp[this.selcp].repl;
      this.replacements = this.cp[this.selcp].replchar;

      // Set keys for this cipher
      this.keys = new Array(this.cp[this.selcp].keys.length).fill("");
      this.labels = new Array(this.cp[this.selcp].keys.length).fill("");
      for (let i = 0; i < this.keys.length; i++) {
        if (this.cp[this.selcp].keys[i].dflt) {
          this.keys[i] = this.cp[this.selcp].keys[i].dflt;
        } else {
          switch (this.cp[this.selcp].keys[i].type) {
            case "txt" :
              this.keys[i] = ""; break;
            case "num" :
              this.keys[i] = 0; break;
            case "sel" :
              this.keys[i] = this.cp[this.selcp].keys[i].sels[0].ref; break;
            case "chk" :
              this.keys[i] = false; break;
          }
        }
        this.labels[i] = this.$t("ciphers." + this.cp[this.selcp].ref + ".k" + (i+1));
        this.modals[i] = (this.cp[this.selcp].keys[i] === true);
      }

    },
    
  },
}
</script>

