/* 
 * A library of math functions
 * Check if a number has a certain property, e.g. prime or deficient
 * Generate some common math sequences
 * Calculate gcd and lcm and prime factors
 *
 */

export const sequences = [
  { name: "Hailstone", func: hailstone, ref: "hailstone"},
  { name: "Conway", func: conway, ref: "conway"},
  { name: "Reverse Conway", func: revconway, ref: "revconway"},
  { name: "Golomb", func: golomb, ref: "golomb"},
  { name: "Abundant", func: abundant, ref: "abundant"},
  { name: "Deficient", func: deficient, ref: "deficient"},
  { name: "Niven", func: niven, ref: "niven"},
  { name: "Kaprekar", func: kaprekar, ref: "kaprekar"},
  { name: "Palindrome", func: palindrome, ref: "palindrome"}
];

export const numprops = [
  { name: "Odd or even", ref: "oddoreven", group: true},
  { name: "Even numbers", ref: "even", func: function(n) { return n % 2 === 0; }, value: false},
  { name: "Odd numbers", ref: "odd",  func: function(n) { return n % 2 === 1; }, value: false},
  // Prime related properties
  { name: "Primes and so on", ref: "primerel", group: true},
  { name: "Prime", ref: "prime",func: function(n) { return checkprime(n); }, value: false},
  { name: "Composite numbers", ref: "comp",func: function(n) { return !checkprime(n); }, value: false},
  { name: "Biprimes", ref: "bi",func: function(n) { return isbiprime(n); }, value: false},
  // Properties related to divisors
  { name: "Divisor related", ref: "divrel", group: true},
  { name: "Abundant", ref: "abun", func: function(n) { return isabundant(n); }, value: false},
  { name: "Perfect", ref: "perfect", func: function(n) { return isperfect(n); }, value: false},
  { name: "Deficient", ref: "defi",  func: function(n) { return isdeficient(n); }, value: false},
  { name: "Powerful", ref: "pow", func: function(n) { return ispowerful(n); }, value: false},
  { name: "Squarefree", ref: "sqfree", func: function(n) { return issquarefree(n); }, value: false},
  // Properties related to 2D shapes or polygonal numbers
  { name: "Polygonal numbers", ref: "polygonal", group: true},
  { name: "Triangular", ref: "tri", func: function(n) { return istriangular(n); }, value: false},
  { name: "Square", ref: "squa", func: function(n) { return issquare(n); }, value: false},
  { name: "Pentagonal", ref: "penta", func: function(n) { return ispentagonal(n); }, value: false},
  { name: "Hexagonal", ref: "hexa", func: function(n) { return ishexagonal(n); }, value: false},
  { name: "Heptagonal", ref: "hepta", func: function(n) { return isheptagonal(n); }, value: false},
  { name: "Octagonal", ref: "octa", func: function(n) { return isoctagonal(n); }, value: false},
  { name: "Nonagonal", ref: "nona", func: function(n) { return isnonagonal(n); }, value: false},
  { name: "Decagonal", ref: "deca", func: function(n) { return isdecagonal(n); }, value: false},
  { name: "Star", ref: "star", func: function(n) { return isstar(n); }, value: false},
  // Properties related to binary form
  { name: "Binary related", ref: "binrel", group: true},
  { name: "Evil numbers", ref: "evil", func: function(n) { return isevil(n); }, value: false},
  { name: "Odious numbers", ref: "odious", func: function(n) { return isodious(n); }, value: false},
  // Properties related to 3D shapes or polyhedral nunbers
  { name: "Polyhedral numbers", ref: "polyhedral", group: true},
  { name: "Tetrahedral", ref: "tethed", func: function(n) { return istetrahedral(n); }, value: false},
  { name: "Square pyramidal", ref: "sqpyr", func: function(n) { return issquarepyramidal(n); }, value: false},
  { name: "Cubic", ref: "cube", func: function(n) { return iscube(n); }, value: false},
  // Various other properties 
  { name: "Other number properties", ref: "others", group: true},
  { name: "Fibonacci", ref: "fib", func: function(n) { return isfibonacci(n); }, value: false},
  { name: "Palindrome", ref: "pal", func: function(n) { return ispalindrome(n); }, value: false},
  { name: "Narcistic", ref: "narc", func: function(n) { return isnarcistic(n); }, value: false},
  { name: "Niven", ref: "niven", func: function(n) { return isniven(n); }, value: false},
  { name: "Kaprekar", ref: "kap", func: function(n) { return iskaprekar(n); }, value: false},
  { name: "Lucky", ref: "lucky", func: function(n) { return islucky(n); }, value: false},
  { name: "Happy", ref: "happ", func: function(n) { return ishappy(n); }, value: false},
  { name: "Aspiring", ref: "asp", func: function(n) { return isaspiring(n); }, value: false},
]

