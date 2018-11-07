import React              from 'react';
import createReactClass   from 'create-react-class'
import Konva              from 'konva';
import { Stage, Layer, Transformer, Shape, Circle, Rect, Ellipse, Star }   from 'react-konva'
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
import loadImage          from './loadImage';
import textEditor         from '../utils/textEditor';
import PatternImage       from './PatternImage'
import RichTextCard       from './RichTextCard'
import CustomShape        from './CustomShape'
import VectorImage        from './VectorImage'
//const makeBlue = (alpha) => `rgba(87, 205, 255, ${alpha})`;

// const FILTERS = {
//   light_contrast: ['contrast', 0.35],
//   heavy_contrast: ['contrast', 0.65],
//   light_blur: ['blur', 15],
//   heavy_blur: ['blur', 40]
// };





class TransformerComponent extends React.Component {
  componentDidMount() {
    this.checkNode();
  }
  componentDidUpdate() {
    this.checkNode();
  }
  checkNode() {
    // here we need to manually attach or detach Transformer node
    const stage = this.transformer.getStage();
    const { selectedShapeName } = this.props;

    const selectedNode = stage.findOne('.' + selectedShapeName);
    // do nothing if selected node is already attached
    if (selectedNode === this.transformer.node()) {
      return;
    }

    if (selectedNode) {
      // attach to another node
      this.transformer.attachTo(selectedNode);
    } else {
      // remove transformer
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }
  render() {
    const { selectedShapeName, selectedType } = this.props
    return (
        <Transformer
            ref={node => {
                this.transformer = node;
            }}
            anchorStroke='#d8e3ec' //#0e161d
            anchorFill='transparent'
            anchorSize={12}     //12
            borderStroke='#0e161d' //#0e161d
            centeredScaling={selectedType === `patternImage`}
            anchorStrokeWidth={1}
            borderStrokeWidth={.2}
            rotateAnchorOffset={20}
            resizeEnabled={selectedType !== 'richtext'} //disable resize on richtext
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

    handleStageMouseDown(e){
        // clicked on stage - cler selection
        console.log('handleStageMouseDown');
        if (e.target === e.target.getStage()) {
            this.setState({
                selectedShapeName: ''
            });
            this.props.updateSelectedShape(null)
            return;
        }
        // clicked on transformer - do nothing
        const clickedOnTransformer = e.target.getParent().className === 'Transformer';
        if (clickedOnTransformer) {
            return;
        }

        // find clicked rect by its name
        const name = e.target.name();
        const rect = this.props.cards.find(r => r.name === name);
        if (rect) {
          this.setState({
            selectedShapeName: name,
            selectedType: rect.type
          });
          this.props.updateSelectedShape(rect)
        } else {
          this.setState({
            selectedShapeName: '',
            selectedType: ''
          });
          this.props.updateSelectedShape(null)
        }
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
        ///allways call redraw function
        return(
            <Stage
                width={canvasWidth}  // + 200
                height={canvasHeight} // + 200
                onMouseDown={this.handleStageMouseDown}>
                <Layer
                    x={0}
                    y={0}
                    width={canvasWidth}
                    height={canvasHeight}>
                    {this.props.cards.map && this.props.cards.map((card, i) => {
                        console.log('iterate ....', i)
                        if(card.type === 'image') 
                            return <CanvasImage 
                                      key={i}
                                      // image={card}
                                      id={card.id}
                                      url={card.url}
                                      tags={card.tags}
                                      size={card.size}
                                      type={card.type}
                                      name={card.name}
                                      width={card.width}
                                      height={card.height}
                                      filter={card.filter}
                                      updateCardPos={this.props.updateCardPos}
                                      updateCardSize={this.props.updateCardSize}
                                      onMouseDown={this.handleClickOnImage} />

                        else if(card.type === 'richtext')
                            return <RichTextCard
                                        key={i}
                                        x={card.x}
                                        y={card.y}
                                        id={card.id}
                                        type="richtext"
                                        size={card.size}
                                        node={card.node}
                                        image={card.image}
                                        name={card.type + card.id} //richtext1
                                        shapes={card.shapes}
                                        editing={this.props.editing}
                                        background={card.background}
                                        editorState={card.editorState}
                                        defaultStyle={card.defaultStyle}
                                        textAttrs={this.props.body.textAttrs}
                                        editRichText={this.props.editRichText}
                                        updateCardPos={this.props.updateCardPos}
                                        updateCardSize={this.props.updateCardSize}
                                        selectedCardId={this.props.selectedCardId}
                                        moveRect={this.props.onTextRectMove.bind(this)}
                                        isEditing={this.props.editedCardId === card.id} />

                        else if(card.type === 'patternImage')
                            return <PatternImage
                                        key={i}
                                        x={card.x}
                                        y={card.y}
                                        id={card.id}
                                        url={card.url}
                                        tags={card.tags}
                                        size={card.size}
                                        type={card.type}
                                        name={card.name}
                                        width={card.width}
                                        height={card.height}
                                        filter={card.filter}
                                        onMouseDown={this.handleClickOnImage}
                                        updateCardPos={this.props.updateCardPos}
                                        updateCardSize={this.props.updateCardSize}
                                        />
                        else if(card.type === 'shape')
                            return <CustomShape
                                        key={i}
                                        x={card.x}
                                        y={card.y}
                                        id={card.id}
                                        type={card.type}
                                        name={card.name}
                                        width={card.width}
                                        height={card.height}
                                        filter={card.filter}
                                        //onMouseDown={this.handleClickOnImage}
                                        updateCardPos={this.props.updateCardPos}
                                        updateCardSize={this.props.updateCardSize}
                                        {...card}
                                        />
                        else if(card.type === 'vectorImage')
                            return <VectorImage
                                        key={i}
                                        x={card.x}
                                        y={card.y}
                                        id={card.id}
                                        type={card.type}
                                        name={card.name}
                                        width={card.width}
                                        height={card.height}
                                        filter={card.filter}
                                        originalData={card.data}
                                        childs={card.data.childs}
                                        viewBox={card.data.attrs.viewBox}
                                        //onMouseDown={this.handleClickOnImage}
                                        updateCardPos={this.props.updateCardPos}
                                        updateCardSize={this.props.updateCardSize}
                                        />
                    })}
                    <TransformerComponent 
                        selectedShapeName={this.state.selectedShapeName}
                        selectedType={this.state.selectedType} />          
                </Layer>
            </Stage>
        )
    }
});

export default ImageCanvas;