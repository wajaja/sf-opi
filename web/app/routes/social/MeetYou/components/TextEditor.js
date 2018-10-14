import React, { Component }			from 'react'
import createReactClass 			from 'create-react-class'
import PropTypes 					from 'prop-types';
import camelCase 					from 'lodash/camelCase';
import has 							from 'lodash/has';
import axios 						from 'axios'
import { fromJS } 					from 'immutable'
import { connect } 					from 'react-redux'
import ReactDOM, { findDOMNode }	from 'react-dom'
import { Link } 					from 'react-router-dom'
import EmojiPicker 					from 'emojione-picker'
import createEmojiPlugin 			from 'draft-js-emoji-plugin'
import Status 						from 'react-fine-uploader/status'
import createStickerPlugin 			from 'draft-js-sticker-plugin';
import onClickOutside 				from 'react-onclickoutside'
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

import createInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from 'draft-js-buttons';

import { canUseDOM } 				from '../../../../utils/executionEnvironment'
import { BASE_PATH } 				from '../../../../config/api'
import * as DraftFuncs 				from '../../../../components/social/home/form/DraftFuncs'
import { BuildTextArr, ErrorStack } from '../../../../components'
import { 
	ReplyForm as FormActions,
	Authors as AuthorsActions
} 									from '../../../../actions/post'


//
// import '../css/Draftjs-custom.css';
import createBlockStylesPlugin from '../plugins/blockStyles';
import { DYNAMIC_STYLES_PREFIX } from '../utils/customStylesUtils';

//import { getLSItem } from '../utils/localStorage';
import { reverseString } from '../utils/stringUtils';
const blockStylesPlugin = createBlockStylesPlugin();

const { hasCommandModifier } = KeyBindingUtil;


import MyLoadable    from '../../../../components/MyLoadable'
const Dropzone  = MyLoadable({loader: () => import('react-fine-uploader/dropzone')}),
Thumbnail 		= MyLoadable({loader: () => import('react-fine-uploader/thumbnail')}),
RetryButton 	= MyLoadable({loader: () => import('react-fine-uploader/retry-button')}),
ProgressBar 	= MyLoadable({loader: () => import('react-fine-uploader/progress-bar')}),
PauseResumeButton = MyLoadable({loader: () => import('react-fine-uploader/pause-resume-button')}),
FileInput 		= MyLoadable({loader: () => import('react-fine-uploader/file-input')})


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
});

///////////

class HeadlinesPicker extends Component {
  	componentDidMount() {
    	setTimeout(() => { window.addEventListener('click', this.onWindowClick); });
  	}

  	componentWillUnmount() {
    	window.removeEventListener('click', this.onWindowClick);
  	}

  	onWindowClick = () =>
	    // Call `onOverrideContent` again with `undefined`
	    // so the toolbar can show its regular content again.
	    this.props.onOverrideContent(undefined);

  	render() {
	    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
	    return (
			<div>
				{buttons.map((Button, i) => // eslint-disable-next-line
				  <Button key={i} {...this.props} />
				)}
			</div>
	    );
  	}
}

class HeadlinesButton extends Component {
	// When using a click event inside overridden content, mouse down
	// events needs to be prevented so the focus stays in the editor
	// and the toolbar remains visible  onMouseDown = (event) => event.preventDefault()
	onMouseDown = (event) => event.preventDefault()

  	onClick = () =>
	    // A button can call `onOverrideContent` to replace the content
	    // of the toolbar. This can be useful for displaying sub
	    // menus or requesting additional information from the user.
	    this.props.onOverrideContent(HeadlinesPicker);

  	render() {
	    return (
	      	<div onMouseDown={this.onMouseDown} className={editorStyles.headlineButtonWrapper}>
		        <button onClick={this.onClick} className={editorStyles.headlineButton}>
		          H
		        </button>
	      	</div>
	    );
  	}
}

const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeButton,
    Separator,
    HeadlinesButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton
  ]
});
const { InlineToolbar } = inlineToolbarPlugin;

