<template>

  <header class="page-header">
    <h1>{{ $t('resistor.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('resistor.long')" />
      </VCard>
      <VCard :title="$t('labels.input')">
        <div class="form-horizontal">
          <label>{{ $t('resistor.band') }} 1 </label>
          <vd-color
            v-model:color="band1"
            @update:color="calcResistance"
          />
        </div>
        <div class="form-horizontal">
          <label>{{ $t('resistor.band') }} 2 </label>
          <vd-color
            v-model:color="band2"
            @update:color="calcResistance"
          />
        </div>
        <div class="form-horizontal">
          <label>{{ $t('resistor.band') }} 3 </label>
          <vd-color
            v-model:color="band3"
            @update:color="calcResistance"
          />
        </div>
        <div class="form-horizontal">
          <label>{{ $t('resistor.mult') }}</label>
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
        <div class="button-row">
          <v-calculate @calculate="calcResistance" id="calc"></v-calculate>
        </div>
        <p
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
        </p>
      </VCard>
      <VCard :title="$t('labels.result')">
        <div
          v-if="result"
          class="resultbox"
          v-html="result"
        />
      </VCard>
    </div>
  </div>
</template>

<script>

import VdColor from '@/components/generic/VdColor.vue'
import VCard from '@/components/generic/VCard.vue'
import VCalculate from '@/components/generic/VCalculate.vue'

export default {

  name: 'Resistor',

  components: {
    VdColor,VCard,
    VCalculate
  },

  // Data include variables to dynamically set appearnce and labels
  data: function () {
    return {
      message: "",
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
      this.result = this.$t('resistor.res');
      this.errormsg = "";

      let value = (parseInt(this.band1) * 100 + parseInt(this.band2) * 10 + parseInt(this.band3)) * (10 ** this.mult);

      this.result += "<br>"+ value + "Ω<br>"
      this.result += (value/1000).toFixed(4) + "kΩ<br>"
      this.result += (value/1000000).toFixed(4) + "MΩ"
    }

  },
}
</script>
