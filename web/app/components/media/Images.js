import React 			from 'react'
import createReactClass from 'create-react-class'
import { Link } 		from 'react-router-dom'
import { connect } 		from 'react-redux'


const Images  = createReactClass({

	getInitialState() {
		return {

		}
	},

	renderOne() {
		return(
			<div className="pst-dv-one-img">
                {this.props.images.map(function(image, index) {
                    return(
                    	<span key={image.id} className="pst-img-lk">
                    		<Link to={{pathname: '/photos', state:{id: image.id} }}>
	                       		<img src={image.webPath} className="pst-jst-oe-img" />
	                    	</Link>
	                    </span>
	                )
                })}
            </div>
		)
	},

	//////
	//////
	renderTwo() {
		return(
			<div className="pst-dv-two-img">
                {this.props.images.map(function(image, index){
                    return(
	                   	<span key={image.id} className="pst-img-lk">
	                   		<Link to={{pathname: '/photos', state:{id: image.id} }}>
	                       		<img src={image.webPath} className="pst-jst-to-img" />
	                    	</Link>
	                    </span>
                    )                                                                       
               })}
           </div>
		)
	},

	//////
	/////
	render() {
		const images = this.props.images;
		if(images.length == 1) {
			return this.renderOne();
		} else {
			return this.renderTwo();
		}
		
	}
})

export default Images;