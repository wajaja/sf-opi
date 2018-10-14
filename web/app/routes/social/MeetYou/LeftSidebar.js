import React from 'react';
import {connect} from 'react-redux';
import  createReactClass from 'create-react-class';
import {
    selectImage, searchImages, resetSearch, setQuery
}                       from '../../../actions/social/MeetYou';
import { 
    Chat,
}                       from '../../../components'

import Card from './components/Card';
import SearchBar from './components/SearchBar';
import ImagePicker from './components/ImagePicker';

const LeftSidebar = createReactClass({

    getInitialState() {
        return{

        }
    },

    render() {
        const { 
            access_token, query, availableImages, 
            selectedImage, onSelectImage, onSearch, 
            onSearchReset, onQueryChange,
            leftPanel } = this.props
        return (
            <div className="Sidebar">
                <Card title="Images">
                    <SearchBar
                        query={query}
                        onSearch={onSearch}
                        onSearchReset={onSearchReset}
                        onQueryChange={onQueryChange} />
                    <ImagePicker
                        images={availableImages}
                        selected={selectedImage}
                        onSelect={onSelectImage} />
                </Card>
                {access_token && 
                    <div id="_8" className="online_8">
                        <Chat 
                            user={this.props.user}
                            history={this.props.history}
                            auth_data={this.props.auth_data}
                            dispatch={this.props.dispatch}
                            access_token={access_token}
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
                    </div>
                }
            </div>
        )
    }
})

const mapStateToProps = (state) => ({
    availableImages: state.MeetYou.availableImages,
    selected: state.MeetYou.selectedImage,
    query: state.MeetYou.query
});

const mapDispatchToProps = (dispatch) => ({
    onSelectImage(image) {
        dispatch(selectImage(image));
    },

    onSearch(query) {
        dispatch(searchImages(query));
    },

    onSearchReset() {
        dispatch(resetSearch());
    },

    onQueryChange(query) {
        dispatch(setQuery(query));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftSidebar);
