<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      <div class="text-center">
        {{ cipher }} {{ $t('cp.cipher') }}
      </div>
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('cp.info')"
      />
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="selcipher"
        >{{ $t('cp.selcipher') }}</label>    
        <select
          id="selcipher"
          v-model="cipher"
          class="form-select mb-2 md-size"
          @change="changeCipher"
        >
          <option value="ADFGVX">ADFGX(V)</option>
          <option value="Affine">Affine</option>
          <option value="Amsco">Amsco</option>
          <option value="Atbash">Atbash</option>
          <option value="Atomtom">A-tom-tom</option>
          <option value="Autokey">Autokey</option>
          <option value="Bacon">Bacon</option>
          <option value="GCId">Base31</option>
          <option value="Bazeries">Bazeries</option>
          <option value="Beaufort">Beaufort</option>
          <option value="Bibibinary">Bibi-binary</option>
          <option value="Bifid">Bifid</option>
          <option value="Burrowswheeler">Burrowswheeler</option>
          <option value="Cadenus">Cadenus</option>
          <option value="Caesar">Caesar</option>
          <option value="Chaocipher">Chaocipher</option>
          <option value="Collon">Collon</option>
          <option value="Columnartransposition">Columnar Transposition</option>
          <option value="Condi">Condi</option>
          <option value="Digrafid">Digrafid</option>
          <option value="Foursquare">Foursquare</option>
          <option value="GCId">Geocache ID</option>
          <option value="Goldbug">Goldbug</option>
          <option value="Gromark">Gromark</option>
          <option value="Gronsfeld">Gronsfeld</option>
          <option value="Vatsyayana">Kamasutra</option>
          <option value="Kennycode">Kenny Code</option>
          <option value="Monomedinome">Monome-dinome</option>
          <option value="Morbit">Morbit</option>
          <option value="Morse">Morse</option>
          <option value="Myszkowski">Myszkowski</option>
          <option value="Nicodemus">Nicodemus</option>
          <option value="Nihilist">Nihilist</option>
          <option value="Nihilisttransposition">Nihilist Transposition</option>
          <option value="Onetimepad">One Time Pad</option>
          <option value="Phillips">Phillips</option>
          <option value="Playfair">Playfair</option>
          <option value="Pollux">Pollux</option>
          <option value="Polybius">Polybius</option>
          <option value="Porta">Porta</option>
          <option value="Portax">Portax</option>
          <option value="Ragbaby">Ragbaby</option>
          <option value="Railfence">Railfence</option>
          <option value="Redefence">Redefence</option>
          <option value="Reverse">Reverse</option>
          <option value="Reversewords">Reverse Words</option>
          <option value="ROT5">ROT5</option>
          <option value="ROT13">ROT13</option>
          <option value="ROT47">ROT47</option>
          <option value="Scytale">Scytale</option>
          <option value="Skip">Skip</option>
          <option value="Substitution">Substitution</option>
          <option value="Syllabary">Syllabary</option>
          <option value="Tapir">Tapir</option>
          <option value="Trifid">Trifid</option>
          <option value="Trisquare">Trisquare</option>
          <option value="Vatsyayana">Vatsyayana</option>
          <option value="Vigenere">Vigenere</option>
          <option value="Zebra">Zebra</option>
          <option value="Zygazyfa">Zygazyfa</option>
        </select>
      </div>
      <div class="infoblock">
        {{ explanation }}
      </div>
      <div
        v-show="showkey1"
        class="row"
      >
        <label
          class="form-label mb-2 md-size"
          for="key1"
        >{{ labelkey1 }}</label>
        <input
          id="key1"
          v-model="key1"
          type="text"
          class="form-control mb-2 me-2 md-size"
        >
        <input
          id="show-modal"
          v-show="showgenkey1"
          type="button"
          :value="$t('cp.gensq')"
          class="btn mb-2 md-size"
          @click="showModal1 = true"
        >
        <v-polybius
          v-if="showModal1"
          v-model:polybiussquare="key1"
          @close="showModal1 = false"
        />
      </div>
      <div
        v-show="shownumkey1"
        class="row"
      >
        <label
          class="form-label md-size mb-2"
          for="key1"
        >{{ labelkey1 }}</label>
        <input
          id="key1"
          v-model="key1"
          type="number"
          class="form-control md-size mb-2"
        >
      </div>
      <div
        v-show="showselectkey1"
        class="row"
      >
        <label
          for="key1"
          class="form-label mb-2 md-size"
        >{{ labelkey1 }}</label>
        <select
          id="key1"
          v-model="key1"
          class="form-select md-size mb-2"
        >
          <option
            v-for="v in key1values"
            :key="v"
            :value="v.id"
          >
            {{ v.name }} - {{ v.id }}
          </option>
        </select>
      </div>
      <div
        v-show="showkey2"
        class="row"
      >
        <label
          class="form-label mb-2 md-size"
          for="key2"
        >{{ labelkey2 }}</label>
        <input
          id="key2"
          v-model="key2"
          type="text"
          class="form-control mb-2 me-2 md-size"
        >
        <input
          v-show="showgenkey2"
          id="show-modal"
          type="button"
          :value="$t('cp.gensq')"
          class="btn mb-2 md-size"
          @click="showModal2 = true"
        >
        <v-polybius
          v-if="showModal2"
          v-model:polybiussquare="key2"
          @close="showModal2 = false"
        />
      </div>
      <div
        v-show="shownumkey2"
        class="row"
      >
        <label
          class="form-label mb-2 md-size"
          for="key2"
        >{{ labelkey2 }}</label>
        <input
          id="key2"
          v-model="key2"
          type="number"
          class="form-control mb-2 md-size"
        >
      </div>
      <div
        v-show="showselectkey2"
        class="row"
      >
        <label
          for="key2"
          class="form-label md-size mb-2"
        >{{ labelkey2 }}</label>
        <select
          id="key2"
          v-model="key2"
          class="form-select mb-2 md-size"
        >
          <option
            v-for="v in key2values"
            :key="v"
            :value="v.id"
          >
            {{ v.name }} - {{ v.id }}
          </option>
        </select>
      </div>
      <div
        v-show="showkey3"
        class="row"
      >
        <label
          class="form-label mb-2 md-size"
          for="key3"
        >{{ labelkey3 }}</label>
        <input
          id="key3"
          v-model="key3"
          type="text"
          class="form-control mb-2 me-2 md-size"
        >
        <input
          v-show="showgenkey3"
          id="show-modal"
          type="button"
          :value="$t('cp.gensq')"
          class="btn mb-2 mr-2 md-size"
          @click="showModal3 = true"
        >
        <v-polybius
          v-if="showModal3"
          v-model:polybiussquare="key3"
          @close="showModal3 = false"
        />
      </div>
      <div
        v-show="shownumkey3"
        class="row"
      >
        <label
          class="form-label md-size mb-2"
          for="key3"
        >{{ labelkey3 }}</label>
        <input
          id="key3"
          v-model="key3"
          type="number"
          class="form-control md-size mb-2"
        >
      </div>
      <button
        id="encode"
        class="btn mb-2 me-2"
        @click="toEncode"
      >
        {{ $t('buttons.encode')  }}
      </button>
      <button
        id="decode"
        class="btn mb-2 me-2"
        @click="toDecode"
      >
        {{ $t('buttons.decode') }}
      </button>
      <button 
        class="btn mb-2 md-size" 
        @click="expertmode=!expertmode"
        v-show="!expertmode"
      > <i class="fa-solid fa-gears"></i>
        {{ $t('cp.expertmode') }}
      </button>
      <button 
        class="btn mb-2 md-size" 
        @click="expertmode=!expertmode" 
        v-show="expertmode"
      > <i class="fa-solid fa-gears"></i>
        {{ $t('cp.hideexpertmode') }}
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
          >{{ $t('cp.keepcase') }}</label>
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
          >{{ $t('cp.keepdiacrit') }}</label>
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
          >{{ $t('cp.keepunknown') }}</label>
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
          >{{ $t('cp.replacechars') }}</label>
          <div class="row">
            <label
                class="form-label mb-2 sm-size"
                for="replacements"
            >{{ $t('cp.repl') }}</label>
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
          >{{ $t('cp.formatoutput') }}</label>
          <div class="row">
            <label
              class="form-label mb-2 sm-size"
              for="blocksize"
            >{{ $t('cp.bs') }}</label>
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
            >{{ $t('cp.sep') }}</label>    
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
import VPolybius from '@/components/inputs/VPolybius.vue'

