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
  console.log(dp[n], seq);
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
  console.log(n, max);
  if (n === 0 && max > 0) n = Number.MAX_SAFE_INTEGER;
  if (n > 0 && max === 0) max = Number.MAX_SAFE_INTEGER;
  console.log(n, max);

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

export function isevil (n) {
  if (n === "") return false;
  if (n === 0) return true;
  return n.toString(2).match(/1/g).length % 2 === 0;
}

export function isodious (n) {
  if (n === "" || n === 0) return false;
  return n.toString(2).match(/1/g).length % 2 === 1;
}

export function issquarefree (n) {
  // Niet deelbaar door kwadraat > 1
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i ** 2 === 0) return false;
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

export function ispowerful (n) {
  // Powerful, For every prime p dividing n, p**2 also divides n
  let h = primeFactorization(n);
  for (let i = 0; i < h.length; i++) {
    if (n % h[i] ** 2 !== 0) return false;
  }
  return true;
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

export function islucky (n) {
  let h = [];
  for (let i = 1; i <= n; i++) h.push(i);
  let cnt = 1;
  let sieve = h[1];
  while (h[sieve] < n && h[h.length - 1] === n) {
    let h1 = [];
    for (let i = 0; i < h.length; i++) {
      if ((i + 1) % sieve !== 0) {
        h1.push(h[i]);
      } else if (h[i] === n) {
        return false;
      }
    }
    sieve = h1[cnt++];
    h = [...h1];
  }
  return h[h.length - 1] === n;
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

export function ishappy (n) {
	// Check if number is happy, see wiki for explanation
	let str = n.toString();
	let mem = [];
	while (true) {
		let sum = 0;
		for (let i = 0; i < str.length; i++) {
			sum = sum + str[i]**2;
		}
		if (sum === 1) return true;
		if (mem.indexOf(sum) >= 0) return false;
		mem.push(sum);
		str = sum.toString();
	}
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