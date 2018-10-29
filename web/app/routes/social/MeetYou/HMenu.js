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
      activeType,
      currentCodeState,
      currentColor,
      currentFontFamily,
      currentFontSize,
      currentBoldState,
      currentItalicState,
      currentUnderlineState,
      onToggleDefaultInlineStyles
    } = this.props;

    let actives = activeType === 'edittext' ? ['police', 'paragraph'] : ['image'];
    let nextPossible = true;
    let lastPossible = true;
    let cardActive = true;

    // const { name, items } = el;
    // let active  = actives.includes(name);
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
                <div className={`sub-m image ${actives.includes("image") ? " active" : ""}`}>
                    <ul className="sub-menub-lst">
                        <li className="item">
                            <div className="filter" data-title="filter">
                                <FiltersPicker 
                                    filter={this.props.filter} 
                                    onFilterChange={this.props.onFilterChange}
                                    />
                            </div>
                        </li>
                        <li className="item">
                            <div className="crop" data-title="crop">
                                <CropButton 
                                    selectedCard={this.props.selectedCard}
                                    selectedCardId={this.props.selectedCardId}
                                    saveCroppedImage={this.props.saveCroppedImage}
                                    rotateLeft={this.props.rotateLeft}
                                    rotateRight={this.props.rotateRight} />
                            </div>
                        </li>
                        <li className="item">
                            <div className="transparency" data-title="transparency">
                                <Transparence
                                    currentTransparency={this.props.currentTransparency}
                                    updateCurrentTransparancy={this.props.updateCurrentTransparancy}
                                    />
                            </div>
                        </li>
                    </ul>
                    {!!actives.includes("image") && <div className="inactive"></div>}
                </div>
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