export default {
  name: 'EncoderDecoder',

  components: {
    VPolybius,
  },

  // Prop initcipher is parameter passed by route (optional)
  props: {
    initcipher: {
      type: String,
      required: false,
      default: "Atbash"
    },
  },

  // Data include variables to dynamically set appearnce and labels
  data: function () {
    return {
      showModal: false,
      showModal1: false,
      showModal2: false,
      showModal3: false,
      expertmode: false,
      keepcase: false,
      keepdiacrit: false,
      keepunknown: false,
      replacechars: false,
      formatoutput: false,
      cleankey1: true,
      cleankey2: true,
      cleankey3: true,
      cleandecode : true,
      key1required: false,
      key2required: false,
      key3required: false,
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
      shownumkey1: false,
      showselectkey1 : false,
      key1values: [],             // Object array with id and name
      showkey1: false,
      labelkey1: '',
      key1: '',
      showgenkey1: false,
      shownumkey2: false,
      showselectkey2 : false,
      key2values: [],             // Object array with id and name
      showkey2: false,
      labelkey2: '',
      key2: '',
      showgenkey2: false,
      shownumkey3: false,
      showkey3: false,
      labelkey3: '',
      key3: '',
      showgenkey3: false,
      explanation: '',
      phpurl: window.location.protocol + "//"  + window.location.hostname + "/cipher-toolkit/encoderdecoder.php",
    }
  },

  mounted: function() {
    if (this.$route.params.initcipher) {
      this.cipher = this.$route.params.initcipher;
      this.changeCipher();
    } else {
      this.cipher = "Atbash";
      this.changeCipher();
    }
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

      // Clean input and keys
      let alf = (this.codealphabet) ? this.codealphabet : this.alphabet;
      let msg  = (this.cleandecode) ? this.cleanString(this.message.trim(), alf) : this.message;
      let key1 = (this.showkey1) && this.cleankey1 ? this.key1.trim() : this.key1;
      let key2 = (this.showkey2) && this.cleankey2 ? this.key2.trim() : this.key2;
      let key3 = (this.showkey3) && this.cleankey3 ? this.key3.trim() : this.key3;

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
        key1: key1,
        key2: key2,
        key3: key3
      };

      // console.log(data);

      try {
    
        // Call PHP script on server
        fetch(this.phpurl, {
            method: 'POST',
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => {
              this.result = data.message;
              // console.log('Success', data)
          })
          .catch((error) => {
              console.log('Error ', error);
              this.errormsg = this.$t('cp.errdec');
          });

      } catch (e) {

        console.log('Error ', e);
        this.errormsg = this.$t('cp.errdec');

      }

    },

    // Encode message
    toEncode: function() {

      // Reset
      this.errormsg = "";
      this.result = "";

      // Validate keys
      if (!this.checkKeys()) return;

      // Clean input and keys
      let msg  = this.cleanString(this.message.trim(), this.alphabet);
      let key1 = (this.showkey1) && this.cleankey1 ? this.cleanString(this.key1.trim(), this.alphabet) : this.key1;
      let key2 = (this.showkey2) && this.cleankey2 ? this.cleanString(this.key2.trim(), this.alphabet) : this.key2;
      let key3 = (this.showkey3) && this.cleankey3 ? this.cleanString(this.key3.trim(), this.alphabet) : this.key3;

      if (!msg) {
        this.errormsg = this.$t("cperrors.nothingtodo"); 
        return;
      }

      // Create data object
      let data = {
          alphabet: this.alphabet,
          removeunknown: !this.keepuknown,
          replacements: this.replacements,
          cipher: this.cipher,
          enordecode: 'encode',
          message: msg,
          transmessage: "",
          key1: key1,
          key2: key2,
          key3: key3
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
              //console.log('Success', data)
          })
          .catch((error) => {
              console.log('Error ', error);
              this.errormsg = this.$t('cp.errenc');
          });

      } catch (e) {

          console.log('Error ', e);
          this.errormsg = this.$t('cp.errenc');

      }

    },

    checkKeys: function() {

      if (this.key1required && this.key1.trim() === "") {
        this.errormsg = this.labelkey1 + this.$t('cperrors.isrequired'); return false;
      }
      if (this.key2required && this.key2.trim() === "") {
        this.errormsg = this.labelkey2 + this.$t('cperrors.isrequired'); return false;
      }
      if (this.key3required && this.key3.trim() === "") {
        this.errormsg = this.labelkey3 + this.$t('cperrors.isrequired'); return false;
      }

      let re = new RegExp ("^[" + this.alphabet + "]*$", "gi");

      switch (this.cipher) {
        case 'Affine' :
          if (this.key1 < 2) {
            this.errormsg = this.labelkey1 + this.$t('cperrors.mustbegreaterthen1'); return false;
          }
          if (this.key2 < 1) {
            this.errormsg = this.labelkey2 + this.$t('cperrors.mustbegreaterthen0'); return false;
          }
          break;
        case 'Bacon' :
          if (this.key1 < 1 || this.key1 > 2) {
            this.errormsg = this.labelkey1 + this.$t('cperrors.mustbe1or2'); return false;
          }
          if (this.key2.length !== 1) {
            this.errormsg = this.labelkey2 + this.$t('cperrors.mustbe1char'); return false;
          }
          if (this.key3.length !== 1) {
            this.errormsg = this.labelkey3 + this.$t('cperrors.mustbe1char'); return false;
          }
          break;
        case 'Bazeries' :
          if (!this.key3.match(/^[0-9]+$/g)) {
            this.errormsg = this.labelkey3 + this.$t('cperrors.mustbenumeric'); return false;
          }
          break;
        case 'Burrowswheeler' :
          if (this.key1.length !== 1 || this.alphabet.indexOf(this.key1[0].toUpperCase()) >= 0) {
            this.errormsg = this.labelkey1 + this.$t('cperrors.mustbeeof'); return false;
          }
          break;
        case 'Cadenus' :
          let l = this.cleanString(this.message, this.alphabet).length;
          let k = this.cleanString(this.key1, this.alphabet).length;
          if (k*25 !== l) {
            this.errormsg = this.$t('cperrors.msg25key'); return false;
          }
          break;
        case 'Chaocipher' : {
          let k = this.cleanString(this.key1, this.alphabet).length;
          if (this.alphabet.length !== k) {
            this.errormsg = this.labelkey1 + this.$t('cperrors.keymustbealph'); return false;
          }
          k = this.cleanString(this.key2, this.alphabet).length;
          if (this.alphabet.length !== k) {
            this.errormsg = this.labelkey2 + this.$t('cperrors.keymustbealph'); return false;
          }
          break;
        }
        case 'Collon' :
          if (this.key3 < 1) {
            this.errormsg = this.labelkey3 + this.$t('cperrors.mustbegreaterthen0'); return false;
          }
          break;
        case 'Digrafid' :
          if (this.key3 < 1) {
            this.errormsg = this.labelkey3 + this.$t('cperrors.mustbegreaterthen0'); return false;
          }
          break;
        case 'Gromark' :
          if (!this.key2.match(/^[0-9]+$/g)) {
            this.errormsg = this.labelkey2 + this.$t('cperrors.mustbenumeric'); return false;
          }
          break;
        case 'Gronsfeld' :
          if (!this.key1.match(/^[0-9]+$/g)) {
            this.errormsg = this.labelkey1 + this.$t('cperrors.mustbenumeric'); return false;
          }
          break;
        case 'Vatsyayana' :
          let k1 = this.cleanString(this.key1, this.alphabet).length;
          if (k1 !== this.alphabet.length / 2) {
            this.errormsg = this.labelkey1 + this.$t('cperrors.mustbehalfalf'); return false;
          }
          let k2 = this.cleanString(this.key1, this.alphabet).length;
          if (k2 !== this.alphabet.length / 2) {
            this.errormsg = this.labelkey2 + this.$t('cperrors.mustbehalfalf'); return false;
          }
          break;
        case 'Monomedinome' :
          if (this.key2.trim().length < 10) {
            this.errormsg = this.labelkey2 + this.$t('cperrors.mustbe10ormore'); return false;
          }
          break;
        case 'Morbit' :
          if (this.key1.trim().length !== 9) {
            this.errormsg = this.labelkey1 + this.$t('cperrors.mustbe9'); return false;
          }
          break;
        case 'Myszkowski' :
          if (!this.key1.match(re) ) {
            this.errormsg = this.labelkey1 + this.$t('cperrors.keyfromalph'); return false;
          }
          break;
        case 'Nihilisttransposition' : {
          if (this.message.length !== this.cleanString(this.key1, this.alphabet).length**2) {
            this.errormsg = this.$t('cperrors.msgmustbesquareofkey'); return false;
          }
          break;
        }
        case 'Onetimepad' : {
          if (this.cleanString(this.message, this.alphabet).length > this.cleanString(this.key1, this.alphabet).length) {
            this.errormsg = this.labelkey1 + this.$t('cperrors.keylongerthenmsg'); return false;
          }
          break;
        }
        case 'Polybius' : {
          if (this.alphabet.length !== this.cleanString(this.key1, this.alphabet).length**2) {
            this.errormsg = this.labelkey1 + this.$t('keymustbesqrroot'); return false;
          }
          if (this.alphabet.length !== this.cleanString(this.key2, this.alphabet).length**2) {
            this.errormsg = this.labelkey2 + this.$t('keymustbesqrroot'); return false;
          }
          break;
        }
        case 'Portax' : {
          if (!this.key1.match(re) ) {
            this.errormsg = this.labelkey1 + this.$t('cperrors.keyfromalph'); return false;
          }
          break;
        }
        case 'Railfence' :
        case 'Redefence':
        case 'Scytale': {
          if (this.key1 < 2) {
            this.errormsg = this.labelkey1 + this.$t('cperrors.mustbegreaterthen1'); return false;
          }
          break;
        }
        case 'Skip' : {
          if (this.key1 < 1) {
            this.errormsg = this.labelkey1 + this.$t('cperrors.mustbegreaterthen0'); return false;
          }
          if (this.key2 < 1) {
            this.errormsg = this.labelkey2 + this.$t('cperrors.mustbegreaterthen0'); return false;
          }
          break;
        }
        case 'Substitution' : {
          if (this.alphabet.length !== this.cleanString(this.key1, this.alphabet).length) {
            this.errormsg = this.labelkey1 + this.$t('cperrors.keymustbealph'); return false;
          }
          break;
        }
      	case 'Syllabary' : {
          if (!this.key2.match(/^[0-9]{10}$/g)) {
            this.errormsg = this.labelkey2 + this.$t('cperrors.mustbe10digits'); return false;
          }
          if (!this.key3.match(/^[0-9]{10}$/g)) {
            this.errormsg = this.labelkey3 + this.$t('cperrors.mustbe10digits'); return false;
          }
        }
        case 'Vigenere' : {
          if (!this.key1.match(re) ) {
            this.errormsg = this.labelkey1 + this.$t('cperrors.keyfromalph'); return false;
          }
          break;
        }
      }

      return true;

    },

    // Change the cipher, reset defaults and set required inputs
    changeCipher: function() {

      // Reset all
      this.result = "";
      this.errormsg = "";
      this.showalphabet = true;
      this.showModal  = false;
      this.showModal1 = false;
      this.showModal2 = false;
      this.showModal3 = false;
      this.cleankey1 = true;
      this.cleankey2 = true;
      this.cleankey3 = true;
      this.cleandecode = true;
      this.key1required = false;
      this.key2required = false;
      this.key3required = false;
      this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      this.codealphabet = "";
      this.key1 = "";
      this.showkey1 = false;
      this.shownumkey1 = false;
      this.showselectkey1 = false;
      this.showgenkey1 = false;
      this.key2 = "";
      this.showkey2 = false;
      this.shownumkey2 = false;
      this.showselectkey2 = false;
      this.showgenkey2 = false;
      this.key3 = "";
      this.showkey3 = false;
      this.shownumkey3 = false;
      this.showgenkey3 = false;
      this.explanation = "";
      this.keepcase = false;
      this.keepdiacrit = false;
      this.keepunknown = false;
      this.replacechars = false;
      this.replacements = "";

      // Set keys for this cipher
      switch (this.cipher) {
        case 'ADFGVX':
          this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          this.showkey1 = true;
          this.key1required = true;
          break;
        case 'Affine':
          this.shownumkey1 = true;
          this.key1 = 5;
          this.shownumkey2 = true;
          this.key2 = 5;
          break;
        case 'Amsco':
          this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          this.showkey1 = true;
          this.key1required = true;
          break;
        case 'Atbash':
        case 'Atomtom' :
          break;
        case 'Autokey' :
          this.showkey1 = true;
          this.codealphabet = " /\\";
          break;
        case 'Bacon' :
          this.shownumkey1 = true;
          this.key1 = 1;
          this.showkey2 = true;
          this.key2required = true;
          this.key2= 'A';
          this.showkey3 = true;
          this.key3required = true;
          this.key3= 'B';
          this.cleankey1 = false;
          this.cleankey2 = false;
          break;
        case 'Bazeries' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.key1 = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.key2 = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.replacechars = true;
          this.replacements = "J=I";
          this.key1required = true;
          this.showkey1 = true;
          this.showgenkey1 = true;
          this.showkey2 = true;
          this.showgenkey2 = true;
          this.showkey3 = true;
          this.key3required = true;
          this.cleankey3 = false;
          break;
        case 'Beaufort' :
          this.showkey1 = true;
          this.key1required = true;
          break;
        case 'Bibibinary' :
          this.alphabet = "0123456789";
          this.codealphabet = "HBKDOAEI";
          break;
        case 'Bifid' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.showkey1 = true;
          this.key1 = '';
          break;
        case 'Burrowswheeler' :
          this.showkey1 = true;
          this.key1 = '#';
          this.key1required = true;
          this.cleankey1 = false;
          break;
        case 'Cadenus' :
          this.showkey1 = true;
          this.key1required = true;
          this.key1 = '';
          break;
        case 'Caesar' :
        case 'ROT13' :
          this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          this.shownumkey1 = true;
          this.key1 = 13;
          break;
        case 'Chaocipher' :
          this.showkey1 = true;
          this.key1required = true;
          this.key1 = 'ABCDEFMNOPQRSGHIJKLTUVWXYZ';
          this.showkey2 = true;
          this.key2required = true;
          this.key2 = 'PQRSTUVWXYZABCDEKLMNOFGHIJ';
          break;
        case 'Collon' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.showselectkey1 = true;
          this.key1values = [
            { id: "RFCL", name: this.$t('cp.collon.s1.rfcl')},
            { id: "RLCL", name: this.$t('cp.collon.s1.rlcl')},
            { id: "RFCF", name: this.$t('cp.collon.s1.rfcf')},
            { id: "RLCF", name: this.$t('cp.collon.s1.rlcf')},
            { id: "CLRL", name: this.$t('cp.collon.s1.clrl')},
            { id: "CLRF", name: this.$t('cp.collon.s1.clrf')},
            { id: "CFRF", name: this.$t('cp.collon.s1.cfrf')},
            { id: "CFRL", name: this.$t('cp.collon.s1.cfrl')},
          ];
          this.key1 = "RFCL";
          this.key2 = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.cleankey1 = false;
          this.replacechars = true;
          this.replacements = "J=I";
          this.showkey2 = true;
          this.key2required = true;
          this.showgenkey2 = true;
          this.shownumkey3 = true;
          this.key3 = 3;
          break;
        case 'Columnartransposition' :
          this.showkey1 = true;
          this.key1required = true;
          break;
        case 'Condi' :
          this.showkey1 = true;
          this.shownumkey2 = true;
          this.key2 = 0;
          break;
        case 'Digrafid' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ#";
          this.showkey1 = true;
          this.showkey2 = true;
          this.shownumkey3 = true;
          this.key3 = 1;
          break;
        case 'Foursquare':
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.key1 = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.key2 = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.replacechars = true;
          this.replacements = "J=I";
          this.showkey1 = true;
          this.showgenkey1 = true;
          this.showkey2 = true;
          this.showgenkey2 = true;
          break;
        case 'GCId' :
        case 'Base31' :
          this.showalphabet = false;
          break;
        case 'Goldbug':
          break;
        case 'Gromark':
          this.showkey1 = true;
          this.key1required = true;
          this.showkey2 = true;
          this.cleankey2 = false;
          this.key2 = "";
          break;
        case 'Gronsfeld' :
          this.showkey1 = true;
          this.cleankey1 = false;
          this.key1required = true;
          this.key1 = '';
          break;
        case 'Kennycode':
          // this.codealphabet = "mpfMPF";
          this.cleandecode = false;
          break;
        case 'Monomedinome' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXZ";
          this.codealphabet = "0123456789";
          this.showkey1 = true;
          this.cleankey1 = false;
          this.showkey2 = true;
          this.key2required = true;
          break;
        case 'Morbit' :
          this.showkey1 = true;
          this.codealphabet = "123456789";
          break;
        case 'Morse' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXZ0123456789.,?!-/:'();=@&" + '"';
          this.cleandecode = false;
          break;
        case 'Myszkowski' :
          this.showkey1 = true;
          this.key1required = true;
          break;
        case 'Nicodemus' :
          this.showkey1 = true;
          this.key1required = true;
          break;
        case 'Nihilist' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.key1 = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.cleandecode = false;
          this.replacechars = true;
          this.replacements = "J=I";
          this.showkey1 = true;
          this.key2required = true;
          this.showgenkey1 = true;
          this.showkey2 = true;
          this.key2 = '';
          break;
        case 'Nihilisttransposition' :
          this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          this.showkey1 = true;
          this.key1required = true;
          this.showselectkey2 = true;
          this.key2 = true;
          this.key2values = [
            { id: true, name: this.$t('cp.nihilisttransposition.s1.row')},
            { id: false, name: this.$t('cp.nihilisttransposition.s1.col')},
          ];
          this.cleankey2 = false;
          break;
        case 'Onetimepad' :
          this.showkey1 = true;
          break;
        case 'Phillips' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.key1 = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.replacechars = true;
          this.replacements = "J=I";
          this.showkey1 = true;
          this.showgenkey1 = true;
          break;
        case 'Playfair' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.key1 = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.replacechars = true;
          this.replacements = "J=I";
          this.showkey1 = true;
          this.showgenkey1 = true;
          break;
        case 'Polybius' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.cleandecode = false;
          this.replacechars = true;
          this.replacements = "J=I";
          this.showkey1 = true;
          this.key1required = true;
          this.key1 = '12345';
          this.showkey2 = true;
          this.key2required = true;
          this.key2 = '12345';
          this.cleankey1 = false;
          this.cleankey2 = false;
          break;
        case 'Pollux' :
          this.cleandecode = false;
          this.showkey1 = true;
          this.key1required = true;
          this.key1 = '.';
          this.showkey2 = true;
          this.key2required = true;
          this.key2 = '-';
          this.showkey3 = true;
          this.key3required = true;
          this.key3 = 'x';
          this.cleankey1 = false;
          this.cleankey2 = false;
          this.cleankey3 = false;
          break;
        case 'Porta' :
          this.showkey1 = true;
          this.key1required = true;
          break;
        case 'Portax' :
          this.showkey1 = true;
          this.key1required = true;
          break;
        case 'Ragbaby' :
          this.showkey1 = true;
          break;
        case 'Railfence':
          this.shownumkey1 = true;
          this.key1 = 3;
          this.shownumkey2 = true;
          this.key2 = 0;
          break;
        case 'Redefence':
          this.shownumkey1 = true;
          this.key1 = 3;
          this.shownumkey2 = true;
          this.key2 = 0;
          this.showkey3 = true;
          break;
        case 'Reverse' :
          this.showalphabet = false;
          break;
        case 'Reversewords' :
          this.showalphabet = false;
          break;
        case 'ROT5' :
          this.alphabet = "0123456789";
          this.shownumkey1 = true;
          this.key1 = 5;
          break;
        case 'ROT47' :
          this.alphabet = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
          this.shownumkey1 = true;
          this.key1 = 47;
          this.explanation = "";
          break;
        case 'Scytale' :
          this.shownumkey1 = true;
          this.key1 = 3;
          break;
        case 'Skip' :
          this.shownumkey1 = true;
          this.key1 = 1;
          this.shownumkey2 = true;
          this.key2 = 1;
          break;
        case 'Substitution' :
          this.showkey1 = true;
          this.key1required = true;
          this.key1 = this.alphabet;
          break;
        case 'Syllabary' :
          this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
          this.showkey1 = true;
          this.key1required = true;
          this.key1 = "KEY",
          this.showkey2 = true;
          this.key2required = true;
          this.key2 = "0123456789";
          this.showkey3 = true;
          this.key3 = "0123456789";
          this.cleankey2 = false;
          this.cleankey3 = false;
          break;
        case 'Tapir' :
          this.showalphabet = false;
          break;
        case 'Trifid' :
          this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#";
          this.showkey1 = true;
          break;
        case 'Trisquare' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.key1 = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.key2 = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.key3 = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.replacechars = true;
          this.replacements = "J=I";
          this.showkey1 = true;
          this.showgenkey1 = true;
          this.showkey2 = true;
          this.showgenkey2 = true;
          this.showkey3 = true;
          this.showgenkey3 = true;
          break;
        case 'Vatsyayana' :
          this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          this.showkey1 = true;
          this.key1required = true;
          this.key1 = 'ABCDEFGHIJKLM';
          this.showkey2 = true;
          this.key2required = true;
          this.key2 = 'NOPQRSTUVWXYZ';
          break;
        case 'Vigenere' :
          this.showkey1 = true;
          this.key1required = true;
          break;
        case 'Zebra' :
          this.showalphabet = false;
          break;
        case 'Zygazyfa' :
          this.showkey1 = true;
          this.key1 = 'KEY';
          break;
        default :
          console.log('Unknown cipher' + this.cipher);
      }
      this.explanation = this.$t("cp." + this.cipher.toLowerCase() + ".info");
      if (this.showkey1 || this.shownumkey1 || this.showselectkey1) this.labelkey1 = this.$t("cp." + this.cipher.toLowerCase() + ".k1");
      if (this.showkey2 || this.shownumkey2 || this.showselectkey2) this.labelkey2 = this.$t("cp." + this.cipher.toLowerCase() + ".k2");
      if (this.showkey3 || this.shownumkey3 ) this.labelkey3 = this.$t("cp." + this.cipher.toLowerCase() + ".k3");
    },
    
  },
}
</script>

