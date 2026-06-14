<template>
  <header class="page-header">
    <h1 style="padding-left: 2rem;">{{ $t('wordvalue.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="$t('labels.intro')">
      <div v-html="$t('wordvalue.long')" />
    </VCard>
    <VCard :title="$t('labels.settings')">
      <div class="form-group-vertical">
        <v-alphabets-ext
          id="listofalpha"
          v-model:alphabet="selectedalphabet"
          @click="wordValue"
        />
        <label class="checkbox-container">
          <input type="checkbox" v-model="reverse" @change="wordValue">
          <span class="checkmark"></span>
          {{ $t('wordvalue.reverse') }}
        </label>
        <label class="checkbox-container">
          <input type="checkbox" v-model="startatzero" @change="wordValue">
          <span class="checkmark"></span>
          {{ $t('wordvalue.startzero') }}
        </label>
        <label class="checkbox-container">
          <input type="checkbox" v-model="replacediac" @change="wordValue">
          <span class="checkmark"></span>
          {{ $t('wordvalue.replacediac') }}
        </label>
        <label class="checkbox-container">
          <input type="checkbox" v-model="showvalues" @change="showTable">
          <span class="checkmark"></span>
          {{ $t('wordvalue.showhide') }}
        </label>        
      </div>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="$t('labels.input')">
      <textarea
        id="message"
        ref="messageInput"
        v-model="message"
        :placeholder="$t('labels.message')"
        rows="5"
        @input="wordValue"
      />
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}.
      </p>
    </VCard>
    <VCard :title="$t('labels.result')">
      <div
        v-if="result"
        v-html="result"
      />
    </VCard>
  </div>
  <div v-show="showvalues" class="card-grid mb-2">
    <VCard title="">
      <table class="p-table">
        <tbody>
          <tr>
            <td
              v-for="s in values"
              :key="s"
            >
              {{ s[0] }}
            </td>
          </tr>
          <tr>
            <td
              v-for="s in values"
              :key="s"
            >
              {{ s[1] }}
            </td>
          </tr>
        </tbody>
      </table>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title="$t('labels.addinfo')">
      <div v-html="$t('wordvalue.someinfo2')" />
    </VCard>
  </div>  
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import * as textHelper from '@/scripts/texthelper.js'
import VAlphabetsExt from '@/components/generic/VAlphabetsExt.vue'
import VCard from '@/components/generic/VCard.vue'
import VCalculate from '@/components/generic/VCalculate.vue'

// Define the name of the component
defineOptions({
  name: 'WordValue'
})

const { t } = useI18n()

// State (formerly data)
const showvalues = ref(false)
const values = ref(null)
const message = ref("")
const alphabets = ref("")
const selectedalphabet = ref("English")
const reverse = ref(false)
const startatzero = ref(false)
const replacediac = ref(true)
const result = ref("")
const showinfo = ref(true)
const errormsg = ref("")

// Template Ref for focusing the textarea
const messageInput = ref(null)

onMounted(() => {
  if (messageInput.value) {
    messageInput.value.focus()
  }
})

// Methods

// Load the table with row 0 the letters and row 1 the values
const showTable = () => {
  values.value = textHelper.getTable(
    selectedalphabet.value, 
    reverse.value, 
    startatzero.value
  )
}

// Calculate the word values and square root
const wordValue = () => {
  errormsg.value = ""
  result.value = ""

  try {

    // Update table
    showTable();

    //Check is we need to remove diacretics
    let h = "";
    if (replacediac.value) {
      h = textHelper.removeDiacritics(message.value)
    } else {
      h = message.value;    
    }

    // Do nothing if message is empty
    if (h.length === 0) return

    // Calculate value of the entire text
    let totalVal = textHelper.wordValue(
      h, 
      reverse.value, 
      startatzero.value, 
      selectedalphabet.value
    )
    
    let wordvalues = [
      { 
        name: "All text", 
        value: totalVal, 
        squareroot: textHelper.squareRoot(totalVal) 
      }
    ]

    // Split message in words
    let words = h.match(/([^\s.,:;]+)/ug) || [];

    // Calculate values for each word, skip values of 0
    words.forEach(word => {
      const val = textHelper.wordValue(
        word, 
        reverse.value, 
        startatzero.value, 
        selectedalphabet.value
      )
      if (val > 0) {
        wordvalues.push({ 
          name: word, 
          value: val, 
          squareroot: textHelper.squareRoot(val) 
        })
      }
    })

    // Display table with all values
    let html = "<table class='p-table'><thead><tr><th style='text-align:left'>Word(s)</th><th>Value</th><th>Square root</th></tr></thead>"
    
    wordvalues.forEach((item, index) => {
      html += "<tr"
      if (index === 0) html += " style='color:#6b8e23;'"
      html += "><th>" + item.name + "</th><td>" + item.value + "</td><td>" + item.squareroot + "</td></tr>"
    })
    
    html += "</table>"
    result.value = html

  } catch (e) {
    console.error(e)
    errormsg.value = t('errors.generic')
  }
}
</script>

<style scoped>
</style>
