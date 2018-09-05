import React 						from 'react'
import createReactClass 			from 'create-react-class'
import axios 						from 'axios'
import { connect } 					from 'react-redux'
import { fromJS }					from 'immutable'
import Status 						from 'react-fine-uploader/status'
import ReactDOM, { findDOMNode } 	from 'react-dom'
import { canUseDOM } 				from '../../../utils/executionEnvironment'
import { BASE_PATH } 				from '../../../config/api'
import forEach 						from 'lodash/forEach';

import { 
    RichUtils, getDefaultKeyBinding, 
    KeyBindingUtil, EditorState, convertFromHTML,
    CompositeDecorator, convertToRaw,
    Modifier, convertFromRaw, ContentState 
} 									from 'draft-js'
import createStickerPlugin 			from 'draft-js-sticker-plugin';
import createLinkifyPlugin 			from 'draft-js-linkify-plugin'
import Editor, 
	  { createEditorStateWithText } from 'draft-js-plugins-editor' // eslint-disable-line import/no-unresolved
import createHashtagPlugin 			from 'draft-js-hashtag-plugin'
import createEmojiPlugin 			from 'draft-js-emoji-plugin' // eslint-disable-line import/no-unresolved
import createMentionPlugin, 
{ defaultSuggestionsFilter } 		from 'draft-js-mention-plugin' // eslint-disable-line import/no-unresolved
import * as DraftFuncs 		    	from '../../social/home/form/DraftFuncs'
import MultiDecorator 				from 'draft-js-plugins-editor/lib/Editor/MultiDecorator';
import { BuildHtmlString } 			from '../../../components'
import { 
	CommentForm as CommentFormActions,
	Comments as CommentsActions,
	Authors as AuthorsActions
} 									from '../../../actions/post'

// import '../../../../styles/fine-uploader-gallery.scss'
// import '../../../../styles/fine-uploader-new.scss'



///////
//////
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

