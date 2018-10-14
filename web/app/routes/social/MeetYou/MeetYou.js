import React            from 'react';
import createReactClass from 'create-react-class';
import { connect }      from 'react-redux';
import { withRouter }   from 'react-router-dom'
import LeftSidebar      from './LeftSidebar';
import EditMenu         from './EditMenu';
import WorkSpace        from './WorkSpace'

import '../../../styles/social/meetyou.scss'

const MeetYou = createReactClass({
    getInitialState() {
        return{
            leftPanel: true
        }
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

    handleCurrentFontSizeChange(fontSize) {
        this.setState({ currentFontSize: fontSize });
        this.customStylesUtils.addFontSize(fontSize);
    },

    setCurrentFontFamily(fontFamily){
        this.setState({
          currentFontFamily: fontFamily,
        });

        // this.customStylesUtils.addFontFamily(fontFamily);
    },

    setCurrentFontSize(fontSize){
        if (!fontSize) {
            throw new Error('You need to pass font size');
        }

        this.setState({
            currentFontSize: fontSize,
        });
    },



    render() {
        const selectedUrl = this.props.selected && this.props.selected.url;
        const {text, textRect, textAttrs, filter, size} = this.props;


        const {
            state: {
                editorFocus,
                editorState,
                editorBackground,
                colorHandle,
                currentColor,
                editorRef,
                currentItalicState,
                currentBoldState,
            },
            setEditorFocus,
            setEditorState,
            switchColorHandle,
            setCurrentColor,
            handleCurrentColorChange,
            setEditorBackground,
            setEditorRef,
        } = this.props;


        return (
            <div className="MeetYou Container">
                <EditMenu 
                    {...this.props}
                    {...this.state} 
                    selectedCard={this.state.selectedCard}
                    editing={this.state.editing}

                    setCurrentColor={setCurrentColor}
                    colorHandle={colorHandle}
                    // switchColorHandle={switchColorHandle}
                    setCurrentFontSize={this.setCurrentFontSize}
                    hasEditorFocus={editorFocus}
                    setEditorFocus={setEditorFocus}
                    setEditorState={setEditorState}
                    setEditorBackground={setEditorBackground}
                    setCurrentFontFamily={this.setCurrentFontFamily}
                    setEditorRef={setEditorRef}

                    currentColor={currentColor}
                    currentFontSize={currentFontSize}
                    currentFontFamily={currentFontFamily}
                    currentItalicState={this.state.currentItalicState}
                    currentBoldState={this.state.currentBoldState}
                    currentFontSize={this.state.currentFontSize}
                    />
                <LeftSidebar
                    leftPanel={this.state.leftPanel}
                    user={this.props.user}
                    history={this.props.history}
                    auth_data={this.props.auth_data}
                    dispatch={this.props.dispatch}
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


                            customStylesUtils={this.customStylesUtils}
                            setCurrentColor={setCurrentColor}
                            colorHandle={colorHandle}
                            // switchColorHandle={switchColorHandle}
                            setCurrentFontSize={this.setCurrentFontSize}
                            hasEditorFocus={editorFocus}
                            setEditorFocus={setEditorFocus}
                            editorState={editorState}
                            setEditorState={setEditorState}
                            editorBackground={editorBackground}
                            setEditorBackground={setEditorBackground}
                            setCurrentFontFamily={this.setCurrentFontFamily}
                            setEditorRef={setEditorRef}
                            editorRef={editorRef}

                            currentColor={currentColor}
                            currentFontFamily={this.state.currentFontFamily}
                            currentItalicState={currentItalicState}
                            currentBoldState={currentBoldState}
                            currentFontSize={this.state.currentFontSize}
                            />
                    </div>
                </div>
            </div>
        )
    }
});

const mapStateToProps = (state) => ({
    user: state.User.user
});



/////
export default  withRouter(connect(mapStateToProps, null)(MeetYou))
;
