const path = require("path");
const fs = require("fs");

let devServer = {
  proxy: {
    // 代理
    "/": {
      target: "http://localhost:4000", //设置你调用的接口域名和端口号 别忘了加http
      ws: false,
      changeOrigin: true, // needed for virtual hosted sites
      pathRewrite: {}
    }
  }
};

module.exports = {
  devServer,
  // 输出文件目录
  assetsDir: "bundle",
  // 修改 pages 入口
  pages: {
    index: {
      entry: "client/main.js", // 入口
      template: "public/engine-h5-long.html", // 模板
      filename: "index.html" // 输出文件
    }
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          quietDeps: true
        },
        implementation: require('sass'),
        additionalData: `@use "${path.resolve(__dirname, './client/common/styles/variables.scss')}" as *;`
      }
    }
  },
  productionSourceMap: false,
  publicPath: './',
  // 扩展 webpack 配置
  chainWebpack: config => {
    // @ 默认指向 src 目录，这里要改成 examples
    // 另外也可以新增一个 ~ 指向 packages
    config.resolve.alias
      .set("@", path.resolve("client"))
      .set("@client", path.resolve("client"))
      .set("@plugins", path.resolve("plugins"))
      .set("@server", path.resolve("server"));

    config.module
      .rule("js")
      .include.add(/engine-template/)
      .end()
      .include.add(/client/)
      .end()
      .include.add(/common/)
      .end()
      .use("babel")
      .loader("babel-loader")
      .tap(options => {
        // 修改它的选项...
        return options;
      });

    config.plugins.delete("hmr");
  }
};
