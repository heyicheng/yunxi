const path = require('path')

module.exports = {
  // baseUrl: '/',
  outputDir: process.env.VUE_APP_OUTPUT,
  configureWebpack: config => {
    if ('VUE_APP_JS_FILE_HASH' in process.env && process.env.VUE_APP_JS_FILE_HASH === 'True') {
      config.output.filename = '[name].[hash].js'
    }
  },
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve
      .alias
      .set('@', path.resolve('src'))
      .set('@@', path.resolve('src/components'))
      .end()
      .extensions
      .merge(['.js', '.vue', '.less', '.json', '.scss', 'css'])
      .end();
  },
  devServer: {
    // port: 8085, // 端口号
    // host: 'localhost',
    // https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
    proxy: {
      '/api': {
        target: process.env.VUE_APP_APIADDRESS,
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        }
      },
      '/h5server': {
        target: process.env.VUE_APP_H5SERVEADDRESS,
        changeOrigin: true,
        pathRewrite: {
          '^/h5server': '',
        }
      },
      '/activityServer': {
        target: process.env.VUE_APP_ACTIVITY_SERVER_ADDRESS,
        changeOrigin: true,
        pathRewrite: {
          '^/activityServer': '',
        }
      },
      '/msg/pcmsg': {
        target: process.env.VUE_APP_MSG_SERVER_ADDRESS,
        changeOrigin: true,
        pathRewrite: {
          '^/msg/pcmsg': '',
        }
      }
    }, // 配置多个代理
    // proxy:'http://hsdfjj.hsd.com'
  }
}
