import React              from 'react';
import createReactClass   from 'create-react-class'
import Konva              from 'konva';
import { Stage, Layer, Transformer }   from 'react-konva'
import {
    Canvas, CanvasRect, 
    CanvasFilter, CanvasText, 
    CanvasImage, CanvasOutline, 
    CanvasLine}           from './Canvas';
import { 
  rectCenter, diffWithin
}                         from '../utils/pixels';
import Spinner            from './Spinner';
import TextBox            from './TextBox';
import computeDimensions  from './computeImageDimensions';
import loadImage          from './loadImage';
import textEditor         from '../utils/textEditor';
import PatternImage       from './PatternImage'
import RichTextCard       from './RichTextCard'

//const makeBlue = (alpha) => `rgba(87, 205, 255, ${alpha})`;

// const FILTERS = {
//   light_contrast: ['contrast', 0.35],
//   heavy_contrast: ['contrast', 0.65],
//   light_blur: ['blur', 15],
//   heavy_blur: ['blur', 40]
// };


class Handler extends React.Component {
    componentDidMount() {
        this.checkNode();
    }

    componentDidUpdate() {
        this.checkNode();
    }

    checkNode() {
        const stage = this.transformer.getStage();
        const { selectedShapeName } = this.props;
        const selectedNode = stage.findOne("." + selectedShapeName);
        if (selectedNode) {
            this.transformer.attachTo(selectedNode);
        } else {
            this.transformer.detach();
        }
        this.transformer.getLayer().batchDraw();
    }
    render() {
        return (
            <Transformer
                ref={node => {
                    this.transformer = node;
                }}
            />
        );
    }
}

////////////
const ImageCanvas = createReactClass({
    getInitialState() {
        this.textEditor = new textEditor();
        return { 
            selectedShapeName: "",
            selection: [null, null] 
        };
    },

    getCursors() {
        const {start, end} = this.textEditor;
        if (start === end) {
          return {cursor: start, cursor1: null, cursor2: null};
        } else {
          return {cursor: null, cursor1: start + 1, cursor2: end + 1};
        }
    },

    redraw() {
        this.forceUpdate();
    },

    updateCursor(e) {
        const {txt} = this.refs;
        const {selectionStart, selectionEnd} = txt;
        this.textEditor.setFromInput(selectionStart, selectionEnd);
        setTimeout(this.redraw, 0);
    },

    cancelEdit(e) {
        this.refs.bodyBox.cancelEdit(e);
        setTimeout(this.redraw, 0);
    },

    setNoFocus() {
        this.props.onBlur();
    },

    handleClickOnImage(e, mousePos) {
        this.setNoFocus();
    },    

    getGuideLines() {
        const {canvasWidth, canvasHeight} = this.props;

        const horizontal = [[0, canvasHeight / 2], [canvasWidth, canvasHeight / 2]];
        const vertical = [[canvasWidth / 2, 0], [canvasWidth / 2, canvasHeight]];

        return {horizontal, vertical};
    },

    closeToGuides(part) {
        const {canvasWidth, canvasHeight} = this.props;
        const {isFocused} = this.props;

        if (!isFocused) return { horizontal: false, vertical: false };

        const rect = this.props[part].textRect;

        const textCenter = rectCenter(rect);
        const canvasCenter = { x: canvasWidth/2, y: canvasHeight/2 };
        const {xWithin: vertical, yWithin: horizontal} = diffWithin(canvasCenter, textCenter, {x: 1, y: 1});

        return {horizontal, vertical};
    },

    updateTextArr(textArr){
        this.props.updateTextArr(textArr);
    },

    handleStageClick(e){
        console.log('handleStageClick');
        this.setState({
            selectedShapeName: e.target.name()
        });
    },

    render() {
        //////////
        const {canvasWidth, canvasHeight} = this.props;
        const {filter, isFocused, textsArr} = this.props;
        const {image} = this.props;
        const {text} = this.props.body;
        const mainFrame = [0, 0, canvasWidth, canvasHeight];

        if(!this.props.cards.length) {
            return <div />
        }

        console.log(this.props.cards[0]);
        const { background, node, editorState, size, x, y, id, type, shapes, defaultStyle } = this.props.cards[0];
        ///allways call redraw function
        return(
            <Stage
                width={canvasWidth}
                height={canvasHeight}
                onClick={this.handleStageClick}>
                <Layer
                    x={0}
                    y={0}
                    width={canvasWidth}
                    height={canvasHeight}>
                    {type === 'richtext' && 
                        <RichTextCard
                            x={x}
                            y={y}
                            id={id}
                            size={size}
                            node={node}
                            type="richtext"
                            shapes={shapes}
                            background={background}
                            editorState={editorState}
                            defaultStyle={defaultStyle}
                            editing={this.props.editing}
                            selectedCardId={this.props.selectedCardId}
                            moveRect={this.props.onTextRectMove.bind(this)}
                            textAttrs={this.props.body.textAttrs}
                            isEditing={this.props.editedCard === 0} />
                    }
                    {type === 'patternImage' && 
                        <PatternImage
                             />
                    }
                    <Handler selectedShapeName={this.state.selectedShapeName} />          
                </Layer>
            </Stage>
        )
    }
});

export default ImageCanvas;
// <Filter name={filter} frame={mainFrame} />
// {this.props.cards.map && this.props.cards.map((card, i) => {
// if(card.type === 'image') 
//     return <CanvasImage 
//               image={card}
//               onMouseDown={this.handleClickOnImage} />
// else if(card.type === 'text')
//     return <CanvasText
//               ref="bodyBox"
//               part="body"
//               cancelEditing={this.props.onCancelEdit}
//               setEditing={this.props.onEdit}
//               setFocus={this.props.onFocus.bind(this, 'body')}
//               moveRect={this.props.onTextRectMove.bind(this)}
//               textAttrs={this.props.body.textAttrs}
//               textArr={card.textArr}
//               text={this.props.body.text}
//               selection={this.getCursors()}
//               onAreaSelection={(start, end) => { this.textEditor.setSelection(start, end, this.refs.txt); this.forceUpdate(); }}
//               onSetCursor={(pos) => { this.textEditor.setCursor(pos, this.refs.txt); this.forceUpdate(); }}
//               onEditEnter={() => this.refs.txt.focus()}
//               focusedPart={this.props.isFocused}
//               isEditing={this.props.isEditing} />
// })}  
// else if(card.type === 'edittext' && this.props.saved === true)
//     return <TextBox
//               ref="bodyBox"
//               part="body"
//               cancelEditing={this.props.onCancelEdit}
//               setEditing={this.props.onEdit}
//               setFocus={this.props.onFocus.bind(this, 'body')}
//               moveRect={this.props.onTextRectMove.bind(this)}
//               textAttrs={this.props.body.textAttrs}
//               textArr={card.textArr}
//               text={this.props.body.text}
//               selection={this.getCursors()}
//               onAreaSelection={(start, end) => { this.textEditor.setSelection(start, end, this.refs.txt); this.forceUpdate(); }}
//               onSetCursor={(pos) => { this.textEditor.setCursor(pos, this.refs.txt); this.forceUpdate(); }}
//               onEditEnter={() => this.refs.txt.focus()}
//               focusedPart={this.props.isFocused}
//               isEditing={this.props.isEditing} />
// })}  