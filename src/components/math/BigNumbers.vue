<template>
  <div class="d-flex flex-column mx-4">
    <div class="sectionhead">
      {{ $t('bignumbers.title') }}
    </div>
    <div class="mainpage">
      <div
        class="infoblock"
        v-html="$t('bignumbers.long')"
      />
      <div class="row">
        <label
          for="selnum"
          class="form-label sm-size mb-2"
        >{{ $t('bignumbers.selnum') }}</label>
        <select
          id="selnum"
          v-model="base"
          class="form-select md-size mb-2"
        >
          <option value="10">
            {{ $t('bignumbers.decimal') }}
          </option>
          <option value="2">
            {{ $t('bignumbers.binary') }}
          </option>
          <option value="8">
            {{ $t('bignumbers.octal') }}
          </option>
          <option value="16">
            {{ $t('bignumbers.hexadecimal') }}
          </option>
        </select>
      </div>
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          size="40"
          for="n1"
        >{{ $t('bignumbers.num1') }}</label>
        <input
          id="n1"
          ref="n1"
          v-model="n1"
          type="text"
          class="form-control md-size mb-2"
        >
      </div>
      <div class="row">
        <label
          class="form-label sm-size mb-2"
          size="40"
          for="n2"
        >{{ $t('bignumbers.num2') }}</label>
        <input
          id="n2"
          v-model="n2"
          type="text"
          class="form-control md-size mb-2"
        >
      </div>
      <div>
        <h6>{{ $t('bignumbers.arithmetic') }}</h6>
        <button
          id="add"
          class="btn sm-size mb-2 me-2"
          @click="calcBig('ADD')"
        >
          A + B
        </button>
        <button
          id="sub"
          class="btn sm-size mb-2 me-2"
          @click="calcBig('SUB')"
        >
          A - B
        </button>
        <button
          id="mul"
          class="btn mb-2 sm-size mb-2 me-2"
          @click="calcBig('MUL')"
        >
          A * B
        </button>
        <button
          id="div"
          class="btn mb-2 sm-size mb-2 me-2"
          @click="calcBig('DIV')"
        >
          A \ B
        </button>
        <button
          id="mod"
          class="btn mb-2 sm-size mb-2 me-2"
          @click="calcBig('MOD')"
        >
          A % B
        </button>
        <!-- <input type="button" id="pow" value="A ** B" class="btn mb-2" v-on:click="calcBig('POW')"> -->
        <h6>{{ $t('bignumbers.logical') }}</h6>
        <button
          id="and"
          class="btn mb-2 sm-size mb-2 me-2"
          @click="calcBig('AND')"
        >
          A and B
        </button>
        <button
          id="or"
          class="btn mb-2 sm-size mb-2 me-2"
          @click="calcBig('OR')"
        >
          A or B
        </button>
        <button
          id="xor"
          class="btn mb-2 sm-size mb-2 me-2"
          @click="calcBig('XOR')"
        >
          A xor B
        </button>
        <button
          id="not"
          class="btn mb-2 sm-size mb-2 me-2"
          @click="calcBig('NOT')"
        >
          not A
        </button>
      </div>
      <p
        v-show="errormsg"
        class="errormsg mb-2"
      >
        {{ errormsg }}
      </p>
      <div
        v-if="result"
        class="resultbox"
      >
        {{ result }}.
      </div>
    </div>
  </div>
</template>

<script>

export default {

  name: 'BigNumbers',

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
