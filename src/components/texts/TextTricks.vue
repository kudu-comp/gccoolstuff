<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('texttricks.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('texttricks.long')"
      />
      <!-- Form fields -->
      <Tabs ref="mytabs" class="mb-2">
        <Tab title="Clean up">
          <button class="btn me-2" @click="result = msg.replace(/\s/g,'')">Remove whitespace</button>
          <button class="btn me-2" @click="result = msg.replace(/[^A-Z]/ig,'')">Keep only letters</button>
          <button class="btn" @click="result = msg.replace(/[^0-9]/ig,'')">Keep only numbers</button>
        </Tab>
        <Tab title="Change case">
          <button class="btn me-2" @click="result = msg.toUpperCase()">Uppercase</button>
          <button class="btn" @click="result = msg.toLowerCase()">Lowercase</button>
        </Tab>
        <Tab title="Hussle text"></Tab>
        <Tab title="Text chunks">
          <div class="row">
            <label for="sel" class="form-label md-size mb-2">Direction</label>
            <select v-model="dir" id="dir" class="form-control sm-size mb-2">
              <option value="H">Horizontal</option>
              <option value="V">Vertical</option>
            </select>
          </div>
          <div class="row">
            <label for="end" class="form-label md-size mb-2">Chunk size</label>
            <input
              id="end"
              type="number"
              v-model="chunksize"
              class="form-control sm-size"
              min="0"
            />
          </div>
          <div class="row ms-1">
            <div class="form-check">
              <input
                type="checkbox"
                class="form-check-input mb-2"
                id="chk"
                v-model="chk"
              />
              <label for="chk" class="form-check-label mb-2">Ignore whitespace</label>
            </div>
          </div>
          <div class="row ms-1">
            <div class="form-check">
              <input
                type="checkbox"
                class="form-check-input mb-2"
                id="upper"
                v-model="upper"
              />
              <label for="upper" class="form-check-label mb-2">All uppercase</label>
            </div>
          </div>
          <button @click="chunk()" class="btn mb-2">
            Chunk
          </button>
        </Tab>
        <Tab title="Reverse">

        </Tab>
      </Tabs>
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
          v-model="msg"
          class="form-control"
          :placeholder="$t('labels.msg')"
          rows="5"
        />
      </div>
      <!-- Result area or use v-html -->
      <div v-if="result" class="resultbox" v-html="result">
      </div>
    </div>
  </div>
</template>

<script>

import Tabs from '@/components/inputs/Tabs.vue'
import Tab from '@/components/inputs/Tab.vue'

export default {

  name: "TextTrick",

  components: {
      Tabs, Tab 
  },

  data() {
    return {
      result: "",
      errormsg: "",
      msg: "",
      // For chunk
      chunksize: 5,
      chk: false,
      upper: false,
      dir: "H",
    };
  },

  methods: {

    chunk: function () {
      // Reset
      this.result = "";
      this.errormsg = "";

      // Check input
      if (!this.msg) {
        this.errormsg = "No input";
        return;
      }

      // Replace whitespace with nothing if needed
      let cleantxt = this.msg;
      if (this.chk) {
        cleantxt = cleantxt.replace(/\s/g, "");
      }
      if (this.upper) {
        cleantxt = cleantxt.toUpperCase();
      }

      // Chunk txt
      this.result += "<b>Chunk size " + this.chunksize.toString() + "</b><br>";
      let h = cleantxt;
      if (this.dir == "H") {
        // Horizontal direction
        while (h.length > 0) {
          this.result += h.slice(0, this.chunksize) + "<BR>";
          h = h.slice(this.chunksize);
        }
      } else {
        // Vertical direction
        let a = new Array(this.chunksize).fill("");
        for (let j = 0; j < h.length; j++) {
          a[j % this.chunksize] += h[j];
        }
        for (let j = 0; j < this.chunksize; j++) {
          this.result += a[j] + "<BR>";
        }
      }
    },

  },
};

</script>

<style scoped>
</style>
