<template>
<div>
    <div class="masthead">
      <div class="container h-100">
        <div class="row h-100 align-items-center">
          <div class="col-12 text-center">
            <h1 class="font-weight-heavy">Encode or decode</h1>
            <h2 class="font-weight-heavy">{{cipher}}</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="mainpage">
      <div class="container h-100 py-5">
        <div class="form-inline mb-2">
          <input type="button" id="adfgxv" name="adfgxv" value="ADFGX(V)" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('ADFGVX')">
          <input type="button" id="affine" name="affine" value="Affine" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Affine')">
          <input type="button" id="atbash" name="atbash" value="Atbash" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Atbash')">
          <input type="button" id="base91" name="base91" value="Base91" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Base91')">
          <input type="button" id="bazeries" name="bazeries" value="Bazeries" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Bazeries')">
          <input type="button" id="bibibinary" name="bibibinary" value="Bibi-binary" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Bibibinary')">
          <input type="button" id="bifid" name="bifid" value="Bifid" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Bifid')">
          <input type="button" id="burrowswheeler" name="burrowswheeler" value="Burrows-Wheeler" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Burrowswheeler')">
          <input type="button" id="cadenus" name="cadenus" value="Cadenus" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Cadenus')">
          <input type="button" id="caesar" name="caesar" value="Caesar" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Caesar')">
          <input type="button" id="kennycode" name="kennycode" value="Kenny code" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Kennycode')">
          <input type="button" id="monomedinome" name="monomedinome" value="Monome-dinome" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Monomedinome')">
          <input type="button" id="nicodemus" name="nicodemus" value="Nicodemus" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Nicodemus')">
          <input type="button" id="nihilist" name="nihilist" value="Nihilist" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Nihilist')">
          <input type="button" id="playfair" name="playfair" value="Playfair" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Playfair')">
          <input type="button" id="polybius" name="polybius" value="Polybius" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Polybius')">
          <input type="button" id="vigenere" name="vigenere" value="Vigenere" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Vigenere')">
          <input type="button" id="zygazyfa" name="zygazyfa" value="Zygazyfa" class="btn btn-primary mb-2 mr-2" v-on:click="changeCipher('Zygazyfa')">
        </div>
        <div class="card mb-2">
          <p id="explanation" class="card-body">{{explanation}}</p>
        </div>
        <div class="card p-2 mb-2">
            <div class="form-inline mb-2">
              <label class="form-label col-2" for="alphabet">Alphabet</label>
              <input type='text' id="alphabet" name="alphabet" ref="alphabet" v-model="alphabet" size="52" class="form-control ml-2">
            </div>
            <div class="form-inline mb-2" v-show="showkey1">
              <label class="form-label col-2" for="key1">{{labelkey1}}</label>
              <input type='text' id="key1" name="key1" ref="key1" v-model="key1" class="form-control ml-2">
            </div>
            <div class="form-inline mb-2" v-show="shownumkey1">
              <label class="form-label col-2" for="key1">{{labelkey1}}</label>
              <input type='number' id="key1" name="key1" ref="key1" v-model="key1" class="form-control ml-2">
            </div>
            <div class="form-inline mb-2" v-show="showkey2">
              <label class="form-label col-2" for="key1">{{labelkey2}}</label>
              <input type='text' id="key2" name="key2" ref="key2" v-model="key2" class="form-control ml-2">
            </div>
            <div class="form-inline mb-2" v-show="shownumkey2">
              <label class="form-label col-2" for="key1">{{labelkey2}}</label>
              <input type='number' id="key2" name="key2" ref="key2" v-model="key2" class="form-control ml-2">
            </div>
        </div>
        <div class="row">
          <div class="col-5">
            <input type="button" id="encode" name="encode" value="Encode" class="btn btn-primary mb-2 mr-2" :disabled="btnEncodeDisable" v-on:click="toEncode">
            <div class="form-group">
              <textarea id="message" name="message" class="form-control" ref="message" placeholder="Message" rows=10 cols=50 v-model='message'></textarea>
            </div>
            <input type="button" id="uppercase" name="uppercase" value="Convert to Uppercase" class="btn btn-primary mb-2 mr-2" v-on:click="convertUpper">
            <input type="button" id="remove" name="remove" value="Remove unknown characters" class="btn btn-primary mb-2 mr-2" v-on:click="removeUnknown">
            <div class="form-inline mb-2" v-show="showreplacements">
              <input type="button" id="replace" name="replace" value="Replace" class="btn btn-primary mr-2" v-on:click="replaceCharacters">
              <input type='text' id="replacements" name="replacements" ref="replacements" placeholder="J=I, U=V" v-model="replacements" size="12" class="form-control ml-2">
            </div>
          </div>
          <div class="col-5">
            <input type="button" id="decode" name="decode" value="Decode" class="btn btn-primary mb-2 mr-2" :disabled="btnDecodeDisable" @click="toDecode">
            <div class="form-group">
              <textarea id="translatedmessage" name="translatedmessage" class="form-control" ref="translatedmessage" placeholder="Translation" cols=50 rows=10 v-model='translatedmessage'></textarea>
            </div>
            <input type="button" id="format" name="format" value="Format" class="btn btn-primary mb-2 mr-2" v-on:click="formatMessage">
            <label class="form-label" for="separator">Separator</label>
            <select id="separator" name="separator" ref="separator" v-model="separator" class="ml-2">
              <option> </option>
              <option>-</option>
              <option>/</option>
            </select>
            <label class="form-label" for="blocksize">Block size</label>
            <input type='number' id="blocksize" name="blocksize" ref="blocksize" v-model="blocksize" min="1" max="9" class="ml-2">
            <input type="button" id="unformat" name="unformat" value="Remove format" class="btn btn-primary mb-2 mr-2" v-on:click="unformatMessage">
          </div>
        </div>
        <p v-show="error" class="errormsg">Er is iets fout gegaan.</p>
      </div>
    </div>
    <footer>
      <p class="text-center"> &copy; 2020 Aernout Koolen</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data: function () {
    return {
      title: "Geocaching cool stuff",
      message: "",
      translatedmessage: "",
      btnDecodeDisable: false,
      btnEncodeDisable: false,
      error: false,
      separator: ' ',
      blocksize: 5,
      cipher: '',
      showalphabet: true,
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      showreplacements: true,
      replacements: '',
      shownumkey1: false,
      showkey1: false,
      labelkey1: '',
      key1: '',
      shownumkey2: false,
      showkey2: false,
      labelkey2: '',
      key2: '',
      explanation: 'Some info on this cipher',
      phpurl: "http:\\\\192.168.1.202\\encoderdecoder.php",
    }
  },
  mounted: function() {
    this.message = "";
    this.translatedmessage = "";
    this.$refs.message.focus();
    this.changeCipher("Atbash");
  },
  methods: {
    toDecode: function() {
        this.error = false;
        let data = {
            alphabet: this.alphabet,
            replacements: this.replacements,
            cipher: this.cipher,
            enordecode: 'decode',
            message: this.message,
            transmessage: this.translatedmessage,
            key1: this.key1,
            key2: this.key2
        };
        //console.log (JSON.stringify(data));
        fetch(this.phpurl, {
            method: 'POST',
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => {
              this.message = data.message;
              console.log('Success', data)
          })
          .catch((error) => {
              console.error('Error ', error);
              this.error = true;
          });
    },
    toEncode: function() {
        this.error = false;
        let data = {
            alphabet: this.alphabet,
            replacements: this.replacements,
            cipher: this.cipher,
            enordecode: 'encode',
            message: this.message,
            transmessage: this.translatedmessage,
            key1: this.key1,
            key2: this.key2
        };
        //console.log (JSON.stringify(data));
        fetch(this.phpurl, {
            method: 'POST',
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => {
              this.translatedmessage = data.transmessage;
              console.log('Success', data)
          })
          .catch((error) => {
              console.error('Error ', error);
              this.error = true;
          });
    },
    changeCipher: function(newcipher) {
        this.cipher = newcipher;
        this.showalphabet = true;
        this.alphabet = "ABCDEFGHIJKKLMNOPQRSTUVWXYZ";
        this.showreplacements = true;
        this.showkey1 = false;
        this.shownumkey1 = false;
        this.showkey2 = false;
        this.shownumkey2 = false;
        this.explanation = "No info on this cipher";
        switch (this.cipher) {
            case 'Bifid' :
            case 'Vigenere' :
                this.showkey1 = true;
                this.key1 = '';
                this.labelkey1 = "Enter key:";
                break;
            case 'ADFGVX':
                this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                this.showkey1 = true;
                this.key1 = "";
                this.labelkey1 = "Column transposition key:";
                this.explanation = 'The ADFGX(V) cipher is Polybius cipher. A 5x5 or 6x6 square is used. The result is fractionated and the columns are transposed using the key.'
                break;
            case 'Affine':
                this.shownumkey1 = true;
                this.key1 = 5;
                this.labelkey1 = "A (greater than 1):";
                this.shownumkey2 = true;
                this.key2 = 5;
                this.labelkey2 = "B (greater than 0):";
                this.explanation = 'The Affine cipher is a substitution cipher. It uses the function ax + b to calculate the ciphered text. The value of A must be coprime with the length of the alphabet.'
                break;
            case 'Atbash':
                this.explanation = 'Atbash is a very simpel cipher where each letter is replaced with the one in the reversed alphabet, so A=Z, B=Y ...'
                break;
            case 'Base91':
                this.explanation = 'Base 91 is advanced method for encoding binary data as ASCII. It is similar to UUencode or base64 but more efficient.'
                break;
            case 'Bazeries' :
                this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
                this.showkey1 = true;
                this.key1 = '';
                this.labelkey1 = "Key for square 1:";
                this.showkey2 = true;
                this.key2 = '';
                this.labelkey2 = "Key for square 2:";
                this.explanation = "The Bazeries cipher is a polygraphic cipher coding 2-letters at a time. The alphabet must be a square number characters. It uses two squares. The keys are optional to generate the squares."
                break;
            case 'Bibibinary' :
                this.alphabet = "0123456789";
                this.explanation = "Bibi-binary is a numeric encoding system. It converts the number to hexadecimal and translates into something that pronounces funny. Only numbers are allowed."
                break;
            case 'Burrowswheeler' :
                this.showkey1 = true;
                this.key1 = '#';
                this.labelkey1 = "End of file character:";
                this.explanation = "The Burrow Wheeler cipher is a transposition cipher. It uses a character to indicate end-of-file. This on is mandatory"
                break;
            case 'Cadenus' :
                this.showkey1 = true;
                this.key1 = '';
                this.labelkey1 = "Enter columnar transposition key:";
                this.explanation = "The Cadenus cipher is a columnar transposition. The key both reorders columns and sets the starting point of each column. The message must be a 25 * keylength characters."
                break;
            case 'Caesar' :
                this.shownumkey1 = true;
                this.key1 = 13;
                this.labelkey1 = "Shift:";
                this.explanation = "The Caesar cipher is a classic substitution cipher. Each letter is replaced with a letter a number of positions to the right."
                break;
            case 'Kennycode':
                this.explanation = 'Kenny code is based on the mumbling of the Southpark character. Each letter is encoded with a combination of m, p and f (fff is not used).'
                break;
            case 'Monomedinome' :
                this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXZ";
                this.showkey1 = true;
                this.key1 = '';
                this.labelkey1 = "Key to reorder the alphabet:";
                this.showkey2 = true;
                this.key2 = '';
                this.labelkey2 = "Key for transposition (min 10 chars):";
                this.explanation = "The Monome-dinome cipher uses a 24 char alphabet. The first key is used to generate a 3x8 square. The second key is used to detemine the numbers for the rows and columns."
                break;
            case 'Nicodemus' :
                this.showkey1 = true;
                this.key1 = '';
                this.labelkey1 = "Key for columnar transposition and Vigenere:";
                this.explanation = "The Nicodemus cipher first uses columnar transposition with the given key. The message is then encoded with Vigenere using the same key. The result is written column by column in blocks of 5 letters."
                break;
            case 'Nihilist' :
                this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
                this.showkey1 = true;
                this.key1 = '';
                this.labelkey1 = "Key to create Polybius square:";
                this.showkey2 = true;
                this.key2 = '';
                this.labelkey2 = "Key to be added:";
                this.explanation = "The Nihilist cipher is a Polybius cipher. The first key is used to generate a 5x5 square. The second key is added to the generated numbers. The alphabet must be 25 characters and both keys are required."
                break;
            case 'Playfair' :
                this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
                this.showkey1 = true;
                this.key1 = '';
                this.labelkey1 = "Enter key:";
                this.explanation = "The Playfair cipher is a polygraphic cipher coding 2-letters at a time. The alphabet must be a square number characters. The key is optional and used to generate the square. "
                break;
            case 'Polybius' :
                this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
                this.showkey1 = true;
                this.key1 = '12345';
                this.labelkey1 = "Rows: ";
                this.showkey2 = true;
                this.key2 = '12345';
                this.labelkey2 = "Columns:";
                this.explanation = "The Polybius cipher uses a 5x5 square. The rows and columns are normally numbered 1 to 5 but this can be changes. The alphabet must be 25 characters and both keys are required."
                break;
            case 'Zygazyfa' :
                this.showkey1 = true;
                this.key1 = 'KEY';
                this.labelkey1 = "Enter key:";
                this.explanation = "The Zygazyfa cipher was created by Ray Crowther for fun. He uses it in some of his geocaches. It is a polyalphabetic cipher using a kind of autokey."
                break;
            default :
                console.log('Unknown cipher' + this.cipher);
        }
    },
    convertUpper: function() {
        this.message = this.message.toUpperCase();
    },
    removeUnknown: function() {
        var s = "";
        for (var i=0; i < this.message.length; i++)
            if (this.alphabet.indexOf(this.message[i]) >= 0) s += this.message[i];
        this.message = s;
    },
    formatMessage: function() {
      var s = "";
      for (var i = 0; i < this.translatedmessage.length; i++) {
        if ((i % this.blocksize == 0) && (i>0)) s += this.separator;
          s += this.translatedmessage[i];
      }
      if (s[s.length-1] == this.separator) s = s.slice(0, s.length-2);
      this.translatedmessage = s;
    },
    unformatMessage: function() {
      var s = "";
      var block = parseInt(this.blocksize);
      for (var i = 0; i < this.translatedmessage.length; i++)
			if ((i+1) % (block+1) != 0) s += this.translatedmessage[i];
      this.translatedmessage = s;
    },
    replaceCharacters: function () {
        var arr = this.replacements.match(/[A-Za-z]=[A-Za-z]/g);
        if (arr !== null) for (var i=0; i<arr.length; i++) {
          var s = "";
          for (var j=0; j<this.message.length; j++)
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--   background-image: url('headerbackground.png'); -->

<style>
body {
	background-color: #08541d;
	color: #8ab596;
}

.masthead {
	color: lightblue;
  height: 100vh;
  max-height: 200px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.mainpage {
	min-height: 500px;
}

.card {
	background-color: #08541d;
	color: #8ab596;
}

.card-header {
	text-align: center;
	font-size: 2.5em;
}

.errormsg {
	color: red;
}

.btn {
	background-color: yellow;
	border-color: yellow;
	color: black;
}
</style>
