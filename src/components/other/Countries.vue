<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
        <div class="text-center">  {{this.$t('othertools.countries.title')}}</div>
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('countries.info')"></div>
      <v-table
        :phsearch="phsearch"
        :defsearch="defsearch"
        :cols="cols"
        :rows="rows"
      />
    </div>
  </div>
</template>

<script>

import VTable from '@/components/inputs/VTable.vue'

export default {

  name: 'Countries',

  // Prop initcipher is parameter passed by route (optional)
  props: {
    msg: String
  },

  components: {
    VTable
  },

  // Data include variables to dynamically set appearnce and labels
  data: function () {
    return {

      phsearch: this.$t('countries.ph'),
      defsearch: 2,

      // Countries
      // web is the Top Level Domain (TLD) for the countrie
      // ccode2 is country code according to ISO 3166-1
      // ccode3 is country code according to ISO 3166-1
      // cnum   is country number according to ISO 3166-1
      // tel is the international access code for phone
      // cur is the name of national currency
      // ccur is the currency code according to ISO 4217 (Swift codes)
      // flag is a link to the image
      // names are translated using vue-i18n with ccode3 as an index (lowercase)
      // square roots of name and currency are calculated

      cols: [
        { field: "flag", label: this.$t('countries.flag'), sortable: false, width: "7%",
          image: {
            src: function (row) {
              const fileName = row.ccode3.toLowerCase() + '.png';
              return require(`@/assets/flags/${fileName}`);
            },
            width: "30",
            height: "20"
          }
        },
        { field: "ccode3", label: this.$t('countries.ccode3'), sortable: true, width: "7%",
          parseCol: function(s) {
            // State codes are 2 character, whitespace is optional
            return s.match(/([A-Za-z]{3}[\s]*)/g);
          },
        },
        { field: "ccode2", label: this.$t('countries.ccode2'), sortable: true, width: "7%",
          parseCol: function(s) {
            // State codes are 2 character, whitespace is optional
            return s.match(/([A-Za-z]{2}[\s]*)/g);
          },
        },
        { field: "cnum", label: this.$t('countries.cnum'), sortable: true, width: "7%",
          matchCol: (c) => {
            // Cannot use this.rows here so passed as parameter
            // Case sensitive match on names
            return this.rows.findIndex( (e) => parseInt(e.cnum) == parseInt(c) )
          },
        },
        { field: "name", label: this.$t('countries.name'), sortable: true, width: "20%",
          // Use arrow notation to make this accessible
          computed: (r) => {
            return this.$t('countries.names.' + r.ccode3.toLowerCase())
          }
        },
        { field: "tel", label: this.$t('countries.tel'), sortable: true, width: "7%" },
        { field: "cur", label: this.$t('countries.cur'), sortable: true, width: "15%" },
        { field: "ccur", label: this.$t('countries.ccur'), sortable: true, width: "7%",
          parseCol: function(s) {
            // State codes are 2 character, whitespace is optional
            return s.match(/([A-Za-z]{3}[\s]*)/g);
          },
        }
      ],

      rows: [
        { ccode3: "ABW", web: "aw", ccode2: "AW", cnum: "533", tel: "297", cur: "florin", ccur: "AWG" },
        { ccode3: "AFG", web: "af", ccode2: "AF", cnum: "004", tel: "93", cur: "afghani", ccur: "AFN" },
        { ccode3: "AGO", web: "ao", ccode2: "AO", cnum: "024", tel: "244", cur: "kwanza", ccur: "AOA" },
        { ccode3: "AIA", web: "ai", ccode2: "AI", cnum: "660", tel: "1-264", cur: "dollar", ccur: "XCD"},
        { ccode3: "ALA", web: "ax", ccode2: "AX", cnum: "248", tel: "358-18", cur: "euro", ccur: "EUR" },
        { ccode3: "ALB", web: "al", ccode2: "AL", cnum: "008", tel: "355", cur: "lek", ccur: "ALL" },
        { ccode3: "AND", web: "ad", ccode2: "AD", cnum: "020", tel: "376", cur: "euro", ccur: "EUR" },
        { ccode3: "ARE", web: "ae", ccode2: "AE", cnum: "784", tel: "971", cur: "dirham", ccur: "AED" },
        { ccode3: "ARG", web: "ar", ccode2: "AR", cnum: "032", tel: "54", cur: "peso", ccur: "ARS" },
        { ccode3: "ARM", web: "am", ccode2: "AM", cnum: "051", tel: "374", cur: "dram", ccur: "AMD" },
        { ccode3: "ASM", web: "as", ccode2: "AS", cnum: "016", tel: "1-684", cur: "dollar", ccur: "USD" },
        { ccode3: "ATA", web: "--", ccode2: "AQ", cnum: "010", tel: "--", cur: "--", ccur: "--" },
        { ccode3: "ATF", web: "tf", ccode2: "TF", cnum: "260", tel: "--", cur: "euro", ccur: "EUR" },
        { ccode3: "ATG", web: "ag", ccode2: "AG", cnum: "028", tel: "1-268", cur: "dollar", ccur: "XCD" },
        { ccode3: "AUS", web: "au", ccode2: "AU", cnum: "036", tel: "61", cur: "dollar", ccur: "AUD" },
        { ccode3: "AUT", web: "at", ccode2: "AT", cnum: "040", tel: "43", cur: "euro", ccur: "EUR" },
        { ccode3: "AZE", web: "az", ccode2: "AZ", cnum: "031", tel: "994", cur: "manat", ccur: "AZN" },
        { ccode3: "BDI", web: "bi", ccode2: "BI", cnum: "108", tel: "257", cur: "frank", ccur: "BIF" },
        { ccode3: "BEL", web: "be", ccode2: "BE", cnum: "056", tel: "32", cur: "euro", ccur: "EUR" },
        { ccode3: "BEN", web: "bj", ccode2: "BJ", cnum: "204", tel: "229", cur: "CFA franc", ccur: "XOF" },
        { ccode3: "BES", web: "nl", ccode2: "BQ", cnum: "535", tel: "599", cur: "dollar", ccur: "USD" },
        { ccode3: "BFA", web: "bf", ccode2: "BF", cnum: "854", tel: "226", cur: "CFA franc", ccur: "XOF" },
        { ccode3: "BGD", web: "bd", ccode2: "BD", cnum: "050", tel: "880", cur: "taka", ccur: "BDT" },
        { ccode3: "BGR", web: "bg", ccode2: "BG", cnum: "100", tel: "359", cur: "lev", ccur: "BGN" },
        { ccode3: "BHR", web: "bh", ccode2: "BH", cnum: "048", tel: "973", cur: "dinar", ccur: "BHD" },
        { ccode3: "BHS", web: "bs", ccode2: "BS", cnum: "044", tel: "1-242", cur: "dollar", ccur: "BSD" },
        { ccode3: "BIH", web: "ba", ccode2: "BA", cnum: "070", tel: "387", cur: "mark", ccur: "BAM" },
        { ccode3: "BLM", web: "--", ccode2: "BL", cnum: "652", tel: "590", cur: "euro", ccur: "EUR" },
        { ccode3: "BLR", web: "by", ccode2: "BY", cnum: "652", tel: "375", cur: "ruble", ccur: "BYN" },
        { ccode3: "BLZ", web: "bz", ccode2: "BZ", cnum: "084", tel: "501", cur: "dollar", ccur: "BZD" },
        { ccode3: "BMU", web: "bm", ccode2: "BM", cnum: "060", tel: "1-441", cur: "dollar", ccur: "BMD" },
        { ccode3: "BOL", web: "bo", ccode2: "BO", cnum: "068", tel: "591", cur: "boliviano", ccur: "BOB" },
        { ccode3: "BRA", web: "br", ccode2: "BR", cnum: "076", tel: "55", cur: "real", ccur: "BRL" },
        { ccode3: "BRB", web: "bb", ccode2: "BB", cnum: "052", tel: "1-246", cur: "dollar", ccur: "BBD" },
        { ccode3: "BRN", web: "bn", ccode2: "BN", cnum: "096", tel: "673", cur: "dollar", ccur: "BND" },
        { ccode3: "BTN", web: "bt", ccode2: "BT", cnum: "064", tel: "975", cur: "ngultrum", ccur: "BTN" },
        { ccode3: "BVT", web: "bv", ccode2: "BV", cnum: "074", tel: "--", cur: "--", ccur: "--" },
        { ccode3: "BWA", web: "bw", ccode2: "BW", cnum: "072", tel: "267", cur: "pula", ccur: "BWP" },
        { ccode3: "CAF", web: "cf", ccode2: "CF", cnum: "140", tel: "236", cur: "CFA franc", ccur: "XOF" },
        { ccode3: "CAN", web: "ca", ccode2: "CA", cnum: "124", tel: "1", cur: "dollar", ccur: "CAD" },
        { ccode3: "CCK", web: "cc", ccode2: "CC", cnum: "166", tel: "61-891", cur: "dollar", ccur: "AUD" },
        { ccode3: "CHE", web: "ch", ccode2: "CH", cnum: "756", tel: "41", cur: "frank", ccur: "CHF" },
        { ccode3: "CHL", web: "cl", ccode2: "CL", cnum: "152", tel: "56", cur: "peso", ccur: "CLP" },
        { ccode3: "CHN", web: "cn", ccode2: "CN", cnum: "156", tel: "86", cur: "yuan", ccur: "CNY" },
        { ccode3: "CIV", web: "ci", ccode2: "CI", cnum: "384", tel: "225", cur: "CFA franc", ccur: "XOF" },
        { ccode3: "CMR", web: "cm", ccode2: "CM", cnum: "120", tel: "237", cur: "CFA franc", ccur: "XOF" },
        { ccode3: "COD", web: "cd", ccode2: "CD", cnum: "180", tel: "243", cur: "frank", ccur: "CDF" },
        { ccode3: "COG", web: "cg", ccode2: "CG", cnum: "178", tel: "242", cur: "CFA franc", ccur: "XOF" },
        { ccode3: "COK", web: "ck", ccode2: "CK", cnum: "184", tel: "682", cur: "dollar", ccur: "NZD" },
        { ccode3: "COL", web: "co", ccode2: "CO", cnum: "170", tel: "57", cur: "peso", ccur: "COP" },
        { ccode3: "COM", web: "km", ccode2: "KM", cnum: "174", tel: "269", cur: "frank", ccur: "KMF" },
        { ccode3: "CPV", web: "cv", ccode2: "CV", cnum: "132", tel: "238", cur: "escudo", ccur: "CVE" },
        { ccode3: "CRI", web: "cr", ccode2: "CR", cnum: "188", tel: "506", cur: "colon", ccur: "CRC" },
        { ccode3: "CUB", web: "cu", ccode2: "CU", cnum: "192", tel: "53", cur: "peso", ccur: "CUP" },
        { ccode3: "CUW", web: "cw", ccode2: "CW", cnum: "531", tel: "599", cur: "gulden", ccur: "ANG" },
        { ccode3: "CXR", web: "cx", ccode2: "CX", cnum: "162", tel: "61-891", cur: "dollar", ccur: "AUD" },
        { ccode3: "CYM", web: "ky", ccode2: "KY", cnum: "136", tel: "1-345", cur: "dollar", ccur: "KYD" },
        { ccode3: "CYP", web: "cy", ccode2: "CY", cnum: "196", tel: "357", cur: "euro", ccur: "EUR" },
        { ccode3: "CZE", web: "cz", ccode2: "CZ", cnum: "203", tel: "420", cur: "koruna", ccur: "CZK" },
        { ccode3: "DEU", web: "de", ccode2: "DE", cnum: "276", tel: "49", cur: "euro", ccur: "EUR" },
        { ccode3: "DJI", web: "dj", ccode2: "DJ", cnum: "262", tel: "253", cur: "frank", ccur: "DJF" },
        { ccode3: "DMA", web: "dm", ccode2: "DM", cnum: "212", tel: "1-767", cur: "dollar", ccur: "XCD" },
        { ccode3: "DNK", web: "dk", ccode2: "DK", cnum: "208", tel: "45", cur: "krone", ccur: "DKK" },
        { ccode3: "DOM", web: "do", ccode2: "DO", cnum: "214", tel: "1-809", cur: "kroon", ccur: "DKK" },
        { ccode3: "DZA", web: "dz", ccode2: "DZ", cnum: "012", tel: "123", cur: "dinar", ccur: "DZD" },
        { ccode3: "ECU", web: "ec", ccode2: "EC", cnum: "218", tel: "593", cur: "dollar", ccur: "USD" },
        { ccode3: "EGY", web: "eg", ccode2: "EG", cnum: "818", tel: "20", cur: "pound", ccur: "EGP" },
        { ccode3: "ERI", web: "er", ccode2: "ER", cnum: "232", tel: "291", cur: "nakfa", ccur: "ERN" },
        { ccode3: "ESH", web: "eh", ccode2: "EH", cnum: "732", tel: "212", cur: "--", ccur: "--" },
        { ccode3: "ESP", web: "es", ccode2: "ES", cnum: "724", tel: "34", cur: "euro", ccur: "EUR" },
        { ccode3: "EST", web: "ee", ccode2: "EE", cnum: "233", tel: "372", cur: "euro", ccur: "EUR" },
        { ccode3: "ETH", web: "et", ccode2: "ET", cnum: "231", tel: "251", cur: "birr", ccur: "ETB" },
        { ccode3: "FIN", web: "fi", ccode2: "FI", cnum: "246", tel: "358", cur: "euro", ccur: "EUR" },
        { ccode3: "FJI", web: "fj", ccode2: "FJ", cnum: "242", tel: "679", cur: "dollar", ccur: "FJD" },
        { ccode3: "FLK", web: "fk", ccode2: "FK", cnum: "238", tel: "500", cur: "pound", ccur: "FKP" },
        { ccode3: "FRA", web: "fr", ccode2: "FR", cnum: "250", tel: "33", cur: "euro", ccur: "EUR" },
        { ccode3: "FRO", web: "fo", ccode2: "FO", cnum: "234", tel: "298", cur: "króna", ccur: "FOK" },
        { ccode3: "FSM", web: "fm", ccode2: "FM", cnum: "583", tel: "691", cur: "dollar", ccur: "USD" },
        { ccode3: "GAB", web: "ga", ccode2: "GA", cnum: "266", tel: "241", cur: "CFA franc", ccur: "XOF" },
        { ccode3: "GBR", web: "uk", ccode2: "GB", cnum: "826", tel: "44", cur: "pound", ccur: "GBP" },
        { ccode3: "GEO", web: "ge", ccode2: "GE", cnum: "268", tel: "995", cur: "lari", ccur: "GEL" },
        { ccode3: "GGY", web: "gg", ccode2: "GG", cnum: "831", tel: "44-1481", cur: "pound", ccur: "GBP" },
        { ccode3: "GHA", web: "gh", ccode2: "GH", cnum: "288", tel: "233", cur: "cedi", ccur: "GHS" },
        { ccode3: "GIB", web: "gi", ccode2: "GI", cnum: "292", tel: "350", cur: "pound", ccur: "GIP" },
        { ccode3: "GIN", web: "gn", ccode2: "GN", cnum: "324", tel: "224", cur: "frank", ccur: "GNF" },
        { ccode3: "GLP", web: "gp", ccode2: "GP", cnum: "312", tel: "590", cur: "euro", ccur: "EUR" },
        { ccode3: "GMB", web: "gm", ccode2: "GM", cnum: "312", tel: "220", cur: "dalasi", ccur: "GMD" },
        { ccode3: "GNB", web: "gw", ccode2: "GW", cnum: "624", tel: "245", cur: "CFA franc", ccur: "XOF" },
        { ccode3: "GNQ", web: "gq", ccode2: "GQ", cnum: "226", tel: "240", cur: "CFA franc", ccur: "XOF" },
        { ccode3: "GRC", web: "gr", ccode2: "GR", cnum: "300", tel: "30", cur: "euro", ccur: "EUR" },
        { ccode3: "GRD", web: "gd", ccode2: "GD", cnum: "308", tel: "1-473", cur: "dollar", ccur: "XCD" },
        { ccode3: "GRL", web: "gl", ccode2: "GL", cnum: "304", tel: "299", cur: "krone", ccur: "DKK" },
        { ccode3: "GTM", web: "gt", ccode2: "GT", cnum: "320", tel: "502", cur: "quetzal", ccur: "GTQ" },
        { ccode3: "GUF", web: "gf", ccode2: "GF", cnum: "254", tel: "594", cur: "euro", ccur: "EUR" },
        { ccode3: "GUM", web: "gu", ccode2: "GU", cnum: "316", tel: "1-684", cur: "dollar", ccur: "USD" },
        { ccode3: "GUY", web: "gy", ccode2: "GY", cnum: "328", tel: "592", cur: "dollar", ccur: "GYD" },
        { ccode3: "HKG", web: "hk", ccode2: "HK", cnum: "344", tel: "852", cur: "dollar", ccur: "HKD" },
        { ccode3: "HMD", web: "--", ccode2: "HM", cnum: "334", tel: "--", cur: "--", ccur: "--" },
        { ccode3: "HND", web: "hn", ccode2: "HN", cnum: "340", tel: "504", cur: "lempira", ccur: "HNL" },
        { ccode3: "HRV", web: "hr", ccode2: "HR", cnum: "191", tel: "385", cur: "kuna", ccur: "HRK" },
        { ccode3: "HTI", web: "ht", ccode2: "HT", cnum: "332", tel: "509", cur: "gourde", ccur: "HTG" },
        { ccode3: "HUN", web: "hu", ccode2: "HU", cnum: "348", tel: "36", cur: "forint", ccur: "HUF" },
        { ccode3: "IDN", web: "id", ccode2: "ID", cnum: "360", tel: "62", cur: "rupiah", ccur: "IDR" },
        { ccode3: "IMN", web: "im", ccode2: "IM", cnum: "833", tel: "44", cur: "pound", ccur: "GBP" },
        { ccode3: "IND", web: "in", ccode2: "IN", cnum: "356", tel: "91", cur: "rupee", ccur: "INR" },
        { ccode3: "IOT", web: "io", ccode2: "IO", cnum: "086", tel: "246", cur: "pound", ccur: "GBP" },
        { ccode3: "IRL", web: "ie", ccode2: "IE", cnum: "372", tel: "353", cur: "euro", ccur: "EUR" },
        { ccode3: "IRN", web: "ir", ccode2: "IR", cnum: "364", tel: "98", cur: "rial", ccur: "IRR" },
        { ccode3: "IRQ", web: "iq", ccode2: "IQ", cnum: "368", tel: "964", cur: "dinar", ccur: "IQD" },
        { ccode3: "ISL", web: "is", ccode2: "IS", cnum: "352", tel: "354", cur: "króna", ccur: "ISK" },
        { ccode3: "ISR", web: "il", ccode2: "IL", cnum: "376", tel: "972", cur: "jsekel", ccur: "ILS" },
        { ccode3: "ITA", web: "it", ccode2: "IT", cnum: "380", tel: "39", cur: "euro", ccur: "EUR" },
        { ccode3: "JAM", web: "jm", ccode2: "JM", cnum: "388", tel: "876", cur: "dollar", ccur: "JMD" },
        { ccode3: "JEY", web: "je", ccode2: "JE", cnum: "832", tel: "44-1534", cur: "pound", ccur: "JEP" },
        { ccode3: "JOR", web: "jo", ccode2: "JO", cnum: "400", tel: "962", cur: "dinar", ccur: "JOD" },
        { ccode3: "JPN", web: "jp", ccode2: "JP", cnum: "392", tel: "81", cur: "yen", ccur: "JPY" },
        { ccode3: "KAZ", web: "kz", ccode2: "KZ", cnum: "398", tel: "7-6", cur: "tenge", ccur: "KZT" },
        { ccode3: "KEN", web: "ke", ccode2: "KE", cnum: "404", tel: "254", cur: "shilling", ccur: "KES" },
        { ccode3: "KGZ", web: "kg", ccode2: "KG", cnum: "417", tel: "996", cur: "som", ccur: "KGS" },
        { ccode3: "KHM", web: "kh", ccode2: "KH", cnum: "116", tel: "855", cur: "riel", ccur: "KHR" },
        { ccode3: "KIR", web: "ki", ccode2: "KI", cnum: "296", tel: "868", cur: "dollar", ccur: "AUD" },
        { ccode3: "KNA", web: "kn", ccode2: "KN", cnum: "659", tel: "1-869", cur: "dollar", ccur: "XCD" },
        { ccode3: "KOR", web: "kr", ccode2: "KR", cnum: "410", tel: "82", cur: "won", ccur: "KRW" },
        { ccode3: "KWT", web: "kw", ccode2: "KW", cnum: "414", tel: "965", cur: "dinar", ccur: "KWD" },
        { ccode3: "LAO", web: "la", ccode2: "LA", cnum: "418", tel: "856", cur: "kip", ccur: "LAK" },
        { ccode3: "LBN", web: "lb", ccode2: "LB", cnum: "422", tel: "961", cur: "pound", ccur: "LBP" },
        { ccode3: "LBR", web: "lr", ccode2: "LR", cnum: "430", tel: "231", cur: "dollar", ccur: "LRD" },
        { ccode3: "LBY", web: "ly", ccode2: "LY", cnum: "434", tel: "218", cur: "dinar", ccur: "LYD" },
        { ccode3: "LCA", web: "lc", ccode2: "LC", cnum: "662", tel: "1-758", cur: "dollar", ccur: "XCD" },
        { ccode3: "LIE", web: "li", ccode2: "LI", cnum: "438", tel: "423", cur: "frank", ccur: "CHF" },
        { ccode3: "LKA", web: "lk", ccode2: "LK", cnum: "144", tel: "94", cur: "rupee", ccur: "LKR" },
        { ccode3: "LSO", web: "ls", ccode2: "LS", cnum: "426", tel: "266", cur: "loti", ccur: "LSR" },
        { ccode3: "LTU", web: "lt", ccode2: "LT", cnum: "440", tel: "370", cur: "euro", ccur: "EUR" },
        { ccode3: "LUX", web: "lu", ccode2: "LU", cnum: "428", tel: "371", cur: "euro", ccur: "EUR" },
        { ccode3: "LVA", web: "lv", ccode2: "LV", cnum: "442", tel: "352", cur: "euro", ccur: "EUR" },
        { ccode3: "MAC", web: "mo", ccode2: "MO", cnum: "446", tel: "853", cur: "pataca", ccur: "MOP" },
        { ccode3: "MAF", web: "mf", ccode2: "MF", cnum: "663", tel: "590", cur: "euro", ccur: "EUR" },
        { ccode3: "MAR", web: "ma", ccode2: "MA", cnum: "504", tel: "212", cur: "dirham", ccur: "MAD" },
        { ccode3: "MCO", web: "mc", ccode2: "MC", cnum: "492", tel: "377", cur: "euro", ccur: "EUR" },
        { ccode3: "MDA", web: "md", ccode2: "MD", cnum: "498", tel: "373", cur: "leu", ccur: "MDL" },
        { ccode3: "MDG", web: "mg", ccode2: "MG", cnum: "450", tel: "261", cur: "ariary", ccur: "MGA" },
        { ccode3: "MDV", web: "mv", ccode2: "MV", cnum: "462", tel: "960", cur: "rufiyaa", ccur: "MVR" },
        { ccode3: "MEX", web: "mx", ccode2: "MX", cnum: "484", tel: "52", cur: "peso", ccur: "MXN" },
        { ccode3: "MHL", web: "mh", ccode2: "MH", cnum: "584", tel: "692", cur: "dollar", ccur: "USD" },
        { ccode3: "MKD", web: "mk", ccode2: "MK", cnum: "807", tel: "389", cur: "denar", ccur: "MKD" },
        { ccode3: "MLI", web: "ml", ccode2: "ML", cnum: "466", tel: "223", cur: "CFA franc", ccur: "XOF" },
        { ccode3: "MLT", web: "mt", ccode2: "MT", cnum: "470", tel: "356", cur: "euro", ccur: "EUR" },
        { ccode3: "MMR", web: "mm", ccode2: "MM", cnum: "104", tel: "95", cur: "kyat", ccur: "MMK" },
        { ccode3: "MNE", web: "me", ccode2: "ME", cnum: "499", tel: "382", cur: "euro", ccur: "EUR" },
        { ccode3: "MNG", web: "mn", ccode2: "MN", cnum: "496", tel: "976", cur: "tugrik", ccur: "MNT" },
        { ccode3: "MNP", web: "mp", ccode2: "MP", cnum: "580", tel: "1-670", cur: "dollar", ccur: "USD" },
        { ccode3: "MOZ", web: "mz", ccode2: "MZ", cnum: "508", tel: "258", cur: "metical", ccur: "MZN" },
        { ccode3: "MRT", web: "mr", ccode2: "MR", cnum: "478", tel: "222", cur: "ouguiya", ccur: "MRU" },
        { ccode3: "MSR", web: "ms", ccode2: "MS", cnum: "500", tel: "1-164", cur: "dollar", ccur: "XCD" },
        { ccode3: "MTQ", web: "mq", ccode2: "MQ", cnum: "474", tel: "596", cur: "euro", ccur: "EUR" },
        { ccode3: "MUS", web: "mu", ccode2: "MU", cnum: "480", tel: "230", cur: "rupee", ccur: "MUR" },
        { ccode3: "MWI", web: "mw", ccode2: "MW", cnum: "454", tel: "265", cur: "kwacha", ccur: "MWK" },
        { ccode3: "MYS", web: "my", ccode2: "MY", cnum: "458", tel: "60", cur: "ringgit", ccur: "MYR" },
        { ccode3: "MYT", web: "yt", ccode2: "YT", cnum: "175", tel: "262", cur: "euro", ccur: "EUR" },
        { ccode3: "NAM", web: "na", ccode2: "NA", cnum: "516", tel: "264", cur: "dollar", ccur: "NAD" },
        { ccode3: "NCL", web: "nc", ccode2: "NC", cnum: "540", tel: "687", cur: "CFP franc", ccur: "XPF" },
        { ccode3: "NER", web: "ne", ccode2: "NE", cnum: "562", tel: "227", cur: "CFA franc", ccur: "XOF" },
        { ccode3: "NGA", web: "ng", ccode2: "NG", cnum: "574", tel: "234", cur: "naira", ccur: "NGN" },
        { ccode3: "NIC", web: "ni", ccode2: "NI", cnum: "574", tel: "505", cur: "cordoba", ccur: "NIO" },
        { ccode3: "NIU", web: "nu", ccode2: "NU", cnum: "570", tel: "683", cur: "dollar", ccur: "NZD" },
        { ccode3: "NLD", web: "nl", ccode2: "NL", cnum: "528", tel: "31", cur: "euro", ccur: "EUR" },
        { ccode3: "NOR", web: "no", ccode2: "NO", cnum: "578", tel: "47", cur: "krone", ccur: "NKK" },
        { ccode3: "NPL", web: "np", ccode2: "NP", cnum: "524", tel: "977", cur: "rupee", ccur: "NPR" },
        { ccode3: "NRU", web: "nr", ccode2: "NR", cnum: "520", tel: "674", cur: "dollar", ccur: "AUD" },
        { ccode3: "NZL", web: "nz", ccode2: "NZ", cnum: "554", tel: "64", cur: "dollar", ccur: "NZD" },
        { ccode3: "OMN", web: "om", ccode2: "OM", cnum: "512", tel: "968", cur: "rial", ccur: "OMR" },
        { ccode3: "PAK", web: "pk", ccode2: "PK", cnum: "586", tel: "92", cur: "rupee", ccur: "PKR" },
        { ccode3: "PAN", web: "pa", ccode2: "PA", cnum: "591", tel: "507", cur: "balboa", ccur: "PAB" },
        { ccode3: "PCN", web: "pn", ccode2: "PN", cnum: "612", tel: "649", cur: "dollar", ccur: "NZD" },
        { ccode3: "PER", web: "pe", ccode2: "PE", cnum: "604", tel: "51", cur: "sol", ccur: "PEN" },
        { ccode3: "PHL", web: "ph", ccode2: "PH", cnum: "608", tel: "63", cur: "peso", ccur: "PHP" },
        { ccode3: "PLW", web: "pw", ccode2: "PW", cnum: "585", tel: "680", cur: "dollar", ccur: "USD" },
        { ccode3: "PNG", web: "pg", ccode2: "PG", cnum: "598", tel: "675", cur: "kina", ccur: "PGK" },
        { ccode3: "POL", web: "pl", ccode2: "PL", cnum: "616", tel: "48", cur: "zloty", ccur: "PLN" },
        { ccode3: "PRI", web: "pr", ccode2: "PR", cnum: "630", tel: "1-787", cur: "dollar", ccur: "USD" },
        { ccode3: "PRK", web: "kp", ccode2: "KP", cnum: "408", tel: "850", cur: "won", ccur: "KPW" },
        { ccode3: "PRT", web: "pt", ccode2: "PT", cnum: "620", tel: "351", cur: "euro", ccur: "EUR" },
        { ccode3: "PRY", web: "py", ccode2: "PY", cnum: "600", tel: "595", cur: "guarani", ccur: "PYG" },
        { ccode3: "PSE", web: "ps", ccode2: "PS", cnum: "275", tel: "970", cur: "dinar", ccur: "JOD" },
        { ccode3: "PYF", web: "pf", ccode2: "PF", cnum: "258", tel: "689", cur: "CFP franc", ccur: "XPF" },
        { ccode3: "QAT", web: "qa", ccode2: "QA", cnum: "634", tel: "974", cur: "rial", ccur: "QAR" },
        { ccode3: "REU", web: "re", ccode2: "RE", cnum: "638", tel: "262", cur: "euro", ccur: "EUR" },
        { ccode3: "ROU", web: "ro", ccode2: "RO", cnum: "642", tel: "40", cur: "leu", ccur: "RON" },
        { ccode3: "RUS", web: "ru", ccode2: "RU", cnum: "643", tel: "7", cur: "ruble", ccur: "RUB" },
        { ccode3: "RWA", web: "rw", ccode2: "RW", cnum: "646", tel: "250", cur: "franc", ccur: "RWF" },
        { ccode3: "SAU", web: "sa", ccode2: "SA", cnum: "682", tel: "966", cur: "riyal", ccur: "SAR" },
        { ccode3: "SDN", web: "sd", ccode2: "SD", cnum: "729", tel: "249", cur: "pound", ccur: "SDG" },
        { ccode3: "SEN", web: "sn", ccode2: "SN", cnum: "686", tel: "221", cur: "CFA franc", ccur: "XOF" },
        { ccode3: "SGP", web: "sg", ccode2: "SG", cnum: "702", tel: "65", cur: "dollar", ccur: "SGD" },
        { ccode3: "SGS", web: "gs", ccode2: "GS", cnum: "239", tel: "--", cur: "pound", ccur: "FKP" },
        { ccode3: "SHN", web: "sh", ccode2: "SH", cnum: "654", tel: "290", cur: "pound", ccur: "SHP" },
        { ccode3: "SJM", web: "sj", ccode2: "SJ", cnum: "744", tel: "47", cur: "euro", ccur: "EUR" },
        { ccode3: "SLB", web: "sb", ccode2: "SB", cnum: "090", tel: "677", cur: "dollar", ccur: "SBD" },
        { ccode3: "SLE", web: "sl", ccode2: "SL", cnum: "694", tel: "232", cur: "leone", ccur: "SLL" },
        { ccode3: "SLV", web: "sv", ccode2: "SV", cnum: "222", tel: "503", cur: "dollar", ccur: "USD" },
        { ccode3: "SMR", web: "sm", ccode2: "SM", cnum: "674", tel: "378", cur: "euro", ccur: "EUR" },
        { ccode3: "SOM", web: "so", ccode2: "SO", cnum: "706", tel: "252", cur: "shilling", ccur: "SOS" },
        { ccode3: "SPM", web: "pm", ccode2: "PM", cnum: "666", tel: "508", cur: "euro", ccur: "EUR" },
        { ccode3: "SRB", web: "rs", ccode2: "RS", cnum: "688", tel: "381", cur: "dinar", ccur: "RSD" },
        { ccode3: "SSD", web: "ss", ccode2: "SS", cnum: "728", tel: "211", cur: "pound", ccur: "SSP" },
        { ccode3: "STP", web: "st", ccode2: "ST", cnum: "678", tel: "239", cur: "dobra", ccur: "STD" },
        { ccode3: "SUR", web: "sr", ccode2: "SR", cnum: "740", tel: "597", cur: "dollar", ccur: "SRD" },
        { ccode3: "SVK", web: "sk", ccode2: "SK", cnum: "703", tel: "421", cur: "euro", ccur: "EUR" },
        { ccode3: "SVN", web: "si", ccode2: "SI", cnum: "705", tel: "386", cur: "euro", ccur: "EUR" },
        { ccode3: "SWE", web: "se", ccode2: "SE", cnum: "752", tel: "46", cur: "krona", ccur: "SEK" },
        { ccode3: "SWZ", web: "sz", ccode2: "SZ", cnum: "752", tel: "268", cur: "lilangeni", ccur: "SZL" },
        { ccode3: "SXM", web: "sx", ccode2: "SX", cnum: "752", tel: "1-721", cur: "guilder", ccur: "ANG" },
        { ccode3: "SYC", web: "sc", ccode2: "SC", cnum: "690", tel: "248", cur: "rupee", ccur: "SCR" },
        { ccode3: "SYR", web: "sy", ccode2: "SY", cnum: "760", tel: "963", cur: "pound", ccur: "SYP" },
        { ccode3: "TCA", web: "tc", ccode2: "TC", cnum: "796", tel: "1-649", cur: "dollar", ccur: "USD" },
        { ccode3: "TCD", web: "td", ccode2: "TD", cnum: "148", tel: "235", cur: "CFA franc", ccur: "XOF" },
        { ccode3: "TGO", web: "tg", ccode2: "TG", cnum: "768", tel: "288", cur: "CFA franc", ccur: "XOF" },
        { ccode3: "THA", web: "th", ccode2: "TH", cnum: "764", tel: "66", cur: "baht", ccur: "THB" },
        { ccode3: "TJK", web: "tj", ccode2: "TJ", cnum: "762", tel: "992", cur: "somoni", ccur: "TJS" },
        { ccode3: "TKL", web: "tk", ccode2: "TK", cnum: "772", tel: "690", cur: "dollar", ccur: "NZD" },
        { ccode3: "TKM", web: "tm", ccode2: "TM", cnum: "795", tel: "993", cur: "manat", ccur: "TMM" },
        { ccode3: "TLS", web: "tl", ccode2: "TL", cnum: "626", tel: "670", cur: "dollar", ccur: "USD" },
        { ccode3: "TON", web: "to", ccode2: "TO", cnum: "776", tel: "676", cur: "pa'anga", ccur: "TOP" },
        { ccode3: "TTO", web: "tt", ccode2: "TT", cnum: "780", tel: "1-868", cur: "dollar", ccur: "TTD" },
        { ccode3: "TUN", web: "tn", ccode2: "TN", cnum: "788", tel: "216", cur: "dinar", ccur: "TND" },
        { ccode3: "TUR", web: "tr", ccode2: "TR", cnum: "792", tel: "90", cur: "lira", ccur: "TRY" },
        { ccode3: "TUV", web: "tv", ccode2: "TV", cnum: "798", tel: "688", cur: "dollar", ccur: "AUD" },
        { ccode3: "TWN", web: "tw", ccode2: "TW", cnum: "158", tel: "886", cur: "dollar", ccur: "TWD" },
        { ccode3: "TZA", web: "tz", ccode2: "TZ", cnum: "834", tel: "255", cur: "shilling", ccur: "TZS" },
        { ccode3: "UGA", web: "ug", ccode2: "UG", cnum: "800", tel: "256", cur: "shilling", ccur: "UGS" },
        { ccode3: "UKR", web: "ua", ccode2: "UA", cnum: "804", tel: "380", cur: "grivna", ccur: "UAH" },
        { ccode3: "UMI", web: "us", ccode2: "UM", cnum: "581", tel: "--", cur: "dollar", ccur: "USD" },
        { ccode3: "URY", web: "uy", ccode2: "UY", cnum: "858", tel: "598", cur: "peso", ccur: "UYU" },
        { ccode3: "USA", web: "us", ccode2: "US", cnum: "840", tel: "1", cur: "dollar", ccur: "USD" },
        { ccode3: "UZB", web: "uz", ccode2: "UZ", cnum: "860", tel: "998", cur: "sum", ccur: "UKS" },
        { ccode3: "VAT", web: "va", ccode2: "VA", cnum: "336", tel: "379", cur: "euro", ccur: "EUR" },
        { ccode3: "VCT", web: "vc", ccode2: "VC", cnum: "670", tel: "1-784", cur: "dollar", ccur: "XCD" },
        { ccode3: "VEN", web: "ve", ccode2: "VE", cnum: "862", tel: "58", cur: "bolivar", ccur: "VES" },
        { ccode3: "VGB", web: "vg", ccode2: "VG", cnum: "092", tel: "1-284", cur: "dollar", ccur: "USD" },
        { ccode3: "VIR", web: "vi", ccode2: "VI", cnum: "850", tel: "1-340", cur: "dollar", ccur: "USD" },
        { ccode3: "VNM", web: "vn", ccode2: "VN", cnum: "704", tel: "84", cur: "dong", ccur: "VND" },
        { ccode3: "VUT", web: "vu", ccode2: "VU", cnum: "548", tel: "678", cur: "vatu", ccur: "VUV" },
        { ccode3: "WLF", web: "wf", ccode2: "WF", cnum: "876", tel: "681", cur: "CFP franc", ccur: "XPF" },
        { ccode3: "WSM", web: "ws", ccode2: "WS", cnum: "882", tel: "685", cur: "tala", ccur: "WST" },
        { ccode3: "YEM", web: "ye", ccode2: "YE", cnum: "887", tel: "967", cur: "rial", ccur: "YER" },
        { ccode3: "ZAF", web: "za", ccode2: "ZA", cnum: "710", tel: "27", cur: "rand", ccur: "ZAR" },
        { ccode3: "ZMB", web: "zm", ccode2: "ZM", cnum: "894", tel: "260", cur: "kwacha", ccur: "ZMW" },
        { ccode3: "ZWE", web: "zw", ccode2: "ZW", cnum: "716", tel: "263", cur: "undefined", ccur: "ZWL" }
      ]
    }
  },

}

</script>
