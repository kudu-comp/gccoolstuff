<template>
  <button 
    class="btn btn-primary" 
    :class="{ 'btn-success': copied }"
    @click="handleCopy"
    type="button"
  >
    <!-- Default Copy Icon -->
    <svg v-if="!copied" class="svg-icon" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>

    <!-- Success Checkmark Icon -->
    <svg v-else class="svg-icon" viewBox="0 0 24 24" stroke-width="3">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>

    <span v-if="!copied">
      {{t('copy')}}
    </span>
  </button>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  content: { type: [String, Object], required: true },
  isHtml: { type: Boolean, default: false },
  label: { type: String, default: '' }
});

const copied = ref(false);

/**
 * Formats an Element into clean text, preserving table structure.
 */
const formatElementToText = (element) => {
  // 1. Clone the element so we don't modify the actual UI on the page
  const clone = element.cloneNode(true);

  // 2. Process Tables in the clone
  const tables = clone.querySelectorAll('table');
  tables.forEach(table => {
    let tableText = "";
    table.querySelectorAll('tr').forEach(row => {
      tableText += Array.from(row.querySelectorAll('th, td'))
        .map(cell => cell.textContent.trim())
        .join('\t') + '\n';
    });
    // Replace the table with a text node in the clone
    table.parentNode.replaceChild(document.createTextNode('\n' + tableText + '\n'), table);
  });

  // 3. Return the text content
  // innerText is used as it respects <br> and CSS spacing/visibility
  return (clone.innerText || clone.textContent).trim();
};

const handleCopy = async () => {
  if (!props.content) return;

  let textToCopy = "";

  if (props.isHtml) {
    if (props.content instanceof HTMLElement) {
      // Use the element directly
      textToCopy = formatElementToText(props.content);
    } else {
      // If it's a string, create a temp element and then format
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = props.content;
      textToCopy = formatElementToText(tempDiv);
    }
  } else {
    // Standard string copy
    textToCopy = props.content.toString();
  }

  try {
    await navigator.clipboard.writeText(textToCopy);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (err) {
    console.error("Copy failed", err);
  }
};
</script>

<style scoped>
/* Button width stays consistent during icon change */
.btn {
  min-width: 120px;
}
</style>

<i18n locale="en">
{
  "copy": "Copy"
}
</i18n>

<i18n locale="nl">
{
  "copy": "Kopieer"
}
</i18n>