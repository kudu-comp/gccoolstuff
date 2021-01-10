<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <h2>{{$t('dialogpb.title')}}</h2>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <div class="row mr-2">
                <div class="form-inline mb-2">
                  <label class="form-label" for="startalphabet">{{$t('dialogpb.start')}}</label>
                  <select id="startalphabet" class="custom-select" v-model="startalphabet" @change="genCleanSquare">
                    <option value="ABCDEFGHIKLMNOPQRSTUVWXYZ">ABCDEFGHIKLMNOPQRSTUVWXYZ</option>
                    <option value="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789">ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789</option>
                    <option value="A1B2C3D4E5F6G7H8I9J0KLMNOPQRSTUVWXYZ">A1B2C3D4E5F6G7H8I9J0KLMNOPQRSTUVWXYZ</option>
                  </select>
                </div>
                <div class="col-8">
                  <div class="form-inline mb-2">
                    <label class="form-label" for="key1">{{$t('dialogpb.key')}}</label>
                    <input type='text' id="key" v-model="key" class="form-control ml-2" @input="genSquare">
                  </div>
                  <div class="form-inline mb-2">
                    <label class="form-label" for="direction">{{$t('dialogpb.dir')}}</label>
                    <select id="direction" class="custom-select ml-2" v-model="dir" @change="genSquare">
                      <option value="HOR">{{$t('dialogpb.d.hor')}}</option>
                      <option value="VER">{{$t('dialogpb.d.ver')}}</option>
                      <option value="DIAH">{{$t('dialogpb.d.diah')}}</option>
                      <option value="DIAV">{{$t('dialogpb.d.diav')}}</option>
                      <option value="SI">{{$t('dialogpb.d.si')}}</option>
                    </select>
                  </div>
                  <div class="form-inline mb-2">
                    <label class="form-label" for="start">{{$t('dialogpb.corner')}}</label>
                    <select id="start" class="custom-select ml-2" v-model="start" @change="genSquare">
                      <option value="TL">{{$t('dialogpb.c.tl')}}</option>
                      <option value="TR">{{$t('dialogpb.c.tr')}}</option>
                      <option value="BL">{{$t('dialogpb.c.bl')}}</option>
                      <option value="BR">{{$t('dialogpb.c.br')}}</option>
                    </select>
                  </div>
                  <div class="form-inline mb-2">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" id="flip" v-model="flip" class="custom-control-input ml-2" @change="genSquare">
                      <label for="flip" class="custom-control-label ml-2">{{$t('dialogpb.flip')}}</label>
                    </div>
                  </div>
                </div>
                <div id="thesquare" class="col-4">
                  <div v-for="l in squaredisp" :key="l">{{l}}<br></div>
                </div>
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <p class="errormsg mr-2" v-show="error">{{errormsg}}</p>
            <slot name="footer">
              <input type="button" id="reset" :value="$t('buttons.reset')" class="btn btn-secondary ml-2" v-on:click="genReset">
              <button class="btn btn-secondary" @click="$emit('close')">{{$t('buttons.cancel')}}</button>
              <button class="btn btn-primary" @click="closeModal()">{{$t('buttons.save')}}</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: "VPolybius",
  props: ['polybiussquare'],
  data() {
    return {
      startalphabet: "",
      alphabet: "",
      key: "",
      dir: "HOR",
      start: "TL",
      flip: false,
      squarestr: "",
      squaredisp: [],
      error: false,
      errormsg: ""
    };
  },

  mounted: function() {
    // Start with the given alphabet
    this.alphabet = this.polybiussquare;
    this.startalphabet = this.polybiussquare;
    if (!this.startalphabet) {
      this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
      this.startalphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    }
    this.genSquare();
  },

  methods: {

    // Help function to create a square with various options, default is the default Polybius square
    // returns a string
    fillSquare: function  () {

      // Initialize variables
      var text = this.alphabet;
      var dir = this.dir;
      var c = this.start;
      var flip = this.flip;

      // Get size of square
      var size = Math.floor(Math.sqrt(text.length));

      // Initialize all variables
      var idx = 0;
      var fliprow = flip;
      var sq = [];
      for (let i = 0; i < size; i++) {
        sq.push([]);
        for (let j = 0; j <= i; j++) {
          sq[i].push('X');
        }
      }

      switch (dir) {

        case "DIAH" :
          for (let i = 0; i < size; i++) {
            for (let j = 0; j <= i; j++) {
              if (!fliprow) {
                if (c == "TL") sq[j][i-j] = text[idx++];
                if (c == "TR") sq[j][size - i - 1 + j] = text[idx++];
                if (c == "BL") sq[size - j - 1][i - j] = text[idx++];
                if (c == "BR") sq[size - 1 - j][size - i - 1 + j] = text[idx++];
              } else {
                if (c == "TL") sq[i-j][j] = text[idx++];
                if (c == "BL") sq[size - i - 1 + j][j] = text[idx++];
                if (c == "TR") sq[i - j][size - j - 1] = text[idx++];
                if (c == "BR") sq[size - i - 1 + j][size - 1 - j] = text[idx++];
              }
            }
            if (flip) fliprow = !fliprow;
          }

          for (let i = 1; i < size; i++) {
            for (let j = 0; j < size - i; j++) {
              if (!fliprow) {
                if (c == "TL") sq[i+j][size-j-1] = text[idx++];
                if (c == "TR") sq[i+j][j] = text[idx++];
                if (c == "BL") sq[size - i - 1 - j][size - j - 1] = text[idx++];
                if (c == "BR") sq[size - i - 1 - j][j] = text[idx++];
              } else {
                if (c == "TL") sq[size-j-1][i+j] = text[idx++];
                if (c == "BL") sq[j][i+j] = text[idx++];
                if (c == "TR") sq[size - j - 1][size - i - 1 - j] = text[idx++];
                if (c == "BR") sq[j][size - i - 1 - j] = text[idx++];
              }
            }
            if (flip) fliprow = !fliprow;
          }
          break;

        case "DIAV" :
          for (let i = 0; i < size; i++) {
            for (let j = 0; j <= i; j++) {
              if (!fliprow) {
                if (c == "TL") sq[i-j][j] = text[idx++];
                if (c == "BL") sq[size - i - 1 + j][j] = text[idx++];
                if (c == "TR") sq[i - j][size - j - 1] = text[idx++];
                if (c == "BR") sq[size - i - 1 + j][size - 1 - j] = text[idx++];
              } else {
                if (c == "TL") sq[j][i-j] = text[idx++];
                if (c == "TR") sq[j][size - i - 1 + j] = text[idx++];
                if (c == "BL") sq[size - j - 1][i - j] = text[idx++];
                if (c == "BR") sq[size - 1 - j][size - i - 1 + j] = text[idx++];
              }
            }
            if (flip) fliprow = !fliprow;
          }

          for (let i = 1; i < size; i++) {
            for (let j = 0; j < size - i; j++) {
              if (!fliprow) {
                if (c == "TL") sq[size-j-1][i+j] = text[idx++];
                if (c == "BL") sq[j][i+j] = text[idx++];
                if (c == "TR") sq[size - j - 1][size - i - 1 - j] = text[idx++];
                if (c == "BR") sq[j][size - i - 1 - j] = text[idx++];
              } else {
                if (c == "TL") sq[i+j][size-j-1] = text[idx++];
                if (c == "TR") sq[i+j][j] = text[idx++];
                if (c == "BL") sq[size - i - 1 - j][size - j - 1] = text[idx++];
                if (c == "BR") sq[size - i - 1 - j][j] = text[idx++];
              }
            }
            if (flip) fliprow = !fliprow;
          }
          break;

        case "HOR" :
          for (let i = 0; i < size; i++) {
            if (flip) fliprow = !fliprow;
            for (let j = 0; j < size; j++) {
              if (!fliprow) {
                if (c == "TL") sq[i][j] = text[idx++];
                if (c == "TR") sq[i][size - j - 1] = text[idx++];
                if (c == "BL") sq[size - i - 1][j] = text[idx++];
                if (c == "BR") sq[size - i - 1][size - j - 1] = text[idx++];
              } else {
                if (c == "TL") sq[i][size - j - 1] = text[idx++];
                if (c == "TR") sq[i][j] = text[idx++];
                if (c == "BL") sq[size - i - 1][size - j - 1] = text[idx++];
                if (c == "BR") sq[size - i - 1][j] = text[idx++];
              }
            }
          }
          break;

        case "VER" :
          for (let i = 0; i < size; i++) {
            if (flip) fliprow = !fliprow;
            for (let j = 0; j < size; j++) {
              if (!fliprow) {
                if (c == "TL") sq[j][i] = text[idx++];
                if (c == "TR") sq[j][size - i - 1] = text[idx++];
                if (c == "BL") sq[size - j - 1][i] = text[idx++];
                if (c == "BR") sq[size - j - 1][size - i - 1] = text[idx++];
              } else {
                if (c == "TL") sq[size - j - 1][i] = text[idx++];
                if (c == "TR") sq[size - j - 1][size - i - 1] = text[idx++];
                if (c == "BL") sq[j][i] = text[idx++];
                if (c == "BR") sq[j][size - i - 1] = text[idx++];
              }
            }
          }
          break;

        case "SI" :
          // Spiral inwards start at specified corner and rotate towards center
          var corners = ["TL", "TR", "BR", "BL"];
          var loop = 0;
          var ct = "";
          if (!flip) {

            //Clockwise
            for (let i = size - 1; i >= 0; i -=2) {
              for (let cs = 0; cs < 4; cs++) {
                ct = corners [(cs + corners.indexOf(c)) % 4];
                for (let j = 0; j < i; j++) {
                  //echo ct, $i, j, "\tLoop:", loop, "\n";
                  if (ct == "TL") sq[size - i - 1 - loop][j + loop] = text[idx++];
                  if (ct == "TR") sq[j+loop][i + loop] = text[idx++];
                  if (ct == "BR") sq[i + loop][size - j - 1 - loop] = text[idx++];
                  if (ct == "BL") sq[size - j - 1 - loop][size - i - 1 - loop] = text[idx++];
                }
              }
              loop++;
            }
            if (size % 2 == 1) sq[Math.floor(size / 2)][Math.floor(size / 2)] = text[idx++];

          } else {

            // Counterclockwise
            corners = ["TL", "BL", "BR", "TR"];
            for (let i = size - 1; i >= 0; i -=2) {
              for (let cs = 0; cs < 4; cs++) {
                ct = corners [(cs + corners.indexOf(c)) % 4];
                for (let j = 0; j < i; j++) {
                  if (ct == "TL") sq[j + loop][size - i - 1 - loop] = text[idx++];
                  if (ct == "BL") sq[i + loop][j + loop] = text[idx++];
                  if (ct == "BR") sq[size - j - 1 - loop][size - 1 - loop] = text[idx++];
                  if (ct == "TR") sq[size - i - 1 - loop][size - j - 1 - loop] = text[idx++];
                }
              }
              loop++;
            }
            if (size % 2 == 1) sq[Math.floor(size / 2)][Math.floor(size / 2)] = text[idx++];
          }
          break;

        default :
          // Will return the pre filled square with X's
      }
      // end switch statement

      // Output square as a string
      var s = "";
      for (let i = 0; i < size; i++)
        for (let j = 0; j < size; j++) s += sq[i][j];
          return s;

    },

    genAlphabet() {
      // Generate the alphabet from the starting alphabet and the given key
      var s = "";

      // Get all the letters from the key, but only if they also exist in square
      for (let c of this.key) {
          if (s.indexOf(c) < 0 && this.startalphabet.indexOf(c) >= 0) s += c;
      }

      //  Add the remaining letters
      for (let c of this.startalphabet) {
          if (s.indexOf(c) < 0) s += c;
      }

      return s;
    },

    genReset () {
      this.start = "TL";
      this.dir = "HOR";
      this.flip = false;
      this.alphabet = this.startalphabet;
    },

    genSquare() {

      // Check if we have a valid alphabet
      var len = Math.sqrt(this.alphabet.length);
      if (this.alphabet.length % len != 0) {
        this.error=true;
        this.errormsg="Alphabet must be 25 or 36 characters";
        return;
      }

      // Here comes the code to generate the square
      this.alphabet = this.genAlphabet();
      this.alphabet = this.fillSquare();

      // Display the square in rows
      this.squaredisp = [];
      for (let i = 0; i < len; i++) {
        this.squaredisp.push(this.alphabet.substr(i*len, len));
      }
    },

    genCleanSquare() {
      this.alphabet = this.startalphabet;
      this.genSquare();
    },

    closeModal() {

      // Sent event to update the value of the associated input
      this.$emit ('update:polybiussquare', this.alphabet);
      // Close the modal window
      this.$emit ('close')
    },

  }
};

// https://css-tricks.com/considerations-styling-modal/ styling to be added

</script>

<style scoped>

#thesquare {
  padding: 4px 4px 4px 4px;
  text-align: center;
  font-family: monospace;
  font-size: 1.5em;
  border-style: solid;
  border-color: #785E31;
  border-width: thin;
  border-radius: 5px;
}

.modal-mask {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9998;
  width: 600px;
  max-width: 100%;
  background-color: #E6C128;
}

.modal-container {
  color: #815E22;
}

.modal-header {
  color: #2E1E03;
}

</style>
