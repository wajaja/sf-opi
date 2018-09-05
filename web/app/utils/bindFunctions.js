//utils/bindFunctions.js
//source toptal.com react-redux and immutableJS

/**
* Bind functions in React Component
*
*/
export default function bindFunctions(functions) {
  	functions.forEach(f => this[f] = this[f].bind(this));
}

