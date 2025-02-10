<template>
  <div class="row">
    <label for="sel" class="form-label md-size mb-2">{{$t('language')}}</label>
    <select
      id="sel"
      class="form-control md-size mb-2"
      @input="updateDict($event.target.value)"
    >
      <option v-for="(d, idx) in dicts" :key="d" :value="idx" :disabled="d.disabled">
        {{ d.name }}
      </option>
    </select>
  </div>
  <div v-if="dictloading" class="spinner-border ms-2" role="status">
    <span class="sr-only">Loading...</span>
  </div>
  <div v-if="!dictloading" class="row">
    <label for="len" class="form-label md-size mb-2">{{$t('wordsearch.lettersused')}}</label>
    <span class="md-size mb-2">{{dict.alphabet}}</span>
  </div>
</template>

<script>
//
// VLanguage component enables the user to select a language dictionary
// It exports a couple of standard functions that can be overruled in the dictionary file
//
// Functions:
// The dictionary is used to clean a word so it matches the dictionary rules
// The dictionary is used to compare two words in the dictionary
// The dictionary is used to check if a word is in the dictionary
// The dictionary is used to find the next word in the dictionary
// The dictionary contains a list of words
// The dictionary is dynamically loaded from a file to reduce the initial load time
//

export default {
  name: "VLanguage",

  props: {
    dict: {
      type: Object,
      required: true,
    },
    dictloading: {
      type: Boolean,
      required: false,
    },
  },

  data() {
    return {
      dicts: [
        {
          name: "Standard dictionaries",
          disabled: true
        },
        {
          name: "English standard (49.000 words)",
          file: "en-small.js",
          dict: null,
        },
        {
          name: "Dutch standard (118,000 words)",
          file: "nl-small.js",
          dict: null,
        },
        {
          name: "Czech standard (514,000 words)",
          file: "cz-small.js",
          dict: null,
        },
        {
          name: "Danish standard (146,000 words)",
          file: "dk-small.js",
          dict: null,
        },
        {
          name: "French standard (73,000 words)",
          file: "fr-small.js",
          dict: null,
        },
        {
          name: "German standard (162,000 words)",
          file: "de-small.js",
          dict: null,
        },
        {
          name: "Italian standard (94,000 words)",
          file: "it-small.js",
          dict: null,
        },
        {
          name: "Norwegian standard (320,000 words)",
          file: "no-small.js",
          dict: null,
        },
        {
          name: "Polish standard (274,000 words)",
          file: "pl-small.js",
          dict: null,
        },
        {
          name: "Portugese standard (252,000 words)",
          file: "pt-small.js",
          dict: null,
        },
        {
          name: "Spanish standard (65,000 words)",
          file: "es-small.js",
          dict: null,
        },
        {
          name: "Swedish standard (72,000 words)",
          file: "se-small.js",
          dict: null,
        },
        {
          name: "10k most common dictionaries",
          disabled: true
        },
        {
          name: "English most common",
          file: "en-10k.js",
          dict: null,
        },
        {
          name: "Dutch most common",
          file: "nl-10k.js",
          dict: null,
        },
        {
          name: "Czech most common",
          file: "cz-10k.js",
          dict: null,
        },
        {
          name: "Danish most common",
          file: "dk-10k.js",
          dict: null,
        },
        {
          name: "French most common",
          file: "fr-10k.js",
          dict: null,
        },
        {
          name: "German most common",
          file: "de-10k.js",
          dict: null,
        },
        {
          name: "Italian most common",
          file: "it-10k.js",
          dict: null,
        },
        {
          name: "Norwegian most common",
          file: "no-10k.js",
          dict: null,
        },
        {
          name: "Polish most common",
          file: "pl-10k.js",
          dict: null,
        },
        {
          name: "Portugese most common",
          file: "pt-10k.js",
          dict: null,
        },
        {
          name: "Spanish most common",
          file: "es-10k.js",
          dict: null,
        },
        {
          name: "Swedish most common",
          file: "se-10k.js",
          dict: null,
        },
      ],
    };
  },

  emits: [
    "update:dict",
    "update:dictloading"
  ],

  mounted: function () {
    this.updateDict(1);
  },

  methods: {
    
    //
    // Compare two words in the dictionary
    // Standard compare function that can be overruled in the dictionary file
    //
    compStr: function (s1, s2) {
      if (s1 < s2) return -1;
      else if (s1 > s2) return 1;
      else return 0;
    },

    // 
    // Clean the string so it matches the dictionary rules
    // Standard cleanStr that can be overruled in the dictionary file
    // Takes out all the diacretics and makes the string uppercase
    //
    cleanStr: function (s1) {
      s1 = s1.replace(/[äáàâåąã]/gi, "a");
      s1 = s1.replace(/[ëéèêěę]/gi, "e");
      s1 = s1.replace(/[ïíìî]/gi, "i");
      s1 = s1.replace(/[öóòôøõ]/gi, "o");
      s1 = s1.replace(/[üúùûů]/gi, "u");
      s1 = s1.replace(/[çčć]/gi, "c");
      s1 = s1.replace(/[ď]/gi, "d");
      s1 = s1.replace(/[ł]/gi, "l");
      s1 = s1.replace(/[ñňń]/gi, "n");
      s1 = s1.replace(/[ř]/gi, "r");
      s1 = s1.replace(/[šś]/gi, "s");
      s1 = s1.replace(/[ť]/gi, "t");
      s1 = s1.replace(/[ý]/gi, "y");
      s1 = s1.replace(/[žźż]/gi, "z");
      s1 = s1.replace(/[ß]/gi, "ss");
      s1 = s1.replace(/[æ]/gi, "ae");
      return s1.toUpperCase();
    },

    // 
    // Find the word if not matched exactly return the next word
    // This is a standard findWord that can be overruled in the dictionary file
    //
    findWord: function(s1) {
      let start = 0;
      let end = this.dict.words.length - 1;

      while (start <= end) {
        let middle = Math.floor((start + end) / 2);
        let h = this.dict.compStr(this.dict.words[middle], s1);
        if (h === 0) {
          // found the key
          return {
            fnd: true,
            pos: middle,
            word: this.dict.words[middle],
          };
        } else if (h === -1) {
          // continue searching to the right
          start = middle + 1;
        } else {
          // search searching to the left
          end = middle - 1;
        }
      }
      // key wasn't found

      if (this.dict.compStr(this.dict.words[end], s1) === -1) end++;
      return {
        fnd: false,
        pos: end,
        word: this.dict.words[end] 
      };
    },

    // 
    // Check if the word is in the dictionary (binary search)
    // This is a standard find that can be overruled in the dictionary file
    //
    find: function(s1) {
      let start = 0;
      let end = this.dict.words.length - 1;

      while (start <= end) {
        let middle = Math.floor((start + end) / 2);
        let h = this.dict.compStr(this.dict.words[middle], s1);
        if (h === 0) {
          // found the key
          return true;
        } else if (h === -1) {
          // continue searching to the right
          start = middle + 1;
        } else {
          // search searching to the left
          end = middle - 1;
        }
      }
      // key wasn't found
      return false;
    },
  
    updateDict: function (e) {
      if (this.dicts[e].dict === null) {
        this.$emit("update:dictloading", true);
        let url = new URL(`../../assets/dicts/${this.dicts[e].file}`, import.meta.url).href;
        import(url).then((mod) => {
          this.dicts[e].dict = mod.dict;
          // If the dictionary does not have the standard functions add them
          if  (!this.dicts[e].dict.find) { this.dicts[e].dict.find = this.find; }
          if  (!this.dicts[e].dict.findWord) { this.dicts[e].dict.findWord = this.findWord; }
          if  (!this.dicts[e].dict.cleanStr) { this.dicts[e].dict.cleanStr = this.cleanStr; }
          if  (!this.dicts[e].dict.compStr) { this.dicts[e].dict.compStr = this.compStr; }
          this.$emit("update:dict", this.dicts[e].dict);
          this.$emit("update:dictloading", false);
        });
      } else {
        this.$emit("update:dict", this.dicts[e].dict);
      }
    },
  },

};
</script>
