<template>
  <header class="page-header">
    <h1>{{ t('chef.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <div class="card-stack">
      <!-- 1. Intro -->
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('chef.long')" />
      </VCard>

      <!-- 2. Settings -->
      <VCard :title="t('labels.settings')">
        <div class="form-group-vertical">
          <label>
            {{ t('chef.ingredients_title') }}
          </label>
          <textarea 
            v-model="ingredientsRaw" 
            :placeholder="t('chef.ingredients_placeholder')"
            rows="3"
            class="mb-2"
          ></textarea>
          <p class="infomsg">
            {{ t('chef.count') }}: {{ parsedIngredients.length }} <br>
            {{ t('chef.shortage', { count: shortageCount }) }}
          </p>
        </div>
      </VCard>

      <!-- 4. Input -->
      <VCard :title="t('labels.input')">
        <textarea
          ref="messageInput"
          v-model="msg"
          :placeholder="mode === 'write' ? t('chef.placeholder_text') : t('chef.placeholder_code')"
          rows="6"
          class="mb-2 font-monospace"
        />
        <p v-if="errormsg" class="errormsg mb-2">{{ errormsg }}</p>
        <div class="button-row">
          <button class="btn btn-primary" @click="textToChef(msg, parsedIngredients)" :disabled="shortageCount > 0">
            {{ t('chef.btn_generate') }}
          </button>
          <button class="btn btn-primary" @click="executeChef(msg)">
            {{ t('chef.btn_run') }}
          </button>
        </div>
      </VCard>
    </div>

    <div class="card-stack">
      <!-- 5. Result -->
      <VCard :title="t('labels.result')">
        <div v-if="result" class="button-row mb-2">
          <CopyButton :content="result" />
        </div>
        <div v-if="result" class="resultbox">{{ result }}</div>
      </VCard>

      <!-- 6. Add Info -->
      <VCard :title="t('labels.addinfo')">
        <div v-html="t('chef.info')" />
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import VCard from '@/components/generic/VCard.vue';
import CopyButton from '@/components/generic/CopyButton.vue';

defineOptions({ name: 'ChefInterpreter' });

const { t } = useI18n();

const startOpen = window.innerWidth > 768;
const messageInput = ref(null);
const msg = ref('');
const ingredientsRaw = ref('sugar, flour, water, salt, oil, milk, eggs');
const result = ref('');
const errormsg = ref('');

const parsedIngredients = computed(() => ingredientsRaw.value.split(',').map(i => i.trim()).filter(i => i !== ""));
const shortageCount = computed(() => Math.max(0, msg.value.length - parsedIngredients.value.length) );

// --- Chef Logic ---

const textToChef = (text, ingredientList) => {
  let recipe = "Generated ASCII Cake.\n\nIngredients.\n";
  for (let i = 0; i < text.length; i++) {
    recipe += `${text.charCodeAt(i)} g ${ingredientList[i]}\n`;
  }
  recipe += "\nMethod.\n";
  // To output A, B, C:
  // C must be at bottom of bowl, A must be at top.
  // We "Put" A last.
  for (let i = text.length - 1; i >= 0; i--) {
    recipe += `Put ${ingredientList[i]} into mixing bowl.\n`;
  }
  recipe += "Liquefy contents of the mixing bowl.\n";
  recipe += "Pour contents of the mixing bowl into the baking dish.\n\nServes 1.";
  result.value = recipe;
};

const executeChef = (chefCode) => {
  const ingredients = {};
  const mixingBowls = [[]]; // Array of Stacks
  const bakingDishes = [[]]; // Array of Stacks
  let output = "";

  const lines = chefCode.split('\n').map(l => l.trim()).filter(l => l !== "");
  let section = "header";

  for (let line of lines) {
    if (line.startsWith("Ingredients.")) { section = "ingredients"; continue; }
    if (line.startsWith("Method.")) { section = "method"; continue; }
    if (line.startsWith("Serves")) {
      // SPEC: Print baking dish from top to bottom
      // In JS, if we push to array, top is the last element
      bakingDishes.forEach(dish => {
        output += [...dish].reverse().map(val => String.fromCharCode(val)).join('');
      });
      break;
    }

    if (section === "ingredients") {
      const match = line.match(/^(\d+)\s+(?:g|ml|kg|l|cups?|tbsps?|tsps?)\s+(.+)$/i);
      if (match) ingredients[match[2].toLowerCase()] = parseInt(match[1]);
    }

    if (section === "method") {
      const putMatch = line.match(/^Put (.+) into (?:the )?(?:(\d+)(?:st|nd|rd|th) )?mixing bowl/i);
      if (putMatch) {
        const name = putMatch[1].toLowerCase();
        const bowlIdx = putMatch[2] ? parseInt(putMatch[2]) - 1 : 0;
        if (!mixingBowls[bowlIdx]) mixingBowls[bowlIdx] = [];
        if (ingredients[name] !== undefined) mixingBowls[bowlIdx].push(ingredients[name]);
      }

      // Pour Logic
      const pourMatch = line.match(/Pour contents of (?:the )?(?:(\d+)(?:st|nd|rd|th) )?mixing bowl into (?:the )?(?:(\d+)(?:st|nd|rd|th) )?baking dish/i);
      if (pourMatch) {
        const bowlIdx = pourMatch[1] ? parseInt(pourMatch[1]) - 1 : 0;
        const dishIdx = pourMatch[2] ? parseInt(pourMatch[2]) - 1 : 0;
        if (!bakingDishes[dishIdx]) bakingDishes[dishIdx] = [];
        if (mixingBowls[bowlIdx]) {
          // SPEC: top of bowl becomes top of dish (maintain order)
          bakingDishes[dishIdx] = [...bakingDishes[dishIdx], ...mixingBowls[bowlIdx]];
        }
      }
    }
  }
  result.value = output;
};

onMounted(() => messageInput.value?.focus());

</script>

<i18n locale="en">
{
  "chef": {
    "title": "Chef Esolang",
    "long": "Chef is een esoterische programmeertaal waarbij programma's eruitzien als kookrecepten. Met deze tool kun je tekst omzetten in een geldig recept of een bestaand recept 'bereiden' (uitvoeren).",
    "ingredients_title": "Ingredients for creating the recipe",
    "ingredients_placeholder": "sugar, flour, eggs...",
    "count": "Available ingredients: ",
    "shortage": "Need {count} more ingredients for this recipe",
    "placeholder_text": "Enter text to encode...",
    "placeholder_code": "Paste recipe here...",
    "btn_generate": "Write a recipe",
    "btn_run": "Bake a recipe",
    "info": "Following the <b>David Morgan-Mar</b> spec: Pouring maintains stack order, and serving prints from Top to Bottom."
  }
}
</i18n>

<i18n locale="nl">
{
  "chef": {
    "title": "Chef Esolang",
    "long": "Chef is een esoterische programmeertaal waarbij programma's eruitzien als kookrecepten. Met deze tool kun je tekst omzetten in een geldig recept of een bestaand recept 'bereiden' (uitvoeren).",
    "ingredients_title": "Ingrediënten om een recept te maken",
    "ingredients_placeholder": "suiker, bloem, eieren...",
    "count": "Aantal beschikbare ingrediënten",
    "shortage": "Nog {count} ingrediënten nodig voor dit recept",
    "placeholder_text": "Voer tekst in om te coderen...",
    "placeholder_code": "Plak recept hier...",
    "btn_generate": "Schrijf een recept",
    "btn_run": "Bereid een recept",
    "info": "Volgens de specificaties van <b>David Morgan-Mar</b>: Het overgieten (pour) behoudt de volgorde van de stapel (stack) en het serveren (serve) print van boven naar beneden."
  }
}
</i18n>