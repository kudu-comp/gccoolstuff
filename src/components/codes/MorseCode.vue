<template>
  <header class="page-header">
    <h1>{{ t('morsecode.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.intro')" :initialOpen="startOpen">
      <div v-html="t('morsecode.long')" />
    </VCard>
    <VCard :title="t('morsecode.textmorse')">
      <!-- Coder controls -->
      <p>{{t('morsecode.textmorsectl')}}</p>
      <div class="form-horizontal">
        <label for="spacesep">{{t('morsecode.spacesep')}}</label>
        <input type="text" v-model="spaceSep" id="spacesep"/>
      </div>
      <textarea
        class="mb-2"
        v-model="message2"
        :placeholder="t('labels.message')"
        rows="5"
        autofocus
      />
      <p
        v-show="errormsg3"
        class="errormsg"
      >
        {{ errormsg3 }}
      </p>
      <div class="button-row">
        <button class="btn btn-primary" id="btn1" :disabled="!message2" @click="toText()">{{t('buttons.decode')}}</button>
        <button class="btn btn-primary" id="btn2" :disabled="!message2" @click="toMorse()">{{t('buttons.encode')}}</button>
     </div>
    </VCard>
  </div>
  <div class="card-grid mb-2">
    <VCard :title=" t('morsecode.decodeaudio') ">
      <!-- Decoder controls -->
      <p>{{t('morsecode.decodectl')}}</p>
      <!-- File input -->
      <input
        id="file"
        type="file"
        ref="file"
        class="mb-2"
        @change="onFileChange"
      />
      <div class="form-horizontal">
        <label for="thres">{{t('morsecode.thres')}}</label>
        <input type="number" min="0" max="1" step="0.01" v-model="thres" id="thres" />
      </div>
      <div class="form-horizontal">
        <label for="dottohyphen" >{{t('morsecode.dottohyphen')}}</label>
        <input type="number" min="1" max="4" step="0.1" v-model="dotToHyphen" id="dottohyphen" />
      </div>
      <div class="form-horizontal">
        <label for="dottopause" >{{t('morsecode.dottopause')}}</label>
        <input type="number" min="1" max="4" step="0.1" v-model="dotToPause" id="dottopause" />
      </div>
      <div class="form-horizontal">
        <label for="dottospace" >{{t('morsecode.dottospace')}}</label>
        <input type="number" min="1" max="9" step="0.1" v-model="dotToSpace" id="dottospace" />
      </div>
      <div class="button-row mb-2">
        <button class="btn btn-primary" id="btn1" :disabled="isProcessing || !isLoaded" @click="decode()">{{t('buttons.decode')}}</button>
      </div>
      <!-- Error message -->
      <p
        v-show="errormsg"
        class="errormsg mt-2"
      >
        {{ errormsg }}
      </p>
      <!-- Result area or use v-html -->
      <div v-if="decodedText" class="resultbox" >
        {{ decodedText }} 
      </div>
    </VCard>
    <VCard :title=" t('morsecode.playmessage') ">
      <!-- Coder controls -->
      <p>{{t('morsecode.encodectl')}}</p>
      <div class="form-horizontal">
        <label for="wpm">{{t('morsecode.wpm')}}</label>
        <input type="number" min="5" max="50" step="1" v-model="wpm" id="wpm"/>
      </div>
      <div class="form-horizontal">
        <label for="freq">{{t('morsecode.freq')}}</label>
        <input type="number" min="100" max="15000" step="50" v-model="freq" id="freq"/>
      </div> 
      <textarea
        v-model="message"
        class="mb-2"
        :placeholder="t('labels.message')"
        rows="5"
      />
      <p
        v-show="errormsg2"
        class="errormsg mt-2"
      >
        {{ errormsg2 }}
      </p>
      <div class="button-row">
        <button class="btn btn-primary" id="btn1" :disabled="!message" @click="PlayMessage()">{{t('buttons.play')}}</button>
        <button class="btn btn-primary" id="btn2" :disabled="!message" @click="SaveMessage()">{{t('buttons.save')}}</button>
      </div>
    </VCard>      
  </div>
</template>

<script setup>

import { MorseDecoder, playMorse, downloadMorseWav, textToMorse, morseToText } from '@/scripts/morse.js';
import { ref } from 'vue';
import VCard from '@/components/generic/VCard.vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const decodedText = ref('');
const isProcessing = ref(false);
const isLoaded = ref(false);
const decoder = new MorseDecoder();
const audioBuffer = ref(null);
const thres = ref(0.15);
const dotToHyphen = ref(2.6);
const dotToPause = ref(2.4);
const dotToSpace = ref(5);
const errormsg = ref('');
const errormsg2 = ref('');
const errormsg3 = ref('');
const message = ref('');
const message2 = ref('');
const wpm = ref(20);
const freq = ref(600);
const spaceSep = ref('/');
const startOpen = window.innerWidth > 768;

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Reset state for new file
  errormsg.value = '';
  errormsg2.value = '';
  errormsg3.value = '';
  decodedText.value = '';
  isProcessing.value = true;

  const reader = new FileReader();

  // Load the file in the audio buffer ready for decode
  // Catch file reading errors (e.g. file locked or permission denied)
  // Catch unsupported audio formats or corrupted files during decoding
  reader.onerror = () => {
    handleError(t('morsecode.notsupported'));
  };

  reader.onload = async (event) => {
    try {
      isLoaded.value = true;
      const arrayBuffer = event.target.result;

      let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioBuffer.value = await audioCtx.decodeAudioData(arrayBuffer).catch(err => {
        throw new Error(t('morsecode.notsupported'));
      });

      errormsg.value = t('morsecode.fileloaded1') + audioBuffer.value.sampleRate + t('morsecode.fileloaded2') + audioBuffer.value.duration.toFixed(0) + t('morsecode.fileloaded3');
    } catch (err) {
      handleError(err.message);
    } finally {
      isProcessing.value = false;
      // Clean up audio context to save memory
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close();
      }
    }
  };

  reader.readAsArrayBuffer(file);
};

