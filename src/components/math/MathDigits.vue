<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('mathtools.decimals.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('mathtools.decimals.long')" />
      <div>
        <label class="form-label" for="number">{{$t('mathdeci.sel')}}</label>
        <div class="form-check">
          <input type="radio" id="number1" name="number" value="pi" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number1">{{$t('mathdeci.pi')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number2" name="number" value="e" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number2">{{$t('mathdeci.e')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number3" name="number" value="tau" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number3">{{$t('mathdeci.tau')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number4" name="number" value="phi" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number4">{{$t('mathdeci.phi')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number5" name="number" value="euler" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number5">{{$t('mathdeci.euler')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number6" name="number" value="sqrt2" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number6">{{$t('mathdeci.sq2')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number7" name="number" value="sqrt3" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number7">{{$t('mathdeci.sq3')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number8" name="number" value="zeta3" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number8">{{$t('mathdeci.zeta3')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number9" name="number" value="gauss" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number9">{{$t('mathdeci.gauss')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number10" name="number" value="lemni" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number10">{{$t('mathdeci.lemni')}}</label>
        </div>
        <div class="form-check">
          <input type="radio" id="number11" name="number" value="cat" class="form-check-input" v-model="number">
          <label class="form-check-label" for="number11">{{$t('mathdeci.cat')}}</label>
        </div>
      </div>
      <div class="form-inline mt-4">
        <label class="form-label mb-2 mr-2" for="start">{{$t('mathdeci.from')}}</label>
        <input type='number' id="start" name="start" ref="start" v-model="start" min="0" max="1000000" class="form-control mb-2 mr-2">
        <label class="form-label mb-2 mr-2" for="end">{{$t('mathdeci.to')}}</label>
        <input type='number' id="end" name="end" ref="end" v-model="end" min="0" max="1000000" class="form-control mb-2 mr-2" v-on:keyup.enter="getDigits">
        <input type="button" id="getdec" name="getdec" :value="$t('mathdeci.get')" class="btn btn-primary mb-2" v-on:click="getDigits">
      </div>
      <div class="card card-text p-2">{{$t('mathdeci.res1')}} {{start}} {{$t('mathdeci.res2')}} {{end}} {{$t('mathdeci.res3')}} {{result}}.</div>
      <p v-show="errormsg" class="errormsg">{{errormsg}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MathDigits',

  props: {
    msg: String
  },

  data: function () {
    return {
      number: "pi",
      start: 1,
      end: 1,
      errormsg: "",
      result: "",
      phpurl: window.location.protocol + "//"  + window.location.hostname + "/math/getdigits.php",
    }
  },

  mounted: function() {
    this.$refs.start.focus();
  },

  methods: {

    // Get the digits
    getDigits: function() {
      this.errormsg = "";
      let data = {
        number: this.number,
        start: this.start,
        end: this.end,
        n: this.n,
      };

      // Call script on server
      fetch(this.phpurl, {
          method: 'POST',
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            this.result = data.result;
            // console.log('Success', data)
        })
        .catch((error) => {
            console.error('Error ', error);
            this.errormsg = this.$t('errors.generic');
        });
    },

  },
}
</script>
