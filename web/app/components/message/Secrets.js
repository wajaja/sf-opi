import React 			from 'react'
import createReactClass from 'create-react-class'
import { Secret } 		from '../message'


const Secrets  = createReactClass({

	getInitialState(props) {
		return {
			secrets: [],
			questionId: '',
		}
	},

	componentDidMount() {

	},

	render() {
		return (
			<div>
				{this.props.secrets.map(function(s, i) {
					return <Secret 
								key={i} 
								secret={s} />
				})}				
	        </div>
		)
	}
})

export default Secrets;