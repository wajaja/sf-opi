import React 						from 'react'
import createReactClass 			from 'create-react-class'
import axios 						from 'axios'
import { fromJS } 					from 'immutable'
import { connect } 					from 'react-redux'
import ReactDOM, { findDOMNode }	from 'react-dom'
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
import { canUseDOM } 				from '../../../utils/executionEnvironment'
import { BASE_PATH } 				from '../../../config/api'
import * as DraftFuncs 				from '../../social/home/form/DraftFuncs'
//https://github.com/draft-js-plugins/draft-js-plugins/issues/995
import MultiDecorator 				from 'draft-js-plugins-editor/lib/Editor/MultiDecorator';
const { hasCommandModifier } = KeyBindingUtil;


const emojiPlugin 					= createEmojiPlugin({
	//selectButtonContent: ''
}),
{ EmojiSuggestions, EmojiSelect } 	= emojiPlugin,
hashtagPlugin 						= createHashtagPlugin(),
linkifyPlugin 						= createLinkifyPlugin({
  	component: (props) => (
    	// eslint-disable-next-line no-alert, jsx-a11y/anchor-has-content
    	<a {...props} onClick={() => alert('Clicked on Link!')} />
  	)
})

const StatusForm  = createReactClass({

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
			content: '',
			focus: false,
			initialized: false,
			isLoading: false,
        	EmojiSuggestions: null,
        	hasCommandModifier: null,
      		MentionSuggestions: null,
      		mentions: mentions,
      		suggestions: mentions,
			editorState: EditorState.createEmpty(compositeDecorator)
		}
	},

	getDefaultProps() {
	    return {
	      	content: '',
	    };
	},

	composeData() {
		return convertToRaw(this.state.editorState.getCurrentContent())
	},

	handleSubmit() {
		const content = this.composeData();
		this.props.handleSubmit(content);
		this.setState({
			focus: false, 
			content: {},
			editorState: EditorState.push(this.state.editorState, ContentState.createFromText(''))
		})
	},

	_handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        //handle submit command
  //       if (command === 'submit' && this.props.enterToSubmit) {
		// 	this.submit();
		// }
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
		const { hasCommandModifier } 	= KeyBindingUtil
		this.setState({
			initialized: true,
			hasCommandModifier: hasCommandModifier
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

    	if(!this.state.initialized) {
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
        	this.setState({
        		mentions: mentions,
      			suggestions: mentions, 
        	})
        }
    },

	render() {		
		//////
		const self 		= this,
		{ user, submitting }		= this.props,
		{ editorState, 
		 suggestions, 
			initialized 
		} 				= this.state,
		mentionPlugin 	= this.mentionPlugin,
		{ 
			MentionSuggestions 
		} 				= mentionPlugin,
		plugins 		= [mentionPlugin, emojiPlugin, hashtagPlugin, linkifyPlugin]
/////


		return(
			<div className="stt-form-ctnr">
	        	<div className="expandingArea">
	            	{initialized && 
	            		<div className="nw-stt-bod autoExpand-stt" onClick={this.focus}>
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
	            <div className="dv-stt-ft">
                	<div className="lft-stt-ft">
	                	<div className="msg-opt-plus emoji-dv dv-emo" style={{display: 'inline-block'}} ref={(el)=> {this.emojiDiv = el}}>
	                        {typeof document !== 'undefined' && <EmojiSelect />}
		                </div>
	                </div>
                	<div className="rght-stt-ft">
	                	<button 
	                		type="submit" 
	                		disabled={submitting}
	                		onClick={this.handleSubmit} 
	                		className="btn btn-primary btn-sm">
	                		Submit
	                	</button>
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
}))(StatusForm)