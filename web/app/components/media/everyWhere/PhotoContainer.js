import React, { Component } from 'react';
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class';
import update 				from 'immutability-helper';
import Emoji 				from './Emoji'
import { ListRect }  		from '../../../components'
import { DragSource, DropTarget } from 'react-dnd';
 
const PhotoContainer = createReactClass({
 
	getInitialState() {
		//calcul 
		const { everywhere } = this.props
		if(everywhere && everywhere.id) {
			let {rect_y, rect_x, scale_x, scale_y, created_at, char_code } = everywhere, //for user 
			top = rect_y * scale_y,
			left = rect_x * scale_x;
			return { 
				hasEmoji: true,
				emoji:{ top: top, left: left, title: char_code },
			}
		} else {
			return {  
				hasEmoji: false,
				emoji:{},
			}
		}
	},
 
	pushEmoji(emoji) {
		this.setState(update(this.state, {
			cards: {
				$push: [ card ]
			}
		}));
	},
 
	removeEmoji(index) {		
		this.setState(update(this.state, {
			cards: {
				$splice: [
					[index, 1]
				]
			}
		}));
	},

	moveEmoji(left, top, title) {
		console.log('moveEmoji', left, top, title)
		this.setState(
			update(this.state, {
				hasEmoji: false,
				emoji: {
					$merge: { left, top, title },
				},
			}),
		)

		//then send the left, top, title and the scale of image to server
		this.props.sendEverywhere(left, top, title);
	},

	//drag ended in container
 	onDragEnded(title) {
 		// nothing to do here
		this.setState({selection: title})
	},

	sendFriendTag(rect, recipient, clientScale) {
        const { imageId } = this.props;
        console.log('sendFriendTag', rect, recipient, clientScale)
    },

    popFriendInList(username) {
        const friends = _.filter(this.state.friends, (user, i) => {
            return !_.indexOf(user, user.username); //remove user in selectable list
        })
        .map((user, i) => {
            return {
                label: user.username, 
                firstname: user.firstname, 
                lastname:user.lastname, 
                value: user
            }
        });

        this.setState({friends})
    },

	// moveEmoji(dragIndex, hoverIndex) {
		// const { emoji } = this.state;		
		// const dragEmoji = cards[dragIndex];
 
		// this.setState(update(this.state, {
		// 	cards: {
		// 		$splice: [
		// 			[dragIndex, 1],
		// 			[hoverIndex, 0, dragCard]
		// 		]
		// 	}
		// }));
	// },

	render() {
		const { emoji, defaultRecipients } = this.state,
		{ canDrop, isOver, connectDropTarget, everywhere, rects, imgElement, photo } = this.props,
		isActive 		= canDrop && isOver,
		backgroundColor = isActive ? 'transparent' : 'transparent',
		friendTags 		= photo.friendTags ? photo.friendTags : [];
 
		return connectDropTarget(
			<div 
				style={{backgroundColor}} 
				className="every-where-ctnr">
				{this.props.children}
				<ListRect 
                    img={imgElement}
                    rects={rects}
                    friendTags={friendTags}
                    sendFriendTag={this.sendFriendTag}
                    popFriendInList={this.popFriendInList}
                    />
				{!!emoji && emoji.title && 
					<Emoji 
						emoji={emoji}
						top={emoji.top}
						left={emoji.left}
						className="emo-every-where"
						moveEmoji={this.moveEmoji}
						onDragEnded={this.onDragEnded}
						removeEmoji={this.removeEmoji} />
				}
			</div>
		)
  	}
})

///////
const emojiTarget = {
	// drop(props, monitor, component ) {
	// 	const { id } = props;
	// 	const sourceObj = monitor.getItem();		
	// 	if ( id !== sourceObj.listId ) component.pushCard(sourceObj.card);
	// 	return {
	// 		listId: id
	// 	};
	// }
	drop(props, monitor, component) {
		//getItem(): Returns a plain object representing the currently dragged item. 
		//Every drag source must specify it by returning an object from its beginDrag() method
		// Determine rectangle on screen
		const item = monitor.getItem(), 
		boundingRect = findDOMNode(component).getBoundingClientRect(),
		// Determine mouse position
	    // You can access the coordinates if you need them
		clientOffset = monitor.getClientOffset(),
		clientY = clientOffset.y - boundingRect.top - 20, // Get pixels to the top || 20 midle-size of emoji width
		clientX = clientOffset.x - boundingRect.left - 20, // Get pixels to the bottom
		delta = monitor.getDifferenceFromInitialOffset();

		//removeEmoji(left, top, title)
		component.moveEmoji(clientX, clientY, item.emoji.title)
	},
}
 
export default DropTarget("EMOJI", emojiTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop()
}))(PhotoContainer);

