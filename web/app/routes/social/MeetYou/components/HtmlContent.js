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

//////
//////
const HtmlContent  = createReactClass( {
    getInitialState() {
        return {
            mounted: false,
        }        
    },

    getDefaultProps() {
        return {
            contentFor: '',
        }
    },

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
            if (parg.hasChildNodes()) {
                var children = parg.children;
                for (var i = 0; i < pargChilds.length; i++) {
                    const node = pargChilds[i];
                    let shape = {};

                    shape.style = recoverNodeStyle(node);
                    shape.data = node.textContent;
                    if(node.nodeName === '#text') {
                        // let textNode = pargChilds[i];
                        //https://stackoverflow.com/questions/1461059/is-there-an-equivalent-to-getboundingclientrect-for-text-nodes
                        var range = document.createRange();
                        range.selectNode(node);
                        shape.rect = {
                            y: range.getBoundingClientRect().top - self.parentNode.getBoundingClientRect().top,
                            x: range.getBoundingClientRect().left - self.parentNode.getBoundingClientRect().left
                        }
                        shape.type = node.nodeName;
                        range.detach(); // frees up memory in older browsers
                    } else if(node.nodeName === 'STRONG') {
                        shape.rect = {
                            y: node.getBoundingClientRect().top - self.parentNode.getBoundingClientRect().top,
                            x: node.getBoundingClientRect().left - self.parentNode.getBoundingClientRect().left
                        }
                        shape.type = node.nodeName;
                    }

                    else if(node.nodeName === 'A' && node.className === "mention") {
                        shape.rect = {
                            y: node.getBoundingClientRect().top - self.parentNode.getBoundingClientRect().top,
                            x: node.getBoundingClientRect().left - self.parentNode.getBoundingClientRect().left
                        }
                        shape.type = 'mention';
                        shape.pathname = node.pathname;
                    } else if(node.nodeName === 'SPAN' && node.className === "emoji") {
                        shape.rect = {
                            y: node.getBoundingClientRect().top - self.parentNode.getBoundingClientRect().top,
                            x: node.getBoundingClientRect().left - self.parentNode.getBoundingClientRect().left
                        }
                        shape.type = 'emoji';
                    }
                    else {
                        shape.rect = {
                            y: node.getBoundingClientRect().top - self.parentNode.getBoundingClientRect().top,
                            x: node.getBoundingClientRect().left - self.parentNode.getBoundingClientRect().left
                        }
                        shape.type = node.nodeName;
                    }
                    // faire quelque chose avec chaque enfant[i]
                        console.log('shape', shape)
                    // NOTE: La liste est en ligne, l'ajout ou la suppression des enfants changera la liste
                    shapes.push(shape);
                }
            }
        })

        this.props.pushShapes(shapes);
    },

    componentDidUpdate(oldProps, oldState) {
            
    },

    render() { 
        const { content, contentFor, html } = this.props;

        if(html) {
            return (
                <div 
                    style={{
                        width: this.state.width, 
                        height: this.state.height
                    }}
                    className="HtmlContent">
                    <div ref={(el) => this.parentNode = el} dangerouslySetInnerHTML={{ __html: html }}/>
                </div>
            )

        }
    }
})

export default HtmlContent