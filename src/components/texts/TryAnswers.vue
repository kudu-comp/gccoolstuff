<template>
  <div class="d-flex flex-column mx-4">
    <!-- Section head / page title -->
    <div class="sectionhead">
      {{ $t('tryanswers.title') }}
    </div>
    <!-- Main page -->
    <div class="mainpage">
      <!-- Start with info block -->
      <div
        class="infoblock"
        v-html="$t('tryanswers.long')"
      />
      <!-- Text area input -->
      <div class="mb-2">
        <textarea
          id="msg"
          v-model="txt"
          class="form-control"
          :placeholder="$t('tryanswers.answers') + '|.'"
          rows="5"
        />
      </div>
      <!-- Formulas input-->
      <div class="mb-2">
        <label for="formulas" class="form-label mb-2">{{$t('tryanswers.formulas')}}</label>
        <textarea
          id="formulas"
          class="form-control mb-2"
          v-model="formulas"
          :placeholder="$t('tryanswers.phformulas')"
          rows="5"
        />
      </div>
      <!-- Checkbox -->
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input mb-2"
          id="onlysq"
          v-model="onlysq"
        />
        <label for="onlysq" class="form-check-label mb-2"
          >{{ $t('tryanswers.onlysq') }}</label
        >
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input mb-2"
          id="table"
          v-model="table"
        />
        <label for="table" class="form-check-label mb-2"
          >{{ $t('tryanswers.showtable') }}</label
        >
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input mb-2"
          id="long"
          v-model="long"
        />
        <label for="long" class="form-check-label mb-2">{{ $t('tryanswers.showdescr') }}</label>
      </div>
      <hr style="margin-top: 0px; margin-bottom: 2px;"/>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input mb-2"
          id="leng"
          v-model="leng"
        />
        <label for="leng" class="form-check-label mb-2"
          >{{ $t('tryanswers.tryleng') }}</label
        >
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input mb-2"
          id="first"
          v-model="first"
        />
        <label for="first" class="form-check-label mb-2"
          >{{ $t('tryanswers.tryfirst') }}</label
        >
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input mb-2"
          id="last"
          v-model="last"
        />
        <label for="last" class="form-check-label mb-2"
          >{{ $t('tryanswers.trylast') }}</label
        >
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input mb-2"
          id="rev"
          v-model="rev"
        />
        <label for="rev" class="form-check-label mb-2"
          >{{ $t('tryanswers.tryrev') }}</label
        >
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input mb-2"
          id="zero"
          v-model="zero"
        />
        <label for="zero" class="form-check-label mb-2"
          >{{ $t('tryanswers.tryzero') }}</label
        >
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input mb-2"
          id="scrabble"
          v-model="scrabble"
        />
        <label for="scrabble" class="form-check-label mb-2"
          >{{ $t('tryanswers.trysv') }}</label
        >
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input mb-2"
          id="lang"
          v-model="lang"
        />
        <label for="lang" class="form-check-label mb-2"
          >{{ $t('tryanswers.trylang') }}</label
        >
      </div>
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input mb-2"
          id="cnts"
          v-model="cnts"
        />
        <label for="cnts" class="form-check-label mb-2"
          >{{ $t('tryanswers.trycnts') }}</label
        >
      </div>
      <!-- Action buttons -->
      <button class="btn mb-2" id="btn1" @click="doAction()">{{$t('buttons.try')}}</button>
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <!-- Result area or use v-html -->
      <div v-if="result" v-html="result" class="resultbox" >
      </div>
    </div>
  </div>
</template>

<script>
import * as textHelper from "@/scripts/texthelper.js";
import { evaluate } from 'mathjs';

