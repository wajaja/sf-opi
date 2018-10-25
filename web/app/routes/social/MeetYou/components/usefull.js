const stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight
});

const layer = new Konva.Layer();
stage.add(layer);

const rect = new Konva.Rect({
  width: 100,
  height: 20,
  stroke: 'green'
});
layer.add(rect);

const text = new Konva.Text({
  text: 'vertical align',
  x: 5,
  height: rect.height(),
  verticalAlign: 'middle'
});

const text2 = new Konva.Text({
  text: 'vertical align',
  x: text.width() + 11,
  height: rect.height(),
  verticalAlign: 'middle'
});
layer.add(text);
layer.add(text2);



layer.draw();







var stage = new Konva.Stage({
  container: 'container',
  width: 300,
  height: 300
});

var layer = new Konva.Layer();

var rect = new Konva.Rect({
    x: 30,
    y: 30,
    width : 50,
    height : 50,
    fill: 'red',
    stroke: 'black',
    shadowBlur : 40,
    draggable : true
});

// add the shape to the layer
layer.add(rect);

// add the layer to the stage
stage.add(layer);


rect.on('dragstart', function() {
    // stop dragging original rect
    rect.stopDrag();
    
    // clone it
    var clone = rect.clone({
        x : 50,
        y : 50
    });
    // events will also be cloned
    // so we need to disable dragstart
    clone.off('dragstart');
    
    // then add to layer and start dragging new shape
    layer.add(clone);
    clone.startDrag();
});




var canvas = document.getElementById('canvas');
var ctx    = canvas.getContext('2d');

var data   = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
               '<foreignObject width="100%" height="100%">' +
                 '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
                   '<em>I</em> like <span style="color:white; text-shadow:0 0 2px blue;">cheese</span>' +
                 '</div>' +
               '</foreignObject>' +
             '</svg>';

var DOMURL = window.URL || window.webkitURL || window;

var img = new Image();
var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
var url = DOMURL.createObjectURL(svg);

img.onload = function () {
  ctx.drawImage(img, 0, 0);
  DOMURL.revokeObjectURL(url);
}

img.src = url;





var stage = new Konva.Stage({
  container: 'canvas',
  width: 600,
  height: 600
});

var layer = new Konva.Layer();
stage.add(layer);

// Red background rectangle that fills canvas
var background = new Konva.Rect({
  x: 0,
  y: 0,
  width: 600,
  height: 600,
  fill: 'hsl(0, 50%, 50%)'
});

// White rectangles for upper right and lower left corners
var upperRight = new Konva.Rect({
  x: 300,
  y: 0,
  width: 300,
  height: 300,
  fill: '#fff'
});
var lowerLeft = upperRight.clone({
  x: 0,
  y: 300
});

// Ostrich proverb in upper left
var ostrich = new Konva.Text({
  text: 'A wise man never ties his ostrich far from the tree.',
  x: 40,
  y: 70,
  width: 220,
  fontFamily: 'sans-serif',
  fontSize: 35,
  fill: '#ddd'
});

// Dog proverb in upper right
// The \n symbols in the text cause a new line to start.
// The \' are used to show an apostophe without the computer thinking it's the end of the string. This is called escaping the apostrophe.
var dog = new Konva.Text({
  text: 'Outside of a dog, \na book is man\'s best friend. \n\nInside of a dog, it\'s too dark to read.',
  x: 340,
  y: 60,
  width: 220,
  fontFamily: 'serif',
  fontSize: 28,
  fill: '#555'
});

// Vogon poetry description in lower left
var vogon = new Konva.Text({
  text: 'Vogon poetry is said to be the third worst poetry in the entire universe.',
  x: 40,
  y: 370,
  width: 220,
  fontFamily: 'monospace',
  fontSize: 25,
  fontStyle: 'bold',
  fill: '#555'
});

// Google font example in lower right
var googleFont = new Konva.Text({
  text: 'This font comes from Google Fonts. You need to add a line into the HTML to tell the browser to download this font.',
  x: 340,
  y: 345,
  width: 220,
  align: 'center',
  fontFamily: 'Shadows Into Light',
  fontSize: 30,
  fill: '#ddd'
});

layer.add(background, upperRight, lowerLeft);
layer.add(ostrich, dog, vogon, googleFont);

stage.draw();

