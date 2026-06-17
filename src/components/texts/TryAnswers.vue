<template>

  <header class="page-header">
    <h1>{{ t('tryanswers.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.intro')">
      <div v-html="t('tryanswers.long')" />
    </VCard>
    <VCard :title="t('labels.settings')">
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="onlysq">
        <span class="checkmark"></span>
        {{ t('tryanswers.onlysq') }}
      </label>
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="leng">
        <span class="checkmark"></span>
        {{ t('tryanswers.tryleng') }}
      </label>
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="first">
        <span class="checkmark"></span>
        {{ t('tryanswers.tryfirst') }}
      </label>
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="last">
        <span class="checkmark"></span>
        {{ t('tryanswers.trylast') }}
      </label>
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="rev">
        <span class="checkmark"></span>
        {{ t('tryanswers.tryrev') }}
      </label>
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="zero">
        <span class="checkmark"></span>
        {{ t('tryanswers.tryzero') }}
      </label>
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="scrabble">
        <span class="checkmark"></span>
        {{ t('tryanswers.trysv') }}
      </label>
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="lang">
        <span class="checkmark"></span>
        {{ t('tryanswers.trylang') }}
      </label>
      <label class="checkbox-container">
        <input type="checkbox" v-model="cnts">
        <span class="checkmark"></span>
        {{ t('tryanswers.trycnts') }}
        </label>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.input')">
      <!-- Answers input-->
      <textarea
          v-model="txt"
          ref="msgInput"
          class="mb-2"
          :placeholder="t('tryanswers.answers') + '|.'"
          rows="5"
        />
      <!-- Formulas input-->
      <label for="formulas" class="form-label mb-2">{{t('tryanswers.formulas')}}</label>
      <textarea
        class="mb-2"
        v-model="formulas"
        :placeholder="t('tryanswers.phformulas')"
        rows="5"
      />
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}.
      </p>
      <div class="button-row">
        <button class="btn btn-primary" @click="doAction()">{{t('buttons.try')}}</button>
      </div>
    </VCard>
    <VCard :title="t('labels.result')">
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="table" @change="doAction()">
        <span class="checkmark"></span>
        {{ t('tryanswers.showtable') }}
      </label>
      <label class="checkbox-container mb-2">
        <input type="checkbox" v-model="long" @change="doAction()">
        <span class="checkmark"></span>
        {{ t('tryanswers.showdescr') }}
      </label>
      <div v-if="result" v-html="result" class="resultbox" >
      </div>
    </VCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { evaluate } from 'mathjs';
import * as textHelper from "@/scripts/texthelper.js";
import VCard from '@/components/generic/VCard.vue';

defineOptions({
  name: "TryAnswers"
});

const { t } = useI18n();

// --- State (Data) ---
const txt = ref("");
const formulas = ref("");
const onlysq = ref(false);
const long = ref(false);
const table = ref(true);
const first = ref(false);
const last = ref(false);
const rev = ref(false);
const zero = ref(false);
const scrabble = ref(false);
const lang = ref(false);
const leng = ref(false);
const cnts = ref(false);
const result = ref("");
const errormsg = ref("");
const trycounter = ref(0);

// Implicit state variables (internal logic)
let answs = [];
let frms = [];
let funcs = [];
let getanswers = [];

// --- Template Refs ---
const msgInput = ref(null);

onMounted(() => {
  msgInput.value?.focus();
});

// --- Methods ---

const addTry = (description, tries) => {
  if (long.value) {
    if (table.value) {
      result.value += `<th colspan='99'>${description}</th><tr>`;
    } else {
      result.value += description + "<br>";
    }
  }

  if (formulas.value) {
    const vars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let f of frms) {
      // Build scope for mathjs evaluate
      let scope = {};
      for (let i = 0; i < tries.length; i++) {
        scope[vars[i]] = tries[i];
      }

      let evaluatedVal;
      try {
        evaluatedVal = evaluate(f, scope);
      } catch (e) {
        evaluatedVal = f;
      }

      if (table.value) {
        result.value += `<td style='min-width: 5ch;'>${evaluatedVal}</td>`;
      } else {
        result.value += evaluatedVal ?? " ";
      }
    }
  } else {
    for (let tryVal of tries) {
      if (table.value) {
        result.value += `<td style='max-width: 5ch;'>${tryVal}</td>`;
      } else {
        result.value += tryVal;
      }
    }
  }

  if (table.value) {
    result.value += "</tr>";
  } else {
    result.value += "<br>";
  }
};

