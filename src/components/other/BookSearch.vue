<template>
  <header class="page-header">
    <h1>{{ t('booksearch.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <div class="card-stack">
      <!-- Intro Card -->
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('booksearch.long')" />
      </VCard>

      <!-- Settings/Search Card -->
      <VCard :title="t('labels.settings')">
        <SearchInput
          v-model:search="txt"
          @keyup.enter="goSearch"
        />
        <div class="radio-group mb-2">
          <label>{{ t('booksearch.sel') }}</label>
          <div class="radio-options-vertical">
            <label class="radio-item">
              <input type="radio" value="1" v-model="sel">
              <span class="radio-mark"></span> {{ t('booksearch.short') }}
            </label>
            <label class="radio-item">
              <input type="radio" value="2" v-model="sel">
              <span class="radio-mark"></span> {{ t('booksearch.extra') }}
            </label>
          </div>
        </div>
        <p v-show="errormsg" class="errormsg mb-2">
          {{ errormsg }}
        </p>
        <div class="button-row">
          <button 
            class="btn btn-primary" 
            :disabled="loading" 
            @click="goSearch"
          >
            {{ t('buttons.search') }}
          </button>
        </div>
      </VCard>
    </div>

    <!-- Results Card -->
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div v-if="result" class="resultbox" v-html="result" />
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SearchInput from '@/components/generic/SearchInput.vue';
import VCard from '@/components/generic/VCard.vue';

defineOptions({ name: 'BookSearch' });

const { t } = useI18n();

// --- State ---
const txt = ref("");
const sel = ref("1"); // "1" for short, "2" for extra
const result = ref("");
const errormsg = ref("");
const loading = ref(false);
const startOpen = window.innerWidth > 768;

const API_URL = "https://openlibrary.org/search.json?q=";

const goSearch = async () => {
  const query = txt.value.trim();
  
  // Reset
  result.value = "";
  errormsg.value = "";

  // Validation
  if (query.length < 5) {
    errormsg.value = t("Search needs to be at least 5 characters.");
    return;
  }

  loading.value = true;

  try {
    const response = await fetch(API_URL + encodeURIComponent(query));
    if (!response.ok) throw new Error("Network response was not ok");
    
    const data = await response.json();
    
    if (data.numFound === 0) {
      result.value = t('errors.noresult');
      loading.value = false;
      return;
    }

    let html = `<b>${t('booksearch.bkfnd')} ${data.numFound}</b><br>`;
    
    // Iterate through docs (limit to length returned in response)
    const docs = data.docs;
    for (let i = 0; i < docs.length; i++) {
      const book = docs[i];

      if (book.title) {
        html += `<br><strong>${t('booksearch.titles')}</strong> ${book.title}<br>`;
      }

      if (book.author_name) {
        book.author_name.forEach(author => {
          html += `<strong>${t('booksearch.author')}</strong> ${author}<br>`;
        });
      }

      if (book.isbn) {
        // In mode "1" (short), we only show the first ISBN
        const isbnsToShow = sel.value === "1" ? [book.isbn[0]] : book.isbn;
        isbnsToShow.forEach(isbn => {
          html += `<strong>${t('booksearch.isbn')}</strong> ${isbn}<br>`;
        });
      }

      // If Short mode, skip the rest of the details for this book
      if (sel.value === "1") {
        continue;
      }

      // Extra Details (Mode 2)
      if (book.first_publish_year) {
        html += `<strong>${t('booksearch.firstpub')}</strong> ${book.first_publish_year}<br>`;
      }

      if (book.language) {
        html += `<strong>${t('booksearch.lang')}</strong> ${book.language.join(", ")}<br>`;
      }

      if (book.publisher) {
        // Limiting publisher count to avoid huge blocks
        const publishers = book.publisher.slice(0, 5).join(", ");
        html += `<strong>${t('booksearch.pub')}</strong> ${publishers}<br>`;
      }

      if (book.edition_count) {
        html += `<strong>${t('booksearch.edcnt')}</strong> ${book.edition_count}<br>`;
      }
    }
    result.value = html;
  } catch (error) {
    console.error("Fetch Error:", error);
    errormsg.value = t('errors.generic');
  } finally {
    loading.value = false;
  }
};
</script>

<i18n locale="en">
{
  "booksearch": {
    "sel" : "Show results",
    "short": "Author(s), title, one ISBN",
    "extra": "Author(s), title, all ISBN, year published, languages, publishers",
    "bkfnd": "Books found: ",
    "isbn": "ISBN(s): ",
    "author": "Author(s): ",
    "titles": "Title: ",
    "firstpub": "First published: ",
    "lang": "Language(s): ",
    "pub": "Publisher(s): ",
    "edcnt": "Edition count: "
  }
}
</i18n>

<i18n locale="nl">
{
  "booksearch": {
    "sel" : "Resultaten",
    "short": "Auteur, titel, één ISBN",
    "extra": "Auteur(s), title, alle ISBN, jaar van publicatie, talen, uitgevers",
    "bkfnd": "Aantal boeken gevonden: ",
    "author": "Auteurs(s): ",
    "titles": "Titel: ",
    "firstpub": "Jaar van eerste uitgifte: ",
    "lang": "Taal: ",
    "pub": "Uitgever(s): ",
    "edcnt": "Aantal edities: "
  }
}
</i18n>