const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
var Inliner = require('inliner');
const exec = require('child_process').exec;
const fs = require('fs');
var address = require('address');

var externals = {
		vue:'Vue',
		'vue-moment':'vueMoment',
		'vue-router':'VueRouter',
		'marked':'marked',
		'rxjs':'rxjs',
		'vue-rx':'VueRx',
  };
	if (process.env.NODE_ENV!='production') externals = {
//		'vue-router':'VueRouter'
	};
module.exports = {
//  devServer:{https:true}
configureWebpack:{
  externals,
  devServer: {
    public: address.ip()+':8081',
		port: 8081
  }

},
chainWebpack: config => {
		    config.plugins.delete('preload');
if (process.env.NODE_ENV === "production")
config.plugin("inline").use(
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {

var inliner = new Inliner('dist/index.html',{skipAbsoluteUrls:true,
compressJS:false,
compressCSS:false}, (error,html)=>{
fs.writeFile('/home/zhangwei/githubbts/wikisv/dist/wikisv.html',html, ()=>{
console.log('inline done.');
});
});
        });
      }
    });

		config.plugin("webpack-report")
            .use(BundleAnalyzerPlugin, [{
							analyzerMode:'static'
                // ...webpack-bundle-analyzer options here
            }]);
},
runtimeCompiler:true,		

  publicPath: './'
}

