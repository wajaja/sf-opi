import React 				from 'react'
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { Helmet }           from "react-helmet";
import { Link, withRouter } from 'react-router-dom'
import { BASE_PATH }        from '../../../../config/api'



const CheckEmail  = createReactClass({

	getInitialState() {
		return {
			
		}
	},

	render() {
		const { dispatch, user, resettingData, } = this.props,
		{ check_email, trans } = resettingData

		return (
			<div className="hm-container chk-ml">
                <div className="sttg-main-blk">
                    <div className="sect-frm-ctnr reset-req">
                        <p className="chk-msg">{trans.check_email}</p>
                    </div>
                </div>
            </div>
		)
	}
})

//////
export default  withRouter(connect(state =>({
	user: state.User.user,
	resettingData: state.Resetting,
}), null)(CheckEmail))