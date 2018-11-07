import React, { PureComponent } from 'react';
import TextEditor 				from '../components/TextEditor'

const TOTAL_ITEMS = 0;

// const getNodeClientBounds = node => {
//   	const el = node.nodeType === 1 ? node : node.parentElement;
//   	if (!el) {
//     	return null;
//   	}
//   	return el.getBoundingClientRect();
// };

export default class Container extends PureComponent {
  	constructor(props) {
	    super(props);

	    this.state = {
			selectedCard: {},
			insertIndex: -1,
			cards: props.cards
	    };
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
	    // id={card.id}  //
		   //                  unique={card.unique}  //eg: 1_0
		   //                  order={card.order}
		   //                  type={card.type}
		   //                  url={card.url}
	    return (
	        <div
				className="dnd-container"
				style={{
					marginTop: "30px",
					minHeight: "200px",
					position: 'fixed',
    				bottom: '4px',
					width: "500px",
					display: this.props.isEditing ? 'block' : 'none',
					//maxHeight: this.props.zoneHeight + "px"
				}}
				ref={el => { this.container = el}}>
				<div className="dnd-container-a">
              		<TextEditor
              			isEditing={this.props.isEditing}
              			editedCardId={this.props.editedCardId}
	                    selectedCardId={selectedCardId}
	                    editorStates={this.props.editorStates}
	                   	imageFilter={this.props.filter}
	                    onMove={this.onCardMove}
	                    cardId={this.props.selectedCardId}
	                    updateEditorCard={this.props.updateEditorCard}
	                    onDragStart={this.onCardDragStart}
	                    onDragComplete={this.onCardDragComplete}
	                    // updateCardSize={this.props.updateCardSize}
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
                </div>
        	</div>
    	);
  	}
}

