<!-- App.vue -->
<template>
  <!-- Use a wrapper that strictly touches the edges -->
  <div class="app-wrapper">
    <VMenu :items="menuItems">
      <template #persistent-left>
        <router-link
          to="/"
          custom
          v-slot="{ navigate }"
        >
          <div class="brand" @click="navigate" role="link">
            <img src="/icons/GCTools2.png">
          </div>
        </router-link>
      </template>
      <template #persistent-right>
         <div class="header-actions">
          <div class="locale-switcher" v-click-outside="() => isLocaleDropdownOpen = false">
            <button class="locale-trigger" @click="isLocaleDropdownOpen = !isDropdownOpen">
              <span>{{ selectedLocale?.flag }}</span>
              <!-- Accessing locale.value (or just locale in template) -->
              <span class="lang-code">{{ locale.toUpperCase() }}</span>
            </button>

            <div v-if="isLocaleDropdownOpen" class="locale-dropdown">
              <div 
                v-for="loc in locales" 
                :key="loc.value" 
                class="locale-option"
                :class="{ 'is-selected': locale === loc.value }"
                @click="changeLocale(loc.value)"
              >
                <span>{{ loc.flag }}</span>
                <span>{{ loc.label }}</span>
              </div>
            </div>
          </div>
          <router-link
            to="/alltools"
            custom
            v-slot="{ navigate }"
          >
            <button class="search-btn" @click="navigate" role="link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </router-link>
         </div>
      </template>
    </VMenu>

    <main class="content">

      <!-- Container is now truly full-width -->
      <div class="container">

        <!-- The GC Tools menu-->
        <router-view /> 
        
      </div>
    </main>
  </div>
</template>

<script setup>

import { ref, reactive, computed } from 'vue';
import VMenu from '@/components/generic/VMenu.vue';
import VCard from '@/components/generic/VCard.vue';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const currentLocale = ref('en'); // Default to English
const isLocaleDropdownOpen = ref(false);

const locales = [
  { label: 'English', value: 'en', flag: '🇬🇧' },
  { label: 'Nederlands', value: 'nl', flag: '🇳🇱' }
];

const selectedLocale = computed(() => 
  locales.find(l => l.value === locale.value)
);

const changeLocale = (val) => {
  locale.value = val;
  isLocaleDropdownOpen.value = false;
};

const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => { if (!(el === event.target || el.contains(event.target))) binding.value(); };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) { document.removeEventListener("click", el.clickOutsideEvent); },
};

