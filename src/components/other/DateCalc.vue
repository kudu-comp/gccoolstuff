<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('datecalc.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('datecalc.long')"
      />
      <div class="row" >
        <label for="date1" class="form-label sm-size mb-2">{{$t('datecalc.date1')}} </label>
        <input type="date" v-model="date1" id="date1" class="form-control md-size mb-2"/>
      </div>
      <div class="row">
        <label for="extradays" class="form-label sm-size mb-2">{{$t('datecalc.days')}}</label>
        <input type="number" min="0" v-model="extradays" id="extradays" class="form-control md-size mb-2"/>
      </div>
      <div class="row" >
        <label for="date2" class="form-label sm-size mb-2">{{$t('datecalc.date2')}} </label>
        <input type="date" v-model="date2" id="date2" class="form-control md-size mb-2"/>
      </div>
      <v-calculate class="mb-2" id="calc" @calculate="calculateDates"></v-calculate>
      <div v-if="result" class="resultbox" >
        {{ result }} <br />
        {{ result2 }} <br />
        {{ result3 }} <br />
        {{ result4 }} <br />
        {{ result7 }} <br />
        {{ result5 }} <br />
        {{ result6 }}
      </div>
    </div>
  </div>
</template>

<script>

import VCalculate from '@/components/inputs/VCalculate.vue';

export default {

  name: "DateCalc",

  components: {
    VCalculate    
  },

  data() {
    return {
      date1: "",
      date2: "",
      extradays: 0,
      result: "",
      result2: "",
      result3: "",
      result4: "",
      result7: "",
      result5: "",
      result6: "",
    };
  },

  methods: {

    calculateDates: function () {

      let d1 = new Date(this.date1);
      let d2 = new Date(this.date2);
      let year = d1.getFullYear();

      // Differences between two dates
      this.result = this.$t('datecalc.res1a');
      let days = Math.round((d2 - d1) / (1000 * 3600 * 24));
      this.result += days + this.$t('datecalc.res1b');

      // Adding days to date 1
      this.result2 = this.$t('datecalc.res2a') + this.extradays + this.$t('datecalc.res2b') + d1.toLocaleDateString() + ": ";
      let d3 = new Date(d1.getTime() + this.extradays * (1000 * 3600 * 24));
      this.result2 += d3.toLocaleDateString();

      // Subtracting days from date 1
      this.result3 = this.$t('datecalc.res3a') + this.extradays + this.$t('datecalc.res3b') + d1.toLocaleDateString() + ": ";
      let d4 = new Date(d1.getTime() - this.extradays * (1000 * 3600 * 24));
      this.result3 += d4.toLocaleDateString();;

      // Day in year
      let dayOfYear = Math.floor(
        (d1 - new Date(d1.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
      );
      this.result7 = this.$t('datecalc.res7') + year.toString() + " is " + dayOfYear;

      // Day of the week
      let x;
      if (this.$i18n.locale === "nl") {
        x = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
      } else {
        x = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saterday"];
      }
      this.result4 = this.$t('datecalc.res4') + x[d1.getDay()];

      // Number of days in year
      let leap = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
      this.result5 = this.$t('datecalc.res5') + year.toString() + " is " + (leap ? "366" : "365");

      // Number of days in month and year of date1 day in the year
      this.result6 = this.$t('datecalc.res6') + year.toString() + "-" + (d1.getMonth()+1).toString() + " is " + new Date(year, d1.getMonth() + 1, 0).getDate();

    },

  },
};

</script>

<style scoped>
</style>
