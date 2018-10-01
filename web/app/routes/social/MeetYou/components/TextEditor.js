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
import { canUseDOM } 				from '../../../../utils/executionEnvironment'
import { BASE_PATH } 				from '../../../../config/api'
import * as DraftFuncs 				from '../../../../components/social/home/form/DraftFuncs'
import { BuildTextArr, ErrorStack } from '../../../../components'
import { 
	ReplyForm as FormActions,
	Authors as AuthorsActions
} 									from '../../../../actions/post'

const { hasCommandModifier } = KeyBindingUtil;


import MyLoadable    from '../../../../components/MyLoadable'
const Dropzone  = MyLoadable({loader: () => import('react-fine-uploader/dropzone')}),
Thumbnail 		= MyLoadable({loader: () => import('react-fine-uploader/thumbnail')}),
RetryButton 	= MyLoadable({loader: () => import('react-fine-uploader/retry-button')}),
ProgressBar 	= MyLoadable({loader: () => import('react-fine-uploader/progress-bar')}),
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

const TextEditor  = createReactClass( {

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

    cancelFile(id, e) {
    	e.preventDefault();
    	this.uploader.methods.cancel(id);
    },

    addText(e) {
    	e.preventDefault();
		this.composeData();
	},

    composeData() {
    	const { editorState, unique, successFiles } = this.state
		BuildTextArr(convertToRaw(editorState.getCurrentContent())).then(textArr => {
			console.log('textArr', textArr);
			this.props.updateTextArr(textArr);
		});
	},

 //    composeData() {
 //    	const { editorState, unique, successFiles } = this.state
	// 	BuildHtmlString(convertToRaw(editorState.getCurrentContent())).then(htmlString => {
	// 		const formData	= {
	// 				rmv_arr: '',
	// 				unique : unique,
	// 				content: htmlString,
	// 			}

	// 		this.sendPost(formData)
	// 	});
	// },

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
			import('fine-uploader-wrappers/traditional')
		]).then(function([
				_traditional
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
    	// this.uploader.on('submitDelete', (id) {
    	// 	self.uploader.setDeleteFileParams({filename: self.uploader.getName(id)}, id);
    	// })
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

	componentDidMount() {
		if(typeof this.uploader === 'undefined') {
			this.initialize();
		}
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
 			<div className="div-txt-edit" onClick={this.handleFormClick} ref={(el) => {this.formEl = el}}>
 				<form className="form-txt-edit" method="post" >
	                <div className="expandingArea">
                        <div className="meetyou autoExpand-meet">
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
	                    <div className="btm">
							<div className="emoji-dv" ref={(el)=> {this.emojiDiv = el}}>
			                    <EmojiSelect />
			                </div>
		                	<div className="sbm-dv">
		                    	<button 
		                    		type="submit" 
		                    		className="btn add-text" 
		                    		onClick={this.addText}>add</button>
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
}))(TextEditor)