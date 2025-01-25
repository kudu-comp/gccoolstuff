<template>
  <div class="row">
    <label for="sel" class="form-label md-size mb-2">{{$t('language')}}</label>
    <select
      id="sel"
      class="form-control md-size mb-2"
      @input="updateDict($event.target.value)"
    >
      <option value="1">English small (47,000 words)</option>
      <option value="2">Dutch small (118,000 words)</option>
      <option value="3">French small (73,000 words)</option>
    </select>
  </div>
</template>

<script>
import { dict as dictENSmall } from "@/assets/dicts/en-small.js";
import { dict as dictNLSmall } from "@/assets/dicts/nl-small.js";
import { dict as dictFRSmall } from "@/assets/dicts/fr-small.js";

export default {
  name: "VLanguage",

  props: {
    dict: {
      type: Object,
      required: true,
    },
  },

  emits: ["update:dict"],

  mounted: function () {
    this.updateDict("1");
  },

  methods: {
    updateDict: function (e) {
      switch (e) {
        case "1":
          this.$emit("update:dict", dictENSmall);
          break;
        case "2":
          this.$emit("update:dict", dictNLSmall);
          break;
        case "3":
          this.$emit("update:dict", dictFRSmall);
          break;
        default:
          console.log("Error", e)
      }
    },
  },
};
</script>
