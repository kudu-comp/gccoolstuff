<template>
  <header class="page-header">
    <h1>{{ t('encryption.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <div class="card-stack">
      <!-- 1. Intro Card -->
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('encryption.long')" />
      </VCard>

      <!-- 2. Settings Card -->
      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
          <CustomDropdown
            :title="t('encryption.codes')"
            :options="[
              { value: 'Okto3', label: 'Okto3'},
              { value: 'AES', label: 'AES'},
              { value: 'DES', label: 'DES'},
              { value: 'TripleDES', label: 'TripleDES'},
              { value: 'Rabbit', label: 'Okto3'},
              { value: 'RC4', label: 'RC4'},
              { value: 'RC4Drop', label: 'RC4Drop'}
            ]"
            v-model="selenc"
          />
        </div>

        <div class="form-horizontal">
          <label for="key">{{ t('encryption.key') }}</label>
          <input id="key" v-model="key" type="text" class="form-control" />
        </div>

        <!-- Advanced Settings (hidden for Okto3) -->
        <div v-if="selenc !== 'Okto3'" class="advanced-settings border-top mt-2 pt-2">
          <h6 class="mb-2">{{ t('encryption.advanced') }}</h6>
          <div class="form-horizontal mb-2">
            <CustomDropdown
              :title="t('encryption.modes')"
              :options="[
                { value: '0', label: 'CBC'},
                { value: '1', label: 'CFB'},
                { value: '2', label: 'CTR'},
                { value: '3', label: 'OFB'},
                { value: '4', label: 'ECB'}
              ]"
              v-model="selmode"
            />
          </div>
          <div class="form-horizontal mb-2">
            <CustomDropdown
              :title="t('encryption.padding')"
              :options="[
                { value: '0', label: 'Pkcs7'},
                { value: '1', label: 'Iso97971'},
                { value: '2', label: 'AnsiX923'},
                { value: '3', label: 'Iso10126'},
                { value: '4', label: 'ZeroPadding'},
                { value: '5', label: 'NoPadding'}
              ]"
              v-model="selpad"
            />
          </div>
        </div>
      </VCard>
    </div>

    <div class="card-stack">
      <!-- 3. Input Card -->
      <VCard :title="t('labels.input')">
         <div class="radio-group mb-2">
          <div class="radio-options">
            <label class="radio-item">
              <input type="radio" value="encode" v-model="action">
              <span class="radio-mark"></span> {{ t('buttons.encode')}}
            </label>
            <label class="radio-item">
              <input type="radio" value="decode" v-model="action">
              <span class="radio-mark"></span> {{ t('buttons.decode')}}
            </label>
          </div>
        </div>

        <textarea
          ref="messageInput"
          v-model="message"
          class="mb-2"
          :placeholder="t('labels.message')"
          rows="5"
        />
        
        <p v-if="errormsg" class="errormsg mt-2">{{ errormsg }}</p>
      </VCard>

      <!-- 4. Result Card -->
      <VCard :title="t('labels.result')">
        <div class="button-row mb-2">
          <CopyButton :content="result" />
        </div>
        <div v-if="result" class="resultbox font-monospace">
          {{ result }}
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CryptoJS from 'crypto-js'
import VCard from '@/components/generic/VCard.vue'
import CustomDropdown from '@/components/generic/CustomDropdown.vue'
import CopyButton from '@/components/generic/CopyButton.vue'

defineOptions({ name: 'Encryption' })

const { t } = useI18n()
const route = useRoute()

// --- Constants ---
const MODES = [CryptoJS.mode.CBC, CryptoJS.mode.CFB, CryptoJS.mode.CTR, CryptoJS.mode.OFB, CryptoJS.mode.ECB]
const PADS = [CryptoJS.pad.Pkcs7, CryptoJS.pad.Iso97971, CryptoJS.pad.AnsiX923, CryptoJS.pad.Iso10126, CryptoJS.pad.ZeroPadding, CryptoJS.pad.NoPadding]

// --- State ---
const message = ref("")
const key = ref("")
const selenc = ref("Okto3")
const selmode = ref(0)
const selpad = ref(0)
const action = ref("encode") // 'encode' or 'decode'
const errormsg = ref("")
const messageInput = ref(null)
const startOpen = window.innerWidth > 768;

onMounted(() => {
  messageInput.value?.focus()
  if (route.params.enc) selenc.value = route.params.enc
})

// --- Logic Helpers ---

