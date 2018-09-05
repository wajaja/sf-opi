import React 				from 'react'
import createReactClass 	from 'create-react-class'

import '../../styles/social/static-modal.scss'

const StaticModal = createReactClass({

	getInitialState() {
		return {

		}
	},
	render() {
		return(
			<div className="stic-modal">
				<div className="stic-modal-overlay">
				 	<div className="stic-modal-overlay-a">
				 	</div>
				 </div>
				<div className="stic-modal-ctnr">
					<div className="stic-modal-ctnr">
						{this.props.children}
					</div>
				</div>
			</div>
		)
	}
})

export default StaticModal