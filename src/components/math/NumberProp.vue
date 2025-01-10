<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('numberprop.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('numberprop.long')"
      />
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          for="n"
        >{{ $t('numberprop.num') }}</label>
        <input
          id="n"
          ref="n"
          v-model="n"
          type="number"
          min="1"
          max="1000000000"
          class="form-control md-size mb-2 me-2"
          @keyup.enter="getProperties"
        >
        <v-calculate @calculate = "getProperties"></v-calculate>
      </div>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <va-item
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('numberprop.t1') }}
        </template>
        <template #content>
          <table>
            <tr>
              <td>
                <div v-show="n % 2 == 0">
                  &#x2713;
                </div><div v-show="n % 2 != 0">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.even') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="n % 2 != 0">
                  &#x2713;
                </div><div v-show="n % 2 == 0">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.odd') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isprime">
                  &#x2713;
                </div><div v-show="!isprime">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.prime') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="!isprime">
                  &#x2713;
                </div><div v-show="isprime">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.comp') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isbiprime">
                  &#x2713;
                </div><div v-show="!isbiprime">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.bi') }}</td>
            </tr>
            <tr>
              <td width="50px">
                <div v-show="isfibonacci">
                  &#x2713;
                </div><div v-show="!isfibonacci">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.fib') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isniven">
                  &#x2713;
                </div><div v-show="!isniven">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.niven') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="issquarefree">
                  &#x2713;
                </div><div v-show="!issquarefree">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.sqfree') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isevil">
                  &#x2713;
                </div><div v-show="!isevil">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.evil') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="!isevil">
                  &#x2713;
                </div><div v-show="isevil">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.odious') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isperfect">
                  &#x2713;
                </div><div v-show="!isperfect">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.perfect') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isdeficient">
                  &#x2713;
                </div><div v-show="!isdeficient">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.defi') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isabundant">
                  &#x2713;
                </div><div v-show="!isabundant">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.abun') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isnarcissistic">
                  &#x2713;
                </div><div v-show="!isnarcissistic">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.narc') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="ispowerful">
                  &#x2713;
                </div><div v-show="!ispowerful">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.pow') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="ispentagonal">
                  &#x2713;
                </div><div v-show="!ispentagonal">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.penta') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="islucky">
                  &#x2713;
                </div><div v-show="!islucky">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.lucky') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="ishappy">
                  &#x2713;
                </div><div v-show="!ishappy">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.happy') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isaspiring">
                  &#x2713;
                </div><div v-show="!isaspiring">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('numberprop.asp') }}</td>
            </tr>
          </table>
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from '@/components/inputs/VaItem.vue'
import VCalculate from '@/components/inputs/VCalculate.vue'

export default {
  name: 'MathProperties',

  components: {
    VaItem,
    VCalculate
  },

  data: function () {
    return {
      n: 0,
      result: 0,
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
      this.errormsg = "";

      // Check if n is too big
      if (this.n > 1000000000) {
          this.errormsg = this.$t('numberprop.toobig');
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
          this.errormsg = this.$t('errors.generic');
        });
    },
  },
}
</script>