/*
 * Check if the number is prime
 *
 * @param integer    n      number to check
 *
 * @return boolean   whether n is prime or not
 * 
 */
export function checkprime (n) {

  // 0 and 1 are not prime
  if (n < 2) return false;

  // Simple algorithm
  let max = Math.floor(Math.sqrt(n));
  for (let i = 2; i <= max; i++) {
    if (n % i == 0) return false
  }

  return true;

}

/*
 * Decompose a number in primes and return an array
 *
 * @param integers  n the number to be factorized
 * @return array    an array with the prime factors
 *
 */
export function primeFactorization (n) {
  
    if (n === 0) return [0];

    let a = [];

    // Get all the 2 factors
    while (n % 2 == 0) {
        a.push(2);
        n /= 2;
    }

    // Get the other factors starting at 3
    let f = 3;
    while (f * f <= n) {
        if (n % f == 0) {
            a.push(f);
            n /= f;
        } else {
            f += 2;
        }
    }

    //  If the remainder is greater than 1 that's also a prime factor
    if (n !== 1) a.push(n);

    // Return the array
    return a;
}

export function isbiprime (n) {
  // Check if number is biprime
  // A biprime is a number that is the product of two prime numbers
  let a = primeFactorization(n);
  return a.length === 2;
}

/*
 * Decompose a number in primes and return a string
 *
 * @param integers  n the number to be factorized
 * @return string   a string with prime factors
 *
 */
export function primeFactorizationString (n) {

    // Vind deler
    let deler = 2;
    while (n % deler != 0) deler++;

    // Divide as many times as you can
    let k = 0;
    while (n % deler == 0) {
        n /= deler;
        k++;
    }

    // Add to string
    let s = "" + deler;
    if (k > 1) s += '^' + k;

    // Repeat with remaining number
    if (n > 1) s += " * " + primeFactorizationString(n);
    return s;
}

/*
 * Find the greatest common divisor of two numbers
 *
 * @param integer     a,b
 * @return integer    the gcd
 *
 */
