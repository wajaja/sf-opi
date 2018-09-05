import React    			from 'react';
import createReactClass 		from 'create-react-class'
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } 		from 'react-dom';
import flow 				from 'lodash/flow';
 
const Emoji  = createReactClass({
 	getInitialState() {
 		return {
 			hover: false
 		}
 	},

 	mouseOut() {
	    this.setState({hover: false});
	},
	  
	mouseOver() {
	    this.setState({hover: true});
	},

	render() {
		const { emoji, className, isDragging, connectDragSource, 
			connectDropTarget, selection, top, left } = this.props,
		{ hover } 	= this.state,
		_top 		= top ? top + 'px' : '',
		opacity 	= isDragging ? 0 : 1, //hide box when dragging
		_left	 	= left ? left + 'px' : '',
		selected 	= selection === emoji.title ? true : false,
		src 		= 'http://opinion.com/images/emoji/' + emoji.title + '.png';
 		
		return connectDragSource(connectDropTarget(
			<div 
				style={{top: _top, left: _left, opacity}}
				className={className}
				onMouseOut={this.mouseOut} 
				onMouseOver={this.mouseOver}
				>
				{true && <div className="emj-show-nm">{emoji.title}</div>}
				<img src={src} />
			</div>
		));
	}
})


/////////
const emojiSource = {
 
	beginDrag(props) {
		//object representing the currently dragged item
		return { 
		  emoji: props.emoji 
		}
	},

	// beginDrag(props) {	
	// 	return {			
	// 		index: props.index,
	// 		emoji: props.emoji
	// 	};
	// },
 
	endDrag(props, monitor) {
		const item = monitor.getItem();
		const dropResult = monitor.getDropResult();	

		props.onDragEnded(props.emoji.title)
 
		// if ( dropResult && dropResult.listId !== item.listId ) {
		// 	props.removeEmoji(item.index);
		// }
	}
};

const emojiTarget = {
 	
 	//Called when an item is hovered over the component
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;
		// const sourceListId = monitor.getItem().listId;	
 
		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}

		// This is fired very often and lets you perform side effects
	    // in response to the hover. You can't handle enter and leave
	    // here—if you need them, put monitor.isOver() into collect() so you
	    // can just use componentWillReceiveProps() to handle enter/leave.
 
		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
 
		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
 
		// Determine mouse position
	    // You can access the coordinates if you need them
		const clientOffset = monitor.getClientOffset();
 
		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;
 
		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%
 
		// // Dragging downwards
		// if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
		// 	return;
		// }
 
		// // Dragging upwards
		// if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
		// 	return;
		// }
	}
};


export default flow(
	DropTarget("EMOJI", emojiTarget, connect => ({
		connectDropTarget: connect.dropTarget()
	})),
	DragSource("EMOJI", emojiSource, (connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	}))
)(Emoji);