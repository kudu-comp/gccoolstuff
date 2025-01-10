<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('textchunks.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('textchunks.long')"
      />
      <!-- Form fields -->
      <!-- Selection dropdown -->
      <div class="row">
        <label
          class="form-label mb-2 md-size"
          for="dir"
        >{{ $t('textchunks.dir') }}</label>    
        <select
          id="dir"
          v-model="dir"
          class="form-select mb-2 sm-size"
        >
          <option value="H">{{ $t('dialogpb.d.hor')}}</option>
          <option value="V">{{ $t('dialogpb.d.ver')}}</option>
        </select>
      </div>
      <!-- Number input -->
      <div class="row">
        <label for="start" class="form-label md-size mb-2">{{$t('textchunks.start')}}</label>
        <input type="number" min="0" v-model="start" id="start" class="form-control sm-size mb-2"/>
      </div>
      <!-- Number input -->
      <div class="row">
        <label for="end" class="form-label md-size mb-2">{{$t('textchunks.end')}}</label>
        <input type="number" min="0" v-model="end" id="end" class="form-control sm-size mb-2"/>
      </div>
      <!-- Checkbox -->
      <div class="form-check">
        <input
          id="ignore"
          v-model="ignore"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="ignore"
          class="form-check-label mb-2"
        >{{ $t('textchunks.ignore') }}</label>
      </div>
      <!-- Checkbox -->
      <div class="form-check">
        <input
          id="upper"
          v-model="upper"
          type="checkbox"
          class="form-check-input me-2 mb-2"
        >
        <label
          for="upper"
          class="form-check-label mb-2"
        >{{ $t('textchunks.upper') }}</label>
      </div>
      <button class="btn mb-2" id="btn1" @click="chunk()">
        {{$t('buttons.show')}}
      </button>
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <!-- Text area input -->
      <textarea
        id="txt"
        v-model="txt"
        ref="txt"
        class="form-control mb-2"
        :placeholder="$t('labels.message')"
        rows="5"
      />
      <!-- Result area or use v-html -->
      <div v-if="result" style="font-family: Courier" class="resultbox" v-html="result" />
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
      txt: "",
      start: 2,
      end: 10,
      dir: "H",
      ignore: false,
      upper: false
    };
  },
  
  mounted: function() {
    this.$refs.txt.focus();
  },

  methods: {

    chunk: function () {

      // Reset
      this.result = "";
      this.errormsg = "";

      // Check input
      if (!this.txt) {
        this.errormsg = this.$t('errors.noinput');
        return;
      }

      // Replace whitespace with nothing if needed
      let cleantxt = this.txt;
      if (this.ignore) {
        cleantxt = cleantxt.replace(/\s/g, "");
      }
      if (this.upper) {
        cleantxt = cleantxt.toUpperCase();
      }

      // Chunk txt
      for (let i = this.start; i <= this.end; i++) {
        this.result += "<br><b>Chunk size " + i.toString() + "</b><br>";
        let h = cleantxt;
        if (this.dir == "H") {
          // Horizontal direction
          while (h.length > 0) {
            this.result += h.slice(0, i) + "<BR>";
            h = h.slice(i);
          }
        } else {
          // Vertical direction
          let a = new Array(i).fill("");
          for (let j = 0; j < h.length; j++) {
            a[j % i] += h[j];
          }
          for (let j = 0; j < i; j++) {
            this.result += a[j] + "<BR>";
          }
        }
      }

    },

  },
};

</script>

<style scoped>
</style>
