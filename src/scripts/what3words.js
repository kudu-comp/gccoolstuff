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

export async function wgs84ToW3W (coord, language = "en") {

  let url = urlw3wencode + "?key=" + w3wapi + "&coordinates=" + coord.lat.toFixed(5) + "," + coord.lon.toFixed(5) + "&language=" + language;

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
      return { lat: data.coordinates.lat, lon: data.coordinates.lng }
      
    });

}

/*
 * Convert what3words to coord object
 * 
 * @param string s      what3words string
 * @return Object       object with lat and lon
 * 
 */

export async function W3WSuggest (s, focus = "", clip = "", radius = 0, language = "", country = "") {

  let url = "https://api.what3words.com/v3/autosuggest" + "?key=" + w3wapi + "&input=" + s;
  if (language) url += "&language=" + language;
  if (focus) url += "&focus=" + focus.lat.toFixed(5) + "," + focus.lon.toFixed(5);
  if (clip) url += "&clip-to-circle=" + clip.lat.toFixed(5) + "," + clip.lon.toFixed(5) + "," + radius.toFixed(2);
  if (country) url += "&clip-to-country=" + country
  
  return helper(url)
    .then (data => {
      return data.suggestions;
    })

}