import React 						from 'react'
import createReactClass 			from 'create-react-class'
import axios 						from 'axios'
import { fromJS } 					from 'immutable'
import { connect } 					from 'react-redux'
import ReactDOM, { findDOMNode }	from 'react-dom'
import classnames 					from 'classnames'
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
import { BASE_PATH } 				from '../../../config/api'
import { canUseDOM } 				from '../../../utils/executionEnvironment'
import * as DraftFuncs 				from '../../social/home/form/DraftFuncs'
import { BuildHtmlString, ErrorStack } 	from '../../../components'
import { 
	CommentForm as CommentFormActions,
	Comments as CommentsActions,
	Authors as AuthorsActions
} 									from '../../../actions/post'

import '../../../styles/post/commentForm.scss'
import '../../../styles/social/content-editable.scss';

import MyLoadable    from '../../../components/MyLoadable'
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

const CommentForm  = createReactClass( {

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
            completedFiles: {},
            successFiles: [],
            failedFiles: [],
            unique: this.getUniqueForm(),
			files: [],
			focus: false,
			isLoading: false,
			initialized: false,
        	topPlace: false,
        	hasCommandModifier: null,
        	fileInput: null,
      		mentions: mentions,
      		suggestions: mentions,
			editorState: EditorState.createEmpty(compositeDecorator)
		}
	},
	
	uploader: undefined,

	submittedFiles(files) {
		if(this._mounted)
			this.setState({files: files});
	},

	handleFormClick (e) {
		const { dispatch } = this.props;
		if(findDOMNode(this).contains(e.target)) {
			if(this._mounted)
				this.setState({focus: true})
            //dispatch(AppActions.postFormFocus(true));
        } else {
        	//this.setState({focus: true})
		}
	},

	getUniqueForm () {
		return Math.random().toString(36).substr(2, 9);
	},

	deleteFile(id, e) {
    	if(this._mounted) {
	    	e.preventDefault();
	    	const self 	= this,
	    	postId 		= this.props.postId,
	    	filename 	= this.state.completedFiles[id]['filename'];
	    	this.uploader.methods.cancel(id);			//just to remove data in form
	    	const successFiles = this.state.successFiles.filter((fId, i) => {
	    		return fId !== id;
	    	})
	        	
	        this.setState({ successFiles })
	    	axios.post(`${BASE_PATH}/api/_gal_comment/delete`, { 
	    			params : {
						filename: filename,
						postId: postId
					}
				}).then(function (res) {
					console.log(res.data);
				}, function(err) {
					console.log('err :', err);
			})
		}
    },

    composeData() {
    	const { editorState, unique, successFiles } = this.state
		BuildHtmlString(convertToRaw(editorState.getCurrentContent())).then(htmlString => {
			const formData = {
				rmv_arr : '',
				unique  : unique,
				content : htmlString,
				successFiles: successFiles
			}

			this.sendPost(formData)
		});
	},
	
	sendPost(data) {
		const self 	 = this,
		{ unique }   = this.state,
		{ dispatch, postId, refer } = this.props,
		uploader	 = this.uploader;

		if(this._mounted) {
			self.props.onComment(postId, refer, data)
			self.setState({
				focus: false, 
	            failedFiles: [],
	            unique: this.getUniqueForm(),
				isLoading: true,
	            successFiles: [],
				submittedFiles: [],
				editorState: EditorState.push(this.state.editorState, ContentState.createFromText(''))
			})
			uploader.methods.reset();
			uploader.methods.setParams({postId: postId});
		}
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
    	if(this._mounted)
        	this.setState({editorState: editorState})
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

	onSearchChange({ value }) {
	    // An import statment would break server-side rendering.
	    const mentions = this.state.mentions;
	    if(this._mounted)
	    	this.setState({suggestions: defaultSuggestionsFilter(value, mentions)});
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
			import('fine-uploader-wrappers/traditional')
		]).then(function([
				_traditional
		]) {
			const FineUploaderTraditional =	_traditional.default;
			const uploader = new FineUploaderTraditional({
				options: {
					debug: true,
				  	request: {
				        endpoint: 'http://opinion.com' + BASE_PATH + Routing.generate('_uploader_upload_gallerycomment'),
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
			if(self._mounted) {
				self.setState({
					initialized: true,
					fileInput: fileInput,
					hasCommandModifier: hasCommandModifier
				})
				self.registerEvents();
			}
		})
	},

	cancelFile(id, e) {
    	e.preventDefault();
    	this.uploader.methods.cancel(id);
    },

	registerEvents() {
		const self = this;
    	const postId = this.props.postId;
    	// this.uploader.on('submitDelete', (id) => {
    	// 	self.uploader.setDeleteFileParams({filename: self.state.uploader.getName(id)}, id);
    	// })
    	this.uploader.on('submit', (id, name) => {
    		const submittedFiles = this.state.submittedFiles
            // submittedFiles.push(id)
            if(this._mounted)
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
               
                // successFiles.push(id)
                if(this._mounted)
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
            if(this._mounted)
            	this.setState({ completedFiles })

        	// li.getElementsByClassName('fine-uploader-tag-button')[0]
        	//   .setAttribute('data-filename', `${res.filename}`);
		})

		console.log(postId);

        this.uploader.methods.setParams({postId: postId})  
	},

	handleDocClick(e) {     
        // if(!ReactDOM.findDOMNode(this.emojiDiv).contains(e.target) && this.state.emojibtn) {
        // 	this.toggleEmoji()
        // }
    },

    componentWillUnmount () {
        // this.uploader = undefined;
        this._mounted = false;
    },

	componentWillMount() {
		// if(canUseDOM) {
		// 	this.initialize()	
		// }	//
	},

	componentWillUpdate(nextProps, nextState) {
		if(this.state.formHeight !== nextState.formHeight) {
        	this.props.recomputePostHeight();
        }
	},

	componentDidMount() {
		this._mounted = true;
		window.document.removeEventListener('click', this.handleDocClick, false);

    	if(typeof this.uploader === 'undefined') {
    		this.initialize();
    	}
    	this.setState({formHeight: this.formEl.clientHeight})
    },

    componentDidUpdate(prevProps, prevState) {

        if( this.state.submittedFiles.length !== prevState.submittedFiles.length ||
    		this.state.successFiles.length !== prevState.successFiles.length ||
    		this.state.failedFiles.length !== prevState.failedFiles.length ||
    		this.state.focus !== prevState.focus ||
    		this.state.initialized !== prevState.initialized ||
    		this.state.editorState !== prevState.editorState) {
        	this.setState({formHeight: this.formEl.clientHeight});
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
        	if(this._mounted) 
	        	this.setState({mentions: mentions, suggestions: mentions, })
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
    		this.props.postId !== nextProps.postId);
    },

	render() {
		const self 					= this,
		uploader 					= this.uploader,
		{ user, post, refer } 		= this.props,
		{ editorState, 
			fileInput, 
			suggestions, 
			initialized 
		} 							= this.state,
		mentionPlugin 	= this.mentionPlugin,
		{ 
			MentionSuggestions 
		} 				= mentionPlugin,
		plugins 		= [mentionPlugin, emojiPlugin, hashtagPlugin, linkifyPlugin],
		timesIco 					= <i className="fa fa-times" aria-hidden="true"><span></span></i>,
		retryIco 					= <span className="qq-retry-icon">Retry</span>,
		pauseChildren 				= <span className="qq-pause-icon"></span>,
		resumeChildren 				= <span className="qq-continue-icon"></span>;
    	
    	///////return
 		return(
			<div className="div-commentForm" 
				onClick={this.handleFormClick} 
				ref={(el) => { this.formEl = el}}>
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
											            		<ErrorStack>
											            			<button 
											            				className="react-fine-uploader-cancel-button com-dlt-thumb-btn" 
											            				onClick={this.cancelFile.bind(this, id)} type="submit">
												            			{timesIco}
												            		</button>
											            		</ErrorStack>
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

export default connect(state =>({
	user: state.User.user,
	defaults: state.Users.defaults,
}))(CommentForm)