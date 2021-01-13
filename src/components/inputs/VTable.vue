<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="form-row mb-2">
        <textarea id="message" name="message" class="form-control" ref="message" :placeholder="phsearch" rows=2 v-model='searchInput'></textarea>
      </div>
      <div class="flex-row align-left">
        <input type="button" id="searchweb" name="searchweb" :value="$t('buttons.search')" class="btn btn-primary mb-2 mr-2" v-on:click="search(sel)">
        <select class="custom-select mb-2 mr-2" style="width: 150px;" v-model='searchIndex'>
          <option v-for="(col, index) in cols" :key="index" :value="index" :disabled="col.image || col.nosearch">{{col.label}}</option>
        </select>
        <input type="button" id="reset" name="reset" :value="$t('buttons.reset')" class="btn btn-primary mb-2 mr-2" v-on:click="initSortArr">
        <input type="button" id="showhide" name="showhide" :value="$t('buttons.showtab')" class="btn btn-primary mb-2 mr-2" v-on:click="showtable = !showtable">
        <input type="button" id="showhide" name="showhide" :value="$t('buttons.showres')" class="btn btn-primary mb-2" v-on:click="showresults = !showresults">
      </div>
      <p v-show="error" class="errormsg">{{errormsg}}</p>
      <div class="card card-text p-2" v-show="showresults" v-html="result"></div>
      <table v-show="showtable" class="table table-sm table-responsive v-table">
        <thead class="v-table-header">
          <tr>
            <th v-for="(col, index) in cols" :key="index" :style="{ width: col.width ? col.width : 'auto' }">
              <div :class="{
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
          <tr v-for="(row, index) in sortArr" :key="index">
            <td v-for="(col, ci) in cols" :key="ci">
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

export default {
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
    //   // Cannot use this.rows here so passed as parameter
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
    // src: function (row) {
    //   const fileName = row.code.toLowerCase() + '.png';
    //   return require(`@/assets/usflags/${fileName}`);
    // },

    // Exampole href function for columns with link
    // href: function (row) {
    //   return "https:\\\\wikipedia.com\\" + row.code;
    // },

    // Example for computed columns
    // computed: function (row) {
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

    rows: {
      type: Array,
      default: () => {
        return [];
      }
    }

  },

  data() {
    return {

      // Showtable and results at start
      showtable: true,
      showresults: true,

      // Error handling
      error: false,
      errormsg: "",

      // Sortable
      sortable: {
        order: "",
        sort: ""
      },

      // Sorted array of indexes, needed because we cannot sort a prop
      sortArr: [],

      // Search input
      searchIndex: 0,
      searchInput: "",

      // Result box
      result: this.$t('labels.result')

    };
  },

  created: function () {
    this.initSortArr();
  },

  mounted: function () {
    this.searchIndex = this.defsearch;
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
            this.result += c.computed(this.rows[r]) + " ";
          } else {
            // for non computed columns print field
            this.result += this.rows[r][c.field] + " ";
          }
        }
        this.result += "<br>";
      }
    },

    initSortArr: function () {
      this.error = false;
      for (let i = 0; i < this.rows.length; i++) this.sortArr[i] = i;
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
      this.error = false;
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
          this.error = true;
          this.errormsg = this.$t('errors.noresult');
        } else {
          if (this.showresults) this.printResults();
        }

      } else {

        // Nothing to search for
        this.error = true;
        this.errormsg = this.$t('errors.invalidinput');
      }

    }

  },

}
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

.v-table {

}

.v-table-header {
  background-color: #2E1E03;
  color: #C1B7A6;
}

.v-table-body {

}

</style>
