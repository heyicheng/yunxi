const glob = require('glob')
const path = require('path')
var entries = glob.sync('src/modules/**/*.js').reduce((result, current) => {
    const moduleName = path.basename(path.dirname(current)) // 获取模块名称
    result[moduleName] = {
        entry: current,
        // 设置html文件输出目录
        filename: 'html/' + moduleName + '.html'
    }
    return result
}, {})

if ('VUE_APP_BUILD_MODULE' in process.env && process.env.VUE_APP_BUILD_MODULE.toLowerCase() != 'all') {
    var targetModule = entries[process.env.VUE_APP_BUILD_MODULE]
    entries = {}
    entries[process.env.VUE_APP_BUILD_MODULE] = targetModule
}

module.exports = {
    outputDir: process.env.VUE_APP_OUTPUT_DIR,
    productionSourceMap: false,
    pages: entries,
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    filenameHashing: false,
    indexPath: 'html/vue-index.html',
    configureWebpack: {
        output: {
            // 修改js文件目录
            filename: 'js/[name].[hash:8].js',
            // 修改chunk文件目录
            // chunkFilename: 'js/[name].js'
        }
    },
    chainWebpack: config => {
        config.resolve
            .alias
            .set('@', path.resolve('src'))
            .set('@@', path.resolve('src/components'))
            .end()
            .extensions
            .merge(['.js', '.vue', '.less', '.json', '.scss', 'css'])
            .end();
        //   修改images文件输出至指定目录
        const imgRules = config.module.rule('images')
        imgRules.uses.clear()
        imgRules.use('url-loader').loader('url-loader').options({
            limit: 4096,
            fallback: {
                loader: 'file-loader',
                options: {
                    name: '[name].[hash:8].[ext]',
                    outputPath: (url, resourcePath, context) => {
                        let pathComponents = resourcePath.split(path.sep)
                        let index = pathComponents.indexOf('modules')
                        let folderName = pathComponents[index + 1]
                        return 'images/' + folderName + `/${url}`;
                    }
                }
            }
        })

        // 修改css文件目录
        if (config.plugins.store.get('extract-css') != undefined) {
            config
                .plugin('extract-css')
                .tap(args => {
                    if (args.length > 0) {
                        args[0].filename = 'css/[name].[hash:8].css'
                        args[0].chunkFilename = 'css/[name].[hash:8].css'
                    }
                    return args
                })
        }
    },
    devServer: {
        open: false, //配置自动启动浏览器
        proxy: {
            '/json/reply': {
                target: process.env.VUE_APP_WEBAPI_ADDRESS,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '',
                }
            }
        }
    }
}