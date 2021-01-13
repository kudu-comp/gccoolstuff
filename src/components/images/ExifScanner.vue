<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('imagetools.exifscanner.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('exifscanner.infoblock')"></div>
      <div class="form-inline">
        <input type="file" ref="file" name="file" id="file" class="form-control-file mb-2" @change="selectFile">
        <!-- <label for="imgurl" class="form-label mr-2">Or enter URL</label>
        <input type="text" ref="imgurl" name="imagurl" id="imgurl" v-model="fileurl" class="form-control" @change="selectURL"> -->
      </div>
      <p v-show="error" class="errormsg">{{errormsg}}</p>
      <div class="row">
        <div class="col-8">
          <div class="text-center mb-2" v-if="imageData.length > 0">
            <img id="imgpreview" class="img-fluid rounded" v-bind:class="{ flipY : isFlipY, flipX : isFlipX, rotate90 : isRotate90, rotate180: isRotate180, rotate270: isRotate270 }" :src="imageData">
          </div>
          <v-map />
        </div>
        <div class="col-4">
          <div class="exifinfo card mb-2">
            <div class="card-header">{{$t('exifscanner.info')}}</div>
            <div class="card-text p-1">
              <table class="table table-sm table-borderless">
                <tr><td>{{$t('exifscanner.filename')}}</td><td>{{Filename}}</td></tr>
                <tr><td>{{$t('exifscanner.filetype')}}</td><td>{{Filetype}}</td></tr>
                <tr><td>{{$t('exifscanner.size')}}</td><td>{{Filesize}}</td></tr>
                <tr><td>{{$t('exifscanner.width')}}</td><td>{{ImageWidth}}</td></tr>
                <tr><td>{{$t('exifscanner.height')}}</td><td>{{ImageHeight}}</td></tr>
                <tr><td>{{$t('exifscanner.date')}}</td><td>{{DateTime}}</td></tr>
                <tr><td>{{$t('exifscanner.datec')}}</td><td>{{DateTimeOriginal}}</td></tr>
              </table>
            </div>
            <div class="card-header">{{$t('exifscanner.cinfo')}}</div>
            <div class="card-text p-1">
              <table class="table table-sm table-borderless">
                <tr><td>{{$t('exifscanner.camera')}}</td><td>{{Camera}}</td></tr>
                <tr><td>{{$t('exifscanner.lens')}}</td><td>{{LensModel}}</td></tr>
                <tr><td>{{$t('exifscanner.aperture')}}</td><td>{{Aperture}}</td></tr>
                <tr><td>{{$t('exifscanner.shutter')}}</td><td>{{Shutter}}</td></tr>
              </table>
            </div>
            <div class="card-header">{{$t('exifscanner.desc')}}</div>
            <div class="card-text p-1">
              <table class="table table-sm table-borderless">
                <tr><td>{{$t('exifscanner.title')}}</td><td>{{Title}}</td></tr>
                <tr><td>{{$t('exifscanner.title')}} 2</td><td>{{XPTitle}}</td></tr>
                <tr><td>{{$t('exifscanner.desc')}}</td><td>{{Description}}</td></tr>
                <tr><td>{{$t('exifscanner.desc')}} 2</td><td>{{ImageDescription}}</td></tr>
                <tr><td>{{$t('exifscanner.subject')}}</td><td>{{XPSubject}}</td></tr>
                <tr><td>{{$t('exifscanner.about')}}</td><td>{{About}}</td></tr>
                <tr><td>{{$t('exifscanner.keywords')}}</td><td>{{XPKeywords}}</td></tr>
                <tr><td>{{$t('exifscanner.comment')}}</td><td>{{XPComment}}</td></tr>
              </table>
            </div>
            <div class="card-header">{{$t('exifscanner.ainfo')}}</div>
            <div class="card-text p-1">
              <table class="table table-sm table-borderless">
                <tr><td>{{$t('exifscanner.artist')}}</td><td>{{Artist}}</td></tr>
                <tr><td>{{$t('exifscanner.creator')}}</td><td>{{Creator}}</td></tr>
                <tr><td>{{$t('exifscanner.author')}}</td><td>{{XPAuthor}}</td></tr>
                <tr><td>{{$t('exifscanner.copyright')}}</td><td>{{Copyright}}</td></tr>
              </table>
            </div>
            <div class="card-header">{{$t('exifscanner.gps')}}</div>
            <div class="card-text p-1">
              <table class="table table-sm table-borderless">
                <tr><td>{{$t('exifscanner.gps')}}</td><td>{{GPSfromCamera}}</td></tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ExifReader from 'exifreader'
import VMap from '@/components/inputs/VMap.vue'
import * as coords from '@/scripts/coords.js';

export default {
  name: 'ExifScanner',

  props: {
    msg: String
  },

  components: {
    VMap,
  },

  data: function() {
    return {
      fileurl: "",
      imageData: "",
      isFlipX: false,
      isFlipY: false,
      isRotate90: false,
      isRotate180: false,
      isRotate270: false,
      error: false,
      errormsg: "",
      exifdata: "",
      tags: null,
      Filename: "",
      Filesize: "",
      Filetype: "",
      Title: "",
      XPTitle: "",
      XPAuthor: "",
      XPComment: "",
      XPSubject: "",
      XPKeywords: "",
      Copyright: "",
      DateTime: "",
      DateTimeOriginal: "",
      ImageWidth: 0,
      ImageHeight: 0,
      ImageDescription: "",
      Author: "",
      Artist: "",
      Description: "",
      About: "",
      Creator: "",
      Camera: "",
      LensModel: "",
      Aperture: "",
      Shutter: "",
      GPSfromCamera: "",
    }
  },

  mounted: function() {
    // Set focus on file input
    this.$refs.file.focus();
  },

  methods: {

    // Decode a UCS2 string
    decodeUCS2: function (a) {
      // For some stupid reason EXIF XP fields has UCS-2 strings which are two
      // bytes the lowest first, the highest second which match UTF-16 plane 1
      let s = "";
      for (let i = 0; i < a.length; i += 2) {
        s += String.fromCharCode (a[i+1] * 0xFF + a[i]);
      }
      return s;
    },

    // Display the EXIF data
    displayExif: function () {
      // Read the relevant fields and display those
      // Check first if they are defined before accessing them
      // XP fields are UCS2 encoded

      // Get sizes and date
      this.DateTime = (Object.prototype.hasOwnProperty.call(this.tags, "DateTime")) ? this.tags.DateTime.description : this.$t('exifscanner.noinfo');
      this.DateTimeOriginal = (Object.prototype.hasOwnProperty.call(this.tags, "DateTimeOriginal")) ? this.tags.DateTimeOriginal.description : this.$t('exifscanner.noinfo');
      this.ImageHeight = (Object.prototype.hasOwnProperty.call(this.tags, "Image Height")) ? this.tags["Image Height"].value : this.$t('exifscanner.noinfo');
      this.ImageWidth = (Object.prototype.hasOwnProperty.call(this.tags, "Image Width")) ? this.tags["Image Width"].value : this.$t('exifscanner.noinfo');

      // Get camera related info
      this.Camera = (Object.prototype.hasOwnProperty.call(this.tags, "Model")) ? this.tags.Model.description : this.$t('exifscanner.noinfo');
      this.LensModel = (Object.prototype.hasOwnProperty.call(this.tags, "LensModel")) ? this.tags.LensModel.description : this.$t('exifscanner.noinfo');
      this.Aperture = (Object.prototype.hasOwnProperty.call(this.tags, "ApertureValue")) ? this.tags.ApertureValue.description : this.$t('exifscanner.noinfo');
      this.Shutter = (Object.prototype.hasOwnProperty.call(this.tags, "ShutterSpeedValue")) ? this.tags.ShutterSpeedValue.description : this.$t('exifscanner.noinfo');

      // Get descriptions
      this.Title = (Object.prototype.hasOwnProperty.call(this.tags, "title")) ? this.tags.title.description : this.$t('exifscanner.noinfo');
      this.XPTitle = (Object.prototype.hasOwnProperty.call(this.tags, "XPTitle")) ? this.decodeUCS2(this.tags.XPTitle.value) : this.$t('exifscanner.noinfo');
      this.Description = (Object.prototype.hasOwnProperty.call(this.tags, "description")) ? this.tags.description.description : this.$t('exifscanner.noinfo');
      this.ImageDescription = (Object.prototype.hasOwnProperty.call(this.tags, "ImageDescription")) ? this.tags.ImageDescription.description : this.$t('exifscanner.noinfo');
      this.About = (Object.prototype.hasOwnProperty.call(this.tags, "about")) ? this.tags.about.description : this.$t('exifscanner.noinfo');
      this.XPComment = (Object.prototype.hasOwnProperty.call(this.tags, "XPComment")) ? this.decodeUCS2(this.tags.XPComment.value) : this.$t('exifscanner.noinfo');
      this.XPSubject = (Object.prototype.hasOwnProperty.call(this.tags, "XPSubject")) ? this.decodeUCS2(this.tags.XPSubject.value) : this.$t('exifscanner.noinfo');
      this.XPKeywords = (Object.prototype.hasOwnProperty.call(this.tags, "XPKeywords")) ? this.decodeUCS2(this.tags.XPKeywords.value) : this.$t('exifscanner.noinfo');

      // Get artist related exifinfo
      this.Artist = (Object.prototype.hasOwnProperty.call(this.tags, "Artist")) ? this.tags.Artist.description : this.$t('exifscanner.noinfo');
      this.XPAuthor = (Object.prototype.hasOwnProperty.call(this.tags, "XPAuthor")) ? this.decodeUCS2(this.tags.XPAuthor.value) : this.$t('exifscanner.noinfo');
      this.Creator = (Object.prototype.hasOwnProperty.call(this.tags, "creator")) ? this.tags.creator.description : this.$t('exifscanner.noinfo');
      this.Copyright = (Object.prototype.hasOwnProperty.call(this.tags, "Copyright")) ? this.tags.Copyright.description : this.$t('exifscanner.noinfo');

      // GPS data
      // Set a marker on the map for the GPS coordinates
      if (Object.prototype.hasOwnProperty.call(this.tags, "GPSLatitude") && Object.prototype.hasOwnProperty.call(this.tags, "GPSLongitude")) {
        let marker = this.$store.state.L.marker([this.tags.GPSLatitude.description, this.tags.GPSLongitude.description]).addTo(this.$store.state.mymap);
        marker.bindPopup(this.$t('exifscanner.gps')).openPopup();
        this.GPSfromCamera = coords.printCoordinateFromDMS( { lon: this.tags.GPSLongitude.description, lat: this.tags.GPSLatitude.description }, "N52 11.111 E4 11.111");
      } else {
        this.GPSfromCamera = this.$t('exifscanner.nogps');
      }

    },

    // Triggered when the file is loaded
    selectFile: function (event) {

      // Reset error flag
      this.error = false;

      // Get the input file
      let input = event.target;

      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        let reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onloadend = (e) => {

            try {
              // Display the image
              // Convert the input (an array buffer) to a BLOB object
              const blob = new Blob([e.target.result], {type: 'image/png'});
              // Create a URL from the Blob object and assign it to the image source
              this.imageData = URL.createObjectURL(blob);

              // Get the info from the file and display it
              this.Filename = input.files[0].name;
              this.Filetype = input.files[0].type;
              this.Filesize = input.files[0].size;

              // Now get the EXIF data (image has to be loaded first) and display it
              this.tags = ExifReader
              .load(e.target.result);
              this.displayExif();

            } catch(err) {
              console.log(err);
              this.error = true;
              this.errormsg = this.$t('exifscanner.error')
            }
        }

        // Start the reader job - read file as a array
        reader.readAsArrayBuffer(input.files[0]);
      }
    },

  }
}
</script>

<style scoped>

.exifinfo {
  font-size: 0.85em
}

</style>
