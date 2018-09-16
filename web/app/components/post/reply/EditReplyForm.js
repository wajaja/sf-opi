import React 						from 'react'
import createReactClass 			from 'create-react-class'
import axios 						from 'axios'
import { connect } 					from 'react-redux'
import ReactDOM, { findDOMNode } 	from 'react-dom'
import EmojiPicker 					from 'emojione-picker'
import createStickerPlugin 			from 'draft-js-sticker-plugin';
import { canUseDOM } 				from '../../../utils/executionEnvironment'
import { BASE_PATH } 				from '../../../config/api'
import forEach 						from 'lodash/forEach';

import { 
    RichUtils, getDefaultKeyBinding, 
    KeyBindingUtil, EditorState, convertFromHTML,
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
import * as DraftFuncs 		    	from '../../social/home/form/DraftFuncs'
import { BuildHtmlString } 			from '../../../components'
import { 
	UnderComments as CommentsActions,
} 									from '../../../actions/post'
import MyLoadable    from '../../../components/MyLoadable'
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

const EditReplyForm  = createReactClass({

	getInitialState() {

    	let editorState,
    	content = this.props.reply.content,
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
	    ]);

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
            emojibtn 		: false,
            failedFiles 	: [],
            successFiles 	: [],
			isLoading 		: false,
			topPlace		: false,
            submittedFiles 	: [],
            completedFiles: {},
            initialized: false,
      		mentions 		: mentions,
      		suggestions 	: mentions,
      		MentionSuggestions: null,
      		serverFiles 	: this.props.reply.images,
            editorState 	: editorState
		}

	},

	uploader : undefined,
	
	composeData() {
		BuildHtmlString(convertToRaw(this.state.editorState.getCurrentContent())).then(htmlString => {
			console.log(htmlString)
			const formData	= {
					rmv_arr 	: '',
					content 	: htmlString,
				}

			this.sendPost(formData)
		});
	},
	
	sendPost(data) {
		this.beforeSend();
		const self 				= this,
		{dispatch, reply: {id}} = this.props, 
		rmv_filenames 			= this.state.rmv_arr.reduce((txt, name) => {return txt + name + ','}, '');
		dispatch(CommentsActions._updateCommentRequest(id))
		axios.put(`${BASE_PATH}/api/undercomments/edit/${id}`, data, { 
		params : {
			removedFilenames: rmv_filenames
		}})
		.then(function (res) {
			dispatch(CommentsActions._updateCommentResponse(id, res.data.comment));
			self.props.replyEdited();
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
		  reply: {id} 
		} 					= this.props;
		uploader.methods.reset();
		uploader.methods.setParams({replyId: id});
	},

	focus() {
        this.editor.focus()
    },

	submitComment() {
		this.beforeSend();
		this.composeData();
	},

	//delete uploader's files
	deleteFile(id, e) {
    	e.preventDefault();
    	const self 	= this,
    	uploader    = this.uploader,
    	replyId 	= this.props.reply.id,
    	filename 	= this.state.completedFiles[id]['filename'];

    	uploader.methods.cancel(id);			//just to remove data in form
    	axios.post(`${BASE_PATH}/api/_gal_undercomment_edit/delete`, { 
    			params : {
					filename: filename,
					replyId: replyId
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

    cancelFile(id, e) {
    	e.preventDefault();
    	this.uploader.methods.cancel(id);
    },

	onChange(editorState) {
        this.setState({editorState})
    },

    initialize () {
    	window.document.addEventListener('click', this.handleDocClick, false);
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
				        endpoint: 'http://opinion.com' + BASE_PATH + Routing.generate('_uploader_upload_galleryundercommentedit'),
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
			const fileInput = <FileInput multiple accept='image/*' uploader={ uploader } />

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
    	const { reply: {id}, defaults } 	= this.props;

    	this.uploader.methods.setParams({replyId: id});
    	this.uploader.on('submitDelete', (iD) => {
    		this.uploader.setDeleteFileParams({filename: this.uploader.getName(iD)}, iD);
    	})

    	this.uploader.on('submit', (id, name) => {
    		const submittedFiles = this.state.submittedFiles
            this.setState({submittedFiles: [].concat(submittedFiles, id)})
    	})
        
        this.uploader.on('statusChange', (id, oldStatus, newStatus) => {        	
        	if (newStatus === 'uploading') {
        		const li = findDOMNode(this).getElementsByTagName("li")[id];
    			//const li = findDOMNode(this).getElementsByClassName("qq-upload-file")[iD];             
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

        	li.getElementsByClassName('fine-uploader-tag-button')[0]
        	  .setAttribute('data-filename', `${res.filename}`);
		})
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

	handleDocClick(e) {     
        if(!ReactDOM.findDOMNode(this.emojiDiv).contains(e.target) && this.state.emojibtn) {
        	this.toggleEmoji()
        }
    },

    componentWillUnmount() {
        window.document.removeEventListener('click', this.handleDocClick, false);
    	this.uploader = undefined;
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
        findDOMNode(this).scrollIntoView();

        this.setState({formHeight: this.formEl.clientHeight})
    },

    getVideoName(name) {
		this.setState({videoName: name})
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
    	return (this.state.formHeight !== nextState.formHeight ||
    			this.state !== nextState || 
    			this.props.reply !== nextProps.reply)
    },

	render() {

		const self 			= this,
		uploader  			= this.uploader,
		{ user, 
		  reply, 
		  comment 
		} 					= this.props,
		{ editorState, 
		  fileInput, 
		  initialized,
		  suggestions
		} 		 			= this.state,
		mentionPlugin 	= this.mentionPlugin,
		{ 
			MentionSuggestions 
		} 				= mentionPlugin,
		plugins 		= [mentionPlugin, emojiPlugin, hashtagPlugin, linkifyPlugin],
    	timesIco 			= <i className="fa fa-times" aria-hidden="true"><span></span></i>,
    	retryIco 			= <span className="qq-retry-icon">Retry</span>;
    	
    	/////
		return (
			<div className="div-underForm" ref={(el) => {this.formEl = el}}>
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
					                    <EmojiSuggestions />
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
									            		<Thumbnail id={ id } uploader={ uploader } className="thumb-und-img"/>
									            		<button className="react-fine-uploader-delete-button com-dlt-thumb-btn" onClick={this.deleteFile.bind(this, id)} type="submit">
									            			<i className="fa fa-times" aria-hidden="true"><span></span></i>
									            		</button>
									            		<button 
								            				className="react-fine-uploader-cancel-button com-dlt-thumb-btn" 
								            				onClick={this.cancelFile.bind(this, id)} type="submit">
									            			{timesIco}
									            		</button>
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

export default connect(state => ({
	user: state.User.user,
	defaults: state.Users.defaults,
}))(EditReplyForm)