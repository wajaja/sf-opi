import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { Rnd }              from "react-rnd";
import { getEmptyImage }    from 'react-dnd-html5-backend';
import ItemTypes            from './ItemTypes';
import DndEditor            from './DndEditor';
import Image                from './Image';


const cardSource = {
    beginDrag(props) {
        const { id, order, type, url, content } = props;
        const draggedCard = { id, order, type, url, content };
        let card;
        if (props.selectedCard.id === props.id) {
            card = props.selectedCard;
        } else {
          card = draggedCard;
        }

        // const otherCards = cards.concat();
        // otherCards.splice(cards.findIndex(c => c.id === props.id), 1);
        //const cardsDragStack = [draggedCard, ...otherCards];
        return { card, /*cardsDragStack,*/ draggedCard };
    },

    endDrag(props, monitor) {
        props.onDragComplete(monitor.getItem());
    },
};

const cardTarget = {
    hover(props, monitor, component) {
        const item = monitor.getItem();
        const pointerOffset = monitor.getClientOffset();
        const hoverId = props.id;
        props.onMove(item, hoverId, pointerOffset);
    },
};

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    //connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
}))
export default class Card extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        //connectDragPreview: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        onSelectionChange: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        item: PropTypes.object,
        id: PropTypes.number.isRequired,
        order: PropTypes.number.isRequired,
        url: PropTypes.string.isRequired,
        onMove: PropTypes.func.isRequired,
        onDragStart: PropTypes.func.isRequired,
        onDragComplete: PropTypes.func.isRequired,
        // selectedCard: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            width: 100,
            height: 60,
            x: 0,
            y: 0
        }
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        // Use empty image as a drag preview so browsers don't draw it
        // and we can draw whatever we want on the custom drag layer instead.
        // this.props.connectDragPreview(getEmptyImage(), {
        //   // IE fallback: specify that we'd rather screenshot the node
        //   // when it already knows it's being dragged so we can hide it with CSS.
        //   captureDraggingState: true,
        // });
    }

    componentWillReceiveProps(nextProps, nextState) {
        //console.log('componentWillReceiveProps', nextProps);
        //isDragging --> from Container
        if (!this.props.isDragging && nextProps.isDragging) {
            this.props.onDragStart(nextProps.item);
        }
    }

    onClick(e) {
        this.props.onSelectionChange(this.props.id, e.metaKey, e.shiftKey);
    }

    //callback from react-rnd
    onResize(e, direction, ref, delta, position) {
        console.log(ref.offsetWidth, ref.style.width);
        const changes = {
            width: ref.style.width,
            height: ref.style.height,
            ...position
        };
        this.setState(changes);

        this.props.updateCardSize(this.props.id, changes)
    }

    render() {
        if (this.renderCache) {
            return this.renderCache;
        }

        const { url, type, content, connectDragSource, connectDropTarget } = this.props;

        this.renderCache = connectDragSource(
            connectDropTarget(
                <div onClick={this.onClick} className="card">
                    <Rnd
                        className="card-outer"
                        disableDragging={true}
                        ref={node => (this.node = node)}
                        size={{ width: this.state.width, height: this.state.height }}
                        position={{ x: this.state.x, y: this.state.y }}
                        onResize={this.onResize}>
                        <div className="card-inner">
                            {this.props.type === 'image' && 
                                <Image 
                                    url={url} 
                                    updateCardData={this.props.updateCardData}
                                    {...this.props}
                                    />}
                            {this.props.type === 'edittex' && 
                              <DndEditor  
                                content={content}
                                updateCardData={this.props.updateCardData}

                                customStylesUtils={this.props.customStylesUtils}
                                currentColor={this.props.currentColor}
                                setCurrentColor={this.props.setCurrentColor}
                                colorHandle={this.props.colorHandle}
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
                                editorRef={this.props.editorRef}
                                {...this.props}/>}
                      </div>
                    </Rnd>
                </div>
            )
        );

        return this.renderCache;
    }
}
