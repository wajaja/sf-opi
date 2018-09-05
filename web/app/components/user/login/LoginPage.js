import React 					from 'react'
import createReactClass  		from 'create-react-class'
import PropTypes       			from 'prop-types'
import { connect } 				from 'react-redux'
import { Route, IndexRoute } 	from 'react-router-dom'
import classnames 				from 'classnames'

import { 
	DefaultNavBar, 
	LoginForm 
} 								from '../../../components'

const LoginPage  = createReactClass( {
	render() {
		return (
			<div className="ft-out">
				<DefaultNavBar></DefaultNavBar>
	            <div className={classnames('row', 'out-auth')}>
	                <div className="sect-frm-ctnr">
	                	<LoginForm></LoginForm>
	                </div>
	            </div>
	        </div>
		)
	}
})

/////////
///////
// LoginPage.propTypes = {
//   userSignupRequest: PropTypes.func.isRequired,
//   isUserExists: PropTypes.func.isRequired
// }


export default connect(null, /*{ userSignupRequest, isUserExists }*/)(LoginPage);

//export default LoginPage;