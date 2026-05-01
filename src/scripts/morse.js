// src/utils/MorseDecoder.js

import { dot } from "mathjs";

const MORSE_MAP = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
    '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
    '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
    '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
    '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
    '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
    '---..': '8', '----.': '9', '.-.-.-': '.', '--..--': ',', '---...': ':',
    '..--..': '?', '.----.': "'", '-....-': '-', '-..-.': '/', '.--.-.': '@',
    '-...-': '=', '.-.-.': '+', '-.-.--': '!'
};

// Create the reverse map automatically: { '.-': 'A', '-...': 'B', ... }
const MORSE_MAP_REV = Object.fromEntries(
    Object.entries(MORSE_MAP).map(([char, code]) => [code, char])
);
MORSE_MAP_REV[" "] = "/"; // Ensure space is mapped to slash for audio scheduling

/**
 * Decodes morse from an audio file
 */
export class MorseDecoder {
    
    constructor() {
        this.dotToHyphenRatio = 2.8;
        this.dotToPauseRatio = 3;
        this.dotToSpaceRatio = 5;
    }

    initDecoder(dotToHyphenRatio, dotToPauseRatio, dotToSpaceRatio) {
        this.dotToHyphenRatio = dotToHyphenRatio;
        this.dotToPauseRatio = dotToPauseRatio;
        this.dotToSpaceRatio = dotToSpaceRatio;
    }

    // Logic to turn a series of timings into dits and dahs
    decode(timings) {
        if (timings.length === 0) return "";

        // 1. Calculate the 'unit' (dit length)
        // We take the median of 'on' durations to find the approximate dit length
        const onDurations = timings.filter(t => t.type === 'on').map(t => t.duration);
        if (onDurations.length === 0) return "";
        const sorted = onDurations.sort((a, b) => a - b);
        const ditLength = sorted[Math.floor(sorted.length * 0.2)]; // Use a low percentile as dit base

        let result = "";
        let currentLetter = "";

        timings.forEach((t) => {
            if (t.type === 'on') {
                // If it's roughly 1 unit, it's a dit. If 2.8 (default) units, it's a dah.
                currentLetter += (t.duration > ditLength * this.dotToHyphenRatio) ? '-' : '.';
            } else {
                // Space between parts of a letter: 1 unit (ignore)
                // Space between letters: default 3 units
                // Space between words: default 5 units
                if (t.duration > ditLength * this.dotToSpaceRatio) {
                    result += (MORSE_MAP[currentLetter] || '') + ' ';
                    currentLetter = "";
                } else if (t.duration > ditLength * this.dotToPauseRatio) {
                    result += (MORSE_MAP[currentLetter] || '');
                    currentLetter = "";
                }
            }
        });

        // Add the last letter
        result += (MORSE_MAP[currentLetter] || '');
        return result.trim();
    }
    
}

/**
 * Plays plain text as Morse code audio
 */
export function playMorse(text, audioCtx, wpm = 20, frequency = 600) {

    // Create Audio Nodes
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.value = frequency;

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const duration = scheduleMorse(text.trim().toUpperCase(), audioCtx, gain, wpm, frequency);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

/**
 * Converts plain text to a Morse audtio file (WAV format)
 */
export async function downloadMorseWav(text, wpm = 20, frequency = 600) {
    const sampleRate = 44100;
    // Pre-calculate duration to set up the offline context
    const tempCtx = new OfflineAudioContext(1, 1, sampleRate);
    const tempGain = tempCtx.createGain();
    const totalSeconds = scheduleMorse(text, tempCtx, tempGain, wpm, frequency);

    // Create the actual rendering context
    const offlineCtx = new OfflineAudioContext(1, sampleRate * totalSeconds, sampleRate);
    const osc = offlineCtx.createOscillator();
    const gain = offlineCtx.createGain();
    
    osc.frequency.value = frequency;
    osc.connect(gain);
    gain.connect(offlineCtx.destination);

    scheduleMorse(text, offlineCtx, gain, wpm, frequency);
    osc.start();
    
    const renderedBuffer = await offlineCtx.startRendering();
    return audioBufferToWavBlob(renderedBuffer);
}

/**
 * Converts plain text to a Morse string
 * Example: "HELLO WORLD" -> ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
 */
export function textToMorse(text, spaceSeparator = '/') {
    return text
        .toUpperCase()
        .split('')
        .map(char => {
            if (char === ' ') return spaceSeparator; // Handle spaces with custom separator
            return (MORSE_MAP_REV[char] || '') // Map char to morse or empty if not found
        })
        .filter(code => code !== '')        // Remove empty strings
        .join(' ')                          // Separate letters with a space
        .replace(/\s\/\s/g, ' ' + spaceSeparator + ' ');         // Ensure word slashes are clean
}

/**
 * Converts a Morse string back to plain text
 * Example: ".... . .-.. .-.. --- / .-- --- .-. .-.. -.." -> "HELLO WORLD"
 */
export function morseToText(morse, spaceSeparator = '/') {
    return morse
        .trim()
        .split(' ')
        .map(code => {
            if (code === spaceSeparator) return ' ';   // Handle word separator
            return MORSE_MAP[code] || ''; // Map morse to char or empty
        })
        .join('');
}

// Generic function to schedule beeps on any AudioContext (Real or Offline)
function scheduleMorse(text, ctx, gainNode, wpm, frequency) {
    const dotDuration = 1.2 / wpm;
    const characters = text.toUpperCase().split('');
    let currentTime = ctx.currentTime + 0.1;

    gainNode.gain.setValueAtTime(0, 0);

    characters.forEach(char => {
        const code = MORSE_MAP_REV[char];

        if (!code) return; // Skip unknown characters

        if (code === '/') {
            // Word space: 7 units (we already have 3 from the end of the last letter)
            currentTime += dotDuration * 4;
        } else {
            code.split('').forEach(symbol => {
                const duration = symbol === '-' ? dotDuration * 3 : dotDuration;

                // Attack (Fade in to prevent clicking)
                gainNode.gain.setTargetAtTime(1, currentTime, 0.005);
                currentTime += duration;

                // Release (Fade out to prevent clicking)
                gainNode.gain.setTargetAtTime(0, currentTime, 0.005);

                // Gap between dits/dahs: 1 unit
                currentTime += dotDuration;
            });
            // Gap between letters: 3 units (1 already added above)
            currentTime += dotDuration * 2;
        }
    });
    return currentTime + 0.5; // Return total duration
}

// Helper: Convert AudioBuffer to WAV format (Blob)
function audioBufferToWavBlob(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    const channels = [];
    let offset = 0;
    let pos = 0;

    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"
    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);  // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit
    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length

    // write interleaved data
    for (let i = 0; i < buffer.numberOfChannels; i++)
        channels.push(buffer.getChannelData(i));

    while (pos < length) {
        for (let i = 0; i < numOfChan; i++) {
            let sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF); // scale to 16-bit
            view.setInt16(pos, sample, true);
            pos += 2;
        }
        offset++;
    }

    return new Blob([bufferArray], { type: 'audio/wav' });

    function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
    function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }
}

