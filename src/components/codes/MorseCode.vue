<template>
  <header class="page-header">
    <h1>{{ t('morsecode.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <VCard :title="t('labels.intro')">
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
