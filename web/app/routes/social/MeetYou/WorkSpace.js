import React, { Fragment } from 'react';
import createReactClass    from 'create-react-class'
import Spinner             from './components/Spinner';
import computeDimensions   from './components/computeImageDimensions';
import ImageCanvas          from './components/ImageCanvas';
import Container        from './DnD/Container'
import { fromJS }       from 'immutable'
import { connect }          from 'react-redux'

//import { getLSItem } from '../utils/localStorage';

import {
    cacheDrawing, setText, setTextRect, 
    setFocus, setEditing, setNoFocus, 
    setNoEditing
}                   from '../../../actions/social/MeetYou';

const _Page = createReactClass({
    getInitialState() {
        return {
            images: [],
            textAttrs: this.props.textAttrs,
            filter: this.props.filter,
            size: this.props.size,
            drawing: this.props.drawing,
            text: this.props.text,
            focused: this.props.focused,
            editing: this.props.editing,
        }
    },

    redraw() {
        this.forceUpdate();
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

    moveImage(dragId, hoverId) {
        const { images } = this.state;
        const dragIndex = images.findIndex(el => el.id === dragId);
        const hoverIndex = images.findIndex(el => el.id === hoverId);
        const dragCardOrder = images[dragIndex].order;
        const hoverCardOrder = images[hoverIndex].order;

        this.setState(
            update(this.state, {
                images: {
                  [dragIndex]: { order: { $set: hoverCardOrder } },
                  [hoverIndex]: { order: { $set: dragCardOrder } }
                }
            })
        );
    },

    onCardDragStart(changes) {
        this.setState({
            ...this.state,
            ...changes
        });
    },

    onCardMove(changes) {
        this.setState({
            ...this.state,
            ...changes
        });
    },

    onCardDragComplete(changes){
        this.setState({
            ...this.state,
            ...changes
        });
    },

    render() {
        const {canvasWidth, canvasHeight} = this.props;
        return(
            <Fragment>
                <div 
                    className="page-b"
                    style={{
                        width: canvasWidth + 'px',
                        height: canvasHeight + 'px'
                    }}>
                    <ImageCanvas
                      canvasWidth={canvasWidth}
                      canvasHeight={canvasHeight}
                      image={this.props.selectedUrl}
                      textArr={this.props.textArr}
                      cards={this.props.cards}
                      body={{
                          text: this.props.text, 
                          textAttrs: this.props.text,
                      }}
                      filter={this.props.filter}
                      size={this.props.size}
                      isFocused={this.props.isFocused}
                      onFocus={this.props.onFocus}
                      onEdit={this.props.onEdit}
                      textArr={this.props.textArr}
                      onBlur={this.props.onBlur}
                      updateTextArr={this.props.updateTextArr}
                      onCancelEdit={this.props.onCancelEdit}
                      onTextRectMove={this.props.onTextRectMove}
                      onRedraw={this.props.onRedraw}
                      isEditing={this.props.isEditing}
                      editedCardId={this.props.editedCardId}
                      editRichText={this.props.editRichText}
                      updateRichText={this.props.updateRichText}
                      onTextChange={this.props.onTextChange} 
                      updateCardPos={this.props.updateCardPos}
                      updateCardSize={this.props.updateCardSize}
                      updateSelectedShape={this.props.updateSelectedShape}
                      />
                </div>
            </Fragment>
        )
    }
});

/////
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

const mapStateToProps = (state, ownProps) => {
    const meetYou = state.MeetYou.present,
    page = meetYou.pages 
           ? meetYou.pages[ownProps.pageId] 
           : {
                size: 'wide',
                drawing: false,
                focused: false,
                editing: false
           };
    return {
        page: page,
        textAttrs: meetYou.textAttrs,
        filter: meetYou.filter,
    }
};


const Page = connect(mapStateToProps, mapDispatchToProps)(computeDimensions(_Page))


/////
class WorkSpace extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            pages: [
                {
                    data: {}
                }
            ]
        }
    }

    render() {
        return(
            <Fragment>
                {this.state.pages.map && this.state.pages.map((page, i) => {
                    return(
                        <Fragment key={i}>
                            <div  className="page-a">
                                <Page 
                                    pageId={i}
                                    data={page.data}
                                    {...this.props}
                                    onCardSelectionChange={this.props.onCardSelectionChange }
                                    customStylesUtils={this.props.customStylesUtils}
                                    currentColor={this.props.currentColor}
                                    setCurrentColor={this.props.setCurrentColor}
                                    colorHandle={this.props.colorHandle}
                                    setCurrentBoldState={this.props.setCurrentBoldState}
                                    setCurrentItalicState={this.props.setCurrentItalicState}
                                    setCurrentUnderlineState={this.props.setCurrentUnderlineState}
                                    // switchColorHandle={switchColorHandle}
                                    setCurrentFontSize={this.props.setCurrentFontSize}
                                    hasEditorFocus={this.props.editorFocus}
                                    setEditorFocus={this.props.setEditorFocus}
                                    editorState={this.props.editorState}
                                    setEditorState={this.props.setEditorState}
                                    editorBackground={this.props.editorBackground}
                                    setEditorBackground={this.props.setEditorBackground}
                                    setCurrentFontFamily={this.props.setCurrentFontFamily}
                                    currentFontFamily={this.props.currentFontFamily}
                                    setEditorRef={this.props.setEditorRef}
                                    editorRef={this.props.editorRef}

                                    currentItalicState={this.props.currentItalicState}
                                    currentBoldState={this.props.currentBoldState}
                                    currentFontSize={this.props.currentFontSize}

                                    updateCardPos={this.props.updateCardPos}
                                    updateCardSize={this.props.updateCardSize}

                                    isEditing={this.props.isEditing}
                                    editedCardId={this.props.editedCardId}
                                    editRichText={this.props.editRichText}
                                    updateRichText={this.props.updateRichText}
                                    updateSelectedShape={this.props.updateSelectedShape}
                                    />
                            </div>
                        </Fragment>
                    )
                })}
                ////////////
                {!!this.props.editing && 
                    <Container
                        {...this.props}
                        editedCardId={this.props.editedCardId}
                        pageId={this.props.pageId}
                        filter={this.props.filter}
                        images={this.props.images}
                        cards={this.props.cards}
                        zoneWidth={600}
                        zoneHeight={500}
                        moveImage={this.props.moveImage}
                        onCardSelectionChange={this.props.onCardSelectionChange }
                        updateEditorCard={this.props.updateEditorCard}
                        textEditors={this.props.textEditors}
                        setCurrentBoldState={this.props.setCurrentBoldState}
                        setCurrentItalicState={this.props.setCurrentItalicState}
                        setCurrentUnderlineState={this.props.setCurrentUnderlineState}

                        customStylesUtils={this.props.customStylesUtils}
                        currentColor={this.props.currentColor}
                        setCurrentColor={this.props.setCurrentColor}
                        colorHandle={this.props.colorHandle}
                        // switchColorHandle={switchColorHandle}
                        setCurrentFontSize={this.props.setCurrentFontSize}
                        hasEditorFocus={this.props.editorFocus}
                        setEditorFocus={this.props.setEditorFocus}
                        editorState={this.props.editorState}
                        setEditorState={this.props.setEditorState}
                        editorBackground={this.props.editorBackground}
                        setEditorBackground={this.props.setEditorBackground}
                        setCurrentFontFamily={this.props.setCurrentFontFamily}
                        currentFontFamily={this.props.currentFontFamily}
                        setEditorRef={this.props.setEditorRef}
                        selectedCardId={this.props.selectedCardId}
                        editorRef={this.props.editorRef}/>
                }
            </Fragment>
        )
    }
}


export default WorkSpace;