import React 			from 'react'
import createReactClass from 'create-react-class'

const Foot  = createReactClass( {

	componentDidMount() {
		console.log('foot rended ')
	},

	render() {
		return(
			<div id="o-foot-ab" className="o-foot-ab">
				<div id="o-foot-ab-cont" className="o-foot-ab-cont">
				</div>
			</div>
		)
	}
})

export default Foot;