import React 						from 'react'
import createReactClass 			from 'create-react-class'
import axios 						from 'axios'
import { connect } 					from 'react-redux'
import { fromJS }					from 'immutable'
import Status 						from 'react-fine-uploader/status'
import ReactDOM, { findDOMNode } 	from 'react-dom'
import { canUseDOM } 				from '../../../../utils/executionEnvironment'
import { BASE_PATH } 				from '../../../../config/api'
import createStickerPlugin 			from 'draft-js-sticker-plugin';

import { 
    RichUtils, getDefaultKeyBinding, 
    KeyBindingUtil, EditorState,
    CompositeDecorator, convertToRaw,
    Modifier, convertFromRaw, ContentState 
} 									from 'draft-js'
import Editor, 
	  { createEditorStateWithText } from 'draft-js-plugins-editor' // eslint-disable-line import/no-unresolved
import createHashtagPlugin 			from 'draft-js-hashtag-plugin'
import createLinkifyPlugin 			from 'draft-js-linkify-plugin'
import createEmojiPlugin 			from 'draft-js-emoji-plugin' // eslint-disable-line import/no-unresolved
import createMentionPlugin, 
{ defaultSuggestionsFilter } 		from 'draft-js-mention-plugin' // eslint-disable-line import/no-unresolved
import MultiDecorator 				from 'draft-js-plugins-editor/lib/Editor/MultiDecorator';
import { 
	SelectRecipient, PostFootElement, 
	BuildHtmlString
 } 									from '../../../../components'
import * as DraftFuncs 		    	from '../../../social/home/form/DraftFuncs'
import { 
	App as AppActions,
	Posts as PostsActions,
	PostForm as PostFormActions,
} 									from '../../../../actions'

import '../../../../styles/social/form/post-form.scss'
import '../../../../styles/fine-uploader-gallery.scss'
// import '../../../../styles/fine-uploader-new.scss'

import MyLoadable    from '../../../../components/MyLoadable'
const Dropzone  = MyLoadable({loader: () => import('react-fine-uploader/dropzone')}),
Thumbnail 		= MyLoadable({loader: () => import('react-fine-uploader/thumbnail')}),
RetryButton 	= MyLoadable({loader: () => import('react-fine-uploader/retry-button')}),
ProgressBar 	= MyLoadable({loader: () => import('react-fine-uploader/progress-bar')}),
PauseResumeButton = MyLoadable({loader: () => import('react-fine-uploader/pause-resume-button')}),
FileInput 		= MyLoadable({loader: () => import('react-fine-uploader/file-input')})


///////
//////
const isFileGone = status => {
    return [
        'canceled',
        'deleted',
    ].indexOf(status) >= 0
}

const emojiPlugin 					= createEmojiPlugin({
	selectButtonContent: ''
}),
{ EmojiSuggestions, EmojiSelect } 	= emojiPlugin,
hashtagPlugin 						= createHashtagPlugin(),
linkifyPlugin 						= createLinkifyPlugin({
  	component: (props) => (
    	// eslint-disable-next-line no-alert, jsx-a11y/anchor-has-content
    	<a {...props} onClick={() => alert('Clicked on Link!')} />
  	)
})