const TextEditor  = onClickOutside(createReactClass({

	getDefaultProps() {
        return {
            customStylesUtils: PropTypes.object.isRequired,
            currentColor: PropTypes.string.isRequired,
            setCurrentColor: PropTypes.func.isRequired,
            colorHandle: PropTypes.string.isRequired,
            switchColorHandle: PropTypes.func.isRequired,
            setCurrentFontSize: PropTypes.func.isRequired,
            hasEditorFocus: PropTypes.bool.isRequired,
            setEditorFocus: PropTypes.func.isRequired,
            editorState: PropTypes.object.isRequired,
            setEditorState: PropTypes.func.isRequired,
            setEditorBackground: PropTypes.func.isRequired,
            setCurrentFontFamily: PropTypes.func.isRequired,
        }
    },

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

    //method from 'react-onclickoutside' module
	handleClickOutside(e) {
    	e.preventDefault();
		this.composeData();
		//TODO
		this.props.setEditorFocus(false);
	},

 //    addText(e) {
	// },

    composeData() {
    	const { editorState, unique, successFiles } = this.state
    	console.log(convertToRaw(editorState.getCurrentContent()));
		BuildTextArr(convertToRaw(editorState.getCurrentContent())).then(textArr => {
			console.log('textArr', textArr);
			this.props.updateCardData(this.props.id, {textArr: textArr});
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

        //TODO
        this.props.setEditorState(editorState);
        this.props.setEditorFocus(true);
    	this.syncCurrentDynamicStylesWithSources(editorState);
    },

    syncCurrentDynamicStylesWithSources(editorState) {
	    const currentStyles = editorState.getCurrentInlineStyle();
	    const BLACK = '#000000';

	    if (!currentStyles.size) {
	      	this.props.setCurrentColor(BLACK);
	    }

	    // TODO: Remove if not needed
	    // const COLOR_PREFIX = DYNAMIC_STYLES_PREFIX + 'COLOR_';
	    const regex = /_(.+)/;

	    //model
	    /*ContentState
			{
			  "entityMap": {},
			  "blocks": [
			    {
			      "key": "s84s",
			      "text": "Hello World",
			      "type": "unstyled",
			      "depth": 0,
			      "inlineStyleRanges": [
			        {
			          "offset": 1,
			          "length": 10,
			          "style": "CUSTOM_COLOR_rgba(189,24,24,1)"
			        }
			      ],
			      "entityRanges": [],
			      "data": {}
			    }
			  ]
			}*/

	    //TODO
	    const dynamicStyles = currentStyles
	      	.filter(val => val.startsWith(DYNAMIC_STYLES_PREFIX))
	      	.map(val => {
		        const withoutPrefixVal = val.replace(`${DYNAMIC_STYLES_PREFIX}`, '');
		        const saneArray = reverseString(withoutPrefixVal)
		          	.split(regex)
		          	.filter(val => val.trim() !== '')
		          	.map(val => reverseString(val))
		          	.reverse();

		        return saneArray;
	      	})
	      	.reduce((acc, value) => {
	        	acc[camelCase(value[0])] = value[1];
	        	return acc;
	      	}, {});

	    	if (has(dynamicStyles, 'fontSize')) {
	      		this.props.setCurrentFontSize(
	        		parseInt(dynamicStyles['fontSize'].replace('px', ''), 10),
	      		);
	    	} else {
	      		this.props.setCurrentFontSize(11);
	    	}

	    	if (has(dynamicStyles, 'fontFamily')) {
	      		this.props.setCurrentFontFamily(dynamicStyles['fontFamily']);
	    	} else {
		      	this.props.setCurrentFontFamily('Arial'); // this will only hold true if default font of editor is set to 'arial'
		      	// hackish way (DONE RIGHT NOW) — put default font from css ('Arial' word repeated across technologies (css, js))
		      	// TODO: right way — haven't found it yet; try again with customStylesUtils
	    	}

	    	if (has(dynamicStyles, 'color')) {
	      		this.props.setCurrentColor(dynamicStyles['color']);
	    	}
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
		{ 
			user, comment,
			hasEditorFocus,
	      	editorState,
	      	customStylesUtils,
	      	editorBackground,
	      	setEditorRef, } 		= this.props,
		
		{ 
			/*editorState,*/ 
		  fileInput, 
		  initialized,
		  suggestions
		} 						= this.state,
		mentionPlugin 	= this.mentionPlugin,
		{ 
			MentionSuggestions 
		} 				= mentionPlugin,
		plugins 		= [
			mentionPlugin, 
			emojiPlugin, 
			hashtagPlugin, 
			linkifyPlugin, 
			inlineToolbarPlugin, 
			blockStylesPlugin
		]
    	
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
			                        placeholder="your text"
			                        onChange={this.onChange}
			                        editorState={editorState}
			                        keyBindingFn={this.myKeyBindingFn} 
			                        handleKeyCommand={this.handleKeyCommand}

			                        stripPastedStyles={true}
			                        customStyleFn={customStylesUtils.customStyleFn}
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
		                </div>
			        </div>
			    </form>
			</div>
		)
	}
}))

export default connect(state =>({
	user: state.User.user,
	defaults: state.Users.defaults,
}))(TextEditor)