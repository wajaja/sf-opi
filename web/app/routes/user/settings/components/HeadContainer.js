import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'

const HeadContainer = createReactClass({

	getInitialState() {
		return {

		}
	},


	render() {
		return(
			<div className="sttg-center-cmp-tp">
				<div className="sttg-hd-ctnr">
					<div className="sttg-hd-ctnr-a">
						{this.props.children}			
					</div>
				</div>
			</div>
		)
	}
})

export default HeadContainer