export function gcd (a, b) {
  let t;
	while (b != 0 ) {
    t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/*
 * Find the least common multiple of two numbers
 *
 * @param integers  a, b
 * @return array    the lcm
 *
 */
export function lcm(a, b) {
	if (a == 0 && b == 0) return 0;
	return Math.abs(a * b) / gcd(a,b);
}

/*
 * Generate the Hailstone number
 *
 * @param integer     start   startpoint
 * @param integer     count   number of iterations
 * @param integer     max     maximum number
 *
 * @return object     object with n (the number) and seq (a string)
 * 
 */
export function hailstone (start, count, max, stopend) {

	// If n is even, divide it by 2.
	// If n is odd, multiply it by 3 and add 1;
	let n = start;
	let seq = "" + n;
  let cnt = 0;
  if (count === 0 && max > 0) count = Number.MAX_SAFE_INTEGER;
  if (count > 0 && max === 0) max = Number.MAX_SAFE_INTEGER;
  if (stopend) {
    max = Number.MAX_SAFE_INTEGER;
    count = Number.MAX_SAFE_INTEGER;
  }

	for (let i = 1; i <= count; i++) {
		if ((n % 2) == 0) {
			n = n /2 ;
		} else {
			n = 3 * n + 1;
		}
		seq += " " + n;
    cnt++;
    if (n >= max) break;
    if (n ===1 && stopend) break;
	}
	return { n : n, cnt: cnt, seq : seq }

}

/*
 * Generate the Golomb sequence
 *
 * @param integer     n   number on position
 * @param integer     max number of iterations
 *
 * @return object     object with n (the number) and seq (a string)
 * 
 */
 export function golomb (n, max) {
	// The recurrence relation to find the nth term of Golomb sequence:
	// a(1) = 1
	// a(n + 1) = 1 + a(n + 1 – a(a(n)))

  if (n === 0 && max > 0) n = Number.MAX_SAFE_INTEGER;
  if (n > 0 && max === 0) max = Number.MAX_SAFE_INTEGER;
  let dp = [];
  dp[1] = 1;
  let seq = dp[1];
  let cnt = 1;

  // Finding and printing first
  // n terms of Golomb Sequence.
  for (let i = 2; i <= n; i++)
  {
      dp[i] = 1 + dp[i - dp[dp[i - 1]]];
      seq += " " + dp[i] ;
      cnt++;
      if (dp[i] >= max) break;
  }
	return { n: dp[cnt], cnt: cnt, seq : seq }

}


/*
 * Generate the Conway sequence
 *
 * @param integer     seed   number to start with
 * @param integers    n      number of iterations
 * @param integers    max    maximum number
 *
 * @return object     object with n (the number) and seq (a string)
 * 
 */
export function conway (seed, n, max) {
  let seq = "" + seed;
  let s = "" + seed;
  let cnt = 0;
  if (n === 0 && max > 0) n = 50;
  for (let i = 1; i <= n; i++) {
    s = nextconway (s);
    seq += " " + s;
    cnt++;
    if (max !== 0 && s >= max) break;
  }
  return { n: s, cnt: cnt, seq: seq };
}

function nextconway (t) {
  if (t == "") return "0";
  let r = "";
  let idx = 0;
  while (idx < t.length) {
    let i=0;
    while ( (idx + i < t.length) && (t[idx+i] == t[idx]) ) i++;
    r = r + i + t[idx];
    idx += i;
  }
  return r;
}

/*
 * Generate the reverse Conway sequence
 *
 * @param integer     seed   number to start with
 * @param integers    n      number of iterations
 *
 * @return object     object with n (the number) and seq (a string)
 * 
 */
export function revconway (seed, n, max) {
  let s = "" + seed;
  let seq = "" + seed;
  let cnt = 0;
  if (n === 0 && max > 0) n = 50;
  for (let i = 1; i <= n; i++) {
    s = prevconway (s);
    seq += " " + s;
    cnt++;
    if (max !== 0 && parseInt(s) >= max) break;
    if (s === "1") break;
  }
  return { n: s, cnt: cnt, seq: seq };
}

function prevconway (t) {
  let r = "";
  if ((t.length % 2) == 1) return r;     // impossible
  let idx = 0;
  while (idx < t.length) {
      for (let i=0; i < t[idx]; i++)
        r += t[idx+1];
      idx += 2;
  }
  return r;
}

/*
 * Generate the abundant sequence
 *
 * @param integers    n      number of iterations
 * @param integers    max    maximum number
 *
 * @return object     object with n (the number) and seq (a string)
 * 
 */
export function abundant(n, max) {
  // The first abundant number is 12
  let seq = "12";
  let j = 13;
  let cnt = 0;
  if (n === 0 && max > 0) n = Number.MAX_SAFE_INTEGER;
  if (n > 0 && max === 0) max = Number.MAX_SAFE_INTEGER;

  for (let i = 1; i < n; i++) {
    while ( !isabundant(j) ) j++;
    seq += " " + j;
    j++;
    cnt++;
    if (j >= max+1) break;
  }
  return { n: --j, cnt: cnt, seq: seq };
}

export function isabundant (n) {
	// Check if number is abundant
	// sigma(n) > 2n, where sigma(n) is the sum of the divisors of n
	let sum = 0;
	for (let i = 1; i<=n; i++) {
		if ((n % i) == 0) sum = sum + i;
	}
	return (sum > 2*n);
}

/*
 * Generate the deficient sequence
 *
 * @param integers    n      number of iterations
 *
 * @return object     object with n (the number) and seq (a string)
 * 
 */
export function deficient(n, max) {
  let seq = "1";
  let j = 2;
  let cnt = 0;
  if (n === 0 && max > 0) n = Number.MAX_SAFE_INTEGER;
  if (n > 0 && max === 0) max = Number.MAX_SAFE_INTEGER;

  for (let i = 1; i < n; i++) {
    while ( !isdeficient(j) ) j++;
    seq += " " + j;
    j++;
    cnt++;
    if (j >= max+1) break;
  }
  return { n: --j, cnt: cnt, seq: seq };
}

export function isdeficient (n) {
	// Check if number is deficient
	// sigma(n) < 2n, where sigma(n) is the sum of the divisors of n
	let sum = 0;
	for (let i = 1; i<=n; i++) {
		if ((n % i) == 0) sum = sum + i;
	}
	return (sum < 2*n);
}

/*
 * Generate the deficient sequence
 *
 * @param integers    n      number of iterations
 *
 * @return object     object with n (the number) and seq (a string)
 * 
 */
export function perfect(n, max) {
  let seq = "1";
  let j = 2;
  let cnt = 0;
  if (n === 0 && max > 0) n = Number.MAX_SAFE_INTEGER;
  if (n > 0 && max === 0) max = Number.MAX_SAFE_INTEGER;

  for (let i = 1; i < n; i++) {
    while ( !isperfect(j) ) j++;
    seq += " " + j;
    j++;
    cnt++;
    if (j >= max+1) break;
  }
  return { n: --j, cnt: cnt, seq: seq };
}

export function isperfect (n) {
	// Check if number is deficient
	// sigma(n) < 2n, where sigma(n) is the sum of the divisors of n
	let sum = 0;
	for (let i = 1; i<=n; i++) {
		if ((n % i) == 0) sum = sum + i;
	}
	return (sum === 2*n);
}

/*
 * Generate the Niven or Harshad sequence
 *
 * @param integers    n      number of iterations
 *
 * @return object     object with n (the number) and seq (a string)
 * 
 */
export function niven(n, max) {
  let seq = "1";
  let j = 2;
  let cnt = 0;
  if (n === 0 && max > 0) n = Number.MAX_SAFE_INTEGER;
  if (n > 0 && max === 0) max = Number.MAX_SAFE_INTEGER;

  for (let i = 1; i < n; i++) {
    while ( !isniven(j) ) j++;
    seq += " " + j;
    j++;
    cnt++;
    if (j >= max+1) break;
  }
  return { n: --j, cnt: cnt, seq: seq };
}

export function isniven (n) {
	// Check if number is divisable by the sum of its digits
	let s = n.toString();
  let sum = 0
	for (let i = 0; i < s.length; i++) {
    sum += parseInt(s[i]);
	}
	return ((n % sum) == 0);
}

/*
 * Generate the Kaprekar sequence
 * Sort the digits of the number in ascending and descending order
 * Substract the two numbers and see if we get the original number
 *
 * @param integers    n      max number of iterations
 * @param integers    max    maximum number
 * @param boolean     stop   stop at defined end of range
 *
 * @return object     object with n (the number) and seq (a string)
 * 
 */
export function kaprekar(start, n, max, stop) {
  let seq = "";
  let prevnr = 0;
  let currnr = start;
  let cnt = 0;
  if (n === 0 && max > 0) n = 10000;
  if (n > 0 && max === 0) max = Number.MAX_SAFE_INTEGER;
  if (stop) {
    n = 10000;
    max = Number.MAX_SAFE_INTEGER;
  }
  for (let i = 0; i < n; i++) {
    prevnr = currnr;
    cnt++;
    let n1 = parseInt([...currnr.toString()].sort().join(""));
    let n2 = parseInt([...currnr.toString()].sort().reverse().join(""));
    currnr = n2 - n1;
    seq += n2 + " - " + n1 + " = " + currnr + "<br>";
    if (stop && prevnr === currnr) break;
    if (!stop && currnr >= max) break;
  }
  if (currnr !== prevnr) seq = "No Kaprekar sequence found.<br>" + seq;
  return { n: currnr, cnt, cnt, seq: seq.slice(0,-4) };
}

export function iskaprekar (n) {
	// Check if number is kaprekar
	let n1 = parseInt([...n.toString()].sort().join(""));
  let n2 = parseInt([...n.toString()].sort().reverse().join(""));
  return n === Math.abs(n1 - n2);
}

/*
 * Generate the Kaprekar sequence
 * Sort the digits of the number in ascending and descending order
 * Substract the two numbers and see if we get the original number
 *
 * @param integers    start  start number
 * @param integers    n      max number of iterations
 * @param integers    max    maximum number
 * @param boolean     stop   stop at defined end of range
 *
 * @return object     object with n (the number) and seq (a string)
 * 
 */
export function palindrome(start, n, max, stop) {
  let seq = "";
  let cnt = 0;
  let fnd = false;
  let fndpos = 0;
  if (n === 0 && max > 0) n = 10000;
  if (n > 0 && max === 0) max = Number.MAX_SAFE_INTEGER;
  if (stop) {
    n = 10000;
    max = Number.MAX_SAFE_INTEGER;
  }
  for (let i = 0; i < n; i++) {
    cnt++;
    let h = parseInt([...start.toString()].reverse().join(""));
    start += h
    if (!stop && start >= max) break;
    seq += (start - h) + " + " + h + " = " + start + "<br>";
    if (fnd || ispalindrome(start)) {
      if (!fnd) {
        fndpos = cnt;
        fnd = true;
      }
    };
    if (stop && fnd) break;
  }
  if (!fnd) seq = "No palindrome sequence found.<br>" + seq;
  if (fnd) seq = "Palindrome number found after " + fndpos + " iterations.<br>" + seq;
  return { n: start, cnt, cnt, seq: seq.slice(0,-4) };
}

export function ispalindrome (n) {
	// Check if number is palindrome
	let h = parseInt([...n.toString()].reverse().join(""));
  return n === h;
}

/*
 * Check if a number has a certain property
 *
 * @param integers    n      max number of iterations
 *
 * @return boolean    whether n has the property or not
 * 
 */

export function isevil(n) {
  let count = 0;
  let temp = n;
  while (temp > 0) {
    temp &= (temp - 1); // Clears the least significant bit set to 1
    count++;
  }
  return count % 2 === 0;
}

export function isodious (n) {
  return !isevil(n);
}

export function issquarefree(n) {
  if (n % 4 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % (i * i) === 0) return false;
  }
  return true;
}

export function isnarcistic (n) {
  // n is de som van elk digit tot de macht van het aantal digits
  let s = n.toString();
  let cnt = 0;
  for (let i = 0; i < s.length; i++) {
    cnt += s[i] ** s.length;
  }
  return cnt === n;
}

export function istriangular (n) {
  // n is triangular in de reeks n + (n+1)
  // the testen met 8x+1 = een square
  if (n < 1) return false;
  let h = Math.sqrt(8 * n + 1);
  return Math.floor(h) === h;
}

export function issquare (n) {
  // n is square in de reeks n*n
  if (n < 1) return false;
  return Math.floor(Math.sqrt(n)) ** 2 === n;
}

export function ispentagonal (n) {
  if (n < 1) return false;
  let h = Math.sqrt(24 * n + 1);
  return Math.floor(h) === h && h % 6 === 5;
}

export function ishexagonal (n) {
  if (n < 1) return false;
  let h = (Math.sqrt(8 * n + 1) + 1) / 4;
  return Math.floor(h) === h;
}

export function isheptagonal (n) {
  if (n < 1) return false;
  let h = (Math.sqrt(40 * n + 9) + 3) / 10;
  return Math.floor(h) === h;
}

export function isoctagonal (n) {
  if (n < 1) return false;
  let h = (Math.sqrt(3 * n + 1) + 1) / 3;
  return Math.floor(h) === h;
}

export function isnonagonal (n) {
  if (n < 1) return false;
  let h = (Math.sqrt(56 * n + 25) + 5) / 14;
  return Math.floor(h) === h;
}

export function isdecagonal (n) {
  if (n < 1) return false;
  let h = (Math.sqrt(16 * n + 9) + 3) / 8;
  return Math.floor(h) === h;
}

export function ispowerful(n) {
  if (n === 1) return true;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      let count = 0;
      while (n % i === 0) {
        count++;
        n /= i;
      }
      if (count < 2) return false; // If a prime divides n, its square must also divide n
    }
  }
  return n === 1; // If n > 1 now, it's a prime factor with power 1
}

