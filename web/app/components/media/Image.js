import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { Link } 			from 'react-router-dom'
import { connect } 			from 'react-redux'
import _ 					from 'lodash'
import { Photo as PhotoActions } from '../../actions'

const Image  = createReactClass({

	getInitialState() {
		return {
			route: '',
			loading: false,
		}
	},

	getImage (image, e) {
		e.preventDefault();
		// loading 	= true,
		// params 		= { id: id },
		// query 		= { post_id: postId },
		// status 		= {	modal: true, returnTo: pathname }
		this.props.dispatch(PhotoActions.load(this.props.image.id, this.props.postId))
		this.setState({loading: true})
		// dispatch(PhotoActions.modalPhoto(params, query, status, loading))
	},

	componentDidMount() {
		
	},

	componentWillUpdate(nextProps, nextState) {
		
	},

	componentDidUpdate(prevProps, prevState) {
		// if(this.state.loading && (this.props.photo.params.id === id ) && (nextProps.photo.photo.id === id)) {
		// 	const { dispatch, router } = this.props;
		// 	this.setState({loading: false})
		// }
		// if(!this.props.photo.loading && (this.props.photo != prevProps.photo)) {
		// 	if(this.state.loading) {
		// 		const { dispatch, router } = this.props;
		// 		history.push(this.state.route);
		// 	}
		// }
	},

	componentWillReceiveProps (nextProps, nextState) {
		//loading animation
		const returnTo = -1; //goBack()
		// if(nextProps.photo.loading && (nextProps.photo.params.id === this.props.image.id) && !this.state.loading) {
		// 	//console.log('params.id loading')
		// 	this.setState({loading: true}) // before browser push state
		// }

		//push new url route
		if((this.props.photo.photo.id === this.props.image.id) && this.state.loading) {
			this.setState({loading: false})
			const { match, postId, image } = this.props;
			if(match.params.id !== image.id) {
				this.props.history.push(`/pictures/${image.id}?post_id=${postId}`, {modal: true, returnTo: returnTo})
				// this.setState({loading: true}) // before browser push state
			}
		}
	},

	componentWillUnmount() {
		//TODO
		//loading false
	},

	render() {
		const { loading } 							= this.state,
		{ postId, image, className, username, pClassName, photo:{modal} } 	= this.props;
		if(!image.id) {
			return(
				<div className={pClassName} >
		           <div 
		           		className="img-dv-ctnr" 
		           		style={{
		           			position: 'relative', 
		           			top: '50px'
		           		}}>
		           		<img 
		           			className={className} 
		           			src={image.webPath} 
		           			style={{
		           				width: "40px !important"
		           			}}
		           			/>
		           		<div className="rmv-reason" style={{color: 'red'}}>
		           			{image.reason}
		           		</div>
		           	</div>
		        </div>
			)
		}
		/////
		return(
			<Link 
				to={{pathname: `/pictures/${image.id}`, query:{post_id: postId}, state:{modal: true, returnTo: this.props.location.pathname} }} 
				className={pClassName} 
				onClick={this.getImage.bind(this, image)}>
	           <div className="img-dv-ctnr">
	           		{loading && <span className="loader-bar"></span>}
	           		<img src={image.webPath} className={className} />
	           	</div>
	        </Link>
		)
	}
})

/////
export default connect(state => ({
	photo: state.Photo,
	photos: state.Photos.photos,
}))(Image)