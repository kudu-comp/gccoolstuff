let leek = {
  chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  leeks: [
    ["4", "@", "A"],
    ["8", "B"],
    ["(", "C"],
    ["D"],
    ["3", "E"],
    ["ƒ", "F"],
    ["6", "G"],
    ["#", "H"],
    ["1", "!", "|", "I"],
    [";", "J"],
    ["K"],
    ["1", "L"],
    ["M"],
    ["^", "ท", "N"],
    ["0", "O"],
    ["P"],
    ["Q"],
    ["2", "R"],
    ["5", "$", "§", "S"],
    ["7", "T"],
    ["v", "µ", "U"],
    ["V"],
    ["W"],
    ["?", "×", "Ж", "X"],
    ["j", "Ч", "Y", "Y"],
    ["Z"],
  ],
};

let tutnese = {
  chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  tuts: [
    "a",
    "bub",
    "cut",
    "dud",
    "e",
    "fuf",
    "gug",
    "hash",
    "i",
    "jag",
    "kak",
    "lul",
    "mum",
    "nun",
    "o",
    "pup",
    "quack",
    "rut",
    "sus",
    "tut",
    "vuv",
    "wax",
    "ex",
    "yak",
    "zuz",
  ],
};

export const piglatin = [
  {
    name: "Pig Latin",
    descr:
      "Pig Latin is of English origin. It is a children's game that changes words and conceals them for those who don't know the rules. Take the first consonants of a word and add them at the end, then add -ay. If the word starts with a vowel add -yay to the end. Decoding looks for words in the dictionary to find a match. If no match is found the word is marked with asterisks.",
    decodeWord: function (dict, w) {
      if (w.match(/\s+/)) return w;
      if (
        // See if removing yay makes a word
        w.slice(-3).toLowerCase() === "yay" &&
        dict.find(dict.cleanStr(w.slice(0, w.length - 3)))
      ) {
        return w.slice(0, w.length - 3);
      } else {
        // Remove -ay and start moving letters to the front
        let h = w.length - 2;
        // Remove ay
        w = w.slice(0, w.length - 2);
        w = w.slice(-1) + w.slice(0, w.length - 1);
        while (!dict.find(dict.cleanStr(w)) && h > 0) {
          w = w.slice(-1) + w.slice(0, w.length - 1);
          h--;
        }
        if (h > 0) {
          return w;
        } else {
          return "*" + w + "*";
        }
      }
    },

    encodeWord: function (dict, w) {
      // Return white space as is
      if (w.match(/\s+/)) return w;
      if (dict.vowels.indexOf(w[0].toUpperCase()) >= 0) {
        // Just add yay
        return w + "yay";
      } else {
        let i = 0;
        while (i < w.length && dict.vowels.indexOf(w[i].toUpperCase()) < 0) i++;
        return w.slice(i) + w.slice(0, i) + "ay";
      }
    },
  },
  {
    name: "Louchebem",
    descr:
      "Louchebem (French) is thought to be a kind of pig latin used by French butchers (bouche). One of the following -ji, -oc, -euil, -uche, -ès, -em or ème is added at the end. An L is added at the beginning.",
    encodeWord: function (dict, w) {
      if (w.match(/\s+/)) return w;
      let suffixes = ["ji", "oc", "euil", "uche", "ès", "em", "ème"];
      let suff = suffixes[Math.floor(Math.random() * suffixes.length)];
      let i = 0;
      while (i < w.length && dict.vowels.indexOf(w[i].toUpperCase()) < 0) i++;
      return "l" + w.slice(i) + w.slice(0, i) + suff;
    },

    decodeWord: function (dict, w) {
      if (w.match(/\s+/)) return w;
      let suffixes = ["ji", "oc", "euil", "uche", "ès", "em", "ème"];
      // Find the suffix w.slice(-3).toLowerCase() === "yay"
      suffblock: {
        for (let s of suffixes) {
          if (w.slice(-s.length).toLowerCase() === s) {
            w = w.slice(0, -s.length);
            break suffblock;
          }
        }
      }
      // Remove l from the start
      w = w.slice(1);

      // Move consonants to the start
      let h = w.length;
      while (!dict.find(w) && h > 0) {
        w = w.slice(-1) + w.slice(0, w.length - 1);
        h--;
      }
      if (h > 0) {
        return w;
      } else {
        return "*" + w + "*";
      }
    },
  },
  {
    name: "Javanese",
    descr:
      "Javanese is written by adding a syllable (-av) before each vowel. It supposedly orignated in France in the 19th century.",
    encodeWord: function (dict, w, syl = "av") {
      if (w.match(/\s+/)) return w;
      // Add syl between each consonant and vowel
      let s = "";
      let h = false;
      for (let c of w) {
        if (h && dict.vowels.indexOf(c.toUpperCase()) >= 0) {
          s += syl + c;
          h = false;
        } else {
          s += c;
          h = true;
        }
      }
      return s;
    },

    decodeWord: function (dict, w, syl = "av") {
      if (w.match(/\s+/)) return w;
      // Double groups of av meam one is original
      // Save it from deletion first and add later
      let rex = new RegExp(syl + syl, "gi");
      let h = w.replace(rex, syl + ":");
      rex = new RegExp(syl, "gi");
      h = h.replace(rex, "");
      return h.replace(/:/g, syl);
    },
  },
  {
    name: "Língua dos Pês or P-language",
    descr:
      "Linga dos Pés is of Portugese origin. There are multiple versions. In this implementation each group of consonants with a vowel is suffixed with the letter p and the same vowel.",
    encodeWord: function (dict, w) {
      if (w.match(/\s+/)) return w;
      // Doubling each group ending with a vowel with p plus that vowel
      let s = "";
      let h = "";
      for (let c of w) {
        if (dict.vowels.indexOf(c.toUpperCase()) >= 0) {
          s += h + c + "p" + c.toLowerCase();
          h = "";
        } else {
          h += c;
        }
      }
      return s + h;
    },

    decodeWord: function (dict, w) {
      if (w.match(/\s+/)) return w;
      // Remove p group for each vowel
      let s = w;
      for (let vw of dict.vowels) {
        let rex = new RegExp("p" + vw + "p" + vw, "gi");
        s = s.replace(rex, "p" + vw + ":");
        rex = new RegExp("p" + vw, "gi");
        s = s.replace(rex, "");
        s = s.replace(/:/g, "p" + vw);
      }
      return s.toLowerCase();
    },
  },
  {
    name: "Rövarspråket",
    descr:
      "Rövarspråket is a Swedishs kind of pig latin that become popular after the books about Bill Bergson by Astrid Lindgren, where the children use it. Every consonant is doubled, and an o is inserted in-between. Vowels are left intact.",
    encodeWord: function (dict, w) {
      if (w.match(/\s+/)) return w;
      let s = "";
      for (let c of [...w]) {
        if (dict.vowels.indexOf(c.toUpperCase()) >= 0) {
          s += c;
        } else {
          s += c + "o" + c;
        }
      }
      return s;
    },

    decodeWord: function (dict, w) {
      if (w.match(/\s+/)) return w;
      let s = "";
      for (let i = 0; i < w.length; i++) {
        if (dict.vowels.indexOf(w[i].toUpperCase()) >= 0) {
          s += w[i];
        } else {
          s += w[i];
          i += 2;
        }
      }
      return s;
    },
  },
  {
    name: "Tutnese or Double dutch",
    descr:
      "Tutnese (also known as Tut) is an argot created by enslaved African Americans based on African-American Vernacular English as a method to covertly teach and learn spelling and reading.",
    encodeWord: function (dict, w) {
      if (w.match(/\s+/)) return w;
      let s = "";
      w = w.toUpperCase();
      for (let c of w) {
        let idx = tutnese.chars.indexOf(c);
        s += idx >= 0 ? tutnese.tuts[idx] : c;
      }
      return s;
    },

    decodeWord: function (dict, w) {
      if (w.match(/\s+/)) return w;
      let s = "";
      let rex =
        /(quack|hash|bub|cut|dud|fuf|gug|jag|kak|lul|mum|nun|pup|rut|sus|tut|vuv|wax|yak|zuz|ex|a|e|i|p|u|.)/g;
      w = w.toLowerCase().match(rex);
      for (let c of w) {
        let idx = tutnese.tuts.indexOf(c);
        s += idx >= 0 ? tutnese.chars[idx] : c.toLowerCase();
      }
      return s.toLowerCase();
    },
  },
  {
    name: "Ubbi dubbi",
    descr:
      "Ubbi dubbi is a language game spoken with the English language. After decades of history and predecessors, it was widely popularized by the 1972–1978 PBS children's show Zoom. Ubbi Dubbi is written by adding a syllable (-ub) before each vowel. It is similar to Javanese.",
    encodeWord: function (dict, w, syl = "ub") {
      if (w.match(/\s+/)) return w;
      // Add syl between each consonant and vowel
      let s = "";
      let h = false;
      for (let c of w) {
        if (h && dict.vowels.indexOf(c.toUpperCase()) >= 0) {
          s += syl + c;
          h = false;
        } else {
          s += c;
          h = true;
        }
      }
      return s;
    },

    decodeWord: function (dict, w, syl = "ub") {
      if (w.match(/\s+/)) return w;
      // Double groups of av meam one is original
      // Save it from deletion first and add later
      let rex = new RegExp(syl + syl, "gi");
      let h = w.replace(rex, syl + ":");
      rex = new RegExp(syl, "gi");
      h = h.replace(rex, "");
      return h.replace(/:/g, syl);
    },
  },
  {
    name: "Leet, noob or nerd speak",
    descr:
      "Leet speak replaces letters with numbers and symbols. It became popular in the early days of the internet to hide words from filters. There are multiple versions. The simplest only uses numbers. The most complex using multiple special characters to mimic each letter. This is somewhere in between replacing letters with a single character alternative.",
    encodeWord: function (dict, w) {
      if (w.match(/\s+/)) return w;
      let s = "";
      w = w.toUpperCase();
      for (let c of w) {
        let idx = leek.chars.indexOf(c);
        s += idx >= 0 ? leek.leeks[idx][0] : c;
      }
      return s;
    },

    decodeWord: function (dict, w) {
      if (w.match(/\s+/)) return w;
      let s = "";
      w = w.toUpperCase();
      for (let c of w) {
        let idx = leek.leeks.findIndex((elem) => elem.indexOf(c) >= 0);
        s += idx >= 0 ? leek.chars[idx] : c;
      }
      return s;
    },
  },
];
