import React, { Component, Fragment } from "react";
import { Scrollbars }     from 'react-custom-scrollbars'

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

    let actives = activeType === 'edittext' ? ['police', 'paragraph'] : ['image'] ;

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
                style={{ height: 80 }}>
                <div className={`sub-m police ${actives.includes("police") ? " active" : ""}`}>
                    <div className="item-top">
                        <div className="fontFamily" data-title="fontFamily">
                            <FontSelector 
                                {...this.props}
                                currentFontFamily={this.props.currentFontFamily}
                                setCurrentFontFamily={this.props.setCurrentFontFamily}
                                addFontFamily={this.props.customStylesUtils.addFontFamily}
                                editorRef={this.props.editorRef}
                                />
                        </div>
                        <div className="fontSize" data-title="fontSize">
                            <FontSizeSelector 
                                {...this.props}
                                currentFontSize={this.props.currentFontSize}
                                handleCurrentFontSizeChange={this.props.handleCurrentFontSizeChange}
                                addFontSize={this.props.customStylesUtils.addFontSize}
                                setCurrentFontSize={this.props.setCurrentFontSize}
                                hasEditorFocus={this.props.editorFocus}
                                />
                        </div>
                    </div>
                    <ul className="sub-menub-lst">
                        <li className="item">
                            <div className="textColor" data-title="textColor">
                                <ColorPicker 
                                    {...this.props}
                                    color={this.props.currentColor}
                                    colorHandle={this.props.colorHandle}
                                    handleColorChange={() =>
                                      this.props.handleCurrentColorChange(this.props.customStylesUtils)
                                    }
                                    setEditorBackground={this.props.setEditorBackground}
                                    setCurrentColor={this.props.setCurrentColor}
                                    />
                            </div>
                        </li>
                        <li className="item">
                            <div className="bold" data-title="bold">
                                <div 
                                    className={currentBoldState ? `ico active` : `ico`} 
                                    onClick={() => onToggleDefaultInlineStyles('BOLD', !currentBoldState)}></div>
                            </div>
                        </li>
                        <li className="item">
                            <div className="italic" data-title="italic">
                                <div 
                                    className={currentItalicState ? `ico active` : `ico`} 
                                    onClick={() => onToggleDefaultInlineStyles('ITALIC', !currentItalicState)}></div>
                            </div>
                        </li>
                        <li className="item">
                            <div className="underline" data-title="underline">
                                <div 
                                    className={currentUnderlineState ? `ico active` : `ico`} 
                                    onClick={() => onToggleDefaultInlineStyles('UNDERLINE', !currentUnderlineState)}></div>
                            </div>
                        </li>
                        <li className="item" style={{display: 'none'}}>
                            <div className="code" data-title="code">
                                <div 
                                    className={currentCodeState ? `ico active` : `ico`} 
                                    onClick={() => onToggleDefaultInlineStyles('CODE', !currentCodeState)}></div>
                            </div>
                        </li>
                    </ul>
                    {!!actives.includes("police") && <div className="inactive"></div>}
                </div>
                <div className={`sub-m paragraph ${actives.includes("paragraph") ? " active" : ""}`}>
                    <ul className="sub-menub-lst">
                        <li className="item">
                            <div className="alignLeft" data-title="alignLeft">
                                <TextAlign 
                                    value="left" 
                                    toggleTextAlign={this.props.toggleTextAlign}
                                    currentTextAlign={this.props.currentTextAlign}
                                    />
                            </div>
                        </li>
                        <li className="item">
                            <div className="alignCenter" data-title="alignCenter">
                                <TextAlign 
                                    value="center" 
                                    toggleTextAlign={this.props.toggleTextAlign}
                                    currentTextAlign={this.props.currentTextAlign}
                                    />
                            </div>
                        </li>
                        <li className="item">
                            <div className="alignRight" data-title="alignRight">
                                <TextAlign 
                                    value="right" 
                                    toggleTextAlign={this.props.toggleTextAlign}
                                    currentTextAlign={this.props.currentTextAlign}
                                    />
                            </div>
                        </li>
                        <li className="item">
                            <div className="alignJustify" data-title="alignJustify">
                                <TextAlign 
                                    value="justify" 
                                    toggleTextAlign={this.props.toggleTextAlign}
                                    currentTextAlign={this.props.currentTextAlign}
                                    />
                            </div>
                        </li>
                        <li className="item" style={{display: 'none'}}>
                            <div className="lineHeight" data-title="lineHeight">
                            </div>
                        </li>
                        <li className="item" style={{display: 'none'}}>
                            <div className="textSpacing" data-title="textSpacing">
                            </div>
                        </li>
                    </ul>
                    {!!actives.includes("paragraph") && <div className="inactive"></div>}
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