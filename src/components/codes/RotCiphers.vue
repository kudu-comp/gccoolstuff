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
        <label for="sel" class="form-label mb-2 sm-size"
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
        </select>
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
      ],
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
      let alphabet = this.alf[parseInt(this.selalph)];
      let txt = this.txt;
      if (this.selalph == "0") txt = txt.toUpperCase();

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
