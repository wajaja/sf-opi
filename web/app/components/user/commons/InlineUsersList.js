import React 			from 'react'
import createReactClass from 'create-react-class'

const InlineUsersList = createReactClass({

	getInitialState() {
		return {
			users: this.props.users
		}
	}, 


	render() {
		return (
			<div className="inln-list-dv">
				{this.state.users.map((u, i) => {
					return(
						<div className="inln-u-dv">
							<span>{u.firstname}</span>
							<span>{u.lastname}</span>
						</div>
					)
				})}
			</div>
		)
	}
})  

export default InlineUsersList