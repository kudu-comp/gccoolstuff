<template>
  <div class="form-inline">
    <label for="listofalpha" class="form-label mr-2">{{$t('labels.alphabet')}}</label>
    <select class="custom-select" :value='alphabet' @input="updateAlphabet($event.target.value)">
      <option v-for="a in alphabets" :key="a" :value="a.name">{{a.name}} - {{a.alphabet}}</option>
    </select>
  </div>
</template>

<script>
import * as textHelper from '@/scripts/texthelper.js';

export default {
  props: ['alphabet'],
  data : function () {
    return {
      alphabets : null,
    }
  },
  mounted: function() {
    this.alphabets = textHelper.alphabets;
    // this.alphabets.push ( { name : "Vanity code or phone keys", length : 0, alphabet : 'A=2,B=2,C=2,D=3,...' } )
  },
  methods: {
    updateAlphabet: function (value) {
      this.$emit ('update:alphabet', value);
    },
  }
}
</script>
