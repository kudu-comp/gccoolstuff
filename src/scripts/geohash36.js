
const GEOHASH_MATRIX_SIDE = 6;

const base36 = [
    ['2', '3', '4', '5', '6', '7'],
    ['8', '9', 'b', 'B', 'C', 'd'],
    ['D', 'F', 'g', 'G', 'h', 'H'],
    ['j', 'J', 'K', 'l', 'L', 'M'],
    ['n', 'N', 'P', 'q', 'Q', 'r'],
    ['R', 't', 'T', 'V', 'W', 'X']
  ];

/*!
************************************************************************************************************************
* @brief Gets the line and column of Base36 table given a character
************************************************************************************************************************
* @param [in] c_: pointer of instance of lgps_filter_t used to control all;
* @param [out] line_: pointer to a integer which will store the line calculated;
* @param [out] col_: pointer to a integer which will store the column calculated.
************************************************************************************************************************
* @return None.
************************************************************************************************************************
**/
function geohash36_charToIndexes(c) {
   for (let i = 0; i < GEOHASH_MATRIX_SIDE; i++) {
     for (let j = 0; j < GEOHASH_MATRIX_SIDE; j++) {
        if (c == base36[i][j]) {
           return { line: i, col: j };
        }
     }
   }
}

/*!
************************************************************************************************************************
* @brief Encodes desired latitude/longitude in Geohash-36 representation with a desired length.
************************************************************************************************************************
* @param [in] latitude_: latitude of position which will be encoded;
* @param [in] longitude_: longitude of position which will be encoded;
* @param [out] outBuffer_: pointer of string buffer which will receive the Geohash-36;
* @param [in] numCharacters_: desired Geohash-36 length.
************************************************************************************************************************
* @return Geohash-36 length.
************************************************************************************************************************
**/
export function geohash36_encode(latin, lonin, numCharacters)
{
   //(51.504444, -0.086666)  -->   bdrdC26BqH

   var lat = [ -90.0,  90.0  ];
   var lon = [ -180.0, 180.0 ];
   var latIdx = 0;
   var longIdx = 0;
   var leftBoudary;
   var rightBoudary;
   var slice;
   var hash="";

   while (numCharacters > 0)
   {
      slice = lon[0] - lon[1];
      slice = Math.abs(slice) / GEOHASH_MATRIX_SIDE;

      for (let i = 0; i < GEOHASH_MATRIX_SIDE; i++)
      {
         leftBoudary = (lon[0] + (i * slice));
         rightBoudary = (lon[0] + ((i + 1) * slice));

         if ((lonin > leftBoudary) && (lonin <= rightBoudary))
         {
            longIdx = i;
            lon[0] = leftBoudary;
            lon[1] = rightBoudary;
            break;
         }
      }

      slice = lat[0] - lat[1];
      slice = Math.abs(slice) / GEOHASH_MATRIX_SIDE;

      for (let i = 0; i < GEOHASH_MATRIX_SIDE; i++)
      {
         leftBoudary = (lat[0] + (i * slice));
         rightBoudary = (lat[0] + ((i + 1) * slice));

         if ((latin > leftBoudary) && (latin <= rightBoudary))
         {
            latIdx = GEOHASH_MATRIX_SIDE - 1 - i;
            lat[0] = leftBoudary;
            lat[1] = rightBoudary;
            break;
         }
      }

      hash+= base36[latIdx][longIdx];
      latIdx = 0;
      longIdx = 0;
      numCharacters--;
   }

   return hash;
}

export function geohash36_decode(hash) {
   //bdrdC26BqH   ~~>   (51.504444, -0.086666)

   var lat = [ -90.0,  90.0  ];
   var lon = [ -180.0, 180.0 ];
   var slice;
   var linecol = {};

   // If no hash just return random 0, 0
   if (hash == "") return { lat: 0, lon: -0};

   for (let i = 0; i < hash.length; i++) {

      linecol = geohash36_charToIndexes(hash[i]);

      if (linecol.line == -1)
         return -1;

      linecol.line = GEOHASH_MATRIX_SIDE - 1 - linecol.line;

      slice = lon[0] - lon[1];
      slice = Math.abs(slice) / GEOHASH_MATRIX_SIDE;
      lon[1] = lon[0] + (slice * (linecol.col + 1));
      lon[0] = lon[0] + (slice * linecol.col);

      slice = lat[0] - lat[1];
      slice = Math.abs(slice) / GEOHASH_MATRIX_SIDE;
      lat[1] = lat[0] + (slice * (linecol.line + 1));
      lat[0] = lat[0] + (slice * linecol.line);
   }

   return {
     lat: (lat[1] + lat[0]) / 2,
     lon: (lon[1] + lon[0]) / 2,
   }
}
