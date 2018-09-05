import React 			from 'react'
import { VideoCalling, VoiceCalling } from '../../../../components'
// import createReactClass from 'create-react-class'

class CallWrapper extends React.PureComponent {

	constructor(props) {
		super(props)
	}

	render() {

		return (
			<div>
				{this.props.mode === 'audio' && <VoiceCalling {...props} />}
				{this.props.mode === 'video' && <VideoCalling {...props} />} 
			</div>
		)
	}
}

////
export default CallWrapper