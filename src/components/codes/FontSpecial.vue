<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('codes.fonts.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('codes.fonts.long')" />
      <div class="form-row mb-2">
        <textarea id="message" name="message" class="form-control" ref="message" :placeholder="$t('labels.message')" rows=10 v-model='message'></textarea>
      </div>
      <div class="form-inline">
        <label class="form-label mb-2 mr-2" for="ift">{{$t('cdfonts.selfont')}}</label>
        <select class="custom-select mb-2 mr-2" id="ift" v-model='styleObject.fontFamily'>
          <option v-for="f in fontdef" :key="f" :value="f.id">{{f.font}}</option>
        </select>
        <label class="form-label mb-2 mr-2" for="ofs">{{$t('cdfonts.fontsize')}}</label>
        <select id="ofs" class="custom-select mb-2 mr-2" v-model='styleObject.fontSize'>
          <option value="12px">12</option>
          <option value="24px">24</option>
          <option value="48px">48</option>
          <option value="72px">72</option>
        </select>
        <label class="form-label mb-2 mr-2" for="ofs">{{$t('cdfonts.selcolor')}}</label>
        <select id="ofs" class="custom-select mb-2" v-model='styleObject.color'>
          <option value="black">{{$t('colors.black')}}</option>
          <option value="blue">{{$t('colors.blue')}}</option>
          <option value="red">{{$t('colors.red')}}</option>
          <option value="green">{{$t('colors.green')}}</option>
          <option value="brown">{{$t('colors.brown')}}</option>
        </select>
      </div>
      <div id="result" class="form-row">
        <textarea id="message2" name="message2" spellcheck="false" class="form-control" v-bind:style="styleObject" rows=10 v-model='message'></textarea>
      </div>
      <p v-show="errormsg" class="errormsg mt-2">{{errormsg}}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'FontSpecial',

  props: {
    msg: String,
  },

  data: function () {
    return {
      message: "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n0123456789\n!?.,:;@#$%^&*(){}[]-_=+<>/\\~\"`'|",
      result : this.$t('labels.result'),
      errormsg: "",
      selectedfont: 'Antiker',
      styleObject: {
        fontFamily: 'Antiker',
        fontSize: '24px',
        color: 'black'
      },
      fontdef: [
        { id: 'Antiker', font: 'Ancient (Star Gate)' },
        { id: 'Applebeech', font: 'Applebeech (runes)' },
        { id: 'Aurebesh', font: 'Aurebesh (Star Wars)' },
        { id: 'Barbook', font: 'Barbook' },
        { id: 'Betamaze', font: 'Betamaze' },
        { id: 'Braille', font: 'Braille' },
        { id: 'Centauri', font: 'Centauri (Babylon 5)' },
        { id: 'Code128', font: 'Code 128 (barcode)' },
        { id: 'Code39', font: 'Code 39 (barcode)' },
        { id: 'Cirth', font: 'Cirth Erebor (Tolkien)' },
        { id: 'Daedra', font: 'Daedra (The Elder Scrolls)' },
        { id: 'Dagger', font: 'Dagger' },
        { id: 'Dovahkiin', font: 'Dovahzul (The Elder Scrolls)' },
        { id: 'Drazi', font: 'Drazi (Babylon 5)' },
        { id: 'Eldfuth', font: 'Elder Futhark (runes)' },
        { id: 'Efkolia', font: 'Efkolia' },
        { id: 'FaceIt', font: 'Face it!' },
        { id: 'Fakoo', font: 'Fakoo (braille)' },
        { id: 'Fetish', font: 'Fetish (shoes)' },
        { id: 'Futurama', font: 'Futurama alien' },
        { id: 'Gallifreyan', font: 'Gallifreyan (Dr. Who)' },
        { id: 'Hylian64', font: 'Hylian 64 (Zelda)'},
        { id: 'HylianAn', font: 'Hylian, Ancient (Zelda)'},
        { id: 'HylianSS', font: 'Hylian, Skyward Sword (Zelda)'},
        { id: 'HylianTP', font: 'Hylian, Twilight Princess (Zelda)'},
        { id: 'Kix', font: 'Kix Code (PostNL)' },
        { id: 'Klingon', font: 'Klingon (Star Trek)' },
        { id: 'Klinzhai', font: 'Klinzhai (Star Trek)' },
        { id: 'Mandalor', font: 'Mandalorian (Star Wars)' },
        { id: 'Matoran', font: 'Matoran (Lego Bionicles)' },
        { id: 'Minbari', font: 'Minbari (Babylon 5)' },
        { id: 'Moonalpha', font: 'Moon Alphabet' },
        { id: 'Moonrunes', font: 'Moon Runes' },
        { id: 'Narn', font: 'Narn (Babylon 5)' },
        { id: 'Ogham', font: 'Ogham (Medieval)' },
        { id: 'Pigpen', font: 'Pigpen cipher' },
        { id: 'Quadoo', font: 'Quadoo' },
        { id: 'Semaphore', font: 'Semaphore (flags)' },
        { id: 'TengwarA', font: 'Tengwar Annatar (Tolkien)' },
        { id: 'Templar', font: 'Templar Cipher' },
        { id: 'Tengo', font: 'Tengo' },
        { id: 'Theban', font: 'Theban' },
        { id: 'Unown', font: 'Unown' },
        { id: 'Utopian', font: 'Utopian' },
        { id: 'Visitor', font: 'Visitor (2009)' },
        { id: 'Vorlon', font: 'Vorlon (Babylon 5)' },
        { id: 'Vulcan', font: 'Vulcan script' },
        { id: 'Wakandan', font: 'Wakandan' }
      ]
    }
  },

  mounted: function() {
    this.$refs.message.focus();
    if (this.$route.params.font) this.styleObject.fontFamily = this.$route.params.font
  },

  methods: {

  },

}
</script>

