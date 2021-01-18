<template>
  <div>
    <select class="custom-select" :value='code' @input="updateCode($event.target.value)">
      <option value="UTF16">Text (UTF8/UTF16)</option>
      <option disabled>--- Numbers ---</option>
      <option value="Binary">Binary (0,1)</option>
      <option value="Octal">Octal (0-7)</option>
      <option value="Decimal">Decimal (0-9)</option>
      <option value="Hexadecimal">Hexadecimal (0-F)</option>
      <option disabled>--- Older codepages &amp; alt codes ---</option>
      <option value="ASCII">Text Ascii</option>
      <option value="CP1252">Windows Western European (CP1252)</option>
      <option value="CP437">Original IBM Hardware (CP437)</option>
      <option value="CP850">MS DOS Western European(CP850)</option>
      <option value="CP852">MS DOS Eastern European (CP852)</option>
      <option value="CP857">MS DOS Turkish codepage (CP857)</option>
      <option value="CP866">MS DOS Cyrillic codepage (CP866)</option>
      <option value="ATASCII">Atari ASCII variant (ATASCII)</option>
      <option value="EBCDIC">EBCDIC character set</option>
      <option disabled>--- Telegraphy &amp; telex ---</option>
      <option value="Baudotcode">Baudot code (ITA-1)</option>
      <option value="BaudotcodeR">Baudot code (ITA-1) - reversed</option>
      <option value="Murraycode">Murray code (ITA-2)</option>
      <option value="MurraycodeR">Murray code (ITA-2) - reversed</option>
      <option value="MurrayMTK2">Murray Cyrillic (MTK-2)</option>
      <option value="MurrayMTK2R">Murray Cyrillic (MTK-2) - reversed</option>
    </select>
  </div>
</template>

<script>
export default {
  props: ['code'],
  methods: {
    updateCode: function (value) {
      this.$emit ('update:code', value);
    },
  }
}
</script>
