<template>
  <div class="mainpage home">
    <div class="container h-100">
      <div
        class="intro"
        v-html="$t('intro')"
      />
      <h3>{{ $t('menu.coordinates') }}</h3>
      <div class="p mb-2">
        <router-link to="/coord/coordconvert">
          {{ $t('coordinates.convert.title') }}
        </router-link> {{ $t('coordinates.convert.short') }}<br>
        <router-link to="/coord/coordproj">
          {{ $t('coordinates.project.title') }}
        </router-link> {{ $t('coordinates.project.short') }}<br>
        <router-link to="/coord/coordmapmaker">
          {{ $t('coordinates.mapmaker.title') }}
        </router-link> {{ $t('coordinates.mapmaker.short') }}<br>
        <router-link to="/coord/coordincomplete">
          {{ $t('coordinates.incomplete.title') }}
        </router-link> {{ $t('coordinates.incomplete.short') }}<br>
        <router-link to="/coord/coordlines">
          {{ $t('coordinates.lines.title') }}
        </router-link> {{ $t('coordinates.lines.short') }}<br>
        <router-link to="/coord/coordtriangles">
          {{ $t('coordinates.triangles.title') }}
        </router-link> {{ $t('coordinates.triangles.short') }}<br>
        <router-link to="/coord/coordcircles">
          {{ $t('coordinates.circles.title') }}
        </router-link> {{ $t('coordinates.circles.short') }}<br>
        <router-link to="/coord/coordantipode">
          {{ $t('coordinates.antipode.title') }}
        </router-link> {{ $t('coordinates.antipode.short') }}<br>
        <router-link to="/coord/coordw3w">
          {{ $t('coordinates.w3w.title') }}
        </router-link> {{ $t('coordinates.w3w.short') }}<br>
        <router-link to="/coord/reversewherigo">
          {{ $t('coordinates.revwherigo.title') }}
        </router-link> {{ $t('coordinates.revwherigo.short') }}
      </div>
      <h3>{{ $t('menu.texttools') }}</h3>
      <div class="p mb-2">
        <router-link to="/text/textwordvalue">
          {{ $t('texttools.wordvalue.title') }}
        </router-link> {{ $t('texttools.wordvalue.short') }}<br>
        <router-link to="/text/textcodes">
          {{ $t('texttools.charcodes.title') }}
        </router-link> {{ $t('texttools.charcodes.short') }}<br>
        <router-link to="/text/smartreplace">
          {{ $t('texttools.smartreplace.title') }}
        </router-link> {{ $t('texttools.smartreplace.short') }}<br>
        <router-link to="/text/textanalyzer">
          {{ $t('texttools.analyze.title') }}
        </router-link> {{ $t('texttools.analyze.short') }}<br>
        <router-link to="/text/texttonumbers">
          {{ $t('texttools.texttonumbers.title') }}
        </router-link> {{ $t('texttools.texttonumbers.short') }}<br>
        <router-link to="/text/textkeyboards">
          {{ $t('texttools.keyboards.title') }}
        </router-link> {{ $t('texttools.keyboards.short') }}<br>
        <router-link to="/text/texttoss">
          {{ $t('texttools.texttoss.title') }}
        </router-link> {{ $t('texttools.texttoss.short') }}
      </div>
      <h3>{{ $t('menu.ciphers') }}</h3>
      <div class="p mb-2">
        <router-link :to="{ name: 'Cipher', params: { initcipher: 'ROT13'}}">
          ROT13
        </router-link>,
        <router-link :to="{ name: 'Cipher', params: { initcipher: 'ROT47'}}">
          ROT47
        </router-link>,
        <router-link :to="{ name: 'Cipher', params: { initcipher: 'Vigenere'}}">
          Vigenere
        </router-link>,
        <router-link :to="{ name: 'Cipher', params: { initcipher: 'Polybius'}}">
          Polybius
        </router-link>,
        <router-link :to="{ name: 'Cipher', params: { initcipher: 'Playfair'}}">
          Playfair
        </router-link>,
        <router-link :to="{ name: 'Cipher', params: { initcipher: 'Kenny code'}}">
          Kenny code
        </router-link>,
        <router-link :to="{ name: 'Cipher', params: { initcipher: 'Morse'}}">
          Morse
        </router-link>
        {{ $t('cp.short') }}
      </div>
      <h3>{{ $t('menu.codes') }}</h3>
      <div class="p mb-2">
        <router-link to="/codes/codebook">
          {{ $t('codes.codebook.title') }}
        </router-link> {{ $t('codes.codebook.short') }}.<br>
        <router-link to="/codes/fonts">
          {{ $t('codes.fonts.title') }}
        </router-link> {{ $t('codes.fonts.short') }}.<br>
        <router-link to="/codes/segment">
          {{ $t('codes.segment.title') }}
        </router-link> {{ $t('codes.segment.short') }}.<br>
        <router-link to="/codes/resistorcode">
          {{ $t('codes.resistorcode.title') }}
        </router-link> {{ $t('codes.resistorcode.short') }}.<br>
        <router-link to="/codes/segment">
          {{ $t('codes.decabit.title') }}
        </router-link> {{ $t('codes.decabit.short') }}.
      </div>
      <h3>{{ $t('menu.imagetools') }}</h3>
      <div class="p mb-2">
        <router-link to="/images/exifscanner">
          {{ $t('imagetools.exifscanner.title') }}
        </router-link> {{ $t('imagetools.exifscanner.short') }}.<br>
        <router-link to="/images/colorpicker">
          {{ $t('imagetools.colorpicker.title') }}
        </router-link> {{ $t('imagetools.colorpicker.short') }}.<br>
        <router-link to="/images/filltool">
          {{ $t('imagetools.filltool.title') }}
        </router-link> {{ $t('imagetools.filltool.short') }}.<br>
        <router-link to="/images/pixeldata">
          {{ $t('imagetools.pixeldata.title') }}
        </router-link> {{ $t('imagetools.pixeldata.short') }}.<br>
        <router-link to="/images/pixelbuild">
          {{ $t('imagetools.pixelbuild.title') }}
        </router-link> {{ $t('imagetools.pixelbuild.short') }}.<br>
        <router-link to="/images/imagetransform">
          {{ $t('imagetools.imagetransform.title') }}
        </router-link> {{ $t('imagetools.imagetransform.short') }}.<br>
        <router-link to="/images/textextractor">
          {{ $t('imagetools.textextractor.title') }}
        </router-link> {{ $t('imagetools.textextractor.short') }}.
      </div>
      <h3>{{ $t('menu.htmlscanner') }}</h3>
      <div class="p mb-2">
        <router-link to="/html">
          {{ $t('menu.htmlscanner') }}
        </router-link>  {{ $t('htmlscanner.short') }}.
      </div>
      <h3>{{ $t('menu.mathtools') }}</h3>
      <div class="p mb-2">
        <router-link to="/math/baseconvertor">
          {{ $t('mathtools.baseconvert.title') }}
        </router-link> {{ $t('mathtools.baseconvert.short') }}.<br>
        <router-link to="/math/countdigits">
          {{ $t('mathtools.decimals.title') }}
        </router-link> {{ $t('mathtools.decimals.short') }}.<br>
        <router-link to="/math/primes">
          {{ $t('mathtools.primes.title') }}
        </router-link> {{ $t('mathtools.primes.short') }}.<br>
        <router-link to="/math/romans">
          {{ $t('mathtools.romans.title') }}
        </router-link> {{ $t('mathtools.romans.short') }}.<br>
        <router-link to="/math/fibonacci">
          {{ $t('mathtools.fibonacci.title') }}
        </router-link> {{ $t('mathtools.fibonacci.short') }}.<br>
        <router-link to="/math/gcdandlcm">
          {{ $t('mathtools.primegcdlcm.title') }}
        </router-link> {{ $t('mathtools.primegcdlcm.short') }}.<br>
        <router-link to="/math/formulasolv">
          {{ $t('mathtools.formulasolver.title') }}
        </router-link> {{ $t('mathtools.formulasolver.short') }}.<br>
        <router-link to="/math/numberproperties">
          {{ $t('mathtools.numberprop.title') }}
        </router-link> {{ $t('mathtools.numberprop.short') }}.<br>
        <router-link to="/math/bignumbers">
          {{ $t('mathtools.bignum.title') }}
        </router-link> {{ $t('mathtools.bignum.short') }}.<br>
        <router-link to="/math/nimbers">
          {{ $t('mathtools.nimbers.title') }}
        </router-link> {{ $t('mathtools.nimbers.short') }}.<br>
        <router-link to="/math/sequences">
          {{ $t('mathtools.sequences.title') }}
        </router-link> {{ $t('mathtools.sequences.short') }}.<br>
        <router-link to="/math/palindromecounter">
          {{ $t('mathtools.palindrome.title') }}
        </router-link> {{ $t('mathtools.palindrome.short') }}.<br>
      </div>
      <h3>{{ $t('menu.comptools') }}</h3>
      <div class="p mb-2">
        <router-link to="/comp/bintotext">
          {{ $t('comptools.compbintotext.title') }}
        </router-link> {{ $t('comptools.compbintotext.short') }}.<br>
        <router-link to="/comp/bcd">
          {{ $t('comptools.compbcd.title') }}
        </router-link> {{ $t('comptools.compbcd.short') }}.<br>
        <router-link to="/comp/encryption">
          {{ $t('comptools.encryption.title') }}
        </router-link> {{ $t('comptools.encryption.short') }}.<br>
        <router-link to="/comp/hashes">
          {{ $t('comptools.hashes.title') }}
        </router-link> {{ $t('comptools.hashes.short') }}.<br>
        <router-link to="/comp/brainfuck">
          {{ $t('comptools.compbrainfuck.title') }}
        </router-link> {{ $t('comptools.compbrainfuck.short') }}.<br>
        <router-link to="/comp/cow">
          {{ $t('comptools.cow.title') }}
        </router-link> {{ $t('comptools.cow.short') }}.<br>
        <router-link to="/comp/beatnik">
          {{ $t('comptools.beatnik.title') }}
        </router-link> {{ $t('comptools.beatnik.short') }}.<br>
        <router-link to="/comp/deadfish">
          {{ $t('comptools.compdeadfish.title') }}
        </router-link> {{ $t('comptools.compdeadfish.short') }}.<br>
        <router-link to="/comp/duckspeak">
          {{ $t('comptools.duckspeak.title') }}
        </router-link> {{ $t('comptools.duckspeak.short') }}.<br>
      </div>
      <h3>{{ $t('menu.other') }}</h3>
      <div class="p mb-2">
        <router-link to="/other/sudokusolver">
          {{ $t('othertools.sudokusolver.title') }}
        </router-link> {{ $t('othertools.sudokusolver.short') }}.<br>
        <router-link to="/other/mmsolver">
          {{ $t('othertools.mmsolver.title') }}
        </router-link> {{ $t('othertools.mmsolver.short') }}.<br>
        <router-link to="/other/periodictable">
          {{ $t('othertools.periodictable.title') }}
        </router-link> {{ $t('othertools.periodictable.short') }}.<br>
        <router-link to="/other/countries">
          {{ $t('othertools.countries.title') }}
        </router-link> {{ $t('othertools.countries.short') }}.<br>
        <router-link to="/other/usastates">
          {{ $t('othertools.usastates.title') }}
        </router-link> {{ $t('othertools.usastates.short') }}.<br>
        <router-link to="/other/countryregions">
          {{ $t('othertools.countryregions.title') }}
        </router-link> {{ $t('othertools.countryregions.short') }}.<br>
        <router-link to="/other/unitconvertor">
          {{ $t('othertools.unitconvertor.title') }}
        </router-link> {{ $t('othertools.unitconvertor.short') }}.<br>
        <router-link to="/other/dnacode">
          {{ $t('othertools.dnacode.title') }}
        </router-link> {{ $t('othertools.dnacode.short') }}.
      </div>
    </div>
  </div>
</template>
