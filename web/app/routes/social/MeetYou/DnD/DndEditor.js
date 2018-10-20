import React          from 'react';
import createReactClass     from 'create-react-class'
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode }    from 'react-dom';
import flow             from 'lodash/flow';
import TextEditor       from '../components/TextEditor';


const DndEditor  = createReactClass({

    getInitialState() {
        return {
            hover: false,
            width: 200,
            height: 60,
            x: this.props.index * 5,
            y: this.props.index * 5,
        }
    },

    render() {
        const {className, isDragging, selection, url, isHovered } = this.props

        const style = {
            display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
            border: "solid 1px #eee",
            background: "transparent",
            opacity: 0,
        };

        return  <TextEditor 
                    {...this.props}
                    cardId={this.props.cardId}
                    updateCardData={this.props.updateCardData}
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
                    editorRef={this.props.editorRef}


                    />
        
    }
})

export default DndEditor;