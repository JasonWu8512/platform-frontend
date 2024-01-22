const path = require('path')

module.exports = {
  devServer: {
    open: true, //启动项目后自动开启浏览器
    host: 'localhost',
    port: 8080,
    proxy: 'http://localhost:8000'
  },
  // 兼容less-loader6.0+
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', path.join(__dirname, 'src'))
    config.module.rule('ts').use('ts-loader')
  },
}
