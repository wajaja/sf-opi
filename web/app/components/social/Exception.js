import React 				from 'react'
import { Link } 			from 'react-router-dom'
import createReactClass 	from 'create-react-class'
import { purgeStoredState } from 'redux-persist'
import { BASE_PATH }        from '../../config/api'
import logout 				from '../../utils/auth/logout'

import '../../styles/social/exception.scss'

const Exception = createReactClass({

	logout(e) {
		e.preventDefault();
		logout(this.props.store)
		.then(
			(data) => {window.location.href = `http://opinion.com${BASE_PATH}/login`},
			(error) => { console.log('error happen when logout')}
		)

		// .then((error) => {
		// console.log('in purge action happen', error)
		// }, (error) => {
		// console.log('error localforage', error)
		// })

	},

	componentDidMount() {
		
	},

	render() {
		let exception = this.props.exception,
		goTo = `http://opinion.com${BASE_PATH}`,
		message = '';
		if(['Invalid JWT Token', 'Invalid JWT Token', 'Expired JWT Token'].indexOf(exception.message)) {
			goTo = `http://opinion.com${BASE_PATH}/login`;
			message = exception.message;
		}

		const zIndex = exception.status ? 99999999 : -9999999

		return (
			<div className="stat-excep-ctnr" style={{zIndex: zIndex}}>
				<div className="excep-ctnr">
					<div className="excep-overlay-ctnr"></div>
					<div className="excep-box-ctnr">
						<div className="excep-box-ctnr-a">
							<div className="excep-box-tp">
								
							</div>
							<div className="excep-box-bd">
								<div className="excep-box-msg">
									{message}
								</div>
							</div>
							<div className="excep-box-ft">
								<div className="excep-box-ft-a">
									<a href={goTo} onClick={this.logout} className="btn btn-primary">
										Login
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
})

export default Exception