import React, { Component, Fragment } from "react";
import { Scrollbars }     from 'react-custom-scrollbars'
import { ActionCreators } from 'redux-undo';

import {
    ColorPicker,
    BackgroundColorPicker,
    FontSelector,
    FontSizeSelector 
} from '../../../components';

import FiltersPicker    from './components/FiltersPicker'
import CropButton       from './components/CropButton'
import Transparence     from './components/Transparence'
import TextAlign        from './components/TextAlign'
import PathColors       from './DnD/PathColors'
import StrockePicker    from './components/StrockePicker'


class HMenu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selected: props.selected,
      itemsCount: 3,
      alignCenter: true,
      dragging: true,
      clickWhenDrag: false,
      transition: 0.4,
      wheel: true
    };

    this.scrollbars = null;
  }

  onUpdate = ({ translate }) => {
    console.log(`onUpdate: translate: ${translate}`);
    this.setState({ translate });
  };

  onSelect = key => {
    console.log(`onSelect: ${key}`);
    this.setState({ selected: key });
  };

  componentDidUpdate(prevProps, prevState) {
    
  }

  setSelected = ev => {
    const { value } = ev.target;
    this.setState({ selected: String(value) });
  };

    onUndoClick = (type) => {
        if(type === 'last')
            this.props.dispatch(ActionCreators.undo()) // undo the last action
        else 
            this.props.dispatch(ActionCreators.redo()) // undo the last action
    }

    onMoveZindex = (val) => {
        this.props.onMoveZindex(val)
    }


  render() {
    const {
      selectedCard,
      onToggleDefaultInlineStyles
    } = this.props;

    let nextPossible = true; // relative to undo/redo
    let lastPossible = true; // relative to undo/redo
    const cardActive = !!selectedCard;
    const imageActive = selectedCard && (selectedCard.type === 'image' || selectedCard.type === 'vectorImage')

    return (
        <div className="HMenu">
            <div className="translate-lft-btn">
                <div className="ico l" onClick={(e) => this.scrollToLeft()}></div>
            </div>
            <div
                className="HMenu-a"
                ref={el => (this.scrollbars = el)}
                >
                <div className="sub-m undo-ctrn">
                    <ul className="sub-menub-lst">
                        <li className="item">
                            <button type="button"  disabled={!lastPossible} className="last">
                                <div className="ico" onClick={() => this.onUndoClick('last')}></div>
                            </button>
                        </li>
                        <li className="item">
                            <button type="button"  disabled={!nextPossible} className="next">
                                <div className="ico" onClick={() => this.onUndoClick('next')}></div>
                            </button>
                        </li> 
                        <li className="item">
                            <button type="button"  disabled={!cardActive} className="move-zIn-top">
                                <div className="ico" onClick={() => this.onMoveZindex(1)}></div>
                            </button>
                        </li> 
                        <li className="item">
                            <button type="button"  disabled={!cardActive} className="move-zIn-bottom">
                                <div className="ico" onClick={() => this.onMoveZindex(-1)}></div>
                            </button>
                        </li>                        
                    </ul>
                </div>
                <div className={`sub-m image ${imageActive ? " active" : ""}`}>
                    <ul className="sub-menub-lst">
                        <li className="item">
                            <div className="filter" data-title="filter">
                                {!!selectedCard && <FiltersPicker 
                                    selectedCard={selectedCard}
                                    filter={this.props.filter} 
                                    updateCardRGBA={this.props.updateCardRGBA}
                                    />
                                }
                            </div>
                        </li>
                        <li className="item">
                            <div className="crop" data-title="crop">
                                {!!selectedCard && <CropButton 
                                    selectedCard={selectedCard}
                                    selectedCardId={this.props.selectedCardId}
                                    saveCroppedImage={this.props.saveCroppedImage}
                                    rotateLeft={this.props.rotateLeft}
                                    rotateRight={this.props.rotateRight} />
                                }
                            </div>
                        </li>
                        <li className="item">
                            <div className="transparency" data-title="transparency">
                                {!!selectedCard && <StrockePicker 
                                    selectedCard={selectedCard}
                                    updateCardStroke={this.props.updateCardStroke}
                                    />
                                }
                            </div>
                        </li>
                    </ul>
                    {!selectedCard && 
                      (!!selectedCard && (selectedCard.type !== "image" || selectedCard.type !== "vectorImage")) && 
                      <div className="inactive"></div>
                    }
                </div>
                <PathColors
                    {...this.props}
                    selectedCard={selectedCard}
                    setVectorImageColor={this.props.setVectorImageColor}
                    />
            </div>
            <div className="translate-rght-btn">
                <div className="ico r" onClick={(e) => this.scrollToRight()}></div>
            </div>
      </div>
    );
  }
}

export default HMenu;

// <li className="item">
//                             <div className="textBackColor" data-title="textBackColor">
//                                 <BackgroundColorPicker 
//                                     {...this.props}
//                                     color={this.props.currentColor}
//                                     colorHandle={this.props.colorHandle}
//                                     handleColorChange={() =>
//                                       handleCurrentColorChange(this.props.customStylesUtils)
//                                     }
//                                     setEditorBackground={this.props.setEditorBackground}
//                                     setCurrentColor={this.props.setCurrentColor}
//                                     />
//                             </div>
//                         </li>