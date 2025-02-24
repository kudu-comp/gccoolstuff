
// See https://esolangs.org/wiki/Trivial_brainfuck_substitution
const BF_ORIGINAL = 0;
const BF_OOK = 1;
const BF_SPOON = 2;
const BF_ALPHUCK = 3;
const BF_BINARYFUCK = 4;
const BF_BLUB = 5;
const BF_PEWLANG = 6;
const BF_OOF = 7;
const BF_TERNARY = 8;
const BF_PIKALANG = 9;
const BF_REVERSEFUCK = 10;

export const vars = [
  "Brainfuck",
  "Ook!",
  "Spoon",
  "Alphuck",
  "Binaryfuck",
  "Blub",
  "Pewlang",
  "Oof",
  "Ternary",
  "Pikalang",
  "Reversefuck"
]

export function preprocess (code, sel) {
  
  const bfsub = [
    [">", "<", "+", "-", ".", ",", "[", "]"],
    ["OOK.OOK?", "OOK?OOK.", "OOK.OOK.", "OOK!OOK!", "OOK!OOK.", "OOK.OOK!", "OOK!OOK?", "OOK?OOK!"],
    ["010", "011", "1", "000", "001010", "0010110", "00100", "0011"],
    ["a", "c", "e", "i", "j", "o", "p", "s"],
    ["010", "011", "000", "001", "100", "101", "110", "111"],
    ["BLUB.BLUB?", "BLUB?BLUB.", "BLUB.BLUB.", "BLUB!BLUB!", "BLUB!BLUB.", "BLUB.BLUB!", "BLUB!BLUB?", "BLUB?BLUB!"],
    ["pew", "Pew", "pEw", "peW", "pEW", "PEw", "PeW", "PEW"],
    ["f", "of", "oof", "ooof", "oooof", "ooooof", "oooooof", "ooooooof"],
    ["01", "00", "11", "10", "20", "21", "02", "12"],
    ["pipi", "pichu", "pi", "ka", "pikachu", "pikapi", "pika", "chu"],
    ["<", ">", "-", "+", ",", ".", "]", "["]
  ];

  // Init
  let res = "";
  let words = [];
  
  // Preprocess input depending on the type do one or more of these
  // Convert to upper or lowercase
  // Remove all comments (any other character basically)
  switch (sel) {
    case BF_OOK:
      code = code.toUpperCase();
      for (let i = 0; i < code.length; i++)
        if ("0123456789OK.?!".indexOf(code[i]) >= 0) res += code[i];
      words = res.match(/[0-9]+|[.OK?!]{8}/g);
      break;
    case BF_SPOON:
      for (let i = 0; i < code.length; i++)
        if ("0123456789".indexOf(code[i]) >= 0) res += code[i];
      words = res.match(/1|010|011|000|0011|00100|001010|0010110|[2-9]+/g);
      break;
    case BF_ALPHUCK:
      code = code.toLowerCase();
      for (let i = 0; i < code.length; i++)
        if ("aceijops0123456789".indexOf(code[i]) >= 0) res += code[i];
      words = res.match(/a|c|e|i|j|o|p|s|[0-9]+/g);
      break;
    case BF_BINARYFUCK:
      // Skip initial 1
      for (let i = 1; i < code.length; i++)
        if ("0123456789".indexOf(code[i]) >= 0) res += code[i];
      words = res.match(/000|001|010|011|100|101|110|111|[2-9]+/g);
      break;
    case BF_BLUB:
      code  = code.toUpperCase();
      for (let i = 0; i < code.length; i++)
        if ("0123456789BLU.?!".indexOf(code[i]) >= 0) res += code[i];
      words = res.match(/[0-9]+|[.BLU?!]{10}/g);
      break;
    case BF_PEWLANG:
      for (let i = 0; i < code.length; i++)
        if ("0123456789pPeEwW".indexOf(code[i]) >= 0) res += code[i];
      words = res.match(/pew|Pew|pEw|peW|PEw|pEW|PeW|PEW|[0-9]+/g);
      break;
    case BF_OOF :
      code = code.toLowerCase();
      for (let i = 0; i < code.length; i++)
        if ("0123456789of".indexOf(code[i]) >= 0) res += code[i];
      words = res.match(/f|of|oof|ooof|oooof|ooooof|oooooof|ooooooof|[0-9]+/g);
      break;
    case BF_TERNARY:
      for (let i = 0; i < code.length; i++)
        if ("0123456789".indexOf(code[i]) >= 0) res += code[i];
      words = res.match(/[012]{2}|[3-9]+/g);
      break;
    case BF_PIKALANG:
      code = code.toLowerCase();
      for (let i = 0; i < code.length; i++)
        if ("0123456789pikachu \n\r\t".indexOf(code[i]) >= 0) res += code[i];
      words = res.match(/[pikachu]{2,7}[\s]+|[0-9]+\s*|[pikachu]{2,7}$/g);
      words = words.map( w => w.trim());
      break;
    case BF_REVERSEFUCK:
      for (let i = 0; i < code.length; i++)
        if ("0123456789><+-.,[]".indexOf(code[i]) >= 0) res += code[i];
      words = res.match(/[0-9]+|[><+-.,\[\]]/g);
      break;
    default:
      // Just remove comments and return clean code
      for (let i = 0; i < code.length; i++)
        if ("0123456789><+-.,[]".indexOf(code[i]) >= 0) res += code[i];
      return res;    
  }

  // Replace substitutes and return original Brainfuck code  
  let pos = 0;
  res = "";
  
  for (let w of words) {
    console.log(w);
    pos = bfsub[sel].indexOf(w);
    if (pos >= 0)
      res += bfsub[BF_ORIGINAL][pos];
    else
      res += w;
  }

  return res;
}

