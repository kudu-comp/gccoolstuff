<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('segment.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('segment.long')"
      />
      <img src="~@\assets\images\segment2.png">
      <div class="row mt-2">
        <label
          class="form-label md-size mb-2"
          for="segsize"
        >{{ $t('segment.segsize') }}</label>
        <select
          id="segsize"
          v-model="seg" 
          class="form-select md-size mb-2"
        >
          <option value="0">
            7 Segment display
          </option>
          <option value="1">
            14 Segment display
          </option>
          <option value="2">
            16 Segment display
          </option>
        </select>
      </div>
      <div class="form-check">
        <input
          id="space"
          v-model="space"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="chk1"
          class="form-check-label mb-2"
        >{{ $t('segment.space') }}</label>
      </div>
      <div class="row">
        <label
          class="form-label md-size mb-2"
          for="seginp"
        >{{ $t('segment.input') }}</label>
        <select
          id="seginp"
          v-model="inp"
          class="form-select mb-2 md-size"
        >
          <option value="1">
            {{ $t('segment.letters') }}
          </option>
          <option value="3">
            {{ $t('segment.binary') }}
          </option>
          <option value="2">
            {{ $t('segment.numeric') }}
          </option>
          <option value="4">
            {{ $t('segment.octal') }}
          </option>
          <option value="5">
            {{ $t('segment.hexa') }}
          </option>
        </select>
      </div>
      <button id="enc" class="btn mb-2 me-2" @click="encodeSeg">
        {{ $t('buttons.encode') }}
      </button>
      <button id="dec" class="btn mb-2" @click="decodeSeg">
        {{$t('buttons.decode')}}
      </button>
      <textarea
        id="message"
        ref="message"
        v-model="message"
        class="form-control mb-2"
        :placeholder="$t('labels.message')"
        rows="5"
      />
      <p
        v-show="errormsg"
        class="errormsg mt-2"
      >
        {{ errormsg }}
      </p>
      <div v-if="result" class="resultbox" v-html="result" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'SegmentCode',

  data: function () {
    return {
      message: "",
      result : "",
      errormsg: "",
      space: true,
      seg: 0,
      inp: 1,
      segdef: [
        {
          letters: ["A", "B", "C", "D", "E", "F", "G"],
          regex: "(A|B|C|D|E|F|G)",
          len: 7
        },
        {
          letters: ["A", "B", "C", "D", "E", "F", "G1", "G2", "H", "I", "J", "K", "L", "M"],
          regex: "(A|B|C|D|E|F|G1|G2|H|I|J|K|L|M)",
          len: 14
        },
        {
          letters: ["A1", "A2", "B", "C", "D1", "D2", "E", "F", "G1", "G2", "H", "I", "J", "K", "L", "M"],
          regex: "(A1|A2|B|C|D1|D2|E|F|G1|G2|H|I|J|K|L|M)",
          len: 16
        }
      ],
      mapseg: [
        ["ABCDEF",  "ABCDEFJM",     "A1A2BCD1D2EFJM",     "0"],
        ["BC", 		  "BC",					  "BC",                 "1"],
        ["ABDEG",	  "ABDEG1G2",		  "A1A2BD1D2EG1G2",     "2"],
        ["ABCDG",   "ABCDG1G2",		  "A1A2BCD1D2G1G2",     "3"],
        ["BCFG",	  "BCFG1G2", 		  "BCFG1G2",            "4"],
        ["ACDFG",	  "ACDFG1G2",		  "A1A2CD1D2FG1G2",     "5"],
        ["ACDEFG",  "ACDEFG1G2",    "A1A2CD1D2EFG1G2",    "6"],
        ["ABCF", 	  "ABCF",   			"A1A2BCF",            "7"],
        ["ABCDEFG",	"ABCDEFG1G2",   "A1A2BCD1D2EFG1G2",   "8"],
        ["ABCDFG", 	"ABCDFG1G2",    "A1A2BCD1D2FG1G2",    "9"],
        ["ABCEFG",  "ABCEFG1G2",    "A1A2BCFG1G2",        "A"],
        ["CDEFG",   "ABCDG2IL",     "A1A2BCD1D2G2IL",     "B"],
        ["DEG",     "ADEF",         "A1A2D1D2EF",         "C"],
        ["BCDEG",   "ABCDIL",       "A1A2BCD1D2IL",       "D"],
        ["ADEFG",   "ADEFG1G2",     "A1A2D1D2EFG1G2",     "E"],
        ["AEFG",    "AEFG1G2",      "A1A2EFG1G2",         "F"],
        ["ACDEF",   "ACDEFG2",      "A1A2CD1D1EFG2",      "G"],
        ["CEFG",    "BCEFG1G2",     "BCEFG1G2",           "H"],
        ["C",       "ADIL",         "A1A2D1D2IL",         "I"],
        ["BCDE",    "BCDE",         "BCD1D2E",            "J"],
        ["ACEFG",   "EFG1JK",       "EFG1JK",             "K"],
        ["DEF",     "DEF",          "D1D2EF",             "L"],
        ["ABCEF",   "BCEFHJL",      "BCEFHJL",            "M"],
        ["CEG",     "BCEFHK",       "BCEFHK",             "N"],
        ["CDEG",    "ABCDEF",       "A1A2BCD1D2EF",       "O"],
        ["ABEFG",   "ABEFG1G2",     "A1A2BEFG1G2",        "P"],
        ["ABCFG",   "ABCDEFK",      "A1A2BCD1D2EFK",      "Q"],
        ["EG",      "ABEFG1G2K",    "A1A2BEFG1G2K",       "R"],
        ["CDFG",    "ACDFG1G2HK",   "A1A2CD1D2FG1G2HK",   "S"],
        ["DEFG",    "AIL",          "A1A2IL",             "T"],
        ["CDE",     "BCDEF",        "BCD1D2EF",           "U"],
        ["BCDEF",   "EFJM",         "EFJM",               "V"],
        ["BCDEFG",  "BCEFIKM",      "BCEFIKM",            "W"],
        ["BCEFG",   "HJKM",         "HJKM",               "X"],
        ["BCDFG",   "HJL",          "HJL",                "Y"],
        ["ABDE",    "ADJM",         "A1A2D1D2JM",         "Z"],
        ["ABFG",    "ABFG1G2",      "A1A2BFG1G2",         "°"],
        ["BC", 		  "BCJ",				  "BCJ",                "1"],
        ["ABCDG",   "ABCDG2",	  	  "A1A2BCD1D2G2",       "3"],
        ["ABC", 	  "ABC",    			"A1A2BC",             "7"],
        ["ABC", 	  "AJM",    			"A1A2JM",             "7"]
        ["ABC", 	  "AJL",    			"A1A2JL",             "7"]
      ]
    }
  },

  mounted: function() {
    this.$refs.message.focus();
  },

  methods: {

    bin2Letters: function (msg) {
    
      let input = "";
      let tmp = "";
      let bins = null;
      
      // Parse input in single codes
      switch (parseInt(this.inp)) {
        case 2: // Numeric
          bins = msg.match(/[0-9]+/g);
          break;
        case 3: // Binary
          switch (this.seg) {
            case 0 :
              bins = msg.match(/[01]{7}/g); break;
            case 1 :
              bins = msg.match(/[01]{14}/g); break;
            case 2 :
              bins = msg.match(/[01]{16}/g); break;
          }
          break;
        case 4: // Octal
          bins = msg.match(/[0-7]+/g);
          break;
        case 5: // Hexa
          bins = msg.match(/[0-9A-F]+/ig);
          break;
      }

      // For each code convert to letters one at a time
      for (let s of bins) {

        switch (parseInt(this.inp)) {
          case 2: // Numeric
            s = parseInt(s,10).toString(2).padStart(this.segdef[this.seg].len, '0');
            break;
          case 4: // Octal
            s = parseInt(s,8).toString(2).padStart(this.segdef[this.seg].len, '0');
            break;
          case 5: // Hexa
            s = parseInt(s,16).toString(2).padStart(this.segdef[this.seg].len, '0');
            break;
        }
      
        let tmp = "";
        for (let c = 0; c < s.length; c++) {
          if (s[c] == 1)  tmp += this.segdef[this.seg].letters[c];
        }
        tmp += " ";
        if (tmp === " " & this.space && this.inp !== 1) {
          input += "SPACE ";
        } else {
          input += tmp;
        }
      }

      return input.slice(0,-1);
      
    },

    letters2Bin: function (msg) {

      let input = "";
      let tmp = "";
      let regex = new RegExp(this.segdef[this.seg].regex, "g");
      let ltrs = [];

      // Split message into characters
      let bins = msg.split(/\s+/g);

      // For each character
      for (let b of bins) {

        // Handle space input
        if (b === "SPACE") {
          ltrs = "";
        } else {
          // Split each character into segments
          ltrs = b.match(regex);
        }


        // Scan all segments, if present add 1 else 0
        tmp = "";
        for (let l of this.segdef[this.seg].letters) {
          tmp += (ltrs.indexOf(l) >= 0) ? "1" : "0"
        }
        switch (parseInt(this.inp)) {
          case 2: // Numeric
            input += parseInt(tmp, 2).toString(10) + " ";
            break;
          case 3: // Binary
            input += tmp + " ";
            break;
          case 4: // Octal
            input += parseInt(tmp, 2).toString(8) + " ";
            break;
          case 5: // Hexa
            input += parseInt(tmp, 2).toString(16) + " ";
            break;
        }
      }

      return input.slice(0, -1);
    },

    decodeSeg: function () {

      // Reset
      this.errormsg = "";
      this.result = "";
      let msg = this.inp == 1 ? this.message : this.bin2Letters(this.message);
      let regex = new RegExp(this.segdef[this.seg].regex, "g");
  
      // Convert msg (segment letters e.g. BC) to text
      try {

        let words = msg.toUpperCase().match(/([A-M12]+)|(SPACE)/g);
        console.log(msg, words);
        if (!words) {
          this.errormsg = this.$t('errors.cannotparse');
          return;
        }
        
        for (let w of words) {

          if (w === "SPACE") {
            this.result += " ";
            continue;
          }
          
          // Convert to uppercase and sort
          w = w.match(regex);
          if (!w) throw ("Invalid input");
          w = w.sort().join("");
          
          let c = this.mapseg.find( (s) => { 
              return (s[this.seg] == w);
            });
            
          if (!c)
            this.errormsg += this.$t('errors.unknowninput') + w + " ";
          else
            this.result += c[3];
            
        }
      
      } catch (e) {
      
        console.log(e);
        this.errormsg = e;
        
      }

    },

    encodeSeg: function () {

      // Reset
      this.errormsg = "";
      this.result = "";
      let tempstr = "";
        
      try {
      
        for (let i = 0; i < this.message.length; i++) {
          
          // Spaces only work with numeric inputs
          if (this.message[i] == " ") {
            if (this.space && this.inp > 1) tempstr += "SPACE ";
            continue;
          }

          let s = this.mapseg.find( (a) => {
            return a[3] == this.message[i].toUpperCase();
          })
          if (s) tempstr += s[this.seg] + " ";       
        }

        tempstr = tempstr.slice(0,-1);
        if (this.inp > 1) 
          this.result = this.letters2Bin(tempstr);
        else
          this.result = tempstr;
        
      } catch (e) {
      
        this.errormsg = this.$t('errors.generic');
        console.log(e);

      }
    }

  }

}

</script>

<style scoped>
</style>