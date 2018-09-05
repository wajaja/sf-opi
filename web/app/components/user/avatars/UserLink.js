import React 			from 'react'
import createReactClass from 'create-react-class'
import { Link } 		from 'react-router-dom'

class UserLink extends React.PureComponent{

	onHover(e) {
        console.log('mouiverover ', e)
    }

    onOut(e) {
    	console.log('onMouseOut', e)
    }

	render() {
		return(
			<Link 
                onMouseOver={this.onHover}
                onMouseOut={this.onOut}
                to={this.props.to} 
                className={this.props.className}
                > 
                {this.props.children}
           </Link>
		)
	}
}

export default UserLink