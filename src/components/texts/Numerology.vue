<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('numerology.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('numerology.long')"
      />
      <div class="row">
        <label for="sel" class="form-label sm-size mb-2">{{ $t('numerology.selmethod')}}</label>
        <select id="sel" class="form-select lg-size mb-2" v-model="selmode" @change="calculateValue">
          <option value="0">Agrippan (based on Classic latin alphabet)</option>
          <option value="1">Pythagorean</option>
          <option value="2">Chaldean</option>
          <option value="3">Gematria (Latin input)</option>
          <option value="4">Gematria (Hebrew input)</option>
          <option value="5">Isopsephy (Latin input)</option>
          <option value="6">Isopsephy (Greek input)</option>
          <option value="7">English Qabbala</option>
        </select>
      </div>
      <v-calculate @calculate="calculateValue" class="mb-2"/>      
      <textarea
        id="message"
        ref="message"
        v-model="txt"
        class="form-control mb-2"
        :placeholder="$t('labels.message')"
        rows="5"
      />
      <div
        v-if="result"
        class="resultbox"
      >
        {{ result }}<br>
        {{ result2 }}
      </div>
    </div>
  </div>
</template>

<script>

import VCalculate from '@/components/inputs/VCalculate.vue';

export default {

  name: "Numerology",

  components: {
    VCalculate
  },

  data() {
    return {
      txt: "",
      result: "",
      result2: "",
      selmode: "0",
      errormsg: "",
      values: [
        // Agrippan https://en.wikipedia.org/wiki/Gematria
        [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          600,
          10,
          20,
          30,
          40,
          50,
          60,
          70,
          80,
          90,
          100,
          200,
          700,
          900,
          300,
          400,
          500,
        ],
        // Pythagorean
        [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
        ],
        // Chaldean
        [
          1,
          2,
          3,
          4,
          5,
          8,
          3,
          5,
          1,
          1,
          2,
          3,
          4,
          5,
          7,
          8,
          1,
          2,
          3,
          4,
          6,
          6,
          6,
          5,
          1,
          7,
        ],
        // Gematria https://en.wikipedia.org/wiki/Gematria
        [
          1,
          2,
          3,
          4,
          5,
          6,
          3,
          8,
          10,
          10,
          20,
          30,
          40,
          50,
          70,
          80,
          100,
          200,
          300,
          400,
          6,
          6,
          6,
          400,
          6,
          7,
        ],
        // Gematria using hebrew alphabet, reading right to left
        [
          900,
          800,
          700,
          600,
          500,
          400,
          300,
          200,
          100,
          90,
          80,
          70,
          60,
          50,
          40,
          30,
          20,
          10,
          9,
          8,
          7,
          6,
          5,
          4,
          3,
          2,
          1,
        ],
        // Isopsephy https://en.wikipedia.org/wiki/Isopsephy
        [
          1,
          2,
          3,
          4,
          5,
          6,
          3,
          8,
          10,
          10,
          20,
          30,
          40,
          50,
          70,
          80,
          90,
          100,
          200,
          300,
          400,
          400,
          6,
          600,
          400,
          7,
        ],
        // Isophsesy using Greek alphabet
        [
          1,
          2,
          3,
          4,
          5,
          6,
          6,
          7,
          8,
          9,
          10,
          20,
          30,
          40,
          50,
          60,
          70,
          80,
          90,
          100,
          200,
          300,
          400,
          500,
          600,
          700,
          800,
          900,
        ],
        // English Qabbala https://en.wikipedia.org/wiki/English_Qaballa
        [
          1,
          20,
          13,
          6,
          25,
          18,
          11,
          4,
          23,
          16,
          9,
          2,
          21,
          14,
          7,
          26,
          19,
          12,
          5,
          24,
          17,
          10,
          3,
          22,
          15,
          8,
        ],
      ],
    };
  },

  
  mounted: function() {
    this.$refs.message.focus();
  },

  methods: {

    calculateValue: function () {
      this.result = "";
      this.result2 = "";
      this.errormsg = "";
      let sum = 0;
      let h = 0;
      let calculation = "";
      let alphabet = "";

      switch (this.selmode) {
        case "4":
          alphabet = "ץףןםךתשרקצפעסנמלכיטחזוהדגבא";
          break;
        case "6":
          alphabet = "ΑΒΓΔΕϜϚΖΗΘΙΚΛΜΝΞΟΠϘΡΣΤΥΦΧΨΩϠ";
          break;
        default:
          alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      }

      for (let c of this.txt.trim()) {
        h = alphabet.indexOf(c.toUpperCase());
        if (h >= 0) {
          sum += this.values[this.selmode][h];
          calculation += this.values[this.selmode][h].toString() + " + ";
        } else {
          this.errormsg = this.$t('numerology.err1');
        }
      }

      this.result = this.$t('numerology.res1') + sum.toString();
      this.result2 = this.$t('numerology.res2') + calculation.slice(0, -2) + "= " + sum.toString();
    },
  },
};

</script>

<style scoped>
</style>
