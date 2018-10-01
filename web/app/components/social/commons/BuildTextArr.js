import React            from 'react'
import createReactClass from 'create-react-class'
import _                from 'lodash'
import emojione         from 'emojione'
import { Link }         from 'react-router-dom'
import { BASE_PATH }    from '../../../config/api'

// Source  Code
// Remove invalid utf-8 char
// https://stackoverflow.com/questions/2670037/how-to-remove-invalid-utf-8-characters-from-a-javascript-string
function cleanString(input) {
    let output = "";
    for (var i=0; i<input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        } else {
            output += ' ';  // invilid char will replaced with an empty string
        }
    }
    return output;
}

function relevantStyles(entityMap) {

    let $return = [];
    _.forOwn(entityMap, function(entity, i) {

        if(entity.type == 'emoji') {
            $return.push(emojione.toImage(entity.data.emojiUnicode));
        }

        if(entity.type == 'mention') {
            const mention = entity.data.mention.toJS(),
            mHtml = `<a href=${mention.link} class="mention" >${mention.name}</a>`;
            $return.push(mHtml)
        }

        // if(entity.type == 'linkify') {
        //     const mention = entity.data.linkify;
        //     return `<a href=${mention.link} class="mention" >${mention.name}</a>`;
        // }
    })

    return $return;
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
        const cleanText = cleanString(text);            //remove no utf-8 char
        output += '<p>';
            const textLength = cleanText.length;

            let startRange = 0;
            entityRanges.map((range, i) => {
                output += '<small>' + cleanText.substr(startRange, range.offset - startRange ) + '</small>';
                // output += '@';
                output += styles[i]; // text.substr(range.offset, range.length);

                startRange = range.offset + range.length;
            });

            output += '<small>' + cleanText.substr(startRange, textLength) + '</small>';
        output += '</p>';
    });
    return output;
}

function toArray(obj) {
    let arr = [];
    for (var i = 0; i < obj.length; i++) {
        arr[i] = obj[i]
    }
    return arr;
}

//////
//////
const BuildTextArr  = async function(content) {

    let textArr = [];

    if(content && content.blocks) {
        const self      = this,
        markuppedBlocks = await buildMarkup(content),
        htmlObj         = $('<div></div>').append(markuppedBlocks),
        elements        = toArray(htmlObj[0].children);


        _.forEach(elements, function(paragraph, pIndex) {
            toArray(paragraph.children).map(function(el, i) {
                if(el.className == 'mention') {
                    const len = el.href.split('/').length,
                    link      = el.href.split('/')[len - 1];
                    textArr.push({
                        index: i,
                        type: 'mention',
                        text: el.innerHTML,
                        style: {},
                        link: link,
                        pIndex: pIndex,
                        fullUrl: `http://opinion.com${BASE_PATH}/${link}`
                    })
                } 
                else if (el.className == 'emojione') {
                    textArr.push({
                        index: i,
                        type: 'emojione',
                        style: {},
                        src: el.src,
                        alt: el.alt,
                        pIndex: pIndex,
                    })
                } 
                else if (el.className == '') {
                    const spanText = el.innerHTML,
                    spanArr = spanText.split(' ');
                    _.forEach(spanArr, function(txt, index) {
                        if(spanArr[index].indexOf('#') == 0) {
                            const tag = 'hashtag/' + spanArr[index].substr(1);
                            textArr.push({
                                index: i+index,
                                type: 'hashtag',
                                text: spanArr[index],
                                style: {},
                                link: tag,
                                pIndex: pIndex,
                                fullUrl: `http://opinion.com${BASE_PATH}/${tag}`
                            })
                        } else {
                            textArr.push({
                                index: i+index,
                                type: 'text',
                                text: spanArr[index],
                                style: {},
                                pIndex: pIndex,
                            })
                        }
                    })
                    // textArr.push({
                    //     index: i,
                    //     type: 'text',
                    //     text: '',
                    //     style: {},
                    //     pIndex: pIndex,
                    // })
                }
            })
        })
    } 
    else if(typeof content === 'undefined' || !content) {
        if(contentFor === 'status') {
            textArr = `<div class="op-dflt-stt">opinion default status</div>`
        }

        return(
            textArr += `<div></div>`
        );
    }
    else {
        const contents = content.split(/(?:\r\n|\r|\n)/g).map((txt, i) => {
            textArr += `<p key=${i}>${txt}</p>`
            textArr.push({
                index: 0,
                type: 'text',
                text: txt,
                style: {},
                pIndex: i,
            })
        })
    }

    return textArr;
}

export default BuildTextArr