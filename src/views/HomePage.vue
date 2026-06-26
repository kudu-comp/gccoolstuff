<template>
  <div class="card-grid">
    <v-card :title="t('home.welcome')">
      <img style="width: 100%; height: 200px; object-fit: cover;" src="../assets/images/welcome.jpg" alt="Welcome">
      <div class="card-body">
        <p v-html="t('home.intro')"></p>
        <router-link to="/alltools"><span class="btn">{{t('labels.alltools')}}</span></router-link>
      </div>
    </v-card>
    <v-card :title="t('home.whatare')">
      <div class="card-body">
        <div class="form-horizontal mb-2">
            <input
              type="text"
              v-model="searchstr"
              @keyup.enter="goSearch()"
            />
            <button
              class="btn btn-primary"
              id="btn1"
              @click="goSearch()"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
        </div>
        <h5 class="card-title mt-2">{{t('home.favs')}}</h5>
        <div class="card-text">
          <ul>
            <li>
              <router-link to="/wordvalue">{{t('wordvalue.title')}}</router-link>
            </li>
            <li>
              <router-link to="/rotciphers">ROT13</router-link>
            </li>
            <li>
              <router-link to="/tryanswers">{{t('tryanswers.title')}}</router-link>
            </li>
            <li>
              <router-link to="/convert">{{t('convert.title')}} {{t('menu.coordinates')}}</router-link>
            </li>
            <li>
              <router-link to="/printlog">{{t('printlog.title')}}</router-link>
            </li>
            <li>
              <router-link to="/codebook">{{t('codebook.title')}}</router-link>
            </li>
            <li>
              <router-link to="/htmlparser">{{t('htmlparser.title')}}</router-link>
            </li>
            <li>
              <router-link to="/wordsearch">{{t('wordsearch.title')}}</router-link>
            </li>
          </ul>
        </div>
        <h5 class="card-title mt-2">{{t('home.contact')}}</h5>
        <div class="card-text">
          {{t('home.contacttxt')}}
        </div>
      </div>
    </v-card>
    <v-card :title="t('home.new')" >
      <img style="width: 100%; height: 200px; object-fit: cover;" src="../assets/images/featured.jpg" alt="Featured" >
      <div class="card-body">
        <p class="card-text" v-html="t('home.info')">
        </p>
      </div>
    </v-card>
    <v-card :title="t('menu.coordinates')">
      <img style="width: 100%; height: 200px; object-fit: cover;" src="../assets/images/coordinates.jpg" alt="Coordinates">
      <div class="card-body">
        <p class="card-text" v-html="t('coordinates.intro')"></p>
        <router-link to="/helpcoord"><span class="btn">{{t('labels.moreinfo')}}</span></router-link>
      </div>
    </v-card>
    <v-card :title="t('menu.codes')">
      <img style="width: 100%; height: 200px; object-fit: cover;" src="../assets/images/codes.jpg" alt="Codes">
      <div class="card-body">
        <p class="card-text" v-html="t('codes.intro')"></p>
        <router-link to="/helpcodes"><span class="btn">{{t('labels.moreinfo')}}</span></router-link>
      </div>
    </v-card>
    <v-card :title="t('menu.texttools')">
      <img style="width: 100%; height: 200px; object-fit: cover;" src="../assets/images/text.jpg" alt="Text">
      <div class="card-body">
        <p class="card-text" v-html="t('texttools.intro')"></p>
        <router-link to="/helptext"><span class="btn">{{t('labels.moreinfo')}}</span></router-link>
      </div>
    </v-card>
    <v-card :title="t('menu.mathtools')">
      <img style="width: 100%; height: 200px; object-fit: cover;" src="../assets/images/math.jpg" alt="Mathematics">
      <div class="card-body">
        <p class="card-text" v-html="t('mathtools.intro')"></p>
        <router-link to="/helpmath"><span class="btn">{{t('labels.moreinfo')}}</span></router-link>
      </div>
    </v-card>
    <v-card :title="t('menu.imagetools')">
      <img style="width: 100%; height: 200px; object-fit: cover;" src="../assets/images/images.jpg" alt="Images">
      <div class="card-body">
        <p class="card-text" v-html="t('imagetools.intro')"></p>
        <router-link to="/helpimage"><span class="btn">{{t('labels.moreinfo')}}</span></router-link>
      </div>
    </v-card>
    <v-card :title="t('menu.comptools')">
      <img style="width: 100%; height: 200px; object-fit: cover;" src="../assets/images/comp.jpg" alt="Programming">
      <div class="card-body">
        <p class="card-text" v-html="t('comptools.intro')"></p>
        <router-link to="/helpcomp"><span class="btn">{{t('labels.moreinfo')}}</span></router-link>
      </div>
    </v-card>
    <v-card :title="t('menu.games')">
      <img style="width: 100%; height: 200px; object-fit: cover;" src="../assets/images/games.jpg" alt="Games and puzzles">
      <div class="card-body">
        <p class="card-text" v-html="t('games.intro')"></p>
        <router-link to="/helpgames"><span class="btn">{{t('labels.moreinfo')}}</span></router-link>
      </div>
    </v-card>
    <v-card :title="t('menu.other')">
      <img style="width: 100%; height: 200px; object-fit: cover;" src="../assets/images/other.jpg" alt="Other tools">
      <div class="card-body">
        <p class="card-text" v-html="t('othertools.intro')"></p>
        <router-link to="/helpother"><span class="btn">{{t('labels.moreinfo')}}</span></router-link>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import VCard from '@/components/generic/VCard.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

