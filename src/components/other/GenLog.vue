<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('genlog.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('genlog.long')"
      />
      <!-- Form fields -->
      <!-- Number input -->
      <div class="row">
        <label for="n" class="form-label md-size mb-2">{{$t('genlog.n')}}</label>
        <input type="number" min="1" v-model="n" id="n" class="form-control md-size mb-2" @input="updateTemp()"/>
      </div>
      <div class="row">
        <label for="tot" class="form-label md-size mb-2">{{$t('genlog.tot')}}</label>
        <input type="number" min="1" v-model="tot" id="tot" class="form-control md-size mb-2"/>
      </div>
      <div class="row">
        <label for="day" class="form-label md-size mb-2">{{$t('genlog.day')}}</label>
        <input type="number" min="1" v-model="day" id="day" class="form-control md-size mb-2"/>
      </div>
      <button class="btn mb-2" id="btn1" @click="random()">{{$t('genlog.random')}}</button>
      <!-- Text input -->
      <div class="row" v-for="(item, index) in txt">
        <label for="txt" class="form-label mb-2">Template {{ index + 1 }}</label>
        <textarea
          id="txt"
          class="form-control mb-2"
          v-model="txt[index]"
          rows="5"
          :placeholder="$t('genlog.ph')"
        />
        <button @click="genlog(index)" class="lg-size btn mb-2">
          {{$t('genlog.template')}} {{ index + 1 }}
        </button>
      </div>
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <!-- Result area or use v-html -->
      <div v-if="result" class="resultbox" >
        {{ result }} 
      </div>
    </div>
  </div>
</template>

<script>

export default {

  name: "GenLog",

  data() {
    return {
      result: "",
      errormsg: "",
      n : 2,
      tot: 1,
      day: 1,
      txt: ["", ""]
    };
  },

  methods: {

     updateTemp: function () {
      let h = this.txt.length;
      if (this.n < h) for (let i = this.n; i < h; i++) this.txt.pop();
      else if (this.n > h) for (let i = h; i < this.n; i++) this.txt.push("");
    },

    random: function () {
      this.genlog(Math.floor(Math.random() * this.n));
    },

    genlog: function (idx) {

      // Reset
      this.result = "";
      this.errormsg = "";
      console.log("genlog", idx, this.txt[idx]);

      this.result = this.txt[idx].replace("%tot%", this.tot++);
      this.result = this.result.replace("%day%", this.day++);
      navigator.clipboard.writeText(this.result);

    },

  },
};

</script>

<style scoped>
</style>
