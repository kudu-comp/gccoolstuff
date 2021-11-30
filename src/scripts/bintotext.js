/*
 * Base conversions supports
 * Binary  - input a string of 0 and 1, whitespace ignored, everything else an error
 * Decimal - input a string of 0 to 9, whitespace ignored, everything else anerror
 * Hexadecimal - input a string of 0-9A-F, caps and whitespace ignored, everything else an error
 * Text - any text
 * Base16, base 32, base 58, base64, base91 - encoded input
 * 
 */

 /*
  * Clean input string of illegal characters and whitespace
  * optionally throw an error on illegal characters
  *
  * @param integer   s      a string of 0 and 1's
  *
  * @return string  
  */

// function cleanString (s, validchars = "", error = false) { 
  
//   let temp = "";
//   for (let i = 0; i < s.length; i++) {

//     // Append valid characters and continue
//     if (validchars.indexOf(s[i]) >= 0) {
//       temp += s[i];
//       continue;
//     }

//     // Ignore whitespace
//     if (" \n\r\t".indexOf(s[i]) >= 0) continue;

//     // Throw an error for invalid input if needed
//     if (error) throw ("Illegal character in input " + s[i]);

//   }
//   return temp;
// }

/*
 * Convert binary input to a buffer
 *
 * @param  string   s      a string of 0 and 1's representing one single binary number
 *
 * @return Uint8Array  
 */

export function binaryToBuffer (s) {
  
  s = s.replace(/[ \n\r\t]/g, "");

  // Prepend with 0 if not exactly multiple of 8
  if (s.length % 8 > 0)
    for (let i = 0; i < 8 - (s.length % 8); i++) s = "0" + s;

  // Take 8 bit chunks and build the array
  let len = s.length / 8;
  let b = new Uint8Array(len);
  let j = 0;
  
  for (let i = 0; i < s.length; i += 8) {
    b[j++] =parseInt(s.slice(i, i + 8), 2);
  }

  return b;
  
}

/*
 * Convert buffer to binary output (as a string bytes separated with spaces)
 *
 * @param  Uint8Array   b 
 *
 * @return string  
 */

export function bufferToBinary (b) {
  
  let r = "";
  for (let i in b) r += b[i].toString(2).padStart(8,"0") + " "
  return r.slice(0,-1);

}

/*
 * Convert decimal input to a buffer
 *
 * @param  string   s      a string of 0 and 1's representing one single binary number
 *
 * @return Uint8Array  
 */

export function decimalToBuffer (s) {
  s = s.replace(/[ \n\r\t]/g, "");

  let hex = BigInt(s).toString(16);
  if (hex.length % 2) { hex = '0' + hex; }

  let len = hex.length / 2;
  let b = new Uint8Array(len);

  let j = 0;
  for (let i = 0; i < hex.length; i += 2)
    b[j++] = parseInt(hex.slice(i, i+2), 16);

  return b;
}

/*
 * Convert buffer to decimal output (one big integer)
 *
 * @param  Uint8Array   b 
 *
 * @return string  
 */

export function bufferToDecimal (b) {

  let hex = [];

  b.forEach(function (i) {
    var h = i.toString(16);
    if (h.length % 2) { h = '0' + h; }
    hex.push(h);
  });

  return BigInt('0x' + hex.join(''));

}

/*
 * Convert hexadecimal input to a buffer
 *
 * @param  string   s      a string of 0-9A-F representing one single hexadecimal number
 *
 * @return Uint8Array  
 */

export function hexToBuffer (s) {
  
  s = s.replace(/[ \n\r\t]/g, "");

  // Prepend with 0 if not exactly multiple of 2
  if (s.length % 2 > 0) s = "0" + s;

  let len = s.length / 2;
  let b = new Uint8Array(len);
  let j = 0;
  
  // Take 2 hexadecimal chunks starting at the back convert to decimal and put it in the array
  for (let i = 0; i < s.length; i += 2)
    b[j++] = parseInt(s.slice(i, i + 2), 16);

  return b;

}

