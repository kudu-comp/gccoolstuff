<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('randomizer.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('randomizer.long')"
      />
      <div class="row mb-2">
        <label for="sel" class="form-label md-size mb2" style="width: 20rem">
          {{$t('randomizer.sel')}}
        </label>
        <select v-model="sel" id="sel" class="form-control sm-size mb2" style="width: 25rem">
          <option value="0">{{$t('randomizer.selbin')}}</option>
          <option value="1">{{$t('randomizer.selrng')}}</option>
          <option value="2">{{$t('randomizer.seltxt')}}</option>
          <option value="3">{{$t('randomizer.selcol')}}</option>
          <option value="4">{{$t('randomizer.selascii')}}</option>
        </select>
      </div>
      <div class="row mb-2">
        <label for="cnt" class="form-label md-size mb2" style="width: 20rem">
          {{$t('randomizer.numberof')}}
        </label>
        <input
          id="cnt"
          type="number"
          v-model="cnt"
          class="form-control md-size mb2"
          style="width: 5rem"
          min="0"
        />
      </div>
      <div class="row mb-2">
        <label for="max" class="form-label sm-size mb2" style="width: 20rem"
          >{{$t('randomizer.minmax')}}</label
        >
        <input
          id="min"
          type="number"
          v-model="min"
          class="form-control sm-size mb2 me-2"
        />
        <input
          id="max"
          type="number"
          v-model="max"
          class="form-control sm-size mb2"
        />
      </div>
      <div class="row mb-2">
        <label for="txt" class="form-label md-size mb2" style="width: 20rem"
          >{{$t('randomizer.chars')}}</label
        >
        <input
          id="txt"
          class="form-control xl-size mb2"
          type="text"
          size="35"
          v-model="txt"
          style="width: 25rem"
        />
      </div>
      <div class="row mb-2">
        <label for="coll" class="form-label  md-size mb2" style="width: 20rem"
          >{{$t('randomizer.coll')}}</label
        >
        <input
          id="coll"
          class="form-control xl-size mb2"
          type="text"
          size="35"
          v-model="coll"
          style="width: 25rem"
        />
      </div>
      <div class="row mb-2">
        <label for="sep" class="form-label mb-2" style="width: 20rem">{{$t('randomizer.sep')}}</label>
        <select v-model="sep" class="form-control mb-2" id="sep" style="width: 25rem">
          <option value="">{{$t('randomizer.sepnone')}}</option>
          <option value=" ">{{$t('randomizer.sepspace')}}</option>
          <option value=",">{{$t('randomizer.sepcomma')}}</option>
          <option value=":">{{$t('randomizer.sepcolon')}}</option>
          <option value="-">{{$t('randomizer.sephyphen')}}</option>
        </select>
      </div>
      <v-calculate class="mb-2" id="calc" @calculate="generate()"></v-calculate>
      <div v-if="result" class="resultbox" >
        {{ result }}
      </div>
    </div>
  </div>
</template>

<script>

import VCalculate from '@/components/inputs/VCalculate.vue';

export default {

  name: "Randomizer",

  components: {
    VCalculate    
  },

  data() {
    return {
      sel: "0",
      cnt: 10,
      max: 9,
      min: 0,
      txt: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      coll: "purple,indigo,blue,green,yellow,orange,red",
      sep: "",
      result: "",
      errormsg: "",
    };
  },

  methods: {

    generate: function () {
      // Reset
      this.result = "";
      this.errormsg = "";
      let maxgen = 0;
      let mingen = 0;
      let coll = this.coll.split(",");

      switch (this.sel) {
        case "0":
          mingen = 0;
          maxgen = 1;
          break;
        case "1":
          mingen = this.min;
          maxgen = this.max;
          break;
        case "2":
          mingen = 0;
          maxgen = this.txt.length - 1;
          break;
        case "3":
          mingen = 0;
          maxgen = coll.length - 1;
          break;
        case "4":
          mingen = 33;
          maxgen = 126;
          break;
      }

      let range = maxgen - mingen + 1;
      for (let i = 0; i < this.cnt; i++) {
        // Generate random whole nuber
        let c = Math.floor(Math.random() * range) + mingen;

        // Convert random number to char
        switch (this.sel) {
          case "0":
          case "1":
            this.result += c.toString();
            break;
          case "2":
            this.result += this.txt[c];
            break;
          case "3":
            this.result += coll[c].trim();
            break;
          case "4":
            this.result += String.fromCharCode(c);
        }
        this.result += this.sep;
      }

      // Remove last separator
      if (this.sep !== "") {
        this.result = this.result.slice(0, -1);
      }
    },

  },
};

</script>

<style scoped>
</style>
