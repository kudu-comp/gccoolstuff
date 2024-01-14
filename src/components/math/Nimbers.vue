<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('nimbers.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('nimbers.long')"
      />
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          for="x"
        >{{ $t('nimbers.num1') }}</label>
        <input
          id="x"
          v-model="x"
          type="number"
          class="form-control md-size mb-2"
        >
      </div>
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          for="y"
        >{{ $t('nimbers.num2') }}</label>
        <input
          id="y"
          v-model="y"
          type="number"
          class="form-control md-size mb-2"
          @keyup.enter="nimberProduct"
        >
      </div>
      <div>
        <v-calculate class="col-md-2" @calculate = "nimberProduct"></v-calculate>
      </div>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <p class="resultbox" v-if="prod">
        {{ $t('nimbers.prod') }} <strong>{{ prod }}</strong>.<br>
        {{ $t('nimbers.sum') }} <strong>{{ sum }}</strong>.
      </p>
    </div>
  </div>
</template>

<script>

import VCalculate from '@/components/inputs/VCalculate.vue' 

export default {
  name: 'MathNimbers',

  components: {
    VCalculate
  },

  data: function () {
    return {
      errormsg: "",
      x: 0,
      y: 0,
      prod: 0,
      sum: 0,
      phpurl: window.location.protocol + "//"  + window.location.hostname + "/math/nimbermultiplication.php",
      showitem: true,
      hidebutton: true
    }
  },

  methods: {

    // Calculate the nimber product and sum
    nimberProduct: function() {
      this.errormsg = "";
      let data = {
        x: this.x,
        y: this.y,
      };

      // Call php script on server
      fetch(this.phpurl, {
          method: 'POST',
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            this.prod = data.nimberproduct;
            this.sum = data.nimbersum;
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

<style scoped>
</style>
