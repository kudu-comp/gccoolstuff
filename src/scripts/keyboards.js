/*
 * Translates from one keyboard to another
 */

export const keyboards = [
  {
    // ANSI QERTY layout (US)
    name: "QWERTY",
    description: "QWERTY - ANSI US layout",
    keys:
      // Normal, shift, alt gr
      "`1234567890-=qwertyuiop[]asdfghjkl;'\\\\zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL:\"||ZXCVBNM<>?     €                                          "
  },

  {
    // French version, Belgium version differs on some of the symbols
    // All letters including the ones with diacretics are in the same placeholder
    // See https://en.wikipedia.org/wiki/AZERTY for more info
    name: "AZERTY",
    description: "AZERTY - French layout",
    keys:
      // Normal, shift, alt gr
      "²&é\"'(-è_çà)=azertyuiop^$qsdfghjklmù*<wxcvbn,;:!³1234567890°+AZERTYUIOP¨£QSDFGHJKLM%µ>WXCVBN?./§  ~#{[|`\\^@]}   €       ¤                       ",
  },

  {
    // German version, there are many different versions for central European coutries
    // All letters including the ones with diacretics are in the same placeholder
    // See https://en.wikipedia.org/wiki/QWERTZ for more info
    name: "QWERTZ",
    description: "QWERTZ - German layout",
    keys:
      // Normal, shift, alt gr, no shift alt gr
      "^1234567890ß´qwertzuiopü+asdfghjklöä#<yxcvbnm,.-°!\"§$%&/()=?`QWERTZUIOPÜ*ASDFGHJKLÖÄ'>YXCVBNM;:_×`²³_¡¿{[]}\\∙  €¨      ≤≥ø         ®| »®«  µ   ",
  },

  {
    // Russian version
    // Middle row one letter shorter (right), under row one letter shorter (left)
    // All letters including the ones with diacretics are in the same placeholder
    // See https://en.wikipedia.org/wiki/QWERTZ for more info
    name: "JCUKEN",
    description: "JCUKEN - Russian Cyrillic layout",
    keys:
      // Normal, shift, no alt gr
      "ё1234567890-=\\йцукенгшщзхъфывапролджэ  ячсмитьбю.Ё!\" ;%:?*()_/ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭ  ЯЧСМИТЬБЮ,",
  },

  {
    // Modern Dvorak (US Layout)
    // See https://nl.wikipedia.org/wiki/Dvorak-toetsenbord for more info
    name: "DVORAK2",
    description: "DVORAK - two handed layout",
    keys:
      // Normal, shift, no alt gr
      "`1234567890[]',.pyfgcrl/=aoeuidhtns-  ;qjkxbmwvz~!@#$%^&*(){}\"<>PYFGCRL?+AOEUIDHTNS_  :QJKXBMWVZ",
  },

  {
    // Modern Dvorak (US Layout)
    // See https://nl.wikipedia.org/wiki/Dvorak-toetsenbord for more info
    name: "DVORAKL",
    description: "DVORAK - left handed layout",
    keys:
      // Normal, shift, no alt gr
      "`[]/pfmlj4321;qbyurso.65=-kcdtheaz87  'xgvwni,09~{}?PFMLJ$#@!:QBYURSO>^%+_KCDTHEAZ*&  \"XGVWNI<)(",
  },

  {
    // Modern Dvorak (US Layout)
    // See https://nl.wikipedia.org/wiki/Dvorak-toetsenbord for more info
    name: "DVORAKR",
    description: "DVORAK - right handed layout",
    keys:
      // Normal, shift, no alt gr
      "`1234jlmfp/[]56q.orsuyb;=78zaehtdck-  90x,inwvg'~!@#$JLMFP?{}%^Q>ORSUYB:+&*ZAEHTDCK_  ()X<INWVG\"",
  },

  {
    // Modern Dvorak (US Layout)
    // See https://nl.wikipedia.org/wiki/Dvorak-toetsenbord for more info
    name: "COLEMAK",
    description: "COLEMAK - alternative layout",
    keys:
      // Normal, shift, alt gr
      "`1234567890-=qwfpgjluy;[]arstdhneio'  zxcvbkm,./~!@#$%^&*()_+QWFPGJLUY:{}ARSTDHNEIO\"  ZXCVBKM<>?≈¡ºª¢€ ð ´´-×äåäø ÐŁúö«»á ß   ñéíóõ  æ ç    ≤≥¿",
  },

]

/*
 * Convert a letter from one keyboard to another
 *
 * @param string    s         string to be replaced
 * @param string    fromkeyb  name of the keyboard used for the input strings
 * @param strings   tokeyb    name of the keyboard for the output string
 *
 * @return string   the transscribed string
 */

export function convertKeyboard (s, fromkeyb, tokeyb) {

  // Find keyboards given the name
  let from = keyboards.findIndex ( (e) => e.name == fromkeyb);
  let to   = keyboards.findIndex ( (e) => e.name == tokeyb);

  // Handle wrong keyboard name
  if (from < 0 || to < 0) {
    console.log("Unknown keyboard layout");
    throw ("Unknown keyboard detected");
  }

  // Loop over string
  let result = "";
  let pos = 0;
  for (let ch of s) {
    if (ch == " ") { result += " "; continue }
    pos = keyboards[from].keys.indexOf(ch);
    result += (pos >= 0) ? keyboards[to].keys[pos] : ch;
  }
  return result;
}
