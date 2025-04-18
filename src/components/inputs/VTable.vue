<template>
  <div class="row">
    <div class="col-sm-12">
      <textarea
        id="message"
        ref="message"
        v-model="searchInput"
        class="form-control mb-2"
        :placeholder="phsearch"
        rows="2"
      />
      <div class="row px-3">
        <input
          id="searchweb"
          type="button"
          :value="$t('buttons.search')"
          class="btn mb-2 me-2 sm-size"
          @click="search(sel)"
        >
        <select
          id="searchindex"
          v-model="searchIndex"
          class="form-select me-2 mb-2 lg-size"
          style="width: 150px;"
        >
          <option
            v-for="(col, index) in cols"
            :key="index"
            :value="index"
            :disabled="col.image || col.nosearch"
          >
            {{ col.label }}
          </option>
        </select>
        <input
          id="reset"
          type="button"
          :value="$t('buttons.reset')"
          class="btn mb-2 me-2 sm-size"
          @click="reset"
        >
        <input
          id="showtab"
          type="button"
          :value="$t('buttons.showtab')"
          class="btn mb-2 me-2 md-size"
          @click="showtable = !showtable"
        >
        <input
          id="showres"
          type="button"
          :value="$t('buttons.showres')"
          class="btn mb-2 md-size"
          @click="showresults = !showresults"
        >
      </div>
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <div
        v-show="showresults"
        class="resultbox"
        v-html="result"
      />
      <table
        v-show="showtable"
        class="table table-sm table-responsive v-table"
      >
        <thead class="v-table-header">
          <tr>
            <th
              v-for="(col, index) in cols"
              :key="index"
              :style="{ width: col.width ? col.width : 'auto' }"
            >
              <div
                :class="{
                  sortable: col.sortable,
                  both: col.sortable,
                  asc: sortable.order == col.field && sortable.sort == 'asc',
                  desc: sortable.order == col.field && sortable.sort == 'desc',
                }"
                @click="col.sortable ? doSort(index) : false"
              >
                {{ col.label }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="v-table-body">
          <tr
            v-for="(row, index) in sortArr"
            :key="index"
          >
            <td
              v-for="(col, ci) in cols"
              :key="ci"
            >
              <div
                v-if="col.computed"
                v-html="col.computed(rows[row])"
              />
              <div v-else-if="col.image">
                <img
                  :src="col.image.src(rows[row])"
                  :height="col.image.height ? col.image.height : auto"
                  :width="col.image.width ? col.image.width : auto"
                  :alt="rows[row][col.field] ? rows[row][col.field] : col.label"
                >
              </div>
              <div v-else-if="col.link">
                <a :href="col.link.href(rows[row])">{{ rows[row][col.field] }}</a>
              </div>
              <span v-else>{{ rows[row][col.field] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import { defineComponent, ref, toRefs, watch } from 'vue'

export default defineComponent ({

  name: "VTable",

  props: {

    // placeholder search box
    phsearch: {
      type: String,
      default: () => {
        return "Type searches";
      }
    },

    // default search fields
    defsearch: {
      type: Number,
      default: () => {
        return 0;
      }
    },

    fieldsep: {
      type: String,
      default: () => {
        return " ";
      }
    },

    // Cols is an array of objects which looks like
    //  field         R   the name that matches with rows
    //  label         O   label used in printing column names (optional for images)
    //  width         O   x%, default auto
    //  computed      O   computed column, function(row) { do something using row }
    //  image         O   column is an image (object)
    //    width       O   width of image in pixels
    //    heigth      O   heigth of image in pixels
    //    src         R   function returning the url (needs to be a function because of webkit loading)
    //                    link: column contains a link, linked value is the column value (doens't work on images)
    //  link          O   column can be clicked (doesn't work on images and computed columns)
    //    href        R   function returning link
    //  sortable      R   true or false
    //    numsort     O   change default sorting to numeric
    //    srtCol      O   sorting function - naming it sortCol caused an ESLint prop mutation error
    //                    default sort is Case insensitive string compare
    //  nosearch      O   optionally disable search, search on images never possible
    //    parseCol    O   function to parse the search input
    //    matchCol    O   function to match the values during search

    // Example parseCol function
    // parseCol: function(s) {
    //   // State codes are 2 character, whitespace is optional
    //   return s.match(/([A-Za-z]{2}[\s]*)/g);
    // },

    // Example matchCol function
    // matchCol: (c)  => {
    //   // Use arrow notation to make this accessible
    //   // Case sensitive match on names
    //   return this.rows.findIndex( (e) => e.name == c.trim() )
    // },

    // Example srtCol function
    // srtCol: function(a, b) {
    //   if (a[2] > b[2])
    //     return 1
    //   else if (a[2] < b[2])
    //     return -1
    //   else {
    //     return 0
    //   }
    // }

    // Example src function for images columns
    // src: (row) => {
    //   const fileName = row.code.toLowerCase() + '.png';
    //   return require(`@/assets/usflags/${fileName}`);
    // },

    // Exampole href function for columns with link
    // href: (row) => {
    //   return "https:\\\\wikipedia.com\\" + row.code;
    // },

    // Example for computed columns
    // computed: (row) => {
    //   return row.name.toUpperCase();
    // }

    cols: {
      type: Array,
      default: () => {
        return [];
      }
    },

    // Rows is an array of objects
    // each object has the row fields, were the column names match those in cols.fields
    // cols that have a computed or image function are not included in rows
    // fields that don't have a column are not displayed (but may be used in functions)

    rows: {
      type: Array,
      default: () => {
        return [];
      }
    },

  },

  setup (props) {

    // Ref creates on object with one property 'value'
    const sortArr = ref([]);
    let searchIndex = 0;
    
    // Create a reactive reference to 'rows' property of props
    const { rows } = toRefs(props);

    const initSortArr = function () {
      sortArr.value = [];
      for (let i = 0; i < rows.value.length; i++) sortArr.value[i] = i;
      searchIndex = props.defsearch;
    }

    // Upon creation init sorted arr
    initSortArr();

    // If rows change init sorted arr
    watch (rows, initSortArr);

    return {
      sortArr,
      initSortArr,
      searchIndex
    }
  },

  data() {
    return {

      // Showtable and results at start
      showtable: true,
      showresults: true,

      // Error handling
      errormsg: "",

      // Sortable
      sortable: {
        order: "",
        sort: ""
      },

      // Search input
      searchInput: "",

      // Result box
      result: this.$t('labels.result')

    };
  },
  
  mounted: function() {
    this.$refs.message.focus();
  },
  
  methods: {

    printResults: function () {
      this.result = "";
      for (let c of this.cols) {
        if (c.image) continue;
        this.result += "<b>" + c.label + ":</b> ";
        for (let r of this.sortArr) {
          if (c.computed) {
            // for computed columns call function computed
            this.result += c.computed(this.rows[r]) + this.fieldsep;
          } else {
            // for non computed columns print field
            this.result += this.rows[r][c.field] + this.fieldsep;
          }
        }
        this.result += "<br>";
      }
    },

    reset: function () {
      this.initSortArr();
      this.errormsg = "" 
      this.result = this.$t('labels.result');
      this.searchInput = "";
      this.searchIndex = this.defsearch;
    },

    doSort: function(idx) {

      // Get column field name
      let field = this.cols[idx].field

      // Sort table on column, first set classes to update icons
      this.sortable.order = field;
      this.sortable.sort  = (this.sortable.sort == 'asc') ? "desc" : "asc";

      // Cannot sort rows as it is a prop so use local index table
      // It also only sorts the displayed rows
      if (this.cols[idx].sortable.srtCol) {

        // Custom compare functions, asc and desc handled here
        // Should we pass rows instead of fields because of computed columns?
        this.sortArr.sort ( (a,b) =>  {
          let srt = this.cols[idx].sortable.srtCol(this.rows[a][field], this.rows[b][field]);
          return (this.sortable.sort == "desc") ? srt * -1 : srt;
        });

      } else if (this.cols[idx].sortable.numsort) {

        // Numeric sort
        this.sortArr.sort ( (a,b) => {
          if (this.cols[idx].computed) {
            // Compare computed columns
            if ( parseInt(this.cols[idx].computed(this.rows[a])) > parseInt(this.cols[idx].computed(this.rows[b])) )
              return (this.sortable.sort == 'asc') ? 1 : -1;
            else if ( parseInt(this.cols[idx].computed(this.rows[a])) < parseInt(this.cols[idx].computed(this.rows[b])) )
              return (this.sortable.sort == 'asc') ? -1 : 1;
            else
              return 0
          } else {
            // Compare fields (non computed columns)
            if ( parseInt(this.rows[a][field]) > parseInt(this.rows[b][field]) )
              return (this.sortable.sort == 'asc') ? 1 : -1;
            else if ( parseInt(this.rows[a][field]) < parseInt(this.rows[b][field]) )
              return (this.sortable.sort == 'asc') ? -1 : 1;
            else
              return 0

          }
        });

      } else {

        // Default compare
        this.sortArr.sort ( (a,b) => {
          if (this.cols[idx].computed) {
            // Compare computed columns
            if ( this.cols[idx].computed(this.rows[a]) > this.cols[idx].computed(this.rows[b]) )
              return (this.sortable.sort == 'asc') ? 1 : -1;
            else if ( this.cols[idx].computed(this.rows[a]) < this.cols[idx].computed(this.rows[b]) )
              return (this.sortable.sort == 'asc') ? -1 : 1;
            else
              return 0
          } else {
            // Compare fields (non computed columns)
            if ( this.rows[a][field] > this.rows[b][field] )
              return (this.sortable.sort == 'asc') ? 1 : -1;
            else if ( this.rows[a][field] < this.rows[b][field] )
              return (this.sortable.sort == 'asc') ? -1 : 1;
            else
              return 0

          }
        });

      }

    },

    search: function () {

      // Reset error, init variables
      this.errormsg = "";
      let idx = 0;
      let codes = [];

      // Parse the input into separate search terms
      if ( this.cols[this.searchIndex].parseCol ) {
        // Custom parsing of searchinput
        codes = this.cols[this.searchIndex].parseCol(this.searchInput);
      } else {
        // Default parse input using regex - white space separated
        codes = this.searchInput.match(/([^\s]+)/ug);
      }

      if (codes) {

        // Clear sorted array
        this.sortArr = [];
        // Get name of field to be searched
        let searchField = this.cols[this.searchIndex].field;

        // Search all parsed inputs
        for (let c of codes) {

          if ( this.cols[this.searchIndex].matchCol ) {

            // Custom matching of searchinput
            idx = this.cols[this.searchIndex].matchCol(c);

          } else {

            // Default parse input using regex - white space separated
            // Default match is case insensitive
            if (this.cols[this.searchIndex].computed) {
              // for computed columns compare with computed function
              idx = this.rows.findIndex( (e) => this.cols[this.searchIndex].computed(e).toUpperCase() == c.toUpperCase().trim() )
            } else {
              // compare normal fields
              idx = this.rows.findIndex( (e) => e[searchField].toUpperCase() == c.toUpperCase().trim() )
            }
            
          }

          // If input has been found add it the display array
          if (idx >=0 ) this.sortArr.push(idx);

        }

        // Reset if no results found
        if (this.sortArr.length == 0) {
          this.initSortArr();
          this.errormsg = this.$t('errors.noresult');
        } else {
          if (this.showresults) this.printResults();
        }

      } else {

        // Nothing to search for
        this.errormsg = this.$t('errors.invalidinput');
      }

    }

  },

}); // end of defineComponent

</script>

<style scoped>

.sortable {
  cursor: pointer;
  background-position: right;
  background-repeat: no-repeat;
  padding-right: 30px !important;
}

.both {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAQAAADYWf5HAAAAkElEQVQoz7X QMQ5AQBCF4dWQSJxC5wwax1Cq1e7BAdxD5SL+Tq/QCM1oNiJidwox0355mXnG/DrEtIQ6azioNZQxI0ykPhTQIwhCR+BmBYtlK7kLJYwWCcJA9M4qdrZrd8pPjZWPtOqdRQy320YSV17OatFC4euts6z39GYMKRPCTKY9UnPQ6P+GtMRfGtPnBCiqhAeJPmkqAAAAAElFTkSuQmCC");
}

.asc {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAZ0lEQVQ4y2NgGLKgquEuFxBPAGI2ahhWCsS/gDibUoO0gPgxEP8H4ttArEyuQYxAPBdqEAxPBImTY5gjEL9DM+wTENuQahAvEO9DMwiGdwAxOymGJQLxTyD+jgWDxCMZRsEoGAVoAADeemwtPcZI2wAAAABJRU5ErkJggg==);
}

.desc {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAZUlEQVQ4y2NgGAWjYBSggaqGu5FA/BOIv2PBIPFEUgxjB+IdQPwfC94HxLykus4GiD+hGfQOiB3J8SojEE9EM2wuSJzcsFMG4ttQgx4DsRalkZENxL+AuJQaMcsGxBOAmGvopk8AVz1sLZgg0bsAAAAASUVORK5CYII=);
}

</style>
