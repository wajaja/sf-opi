import React, { Fragment } from 'react';
import {connect} from 'react-redux';
import  createReactClass from 'create-react-class';
import {
    selectImage, searchImages, resetSearch, setQuery, loadBackgrounds
}                       from '../../../actions/social/MeetYou';
import { 
    Chat,
}                       from '../../../components'

import Card from './components/Card';
import SearchBar from './components/SearchBar';
import ImagePicker from './components/ImagePicker';
import TextPicker   from './DnD/TextPicker'
import ShapePicker  from './DnD/ShapePicker'
import BackgroundPicker from './components/BackgroundPicker'
import ModelSearch      from './components/ModelSearch'
import ModelPicker      from './components/ModelPicker'

const LeftSidebar = createReactClass({

    getInitialState() {
        return{

        }
    },

    render() {
        const { 
            access_token, query, availableImages, 
            selectedImage, pushEditor, onSearch, 
            onSearchReset, onQueryChange, availableBackgrounds, onLoadBackgrounds,
            leftPanel, onSelectImage, onSelectShape, selectedShape  } = this.props
        return (
            <div className="Sidebar">
                <Card className={`CardOpt ${leftPanel === 'text' ? ' active' : ''}  `} title="Images">
                    {leftPanel === 'text' && 
                        <Fragment>
                            <TextPicker
                                pushEditor={pushEditor} />
                        </Fragment>
                    }
                    {leftPanel === 'image' && 
                        <Fragment>
                            <SearchBar
                                query={query}
                                onSearch={onSearch}
                                onSearchReset={onSearchReset} />
                            <ImagePicker
                                type="image"
                                images={availableImages}
                                selected={selectedImage}
                                onSelect={onSelectImage} />
                        </Fragment>
                    }
                    {leftPanel === 'background' && 
                        <Fragment>
                            <BackgroundPicker
                                type="background"
                                onLoadBackgrounds={onLoadBackgrounds}
                                images={availableBackgrounds}
                                selected={selectedImage}
                                onSelect={onSelectImage} />
                        </Fragment>
                    }
                    {leftPanel === 'modele' && 
                        <Fragment>
                            <ModelSearch
                                query={query}
                                onSearch={onSearch}
                                onSearchReset={onSearchReset}
                                onQueryChange={onQueryChange} />
                            <ModelPicker
                                images={availableImages}
                                selected={selectedImage}
                                onSelect={onSelectImage} />
                        </Fragment>
                    }
                    {leftPanel === 'shape' && 
                        <Fragment>
                            <ShapePicker
                                selected={selectedShape}
                                onSelect={onSelectShape} />
                        </Fragment>
                    }
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

const mapStateToProps = (state) => {
    const meetYou = state.MeetYou.present;
    return {
        availableBackgrounds: meetYou.availableBackgrounds,
        availableImages: meetYou.availableImages,
        selected: meetYou.selectedImage,
        query: meetYou.query
    }
};

const mapDispatchToProps = (dispatch) => ({
    onSelectImage(image) {
        dispatch(selectImage(image));
    },

    onSelectShape(shape) {
        dispatch(selectShape(shape));
    },

    onSearch(query) {
        dispatch(searchImages(query));
    },

    onSearchReset() {
        dispatch(resetSearch());  //loadInitial Image
    },

    onLoadBackgrounds() {
        dispatch(loadBackgrounds());  //loadInitial Image
    },

    onQueryChange(query) {
        dispatch(setQuery(query));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftSidebar);
