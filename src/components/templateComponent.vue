<template>

  <header class="page-header">
    <h1>{{ t('compname.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <!-- Introduction card goes here, initally closed on mobile -->
        <div v-html="t('compname.long')" />
      </VCard>
      <VCard :title="t('labels.settings')">
        <!-- Settings go here -->
        <!-- Use this for numeric input -->
        <div class="form-horizontal">
          <label>{{ t('compname.label') }}</label>
          <input type="number" v-model="num">
        </div>
        <!-- Use this for text input -->
        <div class="form-horizontal">
          <label>{{ t('compname.label') }}</label>
          <input type="text" v-model="text">
        </div>
         <!-- Use this for a range input -->
        <div class="form-horizontal">
          <label>{{ t('compname.label') }}</label>
          <input type="range" v-model="range" min="0" max="100" class="range-input">
        </div>
        <!-- Use this for radios -->
        <div class="radio-group">
          <label>{{ t('compname.label') }}</label>
          <!-- Change to radio options vertical if needed -->
          <div class="radio-options">
            <label class="radio-item">
              <input type="radio" value="1" v-model="radio">
              <span class="radio-mark"></span> {{ t('compname.label')}}
            </label>
          </div>
        </div>
        <!-- Use this for a checkbox -->
        <label class="checkbox-container mb-2">
          <input type="checkbox" v-model="chk">
          <span class="checkmark"></span>
          {{ t('compname.label') }}
        </label>
        <!-- Use this for a dropdown -->
        <!-- Options list has records with label and value  -->
         <CustomDropdown
          :title="compname.label"
          :options = "options"
          v-model = "sel"
         />
         <!-- Use this to organize settings in a visual group -->
        <div class="input-box">
        </div>
         <!-- Use form-row instead of form-horizontal if you wnant labels always to be above the input -->
        <div class="form-row">
        </div>
      </VCard>
      <VCard :title="t('labels.input')">
        <!-- Input card also has input first, error block second and button row last -->
        <!-- Input block has initial focus -->
        <textarea
          ref="messageInput"
          v-model="msg"
          :placeholder="t('labels.message')"
          rows="5"
          @input="doSomething"
          class="mb-2"
        />
        <!-- Eror and info msg -->
        <p v-if="errormsg" class="errormsg mb-2">
          {{ errormsg }}
        </p>
        <p v-else-if="infomsg" class="infomsg mb-2">
          {{ infomsg }}
        </p>
        <div class="button-row">
          <button class="btn btn-primary"  @click="doSomething">
            {{ t('buttons.action') }}
          </button>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div class="button-row mb-2">
          <!-- Or use :content="result" -->
          <CopyButton
            :content="resultsContainer"
            :is-html="true"
          />
        </div>
        <!-- Add an declare ref if CopyButton uses html -->
        <div v-if="result" class="resultbox">
          {{ result }}
        </div>
      </VCard>
      <VCard title="Preview">
     </VCard>
      <VCard :title="t('labels.addinfo')">
     </VCard>
    </div>
  </div>
</template>

<script setup>

import { ref, computed } from 'vue';
import VMenu from '@/components/generic/VMenu.vue';
import VCard from '@/components/generic/VCard.vue';
import CopyButton from '@/components/generic/CopyButton.vue';
import CustomDropdown from '@/components/generic/CustomDropdown.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

// Control intro text box on small screens
const startOpen = window.innerWidth > 768;

// Replace result, infomsg and errormsg with computed function if requested
const result=ref('')
const errormsg=ref('')
const infomsg=ref('')

// Variables used in settings and input card go here
const num=ref(0)
const txt=ref('')
const range=ref(0)
const chk=ref(true)
const radio=ref(0)
const sel=ref(0)
const msg=ref('')
const startOpen = window.innerWidth > 768;

// Onmount set initial focus and do other stuff
onMounted(() => {
  messageInput.value?.focus()
})

// Handle buttons
const doSomething = function() {
  return 'result';
}

</script>

<style scoped>
</style>

<!--
All language definitions
But info and long should be global as they are used in menus and search
-->
<i18n locale="en">
{
  "compname": {
    "label1": "Tekstverwerker",
    "msg1": "Tekstverwerker"
  }
}
</i18n>

<i18n locale="nl">
{
  "compname": {
    "label1": "Tekstverwerker",
    "msg1": "Tekstverwerker"
  }
}
</i18n>