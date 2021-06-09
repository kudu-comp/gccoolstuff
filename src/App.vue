<template>
  <div class="masthead">
    <div class="container">
      <div class="row">
        <div class="col-9 text-center">
          <h1 class="font-weight-heavy">GC Cool Tools</h1>
        </div>
        <div class="col-3 locale-changer">
          <div class="d-flex flex-row-reverse">
            <img src="@/assets/nl.png" @click="$i18n.locale='nl'" class="flag ml-2">
            <img src="@/assets/uk.png" @click="$i18n.locale='en'" class="flag">
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="nav" class="col-12 text-center">
    <router-link to="/">{{$t('menu.home')}}</router-link> |
    <router-link to="/coord">{{$t('menu.coordinates')}}</router-link> |
    <router-link to="/text">{{$t('menu.texttools')}}</router-link> |
    <router-link to="/cipher">{{$t('menu.ciphers')}}</router-link> |
    <router-link to="/codebook">{{$t('menu.codebook')}}</router-link> |
    <router-link to="/images">{{$t('menu.imagetools')}}</router-link> |
    <router-link to="/html">{{$t('menu.htmlscanner')}}</router-link> |
    <router-link to="/math">{{$t('menu.mathtools')}}</router-link> |
    <router-link to="/comp">{{$t('menu.comptools')}}</router-link> |
    <router-link to="/other">{{$t('menu.other')}}</router-link> |
    <router-link to="/howtostart">{{$t('menu.howto')}}</router-link> |
    <router-link to="/about">{{$t('menu.about')}}</router-link>
  </div>
  <router-view />
</template>

<style>
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
  color: #473868;
  font-weight: bold;
}

a:hover {
  color: #1D1A15;
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
	color: #2E1E03;
  height: 100px;
  padding: 10px;
  font-family: cursive;
  background-color: #E6D1AC;
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

.card {
  border-style: solid;
  border-width: 2px;
  border-color: #785E31;
  border-radius: 5px;
  margin-bottom: 5px;
}

.card-header {
  color: #E6D1AC;
  background-color: #785E31;
	text-align: left;
	font-size: 1.1em;
  padding: 5px;
}

.card-body {
  background-color: #E6D1AC;
  padding: 5px;
}

.card-text {
  font-size: 0.95em;
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
