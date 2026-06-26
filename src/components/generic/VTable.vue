<template>
  <div class="row">
    <div class="col-sm-12">
      <!-- Search Configuration -->
      <div class="form-horizontal">
        <CustomDropdown
          v-model="searchIndex"
          :options="searchOptions"
          :title="t('labels.searchcol')"
        />
      </div>
      
      <!-- Search Input -->
      <div class="form-horizontal">
        <label>{{ t('labels.search') }}</label>
        <input 
          type="text" 
          v-model="searchInput" 
          ref="messageInput" 
          :placeholder="phsearch"
          @keyup.enter="handleSearch"
        >
      </div>

      <!-- Controls -->
      <div class="button-row mb-2">
        <button class="btn btn-primary" @click="handleSearch">
          {{ t('buttons.search') }}
        </button>

        <button class="btn btn-primary" @click="reset">
          {{ t('buttons.reset') }}
        </button>

        <button class="btn btn-primary" @click="showTable = !showTable">
          {{ t('buttons.showtab') }}
        </button>
      </div>

      <!-- Error Message -->
      <p v-show="errorMsg" class="errormsg">
        {{ errorMsg }}
      </p>

      <!-- Main Table -->
      <table v-show="showTable" class="table-responsive p-table mt-2">
        <thead class="v-table-header">
          <tr>
            <th
              v-for="(col, index) in cols"
              :key="index"
              :style="{ width: col.width || 'auto' }"
            >
              <div
                :class="{
                  sortable: col.sortable,
                  both: col.sortable,
                  asc: sortState.order === col.field && sortState.dir === 'asc',
                  desc: sortState.order === col.field && sortState.dir === 'desc',
                }"
                @click="col.sortable ? doSort(index) : null"
              >
                {{ col.label }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="v-table-body">
          <tr v-for="(rowIndex, idx) in sortArr" :key="idx">
            <td v-for="(col, ci) in cols" :key="ci">
              <div v-if="col.computed" v-html="col.computed(rows[rowIndex])" />
              <div v-else-if="col.image">
                <img
                  :src="col.image.src(rows[rowIndex])"
                  :height="col.image.height || 'auto'"
                  :width="col.image.width || 'auto'"
                  :alt="rows[rowIndex][col.field] || col.label"
                >
              </div>
              <div v-else-if="col.link">
                <a :href="col.link.href(rows[rowIndex])" target="_blank">
                  {{ rows[rowIndex][col.field] }}
                </a>
              </div>
              <span v-else>{{ rows[rowIndex][col.field] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import CustomDropdown from '@/components/generic/CustomDropdown.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

const props = defineProps({
  phsearch: { type: String, default: "Type searches" },
  defsearch: { type: Number, default: 0 },
  fieldsep: { type: String, default: " " },
  cols: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] }
});

// Define emits to send data to parent
const emit = defineEmits(['update:results', 'update:error', 'reset']);

// --- State ---
const sortArr = ref([]);
const searchIndex = ref(props.defsearch);
const searchInput = ref("");
const showTable = ref(true);
const errorMsg = ref("");
const sortState = reactive({ order: "", dir: "" });
const messageInput = ref(null);

// Generate search options (filter out images/non-searchable columns)
const searchOptions = computed(() => {
  return props.cols
    .map((c, idx) => (!c.image && !c.nosearch ? { value: idx, label: c.label } : null))
    .filter(opt => opt !== null);
});

// --- Initialization ---
const initSortArr = () => {
  sortArr.value = props.rows.map((_, index) => index);
  searchIndex.value = props.defsearch;
};

onMounted(() => {
  messageInput.value?.focus();
  initSortArr();
});

watch(() => props.rows, initSortArr, { deep: true });

// --- Logic Methods ---

const reset = () => {
  initSortArr();
  errorMsg.value = "";
  searchInput.value = "";
  sortState.order = "";
  sortState.dir = "";
  emit('reset');
  emit('update:results', { html: "", raw: props.rows });
};

/**
 * Builds the formatted string usually shown in the result box
 */
const getFormattedResults = (indices) => {
  let html = "";
  props.cols.forEach(col => {
    if (col.image) return;
    html += `<b>${col.label}:</b> `;
    indices.forEach(rowIndex => {
      const val = col.computed 
        ? col.computed(props.rows[rowIndex]) 
        : props.rows[rowIndex][col.field];
      html += val + props.fieldsep;
    });
    html += "<br>";
  });
  return html;
};

const handleSearch = () => {
  errorMsg.value = "";
  const col = props.cols[searchIndex.value];
  if (!col) return;

  let terms = col.parseCol 
    ? col.parseCol(searchInput.value) 
    : searchInput.value.match(/([^\s]+)/ug);

  if (!terms) {
    const msg = t('errors.invalidinput');
    errorMsg.value = msg;
    emit('update:error', msg);
    return;
  }

  const foundIndices = [];
  terms.forEach(term => {
    const cleanTerm = term.trim().toUpperCase();
    let idx = col.matchCol 
      ? col.matchCol(term) 
      : props.rows.findIndex(row => {
          const val = col.computed ? col.computed(row) : row[col.field];
          return String(val).toUpperCase() === cleanTerm;
        });

    if (idx >= 0) foundIndices.push(idx);
  });

  if (foundIndices.length === 0) {
    initSortArr();
    const msg = t('errors.noresult');
    errorMsg.value = msg;
    emit('update:error', msg);
    emit('update:results', { html: "", raw: [] });
  } else {
    sortArr.value = foundIndices;
    
    // Emit results to parent
    emit('update:results', {
      html: getFormattedResults(foundIndices),
      raw: foundIndices.map(i => props.rows[i])
    });
  }
};

const doSort = (colIdx) => {
  const col = props.cols[colIdx];
  const field = col.field;

  if (sortState.order === field) {
    sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.order = field;
    sortState.dir = 'asc';
  }

  sortArr.value.sort((a, b) => {
    let valA = col.computed ? col.computed(props.rows[a]) : props.rows[a][field];
    let valB = col.computed ? col.computed(props.rows[b]) : props.rows[b][field];
    let modifier = sortState.dir === 'asc' ? 1 : -1;

    if (col.sortable?.srtCol) return col.sortable.srtCol(valA, valB) * modifier;
    if (col.sortable?.numsort) return (parseInt(valA) - parseInt(valB)) * modifier;
    
    return valA.toString().localeCompare(valB.toString()) * modifier;
  });
};
</script>

<style scoped>
.sortable {
  cursor: pointer;
  background-position: right;
  background-repeat: no-repeat;
  padding-right: 30px !important;
}
.both { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAQAAADYWf5HAAAAkElEQVQoz7X QMQ5AQBCF4dWQSJxC5wwax1Cq1e7BAdxD5SL+Tq/QCM1oNiJidwox0355mXnG/DrEtIQ6azioNZQxI0ykPhTQIwhCR+BmBYtlK7kLJYwWCcJA9M4qdrZrd8pPjZWPtOqdRQy320YSV17OatFC4euts6z39GYMKRPCTKY9UnPQ6P+GtMRfGtPnBCiqhAeJPmkqAAAAAElFTkSuQmCC"); }
.asc { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAZ0lEQVQ4y2NgGLKgquEuFxBPAGI2ahhWCsS/gDibUoO0gPgxEP8H4ttArEyuQYxAPBdqEAxPBImTY5gjEL9DM+wTENuQahAvEO9DMwiGdwAxOymGJQLxTyD+jgWDxCMZRsEoGAVoAADeemwtPcZI2wAAAABJRU5ErkJggg=="); }
.desc { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAZUlEQVQ4y2NgGAWjYBSggaqGu5FA/BOIv2PBIPFEUgxjB+IdQPwfC94HxLykus4GiD+hGfQOiB3J8SojEE9EM2wuSJzcsFMG4ttQgx4DsRalkZENxL+AuJQaMcsGxBOAmGvopk8AVz1sLZgg0bsAAAAASUVORK5CYII="); }
</style>