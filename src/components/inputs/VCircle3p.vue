<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container p-4">
          <div class="modal-header">
            <slot name="header">
              <h2>{{ $t('dialogc3p.title') }}</h2>
            </slot>
          </div>

          <div class="modal-body mt-2">
            <slot name="body">
              <v-coord
                v-model:coord="coordinate1"
                v-model:datum="selecteddatum1"
              >
                <template #label>
                  {{ $t('labels.point') }} 1
                </template>
              </v-coord>
              <v-coord
                v-model:coord="coordinate2"
                v-model:datum="selecteddatum2"
              >
                <template #label>
                  {{ $t('labels.point') }} 2
                </template>
              </v-coord>
              <v-coord
                v-model:coord="coordinate3"
                v-model:datum="selecteddatum3"
              >
                <template #label>
                  {{ $t('labels.point') }} 3
                </template>
              </v-coord>
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
                {{ $t('buttons.cancel') }}
              </button>
              <button
                class="btn"
                @click="closeModal()"
              >
                {{ $t('buttons.save') }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

import VCoord from '@/components/inputs/VCoord.vue';
import * as coords from '@/scripts/coords.js';

export default {

  name: "VCircle3p",

  props: {
    center: {
      type: String,
      required: true
    },
    datum: {
      type: String,
      required: true
    },
    radius: {
      type: Number,
      required: true
    }
  },

  components: {
    VCoord
  },
  
  emits: [
    'close',
    'update:center',
    'update:datum',	
    'update:radius'
  ],

  data() {
    return {
      coordinate1: "",
      selecteddatum1: "WGS84",
      coordinate2: "",
      selecteddatum2: "WGS84",
      coordinate3: "",
      selecteddatum3: "WGS84",
      error: false,
      errormsg: ""
    };
  },

  mounted: function() {

  },

  methods: {
    
    closeModal() {

      let coord1, coord2, coord3, gridcoord1, gridcoord2, gridcoord3;

      coords.convertCoordFromText(this.coordinate1, this.selecteddatum1, "WGS84")
          .then (data => {
            coord1 = data;
            return coords.convertCoordFromText(this.coordinate2, this.selecteddatum2, "WGS84");
          })
          .then (data => {
            coord2 = data;
            return coords.convertCoordFromText(this.coordinate3, this.selecteddatum3, "WGS84");
          })
          .then (data => {
            coord3 = data;
            return coords.convertCoordFromLatLon (coord1, "WGS84", "RD");
          })
          .then (data => {
            gridcoord1 = data;
            return coords.convertCoordFromLatLon (coord2, "WGS84", "RD");
          })
          .then (data => {
            gridcoord2 = data;
            return coords.convertCoordFromLatLon (coord3, "WGS84", "RD");
          })
          .then (data => {
            gridcoord3 = data;
            let d= 2*(gridcoord1.lon*(gridcoord2.lat - gridcoord3.lat) + gridcoord2.lon*(gridcoord3.lat - gridcoord1.lat) + gridcoord3.lon*(gridcoord1.lat - gridcoord2.lat));
            let center = {
              lon: ((gridcoord1.lon**2 + gridcoord1.lat**2)*(gridcoord2.lat - gridcoord3.lat) +
                  (gridcoord2.lon**2 + gridcoord2.lat**2)*(gridcoord3.lat - gridcoord1.lat) +
                  (gridcoord3.lon**2 + gridcoord3.lat**2)*(gridcoord1.lat - gridcoord2.lat))/d,
              lat: ((gridcoord1.lon**2 + gridcoord1.lat**2)*(gridcoord3.lon - gridcoord2.lon) +
                  (gridcoord2.lon**2 + gridcoord2.lat**2)*(gridcoord1.lon - gridcoord3.lon) +
                  (gridcoord3.lon**2 + gridcoord3.lat**2)*(gridcoord2.lon - gridcoord1.lon))/d
            };
            // Sent event to update the value of the associated input
            this.$emit ('update:center', center.lon.toFixed(0) + " " + center.lat.toFixed(0));
            this.$emit ('update:datum', "EPSG:28992");
            this.$emit ('update:radius', Math.sqrt((center.lon - gridcoord1.lon)**2 + (center.lat - gridcoord1.lat)**2).toFixed(2));
            // Close the modal window
            this.$emit ('close')

          })
          .catch (error => {
            this.error = true;
            this.errormsg = error;
          });

          // Calculate center and radius

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
