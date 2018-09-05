import ReactDOM                     from 'react-dom'
import React                        from 'react'
import createReactClass             from 'create-react-class'
import { Link }                     from 'react-router-dom'
import { connect }                  from 'react-redux'
import { fromJS }                   from 'immutable'
import { 
    RichUtils, getDefaultKeyBinding, 
    KeyBindingUtil, EditorState,
    CompositeDecorator, convertToRaw,
    Modifier, ContentState
}                                   from 'draft-js'
import MultiDecorator               from 'draft-js-plugins-editor/lib/Editor/MultiDecorator';
import Editor, 
      { createEditorStateWithText } from 'draft-js-plugins-editor' // eslint-disable-line import/no-unresolved
import createHashtagPlugin          from 'draft-js-hashtag-plugin'
import createMentionPlugin, 
{ defaultSuggestionsFilter }        from 'draft-js-mention-plugin'; // eslint-disable-line import/no-unresolved
import createEmojiPlugin            from 'draft-js-emoji-plugin'
import EmojiPicker                  from 'emojione-picker'
import bindFunctions                from '../../../utils/bindFunctions'
import { BASE_PATH }                from '../../../config/api'
import * as DraftFuncs              from '../../social/home/form/DraftFuncs'
import { 
    Shares as SharesActions
}                                   from '../../../actions/post'
import { BuildContent }             from '../../social' 
import { Images }                   from '../../media'
import { Author }                   from '../avatars'
import { TimeAgo }                  from '../../social/commons'
import { Modal }                    from '../../social'

import '../../../styles/post/postShare.scss'
// import '../../../styles/social/content-editable.scss';

