<template>

  <header class="page-header">
    <h1>{{ $t('nimbers.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('nimbers.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <div class="form-horizontal">
          <label>{{ $t('nimbers.num1') }}</label>
          <input type="number" v-model="x" ref="x">
        </div>
        <div class="form-horizontal">
          <label>{{ $t('nimbers.num2') }}</label>
          <input type="number" v-model="y">
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <v-calculate @calculate = "nimberProduct"></v-calculate>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="$t('labels.result')">     
        <p class="card resultbox" v-if="prod">
          {{ $t('nimbers.prod') }} <strong>{{ prod }}</strong>.<br>
          {{ $t('nimbers.sum') }} <strong>{{ sum }}</strong>.
        </p>
      </VCard>
    </div>
  </div>
</template>

<script>

import VCard from '@/components/generic/VCard.vue' 
import VCalculate from '@/components/generic/VCalculate.vue' 

export default {
  name: 'Nimbers',

  components: {
    VCard,
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

  mounted: function() {
    this.$refs.x.focus();
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
