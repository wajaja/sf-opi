import React 						from 'react'
import createReactClass 			from 'create-react-class'
import axios 						from 'axios'
import { fromJS } 					from 'immutable'
import { connect } 					from 'react-redux'
import ReactDOM, { findDOMNode }	from 'react-dom'
import { Link } 					from 'react-router-dom'
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
import createMentionPlugin, 
{ defaultSuggestionsFilter } 		from 'draft-js-mention-plugin'
import createLinkifyPlugin 			from 'draft-js-linkify-plugin'
import bindFunctions 				from '../../utils/bindFunctions'
import { canUseDOM } 				from '../../utils/executionEnvironment'
import { BASE_PATH } 				from '../../config/api'
import * as DraftFuncs 				from '../social/home/form/DraftFuncs'
import { BuildHtmlString } 			from '../../components'
import { 
	Threads as ThreadsActions,
	Messages as MessagesActions,
	Authors as AuthorsActions
} 									from '../../actions/message'
//https://github.com/draft-js-plugins/draft-js-plugins/issues/995
import MultiDecorator 				from 'draft-js-plugins-editor/lib/Editor/MultiDecorator';
const { hasCommandModifier } = KeyBindingUtil;
import { positionSuggestions } 		from '../../utils'

import MyLoadable    from '../../components/MyLoadable'
const Dropzone  = MyLoadable({loader: () => import('react-fine-uploader/dropzone')}),
Thumbnail 		= MyLoadable({loader: () => import('react-fine-uploader/thumbnail')}),
RetryButton 	= MyLoadable({loader: () => import('react-fine-uploader/retry-button')}),
ProgressBar 	= MyLoadable({loader: () => import('react-fine-uploader/progress-bar')}),
DeleteButton 	= MyLoadable({loader: () => import('react-fine-uploader/delete-button')}),
PauseResumeButton = MyLoadable({loader: () => import('react-fine-uploader/pause-resume-button')}),
FileInput 		= MyLoadable({loader: () => import('react-fine-uploader/file-input')})


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

