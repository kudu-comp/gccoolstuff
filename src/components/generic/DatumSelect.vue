<template>

  <div class="custom-select-container" v-click-outside="closeDropdown">
    <div 
      class="custom-select-trigger" 
      @click="isDropdownOpen = !isDropdownOpen" 
      :class="{ 'is-active': isDropdownOpen }"
    >
      {{ selectDatum }}
      <span class="chevron">▾</span>
    </div>
    <transition name="fade-slide">
      <div v-if="isDropdownOpen" class="custom-options-list">
        <div 
          v-for="option in datumOptions"
          class="custom-option" 
          :class="{ 
            'selected': datum === option.value,
            'is-disabled': option.disabled 
          }" 
          @click="$emit('update:datum', option.value)"
        >
          {{ option.label }}
          <span v-if="datum ===  option.value" class="check">✓</span>
        </div>
      </div>
    </transition>
  </div>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  datum: {
    type: String,
    required: true
  }
})

defineEmits(['update:datum'])

// Reference for auto-focusing the input
const isDropdownOpen = ref(false);

const selectDatum = computed(() =>  {

  // Check if categories exists and has items
    if (!datumOptions || datumOptions.length === 0) {
      return 'Loading...'; 
    }
    
    // Find the selected item
    const found = datumOptions.find(a => a.value === props.datum);
    isDropdownOpen.value = false;
    
    // Return the label if found, otherwise a default placeholder
    return found ? found.label : 'Select a datum';
  });

const datumOptions = [
  { label: 'WGS84', value: 'WGS84' },
  { label: 'NAD / North American Datum', value: 'EPSG:4269' },
  { label: 'UTM', value: 'UTM' },
  { label: 'MGRS / US Military Grid', value: 'MGRS' },
  
  { label: '--- National grids ---', disabled: true },
  { label: 'OSGB 1936 / British National Grid', value: 'EPSG:27700' },
  { label: 'OSGB 1936 with zones', value: 'OSGB' },
  { label: 'Gauss-Kruger (DHDN)', value: 'EPSG:5680' },
  { label: 'Dutch grid / RD', value: 'EPSG:28992' },
  { label: 'RGF93 / Lambert-93 France', value: 'EPSG:2154' },
  { label: 'Belgian Lambert 2008', value: 'EPSG:3812' },
  { label: 'Pseudo Mercator for online maps', value: 'EPSG:3857' },
  
  { label: '--- Hashes and other stuff ---', disabled: true },
  { label: 'Maidenhead / QTH locator', value: 'QTH' },
  { label: 'Open location code', value: 'OLC' },
  { label: 'Geohash', value: 'Geohash' },
  { label: 'Mapcode local', value: 'MapcodeL' },
  { label: 'Mapcode international', value: 'MapcodeI' },
  { label: 'Geohash 36', value: 'Geohash36' },
  { label: 'Natural Area Code', value: 'NAC' },
  { label: 'Geo3x3', value: 'Geo3x3' },
  { label: 'C-squares', value: 'Csquare' },
  { label: 'Geohex', value: 'Geohex' },
  
  { label: '--- Define your own ---', disabled: true },
  { label: 'Proj4js definition', value: 'Proj4js' }
]

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>