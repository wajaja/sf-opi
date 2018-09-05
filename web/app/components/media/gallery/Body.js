import React from 'react'
import createReactClass from 'create-react-class'
import Images from '../Images'

const Body  = createReactClass( {
 
	render() {
		const post = this.props.post;
		return(
			<Images post={this.props.post}> </Images>
		)
	}
})

export default Body;