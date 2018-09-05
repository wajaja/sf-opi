import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { Link } 			from 'react-router-dom'
import { connect } 			from 'react-redux'

import { Image } 			from '../../media'
import { 
    Photos as PhotosActions
}                           from '../../../actions/media'
import { 
    App as AppActions
}                           from '../../../actions/media'

//////
/////
const Photos  = createReactClass({

	getInitialState() {
		return {}
	},

	//////
	//////
	render() {
		const {reply: {id, images, author}} = this.props,
		self 	= this,
		username = author.username;
		if(!images.length) return(<div></div>);
		
		////
        if (images.length === 1) {
           return (
           		<div className="com-img-ul dv-one-img">
	               {images.map(function(image, i){
	               		if(typeof image === 'object' && image.id) {
		                   return <Image 
		                   			key={image.id}
		                   			postId={id}
		                   			image={image}
		                   			username={username} 
		                   			className="imageComment jst-oe-img" 
		                   			pClassName="li-cmt-img"
		                   			{...self.props}
		                   			/>
	               		} else {
	               			return <div className="load imageComment jst-oe-img" />
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
			                return <Image
			                			key={image.id}
			                			postId={id}
			                			image={image} 
			                			username={username} 
			                			pClassName="imageComment jst-to-img" 
			                			className="li-cmt-img"
			                			{...self.props}
			                			/>
			            } else {
			            	return <div className="load imageComment jst-to-img" />
			            }
		            })}
		        </div>
		    )
	    }
	    ////
	    ////
	    if (images.length > 2) {
	        const nb_img = images.length - 3;
	        return (
	        	<div className="pst-dv-pls-img">
		            {images.map(function(image, i) {
		            	if(typeof image === 'object' && image.id) {
			            	return(
			            		<div key={i} className="img-dv">
			            			{i === 0 && 
			            				<Image 
            								key={image.id}
            								postId={id} 
            								image={image} 
            								username={username} 
            								pClassName="li-cmt-img first" 
            								className="imageComment jst-pls-img"
            								{...self.props}
            								/>
						            }
					                {i === 1 &&  
					                	<div className="dv-pls-img-lft">
											<Image
												key={image.id} 
												postId={id}
												image={image} 
												username={username} 
												pClassName="li-cmt-img scond" 
												className="imageComment jst-pls-img"
												{...self.props}
												/>
										</div>
					                } 
					                {i === 2 && 
					                	<div className="dv-thir-img">
			                				<Image 
												key={image.id} 
												postId={id}
												image={image} 
												username={username} 
												pClassName="li-cmt-img thir" 
												className="imageComment jst-pls-img"
												{...self.props} 
												/>
				                            <Link to={{pathname: `/undercomments/${id}/photos`, state:{id: id} }} className={nb_img ? `see-mr-img` : `see-mr-img none-see-mr-img`}>
				                               	<i className="fa fa-plus" aria-hidden="true"></i>
				                               	<span className="nb-img-txt">{nb_img}</span>
				                            </Link>
		                        		</div>
					                }
			            		</div>
			            	)
			            } else {
			            	return <div className="load imageComment jst-pls-img" />
			            }
		            })}
		        </div>
		    )
	    }
	}
})
/////
////
export default connect(state=>({
	modal: state.App.modalPhoto,
}))(Photos);