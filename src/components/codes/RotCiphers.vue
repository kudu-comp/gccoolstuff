<template>

 <header class="page-header">
    <h1>{{ $t('rotciphers.title') }}</h1>
  </header>
  <div class="card-grid mb-2">
    <div class="card-stack">
      <VCard :title="$t('labels.intro')">
        <div v-html="$t('rotciphers.long')" />
      </VCard>
      <VCard :title="$t('labels.settings')">
        <div class="input-wrapper">
          <div class="radio-group">
          <label>{{$t('rotciphers.selmethod')}}</label>
          <div class="radio-options-vertical">
            <label class="radio-item">
              <input type="radio" value="0" v-model="selalph">
              <span class="radio-mark"></span> {{$t('rotciphers.rot13')}}
            </label>
            <label class="radio-item">
              <input type="radio" value="1" v-model="selalph">
              <span class="radio-mark"></span> {{$t('rotciphers.rot5')}}
            </label>
            <label class="radio-item">
              <input type="radio" value="2" v-model="selalph">
              <span class="radio-mark"></span> {{$t('rotciphers.rot47')}}
            </label>
            <label class="radio-item">
              <input type="radio" value="3" v-model="selalph">
              <span class="radio-mark"></span> {{$t('rotciphers.hexa')}}
            </label>
            <label class="radio-item">
              <input type="radio" value="4" v-model="selalph">
              <span class="radio-mark"></span> {{$t('rotciphers.custom')}}
            </label>
            <div v-show='selalph === "4"'>
              <label>{{$t('rotciphers.other')}}</label>
              <input
                v-model="other"
                type="text"
              >
            </div>
            <div class="button-row">
              <button id="convert" class="btn btn-primary"  @click="generate">
                {{ $t('buttons.decode') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      </VCard>
      <VCard :title="$t('labels.input')">
        <textarea class="form-control mb-2" lines="5" v-model="txt" id="txt" ref="txt"></textarea>
        <p
          v-show="errormsg"
          class="errormsg"
        >
          {{ errormsg }}
        </p>
      </VCard>
    </div>
    <div class="card-stack">
      <VCard :title="$t('labels.result')">
        <div
          v-if="result"
          class="card resultbox"
          v-html="result"
          style="overflow-wrap: break-word"
        />
      </VCard>
    </div>
  </div>
</template>

<script>

import VCard from '@/components/generic/VCard.vue';

export default {

  name: 'RotCiphers',

    components: { VCard }
,  // Data include variables to dynamically set appearnce and labels
  data: function () {
    return {
      txt: "",
      selalph: "0",
      result: "",
      errormsg: "",
      alf: [
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "0123456789",
        "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
        "0123456789ABCDEF"
      ],
      other: ""
    };
  },

  mounted: function() {
    this.$refs.txt.focus();
  },
  
  methods: {

    rotate: function (alf, txt, rot) {
      let res = "";
      for (let c of txt) {
        let idx = alf.indexOf(c);
        if (idx >= 0) {
          res += alf[(idx + rot) % alf.length];
        } else {
          res += c;
        }
      }
      return res;
    },

    generate: function () {
      // Reset
      this.result = "<table>";
      this.errormsg = "";

      // Assign alphabet
      let alphabet = this.selalph !== "4" ? this.alf[parseInt(this.selalph)] : this.other.trim();
      let txt = this.txt;
      if (this.selalph !== "2") txt = txt.toUpperCase();

      this.result +=
        "<tr style='font-weight: bold'><td style='margin-right: 1rem;'>Default " +
        Math.floor(alphabet.length / 2).toString() +
        "</td><td>" +
        this.rotate(alphabet, txt, Math.floor(alphabet.length / 2)) +
        "</td></tr>";
      // Print rotations
      for (let i = 1; i <= alphabet.length; i++) {
        this.result +=
          "<tr><td style='margin-right: 1rem;'>ROT " +
          i.toString() +
          "</td><td>" +
          this.rotate(alphabet, txt, i) +
          "</td></tr>";
      }
    },

  },

}
</script>
