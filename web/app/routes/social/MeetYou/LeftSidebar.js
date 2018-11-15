import React, { Fragment } from 'react';
import {connect} from 'react-redux';
import  createReactClass from 'create-react-class';
import {
    selectImage, searchImages, resetSearch, setQuery, loadBackgrounds, addCard
}                       from '../../../actions/social/MeetYou';
import { 
    Chat,
}                       from '../../../components'

import Card             from './components/Card';
import SearchBar        from './components/SearchBar';
import ImagePicker      from './components/ImagePicker';
import TextPicker       from './DnD/TextPicker'
import ShapePicker      from './DnD/ShapePicker'
import BackgroundPicker from './components/BackgroundPicker'
import ModelSearch      from './components/ModelSearch'
import ModelPicker      from './components/ModelPicker'
import PathPicker       from './components/PathPicker'
import { SIZES }        from './components/computeImageDimensions'
import convertImgToBase64URL from './utils/imgToBase64URL'
const svgData = require('./utils/svgImages').default

const LeftSidebar = createReactClass({

    getInitialState() {
        return{

        }
    },

    render() {
        const { 
            access_token, query, availableImages, 
            selectedImage, pushEditor, onSearch, onSelectVector,
            onSearchReset, onQueryChange, availableBackgrounds, onLoadBackgrounds,
            leftPanel, onSelectImage, onSelectShape, selectedShape, onSelectBackground  } = this.props
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
                                type={leftPanel}
                                onSearch={onSearch}
                                onSearchReset={onSearchReset}
                                onLoadBackgrounds={onLoadBackgrounds} />
                            <ImagePicker
                                type="image"
                                images={availableImages}
                                onSelect={onSelectImage} />
                        </Fragment>
                    }
                    {leftPanel === 'fill' && 
                        <Fragment>
                            <SearchBar
                                query={query}
                                type={leftPanel}
                                onSearch={onSearch}
                                onSearchReset={onSearchReset}
                                onLoadBackgrounds={onLoadBackgrounds} />
                            <BackgroundPicker
                                type="background"
                                onLoadBackgrounds={onLoadBackgrounds}
                                images={availableBackgrounds}
                                selected={selectedImage}
                                onSelect={onSelectBackground} />
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
                                handleSelect={onSelectShape} />
                        </Fragment>
                    }
                    {leftPanel === 'path' && 
                        <Fragment>
                            <PathPicker
                                datas={svgData}
                                selected={selectedShape}
                                handleSelect={onSelectVector} />
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

////////////
const mapDispatchToProps = (dispatch, ownProps) => {
    let nextId = ownProps.cards.length,
    initialFilterVal = 0,             //256 defined in FilterPiker as max range
    selectedPage= ownProps.selectedPage,
    size = SIZES[ownProps.page.size]; //[300, 400]
    return {
        onSelectImage(image) {
            convertImgToBase64URL(image.url, function(base64Img) {
                dispatch(
                    addCard({
                        x: 20,
                        y: (size[1] - (160 / 2)), //400 - 160 / 2
                        scaleX: 1,
                        scaleY: 1,
                        red: initialFilterVal,
                        green: initialFilterVal,
                        blue: initialFilterVal,
                        alpha: initialFilterVal,
                        contrast: initialFilterVal,
                        rotation: 0,
                        width: 200,  //TODO 
                        height: 160,
                        size:{
                            width: undefined,
                            height: undefined,
                        },
                        transparency: 20,
                        filter: 'editorState',
                        id: nextId,
                        stroke: "transparent",
                        strokeWidth: 1,
                        type: 'image',  
                        name: 'image' + nextId,
                        tag: image.tag,
                        url: base64Img
                    }, selectedPage)
                );
            }, 'image/png'); //output format
        },
        /////////
        onSelectVector(data) {
            dispatch(
                addCard({
                    x: 120,
                    y: 50, //400 - 160 / 2
                    id: nextId,
                    scaleX: 1,
                    scaleY: 1,
                    rotation: 0,
                    width: 200,  //TODO 
                    height: 160,
                    size:{
                        width: 200,
                        height: 160,
                    },
                    transparency: 20,
                    stroke: "transparent",
                    strokeWidth: 1,
                    filter: 'null',
                    type: 'vectorImage',  
                    name: 'vectorImage' + nextId,
                    data: data
                }, selectedPage)
            );
        },

        //patterImage
        onSelectBackground(image) {
            convertImgToBase64URL(image.url, function(base64Img){
                dispatch(
                    addCard({
                        x: -20,
                        y: -50, //(size[1] - (160 / 2)), //400 - 160 / 2
                        scaleX: 1,
                        scaleY: 1,
                        id: nextId,
                        red: initialFilterVal,
                        green: initialFilterVal,
                        blue: initialFilterVal,
                        alpha: initialFilterVal,
                        contrast: initialFilterVal,
                        rotation: 0,
                        width: 200,  //TODO 
                        height: size[1],
                        size:{
                            width: 200,
                            height: size[1],
                        },
                        transparency: 20,
                        stroke: "transparent",
                        strokeWidth: 1,
                        filter: 'editorState',
                        type: 'patternImage',  
                        name: 'patternImage' + nextId,
                        tag: image.tag,
                        url: base64Img
                    }, selectedPage)
                );
            }, 'image/png'); //output format
        },

        onSelectShape(shape) {
            console.log('selected shape', shape)
            dispatch(
                addCard({
                    x: 20,
                    y: (size[1] - (160 / 2)), //400 - 160 / 2
                    id: nextId,
                    scaleX: 1,
                    scaleY: 1,
                    rotation: 0,
                    type: 'shape',  
                    name: 'shape' + nextId,
                    stroke: "transparent",
                    strokeWidth: 1,
                     ...shape
                }, selectedPage)
            );
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftSidebar);