export function iscube(n) {
  let h = Math.cbrt(n);
  return Math.floor(h) === h;
}

export function istetrahedral (n) {
  let h = 1;
  let tot = 1;
  let cnt = 1;
  while (tot < n) {
    cnt++;
    h += cnt;
    tot += h;
  }
  return tot === n;
}

export function issquarepyramidal (n) {
  let h = 1;
  let tot = 1;
  let cnt = 1;
  while (tot < n) {
    cnt++;
    h = cnt * cnt;
    tot += h;
  }
  return tot === n;
}

export function islucky(n) {
    // Cache to store the lucky numbers we've found so far to use as future sieves.
    // For n = 10^9, we only need to find ~31,000 lucky numbers, which is tiny.
    const luckyCache = [1, 3];

    // Helper to find the next lucky number to be used as a sieve
    function getNextSieve(index) {
        if (index < luckyCache.length) return luckyCache[index];

        let candidate = luckyCache[luckyCache.length - 1] + 2;
        while (true) {
            let p = candidate;
            // Does 'candidate' survive the first sieve (2)?
            if (p % 2 !== 0) {
                p -= Math.floor(p / 2);
                let survived = true;
                // Does it survive all subsequent lucky number sieves?
                for (let i = 1; i < luckyCache.length; i++) {
                    let s = luckyCache[i];
                    if (s > p) break;
                    if (p % s === 0) { survived = false; break; }
                    p -= Math.floor(p / s);
                }
                if (survived) {
                    luckyCache.push(candidate);
                    return candidate;
                }
            }
            candidate += 2;
        }
    }

    // --- Main Logic ---
    let position = n;

    // 1. First step: Sieve by 2 (removes even numbers)
    if (position % 2 === 0) return false;
    position -= Math.floor(position / 2);

    // 2. Subsequent steps: Sieve by lucky numbers L_2, L_3, L_4...
    let sieveIndex = 1; // luckyCache[1] is 3
    while (true) {
        let sieveValue = getNextSieve(sieveIndex);

        // If the current sieve value is greater than n's current position, 
        // n will never be hit/removed by any future sieves.
        if (sieveValue > position) return true;

        // If n's position is a multiple of the sieveValue, it's removed.
        if (position % sieveValue === 0) return false;

        // Update position for the next round
        position -= Math.floor(position / sieveValue);
        sieveIndex++;
    }
}

export function isstar (n) {
  // Centered polyonal number for n = 12 (dodecagonal)
  let h = 0;
  while (6 * h * (h - 1) + 1 < n) h++;
  return 6 * h * (h - 1) + 1 === n;
}

export function isaspiring (n) {
	let aspiringNumbers = [25, 95, 119, 143, 417, 445, 565, 608, 650, 652, 675, 685, 783, 790, 909, 913];
	return aspiringNumbers.indexOf (n) >= 0;
}

export function ishappy(n) {
  let mem = new Set();
  while (n !== 1 && !mem.has(n)) {
    mem.add(n);
    let sum = 0;
    while (n > 0) {
      let digit = n % 10;
      sum += digit * digit;
      n = Math.floor(n / 10);
    }
    n = sum;
  }
  return n === 1;
}

export function isfibonacci(n) {
  // Check if number is fibonacci
  let h0 = 1;
  let h1 = 1;
  while (h1 < n) {
    let h2 = h0 + h1;
    h0 = h1;
    h1 = h2;
  }
  return h1 === n;
}