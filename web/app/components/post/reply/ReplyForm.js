import React 						from 'react'
import createReactClass 			from 'create-react-class'
import axios 						from 'axios'
import { fromJS } 					from 'immutable'
import { connect } 					from 'react-redux'
import ReactDOM, { findDOMNode }	from 'react-dom'
import { Link } 					from 'react-router-dom'
import EmojiPicker 					from 'emojione-picker'
import createEmojiPlugin 			from 'draft-js-emoji-plugin'
import Status 						from 'react-fine-uploader/status'
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
	ReplyForm as FormActions,
	Authors as AuthorsActions
} 									from '../../../actions/post'

const { hasCommandModifier } = KeyBindingUtil;

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

const ReplyForm  = createReactClass( {

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
			uploader: null,
			submittedFiles: [],
            completedFiles: {},
            successFiles: [],
            failedFiles: [],
            unique: this.getUniqueForm(),
            emojibtn: false,
			files: [],
			content: '',
			focus: false,
			initialized: false,
			isLoading: false,
        	plugins: null,
        	topPlace: false,
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

	deleteFile(id, e) {
    	e.preventDefault();
    	const self 		= this,
		uploader 		= this.uploader,
    	commentId 		= this.props.comment.id,
    	filename 		= this.state.completedFiles[id]['filename'];

    	uploader.methods.cancel(id);			//just to remove data in form
    	axios.post(`${BASE_PATH}/api/_gal_undercomment/delete`, { 
    			params : {
					filename: filename,
					commentId: commentId
				}
			}).then(function (res) {
				console.log(res.data);
			}, function(err) {
				console.log('err :', err);
		})
    },

    composeData() {
    	const { editorState, unique, successFiles } = this.state
		BuildHtmlString(convertToRaw(editorState.getCurrentContent())).then(htmlString => {
			const formData	= {
					rmv_arr: '',
					unique : unique,
					content: htmlString,
				}

			this.sendPost(formData)
		});
	},

	getUniqueForm () {
		return Math.random().toString(36).substr(2, 9);
	},

	sendPost(data) {
		const self 					= this,
		{ dispatch, comment:{id} } 	= this.props,
		uploader					= this.uploader;

		this.props.onReply(id, data)
		
		self.setState({
			focus: false, 
			content: {},
            failedFiles: [],
			isLoading: true,
			unique: this.getUniqueForm(),
            successFiles: [],
			submittedFiles: [],
			editorState: EditorState.push(this.state.editorState, ContentState.createFromText(''))
		})

		uploader.methods.reset();
		uploader.methods.setParams({commentId: id})
	},

	submitComment() {
		// e.preventDefault();
		this.composeData();
	},

	_handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        //handle submit command
        if (command === 'submit') {
			this.submitComment();
		}
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
    	//handle submitting form on enter pressed
    	if(e.keyCode === 13) {
    		return 'submit';
    	}
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

    onEmojiOpen(e) {
    	console.log('emojiopen with', e)
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

	initialize () {
		const self = this
		const FineUploaderTraditional =	require('fine-uploader-wrappers/traditional').default;
		window.document.addEventListener('click', this.handleDocClick, false);

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
				        endpoint: 'http://opinion.com' + BASE_PATH + Routing.generate('_uploader_upload_galleryundercomment'),
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
		const self = this,
    	commentId  = this.props.comment.id;
    	// this.uploader.on('submitDelete', (id) {
    	// 	self.uploader.setDeleteFileParams({filename: self.uploader.getName(id)}, id);
    	// })
    	this.uploader.on('submit', (id, name) => {
    		const submittedFiles = this.state.submittedFiles

            this.setState({submittedFiles: [].concat(submittedFiles, id) })
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
               
                this.setState({ successFiles: [].concat(successFiles, id) })
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

        	// li.getElementsByClassName('fine-uploader-tag-button')[0]
        	//   .setAttribute('data-filename', `${res.filename}`);
		})

        this.uploader.methods.setParams({commentId: commentId})
	},

	componentWillMount() {
		if(canUseDOM) {
			this.initialize();
		}
	},

    handleDocClick(e) {     
        if(!ReactDOM.findDOMNode(this.emojiDiv).contains(e.target) && this.state.emojibtn) {
        	this.toggleEmoji()
        }
    },

    componentWillUnmount () {
        window.document.removeEventListener('click', this.handleDocClick, false);
    },

    componentWillUpdate(nextProps, nextState) {
		if(this.state.formHeight !== nextState.formHeight) {
        	this.props.recomputePostHeight();
        }
	},

	componentDidMount() {
		if(typeof this.uploader === 'undefined') {
			this.initialize();
		}

		this.setState({formHeight: this.formEl.clientHeight})
    },

    componentDidUpdate(prevProps, prevState) {
        if(this.props.defaults != prevProps.defaults) {
        	const mentions = this.props.defaults.map(function(user) {
        		return {
        			name: user.firstname + ' ' + user.lastname,
        			link: 'http://opinion.com' + user.username,
        			avatar: user.profilePic
        		}
        	});
        	this.setState({
        		mentions: fromJS(mentions),
      			suggestions: fromJS(mentions), 
        	})
        }

        if( this.state.submittedFiles.length !== prevState.submittedFiles.length ||
    		this.state.successFiles.length !== prevState.successFiles.length ||
    		this.state.failedFiles.length !== prevState.failedFiles.length ||
    		this.state.focus !== prevState.focus ||
    		this.state.initialized !== prevState.initialized ||
    		this.state.editorState !== prevState.editorState) {
        	this.setState({formHeight: this.formEl.clientHeight})
        }

        if(this.state.formHeight !== prevState.formHeight) {
        	this.props.recomputePostHeight();
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

    shouldComponentUpdate(nextProps, nextState) {
    	return (this.state !== nextState);
    },

	render() {
		const self   			= this,
		uploader 				= this.uploader,
		{ user, comment } 		= this.props,
		{ editorState, 
		  fileInput, 
		  initialized,
		  suggestions
		} 						= this.state,
		mentionPlugin 	= this.mentionPlugin,
		{ 
			MentionSuggestions 
		} 				= mentionPlugin,
		plugins 		= [mentionPlugin, emojiPlugin, hashtagPlugin, linkifyPlugin],
    	timesIco 				= <i className="fa fa-times" aria-hidden="true"><span></span></i>,
    	retryIco 				= <span className="qq-retry-icon">Retry</span>;
    	
    	///////return
 		return(
 			<div className="div-underForm" onClick={this.handleFormClick} ref={(el) => {this.formEl = el}}>
 				<form className="form-und-cmt" method="post" >
			        <div className="vis-part">
			            <div className="left-underForm">
			            	<div className="cmt-frm-pr-pic-lk" >
			                    <img src={user.profile_pic.web_path} className="und-cmt-frm-pr-pic" />
			                </div>
			            </div>
			            <div className="center-underForm">
			                <div className="sCenter-underForm">
	                            <div className="under-form-textarea autoExpand-underForm">
						            {initialized && <div onClick={this.focus} >
						                <Editor 
					                        // blockStyleFn={getBlockStyle}
					                        // customStyleMap={styleMap}
					                        ref={(elem) => {this.editor = elem}}
					                        spellCheck={true}
					                        plugins={plugins}
					                        placeholder="reply ..."
					                        onChange={this.onChange}
					                        editorState={editorState}
					                        keyBindingFn={this.myKeyBindingFn} 
					                        handleKeyCommand={this.handleKeyCommand}
					                    />
					                    <EmojiSuggestions 
					                    	onOpen={this.onEmojiOpen}
					                    	/>
					                    <MentionSuggestions
									        onSearchChange={this.onSearchChange}
									        suggestions={suggestions}
									        />
						            </div>
						        	}
						        </div>
	                        </div>
	                        <div className="underFormImageHolder">
	                        	<div className="qq-gallery">  
				            		<div className="zone-upload-cmt" >
					            		<ul className="qq-upload-list-selector qq-upload-list upl-list-ul" role="region">
							                {this.state.submittedFiles.map(function(id) {
									            return (
									            	<li key={id} className="qq-upload-file com-img-li">
									            		<Thumbnail id={ id } uploader={ uploader } className="thumb-und-img"/>
									            		<button className="react-fine-uploader-delete-button com-dlt-thumb-btn" onClick={this.deleteFile.bind(this, id)} type="submit">
									            			<i className="fa fa-times" aria-hidden="true"><span></span></i>
									            		</button>
									            		<CancelButton id={ id }  uploader={ uploader } children={timesIco} />
									            		<RetryButton id={ id } uploader={ uploader } children={retryIco} />
									            	</li>
									            )      
									        }.bind(this))}
							            </ul>
						            </div>           
					            </div>
	                        </div>
			            </div>
	                    <div className="und-cmt-rght-mr">
	                        <div className="und-cmt-rght-mr-ctnr">
	                            <div className="divUploadComment">
	                            	<span className="upl-btn" onClick={this.toggleEmoji} >
	                                	{initialized && fileInput}
	                                </span>
	                            </div>
	                            <div className="emoji-dv" ref={(el)=> {this.emojiDiv = el}}>
	                            	{initialized && 
	                            		<EmojiSelect 
	                            			/>}
				                </div>
	                        </div>
	                    </div>
			        </div>
			    </form>
			</div>
		)
	}
})

export default connect(state =>({
	user: state.User.user,
	defaults: state.Users.defaults,
}))(ReplyForm)