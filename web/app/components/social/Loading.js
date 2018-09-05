import React 			from 'react'
import createReactClass from 'create-react-class'
import { connect } 		from 'react-redux'


const Loading  = createReactClass({
	componentDidMount() {
		console.log('loading component did mount')
	},

	render() {
		return(
			<div>
				loading.........
			</div>
		)
	}
})
//////
export default connect(null)(Loading)