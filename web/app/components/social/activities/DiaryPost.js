import React 			from 'react'
import createReactClass from 'create-react-class'
import { connect }      from 'react-redux'


const DiaryPost  = createReactClass({

	getInitialState() {
		return {
			active: false,
		}
	},

	render(props) {
		return(
			<div className="diary-pst-ctnr">
				contenet contenete
			</div>
		)
	}
})

export default connect(state => ({
	diaries: state.Notifications.diaries
}))