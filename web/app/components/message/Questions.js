import React  					from 'react'
import createReactClass 		from 'create-react-class'
import { connect } 				from 'react-redux'
import { Author } 				from '../post'
import bindFunctions 			from '../../utils/bindFunctions'

const Questions  = createReactClass({
	onQuestionSelected(question, e) {
		this.props.onQuestionSelected(question)
	},

	componentDidMount() {
		
	},

	componentDidUpdate(prevProps) {
		// if(this.props.questions != prevProps.questions) {
			
		// }
	},

	render() {
		const self = this, { questions } = this.props;
		return(
			<div>
				{questions.map(function(question, i) {
					return (
						<div key={question.id} className="q-info-dv" onClick={self.onQuestionSelected.bind(self, question)}>
			                <div className="q-info-dv-b">
			                    <div className="q-partic-container">
				                    {question.participants.map(function(participant, i) {
				                    	return (
					                    	<span key={i} className="q-partic-nm">
					                    		{participant.firstname} {participant.firstname}
					                    	</span>
				                    	)
				                    })}
			                    </div>
			                </div>
			            </div>
		            )
				})}
	        </div>
		)
	}
})

export default Questions;