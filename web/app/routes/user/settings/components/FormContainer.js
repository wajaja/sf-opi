import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'



const FormContainer = createReactClass({

	getInitialState() {
		return {

		}
	},


	render() {
		return(
			<div className="sttg-center-cmp-bd">
				<div className="sttg-frm-ctnr">
					<div className="sttg-frm-ctnr-a">
						{this.props.children}			
					</div>
				</div>
			</div>
		)
	}
})

export default FormContainer