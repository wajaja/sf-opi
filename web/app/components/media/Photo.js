import React 			from 'react'
import createReactClass from 'create-react-class'
import { connect } 		from 'react-redux'

import { 
    Photos as PhotosActions
}                                   from '../../actions/media'

const Photo  = createReactClass({

	getInitialState() {
		return {
			loading: false
		}
	},

	getPhoto(photo, e) {
		e.preventDefault();
		// const { dispatch, postId, location : {pathname}, image: { id } } = this.props,
		// loading 	= true,
		// params 		= { id: id },
		// query 		= { post_id: postId },
		// status 		= {	modal: true, returnTo: pathname }

		this.props.dispatch(PhotoActions.zoom(this.props.image.id))
		this.setState({loading: true})
		//this.props.getPhoto(photo);
	},

	render() {
		const { loading } 	= this.state,
		{ image, className, username, pClassName, modal } 	= this.props;

		const webPath = image.webPath === 'loading' ? false : true;
		
		//when image was deleted
		if(!image.id && !image.webPath) {
			return(
				<div className={pClassName} >
		           <div className="img-dv-ctnr">
		           		<img src={image.webPath} className={className} />
		           		<div className="rmv-reason" style={{color: 'red'}}>
		           			{image.reason}
		           		</div>
		           	</div>
		        </div>
			)
		}

		return(
			<div className={pClassName} onClick={this.getPhoto.bind(this, image)}>
	           <div className="img-dv-ctnr">
	           		{modal && loading && <span className="loader-bar"></span>}
	           		{!!webPath && <img src={image.webPath} className={className}/>}
	           		{!webPath && <div className="load imageComment jst-oe-img" ></div>}
	           	</div>
	        </div>
		)		
	}
})

/////
export default connect(state => ({
	modal: state.App.modalPhoto
}))(Photo)