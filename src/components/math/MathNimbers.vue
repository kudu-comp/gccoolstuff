<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('mathtools.nimbers.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('mathtools.nimbers.long')"
      />
      <div class="form-inline">
        <label
          class="form-label mr-2 mb-2"
          for="x"
        >{{ $t('mathnim.num1') }}</label>
        <input
          id="x"
          ref="x"
          v-model="x"
          type="number"
          name="x"
          class="form-control mr-2 mb-2"
        >
        <label
          class="form-label mr-2 mb-2"
          for="y"
        >{{ $t('mathnim.num2') }}</label>
        <input
          id="y"
          ref="y"
          v-model="y"
          type="number"
          name="y"
          class="form-control mb-2"
          @keyup.enter="nimberProduct"
        >
      </div>
      <div>
        <input
          id="product"
          type="button"
          name="product"
          :value="$t('buttons.calc')"
          class="btn btn-primary mb-2"
          @click="nimberProduct"
        >
      </div>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <va-item
        :showitem="showitem"
        :hidebutton="hidebutton"
      >
        <template #header>
          {{ $t('mathnim.t1') }}
        </template>
        <template #content>
          {{ $t('mathnim.prod') }} <strong>{{ prod }}</strong>.<br>
          {{ $t('mathnim.sum') }} <strong>{{ sum }}</strong>.
        </template>
      </va-item>
    </div>
  </div>
</template>

<script>

import VaItem from '@/components/inputs/VaItem.vue'

export default {
  name: 'MathNimbers',

  components: {
    VaItem,
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
