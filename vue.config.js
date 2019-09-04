module.exports = {
//  devServer:{https:true}
chainWebpack: config => {
		    config.plugins.delete('preload');
},
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
		

  publicPath: './'
}

