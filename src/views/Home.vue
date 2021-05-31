<template>
  <div class="mainpage home">
    <div class="container h-100">
      <div class="infoblock" v-html="$t('intro')" />
      <h3>{{$t('menu.coordinates')}}</h3>
      <div class="p mb-2">
        <router-link to="/coord/coordconvert">{{$t('coordinates.convert.title')}}</router-link> {{$t('coordinates.convert.short')}}<br>
        <router-link to="/coord/coordproj">{{$t('coordinates.project.title')}}</router-link> {{$t('coordinates.project.short')}}<br>
        <router-link to="/coord/coordmapmaker">{{$t('coordinates.mapmaker.title')}}</router-link> {{$t('coordinates.mapmaker.short')}}<br>
        <router-link to="/coord/coordincomplete">{{$t('coordinates.incomplete.title')}}</router-link> {{$t('coordinates.incomplete.short')}}<br>
        <router-link to="/coord/coordlines">{{$t('coordinates.lines.title')}}</router-link> {{$t('coordinates.lines.short')}}<br>
        <router-link to="/coord/coordtriangles">{{$t('coordinates.triangles.title')}}</router-link> {{$t('coordinates.triangles.short')}}<br>
        <router-link to="/coord/coordcircles">{{$t('coordinates.circles.title')}}</router-link> {{$t('coordinates.circles.short')}}<br>
        <router-link to="/coord/coordantipode">{{$t('coordinates.antipode.title')}}</router-link> {{$t('coordinates.antipode.short')}}
        <router-link to="/coord/coordw3w">{{$t('coordinates.w3w.title')}}</router-link> {{$t('coordinates.w3w.short')}}
      </div>
      <h3>{{$t('menu.texttools')}}</h3>
      <div class="p mb-2">
        <router-link to="/text/textwordvalue">{{$t('texttools.wordvalue.title')}}</router-link> {{$t('texttools.wordvalue.short')}}<br>
        <router-link to="/text/textcodes">{{$t('texttools.charcodes.title')}}</router-link> {{$t('texttools.charcodes.short')}}<br>
        <router-link to="/text/smartreplace">{{$t('texttools.smartreplace.title')}}</router-link> {{$t('texttools.smartreplace.short')}}<br>
        <router-link to="/text/textanalyzer">{{$t('texttools.analyze.title')}}</router-link> {{$t('texttools.analyze.short')}}<br>
        <router-link to="/text/texttonumbers">{{$t('texttools.texttonumbers.title')}}</router-link> {{$t('texttools.texttonumbers.short')}}<br>
        <router-link to="/text/textkeyboards">{{$t('texttools.keyboards.title')}}</router-link> {{$t('texttools.keyboards.short')}}
      </div>
      <h3>{{$t('menu.ciphers')}}</h3>
      <div class="p mb-2">
        <router-link :to="{ name: 'Cipher', params: { cipher: 'ROT13'}}">ROT13</router-link>,
        <router-link :to="{ name: 'Cipher', params: { cipher: 'ROT47'}}">ROT47</router-link>,
        <router-link :to="{ name: 'Cipher', params: { cipher: 'Vigenere'}}">Vigenere</router-link>,
        <router-link :to="{ name: 'Cipher', params: { cipher: 'Polybius'}}">Polybius</router-link>,
        <router-link :to="{ name: 'Cipher', params: { cipher: 'Playfair'}}">Playfair</router-link>,
        <router-link :to="{ name: 'Cipher', params: { cipher: 'Kenny code'}}">Kenny code</router-link>,
        <router-link :to="{ name: 'Cipher', params: { cipher: 'Morse'}}">Morse</router-link>
        {{$t('cp.short')}}
      </div>
      <h3>{{$t('menu.codebook')}}</h3>
      <div class="p mb-2">
        <router-link to="/codebook">{{$t('menu.codebook')}}</router-link> {{$t('codebook.short')}}.
      </div>
      <h3>{{$t('menu.imagetools')}}</h3>
      <div class="p mb-2">
        <router-link to="/images/exifscanner">{{$t('imagetools.exifscanner.title')}}</router-link> {{$t('imagetools.exifscanner.short')}}.<br>
        <router-link to="/images/colorpicker">{{$t('imagetools.colorpicker.title')}}</router-link> {{$t('imagetools.colorpicker.short')}}.<br>
        <router-link to="/images/filltool">{{$t('imagetools.filltool.title')}}</router-link> {{$t('imagetools.filltool.short')}}.<br>
        <router-link to="/images/pixeldata">{{$t('imagetools.pixeldata.title')}}</router-link> {{$t('imagetools.pixeldata.short')}}.<br>
        <router-link to="/images/imagetransform">{{$t('imagetools.imagetransform.title')}}</router-link> {{$t('imagetools.imagetransform.short')}}.
      </div>
      <h3>{{$t('menu.htmlscanner')}}</h3>
      <div class="p mb-2">
        <router-link to="/html">{{$t('menu.htmlscanner')}}</router-link>  {{$t('htmlscanner.short')}}.
      </div>
      <h3>{{$t('menu.mathtools')}}</h3>
      <div class="p mb-2">
        <router-link to="/math/baseconvertor">{{$t('mathtools.baseconvert.title')}}</router-link> {{$t('mathtools.baseconvert.short')}}.<br>
        <router-link to="/math/countdigits">{{$t('mathtools.decimals.title')}}</router-link> {{$t('mathtools.decimals.short')}}.<br>
        <router-link to="/math/primes">{{$t('mathtools.primes.title')}}</router-link> {{$t('mathtools.primes.short')}}.<br>
        <router-link to="/math/fibonacci">{{$t('mathtools.fibonacci.title')}}</router-link> {{$t('mathtools.fibonacci.short')}}.<br>
        <router-link to="/math/gcdandlcm">{{$t('mathtools.primegcdlcm.title')}}</router-link> {{$t('mathtools.primegcdlcm.short')}}.<br>
        <router-link to="/math/formulasolv">{{$t('mathtools.formulasolver.title')}}</router-link> {{$t('mathtools.formulasolver.short')}}.<br>
        <router-link to="/math/numberproperties">{{$t('mathtools.numberprop.title')}}</router-link> {{$t('mathtools.numberprop.short')}}.<br>
        <router-link to="/math/nimbers">{{$t('mathtools.nimbers.title')}}</router-link> {{$t('mathtools.nimbers.short')}}.<br>
        <router-link to="/math/sequences">{{$t('mathtools.sequences.title')}}</router-link> {{$t('mathtools.sequences.short')}}.<br>
        <router-link to="/math/palindromecounter">{{$t('mathtools.palindrome.title')}}</router-link> {{$t('mathtools.palindrome.short')}}.<br>
      </div>
      <h3>{{$t('menu.comptools')}}</h3>
      <div class="p mb-2">
        <router-link to="/comp/bintotext">{{$t('comptools.compbintotext.title')}}</router-link> {{$t('comptools.compbintotext.short')}}.<br>
        <router-link to="/comp/bcd">{{$t('comptools.compbcd.title')}}</router-link> {{$t('comptools.compbcd.short')}}.<br>
        <router-link to="/comp/brainfuck">{{$t('comptools.compbrainfuck.title')}}</router-link> {{$t('comptools.compbrainfuck.short')}}.<br>
        <router-link to="/comp/deadfish">{{$t('comptools.compdeadfish.title')}}</router-link> {{$t('comptools.compdeadfish.short')}}.<br>
      </div>
      <h3>{{$t('menu.other')}}</h3>
      <div class="p mb-2">
        <router-link to="/other/sudokusolver">{{$t('othertools.sudokusolver.title')}}</router-link> {{$t('othertools.sudokusolver.short')}}.<br>
        <router-link to="/other/mmsolver">{{$t('othertools.mmsolver.title')}}</router-link> {{$t('othertools.mmsolver.short')}}.<br>
        <router-link to="/other/periodictable">{{$t('othertools.periodictable.title')}}</router-link> {{$t('othertools.periodictable.short')}}.<br>
        <router-link to="/other/countries">{{$t('othertools.countries.title')}}</router-link> {{$t('othertools.countries.short')}}.<br>
        <router-link to="/other/usastates">{{$t('othertools.usastates.title')}}</router-link> {{$t('othertools.usastates.short')}}.<br>
        <router-link to="/other/countryregions">{{$t('othertools.countryregions.title')}}</router-link> {{$t('othertools.countryregions.short')}}.<br>
        <router-link to="/other/resistorcode">{{$t('othertools.resistorcode.title')}}</router-link> {{$t('othertools.resistorcode.short')}}.<br>
        <router-link to="/other/unitconvertor">{{$t('othertools.unitconvertor.title')}}</router-link> {{$t('othertools.unitconvertor.short')}}.
      </div>
    </div>
  </div>
</template>
