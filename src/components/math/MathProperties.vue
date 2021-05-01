<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('mathtools.numberprop.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('mathtools.numberprop.long')" />
      <div class="form-inline">
        <label class="form-label col-sm-2 col-md-3 mb-2" for="x">{{$t('mathprop.num')}}</label>
        <input type='number' id="n" name="n" ref="n" v-model="n" min="1" max="1000000000" class="form-control col-sm-10 col-md-6 mr-2 mb-2" v-on:keyup.enter="getProperties">
        <input type="button" id="props" name="props" :value="$t('buttons.calc')" class="col-md-2 btn btn-primary mb-2" v-on:click="getProperties">
      </div>
      <p v-show="error" class="errormsg mb-2">{{errormsg}}</p>
      <va-item v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
        <template v-slot:header>{{$t('mathprop.t1')}}</template>
        <template v-slot:content>
          <table>
            <tr><td><div v-show="n % 2 == 0">&#x2713;</div><div v-show="n % 2 != 0">&#x2717;</div></td>
              <td>{{$t('mathprop.even')}}</td></tr>
            <tr><td><div v-show="n % 2 != 0">&#x2713;</div><div v-show="n % 2 == 0">&#x2717;</div></td>
              <td>{{$t('mathprop.odd')}}</td></tr>
            <tr><td><div v-show="isprime">&#x2713;</div><div v-show="!isprime">&#x2717;</div></td>
              <td>{{$t('mathprop.prime')}}</td></tr>
            <tr><td><div v-show="!isprime">&#x2713;</div><div v-show="isprime">&#x2717;</div></td>
              <td>{{$t('mathprop.comp')}}</td></tr>
            <tr><td><div v-show="isbiprime">&#x2713;</div><div v-show="!isbiprime">&#x2717;</div></td>
              <td>{{$t('mathprop.bi')}}</td></tr>
            <tr><td width="50px"><div v-show="isfibonacci">&#x2713;</div><div v-show="!isfibonacci">&#x2717;</div></td>
              <td>{{$t('mathprop.fib')}}</td></tr>
            <tr><td><div v-show="isniven">&#x2713;</div><div v-show="!isniven">&#x2717;</div></td>
              <td>{{$t('mathprop.niven')}}</td></tr>
            <tr><td><div v-show="issquarefree">&#x2713;</div><div v-show="!issquarefree">&#x2717;</div></td>
              <td>{{$t('mathprop.sqfree')}}</td></tr>
            <tr><td><div v-show="isevil">&#x2713;</div><div v-show="!isevil">&#x2717;</div></td>
              <td>{{$t('mathprop.evil')}}</td></tr>
            <tr><td><div v-show="!isevil">&#x2713;</div><div v-show="isevil">&#x2717;</div></td>
              <td>{{$t('mathprop.odious')}}</td></tr>
            <tr><td><div v-show="isperfect">&#x2713;</div><div v-show="!isperfect">&#x2717;</div></td>
              <td>{{$t('mathprop.perfect')}}</td></tr>
            <tr><td><div v-show="isdeficient">&#x2713;</div><div v-show="!isdeficient">&#x2717;</div></td>
              <td>{{$t('mathprop.defi')}}</td></tr>
            <tr><td><div v-show="isabundant">&#x2713;</div><div v-show="!isabundant">&#x2717;</div></td>
              <td>{{$t('mathprop.abun')}}</td></tr>
            <tr><td><div v-show="isnarcissistic">&#x2713;</div><div v-show="!isnarcissistic">&#x2717;</div></td>
              <td>{{$t('mathprop.narc')}}</td></tr>
            <tr><td><div v-show="ispowerful">&#x2713;</div><div v-show="!ispowerful">&#x2717;</div></td>
              <td>{{$t('mathprop.pow')}}</td></tr>
            <tr><td><div v-show="ispentagonal">&#x2713;</div><div v-show="!ispentagonal">&#x2717;</div></td>
              <td>{{$t('mathprop.penta')}}</td></tr>
            <tr><td><div v-show="islucky">&#x2713;</div><div v-show="!islucky">&#x2717;</div></td>
              <td>{{$t('mathprop.lucky')}}</td></tr>
            <tr><td><div v-show="ishappy">&#x2713;</div><div v-show="!ishappy">&#x2717;</div></td>
              <td>{{$t('mathprop.happy')}}</td></tr>
            <tr><td><div v-show="isaspiring">&#x2713;</div><div v-show="!isaspiring">&#x2717;</div></td>
              <td>{{$t('mathprop.asp')}}</td></tr>
          </table>
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from '@/components/inputs/VaItem.vue'

export default {
  name: 'MathProperties',

  props: {
    msg: String
  },

  components: {
    VaItem
  },

  data: function () {
    return {
      n: 0,
      result: 0,
      error: false,
      ispalindrome: false,
      isfibonacci: false,
      isprime: false,
      isbiprime: false,
      isniven: false,
      issquarefree: false,
      isevil: false,
      isperfect: false,
      isdeficient: false,
      isabundant: false,
      isnarcissistic: false,
      ispowerful: false,
      islucky: false,
      ishappy: false,
      isaspiring: false,
      ispentagonal: false,
      phpurl: window.location.protocol + "//"  + window.location.hostname + "/math/numberproperties.php",
      showitem: true,
      hidebutton: true,
    }
  },

  mounted: function() {
    this.$refs.n.focus();
  },

  methods: {

    getProperties: function() {

      // Reset error
      this.error = false;

      // Check if n is too big
      if (this.n > 1000000000) {
          this.error = true;
          this.errormsg = this.$t('mathprop.toobig');
          return;
      }

      // Call server script
      let data = {
        n: this.n,
      };

      fetch(this.phpurl, {
          method: 'POST',
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          this.ispalindrome = data.ispalindrome;
          this.isfibonacci = data.isfibonacci;
          this.isprime = data.isprime;
          this.isbiprime = data. isbiprime;
          this.isniven = data.isniven;
          this.issquarefree = data.issquarefree;
          this.isevil = data.isevil;
          this.isperfect = data.isperfect;
          this.isdeficient = data.isdeficient;
          this.isabundant = data.isabundant;
          this.isnarcissistic = data.isnarcissistic;
          this.ispowerful = data.ispowerful;
          this.islucky = data.islucky;
          this.ishappy = data.ishappy;
          this.isaspiring = data.isaspiring;
          this.ispentagonal = data.ispentagonal;
        })
        .catch((error) => {
          console.error('Error ', error);
          this.error = true;
          this.errormsg = this.$t('errors.generic');
        });
    },
  },
}
</script>
