import React 						from 'react'
import createReactClass 			from 'create-react-class'
import axios 						from 'axios'
import { fromJS } 					from 'immutable'
import { connect } 					from 'react-redux'
import ReactDOM, { findDOMNode }	from 'react-dom'
import { Link } 					from 'react-router-dom'
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
import { canUseDOM } 				from '../../utils/executionEnvironment'
import { BASE_PATH } 				from '../../config/api'
import * as DraftFuncs 				from '../social/home/form/DraftFuncs'
import { BuildHtmlString } 			from '../../components'
import { 
	Questions as QuestionsActions,
	Secrets as SecretsActions,
	Authors as AuthorsActions
} 									from '../../actions/message'

const { hasCommandModifier } = KeyBindingUtil;



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

const SecretForm  = createReactClass({

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

        //const question_id = props.questionId;

		return {
			submittedFiles: [],
            successFiles: [],
            failedFiles: [],
            completedFiles: [],
            emojibtn: false,
            imageHover: false,
            question_id: undefined,
			files: [],
			content: '',
			focus: false,
			initialized: false,
			isLoading: false,
        	plugins: null,
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

	onNewQuestion(questionId) {
		this.props.onNewQuestion(questionId);
	    this.uploader.methods.setParams({ questionId: questionId })
	},

	onNewSecret(questionId) {
		this.uploader.methods.setParams({ questionId: questionId })
	},

	submittedFiles(files) {
		this.setState({files: files});
	},

	handleDocClick (e) {
		const { dispatch } = this.props;
		if(findDOMNode(this).contains(e.target)) {
			this.setState({focus: true})
            //dispatch(AppActions.postFormFocus(true));
        }
        if(!ReactDOM.findDOMNode(this.emojiDiv).contains(e.target) && this.state.emojibtn) {
        	this.toggleEmoji()
        }
	},

	getImageFromCache(id, e) {
    	e.preventDefault();
    	const filename 		= this.state.completedFiles[id]['filename'];
    	this.props.getImageFromCache(filename, 'galleryquestion');
    },

	deleteFile(imgId, e) {
    	e.preventDefault();
    	const self 		= this,
    	{ post: {id} }  = this.props,
    	{ question_id } = this.state,
    	uploader 		= this.uploader,
    	filename 		= this.state.completedFiles[imgId]['filename'];
    	
    	uploader.methods.cancel(imgId);			//just to remove data in form
    	axios.post(`${BASE_PATH}/api/_gal_question/delete`, { 
    			params : {
					postId: id,
					filename: filename,
					questionId: question_id
				}
			}).then(function (res) {
				console.log(res.data);
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
		const self 							= this,
		{ question_id } 					= this.state,
		{ dispatch, post : {id}, refer } 	= this.props

		console.log(question_id);
		axios.post(`${BASE_PATH}/api/secrets/create`, data, {
			params : {
				postId: id,
				questionId: question_id,
				refer: refer
			}
		})
		.then(function (res) {
				dispatch(SecretsActions.pushSecret(res.data.secret))
				dispatch(AuthorsActions.pushAuthor(res.data.secret.author))

				var questionId = res.data.secret.questionId;
				if(question_id == null) {
					self.onNewQuestion(questionId)
					self.setState({question_id: questionId})
					dispatch(QuestionsActions.loadQuestion(questionId))
				} else {
					self.onNewSecret(questionId);
				}

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
		this.uploader.methods.reset();
	},

	insertEmoji(data) {
	    const self = this;
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

	toggleEmoji() {
		const self = this;
		self.setState({emojibtn: !self.state.emojibtn})
	},

	submit(e) {
		e.preventDefault();
		this.composeData();
	},

	_handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        //handle submit command
        if (command === 'submit' && this.props.enterToSubmit) {
			this.submit();
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
				        endpoint: 'http://opinion.com' + BASE_PATH + Routing.generate('_uploader_upload_galleryquestion'),
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
		const self 			= this,
    	{ post } 			= this.props,
    	{ uploader } 	    = this.state;

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
	},

	componentWillMount() {
		if(canUseDOM) {
			this.initialize();
		}
	},

    componentWillUnmount () {
        window.document.removeEventListener('click', this.handleDocClick, false);
    },

	componentDidMount() {

    	if(typeof this.uploader === 'undefined') {
    		this.initialize();
    	}
    },

    componentDidUpdate(oldProps, oldState) {
    	const self 			 = this;

    	if(oldProps.questionId == null && this.props.questionId == null && this.state.question_id == undefined) {
        	if(this.state.question_id !== null) {
        		const { post: {id} }  = this.props;
		    	this.uploader.methods.setParams({ postId: id })
	        	this.setState({question_id: null})
        	}        	
        }

    	if(oldProps.questionId != this.props.questionId) {
    		console.log(oldProps.questionId, self.props.questionId);
	        if(oldProps.questionId == null && this.props.questionId) {
	        	const { questionId }  = this.props;
	        	this.uploader.methods.setParams({ questionId: questionId })
	    		this.setState({question_id: questionId})
	        }
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
		const self 		= this,
		{ user, post } 	= this.props,
		uploader 		= this.uploader,
		mentionPlugin 	= this.mentionPlugin,
		{ 
			MentionSuggestions 
		} 				= mentionPlugin,
		plugins 		= [mentionPlugin, emojiPlugin, hashtagPlugin, linkifyPlugin],
    	timesIco 		= <i className="fa fa-times" aria-hidden="true"><span></span></i>,
    	retryIco 		= <span className="qq-retry-icon">Retry</span>,
    	//////
    	//////
		{ 
			editorState, 
			fileInput, 
			suggestions, 
			initialized,
		} 				= this.state;
		return(
			<div className="div-responseForm">
			    <form className="form-p-q" >
			        <div className="center-responseForm" >
			            <div className="sCenter-responseForm-a">
			                <div className="dv-ttrea-p-q">
			                    <div className="expandingArea">
			                    	{initialized && <div className="under-form-textarea" onClick={this.focus}>
					                    <Editor 
					                        // blockStyleFn={getBlockStyle}
					                        // customStyleMap={styleMap}
					                        ref={(elem) => {this.editor = elem}}
					                        spellCheck={true}
					                        plugins={plugins}
					                        placeholder="content"
					                        onChange={this.onChange}
					                        editorState={editorState}
					                        keyBindingFn={this.myKeyBindingFn} 
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
			                <div className="responseFormImageHolder">
			                	<div className="qq-gallery">  
				            		<div className="zone-upload-cmt" >
					            		<ul className="qq-upload-list-selector qq-upload-list upl-list-ul" role="region">
							                {this.state.submittedFiles.map(function(id) {
									            return (
									            	<li key={id} className="qq-upload-file com-img-li">
									            		<Thumbnail id={ id } uploader={ uploader } className="thumb-cmt-img"/>
									            		<button className="react-fine-uploader-delete-button com-dlt-thumb-btn" onClick={this.deleteFile.bind(this, id)}>
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
			        </div>
			        <div className="popover-footer">            
			            <div className="left-popover-footer">
			                <div className="divUploadResp">
			                	<span>
			                		{initialized && fileInput}
			                	</span>
			                	<div className="emoji-dv" style={{display: 'inline-block'}} ref={(el)=> {this.emojiDiv = el}}>
			                        {initialized && <EmojiSelect />}
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
}))(SecretForm)