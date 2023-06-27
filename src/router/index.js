import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/coord',
    name: 'CoordTools',
    component: () => import('@/components/coords/CoordTools.vue'),
    children: [
      { path: "/coord/coordconvert",    name: 'CoordConvert',     component: () => import('@/components/coords/CoordConvert.vue') },
      { path: "/coord/coordproj",       name: 'CoordProj',        component: () => import('@/components/coords/CoordProject.vue') },
      { path: "/coord/coordlines",      name: 'CoordLines',       component: () => import('@/components/coords/CoordLines.vue') },
      { path: "/coord/coordtriangles",  name: 'CoordTriangles',   component: () => import('@/components/coords/CoordTriangles.vue') },
      { path: "/coord/coordcircles",    name: 'CoordCircles',     component: () => import('@/components/coords/CoordCircles.vue') },
      { path: "/coord/coordincomplete", name: 'CoordIncomplete',  component: () => import('@/components/coords/CoordIncomplete.vue') },
      { path: "/coord/coordantipode",   name: 'CoordAntipode',    component: () => import('@/components/coords/CoordAntipode.vue') },
      { path: "/coord/coordmapmaker",   name: 'MapMaker',         component: () => import('@/components/coords/CoordMapMaker.vue') },
      { path: "/coord/coordw3w",        name: 'CoordW3W',         component: () => import('@/components/coords/CoordW3W.vue') },
      { path: "/coord/reversewherigo",  name: 'ReverseWherigo',   component: () => import('@/components/coords/ReverseWherigo.vue') }
    ]
  },
  {
    path: '/text',
    name: 'TextTools',
    component: () => import('@/components/texts/TextTools.vue'),
    children: [
      { path: "/text/textwordvalue",  name: 'WordValue',      component: () => import('@/components/texts/TextWordValue.vue') },
      { path: "/text/smartreplace",   name: 'SmartReplace',   component: () => import('@/components/texts/SmartReplace.vue') },
      { path: "/text/textanalyzer",   name: 'TextAnalyzer',   component: () => import('@/components/texts/TextAnalyze.vue') },
      { path: "/text/texttonumbers",  name: 'TextToNumbers',  component: () => import('@/components/texts/TextToNumbers.vue') },
      { path: "/text/textcodes",      name: 'TextCodes',      component: () => import('@/components/texts/TextCodes.vue') },
      { path: "/text/textkeyboards",  name: 'Keyboards',      component: () => import('@/components/texts/TextKeyboards.vue') },
      { path: "/text/texttoss",       name: 'TextToss',       component: () => import('@/components/texts/TextToss.vue') }
    ]
  },
  {
    path: '/cipher',
    name: 'Cipher',
    component: () => import('@/components/EncoderDecoder.vue')
  },
  {
    path: '/codes',
    name: 'Codes',
    component: () => import('@/components/codes/CodesIntro.vue'),
    children: [
      { path: "/codes/codebook",     name: 'Codebook', component: () => import('@/components/codes/CodeBook.vue') },   
      { path: "/codes/fonts",        name: 'Fonts',    component: () => import('@/components/codes/FontSpecial.vue')},
      { path: "/codes/segment",      name: 'Segment',  component: () => import('@/components/codes/SegmentCode.vue')},
      { path: "/codes/resistorcode", name: 'Resistor', component: () => import('@/components/codes/ResistorCode.vue')},
      { path: "/codes/decabit",      name: 'DecaBit',  component: () => import('@/components/codes/DecaBit.vue')}
    ]
  },
  {
    path: '/math',
    name: 'Math',
    component: () => import('@/components/math/MathTools.vue'),
    children: [
      { path: "/math/baseconvertor",     name: 'BaseConvertor',         component: () => import('@/components/math/MathBase.vue') },
      { path: "/math/countdigits",       name: 'Digits',                component: () => import('@/components/math/MathDigits.vue') },
      { path: "/math/primes",            name: 'Primes',                component: () => import('@/components/math/MathPrimes.vue')},
      { path: "/math/romans",            name: 'Romans',                component: () => import('@/components/math/MathRomans.vue')},
      { path: "/math/formulasolv",       name: 'FormulaSolver',         component: () => import('@/components/math/MathFormula.vue')},
      { path: "/math/numberproperties",  name: 'NumberProperties',      component: () => import('@/components/math/MathProperties.vue') },
      { path: "/math/fibonacci",         name: 'Fibonacci',             component: () => import('@/components/math/MathFib.vue') },
      { path: "/math/bignumbers",        name: 'BigNumbers',            component: () => import('@/components/math/MathBigNumbers.vue') },
      { path: "/math/nimbers",           name: 'Nimbers',               component: () => import('@/components/math/MathNimbers.vue') },
      { path: "/math/gcdandlcm",         name: 'GCDAndLCM',             component: () => import('@/components/math/MathGCDandLCM.vue') },
      { path: "/math/palindromecounter", name: 'Palindrome',            component: () => import('@/components/math/MathPalindrome.vue') },
      { path: "/math/sequences",         name: 'Sequences',             component: () => import('@/components/math/MathSequences.vue') },
    ]
  },
  {
    path: '/comp',
    name: 'CompTools',
    component: () => import('@/components/comp/CompTools.vue'),
    children: [
      { path: "/comp/charcodes",  name: 'charcodes',       component: () => import('@/components/texts/TextCodes.vue') },
      { path: "/comp/bcd",        name: 'bcd',             component: () => import('@/components/comp/CompBCD.vue') },
      { path: "/comp/encryption", name: 'encryption',      component: () => import('@/components/comp/CompEncryption.vue') }, //Param: enc is name of the initial encryption
      { path: "/comp/hashes",     name: 'hashes',          component: () => import('@/components/comp/CompHashes.vue') },     //Param: hash is name of the initial encryption
      { path: "/comp/brainfuck",  name: 'brainfuck',       component: () => import('@/components/comp/CompBrainfuck.vue') },  //Param: bfvar is name of the initial BF variation
      { path: "/comp/deadfish",   name: 'deadfish',        component: () => import('@/components/comp/CompDeadfish.vue') },
      { path: "/comp/cow",        name: 'cow',             component: () => import('@/components/comp/CompCow.vue') },
      { path: "/comp/beatnik",    name: 'beatnik',         component: () => import('@/components/comp/CompBeatnik.vue') },
      { path: "/comp/bintotext",  name: 'compbintotext',   component: () => import('@/components/comp/CompBinToText.vue') },
      { path: "/comp/duckspeak",  name: 'duckspeak',       component: () => import('@/components/comp/CompDuckspeak.vue') },
      { path: "/comp/checksum",   name: 'checksum',        component: () => import('@/components/comp/CompChecksum.vue') }
    ]
  },
  {
    path: '/other',
    name: "OtherIntro",
    component: () => import('@/components/other/OtherIntro.vue'),
    children: [
      { path: '/other/sudokusolver',    name: 'SudokuSolver',     component: () => import('@/components/other/SudokuSolver.vue')      },
      { path: '/other/mmsolver',        name: 'MastermindSolver', component: () => import('@/components/other/MastermindSolver.vue'), },
      { path: '/other/periodictable',   name: 'PeriodicTable',    component: () => import('@/components/other/PeriodicTable.vue'),    },
      { path: '/other/countries',       name: 'CountriesAll',     component: () => import('@/components/other/CountriesAll.vue'),     },
      { path: '/other/unitconvertor',   name: 'UnitConvertor',    component: () => import('@/components/other/UnitConvertor.vue'),    },
      { path: '/other/usastates',       name: 'UsaStates',        component: () => import('@/components/other/UsaStates.vue'),        },
      { path: '/other/countryregions',  name: 'CountryRegions',   component: () => import('@/components/other/CountryRegions.vue'),   },
      { path: '/other/dnacode',         name: 'DNACode',          component: () => import('@/components/other/DNACode.vue'),          }
    ]
  },
  {
    path: '/images',
    name: "ImageTools",
    component: () => import('@/components/images/ImageTools.vue'),
    children: [
      { path: '/images/exifscanner',     name: 'ExifScanner',     component: () => import('@/components/images/ExifScanner.vue')      },
      { path: '/images/colorpicker',     name: 'ColorPicker',     component: () => import('@/components/images/ColorPicker.vue')      },
      { path: '/images/filltool',        name: 'FillTool',        component: () => import('@/components/images/FillTool.vue')         },
      { path: '/images/pixeldata',       name: 'PixelData',       component: () => import('@/components/images/PixelData.vue')        },
      { path: '/images/pixelbuild',      name: 'PixelBuild',      component: () => import('@/components/images/PixelBuild.vue')       },
      { path: '/images/imagetransform',  name: 'ImageTransform',  component: () => import('@/components/images/ImageTransform.vue')   },
      { path: '/images/textextractor',   name: 'TextExtractor',   component: () => import('@/components/images/TextExtractor.vue')    }
    ]
  },
  {
    path: '/html',
    name: 'HtmlParser',
    component: () => import('@/components/HtmlParser.vue')
  },
  {
    path: '/howtostart',
    name: 'HowTo',
    component: () => import('@/views/HowToStart.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
