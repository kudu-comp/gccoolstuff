<template>
  <header class="page-header">
    <h1>{{ t('about.header') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <!-- Intro Card -->
    <VCard :title="t('about.intro.title')">
      <p>
        {{ t('about.intro.text1') }}<br><br>
        {{ t('about.intro.text2') }}
      </p>
    </VCard>

    <!-- Free to Use Card -->
    <VCard :title="t('about.free.title')">
      <p>
        {{ t('about.free.text') }}
      </p>
    </VCard>

    <!-- Contact Card -->
    <VCard :title="t('about.contact.title')">
      <p>
        {{ t('about.contact.text') }}
      </p>
    </VCard>

    <!-- Under Construction Card -->
    <VCard :title="t('about.construction.title')">
      <p>
        {{ t('about.construction.text') }}
      </p>
    </VCard>
  </div>

  <h6 style="text-align: center;">
    &copy; 2021 - 2026 Kool Interim
  </h6>
</template>

<script setup>
import VCard from '@/components/generic/VCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  useScope: 'local'
})
</script>

<i18n lang="json">
{
  "en": {
    "about": {
      "header": "About",
      "intro": {
        "title": "About GC Tools",
        "text1": "I love to solve mystery geocaches. I've been doing it for years. There are some great websites out there to help you, but sometimes I needed tools for unknown problems. So I started programming. Then I got the idea to make a website out of it. There are a few tools here which I haven't seen before such as the HTML scanner, the Map Maker, quite a few of the ciphers and some of the math tools. Others are expanded versions of well known tools, e.g. word value supports many alphabets, text & codes supports a dozen of codepages. Try the tools and let me know your suggestions.",
        "text2": "This website is also optimized for mobile. It is small and responsive."
      },
      "free": {
        "title": "Free to use",
        "text": "You are free to use GC Tools. There are no cookies, no commercial messages, no subscription fees."
      },
      "contact": {
        "title": "Contact",
        "text": "If you have suggestions or remarks please contact me. Our geocaching name is Team Chaenaan."
      },
      "construction": {
        "title": "Under construction",
        "text": "This website is continuously under construction. I also use it to practice my coding skills on JavaScript, Vue3, Vue-router, Vuex and PHP. The front end is built as components and using Vite. There is a great set of Javascript modules in use. Leaflet is used for maps, proj4 is used for coordinate conversions, crypto-js for digital encryptions. I use the vue-i18n plugin to support multiple languages. Some tools (ciphers, some of the math, sudoku solver) run on the server, either to keep the size of the HTML small (e.g. it wouldn't be smart to load 1GB of digits) or because I had some PHP code that I wanted to reuse."
      }
    }
  },
  "nl": {
    "about": {
      "header": "Over",
      "intro": {
        "title": "Over GC Tools",
        "text1": "Ik hou ervan om mystery geocaches op te lossen; dat doe ik al jaren. Er zijn een paar geweldige websites die je daarbij helpen, maar soms had ik tools nodig voor onbekende problemen. Daarom ben ik begonnen met programmeren en ontstond het idee om er een website van te maken. Er staan hier een paar tools die ik nog niet eerder ben tegengekomen, zoals de HTML-scanner, de Map Maker, flink wat van de ciphers en enkele wiskunde tools. Andere zijn uitgebreidere versies van bekende tools, zoals de woordwaarde-tool die vele alfabetten ondersteunt, of tekst & codes die tientallen codepagina's ondersteunt. Probeer de tools uit en laat me je suggesties weten.",
        "text2": "Deze website is ook geoptimaliseerd voor mobiel gebruik. Hij is compact en responsive."
      },
      "free": {
        "title": "Gratis te gebruiken",
        "text": "Het gebruik van GC Tools is volledig gratis. Er zijn geen cookies, geen reclameboodschappen en geen abonnementskosten."
      },
      "contact": {
        "title": "Contact",
        "text": "Als je suggesties of opmerkingen hebt, neem dan contact met me op. Onze geocachingnaam is Team Chaenaan."
      },
      "construction": {
        "title": "In ontwikkeling",
        "text": "Deze website is continu in ontwikkeling. Ik gebruik het project ook om mijn programmeervaardigheden in JavaScript, Vue3, Vue-router, Vuex en PHP te oefenen. De front-end is opgebouwd uit componenten met behulp van Vite. Er wordt gebruikgemaakt van diverse Javascript-modules: Leaflet voor kaarten, proj4 voor coördinatenconversies en crypto-js voor digitale versleuteling. Voor de meertaligheid gebruik ik de vue-i18n plugin. Sommige tools (ciphers, bepaalde wiskunde, sudoku solver) draaien op de server, ofwel om de HTML-grootte beperkt te houden (het zou niet slim zijn om 1 GB aan getallen te laden) of omdat ik bestaande PHP-code wilde hergebruiken."
      }
    }
  }
}
</i18n>