/*
 * Convert buffer to hexadecimal output
 *
 * @param  Uint8Array  b 
 *
 * @return string  
 */

export function bufferToHex (b) {
  
  let r = "0x";
  for (let i in b) r += b[i].toString(16).padStart(2,"0");
  return r;

}

/*
 * Convert text input to a buffer
 *
 * @param  string   s      a string all characters are allowed
 *
 * @return Uint8Array  
 */

export function textToBuffer (s) {
  
  let len = s.length;
  let b = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    b[i] = s.charCodeAt(i);
  }
  return b;
    
}

/*
 * Convert buffer to text
 *
 * @param  Uint8Array b    
 *
 * @return string
 */

export function bufferToText (b) {
  
  let r = "";
  for (let i in b) r += String.fromCharCode(b[i]);
  return r;
    
}

/*
 * Base58 encodings
 */

export const base58encodings = [
  { name: "Bitcoin", value: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" },
  { name: "Ripple",  value: "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz" },
  { name: "Flickr",  value: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ" },
  { name: "IPFS",    value: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" },
  { name: "GMP",     value: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuv" }
]

/*
 * Convert base58 to buffer
 *
 * @param  string s   a string with valid base58 codes
 * @param  string enc encoding characters
 *
 * @return Uint8Array
 */
 
export function base58ToBuffer(s, enc = base58encodings[0].value ) {

  let d = [], //the array for storing the stream of decoded bytes
  b = [], //the result byte array that will be returned
  i, //the iterator variable for the base58 string
  j, //the iterator variable for the byte array (d)
  c, //the carry amount variable that is used to overflow from the current byte to the next byte
  n; //a temporary placeholder variable for the current byte

  for (i in s) { //loop through each base58 character in the input string
    j = 0;
    c = enc.indexOf(s[i]);
    if (c < 0) return undefined;
    c || b.length ^ i ? i : d.push("1");
    while (j in d || c) {
      n = d[j];
      n = n ? n * 58 + c : c;
      c = n >> 8;
      d[j] = n % 256;
      j++
    }
  }
  while (j--) //since the byte array is backwards, loop through it in reverse order
    b.push(d[j]); //append each byte to the result
  return new Uint8Array(b) //return the final byte array in Uint8Array format

}

/*
 * Convert buffer to base58
 *
 * @param  Uint8Array   b
 * @param  string       enc encoding characters
 *
 * @return string
 */

export function bufferToBase58(b, enc = base58encodings[0].value) {

  // Init
  let b58_inp = [];
  let b58_str = "";
  let i, j, c, n;

  // String of only zeroes?
  for (i in b) {

    j = 0;
    c = b[i];
    b58_str += (c == 0 && b58_inp.length == 0) ? enc[0] : ""; // Deal with leading zeroes
    while (j in b58_inp || c) {
      n = b58_inp[j];
      n = n ? n * 256 + c : c;
      c = n / 58 | 0;
      b58_inp[j] = n % 58;
      j++;
    }

  }

  while (j--)
    b58_str += enc[b58_inp[j]];

  return b58_str;


}

/*
 * Ascii85 encodings
 */

export const  ascii85encodings = [
  { name: "Adobe Ascii85", value: "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstu" },
  { name: "Original btoa", value: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrst" },
  { name: "Z85",           value: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#" }
]

/*
 * Convert Ascii85 to buffer
 *
 * @param  string s   a string with valid base58 codes
 * @param  string enc encoding characters
 *
 * @return Uint8Array
 */

export function ascii85ToBuffer (s, enc = ascii85encodings[0].value, padding = 0) {
    
  for (let i = 0; i < padding; i++) s += enc[84];

  let b1, b2, b3, b4;
  let b = [];

  // Take five characters at a time
  for (let i = 0; i < s.length; i += 5) {

    // Calculate as base85 take into account offset (start at ASCII 33)
    let n = (enc.indexOf(s[i])) * 85 ** 4 +
      (enc.indexOf(s[i + 1])) * 85 ** 3 +
      (enc.indexOf(s[i + 2])) * 85 ** 2 +
      (enc.indexOf(s[i + 3])) * 85 +
      (enc.indexOf(s[i + 4]));

    // Convert to base 256 (8 bits)
    b1 = Math.floor(n / 256 ** 3);
    n = n - b1 * 256 ** 3;
    b2 = Math.floor(n / 256 ** 2);
    n = n - b2 * 256 ** 2;
    b3 = Math.floor(n / 256);
    b4 = n - b3 * 256;

    // Push bytes to array
    b.push(b1);
    b.push(b2);
    b.push(b3);
    b.push(b4);

  }

  // Pop the padding
  for (let i = 0; i < padding; i++) b.pop();

  // Return array with bytes
  return new Uint8Array(b);
  
}

/*
 * Convert buffer to Ascii85
 *
 * @param  Uint8Array  b   binary buffer
 * @param  string      enc encoding characters
 *
 * @return string
 */

export function bufferToAscii85 (b, enc = ascii85encodings[0].value) {
    
  // Pad with 0 multiple of 4 bytes
  let padding = (b.length % 4 == 0) ? 0 : 4 - (b.length % 4);
  for (let i = 0; i < padding; i++) b.push(0);

  let n = 0;
  let s = "";
  let b1, b2, b3, b4, b5;

  // Take four bytes at a time
  for (let i = 0; i < b.length; i += 4) {

    // Convert to decimal
    n = b[i] * 256 ** 3 + b[i + 1] * 256 ** 2 + b[i + 2] * 256 + b[i + 3];

    // Convert to base 85
    b1 = Math.floor(n / 85 ** 4);
    n = n - b1 * 85 ** 4;
    b2 = Math.floor(n / 85 ** 3);
    n = n - b2 * 85 ** 3;
    b3 = Math.floor(n / 85 ** 2);
    n = n - b3 * 85 ** 2;
    b4 = Math.floor(n / 85);
    b5 = n - b4 * 85;

    // Create string starting at ASCII 33
    s += enc[b1] + enc[b2] + enc[b3] + enc[b4] + enc[b5];

  }

  // Remove padding from result and return
  return (padding == 0) ? s : s.slice(0, -1 * padding);

}

/*
 * Base64 encodings
 */

export const base64encodings = [
  { name: "Standard base64",   value: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" },
  { name: "UUencode",   value: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_" }
]

/*
 * Convert Base64 to buffer
 *
 * @param  string s   a string with valid base58 codes
 * @param  string enc encoding characters
 *
 * @return Uint8Array
 */

export function base64ToBuffer  (s, enc = base64encodings[0].value ) {
    
  let n = 0;
  let b1, b2, b3;
  let b = [];

  // Padding
  let padding = 0;
  if (s[s.length - 1] == "=") padding++;
  if (s[s.length - 2] == "=") padding++;

  // Take 4 characters at a time
  for (let i = 0; i < s.length; i += 4) {

    // Calculate as base64
    n = (enc.indexOf(s[i])) * 64 ** 3 + (enc.indexOf(s[i + 1])) * 64 ** 2 +
      ((s[i + 2] == "=") ? 0 : enc.indexOf(s[i + 2])) * 64 +
      ((s[i + 3] == "=") ? 0 : enc.indexOf(s[i + 3]));

    // Convert to base 256 (8 bits)
    b1 = Math.floor(n / 256 ** 2);
    n = n - b1 * 256 ** 2;
    b2 = Math.floor(n / 256);
    b3 = n - b2 * 256;

    // Push bytes to array
    b.push(b1);
    b.push(b2);
    b.push(b3);

  }

  // Pop the padding (null chars)
  for (let i = 0; i < padding; i++) b.pop();

  // Return array with bytes
  return new Uint8Array(b);
  
}

/*
 * Convert buffer to Base64
 *
 * @param  array  bf   binary buffer
 * @param  string enc encoding characters
 *
 * @return string
 */

export function bufferToBase64 (bf, enc = base64encodings[0].value) {
    
  // Convert to normal arrray to push padding
  let b = [...bf];
  
  // Pad with 0 multiple of 3 bytes
  let padding = (b.length % 3 == 0) ? 0 : 3 - (b.length % 3);
  for (let i = 0; i < padding; i++) b.push(0);

  let n = 0;
  let s = "";
  let b1, b2, b3, b4;

  // Take 3 bytes at a time
  for (let i = 0; i < b.length; i += 3) {

    // Convert to decimal
    n = b[i] * 256 ** 2 + b[i + 1] * 256 + b[i + 2];

    // Convert to base 64
    b1 = Math.floor(n / 64 ** 3);
    n = n - b1 * 64 ** 3;
    b2 = Math.floor(n / 64 ** 2);
    n = n - b2 * 64 ** 2;
    b3 = Math.floor(n / 64);
    b4 = n - b3 * 64;

    // Create string starting at ASCII 33
    s += enc[b1] + enc[b2] + enc[b3] + enc[b4];

  }

  // Padding character is =
  if (padding >= 2) s = s.slice(0, -2) + "==";
  if (padding >= 1) s = s.slice(0, -1) + "=";

  return s;
  
}

/*
 * Base32 encodings
 */

export const base32encodings = [
  { name: "RFC4648",      value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567" },
  { name: "Extended Hex", value: "0123456789ABCDEFGHIJKLMNOPQRSTUV" },
  { name: "z-base-32",    value: "ybndrfg8ejkmcpqxot1uwisza345h789" },
  { name: "Geohash",      value: "0123456789bcdefghjkmnpqrstuvwxyz" },
]

/*
 * Convert Base32 to buffer
 *
 * @param  string s   a string with valid base58 codes
 * @param  string enc encoding characters
 *
 * @return Uint8Array
 */

export function base32ToBuffer (s, enc = base32encodings[0].value) {

  let n = 0;
  let b1, b2, b3, b4, b5;
  let b = [];

  // Padding
  let padding = 0;
  if (s[s.length - 1] == "=") padding++;
  if (s[s.length - 2] == "=") padding++;
  if (s[s.length - 3] == "=") padding++;
  if (s[s.length - 4] == "=") padding++;
  if (s[s.length - 5] == "=") padding++;
  if (s[s.length - 6] == "=") padding++;
  if (s[s.length - 7] == "=") padding++;

  // Take 8 characters at a time
  for (let i = 0; i < s.length; i += 8) {

    // Calculate as base32
    n = (enc.indexOf(s[i])) * 32 ** 7 + 
      ((s[i + 1] == "=") ? 0 : enc.indexOf(s[i + 1])) * 32 ** 6 +
      ((s[i + 2] == "=") ? 0 : enc.indexOf(s[i + 2])) * 32 ** 5 +
      ((s[i + 3] == "=") ? 0 : enc.indexOf(s[i + 3])) * 32 ** 4 +
      ((s[i + 4] == "=") ? 0 : enc.indexOf(s[i + 4])) * 32 ** 3 +
      ((s[i + 5] == "=") ? 0 : enc.indexOf(s[i + 5])) * 32 ** 2 +
      ((s[i + 6] == "=") ? 0 : enc.indexOf(s[i + 6])) * 32 +
      ((s[i + 7] == "=") ? 0 : enc.indexOf(s[i + 7])); 

    // Convert to base 256 (5 bits)
    b1 = Math.floor(n / 256 ** 4);
    n = n - b1 * 256 ** 4;
    b2 = Math.floor(n / 256 ** 3);
    n = n - b2 * 256 ** 3;
    b3 = Math.floor(n / 256 ** 2);
    n = n - b3 * 256 ** 2;
    b4 = Math.floor(n / 256);
    b5 = n - b4 * 256;

    // Push bytes to array
    b.push(b1);
    b.push(b2);
    b.push(b3);
    b.push(b4);
    b.push(b5);

  }

  // Pop the padding (null chars)
  for (let i = 0; i < padding; i++) b.pop();

  // Return array with bytes
  return new Uint8Array(b);

}

/*
 * Convert buffer to Base32
 *
 * @param  Uint8Array  b   binary buffer
 * @param  string      enc encoding characters
 *
 * @return string
 */

export function bufferToBase32 (bf, enc = base32encodings[0].value) {
    
  // Pad with 0 multiple of 5 bytes
  let b = [...bf];

  let padding = (b.length % 5 == 0) ? 0 : 5 - (b.length % 5);
  for (let i = 0; i < padding; i++) b.push(0);

  let n = 0;
  let s = "";
  let b1, b2, b3, b4, b5, b6, b7, b8;

  // Take 5 bytes at a time
  for (let i = 0; i < b.length; i += 5) {

    // Convert to decimal
    n = b[i] * 256 ** 4 + b[i+1] * 256 ** 3 + b[i+2] * 256 ** 2 + b[i+3] * 256 + b[i+4];

    // Convert to base 32
    b1 = Math.floor(n / 32 ** 7);
    n = n - b1 * 32 ** 7;
    b2 = Math.floor(n / 32 ** 6);
    n = n - b2 * 32 ** 6;
    b3 = Math.floor(n / 32 ** 5);
    n = n - b3 * 32 ** 5;
    b4 = Math.floor(n / 32 ** 4);
    n = n - b4 * 32 ** 4;
    b5 = Math.floor(n / 32 ** 3);
    n = n - b5 * 32 ** 3;
    b6 = Math.floor(n / 32 ** 2);
    n = n - b6 * 32 ** 2;
    b7 = Math.floor(n / 32);
    b8 = n - b7 * 32;

    // Create string starting at ASCII 33
    s += enc[b1] + enc[b2] + enc[b3] + enc[b4] + enc[b5] + enc[b6] + enc[b7] + enc[b8];

  }

  // Padding character is =
  if (padding) s = s.slice(0, -1*padding);
  for (let i = 0; i < padding; i++) s += "=";

  return s;

}

/*
 * Base91 encodings
 */

export const  base91encodings = [
  { name: "Base91", value: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~\"" }
]

/*
 * Convert Base91 to buffer
 *
 * @param  string s   a string with valid base58 codes
 * @param  string enc encoding characters
 *
 * @return Uint8Array
 */

export function base91ToBuffer (s, enc = base91encodings[0].value) {
    
  if (s == "") return "";
  
  let len = s.length;
  let b = 0;
  let n = 0;
  let v = -1;
  let c = "";
  let bf = [];
  
  for (let i = 0; i < len; i++) {
  
    c = enc.indexOf(s[i]);
    
    if (c < 0) throw ("Invalid Base91");
    
    if (v < 0) {
      v = c;
    } else {
      v += c * 91;
      b |= v << n;
      n += (v & 8191) > 88 ? 13 : 14;
      do {
        bf.push (b & 255);
        b >>= 8;
        n -= 8;
      } while (n > 7);
      v = -1;
    }
    
  }
  
  if (v+1) bf.push(b | v << n & 255);
  return new Uint8Array(bf);
  
}

/*
 * Convert buffer to Base91
 *
 * @param  Uint8Array  b   binary buffer
 * @param  string      enc encoding characters
 *
 * @return string
 */

export function bufferToBase91 (b, enc = base91encodings[0].value) {
    
  if (b.length == 0) return "";
  
  let len = b.length;
  let bt = null;
  let n = 0;
  let v = 0;
  let s = "";
  
  for (let i = 0; i < len; i++) {
  
    bt |= b[i] << n;
    n += 8;
    
    if (n > 13) {
      v = bt & 8191;
      
      if (v > 88) {
        bt >>= 13;
        n -= 13;
      } else {
        v = bt & 16383
        bt >>= 14
        n -= 14;
      }
      s += enc[v % 91] + enc[Math.trunc(v / 91)];
    }
  }
  
  if (n) {
    s += enc[bt % 91];
    if (n > 7 || b > 90) s += enc[Math.trunc(bt / 91)];
  }
  
  return s;
  
}



