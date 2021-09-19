import { createRouter, createWebHistory } from 'vue-router'
import Coord from '../views/Coord.vue'
import CoordConvert from '@/components/coords/CoordConvert'
import CoordProject from '@/components/coords/CoordProject'
import CoordLines from '@/components/coords/CoordLines'
import CoordTriangles from '@/components/coords/CoordTriangles'
import CoordCircles from '@/components/coords/CoordCircles'
import CoordIncomplete from '@/components/coords/CoordIncomplete'
import CoordAntipode from '@/components/coords/CoordAntipode'
import CoordMapMaker from '@/components/coords/CoordMapMaker'
import CoordW3W from '@/components/coords/CoordW3W.vue'
import ReverseWherigo from '@/components/coords/ReverseWherigo.vue'
import TextToolbox from '../views/TextToolbox.vue'
import TextWordValue from '@/components/texts/TextWordValue.vue'
import SmartReplace from '@/components/texts/SmartReplace.vue'
import TextAnalyze from '@/components/texts/TextAnalyze.vue'
import TextToNumbers from '@/components/texts/TextToNumbers.vue'
import TextKeyboards from '@/components/texts/TextKeyboards.vue'
import TextCodes from '@/components/texts/TextCodes.vue'
import Cipher from '../views/Cipher.vue'
import CodesIntro from '@/components/codes/CodesIntro.vue'
import CodeBook from '@/components/codes/CodeBook.vue'
import FontSpecial from '@/components/codes/FontSpecial.vue'
import SegmentCode from '@/components/codes/SegmentCode.vue'
import ResistorCode from '@/components/codes/ResistorCode.vue'
import Decabit from '@/components/codes/Decabit.vue'
import MathToolbox from '../views/MathToolbox.vue'
import MathFib from '@/components/math/MathFib.vue'
import MathDigits from '@/components/math/MathDigits.vue'
import MathFormula from '@/components/math/MathFormula.vue'
import MathPrimes from '@/components/math/MathPrimes.vue'
import MathGCDandLCM from '@/components/math/MathGCDandLCM.vue'
import MathNimbers from '@/components/math/MathNimbers.vue'
import MathPalindrome from '@/components/math/MathPalindrome.vue'
import MathSequences from '@/components/math/MathSequences'
import MathProperties from '@/components/math/MathProperties.vue'
import MathBase from  '@/components/math/MathBase.vue'
import CompToolbox from '../views/CompToolbox.vue'
import CompBCD from '@/components/comp/CompBCD.vue'
import CompBrainfuck from '@/components/comp/CompBrainfuck.vue'
import CompEncryption from '@/components/comp/CompEncryption.vue'
import CompDeadfish from '@/components/comp/CompDeadfish.vue'
import CompBinToText from '@/components/comp/CompBinToText.vue'
import CompCow from '@/components/comp/CompCow.vue'
import CompBeatnik from '@/components/comp/CompBeatnik.vue'
import ImageTools from '@/components/images/ImageTools.vue'
import ExifScanner from '@/components/images/ExifScanner.vue'
import ColorPicker from '@/components/images/ColorPicker.vue'
import FillTool from '@/components/images/FillTool.vue'
import PixelData from '@/components/images/PixelData.vue'
import ImageTransform from '@/components/images/ImageTransform.vue'
import HtmlToolbox from '@/views/HtmlToolbox'
import Sudoku from '../views/Sudoku.vue'
import OtherTools from '@/views/OtherTools.vue'
import MastermindSolver from '@/components/other/MastermindSolver.vue'
import PeriodicTable from '@/components/other/PeriodicTable.vue'
import UnitConvertor from '@/components/other/UnitConvertor'
import Countries from '@/components/other/Countries.vue'
import UsaStates from '@/components/other/UsaStates.vue'
import CountryRegions from '@/components/other/CountryRegions.vue'
import Howtostart from '@/views/Howtostart.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/coord',
    name: 'Coord',
    component: Coord,
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
    name: 'TextToolbox',
    component: TextToolbox,
    children: [
      { path: "/text/textwordvalue", name: 'WordValue', component: TextWordValue },
      { path: "/text/smartreplace", name: 'SmartReplace', component: SmartReplace },
      { path: "/text/textanalyzer", name: 'TextAnalyzer', component: TextAnalyze },
      { path: "/text/texttonumbers", name: 'TextToNumbers', component: TextToNumbers },
      { path: "/text/textcodes", name: 'TextCodes', component: TextCodes },
      { path: "/text/textkeyboards", name: 'Keyboards', component: TextKeyboards },
    ]
  },
  {
    path: '/cipher',
    name: 'Cipher',
    component: Cipher
    // Param: cipher is name of selected cipher initially
  },
  {
    path: '/codes',
    name: 'Codes',
    component: CodesIntro,
    children: [
      { path: "/codes/codebook",     name: 'Codebook', component: CodeBook },   // Param: code is name of the initial code
      { path: "/codes/fonts",        name: 'Fonts',    component: FontSpecial}, // Param: font is name of the initial font
      { path: "/codes/segment",      name: 'Segment',  component: SegmentCode},
      { path: "/codes/resistorcode", name: 'Resistor', component: ResistorCode},
      { path: "/codes/decabit",      name: 'Decabit',  component: Decabit}
    ]
  },
  {
    path: '/math',
    name: 'Math',
    component: MathToolbox,
    children: [
      { path: "/math/baseconvertor",     name: 'BaseConvertor',         component: MathBase },
      { path: "/math/countdigits",       name: 'Digits',                component: MathDigits },
      { path: "/math/primes",            name: 'Primes',                component: MathPrimes},
      { path: "/math/formulasolv",       name: 'FormulaSolver',         component: MathFormula},
      { path: "/math/numberproperties",  name: 'NumberProperties',      component: MathProperties },
      { path: "/math/fibonacci",         name: 'Fibonacci',             component: MathFib },
      { path: "/math/nimbers",           name: 'Nimbers',               component: MathNimbers },
      { path: "/math/gcdandlcm",         name: 'GCDAndLCM',             component: MathGCDandLCM },
      { path: "/math/palindromecounter", name: 'Palindrome',            component: MathPalindrome },
      { path: "/math/sequences",         name: 'Sequences',             component: MathSequences },
    ]
  },
  {
    path: '/comp',
    name: 'Comp',
    component: CompToolbox,
    children: [
      { path: "/comp/charcodes",  name: 'charcodes',       component: TextCodes },
      { path: "/comp/bcd",        name: 'bcd',             component: CompBCD },
      { path: "/comp/encryption", name: 'encryption',      component: CompEncryption }, //Param: enc is name of the initial encryption
      { path: "/comp/brainfuck",  name: 'brainfuck',       component: CompBrainfuck },  //Param: bfvar is name of the initial BF variation
      { path: "/comp/deadfish",   name: 'deadfish',        component: CompDeadfish },
      { path: "/comp/cow",        name: 'cow',             component: CompCow },
      { path: "/comp/beatnik",    name: 'beatnik',         component: CompBeatnik },
      { path: "/comp/bintotext",  name: 'compbintotext',   component: CompBinToText }
    ]
  },
  {
    path: '/other',
    name: "OtherTools",
    component: OtherTools,
    children: [
      { path: '/other/sudokusolver',    name: 'SudokuSolver',     component: Sudoku            },
      { path: '/other/mmsolver',        name: 'MastermindSolver', component: MastermindSolver, },
      { path: '/other/periodictable',   name: 'PeriodicTable',    component: PeriodicTable,    },
      { path: '/other/countries',       name: 'Countries',        component: Countries,        },
      { path: '/other/unitconvertor',   name: 'UnitConvertor',    component: UnitConvertor,    },
      { path: '/other/usastates',       name: 'UsaStates',        component: UsaStates,        },
      { path: '/other/countryregions',  name: 'CountryRegions',   component: CountryRegions,   }
    ]
  },
  {
    path: '/images',
    name: "ImageTools",
    component: ImageTools,
    children: [
      { path: '/images/exifscanner',     name: 'ExifScanner',     component: ExifScanner      },
      { path: '/images/colorpicker',     name: 'ColorPicker',     component: ColorPicker      },
      { path: '/images/filltool',        name: 'FillTool',        component: FillTool      },
      { path: '/images/pixeldata',       name: 'PixelData',       component: PixelData      },
      { path: '/images/imagetransform',  name: 'ImageTransform',  component: ImageTransform      },
    ]
  },
  {
    path: '/html',
    name: 'HtmlTools',
    component: HtmlToolbox
  },
  {
    path: '/howtostart',
    name: 'Howto',
    component: Howtostart
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
