//fixServerRendering
// if(!process.env.BROWSER) {
//     global.window = {};
// }

if(typeof window === 'undefined') {
	global.window = {};
}

if(typeof document === 'undefined') {
	global.document = {};
}

if(typeof localStorage === 'undefined') {
	global.localStorage = {};
}