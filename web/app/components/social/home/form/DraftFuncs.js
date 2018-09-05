import React					from 'react'
import ReactDOM 				from 'react-dom'
import { getDefaultKeyBinding, KeyBindingUtil }	from 'draft-js';

const { hasCommandModifier } = KeyBindingUtil;
////////////////////////////
// TAG HANDLING eg. @rkpasia

export const HANDLE_REGEX = /\@[\w]+/g;
export const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;

export function handleStrategy(contentBlock, callback, contentState) {
 	findWithRegex(HANDLE_REGEX, contentBlock, callback);
}

export function hashtagStrategy(contentBlock, callback, contentState) {
    findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

export function findWithRegex(regex, contentBlock, callback) {
    const text = contentBlock.getText();
    let matchArr, start;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
    }
}

export const styles = {
  	tag: {
    	color: 'rgba(98, 177, 254, 1.0)',
    	direction: 'ltr',
    	unicodeBidi: 'bidi-override',
  	}
}

export const HandleSpan = (props) => {
  	return <span {...props} style={styles.handle}>{props.children}</span>;
};

////////
////////
export const HashtagSpan = (props) => {
  return <span {...props} style={styles.hashtag}>{props.children}</span>;
};

//// END TAG HANDLING
// ///////////////////
export function myKeyBindingFn(e: SyntheticKeyboardEvent): string {
  	if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
    	return 'myeditor-save';
  	}
  	return getDefaultKeyBinding(e);
}

// INLINE_STYLES
export const INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Link', style: 'LINK'},
    {label: 'Inline Code', style: 'CODE'},
];

export const InlineStyleControls = (props) => {
    let currentStyle = props.editorState.getCurrentInlineStyle();
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
export const BLOCK_TYPES = [
    {label: 'Quote', style: 'blockquote'},
    {label: 'Block Code', style: 'code-block'},
];

export const BlockStyleControls = (props) => {
    const {editorState} = props,
    selection = editorState.getSelection(),
    blockType = editorState
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