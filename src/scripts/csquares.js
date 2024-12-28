// See https://www.cmar.csiro.au/csquares/spec1-1.htm

// Level 1 - 10 degree squares also known als https://en.wikipedia.org/wiki/Marsden_square
// Or as https://en.wikipedia.org/wiki/World_Meteorological_Organization_squares

// c-square codes
// 1 - 10 degree square	5500
// 2 - 5 degree square	5500:1
// 3 - 1 degree square	5500:134
// 4 - 0.5 degree square	5500:134:1
// 5-  0.1 degree square	5500:134:104
// etc

export function WGSToCsquare(lat, lon, level = 13) {
  let hash = "";

  // 1, 3, 5 or 7 indicates the global quadrant NE, SE, SW and NW
  if (lat >= 0 && lon >= 0) hash += "1";
  if (lat < 0 && lon > 0) hash += "3";
  if (lat < 0 && lon < 0) hash += "5";
  if (lat > 0 && lon < 0) hash += "7";
  lat = Math.abs(lat);
  lon = Math.abs(lon);

  for (let i = 1; i <= level + 1; i += 2) {
    let latbox = Math.floor(lat / 10);
    let lonbox = Math.floor(lon / 10);
    let csquar = 2 * Math.trunc(latbox * 0.2) + Math.trunc(lonbox * 0.2) + 1;
    lat = (lat - latbox * 10) * 10.0;
    lon = (lon - lonbox * 10) * 10.0;
    if (i === 1) hash += (latbox * 100 + lonbox).toString();
    if (i > 1) hash += ":" + csquar + latbox.toString() + lonbox.toString();
  }

  if (level % 2 === 0) hash = hash.slice(0, -2);

  return hash;
}

export function CsquareToWGS(code) {

  if (code.length < 4) return;

  // First digits sets N E S W
  let latsgn = code[0] === 1 || code[0] === 7 ? -1 : 1;
  let lonsgn = code[0] === 1 || code[0] === 3 ? -1 : 1;
  let lat = code[1] * 10;
  let lon = code.slice(2, 3) * 10;
  let mult = 1;

  // If the last square is not fully specified default to the centre
  if (code.slice(-2, -1) === ":") code += "55";

  // Get boxes (3 digits), should be separated by :
  let groups = code.slice(4).match(/([0-9]{3})/g);

  if (groups)
    for (let g of groups) {
      lat += g[1] * mult;
      lon += g[2] * mult;
      mult /= 10;
    }

  // Return coordinate of centre of last box, add sign
  return { lat: latsgn * (lat + 0.5 * mult), lon: lonsgn * (lon + 0.5 * mult) };
}
