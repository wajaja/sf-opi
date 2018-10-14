import React        from 'react';
import createReactClass   from 'create-react-class'
import PropTypes    from 'prop-types';
import {
    CanvasRect, 
    CanvasText, 
    CanvasDraggableImage,
    CanvasOutline,
    CanvasGroup
}                   from './Canvas';
import Snap from './TextBoxSnap';
import Cursor from './TextBoxCursor';
import {
    findIdxForCursor, findPosForCursor, 
    findCoordsForPos, findRectsForSelection
}                   from '../utils/text';
import {keys} from '../utils/keyboard';
import {rectCenter, moveRect} from '../utils/pixels';
const { fromJS } = require('immutable');

const makeBlue = (alpha) => `rgba(87, 205, 255, ${alpha})`;

export default createReactClass({

    getInitialState(){
        return {
            x: {},
            y: {}
        }
    },

  propTypes: {
    text: PropTypes.string.isRequired,
    textAttrs: PropTypes.object.isRequired,
    // focusedPart: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    // isEditing: PropTypes.bool.isRequired,
    part: PropTypes.string.isRequired,
    cancelEditing: PropTypes.func.isRequired,
    setFocus: PropTypes.func.isRequired,
    moveRect: PropTypes.func.isRequired
  },

  getCursors() {
    return this.props.selection;
  },

  // getSnapFrames() {
  //   const rect = this.props.textRect;
  //   const [x, y, w, h] = rect;
  //   const size = 15;
  //   const {y: yCenter} = rectCenter(rect);
  //   const left = [x - size/2, yCenter - size/2, size, size];
  //   const right = [x + w - size/2, yCenter - size/2, size, size];

  //   return {left, right};
  // },

  cancelEdit(e) {
    if (keys[e.which] === 'escape') {
      this.props.cancelEditing();
      e.target.blur();
    }
  },

  handleMouseDown(e, mousePos, sub) {
    this.startPos = mousePos;

    this.mouseHeld = true;
    if (this.getFocusState().isFocused) {
        this.mouseDown = new Date;
    }
    this.props.setFocus();
  },

    updateNextPos(nextIndex, position) {
        let imState = fromJS(this.state);
        imState.get('x').set(nextIndex, position.x)
        imState.get('y').set(nextIndex, position.y)
        this.setState(imState.toJS())
    },

  render() {
    const {text, textAttrs, textArr} = this.props;
    const {mouseHeld} = this;
    const self = this;
    let lastX = 0; //todo
    let lastY = 0; //todo
    let canvasHeight = 20;

    // const selectionRectFrames = this.getSelectionRects();
    // const selectionRects = selectionRectFrames.map((frame, i) => {
    //   return <CanvasRect key={i} fill={makeBlue(0.5)} frame={frame} />;
    // });

    // invisible rect to allow text selection/dragging
    return <CanvasGroup>
        {textArr.map && textArr.map(function(tObject, i) {
            //13 mean 13px of default text; times to textLength
            // canvasWidth = canvasWidth + (tObject.text.length * 13);
            let x = self.state.x[i] ? self.state.x[i] : lastX,
            y = self.state.y[i] ? self.state.y[i] : lastY

            if(x >= 420) { //break line|| handle text overflowing canvas
                x = 0;
                y  = lastY + 30; //new line
            }

            let $return = tObject.type === "emojione"
                ? <CanvasDraggableImage
                    x={x}
                    y={y}
                    order={i}
                    tObject={tObject}
                    updateNextPos={self.updateNextPos}
                    key={i}
                    frame={tObject.frame}
                    fill={tObject.style.color}
                    mouseSnap={true}
                    onMouseDown={self.handleMouseDown}
                    onMouseMove={self.handleMouseMove}
                    onMouseUp={self.handleMouseUp} />
                : <CanvasText
                    x={x}
                    y={y}
                    order={i}
                    tObject={tObject}
                    frame={tObject.frame}
                    fill={tObject.style.color}
                    fontSize={17}
                    mouseSnap={true}
                    updateNextPos={self.updateNextPos}
                    key={i}
                    onMouseDown={self.handleMouseDown}
                    onMouseMove={self.handleMouseMove}
                    onMouseUp={self.handleMouseUp} />;

                            
         return $return
      })}
    </CanvasGroup>;
  }
});


/*
var canvas = document.getElementById("myCanvas");
var ctx;
var linkText="http://stackoverflow.com";
var linkX=5;
var linkY=15;
var linkHeight=10;
var linkWidth;
var inLink = false;

// draw the balls on the canvas
function draw(){
  canvas = document.getElementById("myCanvas");
  // check if supported
  if(canvas.getContext){

    ctx=canvas.getContext("2d");

    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw the link
    ctx.font='10px sans-serif';
    ctx.fillStyle = "#0000ff";
    ctx.fillText(linkText,linkX,linkY);
    linkWidth=ctx.measureText(linkText).width;

    //add mouse listeners
    canvas.addEventListener("mousemove", on_mousemove, false);
    canvas.addEventListener("click", on_click, false);

  }
}

//check if the mouse is over the link and change cursor style
function on_mousemove (ev) {
  var x, y;

  // Get the mouse position relative to the canvas element.
  if (ev.layerX || ev.layerX == 0) { //for firefox
    x = ev.layerX;
    y = ev.layerY;
  }
  x-=canvas.offsetLeft;
  y-=canvas.offsetTop;

  //is the mouse over the link?
  if(x>=linkX && x <= (linkX + linkWidth) && y<=linkY && y>= (linkY-linkHeight)){
      document.body.style.cursor = "pointer";
      inLink=true;
  }
  else{
      document.body.style.cursor = "";
      inLink=false;
  }
}

//if the link has been clicked, go to link
function on_click(e) {
  if (inLink)  {
    window.location = linkText;
  }
}*/