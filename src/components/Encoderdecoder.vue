<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
        <div class="text-center">{{cipher}} {{$t('cp.cipher')}}</div>
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('cp.info')" />
      <div class="form-inline mb-2">
        <input type="button" id="adfgxv" name="adfgxv" value="ADFGX(V)" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('ADFGVX')">
        <input type="button" id="affine" name="affine" value="Affine" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Affine')">
        <input type="button" id="asmco" name="asmco" value="Amsco" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Amsco')">
        <input type="button" id="atbash" name="atbash" value="Atbash" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Atbash')">
        <input type="button" id="autokey" name="autokey" value="Autokey" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Autokey')">
        <input type="button" id="bacon" name="bacon" value="Bacon" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Bacon')">
        <input type="button" id="base31" name="base31" value="Base31" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('GCId')">
        <input type="button" id="bazeries" name="bazeries" value="Bazeries" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Bazeries')">
        <input type="button" id="beaufort" name="beaufort" value="Beaufort" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Beaufort')">
        <input type="button" id="bibibinary" name="bibibinary" value="Bibi-binary" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Bibibinary')">
        <input type="button" id="bifid" name="bifid" value="Bifid" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Bifid')">
        <input type="button" id="burrowswheeler" name="burrowswheeler" value="Burrows-Wheeler" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Burrowswheeler')">
        <input type="button" id="cadenus" name="cadenus" value="Cadenus" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Cadenus')">
        <input type="button" id="caesar" name="caesar" value="Caesar" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Caesar')">
        <input type="button" id="chaocipher" name="chaocipher" value="Chaocipher" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Chaocipher')">
        <input type="button" id="colloncipher" name="colloncipher" value="Collon" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Collon')">
        <input type="button" id="columnartransposition" name="columnartransposition" value="Columnar Transposition" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Columnartransposition')">
        <input type="button" id="condi" name="condi" value="Condi" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Condi')">
        <input type="button" id="digrafid" name="digrafid" value="Digrafid" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Digrafid')">
        <input type="button" id="foursquare" name="foursquare" value="Foursquare" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Foursquare')">
        <input type="button" id="gcid" name="gcid" value="Geocache ID" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('GCId')">
        <input type="button" id="goldbug" name="goldbug" value="Goldbug" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Goldbug')">
        <input type="button" id="graycode" name="graycode" value="Graycode" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Graycode')">
        <input type="button" id="gromark" name="gromark" value="Gromark" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Gromark')">
        <input type="button" id="gronsfeld" name="gronsfeld" value="Gronsfeld" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Gronsfeld')">
        <input type="button" id="vatsyayana" name="vatsyayana" value="Kamasutra" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Vatsyayana')">
        <input type="button" id="kennycode" name="kennycode" value="Kenny code" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Kennycode')">
        <input type="button" id="monomedinome" name="monomedinome" value="Monome-dinome" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Monomedinome')">
        <input type="button" id="morbit" name="morbit" value="Morbit" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Morbit')">
        <input type="button" id="morse" name="morse" value="Morse" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Morse')">
        <input type="button" id="myszkowski" name="myszkowski" value="Myszkowski" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Myszkowski')">
        <input type="button" id="nicodemus" name="nicodemus" value="Nicodemus" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Nicodemus')">
        <input type="button" id="nihilist" name="nihilist" value="Nihilist" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Nihilist')">
        <input type="button" id="nihilisttransposition" name="nihilisttransposition" value="Nihilist transposition" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Nihilisttransposition')">
        <input type="button" id="onetimepad" name="onetimepad" value="One time pad" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Onetimepad')">
        <input type="button" id="phillips" name="phillips" value="Phillips" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Phillips')">
        <input type="button" id="playfair" name="playfair" value="Playfair" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Playfair')">
        <input type="button" id="pollux" name="pollux" value="Pollux" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Pollux')">
        <input type="button" id="polybius" name="polybius" value="Polybius" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Polybius')">
        <input type="button" id="porta" name="porta" value="Porta" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Porta')">
        <input type="button" id="portax" name="portax" value="Portax" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Portax')">
        <input type="button" id="ragbaby" name="ragbaby" value="Ragbaby" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Ragbaby')">
        <input type="button" id="railfence" name="railfence" value="Railfence" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Railfence')">
        <input type="button" id="redefence" name="redefence" value="Redefence" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Redefence')">
        <input type="button" id="reverse" name="reverse" value="Reverse" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Reverse')">
        <input type="button" id="reversewords" name="reversewords" value="Reverse words" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Reversewords')">
        <input type="button" id="rot5" name="rot5" value="ROT5" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('ROT5')">
        <input type="button" id="rot13" name="rot13" value="ROT13" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('ROT13')">
        <input type="button" id="rot47" name="rot47" value="ROT47" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('ROT47')">
        <input type="button" id="scytale" name="scytale" value="Scytale" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Scytale')">
        <input type="button" id="skip" name="skip" value="Skip" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Skip')">
        <input type="button" id="substitution" name="substitution" value="Substitution" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Substitution')">
        <input type="button" id="tapir" name="tapir" value="Tapir" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Tapir')">
        <input type="button" id="trifid" name="trifid" value="Trifid" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Trifid')">
        <input type="button" id="trisquare" name="trisquare" value="Trisquare" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Trisquare')">
        <input type="button" id="vatsyayana" name="vatsyayana" value="Vatsyayana" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Vatsyayana')">
        <input type="button" id="vigenere" name="vigenere" value="Vigenere" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Vigenere')">
        <input type="button" id="zebra" name="zebra" value="Zebra" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Zebra')">
        <input type="button" id="zygazyfa" name="zygazyfa" value="Zygazyfa" class="btn btn-sm btn-primary mb-2 mr-2" v-on:click="changeCipher('Zygazyfa')">
      </div>
      <div class="infoblock">
        {{explanation}}
      </div>
      <div class="form-inline" v-show="showalphabet">
        <label class="form-label mb-2 mr-2" for="alphabet">Alphabet</label>
        <input type='text' id="alphabet" name="alphabet" ref="alphabet" v-model="alphabet" size="52" class="form-control mr-2 mb-2">
        <div v-show="showgenalphabet">
          <input type="button" id="show-modal" name="show-modal" :value="$t('cp.genalp')" class="btn btn-primary mb-2" v-on:click="showModal = true">
          <v-polybius v-model:polybiussquare="alphabet" v-if="showModal" @close="showModal = false"></v-polybius>
        </div>
      </div>
      <div class="form-inline" v-show="showkey1">
        <label class="form-label mb-2 mr-2" for="key1">{{labelkey1}}</label>
        <input type='text' id="key1" name="key1" ref="key1" v-model="key1" class="form-control mb-2 mr-2">
        <div v-show="showgenkey1">
          <input type="button" id="show-modal" name="show-modal" :value="$t('cp.gensq')" class="btn btn-primary mb-2 mr-2" v-on:click="showModal1 = true">
          <v-polybius v-model:polybiussquare="key1" v-if="showModal1" @close="showModal1 = false"></v-polybius>
        </div>
      </div>
      <div class="form-inline" v-show="shownumkey1">
        <label class="form-label mr-2 mb-2" for="key1">{{labelkey1}}</label>
        <input type='number' id="key1" name="key1" ref="key1" v-model="key1" class="form-control mb-2">
      </div>
      <div class="form-inline" v-show="showselectkey1">
        <label for="key1" class="form-label mb-2 mr-2">{{labelkey1}}</label>
        <select id="key1" name="key1" ref="key1" class="custom-select mb-2" v-model="key1">
          <option v-for="v in key1values" :key="v" :value="v.id">{{v.name}} - {{v.id}}</option>
        </select>
      </div>
      <div class="form-inline" v-show="showkey2">
        <label class="form-label mb-2 mr-2" for="key2">{{labelkey2}}</label>
        <input type='text' id="key2" name="key2" ref="key2" v-model="key2" class="form-control mb-2 mr-2">
        <div v-show="showgenkey2">
          <input type="button" id="show-modal" name="show-modal" :value="$t('cp.gensq')" class="btn btn-primary mb-2 mr-2" v-on:click="showModal2 = true">
          <v-polybius v-model:polybiussquare="key2" v-if="showModal2" @close="showModal2 = false"></v-polybius>
        </div>
      </div>
      <div class="form-inline" v-show="shownumkey2">
        <label class="form-label mb-2 mr-2" for="key2">{{labelkey2}}</label>
        <input type='number' id="key2" name="key2" ref="key2" v-model="key2" class="form-control mb-2">
      </div>
      <div class="form-inline" v-show="showselectkey2">
        <label for="key2" class="form-label mr-2 mb-2">{{labelkey2}}</label>
        <select id="key2" name="key2" ref="key2" class="custom-select mb-2" v-model="key2">
          <option v-for="v in key2values" :key="v" :value="v.id">{{v.name}} - {{v.id}}</option>
        </select>
      </div>
      <div class="form-inline" v-show="showkey3">
        <label class="form-label mb-2 mr-2" for="key3">{{labelkey3}}</label>
        <input type='text' id="key3" name="key3" ref="key3" v-model="key3" class="form-control mb-2 mr-2">
        <div v-show="showgenkey3">
          <input type="button" id="show-modal" name="show-modal" :value="$t('cp.gensq')" class="btn btn-primary mb-2 mr-2" v-on:click="showModal3 = true">
          <v-polybius v-model:polybiussquare="key3" v-if="showModal3" @close="showModal3 = false"></v-polybius>
        </div>
      </div>
      <div class="form-inline" v-show="shownumkey3">
        <label class="form-label mr-2 mb-2" for="key3">{{labelkey3}}</label>
        <input type='number' id="key3" name="key3" ref="key3" v-model="key3" class="form-control mb-2">
      </div>
      <p v-show="error" class="errormsg">{{errormsg}}</p>
      <div class="row">
        <div class="col-6">
          <input type="button" id="encode" name="encode" :value="$t('buttons.encode')" class="btn btn-primary mb-2" v-on:click="toEncode">
          <div class="form-row mb-2">
            <textarea id="message" name="message" class="form-control" ref="message" :placeholder="$t('labels.message')" rows=10 cols=50 v-model='message'></textarea>
          </div>
          <div>
            <input type="button" id="uppercase" name="uppercase" :value="$t('cp.toupper')" class="btn btn-primary mr-2 mb-2" v-on:click="convertUpper">
            <input type="button" id="remove" name="remove" :value="$t('cp.remnonalp')" class="btn btn-primary mb-2" v-on:click="removeUnknown">
          </div>
          <div class="form-inline" v-show="showreplacements">
            <input type="button" id="replace" :value="$t('cp.repl')" class="btn btn-primary mr-2 mb-2" v-on:click="replaceCharacters">
            <input type='text' id="replacements" placeholder="J=I, U=V" v-model="replacements" size="12" class="form-control mb-2">
          </div>
          <div>
            <input type="button" id="replacediac" :value="$t('txtwordval.replacediac')" class="btn btn-primary mb-2" v-on:click="removeDiacr">
          </div>
        </div>
        <div class="col-6">
          <input type="button" id="decode" name="decode" :value="$t('buttons.decode')" class="btn btn-primary mb-2" @click="toDecode">
          <div class="form-row mb-2">
            <textarea id="translatedmessage" name="translatedmessage" class="form-control" ref="translatedmessage" :placeholder="$t('cp.phencmsg')" cols=50 rows=10 v-model='translatedmessage'></textarea>
          </div>
          <div class="form-inline">
            <input type="button" id="format" name="format" :value="$t('buttons.format')" class="btn btn-primary mb-2 mr-2" v-on:click="formatMessage">
            <label class="form-label mb-2 mr-2" for="separator">{{$t('cp.sep')}}</label>
            <select id="separator" name="separator" ref="separator" v-model="separator" class="custom-select mb-2">
              <option> </option>
              <option>-</option>
              <option>/</option>
            </select>
          </div>
          <div class="form-inline">
            <label class="form-label mb-2 mr-2" for="blocksize">{{$t('cp.bs')}}</label>
            <input type='number' id="blocksize" name="blocksize" ref="blocksize" v-model="blocksize" min="1" max="9" class="form-control mb-2">
          </div>
          <input type="button" id="unformat" name="unformat" :value="$t('cp.remform')" class="btn btn-primary mb-2" v-on:click="unformatMessage">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as textHelper from '@/scripts/texthelper.js';
