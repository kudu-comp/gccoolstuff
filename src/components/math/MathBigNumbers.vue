<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{$t('mathtools.bignum.title')}}
    </div>
    <div class="mainpage">
      <div class="infoblock" v-html="$t('mathtools.bignum.long')" />
      <div class="form-inline">
        <label for="selnum" class="form-label col-sm-5 col-md-4 col-lg-3 col-xl-2 mb-2 mr-2">{{$t('bignum.selnum')}}</label>
        <select id="selnum" class="custom-select mb-2" v-model="base">
          <option value=10>{{$t('bignum.decimal')}}</option>
          <option value=2>{{$t('bignum.binary')}}</option>
          <option value=8>{{$t('bignum.octal')}}</option>
          <option value=16>{{$t('bignum.hexadecimal')}}</option>
        </select>
      </div>
      <div class="form-inline">
        <label class="form-label col-sm-5 col-md-4 col-lg-3 col-xl-2 mr-2 mb-2" size="40" for="n1">{{$t('bignum.num1')}}</label>
        <input type='number' id="n1" ref="n1" v-model="n1" class="form-control mr-2 mb-2">
      </div>
      <div class="form-inline">
        <label class="form-label col-sm-5 col-md-4 col-lg-3 col-xl-2 mr-2 mb-2" size="40" for="n2">{{$t('bignum.num2')}}</label>
        <input type='number' id="n2" ref="n2" v-model="n2" class="form-control mb-2">
      </div>
      <div>
        <h6>{{$t('bignum.arithmetic')}}</h6>
        <input type="button" id="add" value="A + B" class="btn btn-primary mb-2 mr-2" v-on:click="calcBig('ADD')">
        <input type="button" id="sub" value="A - B" class="btn btn-primary mb-2 mr-2" v-on:click="calcBig('SUB')">
        <input type="button" id="mul" value="A * B" class="btn btn-primary mb-2 mr-2" v-on:click="calcBig('MUL')">
        <input type="button" id="div" value="A \ B" class="btn btn-primary mb-2 mr-2" v-on:click="calcBig('DIV')">
        <input type="button" id="mod" value="A % B" class="btn btn-primary mb-2 mr-2" v-on:click="calcBig('MOD')">
        <input type="button" id="pow" value="A ** B" class="btn btn-primary mb-2" v-on:click="calcBig('POW')">
        <h6>{{$t('bignum.logical')}}</h6>
        <input type="button" id="and" value="A and B" class="btn btn-primary mb-2 mr-2" v-on:click="calcBig('AND')">
        <input type="button" id="or"  value="A or B" class="btn btn-primary mb-2 mr-2" v-on:click="calcBig('OR')">
        <input type="button" id="xor" value="A xor B" class="btn btn-primary mb-2 mr-2" v-on:click="calcBig('XOR')">
        <input type="button" id="not" value="not A" class="btn btn-primary mb-2" v-on:click="calcBig('NOT')">
      </div>
      <p v-show="errormsg" class="errormsg mb-2">{{errormsg}}</p>
      <div v-if="result" class="resultbox">{{result}}.</div>
    </div>
  </div>
</template>

<script>

export default {

  name: 'MathBigNumbers',

  data: function () {
    return {
      errormsg: "",
      n1: "0",
      n2: "0",
      result: "",
      base: 10
    }
  },

  mounted: function() {
    this.$refs.n1.focus();
  },

  methods: {

    // Calculate the nimber product and sum
    calcBig: function(oper) {

      // reset calculator
      this.errormsg = "";
      let prefix = "";
      let s1, r;
      switch (this.base) {
        case "2"  : prefix = "0b"; break;
        case "8"  : prefix = "0o"; break;
        case "16" : prefix = "0x"; break;
      }
      
      try {

        let n1 = BigInt(prefix + this.n1);
        let n2 = BigInt(prefix + this.n2);

        switch (oper) {
        
          case "ADD" :
            this.result = (n1 + n2).toString(this.base);
            break;
          case "SUB":  
            this.result = (n1 - n2).toString(this.base);
            break;
          case "MUL":  
            this.result = (n1 * n2).toString(this.base);
            break;
          case "DIV":  
            this.result = (n1 / n2).toString(this.base);
            break;
          case "MOD":  
            this.result = (n1 % n2).toString(this.base);
            break;
          case "POW":  
            this.result = (n1 ** n2).toString(this.base);
            break;
          case "AND" :
            this.result = (n1 & n2).toString(this.base);
            break;
          case "OR" :
            this.result = (n1 | n2).toString(this.base);
            break;
          case "XOR" :
            this.result = (n1 ^ n2).toString(this.base);
            break;
          case "NOT" :
          
            s1 = n1.toString(2);
            r = "";
            for (let i = 0; i < s1.length; i++) {
              r += (s1[i] == "1") ? "0" : "1";
            }
            this.result = BigInt("0b" + r).toString(this.base);
            break;
            
          default :
            // Illegal operator
          
        }

      } catch (e) {

        this.errormsg = this.$t('errors.generic');
        console.log(e);
        
      }      
 
      
    },

  },
}
</script>

<style scoped>

h6 {
	color: #2E1E03;
}

</style>
