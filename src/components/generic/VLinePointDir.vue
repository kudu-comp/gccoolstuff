<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container p-4">
          <div class="modal-header">
            <slot name="header">
              <h2>{{ t('linepointdir.title') }}</h2>
            </slot>
          </div>

          <div class="modal-body mt-2">
            <slot name="body">
              <CoordInput
                v-model:coord="coorCoordInputdinate1"
                v-model:datum="selecteddatum1"
              >
                <template #label>
                  {{ t('linepointdir.start') }}
                </template>
              </CoordInput>
              <AngleSelect
                v-model:angle="angle"
                v-model:unit="angleunit"
              />
              <DistanceSelect
                v-model:dist="dist"
                v-model:unit="unit"
              />
            </slot>
          </div>

          <div class="modal-footer mt-2">
            <p
              v-show="error"
              class="errormsg me-2"
            >
              {{ errormsg }}
            </p>
            <slot name="footer">
              <button
                class="btn me-2"
                @click="$emit('close')"
              >
                {{ t('buttons.cancel') }}
              </button>
              <button
                class="btn"
                @click="closeModal()"
              >
                {{ t('buttons.save') }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

import CoordInput from '@/components/generic/CoordInput.vue';
import AngleSelect from '@/components/generic/AngleSelect.vue';
import DistanceSelect from '@/components/generic/DistanceSelect.vue';

import * as coords from '@/scripts/coords.js';

export default {

  name: "VLinePointDir",

  props: {
    lat1: {
      type: Number,
      required: true
    },
    lon1: {
      type: Number,
      required: true
    },
    lat2: {
      type: Number,
      required: true
    },
    lon2: {
      type: Number,
      required: true
    },
  },

  components: {
    CoordInput,
    AngleSelect,
    DistanceSelect
  },
  
  emits: [
    'close',
    'update:lon1',
    'update:lat1',
    'update:lon2',
    'update:lat2'
  ],

  data() {
    return {
      coordinate1: "",
      selecteddatum1: "WGS84",
      angle: 0,
      angleunit: 0.0174532925, // Degrees
      dist: 0,
      unit: 1, // Meters
      errormsg: ""
    };
  },

  mounted: function() {

  },

  methods: {
    
    closeModal() {

      let gridcoord1, gridcoord2;

      coords.convertCoordFromText(this.coordinate1, this.selecteddatum1, "RD")
        .then (data => {
          gridcoord1 = data;
          // Calculate next point
          let length = this.dist === 0 ? 10000 : this.dist;
          let angle = this.angle * this.angleunit;
          let gridcoord2 =
              { lat: gridcoord1.lat + (length * this.unit) * Math.cos(angle),
                lon: gridcoord1.lon + (length * this.unit) * Math.sin(angle) };
          // Sent event to update the value of the associated input
          this.$emit ('update:lon1', gridcoord1.lon );
          this.$emit ('update:lat1', gridcoord1.lat );
          this.$emit ('update:lon2', gridcoord2.lon );
          this.$emit ('update:lat2', gridcoord2.lat );
          // Close the modal window
          this.$emit ('close')

        })
        .catch (error => {
          this.errormsg = error;
        });

    },

  }
};

</script>

<style scoped>
.modal-mask {
  width: 670px;
  height: 285px;
}
</style>
