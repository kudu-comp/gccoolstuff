
export const formats = {

  code:  ["0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111"],
  plus:  "1100",
  minus: "1101",
  
  vars : [
    {  name:  "BCD (Natural)", char:  ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "+", "-", "+", "+"]  },
    {  name:  "BCD (7421)",    char:  ["0", "1", "2", "3", "4", "5", "6", "x", "7", "8", "9", "x", "x", "x", "x", "x"]  },
    {  name:  "BCD (4221)",    char:  ["0", "1", "2", "3", "4", "5", "6", "x", "7", "8", "9", "x", "x", "x", "x", "x"]  },
    {  name:  "Aiken (2421)",  char:  ["0", "1", "2", "3", "x", "x", "4", "5", "x", "x", "x", "x", "6", "7", "8", "9"]  },
    {  name:  "Excess-3",      char:  ["x", "x", "x", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "x", "x", "x"]  },
    {  name:  "Excess-6",      char:  ["x", "x", "x", "x", "x", "x", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]  },
    {  name:  "Gray",          char:  ["0", "1", "3", "2", "6", "7", "5", "4", "x", "x", "x", "x", "8", "9", "x", "x"]  },
    {  name:  "Glixon",        char:  ["0", "1", "3", "2", "6", "7", "5", "4", "9", "x", "x", "x", "8", "x", "x", "x"]  },
    {  name:  "LARC",          char:  ["0", "1", "x", "2", "x", "x", "4", "3", "5", "6", "x", "7", "x", "x", "8", "9"]  },
    {  name:  "Lucal",         char:  ["0", "x", "x", "1", "x", "3", "2", "x", "8", "7", "6", "9", "4", "x", "x", "5"]  },
    {  name:  "Magnetic tape", char:  ["x", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "x", "x", "x", "x", "x"]  }
  ]

}

export function code2BCD (s, format = 0, packed = false, fill = "") {

  let res = "";  
  let pos = 0;
  
  for (let i=0; i < s.length; i++) {
    pos = formats.vars[format].char.indexOf(s[i]);
    if (pos) {
      if (!packed) {
        res += fill + formats.code[pos] + " ";
      } else {
        res += formats.code[pos];
        if (i % 2 == 1) res += " ";
      }
    }
  }

  // Remove last space if any
  return (res[res.length-1] == " ") ? res.slice(0,-1) : res;
}

export function BCD2Code (s, format = 0, packed = false, fill = "") {

  let res = "";  
  let pos = 0;
  let nums = [];
  let temp = [];
  
  if (packed) {
    temp = s.match(/[0-1]{8}/g);
    for (let t of temp) {
      nums.push(t.slice(0,4));
      nums.push(t.slice(4));
    }
  } else if (fill) {
    temp = s.match(/[0-1]{8}/g);
    for (let t of temp) nums.push(t.slice(4));
  } else {
    nums = s.match(/[0-1]{4}/g);
  }

  for (let n of nums) {
    pos = formats.code.indexOf(n);
    if (pos >= 0) res += formats.vars[format].char[pos];
  }

  // Remove last space if any
  return res;
  
}