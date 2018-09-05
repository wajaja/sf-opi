import React 			from 'react'
import createReactClass from 'create-react-class'
import { connect } 		from 'react-redux'

import { getUrlParameterByName } from '../../../../utils/funcs'
import { 
	Adress, Contact,
	General, Notification,
	Security 
} 						from '../components'

const Center = createReactClass({

	getInitialState() {
		return {

		}
	},

	componentWillReceiveProps(nextProps) {
		if(this.props.tag !== nextProps.tab) {
			console.log('data tab changed');
		}
	},

	render() {

		const { location } = this.props,
		tag = getUrlParameterByName('tag', location.search)

		if(tag === 'adress')
			return <Adress {...this.props} />

		else if(tag === 'contact') 
			return <Contact {...this.props} />

		else if(tag === 'notification') 
			return <Notification {...this.props} />

		else if(tag === 'security') 
			return <Security {...this.props} />

		else if(!tag || tag === 'general')
			return <General {...this.props} />
		else 
			return <div></div>
	}
})

export default connect(state => ({

}))(Center)