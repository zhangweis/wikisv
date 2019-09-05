const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

console.log();
var externals = {
		vue:'Vue',
		'vue-moment':'vueMoment',
		'vue-router':'VueRouter',
		'marked':'marked',
		'rxjs':'rxjs',
		'vue-rx':'VueRx',
  };
	if (process.env.NODE_ENV!='production') externals = {
		'vue-router':'VueRouter'
	};
module.exports = {
//  devServer:{https:true}
configureWebpack:{
  externals,
optimization: {
    splitChunks: {
			maxSize: 200*1000,
			cacheGroups:{
				'vue-moment':{
          test: /vue-moment[\\/]/,
          chunks: 'all',
					enforce: true,
				},
				'vue-router':{
          test: /vue-router[\\/]/,
          chunks: 'all',
					enforce: true,
				},
/*
				'marked':{
          test: /marked[\\/]/,
          chunks: 'all',
					enforce: true,
				},
				'vuecli':{
          test: /cli-service-global[\\/]/,
          chunks: 'all',
				},
*/
				'vue-runtime':{
          test: /vue\.runtime\./,
					priority: 3,
          chunks: 'all',
				},
			}
    }
  }
},
chainWebpack: config => {
		    config.plugins.delete('preload');
if (process.env.NODE_ENV === "production")
        config.plugin("webpack-report")
            .use(BundleAnalyzerPlugin, [{
                // ...webpack-bundle-analyzer options here
            }]);
},
		

  publicPath: './'
}

