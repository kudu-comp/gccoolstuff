/*
 * Convert what3words async
 */

const w3wapi = "ROTED0WV";
const urlw3wencode = "https://api.what3words.com/v3/convert-to-3wa"
const urlw3wdecode = "https://api.what3words.com/v3/convert-to-coordinates"

/*
 * Fetch an API call
 */

async function helper (url) {
    
  return fetch (url, {
        method: 'GET'
      })
      .then( response => response.json())
      .then( data => {
      
        return data;
        
      });
      
}

/*
 * Convert WGS84 object to what3words
 *
 * @param Object coord    object with lat and lon
 * @return string         what3words string
 */

export async function wgs84ToW3W (coord) {

  let coordtext = "" + coord.lon.toFixed(5) + "," + coord.lat.toFixed(5);
  let url = urlw3wencode + "?key=" + w3wapi + "&coordinates=" + coordtext + "&language=nl";

  return helper(url)
    .then( data => {
      return data.words;
    });

}

/*
 * Convert what3words to coord object
 * 
 * @param string s      what3words string
 * @return Object       object with lat and lon
 * 
 */

export async function W3WToWgs84 (s) {

  let url = urlw3wdecode + "?key=" + w3wapi + "&words=" + s;

  return helper(url)
    .then( data => {

      // Looks like w3w has switched lon and lat?
      return { lon: data.coordinates.lat, lat: data.coordinates.lng }
      
    });

}
