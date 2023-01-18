
/**
 *
 */

var qthlocator = {
  qth2wgs: qth2wgs,
  wgs2qth: wgs2qth
};


/**
 * Conversion of QTH to coordinates.
 *
 * @param {string} s  the QTH or Maidenheadlocator string
 * @return {array} with longitude at [0] and latitude at [1]
 */

function qth2wgs (s = "") {

	if (s.length < 2) return "Maidenhead locator must be at least 2 characters";
	if (s.length % 2 == 1) return "Maidenhead locator must be an even number of characters";

	let base0 = 18;
	let factorlon = 360 / base0;
	let factorlat = 180 / base0;

	let lon = factorlon * (s.codePointAt(0) - 'A'.codePointAt(0)) - 180;
	let lat = factorlat * (s.codePointAt(1) - 'A'.codePointAt(0)) - 90;

	let b = 10;

	for (let i = 2; i < s.length; i += 2) {

		factorlon /= b;
		factorlat /= b;

		if (b == 10) {
			lon += factorlon * (s.codePointAt(i) - '0'.codePointAt(0));
			lat += factorlat * (s.codePointAt(i+1) - '0'.codePointAt(0));
			b = 24;
		} else {
			lon += factorlon * (s.codePointAt(i) - 'a'.codePointAt(0));
			lat += factorlat * (s.codePointAt(i+1) - 'a'.codePointAt(0));
			b = 10;
		}
	}

	return [lon, lat];
}

/**
 * Conversion of coordinates to QTH
 *
 * @param {array} with longitude at [0] and latitude at [1]
 * @return {string} s  the QTH or Maidenheadlocator string
 */

function wgs2qth (lon = 0, lat = 0, prec = 7) {

	if (prec < 1) prec = 1;

	let base0 = 18;
	let factorlon = 360 / base0;
	let factorlat = 180 / base0;

	let s = "";
	let longmult = Math.floor ((lon + 180) / factorlon);
	let latmult  = Math.floor ((lat + 90) / factorlat);

	s = s + String.fromCodePoint('A'.codePointAt(0) + longmult) + String.fromCodePoint('A'.codePointAt(0) + latmult);
	lon = lon - factorlon * longmult + 180;
	lat = lat - factorlat * latmult + 90;

	let b = 10;

	for (let i = 1; i < prec; i++) {

		factorlon /= b;
		factorlat /= b;

		longmult = Math.floor (lon / factorlon);
		latmult  = Math.floor (lat / factorlat);

		if (b == 10) {
			s = s + String.fromCodePoint('0'.codePointAt(0) + longmult) + String.fromCodePoint('0'.codePointAt(0) + latmult);
			b = 24;
		} else {
			s = s + String.fromCodePoint('a'.codePointAt(0) + longmult) + String.fromCodePoint('a'.codePointAt(0) + latmult);
			b = 10;
		}

		lon = lon - factorlon * longmult;
		lat = lat - factorlat * latmult;

	}
	return s;

}

// exports['default'] = qthlocator;
// exports.qth2wgs = qth2wgs;
// exports.wgs2qth = wgs2qth;

// Object.defineProperty(exports, '__esModule', { value: true });

export { qth2wgs, wgs2qth }
