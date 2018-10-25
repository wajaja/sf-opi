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
const BuildHtmlString  = async function(content) {

    console.log(content);

    let htmlString = '';

    if(content && content.blocks) {
        const self      = this,
        markuppedBlocks = await buildMarkup(content),
        htmlObj         = $('<div></div>').append(markuppedBlocks),
        elements        = toArray(htmlObj[0].children);

        htmlString += '<div>'

           _.forEach(elements, function(paragraph, pIndex) {
                htmlString += `<p key=${pIndex}>`
                    toArray(paragraph.children).map(function(el, i) {
                        if(el.className == 'mention') {
                            const pathLen   = el.href.split('/').length,
                                  link      = el.href.split('/')[pathLen - 1];
                            htmlString += `<a key=${i} href="http://opinion.com${BASE_PATH}/${link}" class="mention"> ${el.innerHTML} </a>`;
                        } 
                        else if (el.className == 'emojione') {
                            htmlString += `<img key=${i} alt=${el.alt} src=${el.src} class="emojione" title=${el.title} />`
                        } 
                        else if (el.className == '') {
                            const spanText = el.innerHTML,
                            spanArr = spanText.split(' ');
                        
                            htmlString += ''
                                _.forEach(spanArr, function(txt, index) {
                                    if(spanArr[index].indexOf('#') == 0) {
                                        const tag = 'hashtag/' + spanArr[index].substr(1);
                                        htmlString += `<a key=${index} href="http://opinion.com${BASE_PATH}/${tag}" class="hashtag"> ${spanArr[index]} </a>`
                                    } else {
                                        htmlString += ' ' + spanArr[index] + ' ';
                                    }
                                })
                            htmlString += ''
                        }
                    })
                htmlString += `</p>`               
            })
        htmlString += `</div>`
    } 
    else if(typeof content === 'undefined' || !content) {
        if(contentFor === 'status') {
            htmlString += `<div class="op-dflt-stt">opinion default status</div>`
        }

        return(
            htmlString += `<div></div>`
        );
    }
    else {
        const contents = content.split(/(?:\r\n|\r|\n)/g).map((txt, i) => {
            htmlString += `<p key=${i}>${txt}</p>`
        })
        htmlString += `<div>${contents}</div>`
    }

    return htmlString;
}

export default BuildHtmlString