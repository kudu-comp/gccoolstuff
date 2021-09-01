<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('codes.segment.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('codes.segment.long')" />
      <img src="https://www.maximintegrated.com/content/dam/images/design/tech-docs/1131/1131Fig01.gif" />
      <div class="form-inline mt-2">
        <label class="form-label mb-2 mr-2" for="ofs">{{$t('segment.segsize')}}</label>
        <select id="ofs" class="custom-select mb-2 mr-2" 
            v-model='seg' 
            @change="styleObj.fontFamily = (seg == 0) ? 'Segment7'  : 'Segment14'"
          >
          <option value="0">7 Segment display</option>
          <option value="1">14 Segment display</option>
          <option value="2">16 Segment display</option>
        </select>
      </div>
      <div class="form-inline">
        <label class="form-label mb-2 mr-2" for="ofs">{{$t('segment.input')}}</label>
        <select id="ofs" class="custom-select mb-2 mr-2" v-model='inp'>
          <option value="1">{{$t('segment.letters')}}</option>
          <option value="2">{{$t('segment.binary')}}</option>
        </select>
      </div>
      <div class="form-row mb-2">
        <textarea id="message" name="message" class="form-control" ref="message" :placeholder="$t('labels.message')" rows=10 v-model='message'></textarea>
      </div>
      <input type="button" id="enc" name="enc" :value="$t('buttons.encode')" class="btn btn-primary mb-2 mr-2" v-on:click="encodeSeg">
      <input type="button" id="dec" name="dec" :value="$t('buttons.decode')" class="btn btn-primary mb-2 mr-2" v-on:click="decodeSeg">
      <div id="result" class="form-row">
        <textarea id="message2" name="message2" spellcheck="false" class="form-control" v-bind:style="styleObj" rows=10 v-model='result'></textarea>
      </div>
      <p v-show="errormsg" class="errormsg mt-2">{{errormsg}}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SegmentCode',

  props: {
    msg: String,
  },

  data: function () {
    return {
      message: "",
      result : this.$t('labels.result'),
      errormsg: "",
      seg: 0,
      inp: 1,
      styleObj: {
        fontFamily: 'Segment7'
      },
      segdef: [
        {
          letters: ["A", "B", "C", "D", "E", "F", "G"],
          regex: "(A|B|C|D|E|F|G)"
        },
        {
          letters: ["A", "B", "C", "D", "E", "F", "G1", "G2", "H", "I", "J", "K", "L", "M"],
          regex: "(A|B|C|D|E|F|G1|G2|H|I|J|K|L|M)"
        },
        {
          letters: ["A1", "A2", "B", "C", "D1", "D2", "E", "F", "G1", "G2", "H", "I", "J", "K", "L", "M"],
          regex: "(A1|A2|B|C|D1|D2|E|F|G1|G2|H|I|J|K|L|M)"
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
        ["ABFG",    "ABFG1G2",      "A1A2BFG1G2",         "°"]
      ]
    }
  },

  mounted: function() {
    this.$refs.message.focus();
  },

  methods: {

    bin2Letters: function (msg) {
    
      let input = "";
      let bins = msg.match(/[01]+/g);
      for (let s of bins) {
        for (let c = 0; c < s.length; c++) {
          if (s[c] == 1)  input += this.segdef[this.seg].letters[c];
        }
        input += " ";
      }
      return input.slice(0,-1);
      
    },

    letters2Bin: function (msg) {

      let input = "";
      let regex = new RegExp(this.segdef[this.seg].regex, "g");
      let bins = msg.split(/\s+/g);
      for (let b of bins) {
        let ltrs = b.match(regex);
        for (let i = 0; i < this.segdef[this.seg].letters.length; i++) {
          input += (ltrs.find(this.segdef[this.seg].letters[i])) ? "1" : "0"
        }
        input += " ";
      }
      return input.slice(0, -1);
    },

    decodeSeg: function () {

      // Reset
      this.errormsg = "";
      this.result = "";
      let regex = new RegExp(this.segdef[this.seg].regex, "g");

      // Convert binary to letters
      let msg = (this.inp == 2) ? this.bin2Letters(this.message) : this.message;

      // Convert msg (segment letters e.g. BC) to text
      try {

        let words = msg.toUpperCase().match(/[A-M12]+/g);
        if (!words) {
          this.errormsg = this.$t('errors.cannotparse');
          return;
        }
        
        for (let w of words) {
          
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
        
      try {
      
        for (let i = 0; i < this.message.length; i++) {
          
          let s = this.mapseg.find( (s) => {
            return s[3] == this.message[i].toUpperCase();
          })
          if (s) this.result += s[this.seg] + " ";
          
        }

        if (this.inp == 2) this.result = this.letters2Bin(this.result);
        
      } catch (e) {
      
        this.errormsg = this.$t('error.generic');
        console.log(e);

      }
    }

  }

}

</script>

<style scoped>

@font-face { font-family: Segment7;    src: url('~@/assets/fonts/DSEG7Classic-Light.woff'); }
@font-face { font-family: Segment14;   src: url('~@/assets/fonts/DSEG14Classic-Light.woff'); }

</style>