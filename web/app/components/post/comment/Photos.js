import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { Link } 			from 'react-router-dom'
import { connect } 			from 'react-redux'

import { Photo } 			from '../../media'
import { 
    Photos as PhotosActions
}                           from '../../../actions/media'
import { 
    App as AppActions
}                           from '../../../actions/media'

const Photos  = createReactClass( {

	render() {
		const {comment: {id, images, author}}  = this.props,
		self 								= this,
		username 							= author.username;
		if(!images.length) return(<div></div>);
		////
		////
        if (images.length === 1) {
           return (
           		<div className="com-img-ul dv-one-img">
	               {images.map(function(image, i) {
	               		if(typeof image === 'object' && image.id) {
		                    return <Photo 
			                   			key={i} 
			                   			image={image} 
			                   			username={username} 
			                   			className="imageComment jst-oe-img" 
			                   			pClassName="li-cmt-img"
			                   			{...self.props}
			                   			/>
			            } else {
			            	return (
			            		<div key={i} className="load imageComment jst-oe-img" >
			            			loading image...
			            		</div>
			            	)
			            }
	                })}
	           </div>
	        )
	    }
	    ////
	    ////
	    if(images.length === 2) {
	        return (
	        	<div className="com-img-ul dv-two-img">
		            {images.map(function(image, i) {
		            	if(typeof image === 'object' && image.id) {
			                return(
			                	<div key={i} className="img-dv">
			                		<Photo 
			                   			key={i} 
			                   			image={image} 
			                   			username={username} 
			                   			className="imageComment jst-to-img" 
			                   			pClassName="li-cmt-img"
			                   			{...self.props}
			                   			/>
			                    </div>
		                    )
		                } else {
		                	return <div key={i} className="load imageComment jst-to-img" />
		                }
		            })}
		        </div>
		    )
	    }

	    if (images.length > 2) {
	        const nb_img = images.length - 3;
	        return (
	        	<div className="com-img-ul dv-pls-img">
		            {images.map(function(image, i) {
		            	if(typeof image === 'object' && image.id) {
			            	return(
			            		<div key={i} className="img-dv">
			            			{i === 0 && <Photo 
						                   			key={i} 
						                   			image={image} 
						                   			username={username} 
						                   			className="imageComment jst-pls-img" 
						                   			pClassName="li-cmt-img first"
						                   			{...self.props}
						                   			/>
						            }
					                {i === 1 && 
					                	<div key={i} className="dv-pls-img-lft">
					                		<Photo 
					                   			key={i} 
					                   			image={image} 
					                   			username={username} 
					                   			className="imageComment jst-pls-img" 
					                   			pClassName="li-cmt-img scond"
					                   			{...self.props}
					                   			/>
				                        </div>
					                } 
					                {i === 2 &&
					                    <div key={i} className="dv-thir-img">
				                    		<Photo 
					                   			key={i} 
					                   			image={image} 
					                   			username={username} 
					                   			className="imageComment jst-pls-img" 
					                   			pClassName="li-cmt-img thir"
					                   			{...self.props}
					                   			/>
				                            <Link 
				                            	to={{pathname: '/comments', state:{id: id} }} 
				                            	className={nb_img ? `see-mr-img` : `see-mr-img none-see-mr-img`}>
				                               	<i className="fa fa-plus" aria-hidden="true"></i>
				                               	<span className="nb-img-txt">{nb_img}</span>
				                            </Link>
				                        </div>
					                }
		            			</div>
		            		)
		            	} else {
		            		return <div key={i} className="load imageComment jst-pls-img" />
		            	}
		            })}
		        </div>
		    )
	    }
	}
})

export default Photos;