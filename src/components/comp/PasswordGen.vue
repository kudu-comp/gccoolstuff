<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('passwordgen.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('passwordgen.long')"
      />
      <!-- Form fields -->
      <!-- Number input -->
      <div class="row">
        <label for="len" class="form-label sm-size mb-2">{{$t('passwordgen.len')}}</label>
        <input type="number" min="4" v-model="len" id="num1" class="form-control md-size mb-2"/>
      </div>
      <!-- Checkboxes -->
      <div class="form-check">
        <input type="checkbox" class="form-check-input mb-2" id="uppcase" v-model="uppcase"/>
        <label for="uppcase" class="form-check-label mb-2">{{$t('passwordgen.uppcase')}}</label>
      </div>
      <div class="form-check">
      <input type="checkbox" class="form-check-input mb-2" id="lowcase" v-model="lowcase"/>
      <label for="lowcase" class="form-check-label mb-2">{{$t('passwordgen.lowcase')}}</label>
      </div>
      <div class="form-check">
      <input type="checkbox" class="form-check-input mb-2" id="numbers" v-model="numbers"/>
      <label for="numbers" class="form-check-label mb-2">{{$t('passwordgen.numbers')}}</label>
      </div>
      <div class="form-check">
        <input type="checkbox" class="form-check-input mb-2" id="symbols" v-model="symbols"/>
        <label for="symbols" class="form-check-label mb-2">{{$t('passwordgen.symbols')}}</label>
      </div>
      <!-- Action buttons -->
      <button class="btn mb-2" id="btn1" @click="generate()">{{$t('buttons.generate')}}</button>
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

  name: "PasswordGen",

  components: {
        
  },

  data() {
    return {
      result: "",
      errormsg: "",
      len: 12,
      uppcase: true,
      lowcase: true,
      numbers: true,
      symbols: true
    };
  },

  methods: {

    generate: function () {

      // Reset
      this.result = "";
      this.errormsg = "";

      let strup = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let strlow = "abcdefghijklmnopqrstuvwxyz";
      let strnum = '0123456789';
      let strsym = "!@#$%^&*()_+-={}[]:<,>.?/~|";
      let strdia = "äëïöüâêîôûàèìòùáéíóúãñçýÿõ"

      // Compose string
      let elems = "";
      if (this.uppcase) elems += strup;
      if (this.lowcase) elems += strlow;
      if (this.numbers) elems += strnum;
      if (this.symbols) elems += strsym;
      
      // Generate one for each
      let pw = "";
      for (let i=0; i < this.len; i++) {
        pw += elems[Math.floor(Math.random()*elems.length)];
      }

      this.result = this.$t('passwordgen.result') + ": "+ pw;
    },

  },
};

</script>

<style scoped>
</style>
