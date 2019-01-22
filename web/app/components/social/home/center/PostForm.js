import React 						from 'react'
import createReactClass 			from 'create-react-class'
import axios 						from 'axios'
import { fromJS } 					from 'immutable';
import { connect } 					from 'react-redux'
import ReactDOM, { findDOMNode } 	from 'react-dom'
import punycode 					from 'punycode'
import onClickOutside 				from 'react-onclickoutside'
import { bindActionCreators } 		from 'redux'
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
import createEmojiPlugin 			from 'draft-js-emoji-plugin' // eslint-disable-line import/no-unresolved
import createMentionPlugin, 
{ defaultSuggestionsFilter } 		from 'draft-js-mention-plugin' // eslint-disable-line import/no-unresolved
import MultiDecorator 				from 'draft-js-plugins-editor/lib/Editor/MultiDecorator';
import { BASE_PATH } 				from '../../../../config/api'
import { 
	App as AppActions,
	Posts as PostsActions,
	PostForm as PostFormActions
} 									from '../../../../actions'
import { BuildHtmlString, ErrorStack } 			from '../../../../components'
import * as DraftFuncs 				from '../form/DraftFuncs'
import { canUseDOM } 				from '../../../../utils/executionEnvironment'

import '../../../../styles/lib/draft-js-emoji-plugin/plugin.css';
import '../../../../styles/lib/draft-js-mention-plugin/plugin.css';
import '../../../../styles/lib/draft-js-hashtag-plugin/plugin.css';
import '../../../../styles/social/form/post-form.scss'
import '../../../../styles/fine-uploader-gallery.scss'
import '../../../../styles/social/content-editable.scss'
import { VideoUploader } 		from '../form/PostFootElement'


import MyLoadable    from '../../../../components/MyLoadable'
const ModalTagFriend = MyLoadable({loader: () => import('../../../../components/media/ModalTagFriend')}),
PostHeadContainer 	= MyLoadable({loader: () => import('../form/PostHeadContainer')}),
PostFootElement 	= MyLoadable({loader: () => import('../form/PostFootElement')}),
PlacesSuggest 		= MyLoadable({loader: () => import('../form/PlacesSuggest')}),
Contributors 		= MyLoadable({loader: () => import('../form/Contributors')}),
SelectRecipient 	= MyLoadable({loader: () => import('../form/SelectRecipient')}),
PostGap 			= MyLoadable({loader: () => import('../form/PostGap')}),

Dropzone 		= MyLoadable({loader: () => import('react-fine-uploader/dropzone')}),
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

let  fileInput = null;  //with uploader instance

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

const clickOutsideConfig = {
  	excludeScrollbar: true
};

