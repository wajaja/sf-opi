import React            from 'react'
import createReactClass from 'create-react-class'
import _                from 'lodash'
import emojione         from 'emojione'
import { Link }         from 'react-router-dom'

//https://codereview.stackexchange.com/questions/47932/recursion-vs-iteration-of-tree-structure
// simulates operations for walking through tree using iteration
function recoverNodeStyle(node) {
    let style = '';


    node.depth = 0;
    node.next = null;
    let children, i, len;
    let depth;

    while (node) {
        if(node.nodeName === '#text') 
            return '';

        depth = node.depth;
        children = node.childNodes;

        //removes this item from the linked list
        style += node.style.cssText; //concat inline-style 
        node = node.next;
        for (i = 0, len = children.length; i < len; i++) {
            let child = children[i];
            child.depth = depth+1;

            //place new item at the head of the list
            child.next = node;
            node = child;

            //from childNode append inline-style
            if(node.nodeName !== '#text') 
                style += node.style.cssText;
        }
        return style;
    }
}

function camelCase(str) {
    return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

//////
//////
const HtmlContent  = createReactClass( {
    getInitialState() {
        return {
            mounted: false,
            x: this.props.x,
            y: this.props.y,
            image: null,
        }        
    },

    getDefaultProps() {
        return {
            contentFor: '',
        }
    },

    imgX: 0,
    imgY: 2,

    componentDidMount() {        
        this.props.getHtmlCardRect({
            top: this.parentNode.getBoundingClientRect().top,
            left: this.parentNode.getBoundingClientRect().left
        })


        let paragraphs = this.parentNode.getElementsByTagName('p');
        let self = this;
        let shapes = [];

        _.forEach(paragraphs, function(parg, i) {
            let pargChilds = parg.childNodes
            // D'abord vérifier que l'élément a des noeuds enfants
            console.log('pargChilds', pargChilds);
            if (parg.hasChildNodes()) {
                var children = parg.children;
                let parentRect = self.parentNode.getBoundingClientRect();
                for (var i = 0; i < pargChilds.length; i++) {
                    const node = pargChilds[i];
                    let shape = {};
                    let rect;

                    shape.style = recoverNodeStyle(node);
                    shape.data = node.textContent;

                    if(node.nodeName === '#text') {
                        //https://stackoverflow.com/questions/1461059/is-there-an-equivalent-to-getboundingclientrect-for-text-nodes
                        var range = document.createRange();
                        range.selectNode(node);
                        rect = range.getBoundingClientRect();
                        range.detach(); // frees up memory in older browsers
                    } else {
                        rect = node.getBoundingClientRect();
                    }

                    shape.rect = {
                        y: rect.top - parentRect.top,
                        x: rect.left - parentRect.left,
                        width: rect.width,
                        height: rect.height
                    }

                    if(node.nodeName === '#text') {
                        shape.type = node.nodeName;
                    } else if(node.nodeName === 'STRONG') {
                        shape.type = node.nodeName;
                    } else if(node.nodeName === 'A' && node.className === "mention") {
                        shape.type = 'mention';
                        shape.pathname = node.pathname;
                    } else if(node.nodeName === 'SPAN' && node.className === "emoji") {
                        shape.type = 'emoji';
                    } else {
                        shape.type = node.nodeName;
                    }
                    // faire quelque chose avec chaque enfant[i]
                    console.log('shape', shape)
                    // NOTE: La liste est en ligne, l'ajout ou la suppression des enfants changera la liste
                    shapes.push(shape);
                }
            }
        })
        self.shapes = shapes;
        //
        

        /*block test*/
        const size = this.props.size;
        this.canvas =  document.createElement('canvas');
        this.canvas.width  = size.width;
        this.canvas.height = size.height;
        this.drawImage(this.props.size);
    },

    drawImage(size){

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

        let img = new window.Image(width, height);  //width, height
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
                this.props.updateCard({image: img, shapes: self.shapes});
            });
            /*Call this method when you've finished 
            * using an object URL to let the browser know not 
            to keep the reference to the file any longer
            */
            //!!!This feature is available in Web Workers.
            DOMURL.revokeObjectURL(url);  
        };

        img.src = url;
    },

    createHiDPICanvas(w = 100, h = 100, ratio) {
        if (!ratio) {
          ratio = this.getPixelRatio();
        }
        let c = this.canvas;
        c.width = w * ratio;
        c.height = h * ratio;
        console.log(ratio,( w * ratio), (h * ratio))
        c.style.width = w + 'px';
        c.style.height = h + 'px';
        c.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
        c.ctx = c.getContext('2d');
        return c;
    },

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
    },

    createMarkup(){
        // const { editorState, customStylesUtils } = this.props;
        // const contentState = editorState.getCurrentContent();
        // const inlineStyles = customStylesUtils.exporter(editorState);
        // const html = stateToHTML(contentState, { inlineStyles });

        //const html = document.querySelector('.DraftEditor-root').innerHTML;
        return this.parentNode.innerHTML
                              .replace(/<p>/g, "<div>")
                              .replace(/<\/p>/g,"</div>");
    },

    //source poetry editor
    getImprintData(html){
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
                        padding: 13px 3px;
                        margin: 0;
                        width: 100%;
                        height: 100%;
                    }

                    body {
                        display: block;
                        margin: auto;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                        font-size: ${fontSize};
                        line-height: ${lineHeight}px;
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
    },

    drawImg(){
        const { width, height } = this.myC;
        //this.myC.ctx.fillRect(0, 0, width, height);
        this.myC.ctx.drawImage(
            this.img,
            this.imgX,
            this.imgY,
            // width,   //TODO use set this later
            // height,
        );

        // if (this.state.isDragging) {
        //     requestAnimationFrame(this.drawImg.bind(this));
        // }
    },

    render() { 
        const { contentFor, html, size } = this.props;
        const { width, height } = size

        if(html) {
            return (
                <div 
                    style={{
                        display: "none",  ///!IMPORTANT
                        width: width + "px", 
                        height: height  + "px",
                        position: 'relative',
                        right: '-500px',
                        top: '-200px'
                    }}
                    className="HtmlContent">
                    <div ref={(el) => this.parentNode = el} dangerouslySetInnerHTML={{ __html: html }}/>
                </div>
            )

        }
    }
})

export default HtmlContent
                    // <canvas
                    //     id="canvas"
                    //     width={width} 
                    //     height={height}
                    //     style={{cursor:" pointer"}}
                    //     ref={ref => (this.canvas = ref)}
                    //   />