// Define the name of the component (optional)
defineOptions({
  name: 'SearchComponent'
});

// Setup Router hook
const router = useRouter();

// --- State ---
const searchstr = ref("");

// --- Methods ---
const goSearch = () => {
  // Use router.push instead of this.$router.push
  router.push({ 
    name: 'AllTools', 
    query: { s: searchstr.value } 
  });
};
</script>

<i18n locale="en">
{
  "home": {
    "new" : "What's new",
    "welcome": "GC Tools",
    "whatare" : "What are you looking for?",
    "favs" : "Favorites",
    "intro": "GC Tools has all the tools needed to solve your geocache puzzles. Use search to find the tool you need or use the menu. GC Tools is 100% free, no ads, no cookies!",
    "contact": "Contact",
    "contacttxt": "We love to hear from you. Please let us know your suggestions. Send us a message through Geocaching.com to Team Chaenaan or send us an email to info{'@'}gctools.nl",
    "info" : "<p>GCTools has been upgraded. The user inferface works better om mobile and uses cards. All tools have been tested thoroughly.</p><p>And there are some great new tools especially for <b>Steganography</b>. You can now easily find hidden messages in images and sound files. And you create your own secret messages!</p>"
  }
}
</i18n>

<i18n locale="nl">
{
  "home": {
    "new" : "Laatste updates",
    "info" : "<p>GCTools is flink verbeterd. The website werkt nu nog beter op mobiel. Alle tools maken gebruik van kaarten, zodat alle informatie overzichtelijk wordt gepresetneerd. En we alles nog eens flink getest.</p><p>En er zijn enkele nieuwe tools. Probeer de verschillende opties voor steganografie eens. Hiermee kan je simpel boodschappen verstoppen in afbeeldingen of geluiden.</p>",
    "whatare" : "Waar ben je naar op zoek?",
    "favs" : "Favorieten",
    "intro": "GC Tools biedt alle tools die je nodig hebt voor het oplossen van je geocache puzzels. Gebruik de zoekfunctie om de juiste tool te vinden of gebruik het menu. GC Tools is 100% gratis, geen advertenties en geen cookies!",
    "contact": "Contact",
    "contacttxt": "Stuur ons je opmerkingen en suggesties. We horen het graag. Gebruik Geocaching.com, onze naam is Team Chaenaan of stuur een email naar info{'@'}gctools.nl"
  }
}
</i18n>