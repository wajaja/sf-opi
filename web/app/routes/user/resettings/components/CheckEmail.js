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
		const { dispatch, user, resettingData, } = this.props,
		{ check_email, } = resettingData

		return (
			<div className="hm-container setting" ref={c => this._pageElm = c}>
                <div id="sttg_main_blk" className="sttg-main-blk">
                    <div className="sect-frm-ctnr reset-req">
                        <p>{trans.check_email}</p>
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