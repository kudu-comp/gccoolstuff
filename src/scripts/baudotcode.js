/*
 * Library to convert Baudotcodes to tekst and vice verse
 *
 * The codeToASCII functions take a binary 5-bit string as input and either switches from letters <> figures or return the character
 * The ASCIItoCode functions take a character and return the 5-bit string, optionally preceeded with the figure/letter switch
 *
 * Nomral order is 54321 bit order
 * Reversed order is 12345 bit order
 *
 * Supports ITA-1 Baudotcode
 * Supports ITA-2 Murraycode
 * Supports MTK-2 Russian version of the Murraycode (Cyrillic)
 * Supports US-TTY not yet
 *
 */


// The Murraycode ITA-2 standard
const murraycode = [
  ['Not used','Not used'],  ['E','3'],  ['\n','\n'],  ['A','-'],
  [' ',' '],   ['S',"'"], ['I','8'],  ['U','7'],
  ['\r','\r'], ['D','$'],   ['R','4'],  ['J','BEL'],
  ['N',','],   ['F','!'],   ['C',':'],  ['K','('],
  ['T','5'],   ['Z','+'],   ['L',')'],  ['W','2'],
  ['H','#'],   ['Y','6'],   ['P','0'],  ['Q','1'],
  ['O','9'],   ['B','?'],   ['G','&'],  ['figs','figs'],
  ['M','.'],   ['X','/'],   ['V','='],  ['lets','lets']
]

const murraycodereversed = [
  ['Not used','Not used'], ['T','5'],  ['\r','\r'],  ['O','9'],
  [' ',' '],   ['H','#'],  ['N',','],  ['M','.'],
  ['\n','\n'], ['L',')'],  ['R','4'],  ['G','&'],
  ['I','8'],   ['P','0'],  ['C',':'],  ['V','='],
  ['E','3'],   ['Z','+'],  ['D','$'],  ['B','?'],
  ['S',"'"],   ['Y','6'],  ['F','!'],  ['X','/'],
  ['A','-'],   ['W','2'],  ['J','BEL'],  ['figs','figs'],
  ['U','7'],   ['Q','1'],  ['K','('],  ['lets','lets']
]

const murraycodefigs = 27;
const murraycodeletters = 31;

// Murraycode US TTY (not implemented)
// S with BEL, J with ', Z with ", V with ;

// The Cyrillic MTK2 version of the Murray code
// Switch to Cyrillic is 00000, but seems duplicate of letter switch

const murrayMTK2 = [
  ['lets','lets'], ['Е','3'], ['\n','\n'], ['А','–'],
  [' ',' '],   ['С',"'"],    ['И','8'], ['У','7'],
  ['\r','\r'], ['Д','WRU?'], ['Р',"4"], ['Й','Ю'],
  ['Н', ',']   ['Ф','Э'],    ['Ц',':'], ['К','('],
  ['Т','5'],   ['З','+'],    ['Л',')'], ['В','2'],
  ['Х',"Щ"],   ['Ы','6'],    ['П','0'], ['Я','1'],
  ['О','9'],   ['Б','?'],    ['Г','Ш'], ['figs','figs'],
  ['М','.'],   ['Ь','/'],    ['Ж','='], ['lets','lets']
]

const murrayMTK2reversed = [
  ['lets','lets'], ['Т','5'], ['\n','\n'], ['О','9'],
  [' ',' '],   ['Х',"Щ"],  ['Н',','],    ['М','.'],
  ['\r','\r'], ['Л',')'],  ['Р',"4"],    ['Г','Ш'],
  ['И','8'],   ['П','0'],  ['Ц',':'],    ['Ж','='],
  ['Е','3'],   ['З','+'],  ['Д','WRU?'], ['Б','?'],
  ['С',"'"],   ['Ы','6'],  ['Ф','Э'],    ['Ь','/'],
  ['А','–'],   ['В','2'],  ['Й','Ю'],    ['figs','figs'],
  ['У','7'],   ['Я','1'],  ['К','('],    ['lets','lets']
]

const murrayMTK2figs = 27;
const murrayMTK2letters = 31;

const baudotcode = [
  ['NUL','NUL'],  ['LTRS','LTRS'],  ['FIGS','FIGS'],  ['END','END'],  ['A','1'],
  ['-','.'],  ['J','6'],    ['K','('],  ['E','2'],  ['X','^'],  ['G','7'],
  ['M',')'],  ['/','^'],    ['Z',':'],  ['H','^'],   ['L','='],  ['Y','3'],
  ['S','^'],  ['B','8'],    ['R','-'],  ['U','4'],   ['T','^'],  ['C','9'],
  ['Q','/'],  ['I','^'],    ['W','?'],  ['F','^'],   ['N','£'],  ['O','5'],
  ['V',"'"],  ['D','0'],    ['P','+']
]

const baudotcodefigs = 2;
const baudotcodeletters = 1;

