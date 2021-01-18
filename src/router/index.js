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
import TextToolbox from '../views/TextToolbox.vue'
import TextWordValue from '@/components/texts/TextWordValue.vue'
import SmartReplace from '@/components/texts/SmartReplace.vue'
import TextAnalyze from '@/components/texts/TextAnalyze.vue'
import TextToNumbers from '@/components/texts/TextToNumbers.vue'
import TextKeyboards from '@/components/texts/TextKeyboards.vue'
import TextCodes from '@/components/texts/TextCodes.vue'
import Cipher from '../views/Cipher.vue'
import CodeBook from '@/components/CodeBook.vue'
import MathToolbox from '../views/MathToolbox.vue'
import MathFib from '@/components/math/MathFib.vue'
import MathDigits from '@/components/math/MathDigits.vue'
import MathFormula from '@/components/math/MathFormula.vue'
import MathGCDandLCM from '@/components/math/MathGCDandLCM.vue'
import MathNimbers from '@/components/math/MathNimbers.vue'
import MathPalindrome from '@/components/math/MathPalindrome.vue'
import MathSequences from '@/components/math/MathSequences'
import MathProperties from '@/components/math/MathProperties.vue'
import MathBase from  '@/components/math/MathBase.vue'
import ImageTools from '@/components/images/ImageTools.vue'
import ExifScanner from '@/components/images/ExifScanner.vue'
import ColorPicker from '@/components/images/ColorPicker.vue'
import FillTool from '@/components/images/FillTool.vue'
import HtmlToolbox from '@/views/HtmlToolbox'
import Sudoku from '../views/Sudoku.vue'
import OtherTools from '@/views/OtherTools.vue'
import MastermindSolver from '@/components/other/MastermindSolver.vue'
import PeriodicTable from '@/components/other/PeriodicTable.vue'
import ResistorCode from '@/components/other/ResistorCode.vue'
import Countries from '@/components/other/Countries.vue'
import UsaStates from '@/components/other/UsaStates.vue'
import NlProvinces from '@/components/other/NlProvinces.vue'
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
      { path: "/coord/coordconvert", component: CoordConvert },
      { path: "/coord/coordproj", component: CoordProject },
      { path: "/coord/coordlines", component: CoordLines },
      { path: "/coord/coordtriangles", component: CoordTriangles },
      { path: "/coord/coordcircles", component: CoordCircles },
      { path: "/coord/coordincomplete", component: CoordIncomplete },
      { path: "/coord/coordantipode", component: CoordAntipode },
      { path: "/coord/coordmapmaker", component: CoordMapMaker },
    ]
  },
  {
    path: '/text',
    name: 'TextToolbox',
    component: TextToolbox,
    children: [
      { path: "/text/textwordvalue", component: TextWordValue },
      { path: "/text/smartreplace", component: SmartReplace },
      { path: "/text/textanalyzer", component: TextAnalyze },
      { path: "/text/texttonumbers", component: TextToNumbers },
      { path: "/text/textcodes", component: TextCodes },
      { path: "/text/textkeyboards", component: TextKeyboards },
    ]
  },
  {
    path: '/cipher',
    name: 'Cipher',
    component: Cipher
  },
  {
    path: '/codebook',
    name: 'CodeBook',
    component: CodeBook
  },
  {
    path: '/math',
    name: 'Math',
    component: MathToolbox,
    children: [
      { path: "/math/baseconvertor", component: MathBase },
      { path: "/math/countdigits", component: MathDigits },
      { path: "/math/formulasolv", component: MathFormula},
      { path: "/math/numberproperties", component: MathProperties },
      { path: "/math/fibonacci", component: MathFib },
      { path: "/math/nimbers", component: MathNimbers },
      { path: "/math/gcdandlcm", component: MathGCDandLCM },
      { path: "/math/palindromecounter", component: MathPalindrome },
      { name: "MathSequences", path: "/math/sequences", component: MathSequences },
    ]
  },
  {
    path: '/other',
    name: "OtherTools",
    component: OtherTools,
    children: [
      {
        path: '/other/sudokusolver',
        name: 'SudokuSolver',
        component: Sudoku
      },
      {
        path: '/other/mmsolver',
        name: 'MastermindSolver',
        component: MastermindSolver,
      },
      {
        path: '/other/periodictable',
        name: 'PeriodicTable',
        component: PeriodicTable,
      },
      {
        path: '/other/resistorcode',
        name: 'ResistorCode',
        component: ResistorCode,
      },
      {
        path: '/other/countries',
        name: 'Countries',
        component: Countries,
      },
      {
        path: '/other/usastates',
        name: 'UsaStates',
        component: UsaStates,
      },
      {
        path: '/other/nlprovinces',
        name: 'NlProvinces',
        component: NlProvinces,
      },
    ]
  },
  {
    path: '/images',
    name: "ImageTools",
    component: ImageTools,
    children: [
      {
        path: '/images/exifscanner',
        name: 'ExifScanner',
        component: ExifScanner
      },
      {
        path: '/images/colorpicker',
        name: 'ColorPicker',
        component: ColorPicker
      },
      {
        path: '/images/filltool',
        name: 'FillTool',
        component: FillTool
      },
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
