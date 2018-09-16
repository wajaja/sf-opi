import React 			from	'react'
import createReactClass from 	'create-react-class'


const Right = createReactClass({

	getInitialState() {
		return {

		}
	},

	render() {
		const { dispatch, exception, history, screenWidth } = this.props
		return(
			<div className="stream-block-rig">
		        <div className="pr-h-store"></div>
		        <div className="view-ctnr"></div>
		        <div id="_8" className="online_8">
           
                </div>        
		    </div>
		)
	}
})

export default Right