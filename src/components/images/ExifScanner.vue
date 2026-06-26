<template>

  <header class="page-header">
    <h1>{{ t('exifscanner.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="t('labels.intro')" :initialOpen="startOpen">
        <div v-html="t('exifscanner.long')" />
      </VCard>
      <VCard :title="t('labels.input')">
        <div class="form-horizontal">
          <label>{{ t('labels.selectfile') }}</label>
          <input
            type="file"
            ref="file"
            accept="image/*"
            class="form-control"
            @change="selectFile"
          >
        </div>
        <p
          v-show="errormsg"
          class="errormsg mt-2"
        >
          {{ errormsg }}
        </p>
      </VCard>
      <VCard :title="t('labels.result')">
        <div class="exifinfo table-responsive">
          <h4>
            {{ t('exifscanner.info') }}
          </h4>
          <div class="mb-2">
            <table class="p-table-small">
              <tbody>
                <tr><td>{{ t('exifscanner.filename') }}</td><td>{{ Filename }}</td></tr>
                <tr><td>{{ t('exifscanner.filetype') }}</td><td>{{ Filetype }}</td></tr>
                <tr><td>{{ t('exifscanner.size') }}</td><td>{{ Filesize }}</td></tr>
                <tr><td>{{ t('exifscanner.width') }}</td><td>{{ ImageWidth }}</td></tr>
                <tr><td>{{ t('exifscanner.height') }}</td><td>{{ ImageHeight }}</td></tr>
                <tr><td>{{ t('exifscanner.npixels') }}</td><td>{{ ImagePixels }}</td></tr>
                <tr><td>{{ t('exifscanner.date') }}</td><td>{{ DateTime }}</td></tr>
                <tr><td>{{ t('exifscanner.datec') }}</td><td>{{ DateTimeOriginal }}</td></tr>
              </tbody>
            </table>
          </div>
          <h4>
            {{ t('exifscanner.cinfo') }}
          </h4>
          <div class="mb-2">
            <table class="p-table-small">
              <tbody>
                <tr><td>{{ t('exifscanner.camera') }}</td><td>{{ Camera }}</td></tr>
                <tr><td>{{ t('exifscanner.lens') }}</td><td>{{ LensModel }}</td></tr>
                <tr><td>{{ t('exifscanner.aperture') }}</td><td>{{ Aperture }}</td></tr>
                <tr><td>{{ t('exifscanner.shutter') }}</td><td>{{ Shutter }}</td></tr>
              </tbody>
            </table>
          </div>
          <h4>
            {{ t('exifscanner.desc') }}
          </h4>
          <div class="mb-2">
            <table class="p-table-small">
              <tbody>
                <tr><td>{{ t('exifscanner.title2') }}</td><td>{{ Title }}</td></tr>
                <tr><td>{{ t('exifscanner.title2') }} 2</td><td>{{ XPTitle }}</td></tr>
                <tr><td>{{ t('exifscanner.desc') }}</td><td>{{ Description }}</td></tr>
                <tr><td>{{ t('exifscanner.desc') }} 2</td><td>{{ ImageDescription }}</td></tr>
                <tr><td>{{ t('exifscanner.subject') }}</td><td>{{ XPSubject }}</td></tr>
                <tr><td>{{ t('exifscanner.about') }}</td><td>{{ About }}</td></tr>
                <tr><td>{{ t('exifscanner.keywords') }}</td><td>{{ XPKeywords }}</td></tr>
                <tr><td>{{ t('exifscanner.comment') }}</td><td>{{ XPComment }}</td></tr>
              </tbody>
            </table>
          </div>
          <h4>
            {{ t('exifscanner.ainfo') }}
          </h4>
          <div class="mb-2">
            <table class="p-table-small">
              <tbody>
                <tr><td>{{ t('exifscanner.artist') }}</td><td>{{ Artist }}</td></tr>
                <tr><td>{{ t('exifscanner.creator') }}</td><td>{{ Creator }}</td></tr>
                <tr><td>{{ t('exifscanner.author') }}</td><td>{{ XPAuthor }}</td></tr>
                <tr><td>{{ t('exifscanner.copyright') }}</td><td>{{ Copyright }}</td></tr>
              </tbody>
            </table>
          </div>
          <h4>
            {{ t('exifscanner.gps') }}
          </h4>
          <div class="mb-2">
            <table class="p-table-small">
              <tbody>
                <tr><td>{{ t('exifscanner.gps') }}</td><td>{{ GPSfromCamera }}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard title="Preview">
        <div class="image-preview">
          <img
            v-if="imageData.length > 0"
            :src="imageData"
          >
        </div>
      </VCard>
      <VCard :title="t('labels.map')">
        <MapView />
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import ExifReader from 'exifreader'
import L from "leaflet"
import * as coords from '@/scripts/coords.js'

// Component Imports
import MapView from '@/components/generic/MapView.vue'
import VCard from '@/components/generic/VCard.vue'

defineOptions({
  name: 'ExifScanner'
})

const store = useStore()
const { t } = useI18n()
const startOpen = window.innerWidth > 768;

// --- State (Data) ---
const fileurl = ref("")
const imageData = ref("")
const errormsg = ref("")
const exifdata = ref("")
const tags = ref(null)

const Filename = ref("")
const Filesize = ref("")
const Filetype = ref("")

const Title = ref("")
const XPTitle = ref("")
const XPAuthor = ref("")
const XPComment = ref("")
const XPSubject = ref("")
const XPKeywords = ref("")
const Copyright = ref("")

const DateTime = ref("")
const DateTimeOriginal = ref("")
const ImageWidth = ref(0)
const ImageHeight = ref(0)
const ImagePixels = ref(0)
const ImageDescription = ref("")

const Author = ref("")
const Artist = ref("")
const Description = ref("")
const About = ref("")
const Creator = ref("")

const Camera = ref("")
const LensModel = ref("")
const Aperture = ref("")
const Shutter = ref("")
const GPSfromCamera = ref("")

// --- Template Ref ---
const fileInput = ref(null)

onMounted(() => {
  fileInput.value?.focus()
})

// --- Helper Logic ---

// Decode a UCS2 string used in specific XP fields
const decodeUCS2 = (a) => {
  let s = ""
  for (let i = 0; i < a.length; i += 2) {
    s += String.fromCharCode(a[i + 1] * 0xFF + a[i])
  }
  return s
}

// Display the EXIF data
const displayExif = () => {
  const data = tags.value
  const noInfo = t('exifscanner.noinfo')

  const getDesc = (key) => (Object.prototype.hasOwnProperty.call(data, key)) ? data[key].description : noInfo
  const getValue = (key) => (Object.prototype.hasOwnProperty.call(data, key)) ? data[key].value : noInfo
  const getUCS2 = (key) => (Object.prototype.hasOwnProperty.call(data, key)) ? decodeUCS2(data[key].value) : noInfo

  // Get sizes and date
  DateTime.value = getDesc("DateTime")
  DateTimeOriginal.value = getDesc("DateTimeOriginal")
  ImageHeight.value = getValue("Image Height")
  ImageWidth.value = getValue("Image Width")
  ImagePixels.value = (typeof ImageHeight.value === 'number' && typeof ImageWidth.value === 'number') 
    ? ImageHeight.value * ImageWidth.value 
    : 0

  // Get camera related info
  Camera.value = getDesc("Model")
  LensModel.value = getDesc("LensModel")
  Aperture.value = getDesc("ApertureValue")
  Shutter.value = getDesc("ShutterSpeedValue")

  // Get descriptions
  Title.value = getDesc("title")
  XPTitle.value = getUCS2("XPTitle")
  Description.value = getDesc("description")
  ImageDescription.value = getDesc("ImageDescription")
  About.value = getDesc("about")
  XPComment.value = getUCS2("XPComment")
  XPSubject.value = getUCS2("XPSubject")
  XPKeywords.value = getUCS2("XPKeywords")

  // Get artist related info
  Artist.value = getDesc("Artist")
  XPAuthor.value = getUCS2("XPAuthor")
  Creator.value = getDesc("creator")
  Copyright.value = getDesc("Copyright")

  // GPS data processing
  if (Object.prototype.hasOwnProperty.call(data, "GPSLatitude") && Object.prototype.hasOwnProperty.call(data, "GPSLongitude")) {
    const lat = data.GPSLatitude.description
    const lon = data.GPSLongitude.description
    
    // Set a marker on the map stored in Vuex
    const mymap = store.state.mymap
    if (mymap) {
      const marker = L.marker([lat, lon]).addTo(mymap)
      marker.bindPopup(t('exifscanner.gps')).openPopup()
    }
    
    GPSfromCamera.value = coords.printCoordinateFromDMS({ lon, lat }, "N52 11.111 E4 11.111")
  } else {
    GPSfromCamera.value = t('exifscanner.nogps')
  }
}

// Triggered when the file is selected via the input
const selectFile = (event) => {
  errormsg.value = ""
  const input = event.target

  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()

    reader.onerror = () => {
      errormsg.value = t('errors.loadingimage')
    }

    reader.onloadend = (e) => {
      try {
        const buffer = e.target.result
        
        // Create preview URL
        const blob = new Blob([buffer], { type: file.type })
        imageData.value = URL.createObjectURL(blob)

        // Basic File Info
        Filename.value = file.name
        Filetype.value = file.type
        Filesize.value = file.size

        // Extract EXIF Tags
        tags.value = ExifReader.load(buffer)
        displayExif()

      } catch (err) {
        console.error(err)
        errormsg.value = t('exifscanner.error')
      }
    }

    reader.readAsArrayBuffer(file)
  }
}
</script>

<style scoped>

.image-preview img { max-width: 100%; max-height: 400px; display: block; margin: 0 auto; }

.exifinfo {
  font-size: 0.85em
}
h4 {
  margin-left: 0.5rem;
}

.p-table-small th:first-child,
.p-table-small td:first-child {
  width: 400px;        /* Set your preferred width */
  min-width: 80px;
  max-width: 300px;
  text-align: left;    /* Labels often look better left-aligned */
  padding-left: 0.5rem;
}

</style>

<i18n locale="en">
{
  "exifscanner": {
    "nogps": "No GPS from camera",
    "gps": "GPS from camera",
    "error": "Error loading image or EXIF data",
    "noinfo": "No info",
    "info": "Image info",
    "cinfo": "Camera info",
    "desc": "Description",
    "ainfo": "Author info",
    "filename": "Filename",
    "filetype": "Type",
    "size": "Size",
    "width": "Width",
    "height": "Height",
    "npixels": "# pixels",
    "date": "Date & time",
    "datec": "Date & time created",
    "camera": "Camera",
    "lens": "Lens",
    "aperture": "Aperture",
    "shutter": "Shutter",
    "title2": "Title",
    "subject": "Subject",
    "about": "About",
    "keywords": "Keywords",
    "comment": "Comment",
    "artist": "Artist",
    "creator": "Creator",
    "author": "Author",
    "copyright": "Copyright"
  }
}
</i18n>

<i18n locale="nl">
{
  "exifscanner": {
    "nogps": "Geen GPS van de camera",
    "gps": "GPS van de camera",
    "error": "Fout bij het laden van de foto of het ophalen van de EXIF data",
    "noinfo": "Geen info",
    "info": "Image info",
    "cinfo": "Camera info",
    "desc": "Omschrijving",
    "ainfo": "Informatie auteur",
    "filename": "Filenaam",
    "filetype": "Type",
    "size": "Grootte",
    "width": "Breedte",
    "height": "Hoogte",
    "npixels": "# pixels",
    "date": "Datum & tijd",
    "datec": "Aanmaakdatum & tijd",
    "camera": "Camera",
    "lens": "Lens",
    "aperture": "Diafragma",
    "shutter": "Sluiter",
    "title2": "Titel",
    "subject": "Onderwerp",
    "about": "Info",
    "keywords": "Keywords",
    "comment": "Commentaar",
    "artist": "Artiest",
    "creator": "Maker",
    "author": "Auteur",
    "copyright": "Copyright"
  }
}
</i18n>