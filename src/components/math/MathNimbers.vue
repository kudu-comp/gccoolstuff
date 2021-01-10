<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('mathtools.nimbers.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock">
        {{$t('dialognim.info')}}
      </div>
      <div class="form-inline">
        <label class="form-label mr-2 mb-2" for="x">{{$t('dialognim.num1')}}</label>
        <input type='number' id="x" name="x" ref="x" v-model="x" class="form-control mr-2 mb-2">
        <label class="form-label mr-2 mb-2" for="y">{{$t('dialognim.num2')}}</label>
        <input type='number' id="y" name="y" ref="y" v-model="y" class="form-control mb-2" v-on:keyup.enter="nimberProduct">
      </div>
      <div>
        <input type="button" id="product" name="product" :value="$t('buttons.calc')" class="btn btn-primary mb-2" v-on:click="nimberProduct">
      </div>
      <p v-show="error" class="errormsg mb-2">{{errormsg}}</p>
      <va-item v-bind:showitem='showitem' v-bind:hidebutton='hidebutton'>
        <template v-slot:header>{{$t('dialognim.t1')}}</template>
        <template v-slot:content>
          {{$t('dialognim.prod')}} <strong>{{prod}}</strong>.<br>
          {{$t('dialognim.sum')}} <strong>{{sum}}</strong>.
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from '@/components/inputs/VaItem.vue'

export default {
  name: 'MathNimbers',

  props: {
    msg: String
  },

  components: {
    VaItem,
  },

  data: function () {
    return {
      error: false,
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

  mounted: function() {
    this.$refs.x.focus();
  },

  methods: {

    // Calculate the nimber product and sum
    nimberProduct: function() {
      this.error = false;
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
            this.error = true;
            this.errormsg = this.$t('errors.generic');
        });
    },

  },
}
</script>

<style scoped>
</style>
