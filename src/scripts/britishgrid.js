/**
 * Converts from x,y (or lon, lat) to Gridref lon lat and viceversa
 *
*/

var GridRef = [
	['V', 'W', 'X', 'Y', 'Z'],
	['Q', 'R', 'S', 'T', 'U'],
	['L', 'M', 'N', 'O', 'P'],
	['F', 'G', 'H', 'J', 'K'],
	['A', 'B', 'C', 'D', 'E']
]

var GridSize = 5;

var falseeasting = 1000000;
var falsenorthing = 500000;

/*
 * converts lat, lon coord object to a string
 *
 * @param {object}      an object with lat and lon
 * @return {string} s   a string formatted as AA 999999 999999
 *
 */

export function toGrid (coord) {

	var lat = Math.round(coord.lat) + falsenorthing;
  var lon = Math.round(coord.lon) + falseeasting;

  var row1 = Math.floor(lat / 500000);
  var col1 = Math.floor(lon / 500000);

  lat = lat % 500000;
  lon = lon % 500000;

  var row2 = Math.floor(lat / 100000);
  var col2 = Math.floor(lon / 100000);

  lat = lat % 100000;
  lon = lon % 100000;

  return GridRef[row1][col1] + GridRef[row2][col2] + " " + lon + " " + lat;

}

function findGridRef(ref) {
	for (var r=0; r < GridSize; r++)
		for (var c=0; c < GridSize; c++)
			if (GridRef[r][c] == ref) return { row: r, col: c };
}

/*
 * converts string to lat, lon coord object
 *
 * @param {string} s  a string formatted as AA 999999 999999
 * @return {object}   an object with lat and lon
 *
 */

export function fromGrid (s) {

	s = s.toUpperCase();
	var words = s.match(/[0-9A-Z]+/g);

  var rowcol1 = findGridRef(words[0][0]);
  var rowcol2 = findGridRef(words[0][1]);

  return {
		lon : rowcol1.col * 500000 + rowcol2.col * 100000 + parseInt(words[1]) - falseeasting,
    lat : rowcol1.row * 500000 + rowcol2.row * 100000 + parseInt(words[2]) - falsenorthing
  }
}