const menuItems = ref([
  { label: t('menu.coordinates'), children: [
    { label: t('convert.title'), to: '/convert' }, 
    { label: t('project.title'), to: '/project' }, 
    { label: t('mapmaker.title'), to: '/mapmaker' }, 
    { label: t('incomplete.title'), to: '/incomplete' }, 
    { label: t('lines.title'), to: '/lines' }, 
    { label: t('triangles.title'), to: '/triangles' }, 
    { label: t('circles.title'), to: '/circles' }, 
    { label: t('antipode.title'), to: '/antipode' }, 
    { label: t('plotcoord.title'), to: '/plotcoord' }, 
    { label: t('triangulation.title'), to: '/triangulation' }, 
    { label: t('revwherigo.title'), to: '/revwherigo' }
  ] },
  { label: t('menu.texttools'), children: [

    { label: t('tryanswers.title'), to: '/tryanswers' },
    { label: t('wordvalue.title'), to: '/wordvalue' },
    { label: t('charcodes.title'), to: '/charcodes' },
    { label: t('analtxt.title'), to: '/analtxt' },
    { label: t('texttonum.title'), to: '/texttonum' },
    { label: t('keyboards.title'), to: '/keyboards' },
    { label: t('texttoss.title'), to: '/texttoss' },
    { label: t('piglatin.title'), to: '/piglatin' },
    { label: t('numerology.title'), to: '/numerology' },
    { label: t('textchunks.title'), to: '/textchunks' }
  ] },
  { label: t('menu.codes'), children: [
    { label: t('ciphers.title'), to: '/ciphers' },
    { label: t('rotciphers.title'), to: '/rotciphers' },
    { label: t('substcipher.title'), to: '/substcipher' },
    { label: t('freqanal.title'), to: '/freqanal' },
    { label: t('codebook.title'), to: '/codebook' },
    { label: t('segment.title'), to: '/segment' },
    { label: t('morsecode.title'), to: '/morsecode' },
    { label: t('resistor.title'), to: '/resistor' },
    { label: t('vanitycode.title'), to: '/vanitycode' },
    { label: t('fonts.title'), to: '/fonts' },
    { label: t('decabit.title'), to: '/decabit' }
  ] },
  { label: t('menu.imagetools'), children: [
    { label: t('exifscanner.title'), to: '/exifscanner' },
    { label: t('colorpicker.title'), to: '/colorpicker' },
    { label: t('filltool.title'), to: '/filltool' },
    { label: t('pixeldata.title'), to: '/pixeldata' },
    { label: t('pixelbuild.title'), to: '/pixelbuild' },
    { label: t('imagetransform.title'), to: '/imagetransform' },
    { label: t('textextractor.title'), to: '/textextractor' },
    { label: t('bitplane.title'), to: '/bitplane' },
    { label: t('dataappended.title'), to: '/dataappended' },
    { label: t('pngchunk.title'), to: '/pngchunk' },
    { label: t('barcode.title'), to: '/barcode' }
  ] },
  { label: t('menu.mathtools'), children: [
    { label: t('baseconv.title'), to: '/baseconv' },
    { label: t('digits.title'), to: '/digits' },
    { label: t('primes.title'), to: '/primes' },
    { label: t('romans.title'), to: '/romans' },
    { label: t('fibonacci.title'), to: '/fibonacci' },
    { label: t('gcdandlcm.title'), to: '/gcdandlcm' },
    { label: t('formulasolver.title'), to: '/formulasolver' },
    { label: t('numberprop.title'), to: '/numberprop' },
    { label: t('bignumbers.title'), to: '/bignumbers' },
    { label: t('sequences.title'), to: '/sequences' },
    { label: t('combinations.title'), to: '/combinations' },
    { label: t('equations.title'), to: '/equations' },
    { label: t('nimbers.title'), to: '/nimbers' }
  ] },
  { label: t('menu.comptools'), children: [
    { label: t('bintotext.title'), to: '/bintotext' },
    { label: t('bcd.title'), to: '/bcd' },
    { label: t('encryption.title'), to: '/encryption' },
    { label: t('hashes.title'), to: '/hashes' },
    { label: t('brainfuck.title'), to: '/brainfuck' },
    { label: t('cow.title'), to: '/cow' },
    { label: t('beatnik.title'), to: '/beatnik' },
    { label: t('deadfish.title'), to: '/deadfish' },
    { label: t('duckspeak.title'), to: '/duckspeak' },
    { label: t('checksum.title'), to: '/checksum' },
    { label: t('truthtable.title'), to: '/truthtable' },
    { label: t('passwordgen.title'), to: '/passwordgen' }
  ] },
  { label: t('menu.games'), children: [
    { label: t('sudokusolv.title'), to: '/sudokusolv' },
    { label: t('mmsolver.title'), to: '/mmsolver' },
    { label: t('wordsearch.title'), to: '/wordsearch' },
    { label: t('dictsearch.title'), to: '/dictsearch' },
    { label: t('anagrams.title'), to: '/anagrams' },
    { label: t('wordle.title'), to: '/wordle' },
    { label: t('cryptosolver.title'), to: '/cryptosolver' },
    { label: t('gameoflife.title'), to: '/gameoflife' }
  ] },
  { label: t('menu.other'), children: [
    { label: t('printlog.title'), to: '/printlog' },
    { label: t('genlog.title'), to: '/genlog' },
    { label: t('htmlparser.title'), to: '/htmlparser' },
    { label: t('unitconvertor.title'), to: '/unitconvertor' },
    { label: t('datecalc.title'), to: '/datecalc' },
    { label: t('randomizer.title'), to: '/randomizer' },
    { label: t('periodictable.title'), to: '/periodictable' },
    { label: t('countries.title'), to: '/countries' },
    { label: t('usastates.title'), to: '/usastates' },
    { label: t('regions.title'), to: '/regions' },
    { label: t('dnacode.title'), to: '/dnacode' },
    { label: t('booksearch.title'), to: '/booksearch' }
  ] },
  { label: t('menu.help'), children: [
    { label: t('menu.howto'), to: '/howto' },
    { label: t('labels.help') + ' ' + t('menu.coordinates'), to: '/helpcoord' },
    { label: t('labels.help') + ' ' + t('menu.texttools'), to: '/helptext' },
    { label: t('labels.help') + ' ' + t('menu.codes'), to: '/helpcodes' },
    { label: t('labels.help') + ' ' + t('menu.imagetools'), to: '/helpimage' },
    { label: t('labels.help') + ' ' + t('menu.mathtools'), to: '/helpmath' },
    { label: t('labels.help') + ' ' + t('menu.comptools'), to: '/helpcomp' },
    { label: t('labels.help') + ' ' + t('menu.games'), to: '/helpgames' },
    { label: t('labels.help') + ' ' + t('menu.other'), to: '/helpother' },
    { label: t('menu.about') , to: '/about' }
  ] }
]);

