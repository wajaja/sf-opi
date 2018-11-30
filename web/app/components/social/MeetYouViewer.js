import React 			from 'react'
import createReactClass from 'create-react-class'

const MeetYouViewer  = createReactClass( {

	componentDidMount() {
		console.log('foot rended ')
	},

	render() {
		return(
			<div className="o-mt-vwr">
				<div className="o-mt-vwr-cont">
					MeetYou
				</div>
			</div>
		)
	}
})

export default MeetYouViewer;