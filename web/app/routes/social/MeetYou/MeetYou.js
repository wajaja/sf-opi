import React            from 'react';
import createReactClass from 'create-react-class';
import {connect}        from 'react-redux';
import {
    cacheDrawing, setText, setTextRect, 
    setFocus, setEditing, setNoFocus, 
    setNoEditing
}                   from '../../../actions/social/MeetYou';

import LeftSidebar  from './LeftSidebar';
import RightSidebar from './RightSidebar';
import ImageCanvas  from './components/ImageCanvas';

import '../../../styles/social/meetyou.scss'

const MeetYou = createReactClass({
    getInitialState() {
        return{
            textArr: []
        }
    },
    //
    updateDrawnImage(data) {
        if (this.props.drawing === data) return;
        this.props.onCacheDrawing(data);
    },

    updateTextArr(textArr){
        this.setState({
            textArr: textArr
        })
    },

    render() {
        const selectedUrl = this.props.selected && this.props.selected.url;
        const {text, textRect, textAttrs, filter, size} = this.props;
        return (
            <div className="MeetYou Container">
                <LeftSidebar 
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
                <div className="Main">
                    <ImageCanvas
                        image={selectedUrl}
                        textArr={this.state.textArr}
                        body={{
                            text, textAttrs,
                        }}
                        filter={filter}
                        size={size}
                        isFocused={this.props.focused}
                        isEditing={this.props.editing}
                        onFocus={this.props.onFocus}
                        onEdit={this.props.onEdit}
                        textArr={this.state.textArr}
                        onBlur={this.props.onBlur}
                        updateTextArr={this.updateTextArr}
                        onCancelEdit={this.props.onCancelEdit}
                        onTextRectMove={this.props.onTextRectMove}
                        onRedraw={this.updateDrawnImage}
                        onTextChange={this.props.onTextChange} />
                </div>
                <RightSidebar />
            </div>
        );
    }
});

const mapStateToProps = (state) => ({
    user: state.User.user,
    textAttrs: state.MeetYou.textAttrs,
    filter: state.MeetYou.filter,
    size: state.MeetYou.size,
    selected: state.MeetYou.selectedImage,
    drawing: state.MeetYou.drawing,
    text: state.MeetYou.text,
    focused: state.MeetYou.focused,
    editing: state.MeetYou.editing
});

const mapDispatchToProps = (dispatch) => ({
    onCacheDrawing(drawing) {
        dispatch(cacheDrawing(drawing));
    },

    onTextChange(text) {
        dispatch(setText(text));
    },

    onTextRectMove(part, rect) {
        dispatch(setTextRect(part, rect));
    },

    onFocus(part) {
        dispatch(setFocus(part));
    },

    onEdit() {
        dispatch(setEditing());
    },

    onBlur() {
        dispatch(setNoFocus());
    },

    onCancelEdit() {
        dispatch(setNoEditing());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(MeetYou);
