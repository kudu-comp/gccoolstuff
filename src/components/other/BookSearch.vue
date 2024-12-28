<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('booksearch.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('booksearch.long')"
      />
      <!-- Form fields -->
      <div class="row">
        <v-search
          id="searchstr"
          ref="searchstr"
          v-model:search="txt"
          @keyup.enter="goSearch"
        />
      </div>
      <div>
        <span
          class="form-label mb-2"
        >{{ $t('booksearch.sel') }}</span>
        <div class="form-check">
          <input
            id="number1"
            v-model="sel"
            type="radio"
            name="number"
            value="1"
            class="form-check-input mb-2"
          >
          <label
            class="form-check-label mb-2"
            for="number1"
          >{{ $t('booksearch.short') }}</label>
        </div>
        <div class="form-check">
          <input
            id="number2"
            v-model="sel"
            type="radio"
            name="number"
            value="2"
            class="form-check-input mb-2"
          >
          <label
            class="form-check-label mb-2"
            for="number2"
          >{{ $t('booksearch.extra') }}</label>
        </div>
      </div>
      <button id="btnsearch" class="btn mb-2 md-size" @click="goSearch" >
        <i class="fa-solid fa-search"></i> {{ $t('buttons.search') }}          
      </button>
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <div v-if="result" class="resultbox" v-html="result"></div>
    </div>
  </div>
</template>

<script>

import VSearch from '@/components/inputs/VSearch.vue'
export default {

  name: "ComponentName",

  components: {
    VSearch
  },

  data() {
    return {
      txt: "",
      sel: "1",
      url: "https://openlibrary.org/search.json?q=",
      result: "",
      errormsg: ""
    };
  },

  methods: {

    goSearch: function () {
      // Reset
      this.result = "";
      this.errormsg = "";

      // Catch stupid searches
      if (this.txt.trim().length < 5) {
        this.errormsg = "Search needs to be at least 5 characters.";
        return;
      }

      //
      fetch(this.url + this.txt)
        .then((response) => response.json())
        .then((data) => {
          this.result = "<b>" + this.$t('booksearch.bkfnd') + data.numFound + "</b><BR>";
          for (let i = 0; i < data.numFound; i++) {
            if (data.docs[i].title) {
              this.result += "<BR>" + this.$t('booksearch.titles') + data.docs[i].title + "<BR>";
            }
            if (data.docs[i].author_name) {
              for (let j = 0; j < data.docs[i].author_name.length; j++)
                this.result += this.$t('booksearch.author') + data.docs[i].author_name[j] + "<BR>";
            }
            if (data.docs[i].isbn) {
              for (let j = 0; j < data.docs[i].isbn.length; j++){
                this.result += this.$t('booksearch.isbn') + data.docs[i].isbn[j] + "<BR>";
                if (this.sel === "1") break;                
              }
            }
            if (this.sel === "1") continue;
            if (data.docs[i].first_publish_year) {
              this.result += this.$t('booksearch.firstpub') + data.docs[i].first_publish_year + "<BR>";
            }
            if (data.docs[i].language) {
              for (let j = 0; j < data.docs[i].language.length; j++)
                this.result += this.$t('booksearch.lang') + data.docs[i].language[j] + "<BR>";
            }
            if (data.docs[i].publisher) {
              for (let j = 0; j < data.docs[i].publisher.length; j++)
                this.result += this.$t('booksearch.pub') + data.docs[i].publisher[j] + "<BR>";
            }
            if (data.docs[i].edition_count) {
              this.result += this.$t('booksearch.edcnt') + data.docs[i].edition_count + "<BR>";
            }
          }
        })
        .catch((error) => {
          console.error("Error ", error);
          this.errormsg = this.$t('errors.generic');
        });
    },

  },
};

</script>

<style scoped>
</style>