const ModalShare  = createReactClass({

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

        return {
            emojibtn: false,
            content: {},
            focus: false,
            isLoading: false,
            plugins: null,
            leftForm: '250px',
            leftLoading: '305px',
            EmojiSuggestions: null,
            hasCommandModifier: null,
            emojibtn: false,
            MentionSuggestions: null,
            mentions: fromJS([]),
            suggestions: fromJS([]),
            editorState: EditorState.createEmpty(compositeDecorator)
        }
    },

    composeData() {
        const formData = {
            content     : convertToRaw(this.state.editorState.getCurrentContent()),
        }
        return formData;
    },

    insertEmoji(data) {
        var code = '', emoji = '';
        if(data.unicode.length > 6) {
            code    = '0x' + data.unicode.split('-')[0];
            emoji   = String.fromCharCode(code);
        } else {
            code    = '0x' + data.unicode;
            emoji   = String.fromCodePoint(code);
        }
        
        const editorState   = this.state.editorState,
            selection       = editorState.getSelection(),
            contentState    = editorState.getCurrentContent(),
            newContent      = Modifier.insertText(contentState, selection, emoji),
            es              = EditorState.push(editorState, newContent, 'insert-text');
        this.setState({
            editorState: es
        });
    },

    toggleEmoji() {
        const self = this;
        self.setState({emojibtn: !self.state.emojibtn})
    },

    closeModalShare(e) {
        e.preventDefault();
        this.props.closeModalShare();
    },

    sendShare(e){
        e.preventDefault();
        const data = this.composeData(),
        {sharedPost:{id}, refer} = this.props;
        this.props.sendShare(data, id, refer);
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
        //          suggestions: fromJS(data),
        //     });
        // });
    },

    componentWillMount() {
        const width = window.innerWidth,
        leftForm = ((width - 520) / 2) + 'px',
        leftLoading = ((width - 200) / 2) + 'px';
        const { hasCommandModifier }    = KeyBindingUtil;
        const mentions                  = fromJS(this.props.defaults);
        const emojiPlugin               = createEmojiPlugin();
        const mentionPlugin             = createMentionPlugin({
              mentions,
              mentionComponent: (props) => (
                <span
                  className={props.className}
                  onClick={() => alert(props.mention.get('link'))}>
                  {props.decoratedText}
                </span>
              ),
        });
        ///////////
        //hashtag
        const hashtagPlugin             = createHashtagPlugin();
        const { MentionSuggestions }    = mentionPlugin;
        const { EmojiSuggestions }      = emojiPlugin;
        const plugins                   = [mentionPlugin, emojiPlugin, hashtagPlugin];
        
        this.setState({
            plugins: plugins,
            leftForm: leftForm,
            leftLoading: leftLoading,
            EmojiSuggestions : EmojiSuggestions,
            MentionSuggestions: MentionSuggestions,
            hasCommandModifier: hasCommandModifier,
        })
    },

    componentDidMount() {
        window.document.addEventListener('click', this.handleDocClick, false);
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
    },

    handleDocClick(e) {     
        if(!ReactDOM.findDOMNode(this.emojiButton).contains(e.target) && this.state.emoji) {
            this.toggleEmoji()
        }
    },

    componentWillUnmount () {
        window.document.removeEventListener('click', this.handleDocClick, false);
    },

    componentDidUpdate(oldProps) {
        if(this.props != oldProps) {
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

            //animate opacity after prepreding data to news div container 
            const containers = window.document.getElementsByClassName("formPshare");
            for (var i = 0; i < containers.length; i++) {
                if(!$(containers[i]).hasClass('in')) {
                    window.getComputedStyle(containers[i]).display;
                    containers[i].className += ' in';
                }
            }
        }
    },

    /////
    /////
    render() {
        const { sharedPost, isRequesting, user, refer }  = this.props,
              { images, author, content, createdAt } = sharedPost,
              { editorState, plugins, EmojiSuggestions, 
                MentionSuggestions, leftLoading, leftForm } = this.state;

        /////
        /////
        return (
            <Modal className="modal-share">
                <div>           
                    <div className="black-drop-dv"></div>
                    <div className="mdl-container">
                        {isRequesting && 
                            <div className="loading-dv" style={{left: leftLoading}}></div>
                        }
                        {!isRequesting &&  
                            <form className="formPshare" style={{left: leftForm}}>
                                <div className="share_form_header">
                                    <span className="share_header_title">Share post</span>
                                    <span className="opinion-modal-close" onClick={this.closeModalShare}>
                                        <i className="fa fa-times "></i>
                                    </span>
                                </div> 
                                <div className="pst-shr-ctnr">
                                    <div className="pst-shr-tp-ctnr">
                                        <div className="pst-shr-tp-ctnr-a">
                                            {refer === 'photo' && 
                                                <div className="postShare-content-b">
                                                    <img src={sharedPost.webPath} className="mn-img" />
                                                </div> 
                                            }
                                            {refer === 'post' && 
                                                <div className="postShare-content-b">
                                                    {images.length == 0 && 
                                                        <div className="postShare-content-content">
                                                            <span className="postShare-content-content-b">
                                                                <BuildContent content={content} />
                                                            </span>
                                                        </div>
                                                    }            
                                                    {images.length == 1 &&
                                                        <div>
                                                            <span className="postShare-content-image-b">
                                                                <Images className="shr-img" images={images} />
                                                            </span>
                                                            <div className="postShare-content-content">
                                                                <span className="postShare-content-content-b">
                                                                    <BuildContent content={content} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    }
                                                    {images.length > 1 &&
                                                        <div>
                                                            <div className="pst-shr-gl-content">
                                                                <Images className="shr-img" images={images} />
                                                            </div>
                                                            <div className="pst-shr-ct-ct">
                                                                <span className="pst-shr-ct-ct-txt">
                                                                    <BuildContent content={content} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            }

                                            <div className="pst-shr-ctnr-usr-btm">
                                                <div className="postShare-content-user-a">
                                                    <div className="postShare-content-user-b">
                                                        <div className="postShare-content-by">
                                                            <Author.Photo author={author} className="shr-link-picture" />
                                                            <div className="pst-usr-nm-dte">
                                                                <Author.Name author={author} className="shr-link-name" />
                                                                <span className="postShare-createdAt">
                                                                    <TimeAgo timestamp={createdAt} />
                                                                </span>
                                                            </div>                               
                                                        </div>                            
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="postShare-message">
                                        <div className="lft-pst-shr-frm">
                                            <div className="lft-shr-frm-tp"></div>
                                        </div>
                                        <div className="postShare-message-a">
                                            <div className="dv-ttrea-share-ctnr">
                                                <div className="sp-ttrea-shr-ctnr" onClick={this.focus}>
                                                    <Editor 
                                                        // blockStyleFn={getBlockStyle}
                                                        // customStyleMap={styleMap}
                                                        ref={(elem) => {this.editor = elem}}
                                                        spellCheck={true}
                                                        plugins={plugins}
                                                        placeholder="text ..."
                                                        onChange={this.onChange}
                                                        editorState={editorState}
                                                        keyBindingFn={DraftFuncs.myKeyBindingFn} 
                                                        handleKeyCommand={this.handleKeyCommand}
                                                    />
                                                    <EmojiSuggestions />
                                                    <MentionSuggestions
                                                        onSearchChange={this.onSearchChange}
                                                        suggestions={this.state.suggestions}
                                                    />
                                                </div>              
                                            </div>
                                        </div>
                                        <div className="postShare-foo">
                                            <div className="shr-foo-lft">
                                                <button className="hidden-btn btn btn-default btn-sm">h</button>
                                            </div>
                                            <div className="shr-foo-rght">
                                                <span className="shr-foo-ldg-ctnr"></span>
                                                <button className="opinion-modal-cancel btn btn-default btn-sm" onClick={this.closeModalShare}>cancel</button>
                                                <button className="pshare-post btn btn-primary btn-sm" onClick={this.sendShare}>Share</button>
                                            </div>                
                                        </div>
                                    </div>
                                </div>
                            </form>
                        }
                    </div>
                </div>
            </Modal>
        )
    }
})

/////
////
export default connect(
    function mapStateToProps(state) {
        // const { currIndex, isRequesting, apiName, errorMsg, formData } = state;
        return {
            isRequesting: state.Shares.isRequesting,
            user: state.User.user,
            defaults: state.Users.defaults,
        };
    },
    function mapDispatchToProps(dispatch) {
        return {
            // onShare: (...args) => dispatch(onShare(...args)),
            // onHide: (...args) => dispatch(gotoDone(...args)),
            // storeName: (...args) => dispatch(storeName(...args)),
            // storePhone: (...args) => dispatch(storePhone(...args))
        }
    }
)(ModalShare)

// <div className="lft-shr-frm-btm">
//     <Author.Photo author={author} className="shr-frm-pr-pic" />
// </div>