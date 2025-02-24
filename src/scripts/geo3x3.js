export function Geo3x3toWGS (hash) {

  // Parse input
  hash = hash.trim().match(/([WE]{1}[0-9]+)/gi);
  
  if (!hash || hash.length != 1) {
    throw ("Invalid geo3x3 code");
  }

  // Read hash
  let lat = 0.0;
  let lng = 0.0;
  let unit = 180.0;
  hash = hash[0];
  for (let i = 1; i < hash.length; i++) {
    let n = parseInt(hash[i]) - 1;
    unit = unit / 3;
    lng += (n % 3) * unit;
    lat += Math.floor(n / 3) * unit;
  }
  lat += unit / 2;
  lng += unit / 2;
  lat -= 90.0;
  lng = hash[0] === "W" ? lng - 180.0 : lng;
  return ( {lat: lat, lon: lng});
}

export function WGStoGeo3x3 (lat, lng, level = 12) {
  
  // Convert
  lat = lat + 90.0;
  let unit = 180.0;
  let hash = "";

  if (lng < 0.0) {
    hash = "W";
    lng += 180.0;
  } else {
    hash = "E";
  }

  for (let i = 0; i < level; i++) {
    unit /= 3.0;
    const x = Math.floor(lng / unit);
    const y = Math.floor(lat / unit);
    hash += x + y * 3 + 1;
    lng -= x * unit;
    lat -= y * unit;
  }
  return hash;
}
