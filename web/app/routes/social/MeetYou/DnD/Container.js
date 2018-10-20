import React, { PureComponent } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import CardWrapper from './CardWrapper';
import CardDragLayer from './CardDragLayer';
import Card from './Card';

const TOTAL_ITEMS = 0;

const getNodeClientBounds = node => {
  	const el = node.nodeType === 1 ? node : node.parentElement;
  	if (!el) {
    	return null;
  	}
  	return el.getBoundingClientRect();
};

@DragDropContext(HTML5Backend)
export default class Container extends PureComponent {
  	constructor(props) {
	    super(props);


	    this.state = {
			selectedCard: {},
			selectedCardId: 0,
			draggedCardId: {},
			insertIndex: -1,
			cards: props.cards
	    };

	    this.onCardMove = this.onCardMove.bind(this);
	    this.onCardDragStart = this.onCardDragStart.bind(this);
	    this.onCardDragComplete = this.onCardDragComplete.bind(this);
	    this.onCardSelectionChange = this.onCardSelectionChange.bind(this);
  	}

  	onCardDragStart(dragItem) {
	  //   const cards = this.props.cards.slice(); //create array copy

	  //   Array.from(this.container.childNodes).map((child, i) => {
	  //     cards[i].bounds = getNodeClientBounds(child);
	  //   });

	  //   this.setState({
			// cards,
			// selectedCard: dragItem.card,
			// selectedCardId: dragItem.card.id,
			// draggedCardId: dragItem.card.id,
			// hoveredCardId: dragItem.draggedCard.id,
			// activeCardId: dragItem.draggedCard.id,
	  //   });
  	}

  	//react dnd
  	onCardMove(dragItem, hoverId, pointerOffset) {
  		console.log(dragItem, hoverId, pointerOffset)
	    const dragId = dragItem.draggedCardId;

	    const cards = this.props.cards.slice();

	    const dragIndex = cards.findIndex(el => el.id === dragId);
	    const hoverIndex = cards.findIndex(el => el.id === hoverId);

	    // const dragCard = cards[dragIndex];
	    // const hoverCard = cards[hoverIndex];

	    // const midX = hoverCard.bounds.left + (hoverCard.bounds.right - hoverCard.bounds.left) / 2;
	    // const insertIndex = pointerOffset.x < midX ? hoverIndex : hoverIndex + 1;

	    // if (
	    //   this.previousDragId === dragId &&
	    //   this.previousHoverId === hoverId &&
	    //   this.previousInsertIndex === insertIndex
	    // ) {
	    //   return;
	    // }
	    // this.previousDragId = dragId;
	    // this.previousHoverId = hoverId;
	    // this.previousInsertIndex = insertIndex;

	    // this.setState({
	    //   insertIndex,
	    //   hoveredCardIndex: hoverIndex,
	    //   hoveredCardId: hoverId,
	    // });

	  //   this.props.onCardMove({
			// insertIndex,
			// hoveredCardIndex: hoverIndex,
			// hoveredCardId: hoverId,
	  //   })
  	}

  	onCardDragComplete(dragItem) {
	    const changes = {
	      draggedCardId: [],
	      insertIndex: -1,
	      hoveredCardId: null,
	      hoveredCardIndex: -1,
	    };
	    // if (dragItem) {
	    //   let cards = this.props.cards.slice();
	    //   const draggedCard = dragItem.card;
	      //cartes restantes
	      // const remainingCards = cards.filter(c => !draggedCard.find(dc => dc.id === c.id));
	      // let insertIndex = -1;
	    //   if (this.state.insertIndex < cards.length) {
	    //     let index = this.state.insertIndex;
	    //     do {
	    //       const cardIdAtInsertIndex = cards[index].id;
	    //       insertIndex = remainingCards.findIndex(c => c.id === cardIdAtInsertIndex);
	    //       index += 1;
	    //     } while (insertIndex < 0 && index < cards.length);
	    //   }
      	// if (insertIndex < 0) {
       //  	insertIndex = remainingCards.length;
      	// }
      	// remainingCards.splice(insertIndex, 0, ...draggedCard);
      	// changes.cards = remainingCards;
    	// }
    	//this.props.onCardDragComplete(changes);
  	}

  	onCardSelectionChange(cardId, cmdKeyActive, shiftKeyActive) {
	    let selectedCardId;
	    let activeCardId;

	    const cards = this.props.cards.slice();
	    // let previousSelectedCardsIds = this.props.selectedCardId.slice();
	    // let previousActiveCardId = this.props.activeCardId;

	    // not used because we are not planning to deal with multiple selection 
	    // if (cmdKeyActive) {
	    //   if (previousSelectedCardsIds.indexOf(cardId) > -1 && cardId !== previousActiveCardId) {
	    //     selectedCardId = previousSelectedCardsIds.filter(id => id !== cardId);
	    //   } else {
	    //     selectedCardId = [...previousSelectedCardsIds, cardId];
	    //   }
	    // } 
	    // else if (shiftKeyActive && cardId !== previousActiveCardId) { select
	    //   const activeCardIndex = cards.findIndex(c => c.id === previousActiveCardId);
	    //   const cardIndex = cards.findIndex(c => c.id === cardId);
	    //   const lowerIndex = Math.min(activeCardIndex, cardIndex);
	    //   const upperIndex = Math.max(activeCardIndex, cardIndex);
	    //   selectedCardId = cards.slice(lowerIndex, upperIndex + 1).map(c => c.id);
	    // } else {
	      selectedCardId = cardId;
	      activeCardId = cardId;
	    // }

	    // const selectedCard = cards.filter(c => selectedCardId.includes(c.id));

	    const changes = {
	      	selectedCardId,
	    };
	    if (activeCardId) {
	      changes.activeCardId = activeCardId;
	    }
	    // this.setState(changes);
	    this.props.onCardSelectionChange(changes);
  	}

