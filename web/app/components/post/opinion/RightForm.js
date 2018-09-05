import React 						from 'react'
import createReactClass 			from 'create-react-class'
import axios 						from 'axios'
import { fromJS } 					from 'immutable'
import { connect } 					from 'react-redux'
import ReactDOM, { findDOMNode }	from 'react-dom'
import classnames 					from 'classnames'
import EmojiPicker 					from 'emojione-picker'
import createEmojiPlugin 			from 'draft-js-emoji-plugin'
import createStickerPlugin 			from 'draft-js-sticker-plugin';
import { 
    RichUtils, getDefaultKeyBinding, 
    KeyBindingUtil, EditorState,
    CompositeDecorator, convertToRaw,
    Modifier, ContentState
} 									from 'draft-js'
import Editor, 
	  { createEditorStateWithText } from 'draft-js-plugins-editor' // eslint-disable-line import/no-unresolved
import createHashtagPlugin 			from 'draft-js-hashtag-plugin'
import createLinkifyPlugin 			from 'draft-js-linkify-plugin'
import createMentionPlugin, 
{ defaultSuggestionsFilter } 		from 'draft-js-mention-plugin'; // eslint-disable-line import/no-unresolved
import MultiDecorator 				from 'draft-js-plugins-editor/lib/Editor/MultiDecorator';
import { canUseDOM } 				from '../../../utils/executionEnvironment'
import { BASE_PATH } 				from '../../../config/api'
import * as DraftFuncs 				from '../../social/home/form/DraftFuncs'
import { BuildHtmlString } 			from '../../../components'
import { 
	CommentForm as CommentFormActions,
	Comments as CommentsActions,
	Authors as AuthorsActions
} 									from '../../../actions/post'

import '../../../styles/post/commentForm.scss'
import '../../../styles/social/content-editable.scss';



const isFileGone = status => {
    return [
        'canceled',
        'deleted',
    ].indexOf(status) >= 0
}

let Dropzone = null,
	Thumbnail = null, 
	fileInput = null,
	RetryButton = null,
	ProgressBar = null,
	DeleteButton = null,
	CancelButton = null,
	PauseResumeButton = null;

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