const EditCommentForm  = createReactClass({

	getInitialState() {
    	let editorState = '',
    	content  = this.props.comment.content,
    	compositeDecorator = new MultiDecorator([
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

    	if(typeof content == 'object') {
   //  		forEach(content.entityMap, function(value, key) {
			//     value.data.mention = fromJS(value.data.mention)
			// })
	    	const converted = convertFromRaw(content);
    		editorState = EditorState.createWithContent(converted);
    	} else {
    		const blocksFromHTML = convertFromHTML(content),
          	state = ContentState.createFromBlockArray(
            	blocksFromHTML.contentBlocks,
            	blocksFromHTML.entityMap,
          	);
    		editorState = EditorState.createWithContent(state, compositeDecorator);
    	}

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
			content 		: '',
			files 			: null,  //input file collection
            focus 			: true,
			rmv_arr 		: [],  	
			errors 			: {},
      		invalid 		: false,
      		initialized 	: false,
            emojibtn 		: false,
            failedFiles 	: [],
            successFiles 	: [],
            completedFiles  : [],
            topPlace		: false,
			isLoading 		: false,
            submittedFiles 	: [],
      		mentions 		: mentions,
      		suggestions 	: mentions,
      		MentionSuggestions: null,
      		serverFiles 	: this.props.comment.images,
            editorState 	: editorState
		}
	},

	uploader : undefined,

	composeData() {
		BuildHtmlString(convertToRaw(this.state.editorState.getCurrentContent())).then(htmlString => {
			console.log(htmlString)
			var formData = {
				rmv_arr 	: '',
				content 	: htmlString,
			}

			this.sendPost(formData)
		});
	},
	
	sendPost(data) {
		const self 					= this,
		{ dispatch, comment:{id}, refer }  = this.props,
		rmv_filenames 				= this.state.rmv_arr.reduce((txt, name) => {return txt + name + ','}, '');
		dispatch(CommentsActions._updateCommentRequest(id))
		
		axios.put(`${BASE_PATH}/api/comments/edit/${id}`, data, { 
			params : {
				removedFilenames: rmv_filenames,
				refer: refer
			}})
		.then(function (res) {
			dispatch(CommentsActions._updateCommentResponse(id, res.data.comment));
			self.props.commentEdited();
			self.afterSend()
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

	beforeSend() {
		this.setState({isLoading: true})
	},

	afterSend() {
    	const uploader 		= this.uploader,
		{ dispatch, 
		comment:{ id } 
		} 					= this.props;
		uploader.methods.reset();
    	uploader.methods.setParams({commentId: id});
	},

	focus() {
        this.editor.focus()
    },

	submitComment(e) {
		e.preventDefault();
		this.beforeSend();
		this.composeData()
	},

	//delete uploader's files
	deleteFile(id, e) {
    	e.preventDefault();
    	const self 	= this,
    	uploader 	= this.uploader,
    	commentId 	= this.props.comment.id,
    	filename 	= this.state.completedFiles[id]['filename'];
    	uploader.methods.cancel(id);			//just to remove data in form
    	//custom delete request 
    	axios.post(`${BASE_PATH}/api/_gal_comment_edit/delete`, { 
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

    //Allow deleting initial files
    deleteImage(id, image, e) {
    	const self  	= this,
        arrToRemove 	= this.state.rmv_arr,
    	serverFiles 	= this.state.serverFiles,
        indexToRemove 	= serverFiles.indexOf(id);

        serverFiles.splice(indexToRemove, 1);
		arrToRemove.push(image.path);
		this.setState({
			rmv_arr 	: arrToRemove, 
			serverFiles : serverFiles
		})
    },

    toggleEmoji() {
		const self = this;
		self.setState({emojibtn: !self.state.emojibtn})
	},

    insertEmoji(data) {
		var code = '', emoji = '';
		if(data.unicode.length > 6) {
			code 	= '0x' + data.unicode.split('-')[0];
			emoji 	= String.fromCharCode(code);
		} else {
			code 	= '0x' + data.unicode;
			emoji	= String.fromCodePoint(code);
		}
		
		const editorState 	= this.state.editorState,
	    	selection 		= editorState.getSelection(),
	    	contentState	= editorState.getCurrentContent(),
	    	newContent 		= Modifier.insertText(contentState, selection, emoji),
	    	es 				= EditorState.push(editorState, newContent, 'insert-text');
	    this.setState({
	    	editorState: es
	    });
	    this.toggleEmoji();
	},

	onChange(editorState) {
        this.setState({editorState})
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
				        endpoint: 'http://opinion.com' + BASE_PATH + Routing.generate('_uploader_upload_gallerycommentedit'),
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
    	const { comment } 	= this.props,
    	commentId 			= comment.id,
    	images 				= comment.images;

        this.uploader.methods.setParams({commentId: commentId});
    	this.uploader.on('submitDelete', (id) => {
    		this.uploader.setDeleteFileParams({filename: this.uploader.getName(id)}, id);
    	})

    	this.uploader.on('submit', (id, name) => {
    		const submittedFiles = this.state.submittedFiles
            this.setState({submittedFiles: [].concat(submittedFiles, id) })
    	})

        this.uploader.on('statusChange', (id, oldStatus, newStatus) => {        	
        	if (newStatus === 'uploading') {
        		const li = findDOMNode(this).getElementsByTagName("li")[id];
    			//const li = findDOMNode(this).getElementsByClassName("qq-upload-file")[id];             
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
        });

        this.uploader.on('complete', (id, name, res) => {
        	const li = findDOMNode(this).getElementsByTagName("li")[id];
        	const completedFiles = this.state.completedFiles

            completedFiles[id] = {'originalName': name, 'filename': res.filename}
            this.setState({ completedFiles })

        	// li.getElementsByClassName('fine-uploader-tag-button')[0]
        	//   .setAttribute('data-filename', `${res.filename}`);
		})
    },

	componentWillMount () {
        if(canUseDOM) {
        	this.initialize();
        }
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

    componentDidMount() {
    	if(typeof this.uploader === 'undefined') {
    		this.initialize();
    	}
        findDOMNode(this).scrollIntoView();
        this.setState({formHeight: this.formEl.clientHeight})
    },

    componentDidUpdate(prevProps, prevState) {
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

    componentWillUnmount () {
        window.document.removeEventListener('click', this.handleDocClick, false);
    },

    componentWillUpdate(nextProps, nextState) {
		if(this.state.formHeight !== nextState.formHeight) {
        	this.props.recomputePostHeight();
        }
	},

    getVideoName(name) {
		this.setState({videoName: name})
	},

    handleDocClick (e) {
		const { dispatch } = this.props;
		if(findDOMNode(this).contains(e.target)) {
            console.log('in EditCommentForm');
        } else {
			
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
    	return (this.state.submittedFiles.length !== nextState.submittedFiles.length ||
    		this.state.successFiles.length !== nextState.successFiles.length ||
    		this.state.failedFiles.length !== nextState.failedFiles.length ||
    		this.state.focus !== nextState.focus ||
    		this.state.formHeight !== nextState.formHeight ||
    		this.state.initialized !== nextState.initialized ||
    		this.state.suggestions !== nextState.suggestions ||
    		this.state.editorState !== nextState.editorState ||
    		this.props.commentId !== nextProps.commentId ||
    		this.props.postId !== nextProps.postId);
    },

	render() {
		const self 		= this,
		uploader 		= this.uploader,
		{ 
			user, 
			comment, 
			post 
		} 				= this.props,
		{ editorState, 
		  fileInput, 
		  initialized,
		  suggestions
		} 		 					= this.state,
		mentionPlugin 	= this.mentionPlugin,
		{ 
			MentionSuggestions 
		} 				= mentionPlugin,
		plugins 		= [mentionPlugin, emojiPlugin, hashtagPlugin, linkifyPlugin],
    	timesIco = <i className="fa fa-times" aria-hidden="true"><span></span></i>,
    	retryIco = <span className="qq-retry-icon">Retry</span>;
    	//////
    	/////

		return (
			<div className="div-commentForm" ref={(el) => { this.formEl = el}}>
			    <form className="formComment" method="post" >
			        <div className="vis-part" data-c-name="" data-c-username={user.username}>
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
								                        placeholder="editing ..."
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
									                {this.state.serverFiles.map(function(image, i) {
											        	return (
															<li key={i} className="qq-upload-success thumb-cmt-img" data-img-id={image.id}>
											                    <span className="react-fine-uploader-thumbnail-container thumb-cmt-img-container">
											                        <img className="react-fine-uploader-thumbnail" src={image.webPath} data-img-id={image.id} />
											                    </span>
												                <button type="button" className="react-fine-uploader-delete-button" onClick={self.deleteImage.bind(self, i, image)}>
												                	<i className="fa fa-times" aria-hidden="true"><span></span></i>
												                </button>
												            </li>
											        	)
											        })}
									                {this.state.submittedFiles.map(function(id) {
											            return (
											            	<li key={id} className="qq-upload-file com-img-li">
											            		<Thumbnail id={ id } uploader={ uploader } className="thumb-cmt-img"/>
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
			                    <div className="cmt-frm-btm-dv">
			                        <div className={this.state.focus ? `dynamic-partInCommentForm in` : `dynamic-partInCommentForm out`}>
			                            <div className="divUploadComment">
			                            	{initialized && fileInput}
										    <div className="emoji-dv" ref={(el)=> {this.emojiDiv = el}}>
							                    {initialized && <EmojiSelect />}
							                </div>
										    <a href="" className="emoji-lk"></a>
			                            </div>
			                            <div className="divSubmitComment">
			                            	<div className="ctrl-dv">
			                            		<input type="checkbox" className="ctrl-bx" />
			                            		<span>Enter</span>
			                            	</div>
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

export default connect(state => ({
	user: state.User.user,
	defaults: state.Users.defaults,
}))(EditCommentForm)