</script>

<style>

/* Utility classes for spacing and padding */
.mb-0 { margin-bottom: 0rem;}
.ml-0 { margin-right: 0rem;}
.me-0 { margin-right: 0rem}
.mt-0 { margin-top: 0rem}
.mx-0 { margin-right: 1rem; margin-left: 0rem;}
.mb-2 { margin-bottom: 1rem; }
.mx-2 { margin-right: 1rem; margin-left: 1rem;}
.ms-2 { margin-left: 1rem; }
.me-2 { margin-right: 1rem; }
.mt-2 { margin-top: 1rem; }
.mb-4 { margin-bottom: 2rem; }
.mx-4 { margin-right: 2rem; margin-left: 2rem;}
.ms-4 { margin-left: 2rem; }
.me-4 { margin-right: 2rem; }
.mt-4 { margin-top: 2rem; }
.sm-size { width: 2rem}
.md-size { width: 4rem}
.lg-size { width: 6rem}
.xl-size { width: 8rem}

/* Headers setting *?


/* =========================================
   1. THEME VARIABLES & GLOBAL RESET
   ========================================= */
:root {
  --primary-green: #6b8e23;   /* Olive Drab */
  --primary-dark: #55721c;    /* Darker Olive */
  --accent-green: #84a98c;    /* Sage Green */
  --soft-green: #f0f4ed;      /* Mint/Soft Gray-Green */
  --bg-color: #fafcf9;        /* Off-white background */
  --text-dark: #2f4f4f;       /* Dark Slate Gray */
  --white: #ffffff;
  --border-color: #d8e2d7;    /* Subtle green-gray border */
  --error-red: #c05d4d;       /* Muted Terracotta */
  --error-bg: #fdf2f0;        /* Very soft red/pink */
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* A bit of everything */
h4 {
  color: var(--primary-green);
  font-weight: 600;
  font-size: 1.2rem;
}

hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--border-color), transparent);
  margin: 2rem 0;
  opacity: 0.8;
}


/* Fix for padding/margins that cause scrollbars or gaps */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  min-height: 100%;
  background-color: var(--bg-color);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--text-dark);
  overflow-x: clip;
}

/* Main wrapper for the entire app VMenu on top and container underneath*/
.app-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* =========================================
   2. LAYOUT & CONTAINER
   ========================================= */
.container {
  width: 100%;
  max-width: 100%;
  padding-top: 1rem; /* Side breathing room */
  padding-right: 2rem; /* Side breathing room */
  padding-left: 2rem; /* Side breathing room */
}