const encryptOkto3 = (msg, k) => {
  if (k.length < 10) return msg
  let res = ""
  let blocksize = Math.round(k.length / 6)
  let x = 0
  while (x < msg.length) {
    let num = 0
    for (let i = 0; i < blocksize && (x + i) < msg.length; i++) 
      num = (num << 8) + msg.charCodeAt(x + i)
    for (let z = 0; z < k.length; z++) {
      switch (z % 4) {
        case 0: num += k.charCodeAt(z); break
        case 1: num /= k.charCodeAt(z); break
        case 2: num -= k.charCodeAt(z); break
        case 3: num *= 500.005 * k.charCodeAt(z); break
      }
    }
    res += num.toFixed(8) + "\n"
    x += blocksize
  }
  return res.trim()
}

const decryptOkto3 = (msg, k) => {
  if (k.length < 10) return msg
  let res = ""
  let blocksize = Math.round(k.length / 6)
  let numbers = msg.match(/[-0-9.,]+/g)
  if (!numbers) return ""
  for (let nStr of numbers) {
    let n = parseFloat(nStr)
    for (let z = k.length - 1; z >= 0; z--) {
      switch (z % 4) {
        case 0: n -= k.charCodeAt(z); break
        case 1: n *= k.charCodeAt(z); break
        case 2: n += k.charCodeAt(z); break
        case 3: n /= (500.005 * k.charCodeAt(z)); break
      }
    }
    n = Math.round(n)
    let tmp = ""
    for (let i = 0; i < blocksize && n > 0; i++) {
      tmp = String.fromCharCode(n % 256) + tmp
      n = Math.floor(n / 256)
    }
    res += tmp
  }
  return res
}

// --- Computed Result ---

const result = computed(() => {
  errormsg.value = ""
  if (!message.value) return ""

  const options = { mode: MODES[selmode.value], padding: PADS[selpad.value] }

  try {
    if (action.value === 'encode') {
      // ENCODE LOGIC
      switch (selenc.value) {
        case "Okto3":
          if (key.value.length < 10) {
            errormsg.value = t('encryption.keytooshort')
            return ""
          }
          return encryptOkto3(message.value, key.value)
        case "AES": return CryptoJS.AES.encrypt(message.value, key.value, options).toString()
        case "DES": return CryptoJS.DES.encrypt(message.value, key.value, options).toString()
        case "TripleDES": return CryptoJS.TripleDES.encrypt(message.value, key.value, options).toString()
        case "Rabbit": return CryptoJS.Rabbit.encrypt(message.value, key.value, options).toString()
        case "RC4": return CryptoJS.RC4.encrypt(message.value, key.value, options).toString()
        case "RC4Drop": return CryptoJS.RC4Drop.encrypt(message.value, key.value, options).toString()
      }
    } else {
      // DECODE LOGIC
      switch (selenc.value) {
        case "Okto3":
          if (key.value.length < 10) {
            errormsg.value = t('encryption.keytooshort')
            return ""
          }
          return decryptOkto3(message.value, key.value)
        case "AES": return CryptoJS.AES.decrypt(message.value, key.value, options).toString(CryptoJS.enc.Utf8)
        case "DES": return CryptoJS.DES.decrypt(message.value, key.value, options).toString(CryptoJS.enc.Utf8)
        case "TripleDES": return CryptoJS.TripleDES.decrypt(message.value, key.value, options).toString(CryptoJS.enc.Utf8)
        case "Rabbit": return CryptoJS.Rabbit.decrypt(message.value, key.value, options).toString(CryptoJS.enc.Utf8)
        case "RC4": return CryptoJS.RC4.decrypt(message.value, key.value, options).toString(CryptoJS.enc.Utf8)
        case "RC4Drop": return CryptoJS.RC4Drop.decrypt(message.value, key.value, options).toString(CryptoJS.enc.Utf8)
      }
    }
  } catch (e) {
    errormsg.value = t('errors.generic')
    return ""
  }
  return ""
})
</script>

<style scoped>
.advanced-settings h6 {
  font-weight: bold;
  color: var(--primary-color);
}
</style>

<i18n locale="en">
{
  "encryption": {
    "codes": "Select encryption",
    "key": "Key",
    "coded": "Coded message",
    "advanced": "Advanced options",
    "modes": "Mode",
    "padding": "Padding",
    "keytooshort": "Key for Okto3 needs to be at least 10 characters"
  }
}
</i18n>

<i18n locale="nl">
{
  "encryption": {
    "codes": "Kies een encryptie",
    "key": "Sleutel",
    "coded": "Gecodeerd bericht",
    "advanced": "Geavanceerde opties",
    "modes": "Mode",
    "padding": "Padding",
    "keytooshort": "Sleutel voor Okto3 moet tenminste 10 karakters zijn"
  }
}
</i18n>