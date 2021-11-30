<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
        <div class="text-center">{{$t('othertools.dnacode.title')}}</div>
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('othertools.dnacode.long')" />
      <v-table
        :phsearch="phsearch"
        :defsearch="defsearch"
        :cols="cols"
        :rows="rows"
      />
    </div>
  </div>
</template>

<script>

import VTable from '@/components/inputs/VTable.vue'

export default {

  name: 'Countries',

  components: {
    VTable
  },

  // Data include variables to dynamically set appearnce and labels
  data: function () {
    return {

      phsearch: this.$t('dnacode.ph'),
      defsearch: 3,
      fieldsep: " | ",

      // DNA or RNA codons
      cols: [
        { field: "letter", label: this.$t('dnacode.letter'), sortable: true, width: "5%",
          parseCol: function(s) {
            // Abbreviation of amino acid is 1 letter, whitespace is optional
            return s.match(/([A-Za-z]{1})[\s]*/g);
          },
        },
        { field: "abbr", label: this.$t('dnacode.abbr'), sortable: true, width: "10%",
          parseCol: function(s) {
            // Abbreviation of amino acid is 3 letters, whitespace is optional
            return s.match(/([A-Za-z]{3})[\s]*/g);
          },
        },
        { field: "aminoacid", label: this.$t('dnacode.aminoacid'), sortable: true, width: "20%" },
        { field: "RNA", label: this.$t('dnacode.rna'), sortable: true, width: "35%",
          parseCol: function(s) {
            // RNA code is 3 letters, whitespace is optional
            return s.toUpperCase().match(/([A-Z]{3})[\s]*/g);
          },
          matchCol: (c) => {
            // If code is found in string with RNA codes
            return this.rows.findIndex( (e) => e.RNA.indexOf(c.trim()) >= 0 )
          },
        },
        { field: "DNA", label: this.$t('dnacode.dna'), sortable: true, width: "35%",
          parseCol: function(s) {
            // DNA code is 3 letters, whitespace is optional
            return s.toUpperCase().match(/([A-Z]{3})[\s]*/g);
          },
          matchCol: (c) => {
            // If code is found in string with DNA codes
            return this.rows.findIndex( (e) => e.DNA.indexOf(c.trim()) >= 0 )
          },
        },
      ],

      rows: [
        { letter: "A", abbr: "Ala", aminoacid: "Alanine", RNA: "GCU, GCC, GCA, GCG, GCN", DNA: "GCT, GCC, GCA, GCG, GCN"},
        { letter: "R", abbr: "Arg", aminoacid: "Arginine", RNA: "CGU, CGC, CGA, CGG, AGA, AGG, CGN, AGR, CGY, MGR", DNA: "CGT, CGC, CGA, CGG, AGA, AGG, CGN, AGR, CGY, MGR"},
        { letter: "N", abbr: "Asn", aminoacid: "Asparagine", RNA: "AAU, AAC, AAY", DNA: "AAT, AAC, AAY"},
        { letter: "D", abbr: "Asp", aminoacid: "Aspartic acid", RNA: "GAU, GAC, GAY", DNA: "GAT, GAC, GAY"},
        { letter: "B", abbr: "Asn or Asp", aminoacid: "Asn or Asp", RNA: "AAU, AAC, GAU, GAC, RAY", DNA: "AAT, AAC, GAT, GAC, RAY"},
        { letter: "C", abbr: "Cys", aminoacid: "Cysteine", RNA: "UGU, UGC, UGY", DNA: "TGT, TGC, TGY"},
        { letter: "Q", abbr: "Gln", aminoacid: "Glutamine", RNA: "CAA, CAG, CAR", DNA: "CAA, CAG, CAR"},
        { letter: "E", abbr: "Glu", aminoacid: "Glutamic acid", RNA: "GAA, GAG, GAR", DNA: "GAA, GAG, GAR"},
        { letter: "Z", abbr: "Gln or Glu", aminoacid: "Gln or Glu", RNA: "CAA, CAG, GAA, GAG, SAR", DNA: "CAA, CAG, GAA, GAG, SAR"},
        { letter: "G", abbr: "Gly", aminoacid: "Glycine", RNA: "GGU, GGC, GGA, GGG, GGN", DNA: "GGT, GGC, GGA, GGG, GGN"},
        { letter: "H", abbr: "His", aminoacid: "Histidine", RNA: "CAU, CAC, CAY", DNA: "CAT, CAC, CAY"},
        { letter: "-", abbr: "Start", aminoacid: "Start", RNA: "AUG", DNA: "ATG"},
        { letter: "I", abbr: "Ile", aminoacid: "Isoleucine", RNA: "AUU, AUC, AUA, AUH", DNA: "ATT, ATC, ATA, ATH"},
        { letter: "L", abbr: "Leu", aminoacid: "Leucine", RNA: "CUU, CUC, CUA, CUG, UUA, UUG, CUN, UUR, CUY, YUR", DNA: "CTT, CTC, CTA, CTG, TTA, TTG, CTN, TTR, CTY, YTR"},
        { letter: "K", abbr: "Lys", aminoacid: "Lysine", RNA: "AAA, AAG, AAR", DNA: "AAA, AAG, AAR"},
        { letter: "M", abbr: "Met", aminoacid: "Methionine", RNA: "AUG", DNA: "ATG"},
        { letter: "F", abbr: "Phe", aminoacid: "Phenylalanine", RNA: "UUU, UUC, UUY", DNA: "TTT, TTC, TTY"},
        { letter: "P", abbr: "Pro", aminoacid: "Proline", RNA: "CCU, CCC, CCA, CCG, CCN", DNA: "CCT, CCC, CCA, CCG, CCN"},
        { letter: "S", abbr: "Ser", aminoacid: "Serine", RNA: "UCU, UCC, UCA, UCG, AGU, AGC, UCN, AGY", DNA: "TCT, TCC, TCA, TCG, AGT, AGC, TCN, AGY"},
        { letter: "T", abbr: "Thr", aminoacid: "Threonine", RNA: "ACU, ACC, ACA, ACG, ACN", DNA: "ACT, ACC, ACA, ACG, ACN"},
        { letter: "W", abbr: "Trp", aminoacid: "Thryptophan", RNA: "UGG", DNA: "TGG"},
        { letter: "Y", abbr: "Tyr", aminoacid: "Tyrosine", RNA: "TAT, TAC, TAY", DNA: "TAT, TAC, TAY"},
        { letter: "V", abbr: "Val", aminoacid: "Valine", RNA: "GUU, GUC, GUA, GUG, GUN", DNA: "GTT, GTC, GTA, GTG, GTN"},
        { letter: "-", abbr: "Stop", aminoacid: "Stop", RNA: "UAA, UGA, UAG, URA, UAR", DNA: "TAA, TGA, TAG, TRA, TAR"},
      ]
    }
  },

}

</script>
