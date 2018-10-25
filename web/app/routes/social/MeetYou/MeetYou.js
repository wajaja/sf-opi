import React            from 'react';
import createReactClass from 'create-react-class';
import { connect }      from 'react-redux';
import { withRouter }   from 'react-router-dom'
import LeftSidebar      from './LeftSidebar';
import { bindActionCreators } from 'redux'
import {
        RichUtils,
        KeyBindingUtil, EditorState,
        CompositeDecorator, convertToRaw,
        Modifier, ContentState
    }                   from "draft-js";
import MultiDecorator   from 'draft-js-plugins-editor/lib/Editor/MultiDecorator';
import { List, fromJS } from 'immutable'
import createCustomStylesUtils from './utils/customStylesUtils';
import * as DraftFuncs   from '../../../components/social/home/form/DraftFuncs'
import { 
    MeetYou as MeetYouActions
}                                   from '../../../actions'
import AdminSender              from './AdminSender'

import '../../../styles/social/meetyou.scss'
import WorkSpace                from './WorkSpace'

import MyLoadable    from '../../../components/MyLoadable'
const EditMenu = MyLoadable({loader: () => import('./EditMenu')})
// WorkSpace = MyLoadable({loader: () => import('./WorkSpace')})


const MeetYou = createReactClass({
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

        this.customStylesUtils = () => {};

        this.customStylesUtils = createCustomStylesUtils(
          this.props.setEditorState,
          this.props.getEditorState,
        );

        this.cropper = null;

        return{
            cards: [],
            currentFontSize: 12,
            currentTextAlign: 'left',
            filter: this.props.filter,
            currentTransparency: this.props.currentTransparency || 0,
            leftPanel: 'text',
            editorStates: {},
            editorState: EditorState.createEmpty(compositeDecorator),

            editorFocus: false,
            selectedCardId: 0,
            // editorState: getEditorStateFromLS(),
            editorBackground: '#ffffff',
            editorRef: null,
            currentColor: '#000000',
            selectedPage: 1,
            editing: true,
        }
    },

    setEditorFocus(newFocusVal) {
        this.setState(prevState => {
            if (prevState.editorFocus !== newFocusVal) {
                return { editorFocus: !prevState.editorFocus };
            } else {
                return;
            }
        });
    },

    getEditorState() {
        return this.state.editorState;
    },

    setEditorState(editorState) {
        this.setState({ editorState });
    },

    setEditorRef(ref) {
        this.setState({ editorRef: ref });
    },

    // componentDidMount() {
    //     document
    //       .querySelector('body')
    //       .addEventListener('keydown', this.closeModalOnEscape);
    // }

    // componentWillUnmount() {
    //     document
    //       .querySelector('body')
    //       .removeEventListener('keydown', this.closeModalOnEscape);
    // }

    // closeModalOnEscape = e => {
    //     if (e.keyCode === 27 && this.state.isModal) {
    //       this.toggleModal();
    //     }
    // };

    // toggleModal = () => {
    //     this.setState((prevState, props) => {
    //       return { isModal: !prevState.isModal };
    //     });
    // };

    


    setCropperRef(cropper) {
        this.cropper = cropper;
    },

    async saveCroppedImage() {
        const name = Math.random().toString(36).substr(2, 9);
        const croppedImg = await this.getCroppedImg(name);
        this.props.getResult(croppedImg); //TODO
    },

    /**
     * @param {File} image - Image File Object
     * @param {Object} pixelCrop - pixelCrop Object provided by react-image-crop
     * @param {String} fileName - Name of the returned file in Promise
     */
    getCroppedImg(fileName) {
        let canvas = this.cropper.getCroppedCanvas();
        // As Base64 string
        return canvas.toDataURL('image/jpeg');
    },

    updateCurrentTransparancy(value) {
        this.setState({updateCurrentTransparancy: value})
    },

    setCurrentColor(color) {
        this.setState({currentColor: color})
    },

    switchLeftSide(panel){
        this.setState({leftPanel: panel})
    },

    pushEditor(type) {
        const { selectedPage, cards } = this.state;
        console.log("pushedType", type, cards);
        const _card = {
            page: selectedPage,
            order: (cards.length - 1),
            id: cards.length,
            unique: (selectedPage + '_' + (cards.length -1)),
            url: null,
            type: type,
            textArr: []
        }
        const nextCards = List([_card]).concat(fromJS(cards));
        this.setState({
            cards: nextCards.toJS()
        })
    },

    //changes => {width: ref.style.width, height: ref.style.height, ...position}
    updateCardSize(cardId, changes) {
        const arr = fromJS(this.state.cards);
        const index = arr.findIndex(c => c.id === cardId)
        const newArr = arr.update(index, item => Object.assign({}, item, { ...changes }))
        this.setState({cards: newArr.toJS()});
    },

    //changes => {textArr, }
    updateCardData(cardId, changes) {
        console.log('updateCardData', cardId, changes)
        const arr = fromJS(this.state.cards);
        const index = arr.findIndex(c => c.id === cardId)
        const newArr = arr.update(index, item => Object.assign({}, item, { ...changes }))
        this.setState({cards: newArr.toJS()});
    },

    toggleTextAlign(align) {
        this.setState({currentTextAlign: align})
    },

    switchLefSide(panel) {
        this.setState({leftPanel: panel})
    },

    openAdminSender(){
        this.setState({adminSender: true})
    },

    closeAdmin() {
        this.setState({adminSender: false})
    },

    createPost() {

    },

    download() {

    },

    //from Card component
    onCardSelectionChange(cardId, metaKey, shiftKey){
        if(this.state.selectedCardId !== cardId)
            this.setState({selectedCardId: cardId});
    },

    render() {
        const selectedUrl = this.props.selected && this.props.selected.url;
        const {text, textRect, textAttrs, size} = this.props;

        const {
            editorFocus,
            editorState,
            editorBackground,
            colorHandle,
            editorRef,
            currentColor,
            currentItalicState,
            currentBoldState,
            currentFontSize,
            currentFontFamily
        } = this.state;

        const {
            switchColorHandle,
            handleCurrentColorChange,
            setEditorRef,
        } = this.props;


        return (
            <div className="MeetYou Container">
                <EditMenu 
                    {...this.props}
                    {...this.state} 
                    selectedCard={this.state.selectedCard}
                    editing={this.state.editing}

                    setCurrentColor={this.setCurrentColor}
                    colorHandle={colorHandle}
                    // switchColorHandle={switchColorHandle}
                    setCurrentFontSize={this.setCurrentFontSize}
                    hasEditorFocus={editorFocus}
                    setEditorFocus={this.setEditorFocus}
                    setEditorState={this.setEditorState}
                    setEditorBackground={this.setEditorBackground}
                    setCurrentFontFamily={this.setCurrentFontFamily}
                    setEditorRef={setEditorRef}
                    customStylesUtils={this.customStylesUtils}
                    editorBackground={editorBackground}

                    currentColor={currentColor}
                    currentFontSize={currentFontSize}
                    currentFontFamily={currentFontFamily}
                    currentItalicState={this.state.currentItalicState}
                    currentBoldState={this.state.currentBoldState}
                    currentUnderlineState={this.state.currentUnderlineState}
                    currentFontSize={this.state.currentFontSize}
                    currentTransparency={this.state.currentTransparency}
                    handleCurrentColorChange={this.handleCurrentColorChange}

                    updateCurrentTransparancy={this.updateCurrentTransparancy}
                    onToggleDefaultInlineStyles={this.onToggleDefaultInlineStyles}

                    selectedCardId={this.state.selectedCardId}
                    filter={this.state.filter}
                    saveCroppedImage={this.props.saveCroppedImage}
                    rotateLeft={this.props.rotateLeft}
                    rotateRight={this.props.rotateRight}
                    switchLeftSide={this.switchLeftSide}
                    toggleTextAlign={this.toggleTextAlign}
                    switchLefSide={this.switchLefSide}
                    openAdminSender={this.openAdminSender}
                    createPost={this.createPost}
                    download={this.download}
                    />
                <LeftSidebar
                    user={this.props.user}
                    history={this.props.history}
                    dispatch={this.props.dispatch}
                    leftPanel={this.state.leftPanel}
                    auth_data={this.props.auth_data}
                    pushEditor={this.pushEditor}
                    access_token={this.props.access_token}
                    getImageFromCache={this.props.getImageFromCache}
                    changeView={this.props.changeView}
                    clientId={this.props.clientId}
                    peerCon={this.props.peerCon}
                    startCall={this.props.startCall}
                    callWindow={this.props.callWindow}
                    localSrc={this.props.localSrc}
                    peerSrc={this.props.peerSrc}
                    callConfig={this.props.callConfig}
                    mediaDevice={this.props.peerCon.mediaDevice}
                    endCall={this.props.endCall}
                    fireUser={this.props.fireUser}
                    firebase={this.props.firebase}
                    toggleOnlineList={this.props.toggleOnlineList}
                    />
                <div className="work-space">
                    <div className="work-space-a">
                        <WorkSpace 
                            {...this.props}  

                            cards={this.state.cards}
                            editing={this.state.editing}
                            currentTextAlign={this.state.currentTextAlign}
                            currentFilter={this.props.filter}
                            leftPanel={this.state.leftPanel}
                            editorStates={this.state.editorStates}
                            selectedCardId={this.state.selectedCardId}
                            selectedPage={this.state.selectedPage}
                            customStylesUtils={this.customStylesUtils}
                            setCurrentColor={this.setCurrentColor}
                            colorHandle={colorHandle}
                            currentUnderlineState={this.state.currentUnderlineState}
                            // switchColorHandle={switchColorHandle}
                            updateCardSize={this.updateCardSize}
                            updateCardData={this.updateCardData}
                            setCurrentFontSize={this.setCurrentFontSize}
                            hasEditorFocus={editorFocus}
                            setEditorFocus={this.setEditorFocus}
                            editorState={editorState}
                            setEditorState={this.setEditorState}
                            editorBackground={editorBackground}
                            setEditorBackground={this.setEditorBackground}
                            setCurrentFontFamily={this.setCurrentFontFamily}
                            setCurrentBoldState={this.setCurrentBoldState}
                            setCurrentItalicState={this.setCurrentItalicState}
                            setCurrentUnderlineState={this.setCurrentUnderlineState}
                            setCurrentCodeState={this.setCurrentCodeState}
                            setEditorRef={setEditorRef}
                            editorRef={editorRef}
                            customStylesUtils={this.customStylesUtils}

                            currentColor={currentColor}
                            currentFontFamily={this.state.currentFontFamily}
                            currentTransparency={this.state.currentTransparency}
                            currentItalicState={currentItalicState}
                            currentBoldState={currentBoldState}
                            currentFontSize={this.state.currentFontSize}
                            handleCurrentColorChange={this.handleCurrentColorChange}

                            setCropperRef={this.setCropperRef}
                            onCardSelectionChange={this.onCardSelectionChange}
                            onToggleDefaultInlineStyles={this.onToggleDefaultInlineStyles}
                            />
                    </div>
                </div>
                <div  className={this.state.adminSender ? `frm-contrib-ctnr view` : `frm-contrib-ctnr`}>
                    <AdminSender 
                        {...this.props}
                        closeAdmin={this.closeAdmin}
                        addSender={this.props.addSender}
                        addReceiver={this.props.addReceiver}
                        />
                </div>  
            </div>
        )
    }
});

const mapStateToProps = (state, ownProps) => {
    const meetYou = state.MeetYou.present;
    return {
        user: state.User.user,
        filter: meetYou.filter,
        admin: state.User.user,
        senders: meetYou.senders,
        receivers: meetYou.receivers,
        textAttrs: meetYou.textAttrs,
    }
};

function mapDispatchToProps(dispatch) {
    return  bindActionCreators(Object.assign({}, MeetYouActions), dispatch)
}

/////
export default  withRouter(connect(mapStateToProps, mapDispatchToProps)(MeetYou));