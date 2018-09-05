import React            from 'react'
import createReactClass from 'create-react-class'
import ReactDOM         from 'react-dom'
import { connect }      from 'react-redux'
import { emojify }      from 'react-emojione'
import { 
    EditorState, getDefaultKeyBinding, 
    KeyBindingUtil, RichUtils, CompositeDecorator, convertToRaw 
} from 'draft-js';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createEmojiPlugin from 'draft-js-emoji-plugin'; // eslint-disable-line import/no-unresolved

import '../../../styles/social/content-editable.scss';
import bindFunctions from '../../../utils/bindFunctions'

const { hasCommandModifier } = KeyBindingUtil;
const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions } = emojiPlugin;
const plugins = [emojiPlugin];


////////////////////////////
// TAG HANDLING eg. @rkpasia

const HANDLE_REGEX = /\@[\w]+/g;
const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;

function handleStrategy(contentBlock, callback, contentState) {
    findWithRegex(HANDLE_REGEX, contentBlock, callback);
}

function hashtagStrategy(contentBlock, callback, contentState) {
    findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
    const text = contentBlock.getText();
    let matchArr, start;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
    }
}

const styles = {
  tag: {
    color: 'rgba(98, 177, 254, 1.0)',
    direction: 'ltr',
    unicodeBidi: 'bidi-override',
  }
}

const HandleSpan = (props) => {
  return <span {...props} style={styles.handle}>{props.children}</span>;
};

const HashtagSpan = (props) => {
  return <span {...props} style={styles.hashtag}>{props.children}</span>;
};
// // END TAG HANDLING
// ///////////////////

function myKeyBindingFn(e: SyntheticKeyboardEvent): string {
  if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
    return 'myeditor-save';
  }
  return getDefaultKeyBinding(e);
}

// INLINE_STYLES
var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Link', style: 'LINK'},
    {label: 'Inline Code', style: 'CODE'},
];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return(
        <span className="CodepenCommentEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </span>
    );
};

//////////////
// BLOCK TYPES
const BLOCK_TYPES = [
    {label: 'Quote', style: 'blockquote'},
    {label: 'Block Code', style: 'code-block'},
];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <span className="CodepenCommentEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </span>
    );
};
//////////
/**
* Create the Textarea field in PostForm
*/
const Textarea  = createReactClass({

	getInitialState() {
        const compositeDecorator = new CompositeDecorator([
            {
                strategy: handleStrategy,
                component: HandleSpan,
            },
            {
                strategy: hashtagStrategy,
                component: HashtagSpan,
            },
        ]);

        return {
        	content: {},
            editorState: EditorState.createEmpty(compositeDecorator)
        };
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
        	editorState: editorState,
        	content: convertToRaw(editorState.getCurrentContent())
        })
        this.props.contentChange(convertToRaw(editorState.getCurrentContent()));
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

	componentDidMount() {
		const area = ReactDOM.findDOMNode(this);// window.document.querySelector('.post-support-textarea');
		// this.makeCommentEpandingArea(area);
	},

	render() {
		const { editorState } = this.state;
		return(
			<div className="div-textareaComment">
                <div className="expandingArea">                    
                	<div className="comment-form-textarea autoExpand-comment">
		                <div onClick={this.focus} >
		                    <Editor 
		                        // blockStyleFn={getBlockStyle}
		                        // customStyleMap={styleMap}
		                        ref={(elem) => {this.editor = elem}}
		                        spellCheck={true}
		                        plugins={plugins}
		                        // placeholder="content"
		                        onChange={this.onChange}
		                        editorState={editorState}
		                        keyBindingFn={myKeyBindingFn} 
		                        handleKeyCommand={this.handleKeyCommand}
		                    />
		                    <EmojiSuggestions />
		                </div>
		            </div>
                </div>
            </div>
		)
	}
})

export default Textarea;