@media (max-width: 600px) {
  .container {
    padding-right: 1rem;
    padding-left: 1rem;
  }
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  margin: 0rem;
  padding-left: 1rem;
  color: var(--primary-green);
  font-size: 2.2rem;
  letter-spacing: -0.5px;
}

.card-grid {
  display: grid;
  /* Adjust minmax to control when cards jump to a new column */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: 1rem;
  width: 100%;
}

.card-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Matches the grid gap for a uniform look */
  grid-column: span 1; /* Ensures it only takes up one grid cell */
} 

/* =========================================
   3. Form layouts
   ========================================= */

/* */
/* Organize some elements in a greyed retangle */
/* */

.input-box {
  flex: 1;
  min-width: 160px;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.input-box-title {
  display: block;
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--primary-green);
  margin-bottom: 10px;
  text-align: center;
  text-transform: uppercase;
}

@media (max-width: 400px) {
  .input-box {
    min-width: 100%; /* Forces single column stacking earlier */
  }
}

/* */
/* Put label next to the field on one row */
/* */

.form-horizontal {
  display: flex;
  align-items: flex-start; /* Aligns items to the top if the label wraps */
  margin-bottom: 15px;
  gap: 10px; /* Space between label and input */
}

/* Fixed-width label that wraps text */
.form-horizontal label {
  flex: 0 1 150px;       /* Do not grow, do not shrink, fixed at 150px */
  width: 150px;          /* Ensure width is respected */
  word-wrap: break-word; /* Ensures long words wrap if necessary */
  line-height: 1.2;      /* Optional: improves readability when wrapping */
}

/* Stretchable input control */
.form-horizontal input, 
.form-horizontal select, 
.form-horizontal textarea,
.form-horizontal .custom-select-container {
  flex: 1;               /* Stretches to fill the remaining space */
  min-width: 0;          /* Prevents input from overflowing flex container */
  box-sizing: border-box; 
}

@media (max-width: 680px) {
  .form-horizontal {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px; /* Tighten the space between label and input */
  }

  .form-horizontal label {
    /* KEY FIX: Reset flex so 150px height doesn't apply */
    flex: none !important; 
    width: 100% !important;
    height: auto !important;
    margin-bottom: 2px;
    /* Optional: reduce font size slightly for mobile if needed */
    font-size: 0.85rem; 
  }

  .form-horizontal input, 
  .form-horizontal select, 
  .form-horizontal textarea {
    /* KEY FIX: Ensure it doesn't try to grow vertically */
    flex: none !important; 
    width: 100% !important;
    height: 45px; /* Set a standard touch-friendly height */
    min-height: 45px;
  }

  /* Textareas should still be allowed to be tall */
  .form-horizontal textarea {
    height: auto;
    min-height: 100px;
  }

  .form-horizontal .range-input {
    height: 6px;
    min-height: 6px;
  }

}

/* */
/* Put fields in a row with labels on top */
/* */

.form-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.form-row label {
  width: 80px;
  flex: 0 1 120px;
  margin-bottom: 6px;
}

.form-row input {
  width: 150px;
  margin-bottom: 6px;
}

.form-row .custom-select-container {
  width: 200px;
  margin-bottom: 6px;
}

@media (max-width: 400px) {
  .form-row {
    flex-wrap: wrap !important;
  }
  .form-row .input-wrapper {
    flex: 0 0 100% !important;
  }
}

.form-group-vertical {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* =========================================
   4. INPUT ELEMENTS (Text, Area, Range, etc)
   ========================================= */

label {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--accent-green);
}

input[type="text"],
input[type="date"],
input[type="number"],
textarea {
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-size: 1rem;
  font-family: inherit;
  width: 100%;
  background: var(--white);
  transition: all 0.2s ease;
}

input[type="color"] {
  border-radius: 8px;
  border: 1px solid var(--border-color);
  width: 100%;
  transition: all 0.2s ease;
}

