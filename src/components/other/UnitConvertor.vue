<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('othertools.unitconvertor.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('othertools.unitconvertor.long')"
      />
      <div class="row">
        <label
          for="cats"
          class="form-label sm-size mb-2"
        >{{ $t('unitconvertor.selcat') }}</label>
        <select
          v-model="cat"
          class="form-select md-size mb-2"
          @change="changeCat"
        >
          <option
            v-for="(c, index) in units"
            :key="index"
            :value="index"
          >
            {{ $t('unitconvertor.cat.' + c.category + '.name') }}
          </option>
        </select>
      </div>
      <div class="infoblock">
        {{ $t('unitconvertor.cat.' + units[cat].category + '.desc') }}
      </div>
      <div class="row">
        <div class="col-6">
          <div class="row">
            <label
              class="form-label mb-2 sm-size"
              for="unitfrom"
            >{{ $t('unitconvertor.unitfrom') }}</label>
            <select
              id="unitform"
              v-model="idfrom"
              class="form-select md-size mb-2"
              @change="convertInput('right')"
            >
              <option
                v-for="(u, index) in units[cat].units"
                :key="index"
                :value="index"
              >
                {{ u.name }} - {{ u.symbol }}
              </option>
            </select>
          </div>
          <div class="row">
            <label
              class="form-label mb-2 sm-size"
              for="valfrom"
            >{{ $t('unitconvertor.value') }}</label>
            <input
              id="valfrom"
              v-model="from"
              type="number"
              class="form-control md-size mb-2"
            >
          </div>
          <v-calculate id="calc" @calculate="convertInput('right')" />
          <button class="btn mb-2" id="showtab" @click="convertTable('right')">
            {{ $t('buttons.showtable') }}
          </button>
        </div>
        <div class="col-6">
          <div class="row">
            <label
              class="form-label mb-2 sm-size"
              for="unitfrom"
            >{{ $t('unitconvertor.unitto') }}</label>
            <select
              v-model="idto"
              class="form-select mb-2 md-size"
              @change="convertInput('left')"
            >
              <option
                v-for="(u, index) in units[cat].units"
                :key="index"
                :value="index"
              >
                {{ u.name }} - {{ u.symbol }}
              </option>
            </select>
          </div>
          <div class="row">
            <label
              class="form-label mb-2 sm-size"
              for="valto"
            >{{ $t('unitconvertor.value') }}</label>
            <input
              id="valto"
              v-model="to"
              type="number"
              class="form-control md-size mb-2"
            >
          </div>
          <v-calculate id="calc" @calculate="convertInput('left')" />
          <button class="btn mb-2" id="showtab" @click="convertTable('left')">
            {{ $t('buttons.showtable') }}
          </button>
        </div>
      </div>
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <div
        v-if="result"
        class="resultbox"
        v-html="result"
      />
    </div>
  </div>
</template>

<script>

import { definedUnits, convertUnit } from '@/scripts/unitconvertor.js'
import VCalculate from '@/components/inputs/VCalculate.vue';

export default {

  name: 'TextCodes',

  data: function () {
    return {
      from: 1,
      to: 1,
      cat: 0,
      idto: 0,
      idfrom: 0,
      errormsg: "",
      showinfo: true,
      units: [],
      result: "",
    }
  },

  created: function() {
    this.units = definedUnits;
  },

  components: {
    VCalculate
  },

  methods: {

    // Change category
    changeCat : function () {
      this.idto = 0;
      this.idfrom = 0;
      this.to = 1;
      this.from = 1;
      console.log(this.cat);
    },

    // Translate the input
    convertInput : function (direction) {

      // Reset error flag
      this.errormsg = "";
      this.result = "";

      try {

        if (direction == "right")

          this.to = convertUnit(this.from, this.cat, this.idfrom, this.idto)

        else

          this.from = convertUnit(this.to, this.cat, this.idto, this.idfrom)

      } catch (e) {

        this.errormsg = this.$t('errors.generic');
        console.log(e);

      }
    },

    // Translate the input
    convertTable : function (direction) {

      // Reset
      this.error = false;
      this.result = "";
      let val = 0;
      let html = "";

      try {

        // Write header
        if (direction == "right")
          html = "<h4>" + this.from + " " + this.units[this.cat].units[this.idfrom].name + " (" + this.units[this.cat].units[this.idfrom].symbol + ") =</h4><br>";
        else
          html = "<h4>" + this.to + " " + this.units[this.cat].units[this.idto].name + " (" + this.units[this.cat].units[this.idto].symbol + ") =</h4><br>";

        html += "<table class='table table-sm table-responsive'><thead><tr><th scope='col' class='text-right'>Amount</th><th scope='col'>Symbol</th><th scope='col'>Unit</th></tr></thead>";
      
        // Write rows
        for (let u = 0; u < this.units[this.cat].units.length; u++) {

          if (direction == "right")

            val = convertUnit(this.from, this.cat, this.idfrom, u)

          else

            val = convertUnit(this.to, this.cat, this.idto, u)

          html += "<tr><td class='text-right'>" + val.toFixed(5) + "</td><td>" + this.units[this.cat].units[u].symbol + "</td><td>" + this.units[this.cat].units[u].name + "</td></tr>";
        }

        html += "</table>";
        this.result = html;

      } catch (e) {

        this.error = true;
        this.errormsg = this.$t('errors.generic');
        console.log(e);

      }
    },

  },
}
</script>

<style scoped>
</style>
