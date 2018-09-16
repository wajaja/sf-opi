import React 				from 'react'
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { Helmet }           from "react-helmet";
import { Link, withRouter } from 'react-router-dom'
import { BASE_PATH }        from '../../../../config/api'



const Reset  = createReactClass( {

	getInitialState() {
		return {
			hasOwnDiary: false,
            screenWidth: 760,
            profile: {},
            tagsArr: ['general', 'security', 'aboutme', 'adress', 'contact', 'notification']
		}
	},

    // shouldComponentUpdate(nextProps) {
    //     return this.props.location !== nextProps.location
    // },

	render() {
		const { screenWidth, } = this.state
		const { dispatch, user, reset_submit_trans } = this.props

		return (
			<div className="hm-container setting" ref={c => this._pageElm = c}>
                <div className="sttg-main-blk">
                    <div className="sect-frm-ctnr reset-req">
                        <form 
                            method="post" 
                            action={`${BASE_PATH}/api/resetting/reset/${token}`} 
                            className="op_user_resetting_reset">
                            {{ form_widget(form) }}
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
}), mapDispatchToProps)(Reset))