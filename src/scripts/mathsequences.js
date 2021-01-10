
/*
 * Decompose a number in primes and return an array
 *
 * @param integers  n the number to be factorized
 * @return array    an array with the prime factors
 *
 */
export function primeFactorization (n) {
    var a = [];

    // Get all the 2 factors
    while (n % 2 == 0) {
        a.push = 2;
        n /= 2;
    }

    // Get the other factors starting at 3
    var f = 3;
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
    var deler = 2;
    while (n % deler != 0) deler++;

    // Divide as many times as you can
    var k = 0;
    while (n % deler == 0) {
        n /= deler;
        k++;
    }

    // Add to string
    var s = "" + deler;
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
  var t;
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
	var n = start;
	var seq = "" + n;

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

  var dp = [];
  dp[1] = 1;
  var seq = dp[1];

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
  var seq = "" + seed;
  var s = "" + seed;
  for (let i = 1; i <= n; i++) {
    s = nextconway (s);
    seq += " " + s;
  }
  return { n: s, seq: seq };
}

function nextconway (t) {
  if (t == "") return "0";
  var r = "";
  var idx = 0;
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
  var s = "" + seed;
  var seq = "" + seed;
  for (let i = 1; i <= n; i++) {
    s = prevconway (s);
    seq += " " + s;
  }
  return { n: s, seq: seq };
}

function prevconway (t) {
  var r = "";
  if ((t.length % 2) == 1) return r;     // impossible
  var idx = 0;
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
  var seq = "12";
  var j = 13;
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
	var sum = 0;
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
  var seq = "1";
  var j = 2;
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
	var sum = 0;
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
  var seq = "1";
  var j = 2;
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
	var s = n.toString();
  var sum = 0
	for (let i = 0; i < s.length; i++) {
    sum += parseInt(s[i]);
	}
	return ((n % sum) == 0);
}

// export default {
//   lcm: lcm,
//   gcd: gcd,
//   primeFactorization: primeFactorization,
//   primeFactorizationString: primeFactorizationString
// }
