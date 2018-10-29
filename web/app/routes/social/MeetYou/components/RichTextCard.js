import React, { Component, Fragment } from 'react';
import Konva from 'konva';
import { Image as KonvaImage } from 'react-konva';
import PropTypes from 'prop-types';
// import { centerCrop } from '../utils/pixels';


function camelCase(str) {
    return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}


// VERY IMPORTANT NOTES
// at first we will set image state to null
// and then we will set it to native image instanse
// only when image is loaded
class RichTextCard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            x: props.x,
            y: props.y,
            image: null,
        };
        this.imgX = 2;
        this.imgY = 0;
    }

    static defaultProps = {
        x: 10,
        y: 20,
        shapes: [],
        background: 'transparent'
    };

    static propTypes = {
        node: PropTypes.object.isRequired,
        background: PropTypes.string.isRequired,
        editorState: PropTypes.object.isRequired,
        size: PropTypes.object.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        shapes: PropTypes.array.isRequired
    };

    componentDidMount() {
        const size = this.props.size;
        this.canvas =  document.createElement('canvas');
        this.canvas.width  = size.width;
        this.canvas.height = size.height;
        this.drawImage(this.props.size);

        // const image = new window.Image();
        // image.src = 'http://konvajs.github.io/assets/yoda.jpg';
        // image.onload = () => {
        //     // setState will redraw layer
        //     // because "image" property is changed
        //     this.setState({
        //         image: image
        //     });
        // };
    }

    drawImage = (size) => {

        const { width, height } = size; //size of card

        //myC as in myCanvas
        let myC = this.createHiDPICanvas(width, height);
        this.myC = myC;

        //fille background color
        //this.myC.ctx.fillStyle = this.props.background || 'transparent';

        /**
         * canvas clearing up method
         * it fills with the fillStyle prop above
         */
        //this.myC.ctx.fillRect(0, 0, width, height);

        let cardMarkupWithStyles = this.createMarkup();
        let canvasImprintData = this.getImprintData(cardMarkupWithStyles);

        console.log(width, height, canvasImprintData);

        let DOMURL = window.URL || window.webkitURL || window;

        let img = document.createElement('img'); //new window.Image(width, height);  //width, height
        this.img = img;

        let svg = new Blob([canvasImprintData], { type: 'image/svg+xml' });
        let url = DOMURL.createObjectURL(svg);
        console.log('url', url);
        img.onerror = (err) => {
            console.log(err)
        }
        img.onload = () => {
            this.drawImg();
            this.setState({
                image: img
            }, () => {
                console.log('successsss', img);
            });
            console.log('cavavacacacvacavcavcavacvacavac');
            /*Call this method when you've finished 
            * using an object URL to let the browser know not 
            to keep the reference to the file any longer
            */
            //!!!This feature is available in Web Workers.
            DOMURL.revokeObjectURL(url);  
        };

        img.src = url;
    }

    createHiDPICanvas = function(w = 100, h = 100, ratio) {
        if (!ratio) {
          ratio = this.getPixelRatio();
        }
        let c = this.canvas;
        c.width = w * ratio;
        c.height = h * ratio;
        c.style.width = w + 'px';
        c.style.height = h + 'px';
        c.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
        c.ctx = c.getContext('2d');
        return c;
    };

    /* returns the ratio of the resolution in physical pixels 
    * to the resolution in CSS pixels for the current display device. 
    * This value could also be interpreted as the ratio of pixel sizes: 
    * the size of one CSS pixel to the size of one physical pixel. 
    * In simpler terms, this tells the browser how many of the screen's actual 
    * pixels should be used to draw a single CSS pixel.
    * https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
    */
    getPixelRatio() {
        let ctx = this.canvas.getContext('2d'),
        dpr = window.devicePixelRatio || 1,
        bsr =
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio ||
            1;
        return dpr / bsr;
    }

    createMarkup = () => {
        // const { editorState, customStylesUtils } = this.props;
        // const contentState = editorState.getCurrentContent();
        // const inlineStyles = customStylesUtils.exporter(editorState);
        // const html = stateToHTML(contentState, { inlineStyles });

        //const html = document.querySelector('.DraftEditor-root').innerHTML;
        //arbitrary replace p by div because p have margin to 8px by default
        //TODO: do this in the best way possible
        return this.props.node.innerHTML
                              .replace(/<p>/g, "<div>")
                              .replace(/<\/p>/g,"</div>");
    }

    //source poetry editor
    getImprintData = (html) => {
        var doc = document.implementation.createHTMLDocument('');
        doc.documentElement.innerHTML = html;
        doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI);

        // Get well-formed xthml markup for svg
        let xhtml = new XMLSerializer().serializeToString(doc.documentElement);
        let { width, height } = this.props.size;
        const { fontSize, lineHeight, fontFamily, textAlignment, textDirectionality } = this.props.defaultStyle

        let imprintData = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                <style>
                    html, body {
                        padding:0;
                        margin: 0;
                        width: 100%;
                        height: 100%;
                    }

                    body {
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                        font-size: ${fontSize};
                        line-height: ${lineHeight} px;
                        font-family: ${fontFamily};
                        text-alignment: ${textAlignment};
                        direction: ${textDirectionality};
                    }
                </style>
                <foreignObject width="100%" height="100%">
                    ${xhtml || ''}
                </foreignObject>
            </svg>
        `;
        return imprintData;
    }

    drawImg = () => {
        const { width, height } = this.myC;
        //this.myC.ctx.fillRect(0, 0, width, height);
        this.myC.ctx.drawImage(
            this.img,
            this.imgX,
            this.imgY,
            // width,  //TODO use set this later
            // height,
        );

        // if (this.state.isDragging) {
        //     requestAnimationFrame(this.drawImg.bind(this));
        // }
    }

    handleDragEnd = e => {
        // correctly save node position
        this.setState({
            // text3: Konva.Util.getRandomColor(),
            x: e.target.x(),
            y: e.target.y()
        });
    };

                // width={this.props.size.width}
                // height={this.props.size.width}
    render() {
        return (
            <KonvaImage 
                x={this.state.x}
                y={this.state.y}
                draggable
                onDragEnd={this.handleDragEnd}
                fill={this.props.background || 'transparent'}
                image={this.state.image}
                 />
        )
    }
}

export default RichTextCard