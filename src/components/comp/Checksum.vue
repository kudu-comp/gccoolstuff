<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('checksum.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('checksum.long')"
      />
      <div class="row">
        <label
          class="form-label mb-2 sm-size"
          for="check"
        >{{ $t('checksum.checkmethod') }}</label>
        <select
          id="check"
          v-model="checksel"
          class="form-select mb-2 lg-size"
          style="width: 150px;"
        >
          <option value="0">Modulo 10</option>
          <option value="2">GS1 standard (EAN, GLN, GTIN, UCC, GSIN, SSCC)</option>
          <option value="3">Elfproef / Modulo 11</option>
          <option value="4">Dutch BSN</option>
          <option value="5">ISBN-10 (old), use GS1 for ISBN-13</option>
          <option value="6">Luhn (credit card, IMEI and many others)</option>
          <option value="7">IBAN (International Bank Account Number)</option>
          <option value="1">Universal Product Code (UPC)</option>
          <option value="8">Parity bit (only works on 0s and 1s)</option>
        </select>
      </div>
      <div class="row">
        <label
          class="form-label mb-2 sm-size"
          for="input"
        >{{ $t('labels.number') }}</label>
        <input
          id="input"
          v-model="txt"
          type="text"
          class="form-control md-size mb-2"
        >
      </div>
      <v-calculate id="run" @calculate="runChecksum" />
      <p
        v-show="errormsg"
        class="errormsg mt-2"
      >
        {{ errormsg }}
      </p>
      <div
        v-if="result"
        class="resultbox"
      >
        {{ result }}
      </div>
    </div>
  </div>
</template>

<script>

import VCalculate from '@/components/inputs/VCalculate.vue' 

export default {

  name: 'CompChecksum',

  data: function () {
    return {
      checksel : "0",
      result : "",
      txt: "",
      errormsg: ""
    }
  },

  components: {
    VCalculate
  },

  methods: {

    // Translate the input
    runChecksum : function () {

      // Init
      this.result = "";
      this.errormsg = "";
      let nums = [];
      let h = 0;
      
      try {

        // IBAN checksum is totally different
        if (this.checksel === "7") {
          // Skip the first four for now
          // Add digits as is
          // Add letters as position in alphabet plus 9
          let s = "";
          for (let i = 4; i < this.txt.length; i++) {
            s += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
              .indexOf(this.txt[i])
              .toString();
          }

          // Append the first two positions (country code)
          s += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            .indexOf(this.txt[0])
            .toString();
          s += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            .indexOf(this.txt[1])
            .toString();

          // Multiply by 100
          s += "00";

          // Module 97 after adding the checksum should be 1
          let b = BigInt(s);
          s = (BigInt(98) - (b % BigInt(97))).toString().padStart(2, "0");

          // Write the result
          this.result = this.$t('checksum.checkres') + s;
          return;
        }

        // Non IBAN check digits
        // Check and convert input to int
        for (let c of this.txt) {
          if (c === "?") continue;
          let i = parseInt(c, 10);
          if (isNaN(i)) {
            this.errormsg = this.$t('errors.notanumber');
            return;
          }
          nums.push(i);
        }

        // Swap array if checksum is calculated right to left
        if ("23456".indexOf(this.selmode) >= 0) {
          let rev = [];
          for (let e of nums) rev.unshift(e);
          nums = rev;
        }

        this.result = this.$t('checksum.checkres'); //"The checksum is: ";

        // Step 1: run over all the digits
        let sum = 0;
        for (let i = 0; i < nums.length; i++) {
          switch (this.checksel) {
            case "0":
            case "8":
              sum += nums[i];
              break;
            case "1":
            case "2":
              // First position is 1, but i is zero!
              // So odd / even switched
              sum += i % 2 === 0 ? nums[i] * 3 : nums[i];
              break;
            case "3":
            case "4":
            case "5":
              sum += nums[i] * (i + 2);
              break;
            case "6":
              h = i % 2 === 0 ? nums[i] * 2 : nums[i];
              sum += h > 9 ? (h % 10) + 1 : h;
              break;
            default:
              break;
          }
        }

        // Step 2: finalize checksum
        switch (this.checksel) {
          case "0":
            this.result += sum % 10;
            break;
          case "1":
          case "2":
          case "6":
            this.result += sum % 10 === 0 ? 0 : 10 - (sum % 10);
            break;
          case "3":
          case "5":
            h = 11 - (sum % 11);
            if (h < 10) this.result += h;
            if (h === 10) this.result += "0 or 10";
            if (h === 11) this.result += "X or 11";
            break;
          case "4":
            h = sum % 11;
            if (h < 10) this.result += h;
            if (h === 10) this.result += "0 or 10";
            if (h === 11) this.result += "X or 11";
            break;
          case "8":
            if (sum % 2 === 0) {
              this.result += this.$t('checksum.checkpar1'); // "0 (even parity) or 1 (odd parity)";
            } else {
              this.result += this.$t('checksum.checkpar2'); //"1 (even parity) or 0 (odd parity)";
            }
            break;
          default:
            break;
        }
          
      } catch (e) {

        this.errormsg = this.$t('errors.generic');
        console.log(e);

      }

    },

  },

}
</script>

<style scoped>
</style>
