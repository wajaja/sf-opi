import React 		 	from 'react'
import createReactClass from 'create-react-class'
import { connect } 		from 'react-redux'


const LiveActivities  = createReactClass({

	getInitialState() {
		return {}
	},

	render() {
		return(
			<div className="lv-activ-ctnr">
			</div>
		)
	}
})

////////////
export default connect(state => ({
	user: state.User.user
}))(LiveActivities)