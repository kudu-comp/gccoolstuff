<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      <div class="text-center">
        {{ $t('resistorcode.title') }}
      </div>
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('resistorcode.long')"
      />
      <div class="row mb-2">
        <div class="form-label sm-size">
          {{ $t('resistorcode.band') }} 1
        </div>
        <vd-color
          v-model:color="band1"
          @update:color="calcResistance"
        />
      </div>
      <div class="row mb-2">
        <div class="form-label sm-size">
          {{ $t('resistorcode.band') }} 2
        </div>
        <vd-color
          v-model:color="band2"
          @update:color="calcResistance"
        />
      </div>
      <div class="row mb-2">
        <div class="form-label sm-size">
          {{ $t('resistorcode.band') }} 3
        </div>
        <vd-color
          v-model:color="band3"
          @update:color="calcResistance"
        />
      </div>
      <div class="row mb-2">
        <div class="form-label sm-size">
          {{ $t('resistorcode.mult') }} 3
        </div>
        <vd-color
          v-model:color="mult"
          @update:color="calcResistance"
        >
          <template #addcolors>
            <option
              value="-1"
              style="background-color: gold; color: black"
            >
              Gold
            </option>
            <option
              value="-2"
              style="background-color: silver; color: black"
            >
              Silver
            </option>
          </template>
        </vd-color>
      </div>
      <v-calculate @calculate="calcResistance" id="calc"></v-calculate>
      <p
        v-show="error"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <div
        v-if="result"
        class="resultbox"
        v-html="result"
      />
    </div>
  </div>
</template>

<script>

import VdColor from '@/components/inputs/VdColor.vue'
import VCalculate from '@/components/inputs/VCalculate.vue'

export default {

  name: 'ResistorCode',

  components: {
    VdColor,
    VCalculate
  },

  // Data include variables to dynamically set appearnce and labels
  data: function () {
    return {
      message: "",
      translatedmessage: "",
      error: false,
      errormsg: "",
      result: "",
      band1: 0,
      band2: 0,
      band3: 0,
      mult: 0,
    }
  },

  mounted: function() {
    // No actions
  },

  methods: {

    // Get elements from name
    calcResistance: function() {

      // Reset flags
      this.error = false;
      this.result = this.$t('resistorcode.res');

      let value = (parseInt(this.band1) * 100 + parseInt(this.band2) * 10 + parseInt(this.band3)) * (10 ** this.mult);

      this.result += "<br>"+ value + "Ω<br>"
      this.result += (value/1000).toFixed(4) + "kΩ<br>"
      this.result += (value/1000000).toFixed(4) + "MΩ"
    }

  },
}
</script>