  	render() {
	    const {
	      cards,
	      draggedCardId,
	      selectedCardId,
	      activeCardId,
	      hoveredCardId,
	      hoveredCardIndex,
	      insertIndex,
	    } = this.props;

	    // <CardDragLayer /> useless in our case
	    return (
	        <div
				className="dnd-container"
				ref={el => { this.container = el}}>
          		{cards.map && cards.map((card, i) => {
		            const isDragging = draggedCardId === card.id;
		            // const prevCard = i > 0 ? cards[i - 1] : null;
		            // const nextCard = i < cards.length ? cards[i + 1] : null;

		            // const isDraggingPrevCard = !!prevCard && draggedCardId.includes(prevCard.id);
		            // const isDraggingNextCard = !!nextCard && draggedCardId.includes(nextCard.id);

		            // const shouldInsertLineOnLeft =
		            //   !isDragging && !isDraggingPrevCard && hoveredCardIndex === i && insertIndex === i;

		            // const shouldInsertLineOnRight =
		            //   !isDragging && !isDraggingNextCard && hoveredCardIndex === i && insertIndex === i + 1;

		            // const shouldInsertLineOnRightOfPrevCard =
		            //   !!prevCard && !isDraggingPrevCard && hoveredCardIndex === i - 1 && insertIndex === i;
		            // const shouldInsertLineOnLeftOfNextCard =
		            //   !!nextCard &&
		            //   !isDraggingNextCard &&
		            //   hoveredCardIndex === i + 1 &&
		            //   insertIndex === i + 1;

		            const isHovered =
		              hoveredCardId === card.id || false
		              // shouldInsertLineOnRightOfPrevCard ||
		              //shouldInsertLineOnLeftOfNextCard;
		              console.log(i);

            		return (
	              		<div key={'card-div-' + card.id} style={{ position: 'relative' }}>
		                	{/*shouldInsertLineOnLeft*/ false && <div className="insert-line-left" />}
		                	<CardWrapper
								key={'card-wrapper-' + card.id}
								isDragging={isDragging}
								isActive={activeCardId === card.id}
								isHovered={isHovered}
								isSelected={selectedCardId === card.id}>
		                  		<Card
				                    key={'card-' + card.id}
				                    id={card.id}  //
				                    unique={card.unique}  //eg: 1_0
				                    order={card.order}
				                    type={card.type}
				                    url={card.url}
				                    selectedCardId={selectedCardId}
				                    editorStates={this.props.editorStates}
				                   	imageFilter={this.props.filter}
				                    onMove={this.onCardMove}
				                    updateCardData={this.props.updateCardData}
				                    onDragStart={this.onCardDragStart}
				                    onDragComplete={this.onCardDragComplete}
				                    updateCardSize={this.props.updateCardSize}
				                    onSelectionChange={this.onCardSelectionChange}
				                    setCurrentBoldState={this.props.setCurrentBoldState}
				                    setCurrentItalicState={this.props.setCurrentItalicState}
				                    setCurrentUnderlineState={this.props.setCurrentUnderlineState}

				                    customStylesUtils={this.props.customStylesUtils}
                                    currentColor={this.props.currentColor}
                                    setCurrentColor={this.props.setCurrentColor}
                                    colorHandle={this.props.colorHandle}
                                    setCropperRef={this.props.setCropperRef}
                                    // switchColorHandle={switchColorHandle}
                                    setCurrentFontSize={this.props.setCurrentFontSize}
                                    hasEditorFocus={this.props.editorFocus}
                                    setEditorFocus={this.props.setEditorFocus}
                                    editorState={this.props.editorState}
                                    setEditorState={this.props.setEditorState}
                                    editorBackground={this.props.editorBackground}
                                    setEditorBackground={this.props.setEditorBackground}
                                    setCurrentFontFamily={this.props.setCurrentFontFamily}
                                    currentFontFamily={this.props.currentFontFamily}
                                    setEditorRef={this.props.setEditorRef}
                                    editorRef={this.props.editorRef}/>
		                	</CardWrapper>
		                	{/*shouldInsertLineOnRight */ false && <div className="insert-line-right" />}
		              	</div>
	            	);
	        	})}
        	</div>
    	);
  	}
}

// export default DropTarget("IMAGE", imageTarget, (connect, monitor) => ({
// 	connectDropTarget: connect.dropTarget(),
// 	isOver: monitor.isOver(),
// 	canDrop: monitor.canDrop()
// }))(DropContainer);