const nextAnswer = (currentAnswers, cnt) => {
  if (cnt === answs.length) {
    // We've reached the right number of answers, try all calculations
    for (let f of funcs) {
      for (let ga of getanswers) {
        let trieswv = [];
        let triessq = [];
        let usedansws = "";

        for (let a of currentAnswers) {
          const transformedAnswer = ga.f(a);
          const calculatedValue = f.f(transformedAnswer);

          trieswv.push(calculatedValue);
          triessq.push(textHelper.squareRoot(calculatedValue));
          usedansws += transformedAnswer + " | ";
        }

        usedansws = usedansws.slice(0, -3);

        if (!onlysq.value) {
          addTry(
            `${ga.desc} - ${t('tryanswers.value')} - ${f.desc} - ${usedansws}`,
            trieswv
          );
          trycounter.value += 1;
        }

        addTry(
          `${ga.desc} - ${t('tryanswers.sq')} - ${f.desc} - ${usedansws}`,
          triessq
        );
        trycounter.value += 1;
      }
    }
  } else {
    // Recursively add next answer option
    for (let j in answs[cnt]) {
      currentAnswers[cnt] = answs[cnt][j];
      nextAnswer(currentAnswers, cnt + 1);
    }
  }
};

const doAction = () => {
  // Reset
  errormsg.value = "";
  result.value = "";
  const cleanedTxt = txt.value.trim();
  const cleanedFormulas = formulas.value.trim();

  answs = [];
  frms = cleanedFormulas ? cleanedFormulas.split(/\n/g) : [];
  trycounter.value = 0;

  if (!cleanedTxt) return;

  // Which extraction functions to use
  getanswers = [
    {
      desc: t('tryanswers.full'),
      f: (a) => a,
    },
  ];

  if (first.value) {
    getanswers.push({
      desc: t('tryanswers.first'),
      f: (a) => (a ? a[0] : ""),
    });
  }
  if (last.value) {
    getanswers.push({
      desc: t('tryanswers.last'),
      f: (a) => (a ? a.slice(-1) : ""),
    });
  }

  // Which alphabets to use?
  let alphs = [{ name: textHelper.alphabets[0].name }];
  if (lang.value) alphs = textHelper.alphabets;

  if (scrabble.value) {
    alphs = alphs.concat(textHelper.extalphabets.slice(0, 2));
  }
  if (lang.value && scrabble.value) {
    alphs = textHelper.getExtAlphabets();
  }

  // Define calculation functions
  funcs = [];
  for (let alph of alphs) {
    funcs.push({
      desc: alph.name,
      f: (a) => textHelper.wordValue(a, false, false, alph.name),
    });

    if (rev.value) {
      funcs.push({
        desc: `${alph.name} - ${t('tryanswers.rev')}`,
        f: (a) => textHelper.wordValue(a, true, false, alph.name),
      });
    }

    if (zero.value) {
      funcs.push({
        desc: `${alph.name} - ${t('tryanswers.zero')}`,
        f: (a) => textHelper.wordValue(a, false, true, alph.name),
      });
    }

    if (rev.value && zero.value) {
      funcs.push({
        desc: `${alph.name} - ${t('tryanswers.rev')} - ${t('tryanswers.zero')}`,
        f: (a) => textHelper.wordValue(a, true, true, alph.name),
      });
    }
  }

  if (leng.value) {
    funcs.push({
      desc: t('tryanswers.length'),
      f: (a) => (a ? a.length : 0),
    });
  }

  if (cnts.value) {
    funcs.push({
      desc: t('tryanswers.words'),
      f: (a) => a.split(/\b\s+\b/g).length,
    });
    funcs.push({
      desc: t('tryanswers.chars'),
      f: (a) => a.replace(/\s/g, "").length,
    });
    funcs.push({
      desc: t('tryanswers.letters'),
      f: (a) => textHelper.removeDiacritics(a).replace(/[^A-Za-z]/g, "").length,
    });
    funcs.push({
      desc: t('tryanswers.digits'),
      f: (a) => a.replace(/[^0-9]/g, "").length,
    });
  }

  // Parse input text into answer options
  let lines = cleanedTxt.split(/\n/g);
  for (let i = 0; i < lines.length; i++) {
    answs[i] = lines[i].split(/\|/g);
  }

  // Print table headers
  if (table.value) {
    result.value += "<table class='table-tight'><thead><tr>";
    if (cleanedFormulas) {
      for (let f of frms) {
        result.value += `<th scope='col'>${f}</th>`;
      }
    } else {
      for (let i = 0; i < answs.length; i++) {
        const letter = String.fromCharCode("A".charCodeAt(0) + i);
        result.value += `<th scope='col'>${letter}</th>`;
      }
    }
    result.value += "</tr></thead>";
  }

  // Start recursion
  nextAnswer([], 0);

  if (table.value) result.value += "</table>";

  errormsg.value = trycounter.value + t('tryanswers.finds');
};
</script>