/* The Green Focus State */
input:focus, 
textarea:focus, 
select:focus,
.custom-select-trigger.is-active {
  outline: none;
  border-color: var(--primary-green) !important;
  box-shadow: 0 0 0 4px rgba(107, 142, 35, 0.12) !important;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

/* Green Range Input */
.range-input {
  appearance: none;
  height: 6px;
  background: var(--soft-green);
  border-radius: 5px;
  accent-color: var(--primary-green);
}


/* =========================================
   5. CUSTOM SELECT (No-Blue-Highlight)
   ========================================= */
.custom-select-container {
  position: relative;
  width: 100%;
}

.custom-select-trigger {
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--white);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  transition: all 0.2s;
}

.custom-options-list {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  z-index: 1000;
  overflow: hidden;
}

.custom-option {
  padding: 0.8rem 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  transition: all 0.2s;
}

/* Custom Green Hover (Replacing the native blue) */
.custom-option:hover {
  background-color: var(--soft-green);
  color: var(--primary-green);
}

.custom-option.selected {
  background-color: var(--primary-green);
  color: var(--white);
}

/* =========================================
   6. CUSTOM CHECKBOXES & RADIOS
   ========================================= */
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
}

.checkbox-container input { display: none; }

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--accent-green);
  border-radius: 5px;
  position: relative;
  transition: 0.2s;
}

.checkbox-container input:checked + .checkmark {
  background-color: var(--primary-green);
  border-color: var(--primary-green);
}

