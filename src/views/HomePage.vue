<template>
  <div class="d-flex flex-column mx-4">
    <h1>GC Tools</h1>
    <div class="row justify-content-around">
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/welcome.jpg" alt="Welcome" style="height: 200px;">
        <div class="card-body">
          <h5 class="card-title">{{$t('labels.welcome')}}</h5>
          <p class="card-text" v-html="$t('intro')"></p>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/whatsnew.jpg" alt="Welcome" style="height: 200px;">
        <div class="card-body">
          <h5 class="card-title">{{$t('labels.whatsnew')}}</h5>
          <p class="card-text" v-show="$i18n.locale === 'nl'">GCtools.nl heeft een flinke opknapbeurt gehad en ziet er nu een stuk beter uit. Alles is nu eenvoudig te vinden via de navigatiebalk. Geheimschriften werken een stuk makkelijker. Er zijn enkele nieuwe tools toegevoegd <router-link to="/freqanal">Frequentie analyse</router-link> en <router-link to="/datecalc">Rekenen met datums</router-link>.
          </p>
          <p class="card-text" v-show="$i18n.locale !== 'nl'">GCtools.nl has been improved and now looks a lot better. All tools can easily be found in the navbar. Ciphers work a lot better with the use of an expert mode for those rare cases you need it. Some new tools have been added <router-link to="/freqanal">Frequency analysis</router-link> and <router-link to="/datecalc">Date calculator</router-link>.
          </p>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/featured.jpg" alt="Welcome" style="height: 200px;">
        <div class="card-body">
          <h5 class="card-title">{{$t('labels.featured')}} - {{$t('comptools.checksum.title')}}</h5>
          <p class="card-text" v-show="$i18n.locale === 'nl'">
            Veel belangrijke nummers gebruiken een controlegetal om te voorkomen dat er fouten insluipen. De eerste twee cijfers van je IBAN rekening nummer, het laatste cijfer van je creditcard, ISBN nummers voor boeken of het Nederlandse BSN nummer. Met <router-link to="/checksum">Controlegetal</router-link> kan je al deze uitrekenen.
          </p>
          <p class="card-text" v-show="$i18n.locale !== 'nl'">
            Many important numbers use so called checkdigits to avoid mistakes when being used. The International Bank Account Number (IBAN), credit card numbers, ISBN book numbers, article codes and so on. Use <router-link to="/checksum">Checkdigit</router-link> to calculate the various check digits.
          </p>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/coordinates.jpg" alt="Coordinates" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.coordinates')}}</h5>
          <p class="card-text" v-html="$t('coordinates.intro')"></p>
          <router-link to="/helpcoord"><span class="btn btn-primary">{{$t('labels.moreinfo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/codes.jpg" alt="Text" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.codes')}}</h5>
          <p class="card-text" v-html="$t('codes.intro')"></p>
          <router-link to="/helpcodes"><span class="btn btn-primary">{{$t('labels.moreinfo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/text.jpg" alt="Text" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.texttools')}}</h5>
          <p class="card-text" v-html="$t('texttools.intro')"></p>
          <router-link to="/helptext"><span class="btn btn-primary">{{$t('labels.moreinfo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/math.jpg" alt="Mathematics" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.mathtools')}}</h5>
          <p class="card-text" v-html="$t('mathtools.intro')"></p>
          <router-link to="/helpmath"><span class="btn btn-primary">{{$t('labels.moreinfo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/images.jpg" alt="Images" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.imagetools')}}</h5>
          <p class="card-text" v-html="$t('imagetools.intro')"></p>
          <router-link to="/helpimage"><span class="btn btn-primary">{{$t('labels.moreinfo')}}</span></router-link>
        </div>
      </div>
      <div class="card m-2 px-0" style="width: 25rem;">
        <img class="card-img-top" src="../assets/images/comp.jpg" alt="Programming" style="height: 200px">
        <div class="card-body">
          <h5 class="card-title">{{$t('menu.comptools')}}</h5>
          <p class="card-text" v-html="$t('comptools.intro')"></p>
          <router-link to="/helpcomp"><span class="btn btn-primary">{{$t('labels.moreinfo')}}</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>