const decode = () => {

  errormsg.value = '';
  errormsg2.value = '';
  errormsg3.value = '';

  if (!audioBuffer.value) {
    handleError(t('morsecode.noaudio'));
    return;
  }
  decoder.initDecoder(dotToHyphen.value, dotToPause.value, dotToSpace.value);

  isProcessing.value = true;

  processAudio(audioBuffer.value)
    .catch(err => {
      handleError(err.message);
    })
    .finally(() => {
      isProcessing.value = false;
    });
};

const processAudio = async (audioBuffer) => {
  
  try {

    const data = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;

    if (data.length === 0) throw new Error(t('morsecode.noaudio'));

    const threshold = thres.value;
    const step = Math.floor(sampleRate / 100); 
    const timings = [];
    let isOn = false;
    let lastTime = 0;

    for (let i = 0; i < data.length; i += step) {
      let sum = 0;
      for (let j = 0; j < step && (i + j) < data.length; j++) {
        sum += data[i + j] * data[i + j];
      }
      const rms = Math.sqrt(sum / step); // This is the RMS volume

      const currentTime = (i / sampleRate) * 1000;

      if (rms > threshold && !isOn) {
        timings.push({ type: 'off', duration: currentTime - lastTime });
        isOn = true;
        lastTime = currentTime;
      } else if (rms < threshold && isOn) {
        timings.push({ type: 'on', duration: currentTime - lastTime });
        isOn = false;
        lastTime = currentTime;
      }
    }

    const result = decoder.decode(timings);
    
    if (!result) {
        throw new Error(t('morsecode.nomorse'));
    }

    decodedText.value = result;
    errormsg.value = t('morsecode.success');

  } catch (err) {
    // Re-throw to be caught by the onload try/catch
    throw err; 
  } 
};

