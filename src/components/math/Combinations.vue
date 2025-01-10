<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('combinations.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('combinations.long')"
      />
      <!-- Form fields -->
      <div class="row">
        <label for="cnt" class="form-label md-size mb-2">{{$t('combinations.cnt')}}</label>
        <input type="number" min="0" v-model="cnt" id="cnt" ref="cnt" class="form-control md-size mb-2"/>
      </div>
      <div class="row">
        <label for="size" class="form-label md-size mb-2">{{$t('combinations.size')}}</label>
        <input type="number" min="0" v-model="size" id="size" class="form-control md-size mb-2"/>
      </div>
      <div class="form-check">
        <input
          id="rpt"
          v-model="rpt"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="rpt"
          class="form-check-label mb-2"
        >{{ $t('combinations.rpt') }}</label>
      </div>
      <!-- Selection dropdown -->
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="sel"
        >{{ $t('combinations.sel') }}</label>    
        <select
          id="sel"
          v-model="sel"
          class="form-select mb-2 md-size"
          @change="doAction()"
        >
          <option value="0">{{ $t('combinations.cntcomb') }}</option>
          <option value="1">{{ $t('combinations.cntperm') }}</option>
          <option value="2">{{ $t('combinations.gencomb') }}</option>
          <option value="3">{{ $t('combinations.genperm') }}</option>
        </select>
      </div>
      <div class="row" v-show="sel === '2' || sel === '3'">
        <label for="set" class="form-label md-size mb-2">{{ $t('combinations.set') }}</label>
        <select 
          id="set" 
          v-model="set" 
          class="form-control lg-size mb-2"
          @change="doAction()"
        >
          <option value="0">{{ $t('combinations.set1') }}</option>
          <option value="1">{{ $t('combinations.set2') }}</option>
          <option value="2">{{ $t('combinations.set3') }}</option>
        </select>
      </div>
      <div class="row" v-if="set === '2' && (sel === '2' || sel === '3')">
        <label for="txt" class="form-label lg-2 md-size">{{ $t('combinations.list') }}</label>
        <input
          id="txt"
          class="form-control mb-2 lg-size"
          type="text"
          v-model="txt"
        />
      </div>
      <!-- Action buttons -->
      <button class="btn mb-2" id="btn1" @click="doAction()">{{$t('buttons.show')}}</button>
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <!-- Result area or use v-html -->
      <div v-if="result" class="resultbox" v-html="result" />
    </div>
  </div>
</template>

<script>

export default {

  name: "Combinations",

  data() {
    return {
      sel: "0",
      cnt: 2,
      size: 4,
      rpt: false,
      set: "0",
      txt: "Purple,Indigo,Blue,Green,Yellow,Orange,Red",
      result: "",
      errormsg: "",
      list: [],
    };
  },

  mounted: function() {
    this.$refs.cnt.focus();
  },
  
  methods: {

    fact: function (n) {
      let cnt = 1;
      for (let i = 2; i <= n; i++) cnt *= i;
      return cnt;
    },

    nextCombi: function (a, comb) {
      if (a.length === this.cnt) {
        // We've enough elements selected, so print
        this.result += "<br>(";
        for (let i = 0; i < a.length; i++) {
          switch (this.set) {
            case "0":
              this.result += a[i];
              break;
            case "1":
              this.result += "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[a[i] - 1];
              break;
            case "2":
              this.result += this.list[a[i]-1];
              break;
            default:
              this.result += "-";
          }
          this.result += ",";
        }
        this.result = this.result.slice(0, -1) + ")";
      } else {
        // More elements are needed, so loop over next choices
        // For combinations start at latest number used, for permuations start at 1
        let start = comb ? a[a.length - 1] : 1;
        // For combinations withoutreplacements allow start at next
        if (comb && !this.rpt) start++;
        for (let i = start; i <= this.size; i++) {
          // For permutations without replacements skip i if already used
          if (!comb && !this.rpt && a.indexOf(i) >= 0) continue;
          a.push(i);
          this.nextCombi(a, comb);
          a.pop();
        }
      }
    },

    doAction: function () {
      // Reset
      this.result = "";
      this.errormsg = "";
      let cnt = 0;
      let max = 10000;
      if (this.set === "2") {
        this.list = this.txt.split(",");
        if (this.list.length < this.size) {
          this.errormsg = this.$t("combinations.notenoughitems");
          return;
        }
      }

      // Count and generate combinations or permutations
      switch (this.sel) {
        case "0":
        case "2":
          // Count combinations
          if (this.rpt) {
            cnt =
              this.fact(this.size - 1 + this.cnt) /
              (this.fact(this.cnt) * this.fact(this.size - 1));
          } else {
            if (this.size < this.cnt) {
              cnt = 0;
            } else {
              cnt =
                this.fact(this.size) /
                (this.fact(this.cnt) * this.fact(this.size - this.cnt));
            }
          }
          if (isNaN(cnt)) {
            this.errormsg = this.$t("combinations.toomany");
            return;
          }
          this.result = this.$t("combinations.numcomb") + cnt.toFixed(0) + "<br>";
          if (this.sel === "0") return;
          if (cnt > max) {
            this.errormsg = this.$t("combinations.max") + max;
            return;
          }
          for (let i = 1; i <= this.size; i++) {
            this.nextCombi([i], true);
          }
          break;
        case "1":
        case "3":
          // Count permutations
          if (this.rpt) {
            cnt = this.size ** this.cnt;
          } else {
            if (this.size < this.cnt) {
              cnt = 0;
            } else {
              cnt = this.fact(this.size) / this.fact(this.size - this.cnt);
            }
          }
          if (isNaN(cnt)) {
            this.errormsg = this.$t("combinations.toomany");
            return;
          }
          this.result = this.$t("combinations.numperm") + cnt.toFixed(0) + "<br>";
          if (this.sel === "1") return;
          if (cnt > max) {
            this.errormsg = this.$t("combinations.max") + max;
            return;
          }
          for (let i = 1; i <= this.size; i++) {
            this.nextCombi([i], false);
          }
          break;
        default:
      }
    },

  },
};

</script>

<style scoped>
</style>
