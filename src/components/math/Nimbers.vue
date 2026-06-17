<template>

  <header class="page-header">
    <h1>{{ t('nimbers.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('nimbers.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('nimbers.num1') }}</label>
          <input type="number" v-model="x" ref="xInput">
        </div>
        <div class="form-horizontal">
          <label>{{ t('nimbers.num2') }}</label>
          <input type="number" v-model="y">
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
        <div class="button-row mt-2">
          <v-calculate @calculate = "nimberProduct"></v-calculate>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">     
        <p class="card resultbox" v-if="prod">
          {{ t('nimbers.prod') }} <strong>{{ prod }}</strong>.<br>
          {{ t('nimbers.sum') }} <strong>{{ sum }}</strong>.
        </p>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VCard from '@/components/generic/VCard.vue' 
import VCalculate from '@/components/generic/VCalculate.vue' 
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  useScope: 'local'
});

defineOptions({
  name: 'Nimbers'
})

// --- State ---
const errormsg = ref("")
const x = ref(0)
const y = ref(0)
const prod = ref(0)
const sum = ref(0)

const phpurl = `${window.location.protocol}//${window.location.hostname}/math/nimbermultiplication.php`

// --- Template Refs ---
const xInput = ref(null)

onMounted(() => {
  xInput.value?.focus()
})

// --- Methods ---

/**
 * Performs the nimber calculation via PHP backend
 */
const nimberProduct = async () => {
  errormsg.value = ""
  
  const payload = {
    x: x.value,
    y: y.value,
  }

  try {
    const response = await fetch(phpurl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) throw new Error("Network response was not ok")

    const data = await response.json()
    prod.value = data.nimberproduct
    sum.value = data.nimbersum
  } catch (error) {
    console.error('Error fetching nimber data:', error)
    errormsg.value = t('errors.generic')
  }
}
</script>

<style scoped>
</style>
