'use strict';

const webpack = require('webpack'),
glob = require('glob');

let config = {


    	  entry: {

    // Auto-detect all pages in directory.

    'myPages': glob.sync('./js/*.js')

  },

   	module: {
     	rules: [
       		
	       	{
	         	test: /\.s?css$/,
	         	use: 'css-loader'
	       	}, {

	         	test: /\.(gif|png|jpe?g|svg)$/i,
				use: [
				    'file-loader',
				    {
				      loader: 'image-webpack-loader',
				      options: {
				        bypassOnDebug: true,
      },
    },
  ],
	       	}
    	],

	},
  	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js'
	},

};

module.exports = config;