<style scoped>

@font-face { font-family: Antiker;    src: url('~@/assets/fonts/Ancient-Black.woff'); }
@font-face { font-family: Applebeech; src: url('~@/assets/fonts/AppleBeech.woff'); }
@font-face { font-family: Aurebesh;   src: url('~@/assets/fonts/Aurebesh.otf'); }
@font-face { font-family: Barbook;    src: url('~@/assets/fonts/BarBook.woff'); }
@font-face { font-family: Betamaze;   src: url('~@/assets/fonts/BetaMaze-0-180.woff'); }
@font-face { font-family: Braille;    src: url('~@/assets/fonts/Braille.woff'); }
@font-face { font-family: Centauri;   src: url('~@/assets/fonts/Centauri.woff'); }
@font-face { font-family: Code128;    src: url('~@/assets/fonts/Code128.woff'); }
@font-face { font-family: Code39;     src: url('~@/assets/fonts/Code39Regular.woff'); }
@font-face { font-family: Cirth;      src: url('~@/assets/fonts/CirthEreborCaps.woff'); }
@font-face { font-family: Daedra;     src: url('~@/assets/fonts/Daedra.otf'); }
@font-face { font-family: Dagger;     src: url('~@/assets/fonts/AlphabetofDaggers.woff'); }
@font-face { font-family: Dovahkiin;  src: url('~@/assets/fonts/dovahkiin.otf'); }
@font-face { font-family: Drazi;      src: url('~@/assets/fonts/Drazi.woff'); }
@font-face { font-family: Eldfuth;    src: url('~@/assets/fonts/ElderFuthark.woff'); }
@font-face { font-family: Efkolia;    src: url('~@/assets/fonts/Efkolia.woff'); }
@font-face { font-family: FaceIt;     src: url('~@/assets/fonts/Faceit.woff'); }
@font-face { font-family: Fakoo;      src: url('~@/assets/fonts/Fakoo.woff'); }
@font-face { font-family: Fetish;     src: url('~@/assets/fonts/WCFetish.otf'); }
@font-face { font-family: Futurama;   src: url('~@/assets/fonts/FuturamaAlienAlphabetOne.woff'); }
@font-face { font-family: Gallifreyan;src: url('~@/assets/fonts/WSSimpleGallifreyan.woff'); }
@font-face { font-family: Hylian64;   src: url('~@/assets/fonts/Hylian64.woff'); }
@font-face { font-family: HylianAn;   src: url('~@/assets/fonts/AncientHylian-English.woff'); }
@font-face { font-family: HylianSS;   src: url('~@/assets/fonts/SSAncientHylian.woff'); }
@font-face { font-family: HylianTP;   src: url('~@/assets/fonts/TPHylian-GCNRegular.woff'); }
@font-face { font-family: Kix;        src: url('~@/assets/fonts/KIXBarcode.woff'); }
@font-face { font-family: Klingon;    src: url('~@/assets/fonts/klingonfont.woff'); }
@font-face { font-family: Klinzhai;   src: url('~@/assets/fonts/Klinzhai.woff'); }
@font-face { font-family: Mandalor;   src: url('~@/assets/fonts/Mandalorian.woff'); }
@font-face { font-family: Matoran;    src: url('~@/assets/fonts/Matoran.woff'); }
@font-face { font-family: Minbari;    src: url('~@/assets/fonts/Minbari.woff'); }
@font-face { font-family: Moonalpha;  src: url('~@/assets/fonts/RNIBMOON.woff'); }
@font-face { font-family: Moonrunes;  src: url('~@/assets/fonts/MoonRunes.woff'); }
@font-face { font-family: Narn;       src: url('~@/assets/fonts/Narn.woff'); }
@font-face { font-family: Ogham;      src: url('~@/assets/fonts/Beth-Luis-Fearn.woff'); }
@font-face { font-family: Pigpen;     src: url('~@/assets/fonts/PigpenCipher.woff'); }
@font-face { font-family: Quadoo;     src: url('~@/assets/fonts/Quadoo.woff'); }
@font-face { font-family: Semaphore;  src: url('~@/assets/fonts/Semaphore.woff'); }
@font-face { font-family: Templar;    src: url('~@/assets/fonts/TemplarsCipherPlusRegular.woff'); }
@font-face { font-family: TengwarA;   src: url('~@/assets/fonts/TengwarAnnatar.woff'); }
@font-face { font-family: Tengo;      src: url('~@/assets/fonts/Tengo.woff'); }
@font-face { font-family: Theban;     src: url('~@/assets/fonts/ThebanAlphabet.woff'); }
@font-face { font-family: Unown;      src: url('~@/assets/fonts/Unown.woff'); }
@font-face { font-family: Utopian;    src: url('~@/assets/fonts/Utopian.woff'); }
@font-face { font-family: Visitor;    src: url('~@/assets/fonts/VisitorScript.otf'); }
@font-face { font-family: Vorlon;     src: url('~@/assets/fonts/Vorlon.woff'); }
@font-face { font-family: Vulcan;     src: url('~@/assets/fonts/VulcanScript.woff'); }
@font-face { font-family: Wakandan;   src: url('~@/assets/fonts/ModernWakandan-Regular.woff'); }

</style>