const RightForm  = createReactClass({

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
	    ]);

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
			submittedFiles: [],
			completedFiles: [],
            successFiles: [],
            failedFiles: [],
            emojibtn: false,
			files: [],
			content: {},
			focus: false,
			isLoading: false,
        	plugins: null,
        	topPlace: false,
        	initialized: false,
        	EmojiSuggestions: null,
        	hasCommandModifier: null,
        	fileInput: null,
			emojibtn: false,
      		MentionSuggestions: null,
      		mentions: mentions,
      		suggestions: mentions,
			editorState: EditorState.createEmpty(compositeDecorator)
		}

	},
	
	uploader : undefined,

	submittedFiles(files) {
		this.setState({files: files});
	},

	handleFormClick (e) {
		const { dispatch } = this.props;
		if(findDOMNode(this).contains(e.target)) {
			this.setState({focus: true})
            //dispatch(AppActions.postFormFocus(true));
        } else {
        	//this.setState({focus: true})
		}
	},

	getImageFromCache(id, e) {
    	e.preventDefault();
    	const filename 		= this.state.completedFiles[id]['filename'];
    	this.props.getImageFromCache(filename, 'galleryright');
    },

	deleteFile(id, e) {
    	e.preventDefault();
    	const self 	= this,
    	postId 		= this.props.postId,
    	uploader 	= this.uploader,
    	filename 	= this.state.completedFiles[id]['filename'];

    	uploader.methods.cancel(id);			//just to remove data in form
    	axios.post(`${BASE_PATH}/api/_gal_right/delete`, { 
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

	composeData() {
		BuildHtmlString(convertToRaw(this.state.editorState.getCurrentContent())).then(htmlString => {
			console.log(htmlString)
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
		const self 				= this,
		{ dispatch, 
		  postId, 
		  side 
		} 						= this.props,
		uploader				= this.state
		
		dispatch(CommentsActions.submitSideComment(postId, side, data)).then(comment => {
			self.props.onSideComment(comment, side)
		});
		
		self.setState({
			focus: false, 
			content: {},
            failedFiles: [],
			isLoading: true,
            successFiles: [],
			submittedFiles: [],
			editorState: EditorState.push(this.state.editorState, ContentState.createFromText(''))
		})
		uploader.methods.reset();
		uploader.methods.setParams({postId: postId});
	},

	submitComment(e) {
		e.preventDefault();
		this.composeData();
	},

	_handleKeyCommand(command) {
        const {editorState} = this.state;
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

    focus() {
        console.log('focuced');
        this.editor.focus()
    },

    onChange(editorState) {
        this.setState({
        	editorState: editorState
        })
    },

    handleKeyCommand(command) {
        this._handleKeyCommand(command)
    },

    myKeyBindingFn(e: SyntheticKeyboardEvent): string {
	  	if (e.keyCode === 83 /* `S` key */ && this.state.hasCommandModifier(e)) {
	    	return 'myeditor-save';
	  	}
	  	return getDefaultKeyBinding(e);
	},

    toggleBlockType(type) {
        this._toggleBlockType(type)
    },

    toggleInlineStyle(style) {
        this._toggleInlineStyle(style)
    },

	toggleEmoji() {
		const self = this;
		self.setState({emojibtn: !self.state.emojibtn})
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

	handleDocClick(e) {     
        if(!ReactDOM.findDOMNode(this.emojiDiv).contains(e.target) && this.state.emojibtn) {
        	this.toggleEmoji()
        }
    },

    initialize () {
    	const self = this
		Promise.all([
			import('fine-uploader-wrappers/traditional'),
			import('react-fine-uploader/dropzone'),
			import('react-fine-uploader/thumbnail'),
			import('react-fine-uploader/file-input'),
			import('react-fine-uploader/retry-button'),
			import('react-fine-uploader/progress-bar'),
			import('react-fine-uploader/delete-button'),
			import('react-fine-uploader/cancel-button'),
			import('react-fine-uploader/pause-resume-button')
		]).then(function([
				_traditional,
				_dropzone,
				_thumbnail,
				_fileInput,
				_retryButton,
				_progressBar,
				_deleteButton,
				_cancelButton,
				_pauseResumeButton
		]) {
			const FineUploaderTraditional =	_traditional.default;
			const uploader = new FineUploaderTraditional({
				options: {
					debug: true,
				  	request: {
				        endpoint: 'http://opinion.com' + BASE_PATH + Routing.generate('_uploader_upload_galleryright'),
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
			Dropzone 		= _dropzone.default
			Thumbnail 		= _thumbnail.default
			const FileInput = _fileInput.default
			RetryButton 	= _retryButton.default
			ProgressBar 	= _progressBar.default
			DeleteButton 	= _deleteButton.default
			CancelButton 	= _cancelButton.default
			PauseResumeButton = _pauseResumeButton.default
			fileInput 		= <FileInput multiple accept='image/*' uploader={ uploader } />


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
    	const self 		= this,
    	postId 			= this.props.postId;

    	// this.uploader.on('submitDelete', (id) => {
    	// 	self.state.uploader.setDeleteFileParams({filename: self.state.uploader.getName(id)}, id);
    	// })
    	this.uploader.on('submit', (id, name) => {
    		const submittedFiles = this.state.submittedFiles
            submittedFiles.push(id)
            this.setState({submittedFiles: submittedFiles })
    	})

        this.uploader.on('statusChange', (id, oldStatus, newStatus) => {        	
        	if (newStatus === 'uploading') {
    			const li = findDOMNode(this).getElementsByTagName("li")[id];             
                li.className = "qq-upload-file in-progress";
            }
            else if (newStatus === 'upload successful') {
            	const li = findDOMNode(this).getElementsByTagName("li")[id];
                li.className = "qq-upload-file";
                const successFiles = this.state.successFiles
               
                successFiles.push(id)
                this.setState({ successFiles })
            }
            else if (isFileGone(newStatus)) {
                const li = findDOMNode(this).getElementsByTagName("li")[id];
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

        this.uploader.methods.setParams({postId: postId})
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

	componentWillMount() {
		if(canUseDOM) {
			this.initialize();
		}	
	},

    componentWillUnmount () {

    },

	componentDidMount() {
		if(typeof this.uploader === 'undefined') {
			this.initialize();
		}    	
    },

	render() {
		const self 					= this,
		uploader 					= this.uploader,
		{ user, post, side } 		= this.props,
		{ editorState, fileInput, 
		 initialized,
		 suggestions,
		 topPlace
		} 							= this.state,
		mentionPlugin 	= this.mentionPlugin,
		{ 
			MentionSuggestions 
		} 				= mentionPlugin,
		plugins 		= [mentionPlugin, emojiPlugin, hashtagPlugin, linkifyPlugin],
    	timesIco 					= <i className="fa fa-times" aria-hidden="true"><span></span></i>,
    	retryIco 					= <span className="qq-retry-icon">Retry</span>;
    	
    	///////return
 		return(
			<div className="div-commentForm" onClick={this.handleFormClick}>
			    <form className="formComment">
			        <div className="vis-part">
			            <div className="left-commentForm">
			                <div className="cmt-frm-pr-pic-lk" >
			                    <img src={user.profile_pic.web_path} className="cmt-frm-pr-pic" />
			                </div>
			            </div>
			            <div className="center-commentForm">
			                <div className="sCenter-commentForm">
			                    <div className="cmt-ctnr">
			                    	<div className="div-textareaComment">
						                <div className="expandingArea">                    
						                	<div className="comment-form-textarea autoExpand-comment">
								                {initialized && <div onClick={this.focus} >
								                    <Editor 
								                        // blockStyleFn={getBlockStyle}
								                        // customStyleMap={styleMap}
								                        ref={(elem) => {this.editor = elem}}
								                        spellCheck={true}
								                        plugins={plugins}
								                        placeholder="comment ..."
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
			                        <div className="commentFormImageHolder">
						            	<div className="qq-gallery">  
						            		<div className="zone-upload-cmt" >
							            		<ul className="qq-upload-list-selector qq-upload-list upl-list-ul" role="region">
									                {this.state.submittedFiles.map(function(id) {
											            return (
											            	<li key={id} className="qq-upload-file com-img-li">
											            		<Thumbnail id={ id } uploader={ uploader } className="thumb-cmt-img"/>
											            		<button className="react-fine-uploader-delete-button com-dlt-thumb-btn" onClick={this.deleteFile.bind(this, id)} type="submit">
											            			<i className="fa fa-times" aria-hidden="true"><span></span></i>
											            		</button>
											            		<CancelButton id={ id }  uploader={ uploader } children={timesIco} />
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
			                    </div>
			                    <div className={this.state.focus ? `cmt-frm-btm-dv in` : `cmt-frm-btm-dv out`}>
			                        <div className="dynamic-partInCommentForm">
			                            <div className="divUploadComment">
			                            	{initialized && fileInput}
										    <div className="emoji-dv" ref={(el)=> {this.emojiDiv = el}}>
							                    {initialized && <EmojiSelect />}
							                </div>
										    <a href="" className="emoji-lk"></a>
			                            </div>
			                            <div className="divSubmitComment">
			                            	<div className="ctrl-dv"></div>
			                            	<div className="sbm-dv">
			                                	<button type="submit" className="submit-comment" onClick={this.submitComment}>comment</button>
			                            	</div>
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			        </div>
			    </form>
			</div>
		)
	}
})
/////
export default connect(state =>({
	user: state.User.user,
	defaults: state.Users.defaults,
}))(RightForm)