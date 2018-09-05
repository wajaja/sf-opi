import React			from 'react'
import createReactClass from 'create-react-class'
// import { connect } 				from 'react-redux'
import { Modal }                from '../../social'

const FlashMessage  = createReactClass({
	render() {
		return(
			<Modal className="flash-message">
				<span className="msg">{this.props.message}</span>
			</Modal>
		)
	}
})

export default FlashMessage