import { createRouter, createWebHistory } from 'vue-router'
import CoordConvert from '@/components/coords/CoordConvert.vue'
import CoordProject from '@/components/coords/CoordProject.vue'
import CoordLines from '@/components/coords/CoordLines.vue'
import CoordTriangles from '@/components/coords/CoordTriangles.vue'
import CoordCircles from '@/components/coords/CoordCircles.vue'
import CoordIncomplete from '@/components/coords/CoordIncomplete.vue'
import CoordAntipode from '@/components/coords/CoordAntipode.vue'
import CoordMapMaker from '@/components/coords/CoordMapMaker.vue'
import CoordW3W from '@/components/coords/CoordW3W.vue'
import ReverseWherigo from '@/components/coords/ReverseWherigo.vue'
import TextWordValue from '@/components/texts/TextWordValue.vue'
import SmartReplace from '@/components/texts/SmartReplace.vue'
import TextAnalyze from '@/components/texts/TextAnalyze.vue'
import TextToNumbers from '@/components/texts/TextToNumbers.vue'
import TextKeyboards from '@/components/texts/TextKeyboards.vue'
import TextCodes from '@/components/texts/TextCodes.vue'
import TextToss from '@/components/texts/TextToss.vue'
import CodeBook from '@/components/codes/CodeBook.vue'
import FontSpecial from '@/components/codes/FontSpecial.vue'
import SegmentCode from '@/components/codes/SegmentCode.vue'
import ResistorCode from '@/components/codes/ResistorCode.vue'
import DecaBit from '@/components/codes/DecaBit.vue'
import MathFib from '@/components/math/MathFib.vue'
import MathDigits from '@/components/math/MathDigits.vue'
import MathFormula from '@/components/math/MathFormula.vue'
import MathPrimes from '@/components/math/MathPrimes.vue'
import MathRomans from '@/components/math/MathRomans.vue'
import MathGCDandLCM from '@/components/math/MathGCDandLCM.vue'
import MathBigNumbers from '@/components/math/MathBigNumbers.vue'
import MathNimbers from '@/components/math/MathNimbers.vue'
import MathPalindrome from '@/components/math/MathPalindrome.vue'
import MathSequences from '@/components/math/MathSequences.vue'
import MathProperties from '@/components/math/MathProperties.vue'
import MathBase from  '@/components/math/MathBase.vue'
import CompBCD from '@/components/comp/CompBCD.vue'
import CompBrainfuck from '@/components/comp/CompBrainfuck.vue'
import CompEncryption from '@/components/comp/CompEncryption.vue'
import CompHashes from '@/components/comp/CompHashes.vue'
import CompDeadfish from '@/components/comp/CompDeadfish.vue'
import CompBinToText from '@/components/comp/CompBinToText.vue'
import CompCow from '@/components/comp/CompCow.vue'
import CompBeatnik from '@/components/comp/CompBeatnik.vue'
import CompDuckspeak from '@/components/comp/CompDuckspeak.vue'
import ExifScanner from '@/components/images/ExifScanner.vue'
import ColorPicker from '@/components/images/ColorPicker.vue'
import FillTool from '@/components/images/FillTool.vue'
import PixelData from '@/components/images/PixelData.vue'
import PixelBuild from '@/components/images/PixelBuild.vue'
import ImageTransform from '@/components/images/ImageTransform.vue'
import TextExtractor from '@/components/images/TextExtractor.vue'
import HtmlParser from '@/components/HtmlParser.vue'
import MastermindSolver from '@/components/other/MastermindSolver.vue'
import PeriodicTable from '@/components/other/PeriodicTable.vue'
import SudokuSolver from '@/components/other/SudokuSolver.vue'
import UnitConvertor from '@/components/other/UnitConvertor.vue'
import CountriesAll from '@/components/other/CountriesAll.vue'
import UsaStates from '@/components/other/UsaStates.vue'
import CountryRegions from '@/components/other/CountryRegions.vue'
import DNACode from '@/components/other/DNACode.vue'

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
      { path: "/coord/coordconvert", name: 'CoordConvert', component: CoordConvert },
      { path: "/coord/coordproj", name: 'CoordProj', component: CoordProject },
      { path: "/coord/coordlines", name: 'CoordLines', component: CoordLines },
      { path: "/coord/coordtriangles", name: 'CoordTriangels', component: CoordTriangles },
      { path: "/coord/coordcircles", name: 'CoordCircles', component: CoordCircles },
      { path: "/coord/coordincomplete", name: 'CoordIncomplete', component: CoordIncomplete },
      { path: "/coord/coordantipode", name: 'CoordAntipode', component: CoordAntipode },
      { path: "/coord/coordmapmaker", name: 'MapMaker', component: CoordMapMaker },
      { path: "/coord/coordw3w", name: 'CoordW3W', component: CoordW3W },
      { path: "/coord/reversewherigo", name: 'ReverseWherigo', component: ReverseWherigo }
    ]
  },
  {
    path: '/text',
    name: 'TextTools',
    component: () => import('@/components/texts/TextTools.vue'),
    children: [
      { path: "/text/textwordvalue", name: 'WordValue', component: TextWordValue },
      { path: "/text/smartreplace", name: 'SmartReplace', component: SmartReplace },
      { path: "/text/textanalyzer", name: 'TextAnalyzer', component: TextAnalyze },
      { path: "/text/texttonumbers", name: 'TextToNumbers', component: TextToNumbers },
      { path: "/text/textcodes", name: 'TextCodes', component: TextCodes },
      { path: "/text/textkeyboards", name: 'Keyboards', component: TextKeyboards },
      { path: "/text/texttoss", name: 'TextToss', component: TextToss }
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
      { path: "/codes/codebook",     name: 'Codebook', component: CodeBook },   
      { path: "/codes/fonts",        name: 'Fonts',    component: FontSpecial},
      { path: "/codes/segment",      name: 'Segment',  component: SegmentCode},
      { path: "/codes/resistorcode", name: 'Resistor', component: ResistorCode},
      { path: "/codes/decabit",      name: 'DecaBit',  component: DecaBit}
    ]
  },
  {
    path: '/math',
    name: 'Math',
    component: () => import('@/components/math/MathTools.vue'),
    children: [
      { path: "/math/baseconvertor",     name: 'BaseConvertor',         component: MathBase },
      { path: "/math/countdigits",       name: 'Digits',                component: MathDigits },
      { path: "/math/primes",            name: 'Primes',                component: MathPrimes},
      { path: "/math/romans",            name: 'Romans',                component: MathRomans},
      { path: "/math/formulasolv",       name: 'FormulaSolver',         component: MathFormula},
      { path: "/math/numberproperties",  name: 'NumberProperties',      component: MathProperties },
      { path: "/math/fibonacci",         name: 'Fibonacci',             component: MathFib },
      { path: "/math/bignumbers",        name: 'BigNumbers',            component: MathBigNumbers },
      { path: "/math/nimbers",           name: 'Nimbers',               component: MathNimbers },
      { path: "/math/gcdandlcm",         name: 'GCDAndLCM',             component: MathGCDandLCM },
      { path: "/math/palindromecounter", name: 'Palindrome',            component: MathPalindrome },
      { path: "/math/sequences",         name: 'Sequences',             component: MathSequences },
    ]
  },
  {
    path: '/comp',
    name: 'CompTools',
    component: () => import('@/components/comp/CompTools.vue'),
    children: [
      { path: "/comp/charcodes",  name: 'charcodes',       component: TextCodes },
      { path: "/comp/bcd",        name: 'bcd',             component: CompBCD },
      { path: "/comp/encryption", name: 'encryption',      component: CompEncryption }, //Param: enc is name of the initial encryption
      { path: "/comp/hashes",     name: 'hashes',          component: CompHashes },     //Param: hash is name of the initial encryption
      { path: "/comp/brainfuck",  name: 'brainfuck',       component: CompBrainfuck },  //Param: bfvar is name of the initial BF variation
      { path: "/comp/deadfish",   name: 'deadfish',        component: CompDeadfish },
      { path: "/comp/cow",        name: 'cow',             component: CompCow },
      { path: "/comp/beatnik",    name: 'beatnik',         component: CompBeatnik },
      { path: "/comp/bintotext",  name: 'compbintotext',   component: CompBinToText },
      { path: "/comp/duckspeak",  name: 'duckspeak',       component: CompDuckspeak }
    ]
  },
  {
    path: '/other',
    name: "OtherIntro",
    component: () => import('@/components/other/OtherIntro.vue'),
    children: [
      { path: '/other/sudokusolver',    name: 'SudokuSolver',     component: SudokuSolver      },
      { path: '/other/mmsolver',        name: 'MastermindSolver', component: MastermindSolver, },
      { path: '/other/periodictable',   name: 'PeriodicTable',    component: PeriodicTable,    },
      { path: '/other/countries',       name: 'CountriesAll',     component: CountriesAll,     },
      { path: '/other/unitconvertor',   name: 'UnitConvertor',    component: UnitConvertor,    },
      { path: '/other/usastates',       name: 'UsaStates',        component: UsaStates,        },
      { path: '/other/countryregions',  name: 'CountryRegions',   component: CountryRegions,   },
      { path: '/other/dnacode',         name: 'DNACode',          component: DNACode,          }
    ]
  },
  {
    path: '/images',
    name: "ImageTools",
    component: () => import('@/components/images/ImageTools.vue'),
    children: [
      { path: '/images/exifscanner',     name: 'ExifScanner',     component: ExifScanner      },
      { path: '/images/colorpicker',     name: 'ColorPicker',     component: ColorPicker      },
      { path: '/images/filltool',        name: 'FillTool',        component: FillTool         },
      { path: '/images/pixeldata',       name: 'PixelData',       component: PixelData        },
      { path: '/images/pixelbuild',      name: 'PixelBuild',      component: PixelBuild       },
      { path: '/images/imagetransform',  name: 'ImageTransform',  component: ImageTransform   },
      { path: '/images/textextractor',   name: 'TextExtractor',   component: TextExtractor    }
    ]
  },
  {
    path: '/html',
    name: 'HtmlParser',
    component: HtmlParser
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