const MessageForm  = createReactClass({

	getInitialState() {
		//https://github.com/draft-js-plugins/draft-js-plugins/issues/995
		// wrap CompositeDecorator with the Draft JS Plugins' MultiDecorator:
		const compositeDecorator =  new MultiDecorator([
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

        //const thread_id = props.threadId;
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
            successFiles: [],
            failedFiles: [],
            submittedDocs: [],
            successDocs: [],
            failedDocs: [],
            emojibtn: false,
            imageHover: false,
            completedFiles: [],
			files: [],
			content: '',
			unique: this.getUniqueForm(),
			focus: false,
			initialized: false,
			isLoading: false,
        	plugins: null,
        	EmojiSuggestions: null,
        	hasCommandModifier: null,
        	FileInput: null,
			emojibtn: false,
      		MentionSuggestions: null,
      		mentions: mentions,
      		suggestions: mentions,
			editorState: EditorState.createEmpty(compositeDecorator)
		}

	},

	getDefaultProps() {
	    return {
	      	enterToSubmit: true,
	      	thread: null,
	    };
	},
	
	uploader : undefined,

	onNewThread(thread) {
		this.props.onNewQuestion(thread);
	    this.uploader.methods.setParams({ threadId: thread.id })
	},

	onNewSecret(thread) {
		this.uploader.methods.setParams({ threadId: thread.id })
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

	deleteFile(id, e) {
    	e.preventDefault();
    	const self 			= this,
    	{ thread, uniqueString }  		= this.props,
    	uploader 		= this.uploader,
    	filename 		= this.state.completedFiles[id]['filename'];
    	let threadId 	= uniqueString;

    	if(thread && thread.id) 
    		threadId = thread.id; 

    	uploader.methods.cancel(id);			
    	//just to remove data in form
    	axios.post(`${BASE_PATH}/api/_gal_msg/delete?filename=${filename}&galleryDir=gallerymessage_${threadId}`)
    	.then(function (res) {
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

    getImageFromCache(id, e) {
    	e.preventDefault();
    	const filename 		= this.state.completedFiles[id]['filename'];
    	this.props.getImageFromCache(filename, 'gallerymessage');
    },

    deleteDoc(docId, e) {
    	e.preventDefault();
    	const self 			= this,
    	{ thread, uniqueString }  	= this.props,
    	uploader 			= this.docUploader,
    	filename 			= uploader.methods.getName(docId);

    	let threadId = uniqueString

    	if(thread && thread.id)
    		threadId = thread.id
    	
    	uploader.methods.cancel(docId);			//just to remove data in form
    	axios.post(`${BASE_PATH}/api/_gal_msg_doc/delete`, { 
    			params : {
					filename: filename,
					threadId: threadId
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
    	const { editorState, unique, completedFiles } = this.state
		BuildHtmlString(convertToRaw(editorState.getCurrentContent())).then(htmlString => {
			const data = {
				unique  : unique,
				body : htmlString,
				completedFiles: completedFiles
			}
			this.sendPost(data)
		});
	},
	
	sendPost(data) {
		const self 		= this,
		{ thread, newThread, uniqueString }= this.props

		//get all uploaded files 
		// const uploadedFiles = this.state.submittedFiles
		//Promise that handle recipeint errors
		this.props.handleSubmit(data).then(
		() => {
			this.setState({
				focus: false, 
				content: {},
	            failedFiles: [],
				isLoading: true,
				unique: this.getUniqueForm(),
	            successFiles: [],
				submittedFiles: [],
				editorState: EditorState.push(this.state.editorState, ContentState.createFromText(''))
			})
			this.uploader.methods.reset(); //////////Issue
			this.docUploader.methods.reset();
			if(thread && thread.id) {
	    		this.uploader.methods.setParams({ threadId: thread.id })
	    		this.docUploader.methods.setParams({ threadId: thread.id })
	    	} else { 
	    		/* see in componentWillReceiveProps for new thread's uploader params update*/ 
	    	}
		}, () => {
			console.log('data not submitted')	
		});
		
	},

	submit() {
		const self 		= this,
		{ dispatch, uniqueString } 	= this.props

		this.composeData();
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
    	if(e.keyCode === 13 && this.props.enterToSubmit) {
    		return 'submit';
    	}
	  	if (e.keyCode === 83 /* `S` key */ && this.state.hasCommandModifier(e)) {
	    	return 'myeditor-save';
	  	}
	  	return getDefaultKeyBinding(e);
	},

	_handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        //handle submit command
        if (command === 'submit') {
        	console.log('submitting.................')
			this.submit();
        	return false;
		}
        if (newState) {
            this.onChange(newState);
            return true;
        }
    },

    toggleBlockType(type) {
        this._toggleBlockType(type)
    },

    toggleInlineStyle(style) {
        this._toggleInlineStyle(style)
    },

	onSearchChange({ value }) {
	    // An import statment would break server-side rendering.
	    const mentions = this.state.mentions;
	    if(this._isMounted)
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

	docChosen(e) {
        selectedFile        = e.target.files[0];
        const { dispatch }  = this.props,
        videoExtn           = selectedFile.name.substring(selectedFile.name.lastIndexOf('.') + 1).toLowerCase();  //get video extension
        dispatch(VideoUploaderActions.setVideoExtension(videoExtn)); //set video extension before toggle video Pane
        dispatch(AppActions.formVideoPane(true));
        this.props.handleVideoUploader()
        this._toggleUploaderOption()
    },

	initialize () {
		const self = this
		const FineUploaderTraditional =	require('fine-uploader-wrappers/traditional').default;
		window.document.addEventListener('click', this.handleDocClick, false);

		Promise.all([
			import('fine-uploader-wrappers/traditional'),
		]).then(function([
				_traditional
		]) {
			const FineUploaderTraditional =	_traditional.default;
			
			const uploader = new FineUploaderTraditional({
				options: {
					debug: true,
				  	request: {
				        endpoint: 'http://opinion.com' + BASE_PATH + Routing.generate('_uploader_upload_gallerymessage'),
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
				        endpoint: 'http://opinion.com' + BASE_PATH + Routing.generate('api_remove_uploader_in_gallery_message')
				    },
				  	validation: {
				        itemLimit: 50,
				        sizeLimit: 300000000,
				        allowedExtensions: [
				        	'jpeg', 'jpg', 'png', 'webm',
				        	'avi', 'mp4', 'vob'
				        ]
				    },
				    callbacks: {
				      	onComplete: function(id, name, response) {  }
				    }
				}
			}); //end uploader's init

			const docUploader = new FineUploaderTraditional({
				options: {
					debug: true,
				  	request: {
				        endpoint: 'http://opinion.com' + BASE_PATH + Routing.generate('_uploader_upload_gallerymsgdoc'),
				        customHeaders: {
				        	Authorization: self.props.access_token
				        }
				    },
				    autoUpload: true,
				    success: true,
				    iframeSupport: {
				        localBlankPagePath: ""
				    },
				    thumbnails: {
		                placeholders: {
		                    waitingPath: 'http://opinion.com/images/pdfThumb.png',
		                    notAvailablePath: 'http://opinion.com/images/pdfThumb.png'
		                }
		            },
				    cors: {
				        expected: true 
				    },
				    resume: {
				        enabled: true
				    },
				    scaling: { 
		                sendOriginal: false, 
		                includeExif: true,
		                hideScaled: false,
		                sizes: [
		                    {name: "scaled", maxSize: 300}
		                ]
		            },
				    deleteFile: {
				      	forceConfirm: false,
				        enabled: true,  
				        method: "POST", 
				        endpoint: 'http://opinion.com' + Routing.generate('api_remove_uploader_in_gallery_message_doc')
				    },
				  	validation: {
				        itemLimit: 50,
				        sizeLimit: 300000000,
				        allowedExtensions: ['pdf']
				    },
				    callbacks: {
				      	onComplete: function(id, name, response) { 
				      	}
				    }
				}
			}); //end uploader's init

			self.uploader 	= uploader;
			self.docUploader= docUploader;
			////
			const { hasCommandModifier } 	= KeyBindingUtil
			if(self._isMounted)
				self.setState({
					initialized: true,
					FileInput: FileInput,
					hasCommandModifier: hasCommandModifier
				})

			self.registerEvents();
		})
	},

	getUniqueForm () {
		return Math.random().toString(36).substr(2, 9);
	},

	registerEvents() {
		const self 			= this,
    	{ thread, newThread, uniqueString }= this.props,
    	{ uploader,  } 	    = this.state;

    	if(thread && thread.id) {
    		this.uploader.methods.setParams({ threadId: thread.id })
    		this.docUploader.methods.setParams({ threadId: thread.id })
    	} else {
    		this.uploader.methods.setParams({ uniqueString: uniqueString })
    		this.docUploader.methods.setParams({ uniqueString: uniqueString })
    	}


    	this.uploader.on('submit', (id, name) => {
    		const submittedFiles = this.state.submittedFiles
            submittedFiles.push(id)
            this.setState({submittedFiles: submittedFiles })
    	})

        this.uploader.on('statusChange', (id, oldStatus, newStatus) => {        	
        	if (newStatus === 'uploading') {
    			const li = 	findDOMNode(this.uploadList)
    						// .getElementById('upl-list-ul')
    						.getElementsByTagName("li")[id];             
                li.className = "qq-upload-file in-progress";
            }
            else if (newStatus === 'upload successful') {
            	const li =  findDOMNode(this.uploadList)
    						// .getElementById('upl-list-ul')
    						.getElementsByTagName("li")[id];  
                li.className = "qq-upload-file";
                const successFiles = this.state.successFiles
               
                successFiles.push(id)
                this.setState({ successFiles })
            }
            else if (isFileGone(newStatus)) {
                const li = 	findDOMNode(this.uploadList)
    						.getElementsByTagName("li")[id];  
                li.innerHTML = "";
            }
        })

        this.uploader.on('complete', (id, name, res) => {
        	const li = findDOMNode(this).getElementsByTagName("li")[id];
        	const completedFiles = this.state.completedFiles

            completedFiles[id] = {
            	'originalName': name, 
            	'filename': res.filename,
            	'webPath': 'loading'
            }
            this.setState({ completedFiles })

        	li.getElementsByClassName('fine-uploader-tag-button')[0]
        	  .setAttribute('data-filename', `${res.filename}`);
		})

        this.docUploader.on('submit', (id, name) => {
    		const submittedDocs = this.state.submittedDocs
            submittedDocs.push(id)
            this.setState({submittedDocs: submittedDocs })
    	})

        this.docUploader.on('statusChange', (id, oldStatus, newStatus) => {        	
        	if (newStatus === 'uploading') {
    			const li = findDOMNode(this.docList)
    						.getElementsByTagName("li")[id];               
                li.className = "qq-upload-file in-progress";
            }
            else if (newStatus === 'upload successful') {
            	const li = 	findDOMNode(this.docList)
    						.getElementsByTagName("li")[id];  
                li.className = "qq-upload-file";
                const successDocs = this.state.successDocs
               
                successDocs.push(id)
                this.setState({ successDocs })
            }
            else if (isFileGone(newStatus)) {
                const li = 	findDOMNode(this.docList)
    						.getElementsByTagName("li")[id];  
                li.innerHTML = "";
            }
        })

        this.docUploader.on('complete', (id, fileName, response) => {
        	this.docUploader.methods
        		.drawThumbnail(id, document.createElement("img"), 400, false);
        })
	},

	changeSubmitMode(e) {
		this.props.changeSubmitMode();
	},

	componentWillMount() {
		if(canUseDOM) {
			this.initialize();
		}
	},

    componentWillUnmount () {
        this.uploader = undefined
        this._isMounted = false
        this.docUploader = undefined
        window.document.removeEventListener('click', this.handleDocClick, false);
    },

	componentDidMount() {
		this._isMounted = true
    	if(typeof this.uploader === 'undefined') {
    		this.initialize();
    	}
    },

    componentDidUpdate(oldProps, oldState) {
    	const self 			 = this;
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
        	if(this._isMounted) 
	        	this.setState({
	        		mentions: mentions,
	      			suggestions: mentions, 
	        	})
        }

        if((nextProps.thread !== this.props.thread) &&
        	nextProps.thread && nextProps.thread.id ) 
        {
        	const { thread }  = nextProps;
    		console.log('update thread in form', thread);
        	this.uploader && this.uploader.methods.setParams({ threadId: thread.id })
    		this.setState({thread_id: thread.id})
        }
    },

	render() {		
		//////
		const self 		= this,
		uploader 		= this.uploader,
		docUploader 	= this.docUploader,
		{ 
			user, Thread 
		} 				= this.props,
		{ 
			editorState, 
			FileInput, suggestions, 
			initialized 
		} 				= this.state,
		mentionPlugin 	= this.mentionPlugin,
		{ 
			MentionSuggestions 
		} 				= mentionPlugin,
		plugins 		= [mentionPlugin, emojiPlugin, hashtagPlugin, linkifyPlugin],
    	retryIco 		= <span className="qq-retry-icon">Retry</span>,
    	timesIco 		= <i className="fa fa-times" aria-hidden="true"><span></span></i>;
/////


		return(
        	<div className="expandingArea">
            	{initialized && 
            		<div className="nw-msg-bod autoExpand-message" onClick={this.focus}>
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
            	<div className="msgFormImageHolder">
                	<div className="qq-gallery">  
	            		<div className="zone-upload-cmt" >
		            		<ul 
		            			className="qq-upload-list-selector qq-upload-list upl-list-ul" 
		            			role="region" 
		            			ref={el => this.uploadList = el}
		            			style={{
		            				display: 'inline-block',
		            				verticalAlign: 'top'
		            			}}>
				                {this.state.submittedFiles.map(function(id) {
						            return (
						            	<li key={id} className="qq-upload-file com-img-li">
						            		<Thumbnail id={ id } uploader={ uploader } className="thumb-msg-img"/>
						            		<button 
						            			className="react-fine-uploader-delete-button com-dlt-thumb-btn" 
						            			onClick={this.deleteFile.bind(this, id)}>
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
				            <ul 
				            	className="qq-upload-list-selector qq-upload-list docs-list-ul" 
				            	role="region" 
				            	ref={el => this.docList = el}
				            	style={{
		            				display: 'inline-block',
		            				verticalAlign: 'top'
		            			}}>
				            	{this.state.submittedDocs.map(function(id) {
						            return (
						            	<li key={id} className="qq-upload-file com-img-li doc">
						            		<Thumbnail id={ id } uploader={ docUploader } className="thumb-cmt-img"/>
						            		<button 
						            			className="react-fine-uploader-delete-button com-dlt-thumb-btn" 
						            			onClick={this.deleteDoc.bind(this, id)}>
						            			<i className="fa fa-times" aria-hidden="true"><span></span></i>
						            		</button>
						            		<CancelButton id={ id }  uploader={ docUploader } children={timesIco} />
						            		<RetryButton id={ id } uploader={ docUploader } children={retryIco} />
						            	</li>
						            )      
						        }.bind(this))}
				            </ul>
			            </div>            
		            </div>
		            <div className="documents-container"></div>
                </div>

	            <div className="divUploadResp">
                	<div className="lft-msg-footer">
	                	<div className="msg-opt-plus pic-sp">
	                		{initialized && 
	                			<FileInput 
	                				multiple 
	                				accept='image/*' 
	                				uploader={ uploader } 
	                				/>
	                		}
	                	</div>
	                	<div className="msg-opt-plus doc-sp">
	                		{initialized && 
	                			<FileInput 
	                				multiple 
	                				accept='image/*' 
	                				uploader={ docUploader } 
	                				className="lk-autocol doc"
	                				/>
	                		}
		                </div>
		                <div className="msg-opt-plus vid-dv" style={{display: 'none'}}>
		                    <div className="lk-autocol video">
		                    </div>
		                </div>
	                	<div className="msg-opt-plus emoji-dv dv-emo" style={{display: 'inline-block'}} ref={(el)=> {this.emojiDiv = el}}>
	                        {document && document.createElement && <EmojiSelect />}
		                </div>
		                <div className="msg-opt-plus ticker-dv" style={{display:'none'}}>
		                    <div className="lk-autocol ticker"></div>
		                </div>
		                <div className="msg-opt-plus mic-dv">
		                    <div className="lk-autocol mic">
		                    </div>
		                </div>
	                </div>
	                <div className="rght-msg-footer">
	                	<div className="rght-msg-footer-a">
	                		<input 
	                			type="checkbox" 
	                			className="hdl-sbmt" 
	                			value={this.props.enterToSubmit}
	                			onChange={this.changeSubmitMode}
	                			style={{
	                				marginRight: '15px', 
	                				position: 'relative',
	                				top: '3px',
	                			}}
	                			/>
		                	<button 
		                		type="button" 
		                		onClick={this.submit} 
		                		className="btn btn-primary btn-sm">
		                		Send
		                	</button>
		                </div>
	            	</div>
	            </div>
            </div>
		)
	}
})

///////////////
export default connect(state =>({
	user: state.User.user,
	defaults: state.Users.defaults,
}))(MessageForm)

////<input type="file" id="post_type_vid" className="in-doc-upload" onChange={this.docChosen}/>