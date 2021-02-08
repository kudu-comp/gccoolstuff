<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('othertools.unitconvertor.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock">{{$t('unitconvertor.info')}}</div>
      <div class="form-inline">
        <label for="cats" class="form-label mr-2 mb-2">{{$t('unitconvertor.selcat')}}</label>
        <select class="custom-select mb-2" v-model="cat" @change="changeCat">
          <option v-for="(c, index) in units" :key="index" :value="index">{{$t('unitconvertor.cat.' + c.category + '.name')}}</option>
        </select>
      </div>
      <div class="infoblock">
        {{$t('unitconvertor.cat.' + units[cat].category + '.desc')}}
      </div>
      <div class="row">
        <div class="col-6">
          <label class="form-label mb-2 mr-2" for="unitfrom">{{$t('unitconvertor.unitfrom')}}</label>
          <select class="custom-select" id="unitform" v-model="idfrom" @change="convertInput('right')">
            <option v-for="(u, index) in units[cat].units" :key="index" :value="index">{{u.name}} - {{u.symbol}}</option>
          </select>
          <label class="form-label mb-2 mr-2" for="valfrom">{{$t('unitconvertor.value')}}</label>
          <input type='number' id="valfrom" v-model="from" class="form-control mb-2">
          <input type="button" id="calc" :value="$t('buttons.calc')" class="btn btn-primary mb-2 mr-2" v-on:click="convertInput('right')">
          <input type="button" id="calc" :value="$t('buttons.showtable')" class="btn btn-primary mb-2" v-on:click="convertTable('right')">
        </div>
        <div class="col-6">
          <label class="form-label mb-2 mr-2" for="unitfrom">{{$t('unitconvertor.unitto')}}</label>
          <select class="custom-select" v-model="idto" @change="convertInput('left')">
            <option v-for="(u, index) in units[cat].units" :key="index" :value="index">{{u.name}} - {{u.symbol}}</option>
          </select>
          <label class="form-label mb-2 mr-2" for="valto">{{$t('unitconvertor.value')}}</label>
          <input type='number' id="valto" v-model="to" class="form-control mb-2">
          <input type="button" id="calc" :value="$t('buttons.calc')" class="btn btn-primary mb-2 mr-2" v-on:click="convertInput('left')">
          <input type="button" id="calc" :value="$t('buttons.showtable')" class="btn btn-primary mb-2" v-on:click="convertTable('left')">
        </div>
      </div>
      <div v-html="result" class="mt-2" />
    </div>
  </div>
</template>

<script>

import { definedUnits, convertUnit } from '@/scripts/unitconvertor.js'

export default {

  name: 'TextCodes',

  props: {
    msg: String,
  },

  data: function () {
    return {
      from: 1,
      to: 1,
      cat: 0,
      idto: 0,
      idfrom: 0,
      error: false,
      errormsg: "",
      showinfo: true,
      units: [],
      result: "",
    }
  },

  created: function() {
    this.units = definedUnits;
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
      this.error = false;

      try {

        if (direction == "right")

          this.to = convertUnit(this.from, this.cat, this.idfrom, this.idto)

        else

          this.from = convertUnit(this.to, this.cat, this.idto, this.idfrom)

      } catch (e) {

        this.error = true;
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
