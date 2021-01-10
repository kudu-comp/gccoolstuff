<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
        <div class="text-center">  {{this.$t('menu.nlprovinces')}}</div>
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('nlprovinces.info')"></div>
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

      // placeholder for the search box
      phsearch: this.$t('nlprovinces.ph'),
      defsearch: 1,

      // USA States column definition
      cols: [
        { field: "flag", label: this.$t('nlprovinces.flag'), sortable: false, width: "7%",
          image: {
            src: function (row) {
              const fileName = row.code.toLowerCase() + '.png';
              return require(`@/assets/nlprov/${fileName}`);
            },
            width: "30",
            height: "20"
          }
        },
        { field: "code", label: this.$t('nlprovinces.code'), sortable: true, width: "7%",
          parseCol: function(s) {
            // State codes are 2 character, whitespace is optional
            return s.match(/([A-Za-z]{2}[\s]*)/g);
          },
        },
        { field: "name", label: this.$t('nlprovinces.name'), sortable: true, width: "30%",
          link: {
            href: (r) => {
              switch (r.name) {
                case "Groningen" :
                  return "https://nl.wikipedia.org/wiki/" + "Groningen_(provincie))"
                case "Utrecht" :
                  return "https://nl.wikipedia.org/wiki/" + "Utrecht_(provincie)"
                case "Zeeland":
                  return "https://nl.wikipedia.org/wiki/" + "Zeeland_(provincie)"
                case "Limburg":
                  return "https://nl.wikipedia.org/wiki/" + "Limburg_(Nederlandse_provincie)"
                default :
                  return "https://nl.wikipedia.org/wiki/" + r.name;
              }
            }
          }
        },
        { field: "mun", label: this.$t('nlprovinces.mun'),
          sortable: {
            numsort: true
          },
          width: "7%"
        },
        { field: "area", label: this.$t('nlprovinces.area'),
          sortable: {
            numsort: true
          },
          width: "7%"
        },
        { field: "cap", label: this.$t('nlprovinces.cap'), sortable: true, width: "30%" },
      ],

      // NL provinces data
      rows: [
        { code: "DR", name: "Drenthe", mun: "12", flag: "Flag", area: "9", cap: "Assen" },
        { code: "FL", name: "Flevoland", mun: "6", flag: "Flag", area: "10", cap: "Lelystad" },
        { code: "FR", name: "Friesland", mun: "18", flag: "Flag", area: "1", cap: "Leeuwarden" },
        { code: "GE", name: "Gelderland", mun: "51", flag: "Flag", area: "2", cap: "Arnhem" },
        { code: "GR", name: "Groningen", mun: "10", flag: "Flag", area: "7", cap: "Groningen" },
        { code: "LI", name: "Limburg", mun: "31", flag: "Flag", area: "11", cap: "Maastricht" },
        { code: "NB", name: "Noord-Brabant", mun: "61", flag: "Flag", area: "3", cap: "'s-Hertogenbosch" },
        { code: "NH", name: "Noord-Holland", mun: "47", flag: "Flag", area: "4", cap: "Haarlem" },
        { code: "OV", name: "Overijssel", mun: "25", flag: "Flag", area: "5", cap: "Zwolle" },
        { code: "UT", name: "Utrecht", mun: "26", flag: "Flag", area: "12", cap: "Utrecht" },
        { code: "ZE", name: "Zeeland", mun: "13", flag: "Flag", area: "8", cap: "Middelburg" },
        { code: "ZH", name: "Zuid-Holland", mun: "52", flag: "Flag", area: "6", cap: "Den Haag" }
      ]
    }
  },

  mounted: function() {
    // No actions
  },

  methods: {

  },
}
</script>
