
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

/*
 * Decompose a number in primes and return an array
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
 * Find the least common multiple
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
 *
 * @return object     object with n (the number) and seq (a string)
 */
export function hailstone (start, count) {

	// If n is even, divide it by 2.
	// If n is odd, multiply it by 3 and add 1;
	let n = start;
	let seq = "" + n;

	for (let i = 1; i <= count; i++) {
		if ((n % 2) == 0) {
			n = n /2 ;
		} else {
			n = 3 * n + 1;
		}
		seq += " " + n;
	}
	return { n : n, seq : seq }

}

/*
 * Generate the Golomb sequence
 *
 * @param integer     n   number on position
 *
 * @return object     object with n (the number) and seq (a string)
 */
 export function golomb (n) {
	// The recurrence relation to find the nth term of Golomb sequence:
	// a(1) = 1
	// a(n + 1) = 1 + a(n + 1 – a(a(n)))

  let dp = [];
  dp[1] = 1;
  let seq = dp[1];

  // Finding and printing first
  // n terms of Golomb Sequence.
  for (let i = 2; i <= n; i++)
  {
      dp[i] = 1 + dp[i - dp[dp[i - 1]]];
      seq += " " + dp[i] ;
  }
	return { n: dp[n], seq : seq }

}


/*
 * Generate the Conway sequence
 *
 * @param integer     seed   number to start with
 * @param integers    n      number of iterations
 *
 * @return object     object with n (the number) and seq (a string)
 */
export function conway (seed, n) {
  let seq = "" + seed;
  let s = "" + seed;
  for (let i = 1; i <= n; i++) {
    s = nextconway (s);
    seq += " " + s;
  }
  return { n: s, seq: seq };
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
 */
export function revconway (seed, n) {
  let s = "" + seed;
  let seq = "" + seed;
  for (let i = 1; i <= n; i++) {
    s = prevconway (s);
    seq += " " + s;
  }
  return { n: s, seq: seq };
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
 * Generate the reverse Conway sequence
 *
 * @param integers    n      number of iterations
 *
 * @return object     object with n (the number) and seq (a string)
 */
export function abundant(n) {
  // The first abundant number is 12
  let seq = "12";
  let j = 13;
  for (let i = 1; i < n; i++) {
    while ( !isabundant(j) ) j++;
    seq += " " + j;
    j++;
  }
  return { n: --j, seq: seq };
}

function isabundant (n) {
	// Check if number is abundant
	// sigma(n) > 2n, where sigma(n) is the sum of the divisors of n
	let sum = 0;
	for (let i = 1; i<=n; i++) {
		if ((n % i) == 0) sum = sum + i;
	}
	return (sum > 2*n);
}

/*
 * Generate the reverse Conway sequence
 *
 * @param integers    n      number of iterations
 *
 * @return object     object with n (the number) and seq (a string)
 */
export function deficient(n) {
  let seq = "1";
  let j = 2;
  for (let i = 1; i < n; i++) {
    while ( !isdeficient(j) ) j++;
    seq += " " + j;
    j++;
  }
  return { n: --j, seq: seq };
}

function isdeficient (n) {
	// Check if number is deficient
	// sigma(n) < 2n, where sigma(n) is the sum of the divisors of n
	let sum = 0;
	for (let i = 1; i<=n; i++) {
		if ((n % i) == 0) sum = sum + i;
	}
	return (sum < 2*n);
}

/*
 * Generate the Niven or Harshad sequence
 *
 * @param integers    n      number of iterations
 *
 * @return object     object with n (the number) and seq (a string)
 */
export function niven(n) {
  let seq = "1";
  let j = 2;
  for (let i = 1; i < n; i++) {
    while ( !isniven(j) ) j++;
    seq += " " + j;
    j++;
  }
  return { n: --j, seq: seq };
}

function isniven (n) {
	// Check if number is divisable by the sum of its digits
	// sigma(n) < 2n, where sigma(n) is the sum of the divisors of n
	let s = n.toString();
  let sum = 0
	for (let i = 0; i < s.length; i++) {
    sum += parseInt(s[i]);
	}
	return ((n % sum) == 0);
}

/*
 * Check if the number is prime
 *
 * @param integer    n      number to check
 *
 * @return boolean   whether n is prime or not
 * *
 */
export function checkprime (n) {

  console.log(n);

  // 0 and 1 are not prime
  if (n < 2) return false;

  // Simple algorithm
  let max = Math.floor(Math.sqrt(n));
  for (let i = 2; i <= max; i++) {
    if (n % i == 0) return false
  }

  return true;

}

// export default {
//   lcm: lcm,
//   gcd: gcd,
//   primeFactorization: primeFactorization,
//   primeFactorizationString: primeFactorizationString
// }
