import React 						from 'react'
import createReactClass 			from 'create-react-class'
import _ 							from 'lodash'

import { 
	CheckRelationShipButton, 
	MiniProfile
} 									from '../../../../components'

const SoundForm = createReactClass({

	getInitialState() {
		return{

		}
	},

	render() {
		const { profile, user, } 	= this.props

		return(
			<div className="in-top-a" >
			    <div className="in-top-b">
			        <div className="in-top-content">
				       	this is the SoundForm
			        </div>
			    </div>
			</div>
		)
	}
})

export default SoundForm