// ^ flag reversed for national use
const baudotcodereversed = [
  ['NUL','NUL'],  ['Y','3'],  ['E','2'],  ['I','^'],  ['A','1'],
  ['U','4'],  ['É','^'],    ['O','5'],  ['FIGS','FIGS'],  ['B','8'],  ['G','7'],
  ['F','^'],  ['J','6'],    ['C','9'],  ['H','^'],   ['D','0'],  ['LTRS','LTRS'],
  ['S','^'],  ['X','^'],    ['W','?'],  ['-','.'],   ['T','^'],  ['Z',':'],
  ['V',"'"],  ['END','END'],['R','-'],  ['M',')'],   ['N','£'],  ['K','('],
  ['Q',"/"],  ['L','='],    ['P','+']
]

const baudotrevcodefigs = 8;
const baudotrevcodeletters = 16;

// Start in character mode
var figs = false;

/*
 * Generic code to Ascii
 *
 * @param string    s   the string with the binary representation or with .o
 * @param array     a   the array to search
 * @param integer   afigs     the code that switches to figures
 * @param integer   aletters  the code that switches to letters
 *
 * @return integer      the ASCII code of the character or -1
 */

 function codeToASCII (s, a, afigs, aletters) {
   // Add code to convert .o to 01
   // console.log(s)
   // Convert to binary
   let code = parseInt(s, 2);
   if (code > 32) {
     return -1;
   } else if (code == afigs) {
     figs = true;
     return -1;
   } else if (code == aletters) {
     figs = false;
     return -1;
   } else {

     // Deal with unprintable characters
     if (figs && a[code][1].length > 1) return -1;
     if (!figs && a[code][0].length > 1) return -1;

     // Return the character
     return (figs) ? a[code][1].charCodeAt(0) : a[code][0].charCodeAt(0);
   }
 }

/*
 * Generic ASCII to code
 *
 * @param String    code      the ASCII code of the letter
 * @param array     a         the array with codes to search
 * @param integer   afigs     the code that switches to figures
 * @param integer   aletters  the code that switches to letters
 *
 * @return array   return the code and when needed also the figures/letters switch
 *
 */

function ASCIIToCode (code, a, afigs, aletters) {

  // Find the ASCII character with code in the baudotarray
  let char = String.fromCharCode(code).toUpperCase();
  let arr = []
  let pos = a.findIndex(  (e) => e[0] == char || e[1] == char );

  // Skip unknown ASCII characters
  // If needed also push figure / letter switch
  if (pos != -1) {
    if (a[pos][0] == char && figs) { arr.push(aletters.toString(2).padStart(5,0)); figs = false }
    if (a[pos][1] == char && !figs) { arr.push(afigs.toString(2).padStart(5,0)); figs = true }
    arr.push(pos.toString(2).padStart(5,0));
  }
  return arr;

}

/*
 * Reset the switches for Baudotcodes
 *
 */
export function reset() {
    figs = false;
}

/*
 * Return the character, or empty if switching between figures and letters
 *
 * @param code      a string with 01 or .0
 * @return String   the character
 */
export function murrayCodeToASCII (s) {
  return codeToASCII(s, murraycode, murraycodefigs, murraycodeletters);
}
export function murrayReversedCodeToASCII (s) {
  return codeToASCII(s, murraycodereversed, murraycodefigs, murraycodeletters);
}
export function murrayMTK2ToASCII (s) {
  return codeToASCII(s, murrayMTK2, murrayMTK2figs, murrayMTK2letters);
}
export function murrayMTK2ReversedCodeToASCII (s) {
  return codeToASCII(s, murrayMTK2reversed, murrayMTK2figs, murrayMTK2letters);
}
export function baudotCodeToASCII (s) {
  return codeToASCII(s, baudotcode, baudotcodefigs, baudotcodeletters);
}
export function baudotReversedCodeToASCII (s) {
  return codeToASCII(s, baudotcodereversed, baudotrevcodefigs, baudotrevcodeletters);
}

/*
 * Return the character, or empty if switching between figures and letters
 *
 * @param code     the ASCII code of the letter
 * @return array   return the code and when needed also the figures/letters switch
 *
 */
export function murrayASCIIToCode (code) {
  return ASCIIToCode(code, murraycode, murraycodefigs, murraycodeletters)
}
export function murrayReversedASCIIToCode (code) {
  return ASCIIToCode(code, murraycodereversed, murraycodefigs, murraycodeletters)
}
export function murrayMTK2ASCIIToCode (code) {
  return ASCIIToCode(code, murrayMTK2, murrayMTK2figs, murrayMTK2letters)
}
export function murrayMTK2ReversedASCIIToCode (code) {
  return ASCIIToCode(code, murrayMTK2reversed, murrayMTK2figs, murrayMTK2letters)
}
export function baudotASCIIToCode (code) {
  return ASCIIToCode(code, baudotcode, baudotcodefigs, baudotcodeletters)
}
export function baudotReversedASCIIToCode (code) {
  return ASCIIToCode(code, baudotcode, baudotrevcodefigs, baudotrevcodeletters)
}
