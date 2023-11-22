<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('compname.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('compname.long')"
      />
      <!-- Form fields -->
      <!-- Text input -->
      <div class="row">
        <label
          class="form-label mb-2 sm-size"
          for="text1"
        >{{$t('compname.text1')}}</label>
        <input
          id="text1"
          v-model="text1"
          type="text"
          class="form-control md-size mb-2 me-2"
        >
      </div>
      <!-- Number input -->
      <div class="row">
        <label for="num1" class="form-label sm-size mb-2">{{$t('compname.num1')}}</label>
        <input type="num1" min="0" v-model="num1" id="num1" class="form-control md-size mb-2"/>
      </div>
      <!-- Checkbox -->
      <div class="form-check">
        <input
          id="chk1"
          v-model="chk1"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="chk1"
          class="form-check-label mb-2"
        >{{ $t('compname.chk1') }}</label>
      </div>
      <!-- Selection dropdown -->
      <div class="row">
        <label
          class="form-label mb-2 sm-size"
          for="sel1"
        >{{ $t('compname.sel1') }}</label>    
        <select
          id="sel1"
          v-model="sel1"
          class="form-select mb-2 md-size"
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>
      <!-- Date input -->
      <div class="row" >
        <label for="date1" class="form-label sm-size mb-2">{{$t('compname.date1')}} </label>
        <input type="date" v-model="date1" id="date1" class="form-control md-size mb-2"/>
      </div>
      <!-- Action buttons -->
      <!-- <v-calculate class="mb-2" id="calc" @calculate="doAction()"></v-calculate> -->
      <button class="btn mb2" id="btn1" @click="doAction()">{{$t('buttons.action')}}</button>
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <!-- Text area input -->
      <div class="mb-2">
        <textarea
          id="msg"
          v-model="message"
          class="form-control"
          :placeholder="$t('labels.msg')"
          rows="5"
        />
      </div>
      <!-- Result area or use v-html -->
      <div v-if="result" class="resultbox" >
        {{ result }} 
      </div>
    </div>
  </div>
</template>

<script>

export default {

  name: "ComponentName",

  components: {
        
  },

  data() {
    return {
      result: "",
      errormsg: "",
      text1: "",
      num1: 0,
      sel1: "0",
      chk1: false,
      msg: ""
    };
  },

  methods: {

    doAction: function () {

      // Reset
      this.result = "";
      this.errormsg = "";

    },

  },
};

</script>

<style scoped>
</style>
