import React from 'react'
import createReactClass from 'create-react-class'
import { connect } 	from 'react-redux'

const TVChannel  = createReactClass( {

	render() {
		return(
			<div className="tv-chan-ctnr">
				<div className="tv-chan-ctnr-a">
					my tv container
				</div>
			</div>
		)
	}
})

export default connect(state => ({
	user: state.User.user,
}))(TVChannel)