export function extendshorthand (bfcode) {
  
  let result = "";
  let lastop = "";
  let count = "";

  for (let i = 0; i < bfcode.length; i++) {

    if ("+-><[].,dilr".indexOf(bfcode[i]) >= 0) {
      result += bfcode[i];
      lastop = bfcode[i];
    } else if ("0123456789".indexOf(bfcode[i]) >= 0) {
      
      count = bfcode[i++];
      while ("0123456789".indexOf(bfcode[i]) >= 0 && i < bfcode.length) {
        count += bfcode[i++];
      }

      for (let j = 0; j < parseInt(count) - 1; j++) result += lastop;
      i--;
      
    } else {
      throw ("Illegal operator " + bfcode[i]);
    }

  }

  return result;

}

export function run (bfcode, input) {

  // Init
  let result = "";
  let regs = [0];
  let current = 0;
  let brackets = [];
  
  // Read inputs
  let inputs = input.match(/[0-9]+/g);
  let nextinput = 0;
  
  for (let i = 0; i < bfcode.length; i++) {

    switch (bfcode[i]) {        
      case '+' :
      case 'i' :

        // Increment current register
        regs[current]++;
        break;

      case '-' :
      case 'd' :

        // Decrement current register
        regs[current]--;
        break;

      case '>' :
      case 'r' :

        // Current register one to the right
        current++;
        if (current == regs.length) regs.push(0);
        break;

      case '<' :
      case 'l' :

        // Current register one to the left
        if (current > 0) current--; else throw("Illegal register");
        break;

      case '.' :

        // Print current register
        result += String.fromCharCode(regs[current]);
        break;

      case ',' :

        // Read input in current register
        if (nextinput >= inputs.length) throw("Not enough inputs");
        regs[current] = inputs[nextinput++];
        break;

      case '[' :

        // Start loop if current register 0 go to end of loop
        brackets.push(i);
        if (regs[current] == 0) {
            // Find next ]
            while (bfcode[i] != "]" && i < bfcode.length) i++;
            brackets.pop();
        }
        break;

      case ']' :

        // Next iteration of loop or exit if current register is 0
        if (regs[current] != 0) {
          i = brackets[brackets.length-1];
        } else {
          brackets.pop();          
        }
        break;

      default :

        // Throw error on illegal command
        throw("Illegal command" + bfcode[i]);

    }      
  }

  // console.log(regs);
  // Return output
  return result;
  
}