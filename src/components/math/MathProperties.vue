<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('mathtools.numberprop.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('mathtools.numberprop.long')"
      />
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          for="n"
        >{{ $t('mathprop.num') }}</label>
        <input
          id="n"
          ref="n"
          v-model="n"
          type="number"
          name="n"
          min="1"
          max="1000000000"
          class="form-control md-size mb-2 me-2"
          @keyup.enter="getProperties"
        >
        <v-calculate class="sm-size" @calculate = "getProperties"></v-calculate>
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
          {{ $t('mathprop.t1') }}
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
              <td>{{ $t('mathprop.even') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="n % 2 != 0">
                  &#x2713;
                </div><div v-show="n % 2 == 0">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.odd') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isprime">
                  &#x2713;
                </div><div v-show="!isprime">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.prime') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="!isprime">
                  &#x2713;
                </div><div v-show="isprime">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.comp') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isbiprime">
                  &#x2713;
                </div><div v-show="!isbiprime">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.bi') }}</td>
            </tr>
            <tr>
              <td width="50px">
                <div v-show="isfibonacci">
                  &#x2713;
                </div><div v-show="!isfibonacci">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.fib') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isniven">
                  &#x2713;
                </div><div v-show="!isniven">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.niven') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="issquarefree">
                  &#x2713;
                </div><div v-show="!issquarefree">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.sqfree') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isevil">
                  &#x2713;
                </div><div v-show="!isevil">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.evil') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="!isevil">
                  &#x2713;
                </div><div v-show="isevil">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.odious') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isperfect">
                  &#x2713;
                </div><div v-show="!isperfect">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.perfect') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isdeficient">
                  &#x2713;
                </div><div v-show="!isdeficient">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.defi') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isabundant">
                  &#x2713;
                </div><div v-show="!isabundant">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.abun') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isnarcissistic">
                  &#x2713;
                </div><div v-show="!isnarcissistic">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.narc') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="ispowerful">
                  &#x2713;
                </div><div v-show="!ispowerful">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.pow') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="ispentagonal">
                  &#x2713;
                </div><div v-show="!ispentagonal">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.penta') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="islucky">
                  &#x2713;
                </div><div v-show="!islucky">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.lucky') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="ishappy">
                  &#x2713;
                </div><div v-show="!ishappy">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.happy') }}</td>
            </tr>
            <tr>
              <td>
                <div v-show="isaspiring">
                  &#x2713;
                </div><div v-show="!isaspiring">
                  &#x2717;
                </div>
              </td>
              <td>{{ $t('mathprop.asp') }}</td>
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
          this.errormsg = this.$t('errors.generic');
        });
    },
  },
}
</script>
