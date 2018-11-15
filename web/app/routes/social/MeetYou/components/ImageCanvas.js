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
            anchorStroke='#0294a5' //#0e161d
            anchorFill='#ffffff'
            anchorSize={12}     //12
            borderStroke='#0294a5' //#0e161d
            centeredScaling={selectedType === `patternImage`}
            anchorStrokeWidth={1}
            borderStrokeWidth={.2}
            rotateAnchorOffset={23}
            resizeEnabled={selectedType !== 'richtext'} //disable resize on richtext
        />
    );
  }
}

////////////
const ImageCanvas = createReactClass({
    getInitialState() {
        this.textEditor = new textEditor();

        const {canvasWidth, canvasHeight} = this.props;
        
        return { 
            selectedShapeName: "",
            selection: [null, null],
            centerPoints: [
                {
                    point: [Math.round((canvasWidth/2)) + 0.5, 0, Math.round((canvasWidth/2)) + 0.5, canvasHeight]
                },
                {
                    point: [0, Math.round((canvasHeight/2)), canvasWidth, Math.round((canvasHeight/2))]
                }
            ] 
        };
    },

    componentDidMount() {
        this.gridLayer.hide();
    },

    redraw() {
        this.forceUpdate();
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

        let name;
        // find clicked rect by its name
        const parent = e.target.getParent();
        if(parent.nodeType === 'Group')
            name = parent.name();
        else
           name = e.target.name();
       
        const rect = this.props.cards.find(r => r.name === name);
        console.log(rect, name);
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

    handleStageKeyDown(e) {
        const evt = e.evt,
        DELTA = 4,
        { selectedShape } = this.state;
        if(selectedShape) {
            if (evt.keyCode === 37) {
                this.updateCardPos(selectedShape.id, {
                    x: selectedShape.x - DELTA,
                    y: selectedShape.y
                })
            } else if (evt.keyCode === 38) {
                circle.y(circle.y() - DELTA);
                this.updateCardPos(selectedShape.id, {
                    x: selectedShape.x,
                    y: selectedShape.y - DELTA
                })
            } else if (evt.keyCode === 39) {
                circle.x(circle.x() + DELTA);
                this.updateCardPos(selectedShape.id, {
                    x: selectedShape.x + DELTA,
                    y: selectedShape.y
                })
            } else if (evt.keyCode === 40) {
                circle.y(circle.y() + DELTA);
                this.updateCardPos(selectedShape.id, {
                    x: selectedShape.x,
                    y: selectedShape.y + DELTA
                })
            } else {
                return;
            }
        }
        evt.preventDefault();
    },

    handleDragStart(x, y, type) {
        this.gridLayer.show();
        // this.setState({
        //     dragStart: true
        // })
    },

    handleDragMove(x, y, type) {
        //TODO:: show other lines
        // if (!e.evt.shiftKey) { return; }
        // const pos = e.target.getStage().getPointerPosition();
        // const x = roundBy(pos.x, gridSize);
        // const y = roundBy(pos.y, gridSize);
        // e.target.position({x, y});
    },

    handleDragEnd() {
        this.gridLayer.hide();
        // this.setState({
        //     dragStart: true
        // })
    },

    componentDidUpdate(oldProps, oldState) {
        if(this.props.cards !== oldProps.cards) {
            // save stage as a json string
            // var json = stage.toJSON();
            //Save in localStorage
            // if(this.props.user && this.props.user.id) {
            //     const item = 'meetyou_' + this.props.user.id;
            //     this.saveStateToLS(item);
            // } else {
            //     const item = 'meetyou_' + 'default';
            //     this.saveStateToLS(item);
            // }
        }
    },

    render() {
        //////////
        const {canvasWidth, canvasHeight} = this.props;
        const {filter, isFocused, textsArr} = this.props;

        if(!this.props.cards.length) {
            return <div />
        }
        ///allways call redraw function
        return(
            <Stage
                width={canvasWidth}  // + 200
                height={canvasHeight} // + 200
                onKeyDown={this.handleStageKeyDown}
                onMouseDown={this.handleStageMouseDown}>
                <Layer
                    x={0}
                    y={0}
                    width={canvasWidth}
                    height={canvasHeight}>
                    {this.props.cards.map && this.props.cards.map((card, i) => {
                        if(card.type === 'image') 
                            return <CanvasImage 
                                      key={i}
                                      // image={card}
                                      {...card}
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
                                      scaleX={card.scaleX}
                                      scaleY={card.scaleY}
                                      rotation={card.rotation}
                                      handleDragEnd={this.handleDragEnd}
                                      handleDragMove={this.handleDragMove}
                                      handleDragStart={this.handleDragStart}
                                      updateCardPos={this.props.updateCardPos}
                                      updateCardSize={this.props.updateCardSize}
                                      onMouseDown={this.handleClickOnImage} />

                        else if(card.type === 'richtext')
                            return <RichTextCard
                                        key={i}
                                        {...card}
                                        x={card.x}
                                        y={card.y}
                                        id={card.id}
                                        type="richtext"
                                        size={card.size}
                                        node={card.node}
                                        image={card.image}
                                        name={card.type + card.id} //richtext1
                                        shapes={card.shapes}
                                        scaleX={card.scaleX}
                                        scaleY={card.scaleY}
                                        rotation={card.rotation}
                                        editing={this.props.editing}
                                        background={card.background}
                                        handleDragEnd={this.handleDragEnd}
                                        handleDragMove={this.handleDragMove}
                                        handleDragStart={this.handleDragStart}
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
                                        {...card}
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
                                        scaleX={card.scaleX}
                                        scaleY={card.scaleY}
                                        rotation={card.rotation}
                                        handleDragEnd={this.handleDragEnd}
                                        handleDragMove={this.handleDragMove}
                                        handleDragStart={this.handleDragStart}
                                        onMouseDown={this.handleClickOnImage}
                                        updateCardPos={this.props.updateCardPos}
                                        updateCardSize={this.props.updateCardSize}
                                        />
                        else if(card.type === 'shape')
                            return <CustomShape
                                        key={i}
                                        {...card}
                                        x={card.x}
                                        y={card.y}
                                        id={card.id}
                                        type={card.type}
                                        name={card.name}
                                        width={card.width}
                                        height={card.height}
                                        filter={card.filter}
                                        scaleX={card.scaleX}
                                        scaleY={card.scaleY}
                                        rotation={card.rotation}
                                        handleDragEnd={this.handleDragEnd}
                                        handleDragMove={this.handleDragMove}
                                        handleDragStart={this.handleDragStart}
                                        //onMouseDown={this.handleClickOnImage}
                                        updateCardPos={this.props.updateCardPos}
                                        updateCardSize={this.props.updateCardSize}
                                        />
                        else if(card.type === 'vectorImage')
                            return <VectorImage
                                        key={i}
                                        {...card}
                                        x={card.x}
                                        y={card.y}
                                        id={card.id}
                                        type={card.type}
                                        name={card.name}
                                        width={card.width}
                                        height={card.height}
                                        filter={card.filter}
                                        scaleX={card.scaleX}
                                        scaleY={card.scaleY}
                                        rotation={card.rotation}
                                        originalData={card.data}
                                        childs={card.data.childs}
                                        handleDragEnd={this.handleDragEnd}
                                        handleDragMove={this.handleDragMove}
                                        handleDragStart={this.handleDragStart}
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
                <Layer
                    x={0}
                    y={0}
                    width={canvasWidth}
                    height={canvasHeight}
                    ref={el => this.gridLayer = el} >
                    {this.state.centerPoints.map((line, i) => {
                        return <Line 
                                  key={i}
                                  points={line.point}
                                  stroke="#red"
                                  strokeWidth={1}
                                  />
                    })}         
                </Layer>
            </Stage>
        )
    }
});

export default ImageCanvas;