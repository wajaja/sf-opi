module.exports = ({ file, options, env }) => ({
	parser: file.extname === '.sss' ? 'sugarss' : false, // Handles `.css` && '.sss' files dynamically
    plugins: {
      	'postcss-preset-env': {},
      	'autoprefixer': {},
		'cssnano':  env === 'production'  ? {} : false
    },
    sourceMap: true
})