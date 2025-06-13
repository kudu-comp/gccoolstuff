<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      <div class="text-center">
        {{ $t('rotciphers.title') }}
      </div>
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('rotciphers.long')"
      />
      <div class="row">
        <label for="sel" class="form-label mb-2 md-size"
          >Select alphabet</label
        >
        <select
          v-model="selalph"
          id="sel"
          class="form-control mb-2 lg-size"
        >
          <option value="0">{{$t('rotciphers.rot13')}}</option>
          <option value="1">{{$t('rotciphers.rot5')}}</option>
          <option value="2">{{$t('rotciphers.rot47')}}</option>
          <option value="3">{{$t('rotciphers.hexa')}}</option>
          <option value="4">{{$t('rotciphers.custom')}}</option>
        </select>
      </div>
      <div class="row" v-show='selalph === "4"'>
        <label
          class="form-label mb-2 md-size"
          for="other"
        >{{$t('rotciphers.other')}}</label>
        <input
          id="other"
          v-model="other"
          type="text"
          class="form-control md-size mb-2 me-2"
        >
      </div>
      <button @click="generate()" class="btn mb-2">{{$t('buttons.decode')}}</button>
      <textarea class="form-control mb-2" lines="5" v-model="txt" id="txt" ref="txt"></textarea>
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <div
        v-if="result"
        class="resultbox"
        v-html="result"
        style="overflow-wrap: break-word"
      />
    </div>
  </div>
</template>

<script>

export default {

  name: 'RotCiphers',

  // Data include variables to dynamically set appearnce and labels
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
        "<tr style='font-weight: bold'><td class='sm-size'>Default " +
        Math.floor(alphabet.length / 2).toString() +
        "</td><td>" +
        this.rotate(alphabet, txt, Math.floor(alphabet.length / 2)) +
        "</td></tr>";
      // Print rotations
      for (let i = 1; i <= alphabet.length; i++) {
        this.result +=
          "<tr><td class='sm-size'>ROT " +
          i.toString() +
          "</td><td>" +
          this.rotate(alphabet, txt, i) +
          "</td></tr>";
      }
    },

  },

}
</script>
