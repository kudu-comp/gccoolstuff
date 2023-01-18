module.exports = {
  // devServer: {
  //   // https: true // needed for Get location but crashes php server calls
  // },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'nl',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  // configureWebpack: {
  //   devtool: 'source-map'
  // }
}
