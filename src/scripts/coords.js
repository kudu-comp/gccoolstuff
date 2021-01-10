
/**
 *
 */

 /** Explanation of longitude and latitude
  * Longitude (lengtegraad), X, easting, E/W are all the same and range from -180, +180
  * Latitude (breedtegraag), Y, northing, N/S are all the same and range from -90, +90
  *
  * Some test data - these are all equal
  * WGS84 52.42274642932574 4.628971416391407
  * Geohash u1761r68wu5
  * RD 103423 493041
  * UTM 31U 610769 5809307
  * QTH JO22hk51ll40je
  * MGRS 31UFU1076909307
  * What3words first.sensual.keyboard
  */

import proj4 from 'proj4';
import * as mgrs from '@/scripts/mgrs.js';
import * as qthlocator from '@/scripts/qthlocator.js';
import Geohash from 'latlon-geohash';
import OpenLocationCode from '@/scripts/openlocationcode.min.js';
import * as geohash36 from '@/scripts/geohash36.js';
import * as britishgrid from '@/scripts/britishgrid.js'

// var coordutils = {
//   convertCoordFromLatLon: convertCoordFromLatLon,
//   convertCoordFromText: convertCoordFromText
// };

// proj 4 definitions, see epsg.io for information
// RD dutch grid
proj4.defs("EPSG:28992", "+name=RD (lat/long) +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");
// British National Grid
proj4.defs("EPSG:27700","+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs");
// Lambert 93 French grid
proj4.defs("EPSG:2154","+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
// Belgian Lambert 2008 grid
proj4.defs("EPSG:3812","+proj=lcc +lat_1=49.83333333333334 +lat_2=51.16666666666666 +lat_0=50.797815 +lon_0=4.359215833333333 +x_0=649328 +y_0=665262 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
// German Gauss Kruger - DHDN grid
proj4.defs("EPSG:5680","+proj=tmerc +lat_0=0 +lon_0=3 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs");

/**
 * dmsCoord and array of coordinates that are using degrees, minutes, seconds
 * can be updated externally
 */
export const dmsCoord = ['WGS84', 'NAD', 'EPSG:4269'];

/**
 * array of regular expressions to match coordinate strings and format to use
 * gg stands voor degrees, mm for minutes, dd for decimals, ss for seconds
 * N/S/Z/n/s/z can be used if omitted the sign +/- determines N/S
 * E/W/O/e/w/o can be used if omitted the sign +/- determines N/W
 * Whitespace allowed after N,S etc and between elements, but not after the decimal point
 * It skippes ° after degrees, ' after minutes and " after seconds
 *
 */
var dmsFormats = [
      [/[NSZ]\s*[0-9]+\.[0-9]+[°,\s]+[EWO]\s*[0-9]+\.[0-9]+/i, "Ngg.ddddd Egg.ddddd"],
      [/[-+]{0,1}[0-9]+\.[0-9]+[°,\s]+[-+]{0,1}\s*[0-9]+\.[0-9]+/i, "gg.ddddd gg.ddddd"],
      [/[NSZ]\s*[0-9]+[°\s]+[0-9]+\.[0-9]+['′,\s]+[EWO]\s*[0-9]+[°\s]+[0-9]+\.[0-9]+/i, "Ngg mm.ddd Egg mm.ddd"],
      [/[-+]{0,1}\s*[0-9]+[°\s]+[0-9]+\.[0-9]+['′,\s]+[-+]{0,1}\s*[0-9]+[°\s]+[0-9]+\.[0-9]+/i, "gg mm.ddd gg mm.ddd"],
      [/[NSZ]\s*[0-9]+[°\s]+[0-9]+['′\s]+[0-9]+\.{0,1}[0-9]*["',\s]+[EWO][\s]*[0-9]+[°\s]+[0-9]+['′\s]+[0-9]+\.{0,1}[0-9]*/i, "Ngg mm ss.ddd Egg mm ss.ddd"],
      [/[-+]{0,1}\s*[0-9]+[°\s]+[0-9]+['′\s]+[0-9]+\.{0,1}[0-9]*[″",\s]+[-+]{0,1}\s*[0-9]+[°\s]+[0-9]+['′\s]+[0-9]+\.{0,1}[0-9]*/i, "gg mm ss.ddd gg mm ss.ddd"],
      [/[0-9]+[°\s]+[0-9]+['′\s]+[0-9]+\.{0,1}[0-9]*[″"'\s]+[NBSZ]{1,2}[,\s]*[0-9]+[°\s]+[0-9]+['′\s]+[0-9]+\.{0,1}[0-9]*[″"\s]*[EWOL]{1,2}/i, "gg mm ss.ddd N gg mm ss.ddd E"],
    ]

/**
 * Several functions to process coordinate formats into coord (lat, lon) objects
 */

function getCoordinateForDMSFormat1 (s) {
  // Ngg.ddddd Egg.ddddd
  var elem =  s.match(/[NSZEWO'"°.0-9]+/ig);
  var northSouthSign, eastWestSign;

  // Gives array with Ngg.ddddd Egg.ddddd (or if there was whitespace after N or E these are splitted as N gg)
  // Split Ngg if needed
  if ("NSZ".indexOf(elem[0]) < 0) {
    // NSZ is combined with degrees in first field
    elem.splice(0, 0, elem[0][0]);
    elem[1] = elem[1].slice(1);
  }
  // Split Egg if needed
  if ("EWO".indexOf(elem[2]) < 0) {
    elem.splice(2, 0, elem[2][0]);
    elem[3] = elem[3].slice(1);
  }
  // No we have N gg.ddddd E gg.ddddd for sure, set the signs
  (elem[0] == "N") ? northSouthSign = 1 : northSouthSign = -1;
  (elem[2] == "W") ? eastWestSign = -1 : eastWestSign = 1;
  // Make the coord object
  return {
    lon: parseFloat(elem[3]) * eastWestSign,
    lat: parseFloat(elem[1]) * northSouthSign
  }
}

function getCoordinateForDMSFormat2 (s) {
  // +gg.ddddd -gg.ddddd
  var elem =  s.match(/[-+.0-9]+/ig);
  var lat, lon = 0;
  // Gives array with +gg.ddddd -gg.ddddd (or if there was whitespace after N or E these are splitted as N gg)

  // Remove single + (no use)
	if (elem[0] == "+") elem.splice(0,1);
  // Deal with minus
	if ("-".indexOf(elem[0]) < 0) {
    // - is combined with gg
    lon = parseFloat(elem[0]);
  } else {
    lon = parseFloat(elem[1]) * (elem[0] == "-" ? -1 : 1);
    elem.splice(0,1);
  }

  // Remove single + (no use)
  if (elem[1] == "+") elem.splice(1,1);
  // Deal with minus
  if ("-".indexOf(elem[1]) < 0) {
    // +- is combined with gg, + is optional notation
    lat = parseFloat(elem[1]);
  } else {
    lat = parseFloat(elem[2]) * (elem[1] == "-" ? -1 : 1);
  }
  // Make the coord object
  return {
    lon: lat,
    lat: lon
  }
}

function getCoordinateForDMSFormat3 (s) {
  // Ngg mm.ddd Egg mm.ddd
  var elem =  s.match(/[NSZEWO.0-9]+/ig);
  var northSouthSign, eastWestSign;

  // Split Ngg if needed
  if ("NSZ".indexOf(elem[0]) < 0) {
    elem.splice(0, 0, elem[0][0]);
    elem[1] = elem[1].slice(1);
  }
  // Split Egg if needed
  if ("EWO".indexOf(elem[3]) < 0) {
    elem.splice(3, 0, elem[3][0]);
    elem[4] = elem[4].slice(1);
  }

  // No we have N gg mm.ddddd E gg mm.ddddd for sure, set the signs
  (elem[0] == "N") ? northSouthSign = 1 : northSouthSign = -1;
  (elem[3] == "W") ? eastWestSign = -1 : eastWestSign = 1;
  // Make the coord object
  return {
    lon: parseFloat(elem[4]) * eastWestSign + (parseFloat(elem[5]) / 60 * eastWestSign),
    lat: parseFloat(elem[1]) * northSouthSign + (parseFloat(elem[2]) / 60  * northSouthSign)
  }
}

function getCoordinateForDMSFormat4 (s) {
  // +gg mm.ddd -gg mm.ddd
  var elem =  s.match(/[-+.0-9]+/ig);
  var northSouthSign, eastWestSign;

  // Remove single + (no use)
	if (elem[0] == "+") elem.splice(0,1);
  // Deal with minus
  northSouthSign = 1;
	if ("-".indexOf(elem[0]) < 0) {
    if (elem[0][0] == "-") {
      northSouthSign = -1;
      elem[0] = elem[0].slice(1);
    }
  } else {
    northSouthSign = -1;
    elem.splice(0,1);
  }

  // Remove single + (no use)
	if (elem[2] == "+") elem.splice(2,1);
  // Deal with minus
  eastWestSign = 1;
	if ("-".indexOf(elem[2]) < 0) {
    if (elem[2][0] == "-") {
      eastWestSign = -1;
      elem[2] = elem[2].slice(1);
    }
  } else {
    eastWestSign = -1;
    elem.splice(2,1);
  }

  // Make the coord object
  return {
    lon: parseFloat(elem[2])  * eastWestSign + (parseFloat(elem[3]) / 60 * eastWestSign),
    lat: parseFloat(elem[0]) * northSouthSign + (parseFloat(elem[1]) / 60  * northSouthSign)
  }
}

function getCoordinateForDMSFormat5 (s) {
  // Ngg mm ss.ddddd Egg mm ss.ddddd
  var elem =  s.match(/[NSWEWO.0-9]+/ig);
  var northSouthSign, eastWestSign;

  // Split Ngg if needed
  if ("NSZ".indexOf(elem[0]) < 0) {
    // NSZ is combined with degrees in first field
    elem.splice(0, 0, elem[0][0]);
    elem[1] = elem[1].slice(1);
  }
	// Split Egg if needed
  if ("EWO".indexOf(elem[4]) < 0) {
    elem.splice(4, 0, elem[4][0]);
    elem[5] = elem[5].slice(1);
  }

  // No we have N gg.ddddd E gg.ddddd for sure, set the signs
  (elem[0] == "N") ? northSouthSign = 1 : northSouthSign = -1;
  (elem[4] == "W") ? eastWestSign = -1 : eastWestSign = 1;

  // Make the coord object
  return {
    lon: parseFloat(elem[5]) * eastWestSign + ((parseFloat(elem[6]) * 60 + parseFloat(elem[7]))/3600 * eastWestSign ),
    lat: parseFloat(elem[1]) * northSouthSign + ((parseFloat(elem[2]) * 60 + parseFloat(elem[3]))/3600  * northSouthSign)
  }
}

function getCoordinateForDMSFormat6 (s) {
  // Ngg mm ss.ddddd Egg mm ss.ddddd
  var elem =  s.match(/[-+.0-9]+/ig);
  var northSouthSign, eastWestSign;

  // Remove single + (no use)
	if (elem[0] == "+") elem.splice(0,1);
  // Deal with minus
  northSouthSign = 1;
	if ("-".indexOf(elem[0]) < 0) {
    if (elem[0][0] == "-") {
      northSouthSign = -1;
      elem[0] = elem[0].slice(1);
    }
  } else {
    northSouthSign = -1;
    elem.splice(0,1);
  }

  // Remove single + (no use)
	if (elem[3] == "+") elem.splice(3,1);
  // Deal with minus
  eastWestSign = 1;
	if ("-".indexOf(elem[3]) < 0) {
    if (elem[3][0] == "-") {
      eastWestSign = -1;
      elem[3] = elem[3].slice(1);
    }
  } else {
    eastWestSign = -1;
    elem.splice(3,1);
  }

  // Make the coord object
  return {
    lon: parseFloat(elem[3]) * eastWestSign + ((parseFloat(elem[4]) * 60 + parseFloat(elem[5]))/3600 * eastWestSign ),
    lat: parseFloat(elem[0]) * northSouthSign + ((parseFloat(elem[1]) * 60 + parseFloat(elem[2]))/3600  * northSouthSign)
  }
}

function getCoordinateForDMSFormat7 (s) {
  // Format 7: gg mm ss.ddd N gg mm ss.ddd E
  var elem =  s.match(/[NSWEWO.0-9]+/ig);
  var northSouthSign, eastWestSign;

  // No we have N gg.ddddd E gg.ddddd for sure, set the signs
  (elem[3][0] == "N") ? northSouthSign = 1 : northSouthSign = -1;
  (elem[7][0] == "W") ? eastWestSign = -1 : eastWestSign = 1;

  // Make the coord object
  return {
    lon: parseFloat(elem[4]) * eastWestSign + ((parseFloat(elem[5]) * 60 + parseFloat(elem[6]))/3600 * eastWestSign ),
    lat: parseFloat(elem[0]) * northSouthSign + ((parseFloat(elem[1]) * 60 + parseFloat(elem[2]))/3600  * northSouthSign)
  }
}

function printCoordinateFromDMSFormat1 (coord) {
  // Ngg.ddddd Egg.ddddd
  var s = "";
  (coord.lat > 0) ? s = "N" : s = "S";
  s += Math.abs(coord.lat).toFixed(5) + "° ";
  (coord.lon > 0) ? s += "E" : s += "W";
  s += Math.abs(coord.lon).toFixed(5) + "°";
  return s;
}

function printCoordinateFromDMSFormat2 (coord) {
  // gg.ddddd -gg.ddddd
  return coord.lat.toFixed(5) + "° " + coord.lon.toFixed(5) + "°";
}

function printCoordinateFromDMSFormat3 (coord) {
  // Ngg mm.ddd Egg mm.ddd
  var s = "";
  (coord.lat > 0) ? s = "N" : s = "S";
  s += Math.trunc(Math.abs(coord.lat)) + "° ";
  s += ((Math.abs(coord.lat) % 1) * 60).toFixed(3) + "' ";
  // Get minutes
  (coord.lon > 0) ? s += "E" : s += "W";
  s += Math.trunc(Math.abs(coord.lon)) + "° ";
  s += ((Math.abs(coord.lon) % 1) * 60).toFixed(3) + "'";
  return s;
}

function printCoordinateFromDMSFormat4 (coord) {
  // +gg mm.ddd -gg mm.ddd
  var s = Math.trunc(coord.lat) + "° ";
  s += ((Math.abs(coord.lat) % 1) * 60).toFixed(3) + "' ";
  s += Math.trunc(coord.lon) + "° ";
  s += ((Math.abs(coord.lon) % 1) * 60).toFixed(3) + "'";
  return s;
}

function printCoordinateFromDMSFormat5 (coord) {
  // Ngg mm ss.ddd Egg mm ss.ddd
  var s = "";
  var min, sec;

  (coord.lat > 0) ? s = "N" : s = "S";
  s += Math.trunc(Math.abs(coord.lat)) + "° ";
  min = Math.abs(coord.lat % 1) * 60;
  s += Math.trunc(min) + "' ";
  sec = (min % 1)*60;
  s += sec.toFixed(3) + '" ';

  // Get minutes
  (coord.lon > 0) ? s += "E" : s += "W";
  s += Math.trunc(Math.abs(coord.lon)) + "° ";
  min = Math.abs(coord.lon % 1) * 60;
  s += Math.trunc(min) + "' ";
  sec = (min % 1)*60;
  s += sec.toFixed(3) + '"';
  return s;
}

function printCoordinateFromDMSFormat6 (coord) {
  // +gg mm ss.ddd -gg mm ss.ddd
  var s = "";
  var min, sec;

  s += Math.trunc(coord.lat) + "° ";
  min = Math.abs(coord.lat % 1) * 60;
  s += Math.trunc(min) + "' ";
  sec = (min % 1)*60;
  s += sec.toFixed(3) + '" ';

  // Get minutes
  s += Math.trunc(coord.lon) + "° ";
  min = Math.abs(coord.lon % 1) * 60;
  s += Math.trunc(min) + "' ";
  sec = (min % 1)*60;
  s += sec.toFixed(3) + '"';
  return s;
}

function printCoordinateFromDMSFormat7 (coord) {
  // Format 7: gg mm ss.ddd N gg mm ss.ddd E
  var s = "";
  var min, sec;

  s += Math.trunc(Math.abs(coord.lat)) + "° ";
  min = Math.abs(coord.lat % 1) * 60;
  s += Math.trunc(min) + "' ";
  sec = (min % 1)*60;
  s += sec.toFixed(3) + '" ';
  (coord.lat > 0) ? s += " N " : s += " S ";

  s += Math.trunc(Math.abs(coord.lon)) + "° ";
  min = Math.abs(coord.lon % 1) * 60;
  s += Math.trunc(min) + "' ";
  sec = (min % 1)*60;
  s += sec.toFixed(3) + '"';
  (coord.lon > 0) ? s += " E" : s += " W";
  return s;
}

/**
 * Check if the datum is DMS (degree minute second)
 */
function isDMSCoord(s) {
  for (let i=0; i < dmsCoord.length; i++)
    if (dmsCoord[i] == s) return true;
  return false;
}

/**
 * Get a degree, minute, second coordinate from a string by evaluating the notation
 *
 * @param {string} s
 *
 * @return {object} an object with lat and lon as signed decimals e.g. +52.45678 -6.4636364
 */
export function getCoordinateForDMS (s) {

  s = s.trim().toUpperCase();

  if (dmsFormats[0][0].test(s)) {
    // Ngg.ddddd Egg.ddddd
    return getCoordinateForDMSFormat1(s);
  } else if (dmsFormats[1][0].test(s)) {
    // +gg.ddddd -gg.ddddd
    return getCoordinateForDMSFormat2(s);
  } else if (dmsFormats[2][0].test(s)) {
    // Ngg mm.ddd Egg mm.ddd
    return getCoordinateForDMSFormat3(s);
  } else if (dmsFormats[3][0].test(s)) {
    // +gg mm.ddd -gg mm.ddd
    return getCoordinateForDMSFormat4(s);
  } else if (dmsFormats[4][0].test(s)) {
    // Ngg mm ss.ddd Egg mm ss.ddd
    return getCoordinateForDMSFormat5(s);
  } else if (dmsFormats[5][0].test(s)) {
    // +gg mm ss.ddd -gg mm ss.ddd
    return getCoordinateForDMSFormat6(s);
  } else if (dmsFormats[6][0].test(s)) {
    // +gg mm ss.ddd -gg mm ss.ddd
    return getCoordinateForDMSFormat7(s);
  } else {
    console.log("Error - format " + s);
  }
}

/**
 * Get a degree, minute, second coordinate from a string by evaluating the notation
 *
 * @param {object}  an object with lon and lat
 * @param {string}  s an example string format
 *
 * @return {object} an object with lat and lon as signed decimals e.g. +52.45678 -6.4636364
 */
export function printCoordinateFromDMS (coord, s) {

  s = s.trim().toUpperCase();

  if (dmsFormats[0][0].test(s)) {
    // Ngg.ddddd Egg.ddddd
    return printCoordinateFromDMSFormat1(coord);
  } else if (dmsFormats[1][0].test(s)) {
    // +gg.ddddd -gg.ddddd
    return printCoordinateFromDMSFormat2(coord);
  } else if (dmsFormats[2][0].test(s) || s == "undefined" || s == "") {
    // Ngg mm.ddd Egg mm.ddd
    return printCoordinateFromDMSFormat3(coord);
  } else if (dmsFormats[3][0].test(s)) {
    // +gg mm.ddd -gg mm.ddd
    return printCoordinateFromDMSFormat4(coord);
  } else if (dmsFormats[4][0].test(s)) {
    // Ngg mm ss.ddd Egg mm ss.ddd
    return printCoordinateFromDMSFormat5(coord);
  } else if (dmsFormats[5][0].test(s)) {
    // +gg mm ss.ddd -gg mm ss.ddd
    return printCoordinateFromDMSFormat6(coord);
  } else if (dmsFormats[6][0].test(s)) {
    // +gg mm ss.ddd -gg mm ss.ddd
    return printCoordinateFromDMSFormat7(coord);
  } else {
    console.log("Error");
  }
}
/**
 * Conversion to WGS84.
 *
 * @param {object} coord  contains lat, lon and optionally zone or s
 * @param {string} fromdatum  coordinate system of input
 * @param {string} proj4jsdef  definition of coordinate conversion for proj4, only used when fromdatum = proj4js
 *
 * @return {object} contains lat and lon
 */

export function convertCoordToWGS(coord, fromdatum, proj4jsdef = "") {

  var temp = []     // Used as output from proj4
  var fromproj = "" // Defines the proj4 projection to be used

  switch (fromdatum) {
    // MGRS, QTH and Geohash don't use proj4 and return result immediately
    case "MGRS" :
      // mgrs returns and array longitude first
      temp = mgrs.inverse(coord.s.trim());
      return { lon: temp[0], lat: temp[1] };
    case "QTH" :
      // QTH returns an array longitude first
      temp = qthlocator.qth2wgs(coord.s.trim());
      return { lon: temp[0], lat: temp[1]};
    case "Geohash" :
      // Geohash returns and object with lon and lat
      return Geohash.decode(coord.s.trim());
    case "Geohash36" :
      // Geohash36 returns and object with lon and lat
      return geohash36.geohash36_decode(coord.s.trim());
    case "OLC" :
      // Google's Open Location Code, use publicly available scripts
      temp = OpenLocationCode.decode(coord.s.trim());
      return { lon: temp.longitudeCenter, lat: temp.latitudeCenter };
    // all of the datums below use proj4, the case sets the right fromproj
    case "UTM" :
      // For southern hemisphere latitude should be negative
      if (coord.letterdesignator <= 'M') coord.lat = coord.lat - 10000000;
      fromproj = "+proj=utm +zone=" + coord.zone + " +ellps=GRS80 +units=m +no_defs";
      // Longitude (easting)
      break;
    case "RD" :
    case "EPSG:28992" :
      fromproj = "EPSG:28992";
      break;
    case "OSGB" :
      fromproj = "EPSG:27700";
      break;
    case "Proj4js" :
      // use the provided definition
      fromproj = proj4jsdef;
      break;
    default :
      fromproj = fromdatum;
      break;
  }

  if (fromproj == 'WGS84')
    temp = [coord.lon, coord.lat];
  else {
    // Use proj4 to convert to new datum
    temp = proj4(fromproj, 'WGS84', [coord.lon, coord.lat]);
  }

  return { lon: temp[0], lat: temp[1]}
}

/**
 * Conversion of coordinate from one datum to another
 *
 * @param {object} coord  contains lat, lon in WGS84
 * @param {string} fromdatum  coordinate system of input
 * @param {string} proj4jsdef  definition of coordinate conversion for proj4, only used when fromdatum = proj4js
 *
 * @return {object} contains lat and lon optionally zone or s
*/

export function convertCoordFromWGS (coord, todatum, proj4jsdef = "") {

  var temp = [];    // Used to store coordiantes returned from proj4, array with [lon, lat]
  var toproj = "";  // String with the to be used projection for proj4

  // Longitude (lengtegraad), X, easting, E/W are all the same and range from -180, +180
  // Latitude (breedtegraag), Y, northing, N/S are all the same and range from -90, +90
  // Get the newcoord in the right format
  switch (todatum) {
    // MGRS, QTH and Geohash don't use proj4 and return result immediately
    case "MGRS" :
      // mgrs.forward takes longitude first and latitude second, returns a string
      return { s: mgrs.forward( [coord.lon, coord.lat] ) };
    case "QTH" :
      // proj4 fromcoord has longtitude (EW, y) first and latitude (NS, x) second
      // Longitude then altitude to wgs2qth
      return { s: qthlocator.wgs2qth(coord.lon, coord.lat) };
    case "Geohash" :
      // Geohash takes latitude first, longitude second
      return { s: Geohash.encode(coord.lat, coord.lon, 11) };
    case "Geohash36" :
      // Geohash takes latitude first, longitude second
      return { s: geohash36.geohash36_encode(coord.lat, coord.lon, 11) };
    // all of the datums below use proj4, the case sets the right fromproj
    // UTM requires zone calculation using the longitude
    case "OLC" :
      return { s: OpenLocationCode.encode(coord.lat, coord.lon, OpenLocationCode.CODE_PRECISION_EXTRA) };
    case "UTM" :
      // For UTM calculate the zone from the WGS84 coord
      var zone = Math.ceil((coord.lon+180)/6);
      toproj = "+proj=utm +zone=" + zone + " +ellps=GRS80 +units=m +no_defs";
      temp = proj4("WGS84", toproj, [coord.lon, coord.lat]);
      // Southern hemisphere starts at the south pole at 1,000 000
      var lat = (temp[1] < 0) ? 10000000 + temp[1] : temp[1];
      return { lon: temp[0], lat, zone: zone, letterdesignator: mgrs.getLetterDesignator(coord.lat) };
    case "EPSG:28992" :
    case "RD" :
      // RD uses EPSG:28992
      toproj = "EPSG:28992";
      break;
    case "OSGB" :
      // British grid (with zones) uses EPSG:27700
      toproj = "EPSG:27700";
      break;
    case "Proj4js" :
      // default the option value is the toproj to use
      toproj = proj4jsdef;
      break;
    default :
      // default the option value is the toproj to use
      toproj = todatum;
      break;
  }

  temp = proj4("WGS84", toproj, [coord.lon, coord.lat]);
  return { lon: temp[0], lat: temp[1] };

}

/**
 * Convert text to coord object with lat, lon, optionally zone or string
 *
 * @param {string} s   a string with the coordinates
 * @param {string} fromdatum  a string with the datum
 *
 * @return {string} s  the QTH or Maidenheadlocator string
 */

export function getCoordFromText (s, datum) {

  var temp = [];     // Used to store result from regex match

  // Longitude (lengtegraad), X, easting, E/W are all the same and range from -180, +180
  // Latitude (breedtegraag), Y, northing, N/S are all the same and range from -90, +90
  // Convert to coordinate
  switch (datum) {
    case "UTM" :
      // UTM format is zoneU easting/longitude northing/latitude
      temp = s.match(/[0-9U]+/g);
      return { lon: parseInt(temp[1]), lat: parseInt(temp[2]), zone: parseInt(temp[0].slice(0,2)), letterdesignator: temp[0].slice(2,3) };
    case "EPSG:28992" :
    case "RD" :
    case "EPSG:27700" :
    case "EPSG:3857" :
    case "EPSG:3812" :
    case "EPSG:2154" :
      // Grid coordinates have longitude first and use integers
      temp = s.match(/[-0-9]+/g);
      return { lon: parseInt(temp[0]), lat: parseInt(temp[1]) };
    case "MGRS" :
    case "QTH" :
    case "Geohash" :
    case "Geohash36" :
    case "OLC" :
      // These coordinates are using strings
      return { s: s.trim() };
    case "OSGB" :
      // British national grid EPSG:27700 formatted as zones e.g. SV 98765 12342
      // toGrid returns an object with lat, lon
      return britishgrid.fromGrid(s.trim());
    default :
      // DMS format?
      if (isDMSCoord(datum)) {
        return getCoordinateForDMS(s);
      } else {
        // default format is lat lon
        temp = s.match(/[-0-9.,]+/g);
        return { lon: parseFloat(temp[1]), lat: parseFloat(temp[0]) };
      }
  }
}

/**
 * Convert coord objectto text
 *
 * @param {object}    coord has either lat, lon (with optional zone and letterdesignator) OR s
 * @param {string}    todatum datum of the to be generated text string
 * @param {integer}   round used to rounding coordinates
 *
 * @return {string} s  the QTH or Maidenheadlocator string
 */

export function getTextFromCoord (coord, datum, round = 7, dmsformat = "") {

  // Longitude (lengtegraad), X, easting, E/W are all the same and range from -180, +180
  // Latitude (breedtegraag), Y, northing, N/S are all the same and range from -90, +90
  // generate string
  switch (datum) {
    case "UTM" :
      // UTM format is zoneU easting/latitude northing/longitude
      return "" + coord.zone + coord.letterdesignator + " " + coord.lon.toFixed(0) + " " + coord.lat.toFixed(0);
    case "EPSG:28992" :
    case "RD" :
    case "EPSG:27700" :
    case "EPSG:3857" :
    case "EPSG:3812":
    case "EPSG:2154" :
      // Grid coordinates have Longitude (E/W, x) first and use integers
      return "" + coord.lon.toFixed(0) + " " + coord.lat.toFixed(0);
    case "MGRS" :
    case "QTH" :
    case "Geohash" :
    case "Geohash36" :
    case "OLC" :
      // These coordinates are already using strings
      return coord.s.trim();
    case "OSGB" :
      return britishgrid.toGrid(coord);
    default :
      // Most printed formats get Latitude (N/S) first
      // Default return coord rounded to 7 decimals
      if (isDMSCoord(datum)) {
        return printCoordinateFromDMS (coord, dmsformat);
      } else {
        return "" + coord.lat.toFixed(round) + " " + coord.lon.toFixed(round);
      }
  }
}

/**
 * Conversion of coordinate from one datum to another
 *
 * @param {object} coord        contains lat, lon and optionally zone or s
 * @param {string} fromdatum    coordinate system of input
 * @param {string} todatum      coordinate system of the output
 * @param {string} proj4jsdef   definition of coordinate conversion for proj4, only used when fromdatum = proj4js
 *
 * @return {object} contains lat and lon
*/

export function convertCoordFromLatLon (coord, fromdatum, todatum, proj4jsdef = "") {

  // Always convert first to WGS84
  var wgs84coord = convertCoordToWGS (coord, fromdatum, proj4jsdef);

  // Then convert WGS84 to the requested datum
  return convertCoordFromWGS (wgs84coord, todatum, proj4jsdef);

}

/**
 * Conversion of coordinate from one datum to another
 *
 * @param {string} coord        coord as a string in the right datum format
 * @param {string} fromdatum    coordinate system of input
 * @param {string} todatum      coordinate system of the output
 * @param {string} proj4jsdef   definition of coordinate conversion for proj4, only used when fromdatum = proj4js
 *
 * @return {object} contains lat and lon optionally zone or s
*/

export function convertCoordFromText (coord, fromdatum, todatum, proj4jsdef = "") {

  // Always convert first to WGS84
  var wgs84coord = convertCoordToWGS ( getCoordFromText(coord, fromdatum), fromdatum, proj4jsdef);

  // Then convert WGS84 to the requested datum
  return convertCoordFromWGS (wgs84coord, todatum, proj4jsdef);

}

/**
 * Set a marker on the map
 *
 * @param {object} L        the leaflet map object
 * @param {object} mymap    the map
 * @param {object} coord    latitude, longitude object (lat. lon) or arry with lat[0[, lon[1]
 * @param {string} text     text in the marker popup
*/

export function displayMarker (L, mymap, coord, text) {
  // Center map view
  mymap.setView(coord, 13);

  // Set a marker
  var markerhome = L.marker(coord).addTo(mymap);
  markerhome.bindPopup(text).openPopup();
}

/**
 * Returns a promise when it resolves the position is returned
 */
export function geoFindMe () {

  if(!navigator.geolocation) {
    throw ('Geolocation is not supported by your browser');
  } else {

    // Return the promise
    return new Promise( function( resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
}

// exports['default'] = coordutils;
// exports.convertCoordFromLatLon = convertCoordFromLatLon;
// exports.convertCoordFromText = convertCoordFromText;
//
// Object.defineProperty(exports, '__esModule', { value: true });