import VPolybius from '@/components/inputs/VPolybius.vue'

export default {
  name: 'Encoderdecoder',

  // Prop initcipher is parameter passed by route (optional)
  props: {
    msg: String,
    initcipher: String,
  },

  // Data include variables to dynamically set appearnce and labels
  data: function () {
    return {
      showModal: false,
      showModal1: false,
      showModal2: false,
      showModal3: false,
      message: "",
      translatedmessage: "",
      error: false,
      errormsg: "",
      separator: ' ',
      blocksize: 5,
      cipher: '',
      showalphabet: true,
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      showgenalphabet: false,
      removeunknown: false,
      showreplacements: true,
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

  components: {
    VPolybius,
  },

  mounted: function() {
    //this.$refs.message.focus();
    if (typeof(this.$route.params.cipher) != "undefined")
      this.changeCipher(this.$route.params.cipher);
    else
      this.changeCipher('Atbash');
  },

  methods: {

    // Ruthless replacement of diacritics
    removeDiacr: function() {
      this.message = textHelper.removeDiacritics(this.message);
    },

    // Decode transmsg
    toDecode: function() {
      this.error = false;
      let data = {
        alphabet: this.alphabet,
        removeunknown: this.removeunknown,
        replacements: this.replacements,
        cipher: this.cipher,
        enordecode: 'decode',
        message: this.message,
        transmessage: this.translatedmessage,
        key1: this.key1,
        key2: this.key2,
        key3: this.key3
      };

      try {
    
        // Call PHP script on server
        fetch(this.phpurl, {
            method: 'POST',
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => {
              this.message = data.message;
              // console.log('Success', data)
          })
          .catch((error) => {
              console.error('Error ', error);
              this.errormsg = this.$t('cp.errdec');
              this.error = true;
          });

      } catch (e) {

        console.error('Error ', e);
        this.errormsg = this.$t('cp.errdec');
        this.error = true;

      }

    },

    // Encode message
    toEncode: function() {
      this.error = false;
      let data = {
          alphabet: this.alphabet,
          removeunknown: this.removeunknown,
          replacements: this.replacements,
          cipher: this.cipher,
          enordecode: 'encode',
          message: this.message,
          transmessage: this.translatedmessage,
          key1: this.key1,
          key2: this.key2,
          key3: this.key3
      };

      // Call PHP script on server
      try {

        fetch(this.phpurl, {
            method: 'POST',
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => {
              this.translatedmessage = data.transmessage;
              // console.log('Success', data)
          })
          .catch((error) => {
              console.error('Error ', error);
              this.errormsg = this.$t('cp.errenc');
              this.error = true;
          });

      } catch (e) {

          console.error('Error ', e);
          this.errormsg = this.$t('cp.errenc');
          this.error = true;

      }

    },

    // Change the cipher, reset defaults and set required inputs
    changeCipher: function(newcipher) {
      this.cipher = newcipher;
      this.showalphabet = true;
      this.showModal  = false;
      this.showModal1 = false;
      this.showModal2 = false;
      this.showModal3 = false;
      this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      this.showgenalphabet = false;
      this.showreplacements = true;
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
      switch (this.cipher) {
        case 'ADFGVX':
          this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          this.showgenalphabet = true;
          this.showkey1 = true;
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
          break;
        case 'Atbash':
          break;
        case 'Autokey' :
          this.showkey1 = true;
          break;
        case 'Bacon' :
          this.shownumkey1 = true;
          this.key1 = 1;
          this.showkey2 = true;
          this.key2= 'A';
          this.showkey3 = true;
          this.key3= 'B';
          break;
        case 'Bazeries' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.showkey1 = true;
          this.showgenkey1 = true;
          this.showkey2 = true;
          this.showgenkey2 = true;
          this.showkey3 = true;
          break;
        case 'Beaufort' :
          this.showkey1 = true;
          break;
        case 'Bibibinary' :
          this.alphabet = "0123456789";
          break;
        case 'Bifid' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.showgenalphabet = true;
          this.showkey1 = true;
          this.key1 = '';
          break;
        case 'Burrowswheeler' :
          this.showkey1 = true;
          this.key1 = '#';
          break;
        case 'Cadenus' :
          this.showkey1 = true;
          this.key1 = '';
          break;
        case 'Caesar' :
        case 'ROT13' :
          this.shownumkey1 = true;
          this.key1 = 13;
          break;
        case 'Chaocipher' :
          this.showkey1 = true;
          this.key1 = 'ABCDEFMNOPQRSGHIJKLTUVWXYZ';
          this.showkey2 = true;
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
          this.showkey2 = true;
          this.shownumkey3 = true;
          this.key3 = 3;
          break;
        case 'Columnartransposition' :
          this.showkey1 = true;
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
          break;
        case 'Foursquare':
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.showkey1 = true;
          this.key1 = "";
          this.showgenkey1 = true;
          this.showkey2 = true;
          this.key2 = "";
          this.showgenkey2 = true;
          break;
        case 'GCId' :
        case 'Base31' :
          this.showalphabet = false;
          break;
        case 'Goldbug':
          break;
        case 'Graycode':
          this.shownumkey1 = true;
          this.key1 = 4;
          this.alphabet = "0123456789";
          break;
        case 'Gromark':
          this.showkey1 = true;
          this.showkey2 = true;
          this.key2 = "";
          break;
        case 'Gronsfeld' :
          this.showkey1 = true;
          this.key1 = '';
          break;
        case 'Kennycode':
          break;
        case 'Monomedinome' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXZ";
          this.showkey1 = true;
          this.showkey2 = true;
          break;
        case 'Morbit' :
          this.showkey1 = true;
          break;
        case 'Morse' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXZ0123456789.,?!-/:'();=@&" + '"';
          break;
        case 'Myszkowski' :
          this.showkey1 = true;
          break;
        case 'Nicodemus' :
          this.showkey1 = true;
          break;
        case 'Nihilist' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.showkey1 = true;
          this.showgenkey1 = true;
          this.showkey2 = true;
          this.key2 = '';
          break;
        case 'Nihilisttransposition' :
          this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          this.showkey1 = true;
          this.showselectkey2 = true;
          this.key2 = true;
          this.key2values = [
            { id: true, name: this.$t('cp.nihilisttransposition.s1.row')},
            { id: false, name: this.$t('cp.nihilisttransposition.s1.col')},
          ];
          break;
        case 'Onetimepad' :
          this.showkey1 = true;
          break;
        case 'Phillips' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.showkey1 = true;
          this.showgenkey1 = true;
          break;
        case 'Playfair' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.showkey1 = true;
          this.showgenkey1 = true;
          break;
        case 'Polybius' :
          this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
          this.showgenalphabet = true;
          this.showkey1 = true;
          this.key1 = '12345';
          this.showkey2 = true;
          this.key2 = '12345';
          break;
        case 'Pollux' :
          this.showkey1 = true;
          this.key1 = '.';
          this.showkey2 = true;
          this.key2 = '-';
          this.key3 = 'x';
          this.showkey3 = true;
          break;
        case 'Porta' :
          this.showkey1 = true;
          break;
        case 'Portax' :
          this.showkey1 = true;
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
          this.key1 = 'ABCDEFGHIJKLM';
          this.showkey2 = true;
          this.key2 = 'NOPQRSTUVWXYZ';
          break;
        case 'Vigenere' :
          this.showkey1 = true;
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

    // Convert message to uppercase
    convertUpper: function() {
      this.message = this.message.toUpperCase();
    },

    // Remove characters not present in alphabet from message
    removeUnknown: function() {
      let s = "";
      for (let i=0; i < this.message.length; i++)
        if (this.alphabet.indexOf(this.message[i]) >= 0) s += this.message[i];
      this.message = s;
    },

    // Add separators to transmsg
    formatMessage: function() {
      let s = "";
      for (let i = 0; i < this.translatedmessage.length; i++) {
        if ((i % this.blocksize == 0) && (i>0)) s += this.separator;
          s += this.translatedmessage[i];
      }
      if (s[s.length-1] == this.separator) s = s.slice(0, s.length-2);
      this.translatedmessage = s;
    },

    // Remove separators from transmsg
    unformatMessage: function() {
      let s = "";
      let block = parseInt(this.blocksize);
      for (let i = 0; i < this.translatedmessage.length; i++)
			if ((i+1) % (block+1) != 0) s += this.translatedmessage[i];
      this.translatedmessage = s;
    },

    // Replace characters in message
    replaceCharacters: function () {

      let arr = this.replacements.match(/[A-Za-z]=[A-Za-z]/g);

      if (arr !== null) 
        for (let i=0; i<arr.length; i++) {
          let s = "";
          for (let j=0; j<this.message.length; j++)
            if (this.message[j] === arr[i][0])
              s += arr[i][2];
            else
              s += this.message[j];
          this.message = s;
        }

    }
  },
}
</script>

<style scoped>

#explanation {
  font-size: 1.2em;
}

</style>
