<template>

  <header class="page-header">
    <h1>{{ t('hashes.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')">
        <div v-html="t('hashes.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <CustomDropdown
            :title="t('hashes.hashes')"
            :options="hashes"
            v-model="selhash"
          />
        </div>
        <div class="form-horizontal">
          <textarea
            ref="messageRef"
            v-model="message"
            :placeholder="t('labels.message')"
            rows="5"
            @input="doSomething"
          />
        </div>
        <div class="form-horizontal mb-2">
          <label>{{ t('hashes.verify') }}</label>
          <input type="text" v-model="verify">
        </div>
        <p v-if="errormsg" class="errormsg">
          {{ errormsg }}
        </p>
        <p v-else-if="infomsg" class="infomsg">
          {{ infomsg }}
        </p>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div class="resultbox" v-if="result">
          {{ result }}
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import CryptoJS from 'crypto-js';
import VCard from '@/components/generic/VCard.vue';
import CustomDropdown from '@/components/generic/CustomDropdown.vue'
import VCalculate from '@/components/generic/VCalculate.vue';

defineOptions({
  name: 'Hashes'
});

const route = useRoute();
const { t } = useI18n();

// --- State ---
const message = ref("");
const verify = ref("");
const selhash = ref("SHA1");
const messageRef = ref(null);

const hashes = [
  { value: "MD5", label: "MD5" },
  { value: "SHA1", label: "SHA-1" },
  { value: "SHA256", label: "SHA-2 (SHA256)" },
  { value: "SHA512", label: "SHA-2 (SHA512)" },
  { value: "SHA3", label: "SHA-3" },
  { value: "RIPEMD160", label: "RIPEMD160" }
];

// --- Lifecycle ---
onMounted(() => {
  messageRef.value?.focus();
  
  // Set hash type from route params if provided
  if (route.params.hash) {
    selhash.value = route.params.hash;
  }
});

// --- Computed Result ---
const result = computed(() => {
  if (!message.value) return "";

  try {
    const msg = message.value;
    switch (selhash.value) {
      case "MD5":
        return CryptoJS.MD5(msg).toString(CryptoJS.enc.Hex);
      case "SHA1":
        return CryptoJS.SHA1(msg).toString(CryptoJS.enc.Hex);
      case "SHA256":
        return CryptoJS.SHA256(msg).toString(CryptoJS.enc.Hex);
      case "SHA512":
        return CryptoJS.SHA512(msg).toString(CryptoJS.enc.Hex);
      case "SHA3":
        return CryptoJS.SHA3(msg).toString(CryptoJS.enc.Hex);
      case "RIPEMD160":
        return CryptoJS.RIPEMD160(msg).toString(CryptoJS.enc.Hex);
      default:
        return "";
    }
  } catch (e) {
    console.error(e);
    return "";
  }
});

// --- Computed Error/Verification Message ---
const errormsg = computed(() => {
  // If there's nothing to verify against, return empty
  if (!verify.value || !result.value) return "";

  // Check if the calculated hash matches the verification string
  if (verify.value.toLowerCase() !== result.value.toLowerCase()) {
    return t('hashes.errornok');
  } else {
    return "";
  }
});

// --- Computed Error/Verification Message ---
const infomsg = computed(() => {
  // If there's nothing to verify against, return empty
  if (!verify.value || !result.value) return "";

  // Check if the calculated hash matches the verification string
  if (verify.value.toLowerCase() === result.value.toLowerCase()) {
    return t('hashes.errorok');
  } else {
    return "";
  }
});
</script>