/////////
//PostForm
const PostForm  = onClickOutside(
	createReactClass({

		uploader : undefined,

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
				vUploader: false,
				files: null,  //input file collection
				gapHours: 0,
				gapMinutes: 0,
				videoName: '',
				unique: this.getUniqueForm(),
				rmv_arr: null,  //hidden	
				errors : {},
				plugins: [],
				place: {},
				fileInput: null,
				initialized: false,
				placeInput: false,
				submittedFiles: [],
	            successFiles: [],
	            completedFiles: [],
	            failedFiles: [],
				submittingPost: false,
	      		invalid: false,
	      		emojibtn: false,
	      		srcImageCache: null,
	      		idImageCache: null,
	      		loadImageCache: false,
	      		showModalImageCache: false,
	      		MentionSuggestions: null,
	      		mentions: mentions,
	      		suggestions: mentions,
	      		videoUploaderOption: false,
	      		editorClassnames: 'custom-form-editor',
				editorState: EditorState.createEmpty(compositeDecorator)
			}
	    },


		composeData() {
			const { editorState, gapMinutes, gapHours, place, videoName, unique } = this.state,
			{ recipients, editors, rightEditors, leftEditors, 
				typeValue, confindenceValue, timelineId, timelineType } = this.props;
			BuildHtmlString(convertToRaw(editorState.getCurrentContent())).then(htmlString => {
				const recips 	= recipients.reduce((txt, r) => { return txt + r.label + ','}, ''),
					edTxts 	= editors.reduce((txt, ed) => { return txt + ed.username + ','}, ''),
					rights 	= rightEditors.reduce((txt, ed) => {return txt + ed.username + ','}, ''),
					lefts 	= leftEditors.reduce((txt, ed) => { return txt + ed.username  + ',' }, ''),
					formData	= {
						rmv_arr 	: '',
						files 		: {},
						type 		: typeValue,
						isMainPost  : true,
						content 	: htmlString,
						gapMinutes 	: parseInt(gapMinutes),
						gapHours 	: parseInt(gapHours),
						confidence 	: confindenceValue,
						videoName 	: videoName,
						unique      : unique,
						place 	 	: place,
						recipients 	: recips,
						editorTexts : edTxts,
						leftEditorTexts: lefts,
						rightEditorTexts: rights,
						timelineId: timelineId,
						timelineType: timelineType,
					}

				this.sendPost(formData)
			});
		},

		sendPost(data) {
			axios.post(`${BASE_PATH}/api/posts/create`, data)
				.then((res) => {
					console.log(res.data)
					this.props.dispatch(PostsActions.newPost(res.data.post));
					this.afterSend();
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

		beforeSend() {
			this.setState({submittingPost: true});
		},

		afterSend() {
			const unique =  this.getUniqueForm(),
			{ dispatch } = this.props;
			this.setState({
				gapHours: 0,
				videoName: '',
				gapMinutes: 0,
	            failedFiles: [],
				unique: unique,
	            successFiles: [],
				submittedFiles: [],
				submittingPost: false,
				editorClassnames: 'custom-form-editor',
				editorState: EditorState.push(this.state.editorState, ContentState.createFromText(''))
			})
			this.props.postFormFocus(false);
			this.uploader.methods.reset();
			this.uploader.methods.setParams({unique: unique});
			this.props.reset(); //dispatch
			const 	gapContainer 	= $('.postform').find('.gap-tm-cont'),
					selectRecip 	= $('.postform').find('.pst-select-recip');

	        if(!selectRecip.hasClass('pst-select-hide'))
	        	selectRecip.toggleClass('pst-select-hide');

			if(!gapContainer.hasClass('pst-select-hide')) 
				gapContainer.toggleClass('pst-select-hide');
		},

		gapChange(gapHours, gapMinutes) {
			this.setState({
				gapHours: gapHours,
				gapMinutes: gapMinutes
			})
		},

	    _handleKeyCommand(command) {
	        const { editorState } = this.state;
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
	        this.editor.focus()
	    },

	    onChange(editorState) {

	        const chars = this.getCharCount(editorState),
	        lines = this.getLineCount(editorState);
	        let classnames = 'custom-form-editor';

	        if(chars === 0)
	        	classnames = 'custom-form-editor';
	        else if(chars <= 100)
	        	classnames = 'big custom-form-editor';
	        else if(chars <= 200)
	        	classnames = 'middle custom-form-editor';
	        else if(chars <= 500)
	        	classnames = 'normal custom-form-editor';
	        else
	        	classnames = 'small custom-form-editor';

	        this.setState({
	        	editorState: editorState,
	        	editorClassnames: classnames,
	        })
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

		getVideoName(name) {
			this.setState({videoName: name})
		},

		typeChange(type) {
			const { dispatch } = this.props;
			this.setState({
				typeValue: type.value,
				typeName: type.name
			})
			dispatch(AppActions.formTypePane(false)) 	//hide typePane
		},

		handleSubmit(e) {
			e.preventDefault();
			const self 		= this,
			{ dispatch } 	= this.props;
			this.beforeSend();
			this.composeData();
		},

		handleVideoUploader(e) {
			this.setState({vUploader: true})
			// this.refs.videoUploader.startUpload() //start upload video
		},

		toggleVideoUploaderOption() {
			const self = this
			this.setState({
	            videoUploaderOption: !self.state.videoUploaderOption
	        })
	        console.log('toggleVideoUploaderOption')
		},

		deleteFile(id, e) {
	    	e.preventDefault();
	    	const self 		= this,
	    	uploader 		= this.uploader,
	    	filename 		= this.state.completedFiles[id]['filename'],
	    	requestParams   = 'filename=' + filename + '&unique=' + this.state.unique
	    	uploader.methods.cancel(id);
	    	axios.post(`${BASE_PATH}/api/_gal_post/delete?${requestParams}`)  
				.then(function (res) {
					console.log(res.data);
				}, function(err) {
					console.log('err :', err);
				})
	    },

	    cancelFile(id, e) {
	    	e.preventDefault();
	    	this.uploader.methods.cancel(id);
	    },

	    getImageFromCache(id, e) {
	    	e.preventDefault();
	    	const filename 		= this.state.completedFiles[id]['filename'];
	    	this.props.getImageFromCache(filename, 'gallerypost');
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

		initialize() {
			const self = this;
			///TODO
			const FineUploaderTraditional =	require('fine-uploader-wrappers/traditional').default;
			Promise.all([
				import('fine-uploader-wrappers/traditional')
			]).then(function([
					_traditional,
			]) {
				const FineUploaderTraditional =	_traditional.default;
				const uploader = new FineUploaderTraditional({
					options: {
						debug: true,
					  	request: {
					        endpoint: 'http://opinion.com'+ BASE_PATH + Routing.generate('_uploader_upload_gallerypost'),
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
					    // text: {
					    // 	fileInputTitle: '',
					    // },
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
				fileInput 		= <FileInput className="item deg225" multiple accept='image/*' uploader={ uploader } />

				/////
		    	const { hasCommandModifier } 	= KeyBindingUtil
				
				self.setState({
					initialized: true,
					fileInput: fileInput,
					hasCommandModifier: hasCommandModifier
				})
				self.registerEvents();
			})
		},

		registerEvents () {

			this.uploader.on('submitDelete', (id) => {
				console.log('deleting..');
				this.uploader.setDeleteFileParams({filename: this.uploader.getName(id)}, id);
			})

			this.uploader.on('submit', (id, name) => {
	    		const submittedFiles = this.state.submittedFiles
	            submittedFiles.push(id)
	            this.setState({submittedFiles: submittedFiles })
	    	})

	        this.uploader.on('statusChange', (id, oldStatus, newStatus) => {       
	        	if (newStatus === 'submitted') {
	                // const submittedFiles = this.state.submittedFiles

	                // submittedFiles.push(id)
	                // this.setState({ submittedFiles })
	                console.log('submitted')
	            } 	
	        	else if (newStatus === 'uploading') {
	    			const li = findDOMNode(this).getElementsByTagName("li")[id];             
	                li.className = "in-progress";
	            }
	            else if (newStatus === 'upload successful') {
	            	const li = findDOMNode(this).getElementsByTagName("li")[id];
	                li.className = "";
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
	        	  //issue to be fixed
	        	// this.drawThumbnail(id, document.getElementById("preview"), 400);
			})

			this.uploader.methods.setParams({unique: this.state.unique});
		},

		//Source from draftjs plugin counter
		getLineCount(editorState) {
		    const blockArray = editorState.getCurrentContent().getBlocksAsArray();
		    return blockArray ? blockArray.length : null;
		},

		getCharCount(editorState) {
			const decodeUnicode = (str) => punycode.ucs2.decode(str), // func to handle unicode characters
			plainText = editorState.getCurrentContent().getPlainText(''),
			regex = /(?:\r\n|\r|\n)/g,  // new line, carriage return, line feed
			cleanString = plainText.replace(regex, '').trim();  // replace above characters w/ nothing
			return decodeUnicode(cleanString).length;
		},

		componentWillMount () {
			if(canUseDOM) {
				this.initialize();
			}
	    },

	    getUniqueForm () {
			// Math.random should be unique because of its seeding algorithm.
			// Convert it to base 36 (numbers + letters), and grab the first 9 characters
			// after the decimal.
			return Math.random().toString(36).substr(2, 9);
		},

		pushPlace(suggest) {
			console.log('in postform pushPlace happens', suggest)
			this.togglePlaceInput();
		},

		togglePlaceInput(e) {
			this.setState({placeInput: !this.state.placeInput})
	    },

	    componentDidMount() {
	    	if(typeof this.uploader === 'undefined') {
	    		this.initialize();
	    	}
	    },

	    componentDidUpdate(oldProps) {
	        if(!oldProps.emoji && this.props.emoji) {
	            this.setState({currentTab: this.props.currentTab})
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

	    //method from 'react-onclickoutside' module
		handleClickOutside(e) {
		    this.props.postFormFocus(false)
		},

	    handleFormClick (e) {
			const { dispatch } = this.props;
	        this.props.postFormFocus(true)
		},

		componentWillUnmount() {
			this.uploader = null
		},

		// shouldComponentUpdate(nextProps, nextState) {
		// 	return this.state !== nextState ||
		// 		this.props.
		// },

		render() {
			const self = this,
			{ 
				editorState, loadImageCache, 
				fileInput, srcImageCache,
				suggestions, idImageCache, 
				initialized, showModalImageCache, videoUploaderOption  
			} 				= this.state,
			mentionPlugin 	= this.mentionPlugin,
			{ 
				MentionSuggestions 
			} 				= mentionPlugin,
			disabled = false, //TODO
			plugins  = [mentionPlugin, emojiPlugin, hashtagPlugin, linkifyPlugin],
	    	timesIco = <i className="fa fa-times" aria-hidden="true"><span></span></i>,
	    	retryIco = <span className="qq-retry-icon">Retry</span>;
	    	////
			return (
				<div>
					<div 
						className={this.props.form_focus ? `gl-frm-a out-active` : `gl-frm-a`} 
						id="gl_frm_a"
						onClick={this.handleFormClick}>
					    <div className="triangle-up-form postform" id="postform">
					    	<form className={this.state.submittingPost ? `post-form minOpac` : `post-form`} id="post_type" ref="_postForm" onFocus={this.handleFocus} onBlur={this.handleBlur}>		            
					            <div className="home-form">
					            	<PostHeadContainer 
					            		dispatch={this.props.dispatch}
					            		home={this.props.home}
			                            profile={this.props.profile}
			                            initialized={initialized}
					            		formTypeName={this.state.typeName} 
					            		typeChange={this.typeChange}
					            		gapHours={this.state.gapHours}
					            		gapMinutes={this.state.gapMinutes}
					            		gapChange={this.gapChange}
					            		/>
					            </div>
					            <div id="post_form_body" className="post-form-body">
					                <div className="form-body">
				                        <Contributors 
				                        	form_focus={this.props.form_focus}
				                        	dispatch={this.props.dispatch}
				                        	home={this.props.home}
				                        	toggleEditor={this.props.toggleEditor}
				                            profile={this.props.profile}
				                            addEditor={this.props.addEditor}
				                            addLeftEditor={this.props.addLeftEditor}
				                            addRightEditor={this.props.addRightEditor}
				                        	/>
				                        <div className="post-support-textarea">
	                						<div className="expandingArea">
	                							<div className ="post-form-textarea autoExpand-post editearea">                
									                <div 
									                	onClick={this.focus} 
									                	className={this.state.editorClassnames}>
									                    {initialized && 
									                    	<Editor 
										                        // blockStyleFn={getBlockStyle}
										                        // customStyleMap={styleMap}
										                        ref={(elem) => {this.editor = elem}}
										                        spellCheck={true}
										                        plugins={plugins}
										                        placeholder="post ..."
										                        onChange={this.onChange}
										                        editorState={editorState}
										                        keyBindingFn={DraftFuncs.myKeyBindingFn} 
										                        handleKeyCommand={this.handleKeyCommand}
										                    />
										                }
									                    {initialized && <EmojiSuggestions />}
									                    {initialized && 
									                    	<MentionSuggestions
														        onSearchChange={this.onSearchChange}
														        suggestions={suggestions}
														        />
													    }
									                </div>
									            </div>
	                						</div>
	            						</div>
					                </div>
					                <input type="file" className="post-form-files" id="post_type_files"/>
					                <div id="fine-uploader-post">
						            	<div className="qq-gallery">
											<div className="qq-uploader-selector qq-uploader ">
												{initialized && 
													<Dropzone style={{ border: '1px dotted', height: 200, width: 200 } } 
														uploader={ this.uploader } >
												        <span>Drop Files Here</span>
												    </Dropzone>
												}
											</div>
											<div className="zone-upload-form">
									            <ul className="qq-upload-list-selector qq-upload-list" role="region" aria-live="polite" aria-relevant="additions removals">
									                {this.state.submittedFiles.map(function(id) {
									                    return (
									                    	<li key={id}>
									                    		<Thumbnail id={ id } uploader={ this.uploader } className="thumb-pst-img" />
									                    		<button className="react-fine-uploader-delete-button" onClick={this.deleteFile.bind(this, id)}>
									                    			<i className="fa fa-times" aria-hidden="true"><span></span></i>
									                    		</button>
									                    		<ErrorStack>
											            			<button 
											            				className="react-fine-uploader-cancel-button com-dlt-thumb-btn" 
											            				onClick={this.cancelFile.bind(this, id)} type="submit">
												            			{timesIco}
												            		</button>
											            		</ErrorStack>
									                    		<RetryButton id={ id } uploader={ this.uploader } children={retryIco} />
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
					                			                 
				                	{initialized && 
				                		<VideoUploader  
					                		ref="videoUploader"
					                		dispatch={this.props.dispatch}
					                		getVideoName={this.getVideoName} 
					                		vUploader={this.state.vUploader}
					                		submittingPost={this.state.submittingPost}
					                		toggleVideoUploaderOption={this.toggleVideoUploaderOption}
					                		/>
				                	}
				                	<SelectRecipient 
					                	dispatch={this.props.dispatch}
					                	updateRecipients={this.props.updateRecipients}
					                	submittingPost={this.state.submittingPost} 
					                	/>
				                	<PlacesSuggest 
					                	dispatch={this.props.dispatch} 
					                	pushPlace={this.pushPlace}
				                		placeInput={this.state.placeInput}
					                	submittingPost={this.state.submittingPost} 
					                	/>
					            </div>
				                <div className={!videoUploaderOption ? `gl-frm-foo` : `gl-frm-foo pst-foo-opt-space`}>
				                	<div 
				                		className={!videoUploaderOption ? `pst-foo-opt-space` : `pst-foo-opt-space active`}
				                		>
				                	</div>
			                        <div className="gl-frm-foo-ct" id="_gl_frm_foo_ct">
			                        	<div className={!this.props.form_focus ? `hide-btn-dv hide-active` : `hide-btn-dv`}>
			                        	</div>
			                        	<div className={!this.props.form_focus ? `more-dv` : `more-dv hide-active`}></div>
			                            {initialized && 
			                            	<PostFootElement 
				                            	dispatch={this.props.dispatch} 
				                            	home={this.props.home}
					                            profile={this.props.profile}
					                            user={this.props.user}
					                            form_focus={this.props.form_focus}
					                            history={this.props.history}
					                            auth_data={this.props.auth_data}
					                            access_token={this.props.access_token}
					                            getImageFromCache={this.props.getImageFromCache}

				                            	EmojiSelect={EmojiSelect} 
				                            	handleVideoUploader={this.handleVideoUploader} 
				                            	fileInput={fileInput} 
				                            	togglePlaceInput={this.togglePlaceInput}
				                            	footType="postForm" 
				                            	toggleVideoUploaderOption={this.toggleVideoUploaderOption}
				                            	insertEmoji={this.insertEmoji}
				                            	videoUploaderOption={videoUploaderOption}
				                            	/>
			                            }
			                            <div className="gl-frm-btm-li-post-r opt-rgt">
			                                <div className="gl-ldr-pst">
			                                	{this.state.submittingPost && <div className="ajax-loader-form" id=""></div>}
			                                </div>
			                                <button 
			                                	type="submit" 
			                                	id="submit-post" 
			                                	value="submit" 
			                                	onClick={this.handleSubmit}
			                                	disabled={disabled}
			                                	className="btn btn-primary btn-sm">Post</button>
			                            </div>
			                        </div>
			                    </div>
					        </form>
					    </div>
					</div>
				</div>
			)
		}
	}), clickOutsideConfig
)

/////
function mapDispatchToProps(dispatch) {
    return  bindActionCreators(Object.assign({}, PostFormActions), dispatch)
}

//////
///////
export default connect(state => ({
	editors 		: state.PostForm.editors,
	typeValue 		: state.PostForm.typeValue,
	recipients 		: state.PostForm.recipients,
	leftEditors 	: state.PostForm.leftEditors,
	rightEditors 	: state.PostForm.rightEditors,
	defaults 		: state.Users.defaults,
	confidPane 		: state.App.confidPane,
	confindenceValue: state.Confidence.confindenceValue,
	confindenceName	: state.Confidence.confindenceName,
	generatedVideoName: state.VideoUploader.videoName
}), mapDispatchToProps)(PostForm)