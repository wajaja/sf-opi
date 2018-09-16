/**
* <HACK>
* Initialize window for server rendering
* the true window global will be present
* when the server rendering will finish
* <HACK>
*/

if(typeof document === 'undefined') {
	global.document = {};
}

require('./polyfills.js')
require('./style.scss')
import 'babel-polyfill'

// if (!global._babelPolyfill) {
// 	require('babel-polyfill');
// }

// imported in  webpack's config
import './startup/registration'