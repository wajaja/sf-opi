// require('./../scripts/fixServerRendering.js')
import ReactOnRails 	from 'react-on-rails'
import mainNode 		from './mainNode'
import configureStore 	from './../store/configureStore'


const opinionStore = configureStore

ReactOnRails.registerStore({ opinionStore })
ReactOnRails.register({ mainNode })