const PlayMessage = async () => {

  errormsg.value = '';
  errormsg2.value = '';
  errormsg3.value = '';
  decodedText.value = '';

  if (!message.value.trim()) {
    handleError(t('errors.noinput'), 2);
    return;
  }

  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();
    playMorse(message.value, audioCtx, wpm.value, freq.value);
  } catch (err) {
    handleError(t('morsecode.failgen') + err.message, 2);
  }
};

const SaveMessage = async () => {
  
  errormsg.value = '';
  errormsg2.value = '';
  errormsg3.value = '';
  decodedText.value = '';
  
  if (!message.value) {
    handleError(t('errors.noinput'));
    return;
  }

  try {
    const blob = await downloadMorseWav(message.value, wpm.value, freq.value);
    
    // Create a download link and click it programmatically
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `morse_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (err) {
    handleError(t('morsecode.failgen') + err.message, 2);
  }
};

const toMorse = () => {

  errormsg.value = '';
  errormsg2.value = '';
  errormsg3.value = '';
  decodedText.value = '';

  if (!message2.value.trim()) {
    handleError(t('errors.noinput'), 3);
    return;
  }

  try {
    message2.value = textToMorse(message2.value, spaceSep.value);
  } catch (err) {
    handleError(t('errors.generic') + err.message, 3);
  }
};

const toText = () => {

  errormsg.value = '';
  errormsg2.value = '';
  errormsg3.value = '';
  decodedText.value = '';

  if (!message2.value.trim()) {
    handleError(t('errors.noinput'), 3);
    return;
  }

  try {
    message2.value = morseToText(message2.value, spaceSep.value);
  } catch (err) {
    handleError(t('errors.generic') + err.message, 3);
  }
};

const handleError = (msg, section = 1) => {
  console.error(msg);
  if (section === 1) {
    errormsg.value = msg;
  } else if (section === 2) {
    errormsg2.value = msg;
  } else {
    errormsg3.value = msg;
  }
  isProcessing.value = false;
};

</script>

<style scoped>
</style>

<!-- 
All language definitions 
But info and long should be global as they are used in menus and search 
-->
<i18n locale="en">
{
  "morsecode": {
    "decodeaudio": "Read morse from an audiofile",
    "decodectl": "The parameters below can be used to finetune the decoding of audio files. The default values work in many cases, but audio files can be hard to decode. The morse signal might be obscured by noise. The duration of the signals might vary. Use the threshold to filter the signal from noise. It works in small steps and is sensitive, so adjust carefully. The duration of a dash is normally around 3 times the duration of a dot, but it can be more or less. The duration of the pause between letters is normally around 3 times the duration of a dot. The duration of the pauze between words is normally around 7 times the duration of a dot. The default parameters are a bit lower to allow for variations.",
    "thres": "Threshold for signal detection (default 0.15)",
    "dottohyphen": "Duration of a dash in relation to a dot (default 2.6)",
    "dottopause": "Pause between letters in relation to a dot (default 2.4)",
    "dottospace": "Pause between words in relation to a dot (default 5.0)",
    "playmessage": "Play or save a message in morse code",
    "encodectl": "The parameters below can be used to finetune the playing of morse code messages. Words per minute (WPM) is the standard way to indicate the speed of morse code. The default value is 20 WPM, which is a means the word PARIS can be sent 20 times per minute. If you want to play the message faster or slower, you can adjust the WPM value. The frequency is the pitch of the sound. The default value is 600 Hz, which is a common frequency for morse code. You can adjust it to make it easier to hear.",
    "wpm": "Words per minute (default 20)",
    "freq": "Frequency in Hz (default 600)",
    "fileloaded1": "Info: File loaded successfully. Ready to decode. Samplerate: ",
    "fileloaded2": " Hz, Duration: ",
    "fileloaded3": " seconds.",
    "noaudio": "Audio file appears to be empty. Please check the file and try again.",
    "nomorse": "Could not find any Morse code signals. Try a file with a clearer 'beep' or adjust the threshold.",
    "success": "Info: Successfully decoded morse code from audio.",
    "notsupported": "Audio format not supported, no audio file or the file is corrupted.",
    "failgen": "Failed to generate morse code audio: ",
    "textmorse": "Text to morse code or morse code to text",
    "textmorsectl": "Type morse code (using . and -) and press decode to get the text. Letters in morse code should be separated by a space. Words are normally separated by a slash (/),but this can be changed. Press encode to translate text to morse code.",
    "spacesep": "Separator for words in morse code (default /)"
  }
}
</i18n>

<i18n locale="nl">
{
  "morsecode": {
    "decodeaudio": "Lees morse uit een audiofile",
    "decodectl": "De parameters hieronder kunnen worden gebruikt om het ontcijferen van audio files te verfijnen. De standaard waarden werken in veel gevallen, maar audio files kunnen moeilijk te ontcijferen zijn. Het morse signaal kan worden verstoord door ruis. De duur van de signalen kan variëren. Gebruik de drempelwaarde om het signaal te filteren van ruis. Het werkt in kleine stappen en is gevoelig, dus pas het zorgvuldig aan. De duur van een streepje is normaal gesproken ongeveer 3 keer de duur van een puntje, maar het kan meer of minder zijn. De pauze tussen twee letters is normaal gesproken ongeveer 3 keer de duur van een puntje. De duur van de ruimte tussen woorden is normaal gesproken ongeveer 7 keer de duur van een puntje. De standaard parameters zijn iets lager om variaties toe te staan.",
    "thres": "Drempelwaarde (default 0.15)",
    "dottohyphen": "Duur van een streepje in verhouding tot een puntje (default 2.6)",
    "dottopause": "Pauze tussen letters in verhouding tot een puntje (default 2.4)",
    "dottospace": "Pauze tussen woorden in verhouding tot een puntje (default 5.0)",
    "playmessage": "Speel of bewaar een bericht in morse code",
    "encodectl": "De parameters hieronder kunnen worden gebruikt om het afspelen van morse code berichten te verfijnen. Woorden per minuut (WPM) is de standaard manier om de snelheid van morse code aan te geven. De standaardwaarde is 20 WPM, wat betekent dat het woord PARIS 20 keer per minuut kan worden verzonden. Als je het bericht sneller of trager wilt afspelen, kun je de WPM-waarde aanpassen. De frequentie is de toonhoogte van het geluid. De standaardwaarde is 600 Hz, wat een veelvoorkomende frequentie is voor morse code. Je kunt deze aanpassen om het makkelijker te horen.",
    "wpm": "Woorden per minuut (default 20)",
    "freq": "Frequency in Hz (default 600)",
    "fileloaded1": "Info: File succesvol geladen. Klaar om te decoderen. Samplerate: ",
    "fileloaded2": " Hz, Tijd: ",
    "fileloaded3": " secondes.",
    "noaudio": "Audio file lijkt leeg. Controleer de file en probeer het nog eens.",
    "nomorse": "Geen morse code signalen gevonden. Probeer een file met een duidelijkere 'beep' of pas de drempelwaarde aan.",
    "success": "Info: Morse code succesvol ontcijferd.",
    "notsupported": "Audio formaat niet ondersteund, geen audio file of de file is beschadigd.",
    "failgen": "Mislukt om morse code audio te genereren: ",
    "textmorse": "Tekst naar morse en morse naar tekst",
    "textmorsectl": "Type morse code (door middel van . en -) en druk op Decodeer om de tekst te ontcifjeren. Letters in morse worden onderling gescheiden door een spatie. Woorden worden normaal gescheiden door een slash (/), maar dit kan worden aangepast. Klik op Codeer om tekst naar morse code te converteren.",
    "spacesep": "Scheidingsteken voor woorden (default /)"
  }
}
</i18n>
