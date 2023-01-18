<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      <div class="text-center">
        {{ $t('othertools.periodictable.title') }}
      </div>
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('othertools.periodictable.long')"
      />
      <v-table
        :phsearch="phsearch"
        :cols="cols"
        :rows="rows"
      />
    </div>
  </div>
</template>

<script>

import VTable from '@/components/inputs/VTable.vue'

export default {

  name: 'PeriodicTable',

  components: {
    VTable
  },

  // Data include variables to dynamically set appearnce and labels
  data: function () {
    return {

      // PeriodicTable
      // Names up to 118 have been official by the IUPAC
      // Names after 118 are systematic element name, until 1 nov 2004 110-112 were names as below
      // { nr: "110", sym: "Uun", grp: "10", prd: "7", blk: "D", name: "Ununnilium" },
      // { nr: "111", sym: "Uuu", grp: "11", prd: "7", blk: "D", name: "Unununium" },
      // { nr: "112", sym: "Uub", grp: "12", prd: "7", blk: "D", name: "Ununbiium" },

      // placeholder for the search box
      phsearch: this.$t('periodictable.ph'),

      cols: [
        { field: "nr", label: this.$t('periodictable.num'), 
          sortable: {
            numsort: true
          },
          width: "10%" 
        },
        { field: "sym", label: this.$t('periodictable.sym'), sortable: true, width: "10%",
          parseCol: function(s) {
            // Symbol codes are 1 captial with 0 or more lowercase characters, whitespace is optional
            return s.match(/([A-Z][a-z]*[\s]*)/g);
          },
        },
        { field: "grp", label: this.$t('periodictable.grp'), 
          sortable: {
            numsort: true
          }, 
          width: "10%" 
        },
        { field: "prd", label: this.$t('periodictable.prd'), 
          sortable: {
            numsort: true
          }, 
          width: "10%" 
        },
        { field: "blk", label: this.$t('periodictable.blk'), sortable: true, width: "10%" },
        { field: "name", label: this.$t('periodictable.name'), sortable: true, width: "40%" },
      ],

      rows: [
        { nr: "1",   sym: "H",  grp: "1",  prd: "1", blk: "S", name: "Hydrogen" },
        { nr: "2",   sym: "He", grp: "18", prd: "1", blk: "S", name: "Helium" },
        { nr: "3",   sym: "Li", grp: "1",  prd: "2", blk: "S", name: "Lithium" },
        { nr: "4",   sym: "Be", grp: "2",  prd: "2", blk: "S", name: "Beryllium" },
        { nr: "5",   sym: "B",  grp: "13", prd: "2", blk: "P", name: "Boron" },
        { nr: "6",   sym: "C",  grp: "14", prd: "2", blk: "P", name: "Carbon" },
        { nr: "7",   sym: "N",  grp: "15", prd: "2", blk: "P", name: "Nitrogen" },
        { nr: "8",   sym: "O",  grp: "16", prd: "2", blk: "P", name: "Oxygen" },
        { nr: "9",   sym: "F",  grp: "17", prd: "2", blk: "P", name: "Fluorine" },
        { nr: "10",  sym: "Ne", grp: "18", prd: "2", blk: "P", name: "Neon" },
        { nr: "11",  sym: "Na", grp: "1",  prd: "3", blk: "S", name: "Sodium" },
        { nr: "12",  sym: "Mg", grp: "2",  prd: "3", blk: "S", name: "Magnesium" },
        { nr: "13",  sym: "Al", grp: "13", prd: "3", blk: "P", name: "Aluminium" },
        { nr: "14",  sym: "Si", grp: "14", prd: "3", blk: "P", name: "Silicon" },
        { nr: "15",  sym: "P",  grp: "15", prd: "3", blk: "P", name: "Phosphorus" },
        { nr: "16",  sym: "S",  grp: "16", prd: "3", blk: "P", name: "Sulfur" },
        { nr: "17",  sym: "Cl", grp: "17", prd: "3", blk: "P", name: "Chlorine" },
        { nr: "18",  sym: "Ar", grp: "18", prd: "3", blk: "P", name: "Argon" },
        { nr: "19",  sym: "K",  grp: "1",  prd: "4", blk: "S", name: "Potassium" },
        { nr: "20",  sym: "Ca", grp: "2",  prd: "4", blk: "S", name: "Calcium" },
        { nr: "21",  sym: "Sc", grp: "3",  prd: "4", blk: "D", name: "Scandium" },
        { nr: "22",  sym: "Ti", grp: "4",  prd: "4", blk: "D", name: "Titanium" },
        { nr: "23",  sym: "V",  grp: "5",  prd: "4", blk: "D", name: "Vanadium" },
        { nr: "24",  sym: "Cr", grp: "6",  prd: "4", blk: "D", name: "Chromium" },
        { nr: "25",  sym: "Mn", grp: "7",  prd: "4", blk: "D", name: "Manganese " },
        { nr: "26",  sym: "Fe", grp: "8",  prd: "4", blk: "D", name: "Iron" },
        { nr: "27",  sym: "Co", grp: "9",  prd: "4", blk: "D", name: "Cobalt" },
        { nr: "28",  sym: "Ni", grp: "10", prd: "4", blk: "D", name: "Nickel" },
        { nr: "29",  sym: "Cu", grp: "11", prd: "4", blk: "D", name: "Copper" },
        { nr: "30",  sym: "Zn", grp: "12", prd: "4", blk: "D", name: "Zinc" },
        { nr: "31",  sym: "Ga", grp: "13", prd: "4", blk: "P", name: "Gallium" },
        { nr: "32",  sym: "Ge", grp: "14", prd: "4", blk: "P", name: "Germanium " },
        { nr: "33",  sym: "As", grp: "15", prd: "4", blk: "P", name: "Arsenic" },
        { nr: "34",  sym: "Se", grp: "16", prd: "4", blk: "P", name: "Selenium" },
        { nr: "35",  sym: "Br", grp: "17", prd: "4", blk: "P", name: "Bromine" },
        { nr: "36",  sym: "Kr", grp: "18", prd: "4", blk: "P", name: "Krypton" },
        { nr: "37",  sym: "Rb", grp: "1",  prd: "5", blk: "S", name: "Rubidium" },
        { nr: "38",  sym: "Sr", grp: "2",  prd: "5", blk: "S", name: "Strontium" },
        { nr: "39",  sym: "Y",  grp: "3",  prd: "5", blk: "D", name: "Yttrium" },
        { nr: "40",  sym: "Zr", grp: "4",  prd: "5", blk: "D", name: "Zirconium " },
        { nr: "41",  sym: "Nb", grp: "5",  prd: "5", blk: "D", name: "Niobium" },
        { nr: "42",  sym: "Mo", grp: "6",  prd: "5", blk: "D", name: "Molybdenum" },
        { nr: "43",  sym: "Tc", grp: "7",  prd: "5", blk: "D", name: "Technetium" },
        { nr: "44",  sym: "Ru", grp: "8",  prd: "5", blk: "D", name: "Ruthenium" },
        { nr: "45",  sym: "Rh", grp: "9",  prd: "5", blk: "D", name: "Rhodium" },
        { nr: "46",  sym: "Pd", grp: "10", prd: "5", blk: "D", name: "Palladium" },
        { nr: "47",  sym: "Ag", grp: "11", prd: "5", blk: "D", name: "Silver" },
        { nr: "48",  sym: "Cd", grp: "12", prd: "5", blk: "D", name: "Cadmium" },
        { nr: "49",  sym: "In", grp: "13", prd: "5", blk: "P", name: "Indium" },
        { nr: "50",  sym: "Sn", grp: "14", prd: "5", blk: "P", name: "Tin" },
        { nr: "51",  sym: "Sb", grp: "15", prd: "5", blk: "P", name: "Antimony" },
        { nr: "52",  sym: "Te", grp: "16", prd: "5", blk: "P", name: "Tellurium" },
        { nr: "53",  sym: "I",  grp: "17", prd: "5", blk: "P", name: "Iodine" },
        { nr: "54",  sym: "Xe", grp: "18", prd: "5", blk: "P", name: "Xenon" },
        { nr: "55",  sym: "Cs", grp: "1",  prd: "6", blk: "S", name: "Caesium" },
        { nr: "56",  sym: "Ba", grp: "2",  prd: "6", blk: "S", name: "Barium" },
        { nr: "57",  sym: "La", grp: "3",  prd: "6", blk: "D", name: "Lanthanum" },
        { nr: "58",  sym: "Ce", grp: "-",  prd: "6", blk: "F", name: "Cerium" },
        { nr: "59",  sym: "Pr", grp: "-",  prd: "6", blk: "F", name: "Praseodymium" },
        { nr: "60",  sym: "Nd", grp: "-",  prd: "6", blk: "F", name: "Neodymium" },
        { nr: "61",  sym: "Nd", grp: "-",  prd: "6", blk: "F", name: "Neodymium" },
        { nr: "62",  sym: "Sm", grp: "-",  prd: "6", blk: "F", name: "Samarium" },
        { nr: "63",  sym: "Eu", grp: "-",  prd: "6", blk: "F", name: "Europium" },
        { nr: "64",  sym: "Gd", grp: "-",  prd: "6", blk: "F", name: "Gadolinium" },
        { nr: "65",  sym: "Tb", grp: "-",  prd: "6", blk: "F", name: "Terbium" },
        { nr: "66",  sym: "Dy", grp: "-",  prd: "6", blk: "F", name: "Dysprosium" },
        { nr: "67",  sym: "Ho", grp: "-",  prd: "6", blk: "F", name: "Holmium" },
        { nr: "68",  sym: "Er", grp: "-",  prd: "6", blk: "F", name: "Erbium" },
        { nr: "69",  sym: "Tm", grp: "-",  prd: "6", blk: "F", name: "Thulium" },
        { nr: "70",  sym: "Yb", grp: "-",  prd: "6", blk: "F", name: "Ytterbium" },
        { nr: "71",  sym: "Lu", grp: "-",  prd: "6", blk: "F", name: "Lutetium" },
        { nr: "72",  sym: "Hf", grp: "4",  prd: "6", blk: "D", name: "Hafnium" },
        { nr: "73",  sym: "Ta", grp: "5",  prd: "6", blk: "D", name: "Tantalum" },
        { nr: "74",  sym: "W",  grp: "6",  prd: "6", blk: "D", name: "Tungsten" },
        { nr: "75",  sym: "Re", grp: "7",  prd: "6", blk: "D", name: "Rhenium" },
        { nr: "76",  sym: "Os", grp: "8",  prd: "6", blk: "D", name: "Osmium" },
        { nr: "77",  sym: "Ir", grp: "9",  prd: "6", blk: "D", name: "Iridium" },
        { nr: "78",  sym: "Pt", grp: "10", prd: "6", blk: "D", name: "Platinum" },
        { nr: "79",  sym: "Au", grp: "11", prd: "6", blk: "D", name: "Gold" },
        { nr: "80",  sym: "Hg", grp: "12", prd: "6", blk: "D", name: "Mercury" },
        { nr: "81",  sym: "Tl", grp: "13", prd: "6", blk: "P", name: "Thallium" },
        { nr: "82",  sym: "Pb", grp: "14", prd: "6", blk: "P", name: "Lead" },
        { nr: "83",  sym: "Bi", grp: "15", prd: "6", blk: "P", name: "Bismuth" },
        { nr: "84",  sym: "Po", grp: "16", prd: "6", blk: "P", name: "Polonium" },
        { nr: "85",  sym: "At", grp: "17", prd: "6", blk: "P", name: "Astatine" },
        { nr: "86",  sym: "Rn", grp: "18", prd: "6", blk: "P", name: "Radon" },
        { nr: "87",  sym: "Rn", grp: "1",  prd: "7", blk: "S", name: "Francium" },
        { nr: "88",  sym: "Ra", grp: "2",  prd: "7", blk: "P", name: "Radium" },
        { nr: "89",  sym: "Ac", grp: "3",  prd: "7", blk: "D", name: "Actinium" },
        { nr: "90",  sym: "Th", grp: "-",  prd: "7", blk: "F", name: "Thorium" },
        { nr: "91",  sym: "Pa", grp: "-",  prd: "7", blk: "F", name: "Protactinium" },
        { nr: "92",  sym: "U",  grp: "-",  prd: "7", blk: "F", name: "Uranium" },
        { nr: "93",  sym: "Np", grp: "-",  prd: "7", blk: "F", name: "Neptunium" },
        { nr: "94",  sym: "Pu", grp: "-",  prd: "7", blk: "F", name: "Plutonium" },
        { nr: "95",  sym: "Am", grp: "-",  prd: "7", blk: "F", name: "Americium" },
        { nr: "96",  sym: "Cm", grp: "-",  prd: "7", blk: "F", name: "Curium" },
        { nr: "97",  sym: "Bk", grp: "-",  prd: "7", blk: "F", name: "Berkelium" },
        { nr: "98",  sym: "Cf", grp: "-",  prd: "7", blk: "F", name: "Californium" },
        { nr: "99",  sym: "Es", grp: "-",  prd: "7", blk: "F", name: "Einsteinium" },
        { nr: "100", sym: "Fm", grp: "-",  prd: "7", blk: "F", name: "Fermium" },
        { nr: "101", sym: "Md", grp: "-",  prd: "7", blk: "F", name: "Mendelevium" },
        { nr: "102", sym: "No", grp: "-",  prd: "7", blk: "F", name: "Nobelium" },
        { nr: "103", sym: "Lr", grp: "-",  prd: "7", blk: "F", name: "Lawrencium" },
        { nr: "104", sym: "Rf", grp: "4",  prd: "7", blk: "D", name: "Rutherfordium" },
        { nr: "105", sym: "Db", grp: "5",  prd: "7", blk: "D", name: "Dubnium" },
        { nr: "106", sym: "Sg", grp: "6",  prd: "7", blk: "D", name: "Seaborgium" },
        { nr: "107", sym: "Bh", grp: "7",  prd: "7", blk: "D", name: "Bohrium" },
        { nr: "108", sym: "Hs", grp: "8",  prd: "7", blk: "D", name: "Hassium" },
        { nr: "109", sym: "Mt", grp: "9",  prd: "7", blk: "D", name: "Meitnerium" },
        { nr: "110", sym: "Ds", grp: "10", prd: "7", blk: "D", name: "Darmstadtium" },
        { nr: "111", sym: "Rg", grp: "11", prd: "7", blk: "D", name: "Roentgenium" },
        { nr: "112", sym: "Cn", grp: "12", prd: "7", blk: "D", name: "Copernicium" },
        { nr: "113", sym: "Nh", grp: "13", prd: "7", blk: "P", name: "Nihonium" },
        { nr: "114", sym: "Fl", grp: "14", prd: "7", blk: "P", name: "Flerovium" },
        { nr: "115", sym: "Mc", grp: "15", prd: "7", blk: "P", name: "Moscovium" },
        { nr: "116", sym: "Lv", grp: "16", prd: "7", blk: "P", name: "Livermorium" },
        { nr: "117", sym: "Ts", grp: "17", prd: "7", blk: "P", name: "Tennessine" },
        { nr: "118", sym: "Og", grp: "18", prd: "7", blk: "P", name: "Oganesson" },
        { nr: "119", sym: "Uue", grp: "1", prd: "8", blk: "S", name: "Ununennium" },
        { nr: "120", sym: "Ubn", grp: "2", prd: "8", blk: "S", name: "Unbinilium" },
        { nr: "121", sym: "Ubu", grp: "3", prd: "8", blk: "D", name: "Unbiunium" },
        { nr: "122", sym: "Ubb", grp: "-", prd: "8", blk: "G", name: "Unbibium" },
        { nr: "123", sym: "Ubt", grp: "-", prd: "8", blk: "G", name: "Unbitrium" },
        { nr: "124", sym: "Ubq", grp: "-", prd: "8", blk: "G", name: "Unbiquadium" },
        { nr: "125", sym: "Ubp", grp: "-", prd: "8", blk: "G", name: "Unbipentium" },
        { nr: "126", sym: "Ubh", grp: "-", prd: "8", blk: "G", name: "Unbihexium" },
        { nr: "127", sym: "Ubs", grp: "-", prd: "8", blk: "G", name: "Unbiseptium" },
        { nr: "128", sym: "Ubo", grp: "-", prd: "8", blk: "G", name: "Unbioctium" }
      ]
    }
  },

}
</script>
