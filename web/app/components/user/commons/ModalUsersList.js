import React 			from 'react'
import createReactClass from 'create-react-class'
import { 
	RelationShip as RelationShipAction 
} from '../../../actions'
import { User } 		from '../../../components'
import ReactModal 		from 'react-modal';

const ModalUsersList = createReactClass({
	getInitialState() {
		return {
			users: this.props.users, // list of all mutuals users
		}
	},

	handleAfterOpenFunc() {
		if(!this.state.users.length) {
			this.props.dispatch(RelationShipAction.getMutual(this.props.mutualIds))
			.then(
				(users) => this.setState({users}),
				(error) => console.log('promise rejected')
			)
		}
	},

	render() {
		return(
			<ReactModal
				  isOpen={false}
				  onAfterOpen={this.handleAfterOpenFunc}
				  style={{ overlay: {}, content: {} }}
				  portalClassName="ReactModalPortal"
				  overlayClassName="ReactModal__Overlay"
				  className="ReactModal__Content"
				  bodyOpenClassName="ReactModal__Body--open"
				  htmlOpenClassName="ReactModal__Html--open"
				  ariaHideApp={true}
				  shouldFocusAfterRender={true}
				  shouldCloseOnOverlayClick={true}
				  shouldCloseOnEsc={true}
				  shouldReturnFocusAfterClose={true}
				>
				<div className="mdl-users-list">
					{this.state.users.map((u, i) => {
						return(
							<div key={i} className="dv-u-list">
								<User.Photo 
				        			user={u}
				        			for="info-list"
				        			imgHeight={25}
				        			className="pic-lk-u" />
				        		<User.Name 
				        			user={u}
				        			for="info-list"
				        			className="nm-lk-u" />
				        	</div>
						)
					})}
				</div>
			</ReactModal>
		)
	}
})
/////
export default ModalUsersList