<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container p-4">
          <div class="modal-header">
            <slot name="header">
              <h2>{{ $t('dialogpb.title') }}</h2>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <div class="row me-2">
                <div class="row mb-2">
                  <label
                    class="form-label sm-size"
                    for="startalphabet"
                  >{{ $t('dialogpb.start') }}</label>
                  <select
                    id="startalphabet"
                    v-model="startalphabet"
                    class="form-select lg-size"
                    @change="genCleanSquare"
                  >
                    <option value="ABCDEFGHIKLMNOPQRSTUVWXYZ">
                      ABCDEFGHIKLMNOPQRSTUVWXYZ
                    </option>
                    <option value="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789">
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
                    </option>
                    <option value="A1B2C3D4E5F6G7H8I9J0KLMNOPQRSTUVWXYZ">
                      A1B2C3D4E5F6G7H8I9J0KLMNOPQRSTUVWXYZ
                    </option>
                  </select>
                </div>
                <div class="col-8">
                  <div class="row mb-2">
                    <label
                      class="form-label sm-size"
                      for="key1"
                    >{{ $t('dialogpb.key') }}</label>
                    <input
                      id="key"
                      v-model="key"
                      type="text"
                      class="form-control md-size"
                      @input="genSquare"
                    >
                  </div>
                  <div class="row mb-2">
                    <label
                      class="form-label sm-size"
                      for="direction"
                    >{{ $t('dialogpb.dir') }}</label>
                    <select
                      id="direction"
                      v-model="dir"
                      class="form-select md-size"
                      @change="genSquare"
                    >
                      <option value="HOR">
                        {{ $t('dialogpb.d.hor') }}
                      </option>
                      <option value="VER">
                        {{ $t('dialogpb.d.ver') }}
                      </option>
                      <option value="DIAH">
                        {{ $t('dialogpb.d.diah') }}
                      </option>
                      <option value="DIAV">
                        {{ $t('dialogpb.d.diav') }}
                      </option>
                      <option value="SI">
                        {{ $t('dialogpb.d.si') }}
                      </option>
                    </select>
                  </div>
                  <div class="row mb-2">
                    <label
                      class="form-label sm-size"
                      for="start"
                    >{{ $t('dialogpb.corner') }}</label>
                    <select
                      id="start"
                      v-model="start"
                      class="form-select md-size"
                      @change="genSquare"
                    >
                      <option value="TL">
                        {{ $t('dialogpb.c.tl') }}
                      </option>
                      <option value="TR">
                        {{ $t('dialogpb.c.tr') }}
                      </option>
                      <option value="BL">
                        {{ $t('dialogpb.c.bl') }}
                      </option>
                      <option value="BR">
                        {{ $t('dialogpb.c.br') }}
                      </option>
                    </select>
                  </div>
                  <div class="form-inline mb-2">
                    <div class="form-check">
                      <input
                        id="flip"
                        v-model="flip"
                        type="checkbox"
                        class="form-check-input ms-2"
                        @change="genSquare"
                      >
                      <label
                        for="flip"
                        class="form-check-label ms-2"
                      >{{ $t('dialogpb.flip') }}</label>
                    </div>
                  </div>
                </div>
                <div
                  id="thesquare"
                  class="col-4"
                >
                  <div
                    v-for="l in squaredisp"
                    :key="l"
                  >
                    {{ l }}<br>
                  </div>
                </div>
              </div>
            </slot>
          </div>

          <div class="modal-footer mt-2">
            <p
              v-show="error"
              class="errormsg me-2"
            >
              {{ errormsg }}
            </p>
            <slot name="footer">
              <input
                id="reset"
                type="button"
                :value="$t('buttons.reset')"
                class="btn me-2"
                @click="genReset"
              >
              <button
                class="btn me-2"
                @click="$emit('close')"
              >
                {{ $t('buttons.cancel') }}
              </button>
              <button
                class="btn"
                @click="closeModal()"
              >
                {{ $t('buttons.save') }}
              </button>
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

  props: {
    polybiussquare: {
      type: String,
      required: true
    }
  },
  
  emits: [
    'close',
    'update:polybiussquare'
  ],

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

    // Generate first square
    this.genSquare();

  },

  methods: {

    // Help function to create a square with various options, default is the
    // default Polybius square. Returns a string
    fillSquare: function  () {

      // Initialize variables
      let text = this.alphabet;
      let dir = this.dir;
      let c = this.start;
      let flip = this.flip;
      let corners = ["TL", "TR", "BR", "BL"];
      let loop = 0;
      let ct = "";      
      let idx = 0;
      let fliprow = flip;
      let sq = [];
      
      // Get size of square
      let size = Math.floor(Math.sqrt(text.length));

      // Initalize the square
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
          corners = ["TL", "TR", "BR", "BL"];
          loop = 0;
          ct = "";
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
          // Do nothing

      }
      // end switch statement

      // Output square as a string
      let s = "";
      for (let i = 0; i < size; i++)
        for (let j = 0; j < size; j++) s += sq[i][j];
          return s;

    },

    genAlphabet() {

      // Generate the alphabet from the starting alphabet and the given key
      var s = "";

      // Get all the unique letters from the key, but only if they also exist in square
      for (let c of this.key) {
          if (s.indexOf(c) < 0 && this.startalphabet.indexOf(c) >= 0) s += c;
      }

      //  Add the remaining unique letters
      for (let c of this.startalphabet) {
          if (s.indexOf(c) < 0) s += c;
      }

      return s;
    },

    genReset () {

      // Reset the square and all defaults
      this.start = "TL";
      this.dir = "HOR";
      this.flip = false;
      this.alphabet = this.startalphabet;

    },

    genSquare() {

      // Check if we have a valid alphabet
      let len = Math.sqrt(this.alphabet.length);
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

      // Regenerate the square from the starting alphabet
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

</script>

<style scoped>

</style>
