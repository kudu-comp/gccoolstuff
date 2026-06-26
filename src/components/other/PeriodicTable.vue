<template>
  <header class="page-header">
    <h1>{{ t('periodictable.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('periodictable.long')" />
      </VCard>
      <VCard :title="t('periodictable.title')">
        <VTable
          :phsearch="phsearch"
          :cols="cols"
          :rows="translatedRows"
          @update:results="handleTableResults" 
        />
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
         <div v-if="formattedResult" v-html="formattedResult" class="resultbox"></div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import VTable from '@/components/generic/VTable.vue'
import VCard from '@/components/generic/VCard.vue'

const { t } = useI18n({ useScope: 'local' })
const startOpen = window.innerWidth > 768;
const phsearch = computed(() => t('periodictable.ph'))
const formattedResult = ref("");

const handleTableResults = (data) => {
  formattedResult.value = data.html;
};

const cols = computed(() => [
  { field: "nr", label: t('periodictable.num'), sortable: { numsort: true }, width: "10%" },
  { field: "sym", label: t('periodictable.sym'), sortable: true, width: "10%" },
  { field: "grp", label: t('periodictable.grp'), sortable: { numsort: true }, width: "10%" },
  { field: "prd", label: t('periodictable.prd'), sortable: { numsort: true }, width: "10%" },
  { field: "blk", label: t('periodictable.blk'), sortable: true, width: "10%" },
  { field: "name", label: t('periodictable.name'), sortable: true, width: "40%" },
])

// The base data (names are now keys)
const baseRows = [
  { nr: "1", sym: "H", grp: "1", prd: "1", blk: "S" },
  { nr: "2", sym: "He", grp: "18", prd: "1", blk: "S" },
  { nr: "3", sym: "Li", grp: "1", prd: "2", blk: "S" },
  { nr: "4", sym: "Be", grp: "2", prd: "2", blk: "S" },
  { nr: "5", sym: "B", grp: "13", prd: "2", blk: "P" },
  { nr: "6", sym: "C", grp: "14", prd: "2", blk: "P" },
  { nr: "7", sym: "N", grp: "15", prd: "2", blk: "P" },
  { nr: "8", sym: "O", grp: "16", prd: "2", blk: "P" },
  { nr: "9", sym: "F", grp: "17", prd: "2", blk: "P" },
  { nr: "10", sym: "Ne", grp: "18", prd: "2", blk: "P" },
  { nr: "11", sym: "Na", grp: "1", prd: "3", blk: "S" },
  { nr: "12", sym: "Mg", grp: "2", prd: "3", blk: "S" },
  { nr: "13", sym: "Al", grp: "13", prd: "3", blk: "P" },
  { nr: "14", sym: "Si", grp: "14", prd: "3", blk: "P" },
  { nr: "15", sym: "P", grp: "15", prd: "3", blk: "P" },
  { nr: "16", sym: "S", grp: "16", prd: "3", blk: "P" },
  { nr: "17", sym: "Cl", grp: "17", prd: "3", blk: "P" },
  { nr: "18", sym: "Ar", grp: "18", prd: "3", blk: "P" },
  { nr: "19", sym: "K", grp: "1", prd: "4", blk: "S" },
  { nr: "20", sym: "Ca", grp: "2", prd: "4", blk: "S" },
  { nr: "21", sym: "Sc", grp: "3", prd: "4", blk: "D" },
  { nr: "22", sym: "Ti", grp: "4", prd: "4", blk: "D" },
  { nr: "23", sym: "V", grp: "5", prd: "4", blk: "D" },
  { nr: "24", sym: "Cr", grp: "6", prd: "4", blk: "D" },
  { nr: "25", sym: "Mn", grp: "7", prd: "4", blk: "D" },
  { nr: "26", sym: "Fe", grp: "8", prd: "4", blk: "D" },
  { nr: "27", sym: "Co", grp: "9", prd: "4", blk: "D" },
  { nr: "28", sym: "Ni", grp: "10", prd: "4", blk: "D" },
  { nr: "29", sym: "Cu", grp: "11", prd: "4", blk: "D" },
  { nr: "30", sym: "Zn", grp: "12", prd: "4", blk: "D" },
  { nr: "31", sym: "Ga", grp: "13", prd: "4", blk: "P" },
  { nr: "32", sym: "Ge", grp: "14", prd: "4", blk: "P" },
  { nr: "33", sym: "As", grp: "15", prd: "4", blk: "P" },
  { nr: "34", sym: "Se", grp: "16", prd: "4", blk: "P" },
  { nr: "35", sym: "Br", grp: "17", prd: "4", blk: "P" },
  { nr: "36", sym: "Kr", grp: "18", prd: "4", blk: "P" },
  { nr: "37", sym: "Rb", grp: "1", prd: "5", blk: "S" },
  { nr: "38", sym: "Sr", grp: "2", prd: "5", blk: "S" },
  { nr: "39", sym: "Y", grp: "3", prd: "5", blk: "D" },
  { nr: "40", sym: "Zr", grp: "4", prd: "5", blk: "D" },
  { nr: "41", sym: "Nb", grp: "5", prd: "5", blk: "D" },
  { nr: "42", sym: "Mo", grp: "6", prd: "5", blk: "D" },
  { nr: "43", sym: "Tc", grp: "7", prd: "5", blk: "D" },
  { nr: "44", sym: "Ru", grp: "8", prd: "5", blk: "D" },
  { nr: "45", sym: "Rh", grp: "9", prd: "5", blk: "D" },
  { nr: "46", sym: "Pd", grp: "10", prd: "5", blk: "D" },
  { nr: "47", sym: "Ag", grp: "11", prd: "5", blk: "D" },
  { nr: "48", sym: "Cd", grp: "12", prd: "5", blk: "D" },
  { nr: "49", sym: "In", grp: "13", prd: "5", blk: "P" },
  { nr: "50", sym: "Sn", grp: "14", prd: "5", blk: "P" },
  { nr: "51", sym: "Sb", grp: "15", prd: "5", blk: "P" },
  { nr: "52", sym: "Te", grp: "16", prd: "5", blk: "P" },
  { nr: "53", sym: "I", grp: "17", prd: "5", blk: "P" },
  { nr: "54", sym: "Xe", grp: "18", prd: "5", blk: "P" },
  { nr: "55", sym: "Cs", grp: "1", prd: "6", blk: "S" },
  { nr: "56", sym: "Ba", grp: "2", prd: "6", blk: "S" },
  { nr: "57", sym: "La", grp: "3", prd: "6", blk: "D" },
  { nr: "58", sym: "Ce", grp: "-", prd: "6", blk: "F" },
  { nr: "59", sym: "Pr", grp: "-", prd: "6", blk: "F" },
  { nr: "60", sym: "Nd", grp: "-", prd: "6", blk: "F" },
  { nr: "61", sym: "Pm", grp: "-", prd: "6", blk: "F" },
  { nr: "62", sym: "Sm", grp: "-", prd: "6", blk: "F" },
  { nr: "63", sym: "Eu", grp: "-", prd: "6", blk: "F" },
  { nr: "64", sym: "Gd", grp: "-", prd: "6", blk: "F" },
  { nr: "65", sym: "Tb", grp: "-", prd: "6", blk: "F" },
  { nr: "66", sym: "Dy", grp: "-", prd: "6", blk: "F" },
  { nr: "67", sym: "Ho", grp: "-", prd: "6", blk: "F" },
  { nr: "68", sym: "Er", grp: "-", prd: "6", blk: "F" },
  { nr: "69", sym: "Tm", grp: "-", prd: "6", blk: "F" },
  { nr: "70", sym: "Yb", grp: "-", prd: "6", blk: "F" },
  { nr: "71", sym: "Lu", grp: "-", prd: "6", blk: "F" },
  { nr: "72", sym: "Hf", grp: "4", prd: "6", blk: "D" },
  { nr: "73", sym: "Ta", grp: "5", prd: "6", blk: "D" },
  { nr: "74", sym: "W", grp: "6", prd: "6", blk: "D" },
  { nr: "75", sym: "Re", grp: "7", prd: "6", blk: "D" },
  { nr: "76", sym: "Os", grp: "8", prd: "6", blk: "D" },
  { nr: "77", sym: "Ir", grp: "9", prd: "6", blk: "D" },
  { nr: "78", sym: "Pt", grp: "10", prd: "6", blk: "D" },
  { nr: "79", sym: "Au", grp: "11", prd: "6", blk: "D" },
  { nr: "80", sym: "Hg", grp: "12", prd: "6", blk: "D" },
  { nr: "81", sym: "Tl", grp: "13", prd: "6", blk: "P" },
  { nr: "82", sym: "Pb", grp: "14", prd: "6", blk: "P" },
  { nr: "83", sym: "Bi", grp: "15", prd: "6", blk: "P" },
  { nr: "84", sym: "Po", grp: "16", prd: "6", blk: "P" },
  { nr: "85", sym: "At", grp: "17", prd: "6", blk: "P" },
  { nr: "86", sym: "Rn", grp: "18", prd: "6", blk: "P" },
  { nr: "87", sym: "Fr", grp: "1", prd: "7", blk: "S" },
  { nr: "88", sym: "Ra", grp: "2", prd: "7", blk: "S" },
  { nr: "89", sym: "Ac", grp: "3", prd: "7", blk: "D" },
  { nr: "90", sym: "Th", grp: "-", prd: "7", blk: "F" },
  { nr: "91", sym: "Pa", grp: "-", prd: "7", blk: "F" },
  { nr: "92", sym: "U", grp: "-", prd: "7", blk: "F" },
  { nr: "93", sym: "Np", grp: "-", prd: "7", blk: "F" },
  { nr: "94", sym: "Pu", grp: "-", prd: "7", blk: "F" },
  { nr: "95", sym: "Am", grp: "-", prd: "7", blk: "F" },
  { nr: "96", sym: "Cm", grp: "-", prd: "7", blk: "F" },
  { nr: "97", sym: "Bk", grp: "-", prd: "7", blk: "F" },
  { nr: "98", sym: "Cf", grp: "-", prd: "7", blk: "F" },
  { nr: "99", sym: "Es", grp: "-", prd: "7", blk: "F" },
  { nr: "100", sym: "Fm", grp: "-", prd: "7", blk: "F" },
  { nr: "101", sym: "Md", grp: "-", prd: "7", blk: "F" },
  { nr: "102", sym: "No", grp: "-", prd: "7", blk: "F" },
  { nr: "103", sym: "Lr", grp: "-", prd: "7", blk: "F" },
  { nr: "104", sym: "Rf", grp: "4", prd: "7", blk: "D" },
  { nr: "105", sym: "Db", grp: "5", prd: "7", blk: "D" },
  { nr: "106", sym: "Sg", grp: "6", prd: "7", blk: "D" },
  { nr: "107", sym: "Bh", grp: "7", prd: "7", blk: "D" },
  { nr: "108", sym: "Hs", grp: "8", prd: "7", blk: "D" },
  { nr: "109", sym: "Mt", grp: "9", prd: "7", blk: "D" },
  { nr: "110", sym: "Ds", grp: "10", prd: "7", blk: "D" },
  { nr: "111", sym: "Rg", grp: "11", prd: "7", blk: "D" },
  { nr: "112", sym: "Cn", grp: "12", prd: "7", blk: "D" },
  { nr: "113", sym: "Nh", grp: "13", prd: "7", blk: "P" },
  { nr: "114", sym: "Fl", grp: "14", prd: "7", blk: "P" },
  { nr: "115", sym: "Mc", grp: "15", prd: "7", blk: "P" },
  { nr: "116", sym: "Lv", grp: "16", prd: "7", blk: "P" },
  { nr: "117", sym: "Ts", grp: "17", prd: "7", blk: "P" },
  { nr: "118", sym: "Og", grp: "18", prd: "7", blk: "P" },
  { nr: "119", sym: "Uue", grp: "1", prd: "8", blk: "S" },
  { nr: "120", sym: "Ubn", grp: "2", prd: "8", blk: "S" },
  { nr: "121", sym: "Ubu", grp: "3", prd: "8", blk: "D" },
  { nr: "122", sym: "Ubb", grp: "-", prd: "8", blk: "G" },
  { nr: "123", sym: "Ubt", grp: "-", prd: "8", blk: "G" },
  { nr: "124", sym: "Ubq", grp: "-", prd: "8", blk: "G" },
  { nr: "125", sym: "Ubp", grp: "-", prd: "8", blk: "G" },
  { nr: "126", sym: "Ubh", grp: "-", prd: "8", blk: "G" },
  { nr: "127", sym: "Ubs", grp: "-", prd: "8", blk: "G" },
  { nr: "128", sym: "Ubo", grp: "-", prd: "8", blk: "G" }
];

// Combine the static data with the translations
const translatedRows = computed(() => {
  return baseRows.map(row => ({
    ...row,
    name: t(`periodictable.elements.e${row.nr}`)
  }))
})
</script>

<i18n locale="en">
{
  "periodictable": {
    "ph": "Type numbers, names or symbols",
    "num": "Number",
    "sym": "Symbol",
    "grp": "Group",
    "prd": "Period",
    "blk": "Block",
    "name": "Name",
    "elements": {
      "e1": "Hydrogen", "e2": "Helium", "e3": "Lithium", "e4": "Beryllium", "e5": "Boron",
      "e6": "Carbon", "e7": "Nitrogen", "e8": "Oxygen", "e9": "Fluorine", "e10": "Neon",
      "e11": "Sodium", "e12": "Magnesium", "e13": "Aluminium", "e14": "Silicon", "e15": "Phosphorus",
      "e16": "Sulfur", "e17": "Chlorine", "e18": "Argon", "e19": "Potassium", "e20": "Calcium",
      "e21": "Scandium", "e22": "Titanium", "e23": "Vanadium", "e24": "Chromium", "e25": "Manganese",
      "e26": "Iron", "e27": "Cobalt", "e28": "Nickel", "e29": "Copper", "e30": "Zinc",
      "e31": "Gallium", "e32": "Germanium", "e33": "Arsenic", "e34": "Selenium", "e35": "Bromine",
      "e36": "Krypton", "e37": "Rubidium", "e38": "Strontium", "e39": "Yttrium", "e40": "Zirconium",
      "e41": "Niobium", "e42": "Molybdenum", "e43": "Technetium", "e44": "Ruthenium", "e45": "Rhodium",
      "e46": "Palladium", "e47": "Silver", "e48": "Cadmium", "e49": "Indium", "e50": "Tin",
      "e51": "Antimony", "e52": "Tellurium", "e53": "Iodine", "e54": "Xenon", "e55": "Caesium",
      "e56": "Barium", "e57": "Lanthanum", "e58": "Cerium", "e59": "Praseodymium", "e60": "Neodymium",
      "e61": "Promethium", "e62": "Samarium", "e63": "Europium", "e64": "Gadolinium", "e65": "Terbium",
      "e66": "Dysprosium", "e67": "Holmium", "e68": "Erbium", "e69": "Thulium", "e70": "Ytterbium",
      "e71": "Lutetium", "e72": "Hafnium", "e73": "Tantalum", "e74": "Tungsten", "e75": "Rhenium",
      "e76": "Osmium", "e77": "Iridium", "e78": "Platinum", "e79": "Gold", "e80": "Mercury",
      "e81": "Thallium", "e82": "Lead", "e83": "Bismuth", "e84": "Polonium", "e85": "Astatine",
      "e86": "Radon", "e87": "Francium", "e88": "Radium", "e89": "Actinium", "e90": "Thorium",
      "e91": "Protactinium", "e92": "Uranium", "e93": "Neptunium", "e94": "Plutonium", "e95": "Americium",
      "e96": "Curium", "e97": "Berkelium", "e98": "Californium", "e99": "Einsteinium", "e100": "Fermium",
      "e101": "Mendelevium", "e102": "Nobelium", "e103": "Lawrencium", "e104": "Rutherfordium", "e105": "Dubnium",
      "e106": "Seaborgium", "e107": "Bohrium", "e108": "Hassium", "e109": "Meitnerium", "e110": "Darmstadtium",
      "e111": "Roentgenium", "e112": "Copernicium", "e113": "Nihonium", "e114": "Flerovium", "e115": "Moscovium",
      "e116": "Livermorium", "e117": "Tennessine", "e118": "Oganesson", "e119": "Ununennium", "e120": "Unbinilium",
      "e121": "Unbiunium", "e122": "Unbibium", "e123": "Unbitrium", "e124": "Unbiquadium", "e125": "Unbipentium",
      "e126": "Unbihexium", "e127": "Unbiseptium", "e128": "Unbioctium"
    }
  }
}
</i18n>

<i18n locale="nl">
{
  "periodictable": {
    "ph": "Typ nummers, namen of symbolen",
    "num": "Nummer",
    "sym": "Symbool",
    "grp": "Groep",
    "prd": "Periode",
    "blk": "Blok",
    "name": "Naam",
    "elements": {
      "e1": "Waterstof", "e2": "Helium", "e3": "Lithium", "e4": "Beryllium", "e5": "Boor",
      "e6": "Koolstof", "e7": "Stikstof", "e8": "Zuurstof", "e9": "Fluor", "e10": "Neon",
      "e11": "Natrium", "e12": "Magnesium", "e13": "Aluminium", "e14": "Silicium", "e15": "Fosfor",
      "e16": "Zwavel", "e17": "Chloor", "e18": "Argon", "e19": "Kalium", "e20": "Calcium",
      "e21": "Scandium", "e22": "Titanium", "e23": "Vanadium", "e24": "Chroom", "e25": "Mangaan",
      "e26": "IJzer", "e27": "Kobalt", "e28": "Nikkel", "e29": "Koper", "e30": "Zink",
      "e31": "Gallium", "e32": "Germanium", "e33": "Arseen", "e34": "Seleen", "e35": "Broom",
      "e36": "Krypton", "e37": "Rubidium", "e38": "Strontium", "e39": "Yttrium", "e40": "Zirkonium",
      "e41": "Niobium", "e42": "Molybdeen", "e43": "Technetium", "e44": "Ruthenium", "e45": "Rhodium",
      "e46": "Palladium", "e47": "Zilver", "e48": "Cadmium", "e49": "Indium", "e50": "Tin",
      "e51": "Antimoon", "e52": "Telluur", "e53": "Jodium", "e54": "Xenon", "e55": "Cesium",
      "e56": "Barium", "e57": "Lanthaan", "e58": "Cerium", "e59": "Praseodymium", "e60": "Neodymium",
      "e61": "Promethium", "e62": "Samarium", "e63": "Europium", "e64": "Gadolinium", "e65": "Terbium",
      "e66": "Dysprosium", "e67": "Holmium", "e68": "Erbium", "e69": "Thulium", "e70": "Ytterbium",
      "e71": "Lutetium", "e72": "Hafnium", "e73": "Tantaal", "e74": "Wolfraam", "e75": "Rhenium",
      "e76": "Osmium", "e77": "Iridium", "e78": "Platina", "e79": "Goud", "e80": "Kwik",
      "e81": "Thallium", "e82": "Lood", "e83": "Bismut", "e84": "Polonium", "e85": "Astaat",
      "e86": "Radon", "e87": "Francium", "e88": "Radium", "e89": "Actinium", "e90": "Thorium",
      "e91": "Protactinium", "e92": "Uranium", "e93": "Neptunium", "e94": "Plutonium", "e95": "Americium",
      "e96": "Curium", "e97": "Berkelium", "e98": "Californium", "e99": "Einsteinium", "e100": "Fermium",
      "e101": "Mendelevium", "e102": "Nobelium", "e103": "Lawrencium", "e104": "Rutherfordium", "e105": "Dubnium",
      "e106": "Seaborgium", "e107": "Bohrium", "e108": "Hassium", "e109": "Meitnerium", "e110": "Darmstadtium",
      "e111": "Roentgenium", "e112": "Copernicium", "e113": "Nihonium", "e114": "Flerovium", "e115": "Moscovium",
      "e116": "Livermorium", "e117": "Tennessine", "e118": "Oganesson", "e119": "Ununennium", "e120": "Unbinilium",
      "e121": "Unbiunium", "e122": "Unbibium", "e123": "Unbitrium", "e124": "Unbiquadium", "e125": "Unbipentium",
      "e126": "Unbihexium", "e127": "Unbiseptium", "e128": "Unbioctium"
    }
  }
}
</i18n>