const AddPostForm  = createReactClass({

	getInitialState() {
		const compositeDecorator = new MultiDecorator([
			new CompositeDecorator([
	            {
	                strategy: DraftFuncs.handleStrategy,
	                component: DraftFuncs.HandleSpan,
	            },
	            {
	                strategy: DraftFuncs.hashtagStrategy,
	                component: DraftFuncs.HashtagSpan,
	            },
	        ])
	    ])

	    const mentions = this.props.defaults.map(function(user) {
    		return {
    			name: user.firstname + ' ' + user.lastname,
    			link: 'http://opinion.com/' + user.username,
    			avatar: user.profilePic
    		}
    	});

    	this.mentionPlugin = createMentionPlugin({
			mentions,  //mentions
			mentionComponent: (props) => (
			    <span
			      	className={props.className}
			      	onClick={() => alert(props.mention.get('link'))}
			    	>
			      {props.decoratedText}
			    </span>
			),
			///// positionSuggestions,

		});
		
		return {
			content: '',
			rmv_arr: [],  	
			submittingPost: false,
            submittedFiles: [],
            completedFiles: [],
            initialized: false,
            successFiles: [],
            failedFiles: [],
            emojibtn: false,
      		MentionSuggestions: null,
      		mentions: mentions,
      		suggestions: mentions,
            editorState: EditorState.createEmpty(compositeDecorator)
		}

	},

	uploader : undefined,

	composeData() {
		BuildHtmlString(convertToRaw(this.state.editorState.getCurrentContent())).then(htmlString => {
			const formData = {
				type 		: this.props.post.type,
				isMainPost  : false,
				rmv_arr 	: '',
				content 	: htmlString,
			}

			this.sendPost(formData)
		});
	},
	
	sendPost(data) {
		const self 			= this,
		uploader 			= this.uploader,
		{ dispatch, 
		 postId, refer } 	= this.props;
		this.beforeSend();
		axios.post(`${BASE_PATH}/api/posts/add`, data, {
			params :{
				postId: postId,
				refer: refer
				//todo
			}
		})
		.then(function (res) {
			 	const post = res.data.post;
				dispatch(PostsActions.pushAllie(post));
				self.afterSend();
				self.props.onAddToPost('success');
			}, function(err) { 
				self.afterSend();
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
		});
	},

	_handleKeyCommand(command) {
        const { editorState } = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    },

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(this.state.editorState, blockType)
        );
    },

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
        );
    },

    handleKeyCommand(command) {
        this._handleKeyCommand(command)
    },

    toggleBlockType(type) {
        this._toggleBlockType(type)
    },

    toggleInlineStyle(style) {
        this._toggleInlineStyle(style)
    },

	beforeSend () {
		this.setState({submittingPost: true})
	},

	afterSend () {
		this.setState({submittingPost: false});
		this.uploader.methods.reset();
	},

	focus() {
        this.editor.focus()
    },

	handleSubmit(e) {
		e.preventDefault();
		this.beforeSend();
		this.composeData();
	},

	getImageFromCache(id, e) {
    	e.preventDefault();
    	const filename 		= this.state.completedFiles[id]['filename'];
    	this.props.getImageFromCache(filename, 'galleryaddpost');
    },

	deleteFile(id, e) {
    	e.preventDefault();
    	const self 	= this,
    	postId 		= this.props.post.id,
    	filename 	= this.state.completedFiles[id]['filename'];

    	this.uploader.methods.cancel(id);			//just to remove data in form
    	//custom delete request 
    	axios.post(`${BASE_PATH}/api/_gal_add_post/delete`, { 
    			params : {
					filename: filename,
					postId: postId
				}
			}).then(function (res) {
				console.log(res.data);
			}, function(err) {
				console.log('err :', err);
		})
    },

    cancelFile(id, e) {
    	e.preventDefault();
    	this.uploader.methods.cancel(id);
    },

	onChange(editorState) {
        this.setState({editorState})
    },

    initialize () {
    	const self = this
		Promise.all([
			import('fine-uploader-wrappers/traditional')
		]).then(function([
				_traditional
		]) {
			const FineUploaderTraditional =	_traditional.default;
			const uploader = new FineUploaderTraditional({
				options: {
					debug: true,
				  	request: {
				        endpoint: 'http://opinion.com' + BASE_PATH + Routing.generate('_uploader_upload_galleryaddpost'),
				        customHeaders: {
				        	Authorization: "Bearer " + self.props.access_token
				        }
				    },
				    autoUpload: true,
				    success: true,
				    iframeSupport: {
				        localBlankPagePath: ""
				    },
				    cors: {
				        expected: true 
				    },
				    resume: {
				        enabled: true
				    },
				    deleteFile: {
				      	forceConfirm: false,
				        enabled: true,  
				        method: "POST", 
				        endpoint: 'http://opinion.com' + BASE_PATH + Routing.generate('api_remove_uploader_in_gallery_post')
				    },
				  	validation: {
				        itemLimit: 50,
				        sizeLimit: 300000000,
				        allowedExtensions: ['jpeg', 'jpg', 'gif', 'png']
				    },
				    callbacks: {
				      	onComplete: function(id, name, response) {  }
				    }
				}
			}); //end uploader's init

			self.uploader 	= uploader;
			const fileInput 		= <FileInput multiple accept='image/*' uploader={ uploader } />


			////
	    	const { hasCommandModifier } 	= KeyBindingUtil
			
			self.setState({
				initialized: true,
				fileInput: fileInput,
				hasCommandModifier: hasCommandModifier
			})
			self.registerEvents();
		})
    },

    registerEvents() {
    	const { post:{id, images}, defaults } = this.props;

     	this.uploader.methods.setParams({postId: id});

    	this.uploader.on('submitDelete', (iD) => {
    		this.uploader.setDeleteFileParams({filename: this.uploader.getName(iD)}, iD);
    	})

    	this.uploader.on('submit', (iD, name) => {
    		const submittedFiles = this.state.submittedFiles
            submittedFiles.push(iD)
            this.setState({submittedFiles: submittedFiles })
    	})

        this.uploader.on('statusChange', (iD, oldStatus, newStatus) => {        	
        	if (newStatus === 'uploading') {
        		const li = findDOMNode(this).getElementsByTagName("li")[iD];
    			//const li = findDOMNode(this).getElementsByClassName("qq-upload-file")[iD];             
                li.className = "qq-upload-file in-progress";
            }
            else if (newStatus === 'upload successful') {
            	const li = findDOMNode(this).getElementsByTagName("li")[iD];
                li.className = "qq-upload-file";
                const successFiles = this.state.successFiles

                successFiles.push(iD)
                this.setState({ successFiles })
            }
            else if (isFileGone(newStatus)) {
                const li = findDOMNode(this).getElementsByTagName("li")[iD];
                li.innerHTML = "";
            }
        })

        this.uploader.on('complete', (id, name, res) => {
        	const li = findDOMNode(this).getElementsByTagName("li")[id];
        	const completedFiles = this.state.completedFiles

            completedFiles[id] = {'originalName': name, 'filename': res.filename}
            this.setState({ completedFiles })

        	li.getElementsByClassName('fine-uploader-tag-button')[0]
        	  .setAttribute('data-filename', `${res.filename}`);
		})
    },

    onSearchChange({ value }) {
	    // An import statment would break server-side rendering.
	    const mentions = this.state.mentions;
	    this.setState({
	      suggestions: defaultSuggestionsFilter(value, mentions),
	    });
	    // require('whatwg-fetch'); // eslint-disable-line global-require

	    // while you normally would have a dynamic server that takes the value as
	    // a workaround we use this workaround to show different results
	    // let url = '/data/mentionsA.json';
	    // if (value.length === 1) {
	    //   url = '/data/mentionsB.json';
	    // } else if (value.length > 1) {
	    //   url = '/data/mentionsC.json';
	    // }

	    // fetch(url)
	    //   .then((response) => response.json())
	    //   .then((data) => {
	    //     this.setState({
	    //       	suggestions: fromJS(data),
	    //     });
	    // });
	},

	componentWillMount () {
        if(canUseDOM) {
        	this.initialize();
        }
    },

    componentDidMount() {
    	if(typeof this.uploader === 'undefined') {
    		this.initialize();
    	} 	
    },

    componentDidUpdate(oldProps) {
        // if(!oldProps.emoji && this.props.emoji) {
        //     this.setState({currentTab: this.props.currentTab})
        // }
        if(this.props != oldProps) {
        	
        }
    },

    componentWillUnmount () {
        window.document.removeEventListener('click', this.handleFormClick, false);
    },

    handleFormClick (e) {
		const { dispatch } = this.props;
		if(findDOMNode(this).contains(e.target)) {
            // dispatch(AppActions.addPostFormFocus(true));
        } else {
			// dispatch(AppActions.addPostFormFocus(false));
		}
	},

	componentWillReceiveProps(nextProps) {
    	if(this.props.defaults !== nextProps.defaults) {
        	const mentions = nextProps.defaults.map(function(user) {
        		return {
        			name: user.firstname + ' ' + user.lastname,
        			link: 'http://opinion.com' + user.username,
        			avatar: user.profilePic
        		}
        	});
        	this.setState({
        		mentions: mentions,
      			suggestions: mentions, 
        	})
        }
    },

	render() {
		const self 			= this,
		uploader 			= this.uploader,
		{ post, user } 		= this.props, 
		{ 	
			editorState, 
			fileInput, 
			emojibtn,
		 	initialized,
			suggestions 
		} 				= this.state,
		mentionPlugin 	= this.mentionPlugin,
		{ 
			MentionSuggestions 
		} 				= mentionPlugin,
		plugins 		= [mentionPlugin, emojiPlugin, hashtagPlugin, linkifyPlugin],
    	timesIco 			= <i className="fa fa-times" aria-hidden="true"><span></span></i>,
    	retryIco 			= <span className="qq-retry-icon">Retry</span>;
    	//////
    	/////

		return (
			<div className="add-frm-pst">
				<div className={this.props.focus ? `add-frm-pst-a active` : `add-frm-pst-a`}>
				    <div className="add-form-dv">
				    	<form className={this.state.submittingPost ? `add-form loading` : `add-form`} onFocus={this.handleFocus} onBlur={this.handleBlur}>
		                	<div className="post-support-textarea">
		                		<div className="lft-addForm-dv">
					                <div className="pic-ctnr">
					                    <img src={user.profile_pic.web_path} className="img-tg" />
					                </div>
					            </div>
        						<div className="expandingArea">
        							<div className ="post-form-textarea autoExpand-post editearea">                
						                {initialized && <div onClick={this.focus} >
						                    <Editor 
						                        // blockStyleFn={getBlockStyle}
						                        // customStyleMap={styleMap}
						                        ref={(elem) => {this.editor = elem}}
						                        spellCheck={true}
						                        plugins={plugins}
						                        placeholder="editing..."
						                        onChange={this.onChange}
						                        editorState={editorState}
						                        keyBindingFn={DraftFuncs.myKeyBindingFn} 
						                        handleKeyCommand={this.handleKeyCommand}
						                    />
						                    <EmojiSuggestions />
						                    <MentionSuggestions
										        onSearchChange={this.onSearchChange}
										        suggestions={suggestions}
										        />
						                </div>
						            	}
						            </div>
        						</div>
        					</div>
			                <div className="fn-upl-add-pst">
				            	<div className="qq-gallery">
				                    <div className="zone-upload-add-form">
							            <ul className="qq-upload-list-selector qq-upload-list" role="region">
							                {this.state.submittedFiles.map(function(id) {
									            return (
									            	<li key={id} ref={id} className="qq-upload-file">
									            		<Thumbnail id={ id } uploader={ uploader } className="thumb-pst-img"/>
									            		<button className="react-fine-uploader-delete-button" onClick={this.deleteFile.bind(this, id)} type="submit">
									            			<i className="fa fa-times" aria-hidden="true"><span></span></i>
									            		</button>
									            		<button 
								            				className="react-fine-uploader-cancel-button com-dlt-thumb-btn" 
								            				onClick={this.cancelFile.bind(this, id)} type="submit">
									            			{timesIco}
									            		</button>
									            		<RetryButton id={ id } uploader={ uploader } children={retryIco} />
									            		<button 
							                    			className="fine-uploader-tag-button" 
							                    			onClick={this.getImageFromCache.bind(this, id)} 
							                    			type="button">
							                    			<span className="tag-ico" ></span>
							                    		</button>
									            	</li>
									            )      
									        }.bind(this))}
							            </ul>
						           </div>                      
					            </div>
					        </div>
				            <div className="gl-frm-foo">
		                        <div className="gl-frm-foo-ct">
		                            {initialized && 
		                            	<PostFootElement 
			                            	handleVideoUploader={this.handleVideoUploader} 
			                            	footType="addPostForm" 
			                            	fileInput={fileInput}
			                            	EmojiSelect={EmojiSelect}
			                            	insertEmoji={this.insertEmoji}
			                            	toggleEmoji={this.toggleEmoji} 
			                            	{...this.props}/>
		                            }
		                            <div className="gl-frm-btm-li-post-r opt-rgt">
		                                <div className="gl-ldr-pst">
		                                	{this.state.submittingPost && <div className="ajax-loader-form" id=""></div>}
		                                </div>
		                                <button type="submit" onClick={this.handleSubmit} className="btn btn-primary btn-sm">Update</button>
		                            </div>
		                        </div>
	                    	</div>
				        </form>
				    </div>
				</div>
			</div>
		)		
	}
})

export default connect(state => ({
	defaults 		: state.Users.defaults
}))(AddPostForm)