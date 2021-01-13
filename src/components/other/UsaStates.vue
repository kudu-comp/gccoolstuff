<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
        <div class="text-center">  {{this.$t('othertools.usastates.title')}}</div>
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('usastates.info')"></div>
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
      phsearch: this.$t('usastates.ph'),
      defsearch: 1,

      // USA States column definition
      cols: [
        { field: "flag", label: this.$t('usastates.flag'), sortable: false, width: "7%",
          image: {
            src: function (row) {
              const fileName = row.code.toLowerCase() + '.png';
              return require(`@/assets/usflags/${fileName}`);
            },
            width: "30",
            height: "20"
          }
        },
        { field: "code", label: this.$t('usastates.code'), sortable: true, width: "7%",
          parseCol: function(s) {
            // State codes are 2 character, whitespace is optional
            return s.match(/([A-Za-z]{2}[\s]*)/g);
          },
        },
        { field: "name", label: this.$t('usastates.name'), sortable: true, width: "30%",
          link: {
            href: (r) => {
              switch (r.name) {
                case "Georgia" :
                  return "https://en.wikipedia.org/wiki/" + "Georgia_(U.S._state)"
                case "New York" :
                  return "https://en.wikipedia.org/wiki/" + "New_York_(state)"
                case "Washington":
                  return "https://en.wikipedia.org/wiki/" + "Washington_(state)"
                default :
                  return "https://en.wikipedia.org/wiki/" + r.name;
              }
            }
          }
        },
        { field: "num", label: this.$t('usastates.num'),
          sortable: {
            numsort: true
          },
          width: "7%"
        },
        { field: "reps", label: this.$t('usastates.reps'),
          sortable: {
            numsort: true
          },
          width: "7%"
        },
        { field: "area", label: this.$t('usastates.area'),
          sortable: {
            numsort: true
          },
          width: "7%"
        },
        { field: "cap", label: this.$t('usastates.cap'), sortable: true, width: "30%" },
      ],

      // USA States data
      rows: [
        { code: "AL", name: "Alabama", reps: "7", num: "22", flag: "Flag", area: "30", cap: "Montgomery" },
        { code: "AK", name: "Alaska", reps: "1", num: "49", flag: "Flag", area: "1", cap: "Juneau" },
        { code: "AZ", name: "Arizona", reps: "9", num: "48", flag: "Flag", area: "6", cap: "Phoenix" },
        { code: "AR", name: "Arkansas", reps: "4", num: "25", flag: "Flag", area: "29", cap: "Little Rock" },
        { code: "CA", name: "California", reps: "53", num: "31", flag: "Flag", area: "3", cap: "Sacramento" },
        { code: "CO", name: "Colorado", reps: "7", num: "38", flag: "Flag", area: "8", cap: "Denver" },
        { code: "CT", name: "Connecticut", reps: "5", num: "5", flag: "Flag", area: "48", cap: "Hartford" },
        { code: "DE", name: "Delaware", reps: "1", num: "1", flag: "Flag", area: "49", cap: "Dover" },
        { code: "FL", name: "Florida", reps: "27", num: "27", flag: "Flag", area: "22", cap: "Tallahassee" },
        { code: "GA", name: "Georgia", reps: "14", num: "4", flag: "Flag", area: "24", cap: "Atlanta" },
        { code: "HI", name: "Hawaii", reps: "2", num: "50", flag: "Flag", area: "43", cap: "Honolulu" },
        { code: "ID", name: "Idaho", reps: "2", num: "43", flag: "Flag", area: "14", cap: "Boise" },
        { code: "IL", name: "Illinois", reps: "18", num: "21", flag: "Flag", area: "25", cap: "Springfield" },
        { code: "IN", name: "Indiana", reps: "9", num: "19", flag: "Flag", area: "38", cap: "Indianapolis" },
        { code: "IA", name: "Iowa", reps: "4", num: "29", flag: "Flag", area: "26", cap: "Des Moines" },
        { code: "KS", name: "Kansas", reps: "4", num: "34", flag: "Flag", area: "15", cap: "Topeka" },
        { code: "KY", name: "Kentucky", reps: "6", num: "15", flag: "Flag", area: "37", cap: "Frankfort" },
        { code: "LA", name: "Louisiana", reps: "6", num: "18", flag: "Flag", area: "31", cap: "Baton Rouge" },
        { code: "ME", name: "Maine", reps: "2", num: "23", flag: "Flag", area: "39", cap: "Augusta" },
        { code: "MD", name: "Maryland", reps: "8", num: "7", flag: "Flag", area: "42", cap: "Annapolis" },
        { code: "MA", name: "Massachusetts", reps: "9", num: "6", flag: "Flag", area: "44", cap: "Boston" },
        { code: "MI", name: "Michigan", reps: "14", num: "26", flag: "Flag", area: "11", cap: "Lansing" },
        { code: "MN", name: "Minnesota", reps: "8", num: "32", flag: "Flag", area: "12", cap: "Saint Paul" },
        { code: "MS", name: "Mississippi", reps: "4", num: "20", flag: "Flag", area: "32", cap: "Jackson" },
        { code: "MO", name: "Missouri", reps: "8", num: "24", flag: "Flag", area: "21", cap: "Jefferson City" },
        { code: "MT", name: "Montana", reps: "1", num: "41", flag: "Flag", area: "4", cap: "Helena" },
        { code: "NE", name: "Nebraska", reps: "3", num: "37", flag: "Flag", area: "16", cap: "Lincoln" },
        { code: "NV", name: "Nevada", reps: "4", num: "36", flag: "Flag", area: "7", cap: "Carson City" },
        { code: "NH", name: "New Hampshire", reps: "2", num: "9", flag: "Flag", area: "46", cap: "Concord" },
        { code: "NJ", name: "New Jersey", reps: "12", num: "3", flag: "Flag", area: "47", cap: "Trenton" },
        { code: "NM", name: "New Mexico", reps: "3", num: "47", flag: "Flag", area: "5", cap: "Santa Fe" },
        { code: "NY", name: "New York", reps: "27", num: "11", flag: "Flag", area: "27", cap: "Albany" },
        { code: "NC", name: "North Carolina", reps: "13", num: "12", flag: "Flag", area: "28", cap: "Raleigh" },
        { code: "ND", name: "North Dakota", reps: "1", num: "39", flag: "Flag", area: "19", cap: "Bismarck" },
        { code: "OH", name: "Ohio", reps: "16", num: "17", flag: "Flag", area: "34", cap: "Columbus" },
        { code: "OK", name: "Oklahoma", reps: "5", num: "46", flag: "Flag", area: "20", cap: "Oklahoma City" },
        { code: "OR", name: "Oregon", reps: "5", num: "33", flag: "Flag", area: "9", cap: "Salem" },
        { code: "PA", name: "Pennsylvania", reps: "18", num: "2", flag: "Flag", area: "33", cap: "Harrisburg" },
        { code: "RI", name: "Rhode Island", reps: "2", num: "13", flag: "Flag", area: "50", cap: "Providence" },
        { code: "SC", name: "South Carolina", reps: "7", num: "8", flag: "Flag", area: "40", cap: "Columbia" },
        { code: "SD", name: "South Dakota", reps: "1", num: "40", flag: "Flag", area: "17", cap: "Pierre" },
        { code: "TN", name: "Tennessee", reps: "9", num: "16", flag: "Flag", area: "36", cap: "Nashville" },
        { code: "TX", name: "Texas", reps: "36", num: "28", flag: "Flag", area: "2", cap: "Austin" },
        { code: "UT", name: "Utah", reps: "4", num: "45", flag: "Flag", area: "13", cap: "Salt Lake City" },
        { code: "VT", name: "Vermont", reps: "1", num: "14", flag: "Flag", area: "45", cap: "Montpelier" },
        { code: "VA", name: "Virginia", reps: "11", num: "10", flag: "Flag", area: "35", cap: "Richmond" },
        { code: "WA", name: "Washington ", reps: "10", num: "42", flag: "Flag", area: "18", cap: "Olympia" },
        { code: "WV", name: "West Virginia ", reps: "3", num: "35", flag: "Flag", area: "41", cap: "Charleston" },
        { code: "WI", name: "Wisconsin ", reps: "8", num: "30", flag: "Flag", area: "23", cap: "Madison" },
        { code: "WY", name: "Wyoming ", reps: "1", num: "44", flag: "Flag", area: "10", cap: "Cheyenne" }
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
