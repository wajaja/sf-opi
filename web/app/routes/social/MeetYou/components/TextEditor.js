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
import emojione         			from 'emojione'
import createEmojiPlugin 			from 'draft-js-emoji-plugin'
import Status 						from 'react-fine-uploader/status'
import createStickerPlugin 			from 'draft-js-sticker-plugin';
import onClickOutside 				from 'react-onclickoutside'
import { Rnd }              from "react-rnd";
import { 
    RichUtils, getDefaultKeyBinding, 
    KeyBindingUtil, EditorState,
    CompositeDecorator, convertToRaw,
    Modifier, ContentState
} 									from 'draft-js'
import { stateToHTML } 				from 'draft-js-export-html';
import createStyles 				from 'draft-js-custom-styles';
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
import { 
	BuildTextArr, ErrorStack,
	ColorPicker,
    BackgroundColorPicker,
    FontSelector,
    FontSizeSelector,
    BuildHtmlString  
} from '../../../../components'

import FiltersPicker    from './FiltersPicker'
import CropButton       from './CropButton'
import Transparence     from './Transparence'
import TextAlign        from './TextAlign'
import HtmlContent 		from './HtmlContent'

import { 
	ReplyForm as FormActions,
	Authors as AuthorsActions
} 									from '../../../../actions/post'


//
// import '../css/Draftjs-custom.css';
import createBlockStylesPlugin from '../plugins/blockStyles';
import createCustomStylesUtils, { DYNAMIC_STYLES_PREFIX } from '../utils/customStylesUtils';

//import { getLSItem } from '../utils/localStorage';
import { reverseString } from '../utils/stringUtils';
const blockStylesPlugin = createBlockStylesPlugin();

const { hasCommandModifier } = KeyBindingUtil;


import MyLoadable    from '../../../../components/MyLoadable'


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
const customStyleMap = {
 	MARK: {
   		backgroundColor: 'Yellow',
   		fontStyle: 'italic',
 	},
};
// Passing the customStyleMap is optional
const { 
	styles, 
	customStyleFn, 
	exporter 
} = createStyles([
	'font-size', 
	'color', 
	'text-transform', 
	'font-family',
	'text-align'
	], DYNAMIC_STYLES_PREFIX, customStyleMap);