export default {

  name: "TryAnswers",
  
  data() {
    return {
      txt: "",
      formulas: "",
      onlysq: false,
      long: false,
      table: true,
      long: false,
      first: false,
      last: false,
      rev: false,
      zero: false,
      scrabble: false,
      lang: false,
      leng: false,
      cnts: false,
      result: "",
      errormsg: "",
      trycounter: 0
    };
  },

  methods: {

    addTry: function (description, tries) {
      if (this.long) {
        if (this.table) {
          this.result += "<th colspan='99'>" + description + "</th><tr>";
        } else {
          this.result += description + "<br>";
        }
      }
      if (this.formulas) {
        let vars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let f of this.frms) {
          // Build scope for mathjs evaluate
          let scope = {};
          let t;
          for (let i=0; i<tries.length; i++) {
            scope[vars[i]] = tries[i];
          }
          // Evaluate expression
          // If error just return the string
          try {
            t = evaluate(f, scope);
          } catch (e) {
            t = f;
          }
          // Add result to table
          if (this.table) {
            this.result += "<td style='min-width: 5ch;'>" + t + "</td>";
          } else {
            this.result += t ? t : " ";
          }
        }
      } else {
        for (let t of tries) {
          if (this.table) {
            this.result += "<td style='max-width: 5ch;'>" + t + "</td>";
          } else {
            this.result += t;
          }
        }
      }
      if (this.table) {
        this.result += "</tr>";
      } else {
        this.result += "<br>";
      }
      tries = [];
    },

    // Recursive function building an array of answers from all options
    nextAnswer: function (answers, cnt) {
      if (cnt === this.answs.length) {
        // We've the right number of answers
        // So try all calculations for all answers
        for (let f of this.funcs) {
          for (let ga of this.getanswers) {
            let trieswv = [];
            let triessq = [];
            let usedansws = "";
            for (let a of answers) {
              trieswv.push(f.f(ga.f(a)));
              triessq.push(textHelper.squareRoot(trieswv[trieswv.length - 1]));
              usedansws += ga.f(a) + " | ";
            }
            usedansws = usedansws.slice(0, -3);
            if (!this.onlysq) {
              this.addTry(
                ga.desc + " - " + this.$t('tryanswers.value') + " - " + f.desc + " - " + usedansws,
                trieswv
              );
              this.trycounter += 1;
            }
            this.addTry(
              ga.desc + " - " + this.$t('tryanswers.sq') + " - " + f.desc + " - " + usedansws,
              triessq
            );
            this.trycounter += 1;
          }
        }
      } else {
        // Add next answer
        for (let j in this.answs[cnt]) {
          answers[cnt] = this.answs[cnt][j];
          this.nextAnswer(answers, cnt + 1);
        }
      }
    },

    doAction: function () {
      // Reset
      this.errormsg = "";
      this.result = "";
      this.txt = this.txt.trim();
      this.formulas = this.formulas.trim();
      this.answs = [];
      this.frms = this.formulas.split(/\n/g);
      this.trycounter = 0;

      // Always show length, first and last letter strings
      // this.result += "Lengths : ";
      // for (let a of answers) this.result += a.length + "-";
      // this.result = this.result.slice(0, -1) + "<br>First letters : ";
      // for (let a of answers) this.result += a[0];
      // this.result += "<br>Last letters : ";
      // for (let a of answers) this.result += a.slice(-1);
      // this.result += "<br><br>";
      // this.result += "<table class='table table-striped'>";

      // Which answers to use
      // Default only the full answers
      this.getanswers = [
        {
          desc: this.$t('tryanswers.full'),
          f(a) {
            return a;
          },
        },
      ];

      // If flagged also try first and last char of the answer
      if (this.first) {
        this.getanswers.push({
          desc: this.$t('tryanswers.first'),
          f(a) {
            return a[0];
          },
        });
      }
      if (this.last) {
        this.getanswers.push({
          desc: this.$t('tryanswers.last'),
          f(a) {
            return a.slice(-1);
          },
        });
      }

      // Which alphabets to use?
      let alphs = [{ name: textHelper.alphabets[0].name }];
      if (this.lang) alphs = textHelper.alphabets;
      if (this.scrabble)
        alphs = alphs.concat(textHelper.extalphabets.slice(0, 2));
      if (this.lang && this.scrabble) alphs = textHelper.getExtAlphabets();

      // Define calculation functions for all selected alphabets
      this.funcs = [];
      for (let alph of alphs) {
        // Standard word value and square root
        this.funcs.push({
          desc: alph.name,
          f(a) {
            return textHelper.wordValue(a, false, false, alph.name);
          },
        });

        // Reverse orders
        if (this.rev) {
          this.funcs.push({
            desc: alph.name + " - " + this.$t('tryanswers.rev'),
            f(a) {
              return textHelper.wordValue(a, true, false, alph.name);
            },
          });
        }

        // Start at zero
        if (this.zero) {
          this.funcs.push({
            desc: alph.name + " - " + this.$t('tryanswers.zero'),
            f(a) {
              return textHelper.wordValue(a, false, true, alph.name);
            },
          });
        }

        // Reverse and start at zero
        if (this.rev && this.zero) {
          this.funcs.push({
            desc: alph.name + " - " + this.$t('tryanswers.rev') + " - " + this.$t('tryanswers.zero'),
            f(a) {
              return textHelper.wordValue(a, true, true, alph.name);
            },
          });
        }
      }

      // If flagged try length of the answer
      if (this.leng) {
        this.funcs.push({
          desc: this.$t('tryanswers.length'),
          f(a) {
            return a ? a.length : 0;
          },
        });
      }

      // If flagged try different counts
      if (this.cnts) {
        this.funcs.push({
          desc: this.$t('tryanswers.words'),
          f(a) {
            return a.split(/\b\s+\b/g).length;
          },
        });
        this.funcs.push({
          desc: this.$t('tryanswers.chars'),
          f(a) {
            return a.replace(/\s/g, "").length;
          },
        });
        this.funcs.push({
          desc: this.$t('tryanswers.letters'),
          f(a) {
            return textHelper.removeDiacritics(a).replace(/[^A-Za-z]/g, "")
              .length;
          },
        });
        this.funcs.push({
          desc: this.$t('tryanswers.digits'),
          f(a) {
            return a.replace(/[^0-9]/g, "").length;
          },
        });
      }

      // Split the input in answers
      // Multiple options for one answer are separated by !
      // Build a two dimensial array
      let h1 = this.txt.split(/\n/g);
      for (let i = 0; i < h1.length; i++) {
        this.answs[i] = [];
        let h2 = h1[i].split(/\|/g);
        for (let j of h2) this.answs[i].push(j);
      }
      
      // Print table headers
      if (this.table) {
        this.result += "<table class='table-tight'><thead><tr>";
        if (this.formulas) {
          for (let i = 0; i < this.frms.length; i++)
            this.result += "<th scope='col'>" + this.frms[i] + "</th>";
        } else {
          for (let i = 0; i < this.answs.length; i++)
            this.result +=
              "<th scope='col'>" +
              String.fromCharCode("A".charCodeAt(0) + i) +
              "</th>";
        }
        this.result += "</tr></thead>";
      }

      // Recursively build a set of answers
      this.nextAnswer([], 0);

      // Close the table if any
      if (this.table) this.result += "</table>";

      this.errormsg = this.trycounter + this.$t('tryanswers.finds');
    },
  },

};

</script>

<style scoped>
</style>
