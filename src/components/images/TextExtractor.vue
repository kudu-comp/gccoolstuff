<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('imagetools.textextractor.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('imagetools.textextractor.long')"
      />
      <div class="form-inline">
        <input
          id="file"
          ref="file"
          type="file"
          name="file"
          class="form-control-file mb-2"
          @change="selectFile"
        >
        <label
          class="form-label mr-2 mb-2"
          for="length"
        >{{ $t('textextractor.length') }}</label>
        <input
          id="length"
          ref="length"
          v-model="length"
          type="number"
          class="form-control mb-2 mr-2"
        >
        <label
          class="form-label mr-2 mb-2"
          for="max"
        >{{ $t('textextractor.max') }}</label>
        <input
          id="max"
          ref="max"
          v-model="max"
          type="number"
          class="form-control mb-2 mr-2"
        >
        <label
          class="form-label mr-2 mb-2"
          for="start"
        >{{ $t('textextractor.start') }}</label>
        <input
          id="max"
          ref="start"
          v-model="start"
          type="number"
          class="form-control mb-2"
        >
      </div>
      <input
        id="go"
        type="button"
        name="go"
        :disabled="!loaded"
        :value="$t('buttons.search')"
        class="btn btn-primary mr-2 mb-2"
        @click="scanFile()"
      >
      <p
        v-show="errormsg"
        class="errormsg"
      >
        {{ errormsg }}
      </p>
      <div>
        <div
          class="card card-text p-2"
          v-html="result"
        />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TextExtractor',

  data: function() {
    return {
      fileurl: "",
      imageData: "",
      result: this.$t('labels.result'),
      errormsg: "",
      loaded: false,
      length: 8,
      max: 999,
      start: 0,
      a : null
    }
  },

  mounted: function() {
    // Set focus on file input
    this.$refs.file.focus();
  },

  methods: {
    
    // Scan the file
    scanFile: function () {

      // Reset error flag
      this.errormsg = "";
      this.result = "";

      try {
          
        // Scan for textstrings in printable range 32 - 126 with min length
        let s = "";
        let cnt = 0;

        for (let i = this.start; i <= this.a.length; i++) {

          let c = this.a[i];
          if (c >= 32 && c <= 126) {
            s += String.fromCharCode(c);
          } else {
            if (s.length >= this.length) {
              cnt++;
              this.result += "Match " + cnt.toFixed(0).padStart(3, "0") + " at " + (i-s.length).toString().padStart(6, "0") + ": " + s + "<br>"
            }
            if (cnt > this.max) {
              this.errormsg = this.$t('textextractor.maxexceeded')
              break;
            }
            s = "";
          }
        }

        // If the last part of the file was a string
        if (s.length >= this.length) {
          cnt++;
          this.result += "Match " + cnt.toFixed(0).padStart(3, "0") + ": "+ s + "<br>"
        }

        if (cnt == 0) this.result = this.$t('errors.noresult')

      } catch(err) {

        console.log(err);
        this.errormsg = this.$t('textextractor.fileerror')

      }

    },

    // Triggered when the file is loaded
    selectFile: function (event) {

      // Reset error flag
      this.errormsg = "";

      // Get the input file
      let input = event.target;

      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {

        // create a new FileReader to read this image
        let reader = new FileReader();

        // Define a callback function to run, when image has errors loading
        reader.onerror = () => {
          this.errormsg = this.$t('errors.loadingfile')        
        }

        // Define a callback function to run, when FileReader finishes its job
        reader.onloadend = (e) => {

            try {
          
              // Put file contents in variable
              this.a = new Uint8Array(e.target.result);
              this.loaded = true;
              
            } catch(err) {

              console.log(err);
              this.errormsg = this.$t('textextractor.error')

            }
        }

        // Start the reader job - read file as a array
        reader.readAsArrayBuffer(input.files[0]);
      }
    },

  }
}
</script>

