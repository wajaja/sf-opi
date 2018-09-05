import React 			from 'react'
import createReactClass 	from 'create-react-class'

import { 
	StaticModal,  
	NewThread
} 	from '../../components'

const NewMessageModal = createReactClass({

	getInitialState() {
		return {

		}
	},
	
	cancelNewMessage() {
		this.props.cancelNewMessage();
	},

	render() {
		const { recipients } = this.props
		return (
			<StaticModal>
				<div className="nw-msg-modal-ctnr">
					<div className="nw-msg-modal-cls">
						<div className="nw-msg-modal-cls-btn" onClick={this.cancelNewMessage}>
						</div>
					</div>
				 	<div className="nw-msg-modal-ctnr-a">
				 		<NewThread
				 			recipients={recipients}
				 			cancelNewMessage={this.cancelNewMessage}
				 			cancelNewMessageButton={true}
				 			{...this.props}	
				 			/>
				 	</div>
				 </div>
			</StaticModal>
		)
	}
})

export default NewMessageModal