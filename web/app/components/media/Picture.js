import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { Link } 			from 'react-router-dom'

import { 
	Photo as PhotoActions,
    App as AppActions
}                           from '../../actions'

const Picture  = createReactClass({

	getInitialState() {
		return {
			route: '',
			loading: false,
		}
	},

	getImage (image, e) {
		e.preventDefault();
		const { dispatch, tag, location : {pathname}, image: { id } } = this.props;
		// loading 	= true,
		// params 		= { id: id },
		// query 		= { tag: tag },
		// status 		= {	modal: true, returnTo: pathname }
		
		//tag will be ["cover_pics", "profile_pics"]
		this.props.dispatch(PhotoActions.load(this.props.image.id, this.props.tag)) 		
		this.setState({loading: true})
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
		// 		router.push(this.state.route);
		// 	}
		// }
	},

	componentWillReceiveProps (nextProps) {
		const { image: {id} } = this.props,
		returnTo = -1; //goBack()
		// if(nextProps.photo.loading && (nextProps.photo.params.id === id) && !this.state.loading) {
		// 	console.log('params.id loading')
		// 	this.setState({loading: true}) // before browser push state
		// }

		//push new url route
		if((this.props.photo.photo.id === this.props.image.id) && this.state.loading) {
			this.setState({loading: false})
			const { router, match, tag, image:{ id } } = this.props;
			if(match.params.id !== id) {
				this.props.history.push(`/pictures/${id}?tag=${tag}`, {modal: true, returnTo: returnTo})
				// this.setState({loading: true}) // before browser push state
			}
		}
	},

	render() {
		const { loading } = this.state,
		{ tag, image, className, username, pClassName, photo:{modal}, match } 	= this.props;
		return(
			<Link 
				to={{
					pathname: `/pictures/${image.id}`, 
					search:`?tag=${tag}`, 
					state: {modal: true} }} 
				className={pClassName} 
				onClick={this.getImage.bind(this, image)}>
	           <div className="img-dv-ctnr">
	           		{loading && <span className="loader-bar"></span>}
	           		{image.web_path && <img src={image.web_path} className={className} />}
	           		{image.webPath && <img src={image.webPath} className={className} />}
	           	</div>
	        </Link>
		)
	}
})

/////
export default connect(state => ({
	photo: state.Photo,
	photos: state.Photos.photos,
}))(Picture)