const TextEditor  = onClickOutside(createReactClass({

	getDefaultProps() {
        return {
            // customStylesUtils: PropTypes.object.isRequired,
            // currentColor: PropTypes.string.isRequired,
            // setCurrentColor: PropTypes.func.isRequired,
            colorHandle: PropTypes.string.isRequired,
            switchColorHandle: PropTypes.func.isRequired,
            // setCurrentFontSize: PropTypes.func.isRequired,
            hasEditorFocus: PropTypes.bool.isRequired,
            // setEditorFocus: PropTypes.func.isRequired,
            editorState: PropTypes.object.isRequired,
            // setEditorState: PropTypes.func.isRequired,
            // setEditorBackground: PropTypes.func.isRequired,
            // setCurrentFontFamily: PropTypes.func.isRequired,
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
			mentionComponent: (props) => {
				//const { children, className, mention, theme, entityKey, decoratedText } = props;
				return(
				    <span
				      	className={props.className}
				      	onClick={() => alert(props.mention.get('link'))}
				    	>
				      {props.children}
				    </span>
				)
			}
			///// positionSuggestions,

		});

		this.updateEditorState = editorState => this.setState({ editorState });

		return {
			x: 10,
			y: 10,
			width: 200,
			height: 50,
            unique: this.getUniqueForm(),
			focus: false,
			initialized: false,
			isLoading: false,
        	plugins: null,
        	type: 'richtext',
        	topPlace: false,
        	EmojiSuggestions: null,
			emojibtn: false,
      		MentionSuggestions: null,
      		mentions: mentions,
      		suggestions: mentions,
			editorState: EditorState.createEmpty(compositeDecorator),

			//default styles
			currentFontSize: 12,
			currentFontFamily: 'Arial',
            currentTextAlign: 'left',
            editorBackground: 'transparent',
            currentColor: '#000000',
            currentLineHeight: 18,
            filter: this.props.filter,
            currentTextDirectionality: 'LTR', // 'RTL'
            currentTransparency: this.props.currentTransparency || 0,

            editorRef: null,
            selectedPage: 1,
            editing: true,
            processing: false,
            content: '' //htmlString from editor state,

		}
	},

    //method from 'react-onclickoutside' module
	handleClickOutside(e) {
    	e.preventDefault();
		//this.composeData();
		//TODO
		this.setEditorFocus(false);
	},

	getEditorState(){
    	return this.state.editorState;
  	},

	composeData() {
    	const { editorState, unique } = this.state
    	this.setState({
    		editing: false,
    		processing: true
    	})
		// BuildHtmlString(convertToRaw(editorState.getCurrentContent())).then(htmlString => {
		// 	// const formData = {
		// 	// 	rmv_arr : '',
		// 	// 	unique  : unique,
		// 	// 	content : htmlString,
		// 	// 	successFiles: successFiles
		// 	// }

		// 	this.setState({content: htmlString})
		// });
	},

	getUniqueForm () {
		return Math.random().toString(36).substr(2, 9);
	},

	sendEditor(data) {
		const self 					= this,
		{ dispatch, comment:{id} } 	= this.props,
		uploader					= this.uploader;
		self.setState({
			focus: false, 
			content: {},
            failedFiles: [],
			isLoading: true,
			unique: this.getUniqueForm(),
			editorState: EditorState.push(this.state.editorState, ContentState.createFromText(''))
		})
	},

	_handleKeyCommand(command) {
        const { editorState } = this.state;

        //Poetry editor source
        let newState;
        if (command === "yo-strikethrough") {
          	newState = RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH")
      	} else {
        	//handle submit command
        	newState = RichUtils.handleKeyCommand(editorState, command);
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

    setEditorFocus(newVal){
    	this.setState({focus: newVal})
    },

    onChange(editorState) {
        // this.setState({
        // 	editorState: editorState
        // })

        //TODO
        this.updateEditorState(editorState);
        this.setEditorFocus(true);
    	this.syncCurrentDynamicStylesWithSources(editorState);
    },

    syncCurrentDynamicStylesWithSources(editorState) {
	    const currentStyles = editorState.getCurrentInlineStyle();
	    const BLACK = '#000000';

	    if (!currentStyles.size) {
	      	this.setCurrentColor(BLACK);
	    }

	    if(currentStyles.has('BOLD')) {
	    	this.setCurrentBoldState(true)
	    } else {
	    	this.setCurrentBoldState(false)
	    }

	    if(currentStyles.has('ITALIC')) {
	    	this.setCurrentItalicState(true)
	    } else {
	    	this.setCurrentItalicState(false)
	    }

	    if(currentStyles.has('UNDERLINE')) {
	    	this.setCurrentUnderlineState(true)
	    } else {
	    	this.setCurrentUnderlineState(false)
	    }

	    // if(currentStyles.has('CODE')) {
	    // 	this.props.setCurrentCodeState(true)
	    // } else {
	    // 	this.props.setCurrentCodeState(false)
	    // }

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

	    //TODO :: understand
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
	      		this.setCurrentFontSize(
	        		parseInt(dynamicStyles['fontSize'].replace('px', ''), 10),
	      		);
	    	} else {
	      		this.setCurrentFontSize(11);
	    	}

	    	if (has(dynamicStyles, 'fontFamily')) {
	      		this.setCurrentFontFamily(dynamicStyles['fontFamily']);
	    	} else {
		      	this.setCurrentFontFamily('Arial'); // this will only hold true if default font of editor is set to 'arial'
		      	// hackish way (DONE RIGHT NOW) — put default font from css ('Arial' word repeated across technologies (css, js))
		      	// TODO: right way — haven't found it yet; try again with customStylesUtils
	    	}

	    	if (has(dynamicStyles, 'color')) {
	      		this.setCurrentColor(dynamicStyles['color']);
	    	}
  	},


    handleKeyCommand(command) {
        this._handleKeyCommand(command)
    },

    myKeyBindingFn(e: SyntheticKeyboardEvent): string {
    	//handle submitting form on enter pressed
    	// if(e.keyCode === 13) {
    	// 	return 'submit';
    	// }
	  	if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
	    	return "yo-strikethrough"; // 'myeditor-save';
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
		window.document.addEventListener('click', this.handleDocClick, false);
	},

    componentWillUnmount () {
        //window.document.removeEventListener('click', this.handleDocClick, false);
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

    // shouldComponentUpdate(nextProps, nextState) {
    // 	return (this.state !== nextState);
    // },

    //callback from react-rnd
    onResize(e, direction, ref, delta, position){
        let width = ref.style.width;

        if(width > 500) width = 500;

        const size = { 
         	width: width,
            height: ref.style.height,
        }
        const changes = {
            ...position,
            ...size,
        };
        this.setState(changes);

        //this.props.updateCardSize(this.props.selectedCardId, size)
    },

    // handleCurrentFontSizeChange(fontSize) {
    //     this.addFontSize(fontSize);
    //     this.setCurrentFontSize(fontSize)
    // },

    toggleFontSize(fontSize) {
    	const newEditorState = styles.fontSize.toggle(this.state.editorState, fontSize);
 
    	return this.updateEditorState(newEditorState);
  	},
 
  	removeFontSize(){
	    const newEditorState = styles.fontSize.remove(this.state.editorState);
	 
	    return this.updateEditorState(newEditorState);
  	},
 
  	addFontSize(val) {
    	const newEditorState = styles.fontSize.add(this.state.editorState, val);
    	this.setCurrentFontSize(val);
		return this.updateEditorState(newEditorState);
  	},

    setCurrentFontFamily(fontFamily){
        this.setState({
          currentFontFamily: fontFamily,
        });
    },
 
  	addFontFamily(val) {
    	const newEditorState = styles.fontFamily.add(this.state.editorState, val);
 		this.setCurrentFontFamily(val);
    	return this.updateEditorState(newEditorState);
  	},

    setEditorBackground(background) {
        if (!background) {
            throw new Error('need to give some background');
        }

        let hexColorRegex = /^#[0-9A-F]{6}$/i;
        let isHexColor = hexColorRegex.test(background);

        // background is not an image
        if (isHexColor) {
            this.setState({
                editorBackground: background,
            });

            // setLSItem('editorBackground', background);
        }
    },

    setCurrentFontSize(fontSize){
        if (!fontSize) {
            throw new Error('You need to pass font size');
        }

        this.setState({
            currentFontSize: fontSize,
        });
    },

    setCurrentBoldState(state){
        this.setState({currentBoldState: state})
    },
    setCurrentItalicState(state){
        this.setState({currentItalicState: state})
    },
    setCurrentUnderlineState(state){
        this.setState({currentUnderlineState: state})
    },

    handleCurrentColorChange(color) {
        const self = this
        self.addColor(color.hex);
        self.setCurrentColor(color.hex);
    },

    addColor(val) {
    	const newEditorState = styles.color.add(this.state.editorState, val);
 
    	return this.updateEditorState(newEditorState);
  	},

  	removeColor(val) {
  		return function() {
	    	const newEditorState = styles.color.remove(this.state.editorState, val);
	 
	    	return this.updateEditorState(newEditorState);
	    }
  	},

  	setCurrentColor(color) {
        if (!color) {
            throw new Error('You need to pass in some color');
        }

        this.setState({
            currentColor: color,
        });
    },

    onToggleDefaultInlineStyles(style, state) {
        if(style === 'BOLD') {
            this.setState({currentBoldState: state})
        } else if(style === 'ITALIC') {
            this.setState({currentItalicState: state})
        } else if(style === 'UNDERLINE') {
            this.setState({setCurrentUnderlineState: state})
        } else if(style === 'CODE') {
            this.setState({currentCodeState: state})
        }
        this._toggleInlineStyle(style);
    },

    toggleTextAlign(val) {
    	const newEditorState = styles.textAlign.add(this.state.editorState, val);
 		this.setState({currentTextAlign: val})
 		console.log('toggleTextAlign');
    	return this.updateEditorState(newEditorState);
  	},

    _toggleInlineStyle(inlineStyle) {
        this.setEditorState(
            RichUtils.toggleInlineStyle(
              this.state.editorState,
              inlineStyle
            )
        );
    },

    setEditorState(state) {
        this.setState({editorState: state})
    },

    ///REVIEW
    updateCard({image, shapes}) {
        // !!!!!!!!!!!
    	this.props.updateEditorCard({
    		cardId: this.props.editedCardId, 
    		type: 'richtext', 
    		image, 
    		shapes,
    	})
    	this.setState({
    		editing: false,
    		processing: false
    	})
    },

	render() {
		//this.customStylesUtils = createCustomStylesUtils(this.setEditorState, this.getEditorState);
		const self   			= this,
		{ 
			user,
			hasEditorFocus,
	      	editorBackground,
	      	setEditorRef, cardId } 		= this.props,
		
		{ 
			/*editorState,*/
		  initialized,
		  suggestions,
		  editorState
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
			blockStylesPlugin
		];

		let actives = ['image'];

		const options = {
			inlineStyles: exporter(this.state.editorState),
			entityStyleFn: (entity) => {
			    const entityType = entity.get('type').toLowerCase();
		      	const data = entity.getData();
			    if (entityType === 'emoji') {
			      	return {
			        	element: 'span',
			        	attributes: {
			          		class: 'emoji'
			        	},
			        	style: {
			          		// Put styles here...
			          		backgroundImage: `url(${$(emojione.toImage(data.emojiUnicode)).attr("src")})`
			        	},
			    	};
			    } else if(entityType === 'mention') {
			    	const mention = data.mention.toJS();
			    	return {
			        	element: 'a',
			        	attributes: {
			        		href: mention.link,
			          		class: "mention",
			        	},
			        	style: {
			          		// Put styles here...
			          		whiteSpace: 'nowrap' //because we need the mention in one line
			        	},
			    	};
			    }
			},
		}


    	const html = stateToHTML(this.state.editorState.getCurrentContent(), options);
    	console.log(html);
    	
    	///////return
 		return(
 			<div className="div-txt-edit" ref={(el) => {this.formEl = el}}>
 				<div 
 					className="EditorSurface"
 					style={{
 						padding: "1px",
 						height: parseInt(this.state.height, 10) + 10 + "px"
 					}}>
	 				<form className="form-txt-edit" method="post" >
		                <div className="expandingArea">
	                        <div className="meetyou autoExpand-meet">
					            <Rnd
				                    className="editor-outer"
				                    disableDragging={true}
				                    style={{
				                    	fontSize: '12px',
										fontFamily: this.state.defaultFontFamily || 'Arial',
							            background: "#ffffff",
							            lineHeight: this.state.currentLineHeight + 'px',
                                        transform: 'unset !important'
				                    }}
				                    ref={node => (this.node = node)}
				                    size={{ width: this.state.width, height: this.state.height }}
				                    position={{ x: 2, y: 2 }}
				                    onClick={this.focus}
				                    onResize={this.onResize}>
					                <Editor 
				                        // blockStyleFn={getBlockStyle}
				                        // customStyleMap={styleMap}
				                        ref={(elem) => {this.editor = elem}}
				                        spellCheck={true}
				                        plugins={plugins}
				                        placeholder="your text"
				                        textAlignment={this.state.currentTextAlign}
				                        textDirectionality={this.state.currentTextDirectionality}
				                        onChange={this.onChange}
				                        customStyleMap={customStyleMap} //also used in draft-js-custom-styles
				                        editorState={editorState}
				                        keyBindingFn={this.myKeyBindingFn} 
				                        handleKeyCommand={this.handleKeyCommand}

				                        stripPastedStyles={true}
				                        customStyleFn={customStyleFn}
				                    />
				                    {this.state.processing && <HtmlContent 
				                    	width={this.state.width}
				                    	height={this.state.height}
				                    	html={html}
				                    	updateCard={this.updateCard}
				                    	getHtmlCardRect={(rect) => this.setState({htmlCardRect: rect})}
				                    	size={{ 
				                    		width: parseInt(this.state.width), 
				                    		height: parseInt(this.state.height) 
				                    	}}
				                    	defaultStyle={{
								    		fontSize: this.state.defaultFontSize || '12px',
											lineHeight: this.state.currentLineHeight,
											fontFamily: this.state.defaultFontFamily || 'Arial',
											textAlignment: this.state.currentTextAlign,
											textDirectionality: this.state.currentTextDirectionality
										}}
							    		editorState={this.state.editorState}
							    		background={this.state.editorBackground || 'transparent'}
							    		cardId={this.props.selectedCardId} 
							    		type="richtext"
				                    	/>
				                    }
				                    <EmojiSuggestions 
				                    	onOpen={this.onEmojiOpen}
				                    	/>
				                    <MentionSuggestions
								        onSearchChange={this.onSearchChange}
								        suggestions={suggestions}
								        />
					            </Rnd>
					        </div>
				        </div>
				    </form>
				</div>
				<div className="EditorMenubar-ctr Menubar">
					<div className="HMenu Menubar-ctr">
						<div className="btm">
							<div className="emoji-dv" ref={(el)=> {this.emojiDiv = el}}>
			                    <EmojiSelect />
			                </div>
			               	<div className="save-dv">
			                    <button 
			                    	type="button"
			                    	className="btn btn-primary btn-sm"
			                    	onClick={this.composeData}>ok</button>
			                </div>
		                </div>
						<div className="HMenu-a">
		                    <div className={`sub-m police ${actives.includes("police") ? " active" : ""}`}>
			                    <div className="item-top">
			                        <div className="fontFamily" data-title="fontFamily">
			                            <FontSelector 
			                                {...this.props}
			                                currentFontFamily={this.state.currentFontFamily}
			                                setCurrentFontFamily={this.setCurrentFontFamily}
			                                addFontFamily={(val) =>this.addFontFamily(val)}
			                                editorRef={this.editorRef}
			                                />
			                        </div>
			                        <div className="fontSize" data-title="fontSize">
			                            <FontSizeSelector 
			                                {...this.props}
			                                currentFontSize={this.state.currentFontSize}
			                                addFontSize={(val) => this.addFontSize(val)}
			                                setCurrentFontSize={this.setCurrentFontSize}
			                                hasEditorFocus={this.editorFocus}
			                                />
			                        </div>
			                    </div>
			                    <ul className="sub-menub-lst">
			                        <li className="item">
			                            <div className="textColor" data-title="textColor">
			                                <ColorPicker 
			                                    {...this.props}
			                                    color={this.state.currentColor}
			                                    colorHandle={this.colorHandle}
			                                    handleColorChange={this.handleCurrentColorChange}
			                                    setEditorBackground={this.setEditorBackground}
			                                    setCurrentColor={this.setCurrentColor}
			                                    />
			                            </div>
			                        </li>
			                        <li className="item">
			                            <div className="bold" data-title="bold">
			                                <div 
			                                    className={this.state.currentBoldState ? `ico active` : `ico`} 
			                                    onClick={() => this.onToggleDefaultInlineStyles('BOLD', !this.state.currentBoldState)}></div>
			                            </div>
			                        </li>
			                        <li className="item">
			                            <div className="italic" data-title="italic">
			                                <div 
			                                    className={this.state.currentItalicState ? `ico active` : `ico`} 
			                                    onClick={() => this.onToggleDefaultInlineStyles('ITALIC', !this.state.currentItalicState)}></div>
			                            </div>
			                        </li>
			                        <li className="item">
			                            <div className="underline" data-title="underline">
			                                <div 
			                                    className={this.state.currentUnderlineState ? `ico active` : `ico`} 
			                                    onClick={() => this.onToggleDefaultInlineStyles('UNDERLINE', !this.state.currentUnderlineState)}></div>
			                            </div>
			                        </li>
			                        <li className="item" style={{display: 'none'}}>
			                            <div className="code" data-title="code">
			                                <div 
			                                    className={this.state.currentCodeState ? `ico active` : `ico`} 
			                                    onClick={() => this.onToggleDefaultInlineStyles('CODE', !this.state.currentCodeState)}></div>
			                            </div>
			                        </li>
			                    </ul>
			                    {!!actives.includes("police") && <div className="inactive"></div>}
			                </div>
			                <div className={`sub-m paragraph ${actives.includes("paragraph") ? " active" : ""}`}>
			                    <ul className="sub-menub-lst">
			                        <li className="item">
			                            <div className="alignLeft" data-title="alignLeft">
			                                <TextAlign 
			                                    value="left" 
			                                    toggleTextAlign={(val) => this.toggleTextAlign(val)}
			                                    currentTextAlign={this.state.currentTextAlign}
			                                    />
			                            </div>
			                        </li>
			                        <li className="item">
			                            <div className="alignCenter" data-title="alignCenter">
			                                <TextAlign 
			                                    value="center" 
			                                    toggleTextAlign={(val) => this.toggleTextAlign(val)}
			                                    currentTextAlign={this.state.currentTextAlign}
			                                    />
			                            </div>
			                        </li>
			                        <li className="item">
			                            <div className="alignRight" data-title="alignRight">
			                                <TextAlign 
			                                    value="right" 
			                                    toggleTextAlign={(val) => this.toggleTextAlign(val)}
			                                    currentTextAlign={this.state.currentTextAlign}
			                                    />
			                            </div>
			                        </li>
			                        <li className="item">
			                            <div className="alignJustify" data-title="alignJustify">
			                                <TextAlign 
			                                    value="justify" 
			                                    toggleTextAlign={(val) => this.toggleTextAlign(val)}
			                                    currentTextAlign={this.state.currentTextAlign}
			                                    />
			                            </div>
			                        </li>
			                        <li className="item" style={{display: 'none'}}>
			                            <div className="lineHeight" data-title="lineHeight">
			                            </div>
			                        </li>
			                        <li className="item" style={{display: 'none'}}>
			                            <div className="textSpacing" data-title="textSpacing">
			                            </div>
			                        </li>
			                    </ul>
			                    {!!actives.includes("paragraph") && <div className="inactive"></div>}
			                </div>
		                </div>
		            </div>
				</div>
			</div>
		)
	}
}))

export default connect(state =>({
	user: state.User.user,
	defaults: state.Users.defaults,
}))(TextEditor)