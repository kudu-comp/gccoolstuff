<template>

  <header class="page-header">
    <h1>{{ $t('fonts.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="$t('labels.intro')">
      <div v-html="$t('fonts.long')" />
    </VCard>
    <VCard :title="$t('labels.settings')">
      <div class="form-horizontal">
        <CustomDropdown 
          v-model="styleObject.fontFamily" 
          :options="fontdef" 
          :title="$t('fonts.selfont')"
        />
      </div>
      <div class="form-horizontal">
        <label>{{ $t('fonts.fontsize') }}</label>
        <input type="text" v-model="styleObject.fontSize">
      </div>
      <div class="form-horizontal">
        <label>{{ $t('fonts.selcolor') }}</label>
        <input id="ofc" v-model="styleObject.color" type="color" class="mb-2 sm-size me-2"/>
      </div>
      <div class="form-horizontal">
        <label>{{ $t('fonts.lineheight') }}</label>
        <input type="number" v-model="styleObject.lineHeight">
      </div>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="$t('labels.input')">
      <div class="row mb-2">
        <textarea
          id="message"
          ref="messageRef"
          v-model="message"
          :placeholder="$t('labels.message')"
          rows="5"
        />
      </div>
      <p
        v-show="errormsg"
        class="errormsg mt-2"
      >
        {{ errormsg }}
      </p>
    </VCard>
    <VCard :title="$t('labels.result')">
      <textarea
        readonly
        v-model="message"
        spellcheck="false"
        :style="styleObject"
        rows="5"
      />
    </VCard>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fontdefs } from '@/scripts/fontspecials.js'
import VCard from '@/components/generic/VCard.vue'
import CustomDropdown from '@/components/generic/CustomDropdown.vue'

// Define Props
const props = defineProps({
  font: {
    type: String,
    required: false,
    default: "atbash"
  }
})

// Hooks
const route = useRoute()

// --- State ---
const message = ref("ABCDEFGHI\nJKLMNOPQR\nSTUVWXYZ\n0123456789")
const errormsg = ref("")
const isDropdownOpen = ref(false)
const fontdef = ref([])

// Style object for dynamic binding
const styleObject = reactive({
  fontFamily: 'Antiker',
  fontSize: '24px',
  color: 'black',
  lineHeight: 1,
  backgroundColor: '#ffffff',
  borderColor: '#09776E',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderRadius: '5px'
})

// Template Ref for focus
const messageRef = ref(null)

// --- Lifecycle ---

onMounted(() => {

  fontdef.value = fontdefs.map ( f => ({ value: f.id, label: f.font}));
  console.log(fontdef.value)
  
  // Focus the textarea
  if (messageRef.value) {
    messageRef.value.focus()
  }

  // Set initial font from route params if available
  if (route.params.font) {
    styleObject.fontFamily = route.params.font
  }
})

</script>

<style scoped>

@font-face { font-family: Antiker;    src: url('@/assets/fonts/Ancient-Black.woff'); }
@font-face { font-family: Applebeech; src: url('@/assets/fonts/AppleBeech.woff'); }
@font-face { font-family: Aurebesh;   src: url('@/assets/fonts/Aurebesh.otf'); }
@font-face { font-family: Barbook;    src: url('@/assets/fonts/BarBook.woff'); }
@font-face { font-family: Betamaze;   src: url('@/assets/fonts/BetaMaze-0-180.woff'); }
@font-face { font-family: Braille;    src: url('@/assets/fonts/Braille.woff'); }
@font-face { font-family: Builder;    src: url('@/assets/fonts/builder.ttf'); }
@font-face { font-family: Centauri;   src: url('@/assets/fonts/Centauri.woff'); }
@font-face { font-family: Code128;    src: url('@/assets/fonts/Code128.woff'); }
@font-face { font-family: Code39;     src: url('@/assets/fonts/Code39Regular.woff'); }
@font-face { font-family: Cirth;      src: url('@/assets/fonts/CirthEreborCaps.woff'); }
@font-face { font-family: Daedra;     src: url('@/assets/fonts/Daedra.otf'); }
@font-face { font-family: Dagger;     src: url('@/assets/fonts/AlphabetofDaggers.woff'); }
@font-face { font-family: Dovahkiin;  src: url('@/assets/fonts/dovahkiin.otf'); }
@font-face { font-family: Drazi;      src: url('@/assets/fonts/Drazi.woff'); }
@font-face { font-family: Eldfuth;    src: url('@/assets/fonts/ElderFuthark.woff'); }
@font-face { font-family: Efkolia;    src: url('@/assets/fonts/Efkolia.woff'); }
@font-face { font-family: FaceIt;     src: url('@/assets/fonts/Faceit.woff'); }
@font-face { font-family: Fakoo;      src: url('@/assets/fonts/Fakoo.woff'); }
@font-face { font-family: Fetish;     src: url('@/assets/fonts/WCFetish.otf'); }
@font-face { font-family: Futurama;   src: url('@/assets/fonts/FuturamaAlienAlphabetOne.woff'); }
@font-face { font-family: Gallifreyan;src: url('@/assets/fonts/WSSimpleGallifreyan.woff'); }
@font-face { font-family: Hylian64;   src: url('@/assets/fonts/Hylian64.woff'); }
@font-face { font-family: HylianAn;   src: url('@/assets/fonts/AncientHylian-English.woff'); }
@font-face { font-family: HylianSS;   src: url('@/assets/fonts/SSAncientHylian.woff'); }
@font-face { font-family: HylianTP;   src: url('@/assets/fonts/TPHylian-GCNRegular.woff'); }
@font-face { font-family: Kix;        src: url('@/assets/fonts/KIXBarcode.woff'); }
@font-face { font-family: Klingon;    src: url('@/assets/fonts/klingonfont.woff'); }
@font-face { font-family: Klinzhai;   src: url('@/assets/fonts/Klinzhai.woff'); }
@font-face { font-family: Mandalor;   src: url('@/assets/fonts/Mandalorian.woff'); }
@font-face { font-family: Matoran;    src: url('@/assets/fonts/Matoran.woff'); }
@font-face { font-family: Minbari;    src: url('@/assets/fonts/Minbari.woff'); }
@font-face { font-family: Moonalpha;  src: url('@/assets/fonts/RNIBMOON.woff'); }
@font-face { font-family: Moonrunes;  src: url('@/assets/fonts/MoonRunes.woff'); }
@font-face { font-family: Narn;       src: url('@/assets/fonts/Narn.woff'); }
@font-face { font-family: Nycto;      src: url('@/assets/fonts/Nyctographic.otf'); }
@font-face { font-family: Ogham;      src: url('@/assets/fonts/Beth-Luis-Fearn.woff'); }
@font-face { font-family: Pigpen;     src: url('@/assets/fonts/PigpenCipher.woff'); }
@font-face { font-family: Quadoo;     src: url('@/assets/fonts/Quadoo.woff'); }
@font-face { font-family: Semaphore;  src: url('@/assets/fonts/Semaphore.woff'); }
@font-face { font-family: Templar;    src: url('@/assets/fonts/TemplarsCipherPlusRegular.woff'); }
@font-face { font-family: TengwarA;   src: url('@/assets/fonts/TengwarAnnatar.woff'); }
@font-face { font-family: Tengo;      src: url('@/assets/fonts/Tengo.woff'); }
@font-face { font-family: Theban;     src: url('@/assets/fonts/ThebanAlphabet.woff'); }
@font-face { font-family: Unown;      src: url('@/assets/fonts/Unown.woff'); }
@font-face { font-family: Utopian;    src: url('@/assets/fonts/Utopian.woff'); }
@font-face { font-family: Visitor;    src: url('@/assets/fonts/VisitorScript.otf'); }
@font-face { font-family: Vorlon;     src: url('@/assets/fonts/Vorlon.woff'); }
@font-face { font-family: Vulcan;     src: url('@/assets/fonts/VulcanScript.woff'); }
@font-face { font-family: Wakandan;   src: url('@/assets/fonts/ModernWakandan-Regular.woff'); }

</style>