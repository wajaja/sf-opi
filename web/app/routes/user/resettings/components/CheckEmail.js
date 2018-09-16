import React 				from 'react'
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { Helmet }           from "react-helmet";
import { Link, withRouter } from 'react-router-dom'
import { BASE_PATH }        from '../../../../config/api'



const CheckEmail  = createReactClass( {

	getInitialState() {
		return {
			
		}
	},

    // shouldComponentUpdate(nextProps) {
    //     return this.props.location !== nextProps.location
    // },

	render() {
		const { dispatch, user, check_email_trans} = this.props

		return (
			<div className="hm-container setting" ref={c => this._pageElm = c}>
                <div id="sttg_main_blk" className="sttg-main-blk">
                    <div className="sect-frm-ctnr reset-req">
                        <p>{check_email_trans}</p>
                    </div>
                </div>
            </div>
		)
	}
})

//////
export default  withRouter(connect(state =>({
	user: state.User.user,
}), mapDispatchToProps)(CheckEmail))