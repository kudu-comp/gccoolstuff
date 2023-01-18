<template>
  <div class="masthead">
    <div class="container">
      <div class="row">
        <div class="col-9 text-center">
          <h1 class="font-weight-heavy">
            GCTools.nl
          </h1>
        </div>
        <div class="col-3 locale-changer">
          <div class="d-flex flex-row-reverse">
            <img
              src="@/assets/nl.png"
              class="flag ml-2"
              @click="$i18n.locale='nl'"
            >
            <img
              src="@/assets/uk.png"
              class="flag"
              @click="$i18n.locale='en'"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    id="nav"
    class="col-12 text-center"
  >
    <router-link to="/">
      {{ $t('menu.home') }}
    </router-link> |
    <router-link to="/coord">
      {{ $t('menu.coordinates') }}
    </router-link> |
    <router-link to="/text">
      {{ $t('menu.texttools') }}
    </router-link> |
    <router-link to="/cipher">
      {{ $t('menu.ciphers') }}
    </router-link> |
    <router-link to="/codes">
      {{ $t('menu.codes') }}
    </router-link> |
    <router-link to="/images">
      {{ $t('menu.imagetools') }}
    </router-link> |
    <router-link to="/html">
      {{ $t('menu.htmlscanner') }}
    </router-link> |
    <router-link to="/math">
      {{ $t('menu.mathtools') }}
    </router-link> |
    <router-link to="/comp">
      {{ $t('menu.comptools') }}
    </router-link> |
    <router-link to="/other">
      {{ $t('menu.other') }}
    </router-link> |
    <router-link to="/howtostart">
      {{ $t('menu.howto') }}
    </router-link> |
    <router-link to="/about">
      {{ $t('menu.about') }}
    </router-link>
  </div>
  <router-view />
</template>

<style>

/* New color scheme */
/* 
--dark-olive-green: #3d6a2fff;
--goldenrod: #d5a021ff;
--alabaster: #ede7d9ff;
--spanish-gray: #a49694ff;
--purple-navy: #4e598cff; 
*/

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  padding: 10px;
}

#nav a {
  font-weight: bold;
  text-align: center;
  color: #39342B;
}

#nav a.router-link-exact-active {
  font-weight: normal;
}

a {
  color: #196a08;
  font-weight: bold;
}

a:hover {
  color: #064514;
}

body {
  background-color: #E6D1AC;
  color: #815E22;
}

hr {
	color: #2E1E03;
}

.flag:hover {
  box-shadow: 4px 4px #785E31;
  background-color: #E2AE15;
}

.masthead {
	height: 50px;
  padding: 10px;
  margin-bottom: 10px;
  color: #196a08;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.sectionhead {
	color: #2E1E03;
  font-size: 1.8em;
  max-height: 200px;
  text-align: center;
  margin-bottom: 5px;
}

.mainpage {
	min-height: 500px;
}

.infoblock {
  border-style: solid;
  border-color: #785E31;
  border-width: 2px;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.resultbox {
  border-style: solid;
  border-color: #785E31;
  background-color: #f7f5f3;
  border-width: 2px;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 90%;
}

.intro {
  color: #E6D1AC;
  background-color: #785E31;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.btn {
  background-color: #2E1E03;
  border-style: none;
  color: #C1B7A6;
}

.btn:hover{
  box-shadow: 4px 4px #785E31;
  background-color: #E2AE15;
}

.btn.btn-secondary:hover {
  box-shadow: 4px 4px #785E31;
  background-color: #BCBBB8;
}

.btn.btn-primary:active {
  box-shadow: 4px 4px #785E31;
  background-color: #E2AE15 !important;
}

.btn.btn-primary:disabled {
  background-color: #352a17
}

.btn-sm {
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 4px;
  padding-right: 4px;
}

.box {
  border-style: solid;
  border-color: #785E31;
  border-width: 2px;
  border-radius: 5px;
  margin-bottom: 5px;
}

.box-header {
  color: #E6D1AC;
  background-color: #785E31;
  text-align: center;
  font-size: 1.2em;
  padding: 5px;
}

.box-body {
  font-size: 1.0em;
  padding: 5px;
}

.form-control {
  background-color: #FBFAF7;
}

.mapcontrol {
  display: flex;
  flex-direction: row-reverse
}

.subhead {
  color: #E6D1AC;
  background-color: #785E31;
}

.errormsg {
	color: red;
}

</style>
