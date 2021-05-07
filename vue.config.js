// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
    // 选项...
    publicPath: './', // 根域上下文目录
    outputDir: 'dist', // 构建输出目录
    assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
    devServer: {
        open: true,
        host: 'localhost',
        port: 8080,
        https: false,
        hotOnly: false,
        proxy: { // 配置跨域
            '/api': {
                target: 'http://8.140.190.203:8443/api',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        },
        before: app => { }
    }
}
