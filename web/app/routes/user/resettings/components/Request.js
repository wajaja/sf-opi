import React 				from 'react'
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { Helmet }           from "react-helmet";
import { Link, withRouter } from 'react-router-dom'
import { BASE_PATH }        from '../../../../config/api'



const Request  = createReactClass( {

	getInitialState() {
		return {
		}
	},

    // shouldComponentUpdate(nextProps) {
    //     return this.props.location !== nextProps.location
    // },

	render() {
		const { screenWidth, } = this.state
		const { action, user, invalid_username, invalid_username_trans, username_trans, submit_trans} = this.props

		return (
			<div className="hm-container resetting">
                <div id="sttg_main_blk" className="sttg-main-blk">
                    <div className="sect-frm-ctnr reset-req">
                        <form 
                            method="post" 
                            action={`${BASE_PATH}/${action}`} 
                            className="op_user_resetting_request">
                            <div>
                                {!!invalid_username  <p>{invalid_username_trans}</p> }
                                <label for="username">{username_trans}</label>
                                <input type="text" id="username" name="username" required="required" />
                            </div>
                            <div>
                                <input type="submit" value={submit_trans} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
		)
	}
})

//////
export default  withRouter(connect(state =>({
	user: state.User.user,
}), mapDispatchToProps)(Request))