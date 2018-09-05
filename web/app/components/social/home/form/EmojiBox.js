import React from 'react'
import createReactClass from 'create-react-class'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import bindFunctions from '../../../../utils/bindFunctions'
import shortnames from 'emoji-shortnames';
import Emojify from 'react-emojione';

import '../../../../styles/emojibox.scss'

const EmojiBox  = createReactClass( {

	getInitialState() {
		return {
			group: ''
		}
	},

	getDefaultProps () {
		return {
			emojiGroups : [
				{
					name : 'people',
					img : '/images/emoji/neutral_face.png'
				},
				{
					name : 'symbols',
					img: '/images/emoji/interrobang.png'
				},
				{
					name : 'objects',
					img : '/images/emoji/keyboard.png'
				},
				{
					name : 'nature',
					img : '/images/emoji/panda_face.png'
				},
				{
					name : 'food',
					img : '/images/emoji/peach.png'
				},
				{
					name : 'travel',
					img: '/images/emoji/airplane.png'
				},
				{
					name: 'activity',
					img: '/images/emoji/soccer.png'
				},
				{
					name :'flags',
					img: '/images/emoji/checkered_flag.png'
				},
				{
					name : 'regional',
					img : '/images/emoji/regional_indicator_a.png'
				},
				{
					name : 'modifier',
					img : '/images/emoji/tone1.png'
				}
			]
		}
	},

	selectGroupEmoji(group, e) {
        e.preventDefault();
        const selector = '.' + group.name,
        	thisNode = ReactDOM.findDOMNode(this),
        	prevGroup = $(thisNode).find('.active-grp'),
        	nextGroup = ReactDOM.findDOMNode(this)
        						.querySelector('.groups')
        						.querySelector(selector);

        	if(prevGroup) $(prevGroup).removeClass('active-grp');

        	$(nextGroup).addClass('active-grp');
    },

    emojiName(name) {
    	this.props.emojiName(name)
    },

    componentDidMount() {
    	const defaultGroup = ReactDOM.findDOMNode(this)
    								.querySelector('.groups')
    		  						.querySelector('.people');
    	$(defaultGroup).addClass('active-grp');
    },

	render() {
		const self = this;
		return ( 
			<div className="emoji-ctnr">
                <div className="lks">
                	{this.props.emojiGroups.map(function(group, i) {
                        return (
                        	<span key={i} style={{cursor: 'pointer'}} className={group.name} onClick={this.selectGroupEmoji.bind(this, group)}>
                        		<img src={group.img} />
                        	</span>   
                        );
                    }.bind(this))}
                </div>
                <div className="groups">
	                {Object.keys(shortnames).map((category, i) =>
				        <Emojify key={i} style={{height: 19, cursor: 'pointer'}} onClick={n => self.emojiName(n.target.title)}>
				            <div className={category}>
				                {shortnames[category]}
				            </div>
				        </Emojify>
				    )}
			    </div>
            </div>
		)
	}
})

export default EmojiBox;