.checkbox-container input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.radio-options { display: flex; gap: 12px; margin-top: 4px; }
.radio-options-vertical { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
.radio-item { display: flex; align-items: center; gap: 5px; cursor: pointer; }
.radio-item input { display: none; }
.radio-mark { width: 16px; height: 16px; border: 2px solid var(--accent-green); border-radius: 50%; }
.radio-item input:checked + .radio-mark { border-width: 5px; border-color: var(--primary-green); }

/* 1. Change the cursor and fade the entire item when disabled */
.radio-item:has(input:disabled) {
  cursor: not-allowed;
  opacity: 0.6;
  color: #888; /* Optional: grey out the text */
}

/* 2. Change the border color of the radio circle when disabled */
.radio-item input:disabled + .radio-mark {
  border-color: #ccc;
  background-color: #f5f5f5; /* Optional: light inner fill */
}

/* 3. Style for a radio that is BOTH disabled AND checked */
.radio-item input:disabled:checked + .radio-mark {
  border-color: #bbb;
  border-width: 5px;
}

/* =========================================
   7. BUTTON SYSTEM
   ========================================= */
.button-row {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.button-row-icons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.button-row-icons .btn {
  padding: 0.5rem 0.2rem 0.5rem 0.2rem;
  width: 70px;
}

@media (max-width: 680px) {
  .button-row {
    flex-direction: column; /* Stack vertically */
    width: 100%;
  }

  .button-row .btn {
    width: 100%; /* Make buttons full width for easier tapping */
    justify-content: center; /* Center text inside full-width button */
  }
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:active { transform: scale(0.96); }

.btn-primary {
  background-color: var(--primary-green);
  color: white;
}
.btn-primary:hover {
  background-color: var(--primary-dark);
  box-shadow: 0 4px 12px rgba(107, 142, 35, 0.2);
}

.btn-secondary {
  background-color: transparent;
  border-color: var(--primary-green);
  color: var(--primary-green);
}
.btn-secondary:hover {
  background-color: var(--soft-green);
}

.btn-ghost {
  background-color: var(--soft-green);
  color: var(--text-dark);
}
.btn-ghost:hover {
  background-color: var(--border-color);
}

/* =========================================
   8. COMPONENT SPECIFIC (BRand, header, local, search )
   ========================================= */
.brand { 
  color: var(--primary-green); 
  font-size: 1.3rem;
  margin-left: -10px;
  cursor: pointer; 
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.locale-switcher {
  position: relative;
}

.locale-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--soft-green);
  border: 1px solid transparent;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  color: var(--primary-green);
  font-weight: 700;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.locale-trigger:hover, .locale-trigger.is-active {
  background: var(--white);
  border-color: var(--primary-green);
  box-shadow: 0 2px 8px rgba(107, 142, 35, 0.1);
}

.lang-code {
  letter-spacing: 0.5px;
}

/* Dropdown Positioning */
.locale-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  min-width: 150px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  z-index: 2000;
  overflow: hidden;
}

.locale-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  color: var(--text-dark);
}

.locale-option:hover {
  background-color: var(--soft-green);
  color: var(--primary-green);
}

.locale-option.is-selected {
  background-color: var(--primary-green);
  color: var(--white);
  font-weight: 600;
}

.option-flag {
  font-size: 1.1rem;
}

/* Ensure the search button scales nicely next to it */
.search-btn {
  background: none; 
  border: none; 
  color: var(--primary-green); 
  cursor: pointer;
  padding: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.search-btn:hover {
  background: var(--soft-green);
}

/* .search-btn { 
  background: none; 
  border: none; 
  color: var(--primary-green); 
  cursor: pointer;
  padding: 8px;
  display: flex;
} */

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.25s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }

/* =========================================
   9. RELAXED GREEN TABLE STYLING
   ========================================= */

/* Responsive wrapper to prevent layout break on mobile */
.table-responsive {
  display: block;        /* Force it to behave like a block-level container */
  width: 100%;           /* Attempt to be full width */
  max-width: 100%;       /* STRICTLY prevent it from growing wider than its parent */
  overflow-x: auto;      /* Enable horizontal scroll */
  overflow-y: hidden;    /* Prevent vertical scroll interference */
  -webkit-overflow-scrolling: touch; /* Enables smooth "momentum" scrolling on iOS */
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.p-table {
  width: 100%;
  min-width: 400px;      /* IMPORTANT: Give the table a minimum width on mobile so it HAS to scroll */
  border-collapse: collapse;
  background-color: var(--white);
  text-align: left;
  font-size: 0.95rem;
}

/* Header Row */
.p-table thead th {
  background-color: var(--soft-green);
  color: var(--primary-dark);
  font-weight: 700;
  padding: 0.7rem;
  border-bottom: 2px solid var(--accent-green);
  text-align: center;
  white-space: nowrap;
}

/* Table Body Cells */
.p-table td {
  padding: 0.5rem;
  border-bottom: 1px solid var(--soft-green);
  color: var(--text-dark);
  vertical-align: middle;
  text-align: center;
}

/* Zebra Striping */
.p-table tbody tr:nth-child(even) {
  background-color: rgba(240, 244, 237, 0.5); /* Semi-transparent Soft Green */
}

/* Hover State */
.p-table tbody tr:hover {
  background-color: var(--soft-green);
  transition: background-color 0.2s ease;
}

.p-table-small {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--white);
  text-align: left;
  /* 1. Smaller font size */
  font-size: 0.8rem; 
}

/* Override min-width for small tables so they can fit in narrow cards */
.p-table-small-wrapper {
  display: block;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.p-table-small thead th {
  background-color: var(--soft-green);
  color: var(--primary-dark);
  font-weight: 700;
  /* 2. Tightened padding */
  padding: 0.4rem 0.5rem; 
  border-bottom: 2px solid var(--accent-green);
  text-align: center;
  white-space: nowrap;
}

.p-table-small td {
  /* 3. Tightened padding for rows */
  padding: 0.3rem 0.5rem; 
  border-bottom: 1px solid var(--soft-green);
  color: var(--text-dark);
  vertical-align: middle;
  text-align: center;
}

/* 4. Zebra striping remains the same for consistency */
.p-table-small tbody tr:nth-child(even) {
  background-color: rgba(240, 244, 237, 0.5);
}

/* 5. Optional: make status pills inside small tables even tinier */
.p-table-small .status-pill {
  padding: 0.1rem 0.5rem;
  font-size: 0.7rem;
}

.p-table-small th:first-child,
.p-table-small td:first-child {
  width: 5px;        /* Set your preferred width */
  min-width: 80px;
  max-width: 100px;
  text-align: left;    /* Labels often look better left-aligned */
  padding-left: 0.5rem;
}

/* Status Pill inside table (Optional Helper) */
.status-pill {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-active {
  background-color: var(--primary-green);
  color: white;
}

.status-pending {
  background-color: var(--accent-green);
  color: white;
}

/* =========================================
   10. ERROR STYLES
   ========================================= */

/* Error Message Styling */
.errormsg {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  background-color: var(--error-bg);
  color: var(--error-red);
  border: 1px solid rgba(192, 93, 77, 0.2);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 0rem;
}

.errormsg::before {
  content: "⚠"; /* Icon-free warning symbol */
  font-size: 1.1rem;
  margin-right: 0.5rem;
}

/* Input Error State */
input.is-invalid {
  border-color: var(--error-red) !important;
}

input.is-invalid:focus {
  box-shadow: 0 0 0 4px rgba(192, 93, 77, 0.1) !important;
} 

/* =========================================
   11. LINK STYLING
   ========================================= */

/* --- Relaxed Green Link Styling --- */

a, .router-link-active {
  color: var(--primary-green);
  text-decoration: none;
  font-weight: 400;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

/* Hover State: Subtle background and a darker green */
a:hover {
  color: var(--primary-dark); /* #55721c */
  background-color: var(--soft-green);
  border-bottom: 1px solid var(--primary-green);
  border-radius: 4px 4px 0 0;
  padding: 0 2px; /* Prevents text from jumping when the border appears */
}

/* Focus state for accessibility (tab navigation) */
a:focus {
  outline: 2px solid var(--accent-green);
  outline-offset: 2px;
  border-radius: 4px;
}

/* --- Button-style Links --- */
/* Used for Call-to-Action links like "Export PDF" */
.btn-link {
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1.2rem;
  background-color: var(--primary-green);
  color: white !important; 
  border-radius: 8px;
  font-weight: 500;
  border: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-link:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(107, 142, 35, 0.2);
  border-bottom: none; /* Override the global border-bottom */
}   

  /* =========================================
  12. RELAXED GREEN CARD STYLING
  ========================================= */

.v-card {
  background: var(--white);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  /* height: fit-content allows the card to shrink/grow with content */
  height: fit-content;
  position: relative;
  display: flex;
  flex-direction: column;
}

.resultbox {
  border-left: 5px solid var(--primary-green);
  padding-left: 0.5rem;
  opacity: 65%;
}

.v-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Title Left, Toggle Right */
  padding: 1rem 1.5rem;
  background-color: var(--white);
  border-radius: 12px 12px 0 0;
  position: relative;
  z-index: 2; /* Ensures the header stays on top during animation */
}

.card-title {
  margin: 0;
  flex-grow: 1;
  /* Font styling is inherited from App.vue */
}

/* --- TOGGLE BUTTON STYLING --- */
.v-card-toggle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--primary-green);
  background: var(--soft-green);
  color: var(--primary-green);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  padding: 0;
  line-height: 1;
  margin-left: 12px;
}

.v-card-toggle:hover {
  background: var(--primary-green);
  color: var(--white);
}

.v-card-toggle.is-collapsed {
  background: var(--primary-green);
  color: var(--white);
  /* Rotates the '+' icon slightly for a dynamic feel */
  transform: rotate(180deg);
}

/* --- CARD BODY & OVERFLOW --- */
.v-card-body {
  padding: 0 1.5rem 1.5rem 1.5rem;
  /* overflow: visible allows absolute dropdowns to show outside the card */
  overflow: visible; 
}

@media (max-width: 600px) {
  .v-card-body {
  padding: 0 1rem 1rem 1rem;
  }
}

.v-card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block; /* Removes tiny bottom gap inherent to images */
  border-top-left-radius: 11px; /* 1px less than card to prevent border bleed */
  border-top-right-radius: 11px;
}

/* --- EXPAND/COLLAPSE TRANSITION --- */

/* During the animation, we force overflow: hidden so the slide looks clean */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease-out;
  max-height: 1200px; /* Large enough to accommodate form content */
  opacity: 1;
  overflow: hidden; 
}

/* Starting state for entering / Ending state for leaving */
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  overflow: hidden;
}


</style>