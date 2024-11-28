const base30="0123456789BCDFGHJKLMNPQRSTVWXZ";

export function WGStoNAC (lat, lon, level = 12) {
  
  // Convert
  let x = lat + 180.0;
  let y = lon + 90.0;
  let xbox = 12.0;
  let ybox = 6.0;
  let xstr = "";
  let ystr = "";

  for (let i = 0; i < level; i++) {
    let xh = Math.floor(x / xbox);
    xstr += base30[xh];
    x = x - xh * xbox;
    xbox = xbox / 30;

    let yh = Math.floor(y / ybox);
    ystr += base30[yh];
    y = y - yh * ybox;
    ybox = ybox / 30;
  }

  // Output
  return xstr + " " + ystr;
}

export function NACtoWGS (code) {
  
  // Parse input
  let coords = code.match(/([0123456789BCDFGHJKLMNPQRSTVWXZ]+)/gi);

  if (!coords || coords.length < 2 || coords.length > 3) {
    console.log('Invalid NAC');
    throw ('Invalid NAC');
  }

  let latstr = coords[0];
  let lonstr = coords[1];

  // Convert
  let latbox = 12.0;
  let lonbox = 6.0;
  let lat = 0.0;
  let lon = 0.0;

  for (let i = 0; i < latstr.length; i++) {
    lat += base30.indexOf(latstr[i]) * latbox;
    lon += base30.indexOf(lonstr[i]) * lonbox;
    latbox = latbox / 30;
    lonbox = lonbox / 30;
  }

  return { lat: lat-180, lon: lon-90 }

}