import React 			from 'react'
import createReactClass from 'create-react-class'


const RelationShipCenter 	= createReactClass({

	getInitialState(){
		return {

		}
	},

	componentDidMount() {
        this.props.loadRelationship(this.props.profile.username).then(data => {
            console.log(data);
        })
    },

	render() {
		return(
			<div className="abt-cter-ctnr">
				center for qbout
			</div>
		)
	}
})

export default RelationShipCenter