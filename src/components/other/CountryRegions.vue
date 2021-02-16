<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      <div class="text-center">{{$t('othertools.countryregions.title')}}</div>
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('countryregions.info')"></div>
      <div class="form-inline mb-2">
        <label for="countrylist" class="form-label mr-2">{{$t('countryregions.list')}}</label>
        <select id="countrylist" class="custom-select" v-model="country" @change="updateTable()">
          <option v-for="c in countries" :key="c.code" :value="c.code">{{c.description}}</option>
        </select>
      </div>
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

  props: {
    msg: String
  },

  components: {
    VTable,
  },

  data: function () {
    return {

      // Selected country
      country: "nl",
      
      // List of countries available
      countries : [
        { code: "nl", description: this.$t('countryregions.nl') },
        { code: "be", description: this.$t('countryregions.be') },
        { code: "de", description: this.$t('countryregions.de') },
        { code: "fr", description: this.$t('countryregions.fr') } 
      ],

      // placeholder for the search box
      phsearch: this.$t('countryregions.ph'),
      defsearch: 1,

      // Region definitions per country cols and rows
      countrydefs : {

        // Belgium
        be : {
          cols: [
            { field: "flag", label: this.$t('countryregions.flag'), sortable: false, width: "7%",
              image: {
                src: (r) => {
                  const fileName = this.country + "-" + r.code.toLowerCase() + '.png';
                  return require(`@/assets/regions/${fileName}`);
                },
                width: "30",
                height: "20"
              }
            },
            { field: "code", label: this.$t('countryregions.code'), sortable: true, width: "7%",
              parseCol: (s) => { return s.match(/([A-Za-z]{3}[\s]*)/g); },
            },
            { field: "name", label: this.$t('countryregions.name'), sortable: true, width: "30%",
              link : {
                href: (r) => { return "https://nl.wikipedia.org/wiki/" + r.url; }
              }
            },
            { field: "cat", label: this.$t('countryregions.cat'), sortable: true, width: "20%" },
            { field: "cap", label: this.$t('countryregions.cap'), sortable: true, width: "25%" },
            { field: "mun", label: this.$t('countryregions.mun'),
              sortable: { numsort: true },
              width: "7%"
            }
          ],

          rows: [
            { code: "BRU", name: "Brussels Hoofdstedelijk Gewest", cat: "Gewest", flag: "Flag", cap: "Brussel", url: "Brussels_Hoofdstedelijk_Gewest", mun: 19 },
            { code: "VLG", name: "Vlaams Gewest", cat: "Gewest", flag: "Flag", cap: "Brussel", url: "Vlaanderen", mun: 0 },
            { code: "VAN", name: "Antwerpen", cat: "Provincie", flag: "Flag", cap: "Antwerpen", url: "Antwerpen_(provincie)", mun: 70 },
            { code: "VBR", name: "Vlaams-Brabant", cat: "Provincie", flag: "Flag", cap: "Leuven", url: "Vlaams-Brabant", mun: 65 },
            { code: "VLI", name: "Limburg", cat: "Provincie", flag: "Flag", cap: "Hasselt", url: "Limburg_(Belgische_provincie)", mun: 44 },
            { code: "VOV", name: "Oost-Vlaanderen", cat: "Provincie", flag: "Flag", cap: "Gent", url: "Oost-Vlaanderen", mun: 65 },
            { code: "VWV", name: "West-Vlaanderen", cat: "Provincie", flag: "Flag", cap: "Brugge", url: "West-Vlaanderen", mun: 64 },
            { code: "WAL", name: "Waals Gewest", cat: "Gewest", flag: "Flag", cap: "Namen", url: "Wallonië", mun: 64 },
            { code: "WBR", name: "Waals Brabant", cat: "Provincie", flag: "Flag", cap: "Waver", url: "Wallonië", mun: 27 },
            { code: "WHT", name: "Henegouwen", cat: "Provincie", flag: "Flag", cap: "Bergen", url: "Henegouwen", mun: 69 },
            { code: "WLG", name: "Luik", cat: "Provincie", flag: "Flag", cap: "Luik", url: "Luik_(provincie)", mun: 84 },
            { code: "WLX", name: "Luxemburg", cat: "Provincie", flag: "Flag", cap: "Aarlen", url: "Luxemburg_(provincie)", mun: 44 },
            { code: "WNA", name: "Namen", cat: "Provincie", flag: "Flag", cap: "Namen", url: "Namen_(provincie)", mun: 38 },
          ]
        },

        // Germany
        de : {
          cols: [

            { field: "flag", label: this.$t('countryregions.flag'), sortable: false, width: "7%",
              image: {
                src: (r) => {
                  const fileName = this.country + "-" + r.code.toLowerCase() + '.png';
                  return require(`@/assets/regions/${fileName}`);
                },
                width: "30",
                height: "20"
              }
            },
            { field: "code", label: this.$t('countryregions.code'), sortable: true, width: "7%",
              parseCol: (s) => { return s.match(/([A-Za-z]{2}[\s]*)/g); },
            },
            { field: "name", label: this.$t('countryregions.name'), sortable: true, width: "30%",
              link : {
                href: (r) => { return "https://de.wikipedia.org/wiki/" + r.url; }
              }
            },
            { field: "cap", label: this.$t('countryregions.cap'), sortable: true, width: "25%" },
            { field: "bundesrat", label: this.$t('countryregions.bundesrat'),
              sortable: {
                numsort: true
              },
              width: "5%"
            },
            { field: "landkreise", label: this.$t('countryregions.landkreise'),
              sortable: { numsort: true },
              width: "5%"
            },
            { field: "stadtkreise", label: this.$t('countryregions.stadtkreise'),
              sortable: { numsort: true },
              width: "5%"
            }
          ],

          rows: [
            { code: "BW", name: "Baden-Württemberg", cap: "Stuttgart", bundesrat: 6, landkreise: 35, stadtkreise: 9, url: "Baden-Württemberg"},
            { code: "BY", name: "Bayern", cap: "München", bundesrat: 6, landkreise: 71, stadtkreise: 26, url: "Bayern"},
            { code: "BE", name: "Berlin", cap: "Berlin", bundesrat: 4, landkreise: 0, stadtkreise: 0, url: "Berlin"},
            { code: "BB", name: "Brandenburg", cap: "Potsdam", bundesrat: 4, landkreise: 14, stadtkreise: 4, url: "Brandenburg"},
            { code: "HB", name: "Bremen", cap: "Bremen", bundesrat: 3, landkreise: 0, stadtkreise: 0, url: "Freie_Hansestadt_Bremen"},
            { code: "HH", name: "Hamburg", cap: "Hamburg", bundesrat: 3, landkreise: 0, stadtkreise: 0, url: "Hamburg"},
            { code: "HE", name: "Hessen", cap: "Wiesbaden", bundesrat: 5, landkreise: 21, stadtkreise: 5, url: "Hessen"},
            { code: "MV", name: "Mecklenburg-Vorpommern", cap: "Schwerin", bundesrat: 3, landkreise: 12, stadtkreise: 5, url: "Mecklenburg-Vorpommern"},
            { code: "NI", name: "Niedersachsen", cap: "Hannover", bundesrat: 6, landkreise: 38, stadtkreise: 8, url: "Niedersachsen"},
            { code: "NW", name: "Nordrhein-Westfalen", cap: "Düsseldorf", bundesrat: 6, landkreise: 32, stadtkreise: 23, url: "Nordrhein-Westfalen"},
            { code: "RP", name: "Rheinland-Pfalz", cap: "Mainz", bundesrat: 4, landkreise: 24, stadtkreise: 12, url: "Rheinland-Pfalz"},
            { code: "SL", name: "Saarland", cap: "Saarbrücken", bundesrat: 3, landkreise: 6, stadtkreise: 0, url: "Saarland"},
            { code: "SN", name: "Sachsen", cap: "Dresden", bundesrat: 4, landkreise: 10, stadtkreise: 3, url: "Sachsen"},
            { code: "ST", name: "Sachsen-Anhalt", cap: "Magdeburg", bundesrat: 4, landkreise: 11, stadtkreise: 3, url: "Sachsen-Anhalt"},
            { code: "SH", name: "Schleswig-Holstein", cap: "Kiel", bundesrat: 4, landkreise: 11, stadtkreise: 4, url: "Schleswig-Holstein"},
            { code: "TH", name: "Thüringen", cap: "Erfurt", bundesrat: 4, landkreise: 17, stadtkreise: 6, url: "Thüringen"}
          ]
        },

        // Dutch provinces
        nl : {
          cols: [
            { field: "flag", label: this.$t('countryregions.flag'), sortable: false, width: "7%",
              image: {
                src: (r) => {
                  const fileName = this.country + "-" + r.code.toLowerCase() + '.png';
                  return require(`@/assets/regions/${fileName}`);
                },
                width: "30",
                height: "20"
              }
            },
            { field: "code", label: this.$t('countryregions.code'), sortable: true, width: "7%",
              parseCol: (s) => { return s.match(/([A-Za-z]{2}[\s]*)/g); },
            },
            { field: "name", label: this.$t('countryregions.name'), sortable: true, width: "30%",
              link: {
                href: (r) => { return "https://nl.wikipedia.org/wiki/" + r.url; }
              }
            },
            { field: "cap", label: this.$t('countryregions.cap'), sortable: true, width: "30%" },
            { field: "mun", label: this.$t('countryregions.mun'),
              sortable: { numsort: true },
              width: "7%"
            },
            { field: "area", label: this.$t('countryregions.area'),
              sortable: { numsort: true },
              width: "7%"
            }
          ],

          rows: [
            { code: "DR", name: "Drenthe", mun: "12", flag: "Flag", area: "9", cap: "Assen", url: "Drenthe" },
            { code: "FL", name: "Flevoland", mun: "6", flag: "Flag", area: "10", cap: "Lelystad", url: "Flevoland" },
            { code: "FR", name: "Friesland", mun: "18", flag: "Flag", area: "1", cap: "Leeuwarden", url: "Friesland" },
            { code: "GE", name: "Gelderland", mun: "51", flag: "Flag", area: "2", cap: "Arnhem", url: "Gelderland" },
            { code: "GR", name: "Groningen", mun: "10", flag: "Flag", area: "7", cap: "Groningen", url: "Groningen_(provincie)" },
            { code: "LI", name: "Limburg", mun: "31", flag: "Flag", area: "11", cap: "Maastricht", url: "Limburg_(Nederlandse_provincie)" },
            { code: "NB", name: "Noord-Brabant", mun: "61", flag: "Flag", area: "3", cap: "'s-Hertogenbosch", url: "Noord-Brabant" },
            { code: "NH", name: "Noord-Holland", mun: "47", flag: "Flag", area: "4", cap: "Haarlem", url: "Noord-Holland" },
            { code: "OV", name: "Overijssel", mun: "25", flag: "Flag", area: "5", cap: "Zwolle", url: "Overijssel" },
            { code: "UT", name: "Utrecht", mun: "26", flag: "Flag", area: "12", cap: "Utrecht", url: "Utrecht_(provincie)" },
            { code: "ZE", name: "Zeeland", mun: "13", flag: "Flag", area: "8", cap: "Middelburg", url: "Zeeland_(provincie)" },
            { code: "ZH", name: "Zuid-Holland", mun: "52", flag: "Flag", area: "6", cap: "Den Haag", url: "Zuid-Holland" }
          ]
        },

        // French region (https://fr.wikipedia.org/wiki/R%C3%A9gion_fran%C3%A7aise)
        fr : {
          cols: [
            { field: "flag", label: this.$t('countryregions.flag'), sortable: false, width: "7%",
              image: {
                src: (r) => {
                  const fileName = this.country + "-" + r.code.toLowerCase() + '.png';
                  return require(`@/assets/regions/${fileName}`);
                },
                width: "30",

                height: "20"
              }
            },
            { field: "cat", label: this.$t('countryregions.cat'), sortable: true, width: "15%" },
            { field: "code", label: this.$t('countryregions.code'), sortable: true, width: "5%",
              parseCol: (s) => { return s.match(/([A-Za-z]{3}[\s]*)/g); },
            },
            { field: "name", label: this.$t('countryregions.name'), sortable: true, width: "30%",
              link: {
                href: (r) => { return "https://fr.wikipedia.org/wiki/" + r.url; }
              }
            },
            { field: "cap", label: this.$t('countryregions.cap'), sortable: true, width: "25%" },
            { field: "dep", label: this.$t('countryregions.dep'),
              sortable: { numsort: true },
              width: "5%"
            },
            { field: "arr", label: this.$t('countryregions.arr'),
              sortable: { numsort: true },
              width: "5%"
            },
            { field: "canton", label: this.$t('countryregions.canton'),
              sortable: { numsort: true },
              width: "5%"
            },
            { field: "commune", label: this.$t('countryregions.mun'),
              sortable: { numsort: true },
              width: "5%"
            },
            { field: "area", label: this.$t('countryregions.area'),
              sortable: { numsort: true },
              width: "5%"
            }
          ],

          rows: [
            { code: "ARA", cat: "Région", name: "Auvergne-Rhône-Alpes", cap: "Lyon", dep: 12, arr: 39, canton: 242, commune: 4030, area: 4, url: "Auvergne-Rhône-Alpes"},
            { code: "BFC", cat: "Région", name: "Bourgogne-Franche-Comté", cap: "Dijon", dep: 8, arr: 24, canton: 152, commune: 3702, area: 6, url: "Bourgogne-Franche-Comté"},
            { code: "BRE", cat: "Région", name: "Bretagne", cap: "Rennes", dep: 4, arr: 15, canton: 102, commune: 1208, area: 12, url: "Région_Bretagne"},
            { code: "CVL", cat: "Région", name: "Centre-Val de Loire", cap: "Orléans", dep: 6, arr: 20, canton: 102, commune: 1757, area: 7, url: "Centre-Val de Loire"},
            { code: "COR", cat: "Collectivité territoriale unique", name: "Corse", cap: "Ajaccio", dep: 2, arr: 5, canton: 26, commune: 360, area: 14, url: "Corse"},
            { code: "GES", cat: "Région", name: "Grand Est", cap: "Strasbourg", dep: 10, arr: 38, canton: 200, commune: 5121, area: 5, url: "Grand_Est"},
            { code: "HDF", cat: "Région", name: "Hauts-de-France", cap: "Lille", dep: 5, arr: 26, canton: 145, commune: 3789, area: 9, url: "Hauts-de-France"},
            { code: "IDF", cat: "Région", name: "Île-de-France", cap: "Paris", dep: 8, arr: 25, canton: 155, commune: 1268, area: 13, url: "Île-de-France"},
            { code: "NOR", cat: "Région", name: "Normandie", cap: "Rouen", dep: 5, arr: 17, canton: 131, commune: 2652, area: 11, url: "Normandie_(région_administrative)"},
            { code: "NAQ", cat: "Région", name: "Nouvelle-Aquitaine", cap: "Bordeaux", dep: 12, arr: 41, canton: 258, commune: 4313, area: 1, url: "Nouvelle-Aquitaine"},
            { code: "OCC", cat: "Région", name: "Occitanie", cap: "Toulouse", dep: 13, arr: 36, canton: 249, commune: 4454, area: 3, url: "Occitanie_(région_administrative)"},
            { code: "PDL", cat: "Région", name: "Pays de la Loire", cap: "Nantes", dep: 5, arr: 16, canton: 107, commune: 1237, area: 8, url: "Pays_de_la_Loire"},
            { code: "PAC", cat: "Région", name: "Provence-Alpes-Côte d'Azur", cap: "Marseille", dep: 6, arr: 18, canton: 126, commune: 946, area: 10, url: "Provence-Alpes-Côte d'Azur"},
            { code: "GUA",  cat: "Région", name: "Guadeloupe", cap: "Basse-Terre", dep: 1, arr: 2, canton: 21, commune: 31, area: 16, url: "Guadeloupe"},
            { code: "GUF",  cat: "Région", name: "Guyane", cap: "Cayenne", dep: 1, arr: 2, canton: 0, commune: 22, area: 2, url: "Guyane"},
            { code: "MTQ",  cat: "Région", name: "Martinique", cap: "Basse-Terre", dep: 1, arr: 2, canton: 0, commune: 31, area: 17, url: "Martinique"},
            { code: "MAY",  cat: "Région", name: "Mayotte", cap: "Mamoudzou", dep: 1, arr: 0, canton: 13, commune: 17, area: 18, url: "Mayotte"},
            { code: "LRE",  cat: "Région", name: "La Réunion", cap: "Saint-Denis", dep: 1, arr: 4, canton: 25, commune: 24, area: 15, url: "La_Réunion"}
          ]
        }
      },

      // Col and row definitions for the table (link to selected country)
      cols: [],
      rows: []

    }
  },

  mounted: function() {
    // Set initial regions
    this.updateTable();
  },

  methods: {

    updateTable: function () {
      this.cols = this.countrydefs[this.country].cols;
      this.rows = this.countrydefs[this.country].rows;
    }
  },

}
</script>
