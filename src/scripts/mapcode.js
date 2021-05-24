/*
 * Convert mapcode async
 */

const urlencode = "https://api.mapcode.com/mapcode/codes/"
const urldecode = "https://api.mapcode.com/mapcode/coords/"

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
      
    })
    .catch (e => {
      throw(e);
    });
  
}

/*
 * Convert WGS84 object to mapcode international
 *
 * @param  Object coord    object with lat and lon
 * @return Object          mapcode object
 */

export async function wgs84ToMapcodeI (coord) {

  let coordtext = "" + coord.lat.toFixed(12) + "," + coord.lon.toFixed(12);
  let url = urlencode + coordtext;
  
  return helper(url)
    .then( data => {
      return {
        mapcode: data.international.mapcode
      }
    })
    .catch (e => {
      throw(e);
    });

}

/*
 * Convert WGS84 object to mapcode local
 *
 * @param  Object coord   object with lat and lon
 * @return object         object with mapcode and context
 * 
 */

export async function wgs84ToMapcodeL (coord) {

  let coordtext = "" + coord.lat.toFixed(12) + "," + coord.lon.toFixed(12);
  let url = urlencode + coordtext + "?include=territory";

  return helper(url)
    .then (data => {
      if (data.local) {
        return {
          mapcode: data.local.mapcode,
          context: data.local.territory
        }
      } else {
        return { 
          mapcode: data.international.mapcode
        }
      }    
    })
    .catch (e => {
      throw(e);
    });

}

/*
 * Convert mapcode to coord object
 * 
 * @param  Object       object with mapcode and optional context
 * @return Object       object with lat and lon
 * 
 */

export async function mapCodeToWgs84 (mc) {

  let url = urldecode + mc.mapcode;
  if (mc.context) url += '?context=' + mc.context;

  return helper(url)
    .then (data => {
      return { lon: data.lonDeg, lat: data.latDeg }
    });

}
