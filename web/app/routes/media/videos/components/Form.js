import React 						from 'react'
import createReactClass 			from 'create-react-class'
import axios 						from 'axios'
import { fromJS } 					from 'immutable';
import { connect } 					from 'react-redux'
import ReactDOM, { findDOMNode } 	from 'react-dom'
import onClickOutside 				from 'react-onclickoutside'
import { bindActionCreators } 		from 'redux'
import { BASE_PATH } 				from '../../../../config/api'
import { 
	App as AppActions,
	PostForm as PostFormActions
} 									from '../../../../actions'

import { VideoUploader } 		from '../../../../components/social/home/form/PostFootElement'


import MyLoadable    from '../../../../components/MyLoadable'
const PostFootElement 	= MyLoadable({loader: () => import('../../../../components/social/home/form/PostFootElement')})


const clickOutsideConfig = {
  	excludeScrollbar: true
};

/////////
//PostForm
const Form  = onClickOutside(
	createReactClass({

		uploader : undefined,

		getInitialState() {

	        return {
				vUploader: false,
				videoName: '',
				unique: this.getUniqueForm(),
				errors : {},
				initialized: false,
				submittingPost: false,
	      		invalid: false,
	      		videoUploaderOption: false
			}
	    },


		composeData() {
			const {videoName, unique } = this.state,
			{ typeValue, confindenceValue, timelineId, timelineType } = this.props;
			formData	= {
				rmv_arr 	: '',
				files 		: {},
				type 		: typeValue,
				isMainPost  : true,
				confidence 	: confindenceValue,
				videoName 	: videoName,
				unique      : unique,
				timelineId: timelineId,
				timelineType: timelineType,
			}

			this.sendPost(formData)
		},

		sendPost(data) {
			axios.post(`${BASE_PATH}/api/posts/create`, data)
				.then((res) => {
					this.props.dispatch(PostsActions.newPost(res.data.post));
					this.afterSend();
				}, function(err) {
					if(err.response) {
					console.log(err.response.data);	
					console.log(err.response.status);
					console.log(err.response.headers);				
				} else if(err.request) {
					console.log(err.request);
				} else {
					console.log(err.message);
				}
				console.log(err.config);
			})
		},

		beforeSend() {
			this.setState({submittingPost: true});
		},

		afterSend() {
			const unique =  this.getUniqueForm(),
			{ dispatch } = this.props;
			this.setState({
				gapHours: 0,
				videoName: '',
				gapMinutes: 0,
	            failedFiles: [],
				unique: unique,
	            successFiles: [],
				submittedFiles: [],
				submittingPost: false,
				editorClassnames: 'custom-form-editor',
				editorState: EditorState.push(this.state.editorState, ContentState.createFromText(''))
			})
			this.props.postFormFocus(false)
			this.uploader.methods.reset();
			this.uploader.methods.setParams({unique: unique});
			this.props.reset(); //dispatch
			const 	gapContainer 	= $('.postform').find('.gap-tm-cont'),
					selectRecip 	= $('.postform').find('.pst-select-recip');

	        if(!selectRecip.hasClass('pst-select-hide'))
	        	selectRecip.toggleClass('pst-select-hide');

			if(!gapContainer.hasClass('pst-select-hide')) 
				gapContainer.toggleClass('pst-select-hide');
		},

		getVideoName(name) {
			this.setState({videoName: name})
		},

		typeChange(type) {
			const { dispatch } = this.props;
			this.setState({
				typeValue: type.value,
				typeName: type.name
			})
			dispatch(AppActions.formTypePane(false)) 	//hide typePane
		},

		handleSubmit(e) {
			e.preventDefault();
			const self 		= this,
			{ dispatch } 	= this.props;
			this.beforeSend();
			this.composeData();
		},

		handleVideoUploader(e) {
			this.setState({vUploader: true})
			// this.refs.videoUploader.startUpload() //start upload video
		},

		toggleVideoUploaderOption() {
			const self = this
			this.setState({
	            videoUploaderOption: !self.state.videoUploaderOption
	        })
	        console.log('toggleVideoUploaderOption')
		},

		initialize() {
			const self = this;
			///TODO
			self.setState({
				initialized: true,
			})
			self.registerEvents();
		},

		registerEvents () {

		},

		componentWillMount () {
			if(canUseDOM) {
				this.initialize();
			}
	    },

	    getUniqueForm () {
			// Math.random should be unique because of its seeding algorithm.
			// Convert it to base 36 (numbers + letters), and grab the first 9 characters
			// after the decimal.
			return Math.random().toString(36).substr(2, 9);
		},

	    componentDidMount() {
	    	if(typeof this.uploader === 'undefined') {
	    		this.initialize();
	    	}
	    },

	    componentWillReceiveProps(nextProps) {
	    	
	    },

	    //method from 'react-onclickoutside' module
		handleClickOutside(e) {
		    this.props.postFormFocus(false)
		},

	    handleFormClick (e) {
			const { dispatch } = this.props;
	        this.props.postFormFocus(true)
		},

		componentWillUnmount() {
			this.uploader = null
		},

		// shouldComponentUpdate(nextProps, nextState) {
		// 	return this.state !== nextState ||
		// 		this.props.
		// },

		render() {
			const self = this,
			{ 
				initialized, videoUploaderOption  
			} 				= this.state,
			mentionPlugin 	= this.mentionPlugin,
			disabled 		= true;

			return (
				<div>
					<div 
						className={this.props.form_focus ? `gl-frm-a out-active` : `gl-frm-a`} 
						id="gl_frm_a"
						onClick={this.handleFormClick}>
					    <div className="triangle-up-form postform" id="postform">
					    	<form className={this.state.submittingPost ? `post-form minOpac` : `post-form`} id="post_type" ref="_postForm" onFocus={this.handleFocus} onBlur={this.handleBlur}>		            
					            <div className="home-form ">
					            </div>
					            <div id="post_form_body" className="post-form-body">
					                <div className="form-body">
				                        <div className="post-support-textarea">
	                						<div className="expandingArea">
	                							<div className ="post-form-textarea autoExpand-post editearea">                
									                <div 
									                	onClick={this.focus} 
									                	className={this.state.editorClassnames}>
									                </div>
									            </div>
	                						</div>
	            						</div>
					                </div>
					                <input type="file" className="post-form-files" id="post_type_files"/>
					                			                 
				                	{initialized && 
				                		<VideoUploader  
					                		ref="videoUploader"
					                		dispatch={this.props.dispatch}
					                		getVideoName={this.getVideoName} 
					                		vUploader={this.state.vUploader}
					                		submittingPost={this.state.submittingPost}
					                		toggleVideoUploaderOption={this.toggleVideoUploaderOption}
					                		/>
				                	}
					            </div>
				                <div className={!videoUploaderOption ? `gl-frm-foo` : `gl-frm-foo pst-foo-opt-space`}>
				                	<div 
				                		className={!videoUploaderOption ? `pst-foo-opt-space` : `pst-foo-opt-space active`}
				                		>
				                	</div>
			                        <div className="gl-frm-foo-ct" id="_gl_frm_foo_ct">
			                        	<div className={!this.props.form_focus ? `hide-btn-dv hide-active` : `hide-btn-dv`}>
			                        	</div>
			                        	<div className={!this.props.form_focus ? `more-dv` : `more-dv hide-active`}></div>
			                            {initialized && 
			                            	<PostFootElement 
				                            	footType="videoForm" 
				                            	dispatch={this.props.dispatch} 
				                            	home={this.props.home}
					                            profile={this.props.profile}
					                            user={this.props.user}
					                            history={this.props.history}
					                            auth_data={this.props.auth_data}
					                            access_token={this.props.access_token}
				                            	handleVideoUploader={this.handleVideoUploader} 
				                            	toggleVideoUploaderOption={this.toggleVideoUploaderOption}
				                            	videoUploaderOption={videoUploaderOption}
				                            	/>
			                            }
			                            <div className="gl-frm-btm-li-post-r opt-rgt">
			                                <div className="gl-ldr-pst">
			                                	{this.state.submittingPost && <div className="ajax-loader-form" id=""></div>}
			                                </div>
			                                <button 
			                                	type="submit" 
			                                	id="submit-post" 
			                                	value="submit" 
			                                	onClick={this.handleSubmit} 
			                                	disabled={disabled}
			                                	className="btn btn-primary btn-sm">Post</button>
			                            </div>
			                        </div>
			                    </div>
					        </form>
					    </div>
					</div>
				</div>
			)
		}
	}), clickOutsideConfig
)

/////
function mapDispatchToProps(dispatch) {
    return  bindActionCreators(Object.assign({}, PostFormActions), dispatch)
}

//////
///////
export default connect(state => ({
	editors 		: state.PostForm.editors,
	typeValue 		: state.PostForm.typeValue,
	recipients 		: state.PostForm.recipients,
	leftEditors 	: state.PostForm.leftEditors,
	rightEditors 	: state.PostForm.rightEditors,
	defaults 		: state.Users.defaults,
	confidPane 		: state.App.confidPane,
	confindenceValue: state.Confidence.confindenceValue,
	confindenceName	: state.Confidence.confindenceName,
	generatedVideoName: state.VideoUploader.videoName
}), mapDispatchToProps)(Form)