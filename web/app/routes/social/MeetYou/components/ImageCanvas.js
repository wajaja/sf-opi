import React              from 'react';
import createReactClass   from 'create-react-class'
import Konva              from 'konva';
import ReactDOM           from 'react-dom';
import { Stage, Layer }   from 'react-konva'
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
import TextEditor         from './TextEditor'

import textEditor from '../utils/textEditor';

const makeBlue = (alpha) => `rgba(87, 205, 255, ${alpha})`;

const FILTERS = {
  light_contrast: ['contrast', 0.35],
  heavy_contrast: ['contrast', 0.65],
  light_blur: ['blur', 15],
  heavy_blur: ['blur', 40]
};

// TODO: make this work & use this
const ControlledTextarea = createReactClass({
  componentDidMount() {
    const txt = ReactDOM.findDOMNode(this);
    const [start, end] = this.props.selection;
    txt.setSelectionRange(start, end);
  },

  componentWillReceiveProps(nextProps) {
    const txt = ReactDOM.findDOMNode(this);
    const [start, end] = nextProps.selection;
    txt.setSelectionRange(start, end);
  },

  handleSelect(e) {
    const {selectionStart, selectionEnd} = e.target;
    if (this._focusing !== true) {
      this.props.onSelect(selectionStart, selectionEnd);
    }
    this.select();
    this._focusing = false;
    e.preventDefault();
    e.stopPropagation();
  },

  select(e) {
    this._focusing = true;
    const txt = ReactDOM.findDOMNode(this);
    const [start, end] = this.props.selection;
    txt.setSelectionRange(start, end);
  },

  render() {
    const {selection, onSelect, ...rest} = this.props;
    return <textarea onSelect={this.handleSelect} onFocus={this.select} {...rest} />;
  }
});

// const Filter = ({ name: humanName, frame }) => {
//   const [name, value] = FILTERS[humanName];
//   return <CanvasFilter filter={name} value={value} frame={frame} />;
// };

const ImageCanvas = createReactClass({
  getInitialState() {
    this.textEditor = new textEditor();
    return { selection: [null, null] };
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


  render() {
    if (!this.props.image) {
      return <div className="ImageCanvas">
        <Spinner />
      </div>;
    }
    //////////
    const {canvasWidth, canvasHeight} = this.props;
    const {filter, isFocused, textsArr} = this.props;
    const {image} = this.props;
    const {text} = this.props.body;
    const mainFrame = [0, 0, canvasWidth, canvasHeight];

    const {horizontal: horizontalGuideLine, vertical: verticalGuideLine} = this.getGuideLines();
    const {horizontal: showHorizontalGuide, vertical: showVerticalGuide} = isFocused ? this.closeToGuides(isFocused) : {};

    return <div className="ImageCanvas">
        <Stage
            ref="canvas"
            width={canvasWidth}
            height={canvasHeight}
            onRedraw={this.props.onRedraw}>
            <Layer>
                <CanvasImage image={image} frame={mainFrame} onMouseDown={this.handleClickOnImage} />
                  <TextBox
                    ref="bodyBox"
                    part="body"
                    cancelEditing={this.props.onCancelEdit}
                    setEditing={this.props.onEdit}
                    setFocus={this.props.onFocus.bind(this, 'body')}
                    moveRect={this.props.onTextRectMove.bind(this)}
                    textAttrs={this.props.body.textAttrs}
                    textArr={this.props.textArr}
                    text={this.props.body.text}
                    selection={this.getCursors()}
                    onAreaSelection={(start, end) => { this.textEditor.setSelection(start, end, this.refs.txt); this.forceUpdate(); }}
                    onSetCursor={(pos) => { this.textEditor.setCursor(pos, this.refs.txt); this.forceUpdate(); }}
                    onEditEnter={() => this.refs.txt.focus()}
                    focusedPart={this.props.isFocused}
                    isEditing={this.props.isEditing} />
            </Layer>
        </Stage>
      <TextEditor
        ref="txt"
        updateTextArr={this.updateTextArr}
        />
    </div>
  }
});

export default computeDimensions(loadImage(ImageCanvas));
                  // <Filter name={filter} frame={mainFrame} />