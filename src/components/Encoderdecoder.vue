<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      <div class="text-center">
        {{ cipher }} {{ $t('cp.cipher') }}
      </div>
    </div>
    <div class="mainpage">
      <div
        class="intro"
        v-html="$t('cp.info')"
      />
      <div class="form-inline mb-2">
        <input
          id="adfgxv"
          type="button"
          name="adfgxv"
          value="ADFGX(V)"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('ADFGVX')"
        >
        <input
          id="affine"
          type="button"
          name="affine"
          value="Affine"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Affine')"
        >
        <input
          id="asmco"
          type="button"
          name="asmco"
          value="Amsco"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Amsco')"
        >
        <input
          id="atbash"
          type="button"
          name="atbash"
          value="Atbash"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Atbash')"
        >
        <input
          id="atomtom"
          type="button"
          name="atomtom"
          value="A-tom-tom"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Atomtom')"
        >
        <input
          id="autokey"
          type="button"
          name="autokey"
          value="Autokey"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Autokey')"
        >
        <input
          id="bacon"
          type="button"
          name="bacon"
          value="Bacon"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Bacon')"
        >
        <input
          id="base31"
          type="button"
          name="base31"
          value="Base31"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('GCId')"
        >
        <input
          id="bazeries"
          type="button"
          name="bazeries"
          value="Bazeries"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Bazeries')"
        >
        <input
          id="beaufort"
          type="button"
          name="beaufort"
          value="Beaufort"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Beaufort')"
        >
        <input
          id="bibibinary"
          type="button"
          name="bibibinary"
          value="Bibi-binary"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Bibibinary')"
        >
        <input
          id="bifid"
          type="button"
          name="bifid"
          value="Bifid"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Bifid')"
        >
        <input
          id="burrowswheeler"
          type="button"
          name="burrowswheeler"
          value="Burrows-Wheeler"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Burrowswheeler')"
        >
        <input
          id="cadenus"
          type="button"
          name="cadenus"
          value="Cadenus"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Cadenus')"
        >
        <input
          id="caesar"
          type="button"
          name="caesar"
          value="Caesar"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Caesar')"
        >
        <input
          id="chaocipher"
          type="button"
          name="chaocipher"
          value="Chaocipher"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Chaocipher')"
        >
        <input
          id="colloncipher"
          type="button"
          name="colloncipher"
          value="Collon"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Collon')"
        >
        <input
          id="columnartransposition"
          type="button"
          name="columnartransposition"
          value="Columnar Transposition"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Columnartransposition')"
        >
        <input
          id="condi"
          type="button"
          name="condi"
          value="Condi"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Condi')"
        >
        <input
          id="digrafid"
          type="button"
          name="digrafid"
          value="Digrafid"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Digrafid')"
        >
        <input
          id="foursquare"
          type="button"
          name="foursquare"
          value="Foursquare"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Foursquare')"
        >
        <input
          id="gcid"
          type="button"
          name="gcid"
          value="Geocache ID"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('GCId')"
        >
        <input
          id="goldbug"
          type="button"
          name="goldbug"
          value="Goldbug"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Goldbug')"
        >
        <input
          id="gromark"
          type="button"
          name="gromark"
          value="Gromark"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Gromark')"
        >
        <input
          id="gronsfeld"
          type="button"
          name="gronsfeld"
          value="Gronsfeld"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Gronsfeld')"
        >
        <input
          id="vatsyayana"
          type="button"
          name="vatsyayana"
          value="Kamasutra"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Vatsyayana')"
        >
        <input
          id="kennycode"
          type="button"
          name="kennycode"
          value="Kenny code"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Kennycode')"
        >
        <input
          id="monomedinome"
          type="button"
          name="monomedinome"
          value="Monome-dinome"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Monomedinome')"
        >
        <input
          id="morbit"
          type="button"
          name="morbit"
          value="Morbit"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Morbit')"
        >
        <input
          id="morse"
          type="button"
          name="morse"
          value="Morse"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Morse')"
        >
        <input
          id="myszkowski"
          type="button"
          name="myszkowski"
          value="Myszkowski"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Myszkowski')"
        >
        <input
          id="nicodemus"
          type="button"
          name="nicodemus"
          value="Nicodemus"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Nicodemus')"
        >
        <input
          id="nihilist"
          type="button"
          name="nihilist"
          value="Nihilist"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Nihilist')"
        >
        <input
          id="nihilisttransposition"
          type="button"
          name="nihilisttransposition"
          value="Nihilist transposition"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Nihilisttransposition')"
        >
        <input
          id="onetimepad"
          type="button"
          name="onetimepad"
          value="One time pad"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Onetimepad')"
        >
        <input
          id="phillips"
          type="button"
          name="phillips"
          value="Phillips"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Phillips')"
        >
        <input
          id="playfair"
          type="button"
          name="playfair"
          value="Playfair"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Playfair')"
        >
        <input
          id="pollux"
          type="button"
          name="pollux"
          value="Pollux"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Pollux')"
        >
        <input
          id="polybius"
          type="button"
          name="polybius"
          value="Polybius"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Polybius')"
        >
        <input
          id="porta"
          type="button"
          name="porta"
          value="Porta"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Porta')"
        >
        <input
          id="portax"
          type="button"
          name="portax"
          value="Portax"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Portax')"
        >
        <input
          id="ragbaby"
          type="button"
          name="ragbaby"
          value="Ragbaby"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Ragbaby')"
        >
        <input
          id="railfence"
          type="button"
          name="railfence"
          value="Railfence"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Railfence')"
        >
        <input
          id="redefence"
          type="button"
          name="redefence"
          value="Redefence"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Redefence')"
        >
        <input
          id="reverse"
          type="button"
          name="reverse"
          value="Reverse"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Reverse')"
        >
        <input
          id="reversewords"
          type="button"
          name="reversewords"
          value="Reverse words"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Reversewords')"
        >
        <input
          id="rot5"
          type="button"
          name="rot5"
          value="ROT5"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('ROT5')"
        >
        <input
          id="rot13"
          type="button"
          name="rot13"
          value="ROT13"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('ROT13')"
        >
        <input
          id="rot47"
          type="button"
          name="rot47"
          value="ROT47"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('ROT47')"
        >
        <input
          id="scytale"
          type="button"
          name="scytale"
          value="Scytale"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Scytale')"
        >
        <input
          id="skip"
          type="button"
          name="skip"
          value="Skip"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Skip')"
        >
        <input
          id="substitution"
          type="button"
          name="substitution"
          value="Substitution"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Substitution')"
        >
        <input
          id="syllabary"
          type="button"
          name="syllabary"
          value="Syllabary"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Syllabary')"
        >
        <input
          id="tapir"
          type="button"
          name="tapir"
          value="Tapir"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Tapir')"
        >
        <input
          id="trifid"
          type="button"
          name="trifid"
          value="Trifid"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Trifid')"
        >
        <input
          id="trisquare"
          type="button"
          name="trisquare"
          value="Trisquare"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Trisquare')"
        >
        <input
          id="vatsyayana"
          type="button"
          name="vatsyayana"
          value="Vatsyayana"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Vatsyayana')"
        >
        <input
          id="vigenere"
          type="button"
          name="vigenere"
          value="Vigenere"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Vigenere')"
        >
        <input
          id="zebra"
          type="button"
          name="zebra"
          value="Zebra"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Zebra')"
        >
        <input
          id="zygazyfa"
          type="button"
          name="zygazyfa"
          value="Zygazyfa"
          class="btn btn-sm btn-primary mb-2 mr-2"
          @click="changeCipher('Zygazyfa')"
        >
      </div>
      <div class="infoblock">
        {{ explanation }}
      </div>
      <div
        v-show="showalphabet"
        class="form-inline"
      >
        <label
          class="form-label mb-2 mr-2"
          for="alphabet"
        >Alphabet</label>
        <input
          id="alphabet"
          ref="alphabet"
          v-model="alphabet"
          type="text"
          name="alphabet"
          size="52"
          class="form-control mr-2 mb-2"
        >
        <div v-show="showgenalphabet">
          <input
            id="show-modal"
            type="button"
            name="show-modal"
            :value="$t('cp.genalp')"
            class="btn btn-primary mb-2"
            @click="showModal = true"
          >
          <v-polybius
            v-if="showModal"
            v-model:polybiussquare="alphabet"
            @close="showModal = false"
          />
        </div>
      </div>
      <div
        v-show="showkey1"
        class="form-inline"
      >
        <label
          class="form-label mb-2 mr-2"
          for="key1"
        >{{ labelkey1 }}</label>
        <input
          id="key1"
          ref="key1"
          v-model="key1"
          type="text"
          name="key1"
          class="form-control mb-2 mr-2"
        >
        <div v-show="showgenkey1">
          <input
            id="show-modal"
            type="button"
            name="show-modal"
            :value="$t('cp.gensq')"
            class="btn btn-primary mb-2 mr-2"
            @click="showModal1 = true"
          >
          <v-polybius
            v-if="showModal1"
            v-model:polybiussquare="key1"
            @close="showModal1 = false"
          />
        </div>
      </div>
      <div
        v-show="shownumkey1"
        class="form-inline"
      >
        <label
          class="form-label mr-2 mb-2"
          for="key1"
        >{{ labelkey1 }}</label>
        <input
          id="key1"
          ref="key1"
          v-model="key1"
          type="number"
          name="key1"
          class="form-control mb-2"
        >
      </div>
      <div
        v-show="showselectkey1"
        class="form-inline"
      >
        <label
          for="key1"
          class="form-label mb-2 mr-2"
        >{{ labelkey1 }}</label>
        <select
          id="key1"
          ref="key1"
          v-model="key1"
          name="key1"
          class="custom-select mb-2"
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
        class="form-inline"
      >
        <label
          class="form-label mb-2 mr-2"
          for="key2"
        >{{ labelkey2 }}</label>
        <input
          id="key2"
          ref="key2"
          v-model="key2"
          type="text"
          name="key2"
          class="form-control mb-2 mr-2"
        >
        <div v-show="showgenkey2">
          <input
            id="show-modal"
            type="button"
            name="show-modal"
            :value="$t('cp.gensq')"
            class="btn btn-primary mb-2 mr-2"
            @click="showModal2 = true"
          >
          <v-polybius
            v-if="showModal2"
            v-model:polybiussquare="key2"
            @close="showModal2 = false"
          />
        </div>
      </div>
      <div
        v-show="shownumkey2"
        class="form-inline"
      >
        <label
          class="form-label mb-2 mr-2"
          for="key2"
        >{{ labelkey2 }}</label>
        <input
          id="key2"
          ref="key2"
          v-model="key2"
          type="number"
          name="key2"
          class="form-control mb-2"
        >
      </div>
      <div
        v-show="showselectkey2"
        class="form-inline"
      >
        <label
          for="key2"
          class="form-label mr-2 mb-2"
        >{{ labelkey2 }}</label>
        <select
          id="key2"
          ref="key2"
          v-model="key2"
          name="key2"
          class="custom-select mb-2"
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
        class="form-inline"
      >
        <label
          class="form-label mb-2 mr-2"
          for="key3"
        >{{ labelkey3 }}</label>
        <input
          id="key3"
          ref="key3"
          v-model="key3"
          type="text"
          name="key3"
          class="form-control mb-2 mr-2"
        >
        <div v-show="showgenkey3">
          <input
            id="show-modal"
            type="button"
            name="show-modal"
            :value="$t('cp.gensq')"
            class="btn btn-primary mb-2 mr-2"
            @click="showModal3 = true"
          >
          <v-polybius
            v-if="showModal3"
            v-model:polybiussquare="key3"
            @close="showModal3 = false"
          />
        </div>
      </div>
      <div
        v-show="shownumkey3"
        class="form-inline"
      >
        <label
          class="form-label mr-2 mb-2"
          for="key3"
        >{{ labelkey3 }}</label>
        <input
          id="key3"
          ref="key3"
          v-model="key3"
          type="number"
          name="key3"
          class="form-control mb-2"
        >
      </div>
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <div class="row">
        <div class="col-6">
          <input
            id="encode"
            type="button"
            name="encode"
            :value="$t('buttons.encode')"
            class="btn btn-primary mb-2"
            @click="toEncode"
          >
          <div class="form-row mb-2">
            <textarea
              id="message"
              ref="message"
              v-model="message"
              name="message"
              class="form-control"
              :placeholder="$t('labels.message')"
              rows="10"
              cols="50"
            />
          </div>
          <div>
            <input
              id="uppercase"
              type="button"
              name="uppercase"
              :value="$t('cp.toupper')"
              class="btn btn-primary mr-2 mb-2"
              @click="convertUpper"
            >
            <input
              id="remove"
              type="button"
              name="remove"
              :value="$t('cp.remnonalp')"
              class="btn btn-primary mb-2"
              @click="removeUnknown"
            >
          </div>
          <div
            v-show="showreplacements"
            class="form-inline"
          >
            <input
              id="replace"
              type="button"
              :value="$t('cp.repl')"
              class="btn btn-primary mr-2 mb-2"
              @click="replaceCharacters"
            >
            <input
              id="replacements"
              v-model="replacements"
              type="text"
              placeholder="J=I, U=V"
              size="12"
              class="form-control mb-2"
            >
          </div>
          <div>
            <input
              id="replacediac"
              type="button"
              :value="$t('txtwordval.replacediac')"
              class="btn btn-primary mb-2"
              @click="removeDiacr"
            >
          </div>
        </div>
        <div class="col-6">
          <input
            id="decode"
            type="button"
            name="decode"
            :value="$t('buttons.decode')"
            class="btn btn-primary mb-2"
            @click="toDecode"
          >
          <div class="form-row mb-2">
            <textarea
              id="translatedmessage"
              ref="translatedmessage"
              v-model="translatedmessage"
              name="translatedmessage"
              class="form-control"
              :placeholder="$t('cp.phencmsg')"
              cols="50"
              rows="10"
            />
          </div>
          <div class="form-inline">
            <input
              id="format"
              type="button"
              name="format"
              :value="$t('buttons.format')"
              class="btn btn-primary mb-2 mr-2"
              @click="formatMessage"
            >
            <label
              class="form-label mb-2 mr-2"
              for="separator"
            >{{ $t('cp.sep') }}</label>
            <select
              id="separator"
              ref="separator"
              v-model="separator"
              name="separator"
              class="custom-select mb-2"
            >
              <option />
              <option>-</option>
              <option>/</option>
            </select>
          </div>
          <div class="form-inline">
            <label
              class="form-label mb-2 mr-2"
              for="blocksize"
            >{{ $t('cp.bs') }}</label>
            <input
              id="blocksize"
              ref="blocksize"
              v-model="blocksize"
              type="number"
              name="blocksize"
              min="1"
              max="9"
              class="form-control mb-2"
            >
          </div>
          <input
            id="unformat"
            type="button"
            name="unformat"
            :value="$t('cp.remform')"
            class="btn btn-primary mb-2"
            @click="unformatMessage"
          >
        </div>
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
      message: "",
      translatedmessage: "",
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

  mounted: function() {
    if (this.$route.params.initcipher)
      this.changeCipher(this.$route.params.initcipher);
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
      this.errormsg = "";
      let data = {
        alphabet: this.alphabet,
        removeunknown: this.removeunknown,
        replacements: this.replacements,
        cipher: this.cipher,
        enordecode: 'decode',
        message: this.message.trim(),
        transmessage: this.translatedmessage.trim(),
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
      this.errormsg = "";
      let data = {
          alphabet: this.alphabet,
          removeunknown: this.removeunknown,
          replacements: this.replacements,
          cipher: this.cipher,
          enordecode: 'encode',
          message: this.message.trim(),
          transmessage: this.translatedmessage.trim(),
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
        case 'Atomtom' :
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
        case 'Syllabary' :
          this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
          this.showkey1 = true;
          this.key1 = "KEY",
          this.showkey2 = true;
          this.key2 = "0123456789";
          this.showkey3 = true;
          this.key3 = "0123456789";
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
        for (let a of arr)
          this.message = this.message.replace(new RegExp(a[0], "g"), a[2]);

    }
  },
}
</script>

