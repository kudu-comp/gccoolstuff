<template>
  <header class="page-header">
    <h1>{{ t('unitconvertor.title') }}</h1>
  </header>

  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('unitconvertor.long')" />
      </VCard>

      <VCard :title="t('labels.settings')">
        <div class="form-horizontal">
          <CustomDropdown
            v-model="cat"
            :options="categoryOptions"
            :title="t('unitconvertor.selcat')"
          />
        </div>
        <div class="desc mb-2" v-if="definedUnits[cat]">
          {{ t('unitconvertor.cat.' + definedUnits[cat].category + '.desc') }}
        </div>
        <div class="form-horizontal">
          <CustomDropdown
            v-model="idfrom"
            :options="unitOptions[cat]"
            :title="t('unitconvertor.unitfrom')"
          />
        </div>
        <div class="form-horizontal">
        <CustomDropdown
          v-model="idto"
          :options="unitOptions[cat]"
          :title="t('unitconvertor.unitto')"
        />
        </div>
      </VCard>

      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('unitconvertor.value') }}</label>
          <input type="number" v-model.number="valfrom" class="form-control">
        </div>
      </VCard>
    </div>

    <div class="card-stack">
      <VCard :title="t('labels.result')">
        <div v-if="valfrom !== null" class="result-content">
          <!-- Simple string result -->
          <h4>{{ valfrom }} {{ sourceUnit.name }} = {{ targetValue.toFixed(5) }} {{ targetUnit.name }}</h4>

          <!-- Full conversion table -->
          <table class="p-table-small">
            <thead>
              <tr>
                <th class="text-end">{{ t('unitconvertor.amount') }}</th>
                <th>{{ t('unitconvertor.symbol') }}</th>
                <th>{{ t('unitconvertor.unit') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(item, index) in allConversions" 
                :key="index"
                :class="{ 'table-primary fw-bold': index === idto }"
              >
                <td class="text-end">{{ item.value.toFixed(5) }}</td>
                <td>{{ item.symbol }}</td>
                <td>{{ item.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center p-4 text-muted">
          {{ t('labels.no_result') }}
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { definedUnits, convertUnit } from '@/scripts/unitconvertor.js';
import VCard from '@/components/generic/VCard.vue';
import CustomDropdown from '@/components/generic/CustomDropdown.vue';

defineOptions({ name: 'UnitConvertor' });

const { t } = useI18n();

// --- State ---
const valfrom = ref(1);
const cat = ref(0);
const idfrom = ref(0);
const idto = ref(0);
const startOpen = window.innerWidth > 768;

// --- Dropdown Options ---
const categoryOptions = definedUnits.map((item, index) => ({
  label: t('unitconvertor.cat.' + item.category + '.name'),
  value: index
}));

const unitOptions = definedUnits.map((group) => {
  return group.units.map((unit, index) => ({
    label: `${unit.name} (${unit.symbol})`,
    value: index
  }));
});

// --- Logic ---

// Reset unit indices when category changes
watch(cat, () => {
  idfrom.value = 0;
  idto.value = 0;
});

// Helper for current selected category
const currentCategory = computed(() => definedUnits[cat.value]);

// Helper for specific units
const sourceUnit = computed(() => currentCategory.value.units[idfrom.value]);
const targetUnit = computed(() => currentCategory.value.units[idto.value]);

// Main Target Value
const targetValue = computed(() => {
  return convertUnit(valfrom.value || 0, cat.value, idfrom.value, idto.value);
});

// Full table data
const allConversions = computed(() => {
  return currentCategory.value.units.map((u, index) => ({
    name: u.name,
    symbol: u.symbol,
    value: convertUnit(valfrom.value || 0, cat.value, idfrom.value, index)
  }));
});
</script>

<style scoped>
.desc {
  font-size: 0.9em;
}
</style>

<i18n locale="en">
{
  "unitconvertor": {
    "value": "Value",
    "selcat": "Select a category",
    "unitfrom": "From unit",
    "unitto": "To unit",
    "amount": "Amount",
    "symbol": "Symbol",
    "unit": "Unit",
    "cat" : {
      "length": {
        "name": "Length & distance",
        "desc": "The standard unit of length is meter (m). All the default prefixes like kilo (1000), hecta (100), deca (10), deci (1/10), centi (1/100) and milli (1/1000) are available. English speaking countries used / uses imperial units (inch, feet, yard, mile). Before the imperial system several other units were in use (e.g. furlong, rond or barleycorn). There are also former French and Russian units."
      },
      "temp": {
        "name": "Temperature",
        "desc": "The standard unit (SI unit) of temperature is Kelvin (K), the absolute zero. Celsius and Fahrenheit are the most frequently used. There is also a number of now obsolete temperature scales."
      },
      "area": {
        "name": "Area",
        "desc": "The standard unit of an area is the square meter (m2). An are is 10mx10m, a hectare 100mx100m. English speaking countries use imperial units like square inch, square feet, square yard and square mile."
      },
      "vol": {
        "name": "Volume",
        "desc": "The standard unit of volume is the cubic meter (m3). The liter (l or dm3) is frequently used. English speaking countries uses imperial measures like the fluid ounce (fl oz). Traditionally different volumes where used for fluid and dry goods, but this no longer the case, except for US customary volumes."
      },
      "power": {
        "name": "Power",
        "desc": "The standard unit of power is the Watt (W)."
      },
      "mass": {
        "name": "Mass & weight",
        "desc": "The standard unit of mass is the kilogram (kg). English speaking countries still use the ounce (oz) and pound (lb). The troy ounce and pound (and carat) are still used for precious stones and metals (troy). The apothecary are mostly replaced with the metric system. There are also old Russian units (before the adoption of the metric system in 1925) and anncient Roman units."
      },
      "angle": {
        "name": "Angle",
        "desc": "The standard unit of angle is radians (rad), but degrees are more commonly used."
      },
      "speed": {
        "name": "Velocity & speed",
        "desc": "The standard unit for speed is meter per second (m/s). English speaking countries still use imperial units such as feet per second (ft/s). The knot is a maritime unit."
      },
      "time": {
        "name": "Time",
        "desc": "The standard unit for time is the second (s). Most of the other units are common as well. When it comes to the exact duration of a year, there are many definitions. The Hebrew calendar also uses a few other definitions."
      }
    }
  }
}
</i18n>

<i18n locale="nl">
{
  "unitconvertor": {
    "value": "Waarde",
    "selcat": "Selecteer een categorie",
    "amount": "Hoeveelheid",
    "symbol": "Symbool",
    "unit": "Eenheid",
    "unitfrom": "Van eenheid",
    "unitto": "Naar eenheid",
    "cat" : {
      "length": {
        "name": "Lengte & afstand",
        "desc": "De standaard eenheid is meter (m). Alle bekende voorvoegels kilo (1000), hecta (100), deca (10), deci (1/10), centi (1/100) en milli (1/1000) zijn ook beschikbaar. Engels sprekende landen gebruiken imperial eenheden met als basis de yard (yd) en afgeleide eenheden zoals de inch, voet en mijl. Verder zijn er een groot aantal oude Engelse, Franse en Russische eenheden beschikbaar."
      },
      "temp": {
        "name": "Temperatuur",
        "desc": "De standaard eenheid (SI unit) van temperatuur is Kelvin (K), het absolute nulpunt. Celsius en Fahrenheit worden echter het meest gebruikt. Verder zijn er enkele nu niet meer gebruikte temperatuurschalen beschikbaar."
      },
      "area": {
        "name": "Oppervlakte",
        "desc": "De standaard eenheid van oppervlakte is de vierkante meter (m2). Een are is 10mx10m, een hectare 100mx100m. Engels sprekende landen gebruiken de square yard (yd2) als basis."
      },
      "vol": {
        "name": "Volume",
        "desc": "De standaard eenheid van volume is de kubieke meter (m3). De liter (l of dm3) wordt ook veel gebruikt. Het Engelse / Amerikaanse systeem is gebaseerd op de gallon (gal), maar gebruiken beiden een andere gallon. Het Engelse systeem heeft bovendien een gallon van voor 1824 en na 1824. Het Amerikaanse systeem voor voeding heeft ook weer afwijkende maten. Oorspronkelijk werden verschillende eenheden gebruikt voor droge en vloeibare volumes. Dit is met uitzondering van de US niet meer gebruikelijk. Verder zijn er traditionele volumes van bier- en wijnvaten beschikbaar."
      },
      "power": {
        "name": "Vermogen",
        "desc": "De standaard van vermogen is de Watt (W)."
      },
      "mass": {
        "name": "Massa & gewicht",
        "desc": "De standaard eenheid is de kilogram (kg). Het Engels / Amerikaanse systeem gebruik de pound (lb) als basis. Voor edelstenen en edelmetalen is de troy pound nog steeds de standaard. De Engelse apothecaire eenheden zijn grotendeels vervangen door het metrieke systeem. Verder zijn er oude Russische eenheden (van voor de introductie van het metrieke systeem in 1925) en historische Romeinse eenheden beschikbaar."
      },
      "angle": {
        "name": "Hoek",
        "desc": "De standaard eenheid voor hoek is radians (rad), maar graden zijn meer gebruikelijk."
      },
      "speed": {
        "name": "Snelheid",
        "desc": "De standaard eenheid van snelheid is meter per second (m/s). Het Engelse stelsel gebruikt yard per seconde (yd/s) als basis. De knoop (knot) is een maritieme eenheid."
      },
      "time": {
        "name": "Tijd",
        "desc": "De standaard eenheid voor tijd is de seconde (s). De meeste andere eenheden zijn ook veel in gebruik. Voor de lengte van een jaar zijn verschillende definities in omloop. De Hebreeuwse kalender heeft zijn eigen eenheden voor tijd."
      }
    }
  }
}
</i18n>