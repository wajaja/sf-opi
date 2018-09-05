import React            from 'react'
import createReactClass from 'create-react-class'
import _                from 'lodash'
import emojione         from 'emojione'
import { Link }         from 'react-router-dom'

function relevantStyles(entityMap) {

    return entityMap.map(function(entity, i) {

        if(entity.type == 'emoji') {
            return (emojione.toImage(entity.data.emojiUnicode));
        }

        if(entity.type == 'mention') {
            const mention = entity.data.mention;
            return `<a href=${mention.link} class="mention" >${mention.name}</a>`;
        }

        // if(entity.type == 'linkify') {
        //     const mention = entity.data.linkify;
        //     return `<a href=${mention.link} class="mention" >${mention.name}</a>`;
        // }
    })
}

///////////
//////////
function buildMarkup(content) {
    const blocks        = content.blocks,
          entityMap     = content.entityMap,
          styles        = relevantStyles(entityMap);
    let output = ''; 

    Object.keys(blocks).map(i => {
        const { entityRanges, text } = blocks[i];
        output += '<p>';

        const textLength = text.length;

        let startRange = 0;
        entityRanges.map((range, i) => {
            output += '<span>' + text.substr(startRange, range.offset - startRange ) + '</span>';
            // output += '@';

            output += styles[i]; // text.substr(range.offset, range.length);

            startRange = range.offset + range.length;
        });

        output += '<span>' + text.substr(startRange, textLength) + '</span>';
        output += '</p>';
    });
    return output;
}

function toArray(obj) {
    var arr = [];
    for (var i = 0; i < obj.length; i++) {
        arr[i] = obj[i]
    }
    return arr;
}

//////
//////
const BuildContent  = createReactClass( {
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
        this.setState({
            mounted: true  //for server side rendering
        })
    },

    render() { 
        const { content, contentFor } = this.props
        if(content && content.blocks) {
            if(this.state.mounted) {
                const self      = this,
                markuppedBlocks = buildMarkup(content),
                htmlObj         = $('<div></div>').append(markuppedBlocks),
                elements        = toArray(htmlObj[0].children);
                return(
                    <div>
                       {elements.map(function(paragraph, pIndex) {
                            return (
                                <p key={pIndex}>
                                    {toArray(paragraph.children).map(function(el, i) {
                                        if(el.className == 'mention') {
                                            const pathLen   = el.href.split('/').length,
                                                  link      = el.href.split('/')[pathLen - 1];
                                            return (<Link key={i} to={link} className="mention"> {el.innerHTML} </Link>);
                                        }
                                        ////
                                        ////
                                        if(el.className == 'emojione')
                                            return (<img key={i} alt={el.alt} src={el.src} className="emojione" title={el.title} />);
                                        
                                        /////
                                        /////
                                        if(el.className == '') {
                                            const spanText = el.innerHTML,
                                            spanArr = spanText.split(' ');
                                            return(
                                                <span key={i}>
                                                    {spanArr.map(function(txt, index) {
                                                        if(spanArr[index].indexOf('#') == 0) {
                                                            const tag = 'hashtag/' + spanArr[index].substr(1);
                                                            return (<Link key={index} to={tag} className="hashtag"> {spanArr[index]} </Link>);
                                                        } else {
                                                            return ' ' + spanArr[index] + ' ';
                                                        }
                                                    })}
                                                </span>
                                            )                                                        
                                        }
                                    })}
                                </p>
                            )                        
                        })}
                    </div>
                );
            } else {
                return <div/>
            }
        } 
        else if(typeof content === 'undefined' || !content) {
            if(contentFor === 'status') {
                return(<div className="op-dflt-stt">opinion default status</div>)
            }

            return(
                <div></div>
            );
        }
        ///////
        else if(typeof content === 'string'&& !!content){
            ////transform emoji unicode to image in content
            const contentWithEmoji = emojione.toImage(content);
            ////if content has html then render dangerouslySetInnerHTML
            if(/<[a-z][\s\S]*>/i.test(contentWithEmoji)) {
                return(
                    <div dangerouslySetInnerHTML={{ __html: contentWithEmoji }} />
                );
            } else {
                const contentWithEmojis = contentWithEmoji.split(/(?:\r\n|\r|\n)/g).map((txt, i) => {
                    return <p key={i}>{txt}</p>
                })
                return(
                    <div>{contentWithEmojis}</div>
                );
            }
        } else {
            console.log(content)
            console.log(typeof content)
            return <div/>
        }
    }
})

export default BuildContent