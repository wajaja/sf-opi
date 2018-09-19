import React 				from 'react'
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { withRouter,  Switch, Route, Redirect } from 'react-router-dom'
import {
	Request, SendEmail, Reset
}                         	from './components'
// import { 
//     Setting as SettingActions, 
// }    						from '../../../actions'

import '../../../styles/user/resetting.scss'

const Resetting  = createReactClass( {

	getInitialState() {
		return {
			
		}
	},

    // shouldComponentUpdate(nextProps) {
    //     return this.props.location !== nextProps.location
    // },

	render() {
		const { screenWidth, } = this.state
		const { dispatch, user } = this.props

		return (
            <Switch>
                <Route exact path='/resetting/request' children={() => <Request {...this.props} />} />
                <Route exact path='/resetting/check-email' children={() => <CheckEmail {...this.props} />} />
                <Route exact path="/resetting/reset/:token" children={() => <Reset {...this.props} /> } />
                <Redirect to='/resetting/request' />
            </Switch>
		)
	}
})

//////
export default  withRouter(connect(state =>({
	user: state.User.user,
}), null)(Resetting))