import React 		from 'react'
import createReactClass from 'create-react-class'
import { connect } 	from 'react-redux'


const Left = createReactClass({

	getInitialState() {
		return {

		}
	},

	render() {
		return(
			<div/>
		)
	}
})

export default connect(state => ({

}))(Left)