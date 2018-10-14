import React, { Component, Fragment } from "react";
import { Scrollbars }     from 'react-custom-scrollbars'

import {
    ColorPicker,
    BackgroundColorPicker,
    FontSelector,
    FontSizeChanger 
} from '../../../components';


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
      activeType
    } = this.props;

    let actives = activeType === 'edittext' ? ['police', 'paragraph'] : ['image'] ;

    // const { name, items } = el;
    // let active  = actives.includes(name);
    return (
        <div className="HMenu">
            <div className="translate-lft-btn">
                <div className="ico l" onClick={(e) => this.scrollToLeft()}></div>
            </div>
            <Scrollbars
                universal
                autoHide
                className="HMenu-a"
                ref={el => (this.scrollbars = el)}
                renderTrackHorizontal={props => <div {...props} className="hidden-track-horizontal"/>}
                renderThumbHorizontal={props => <div {...props} className="hidden-thumb-horizontal"/>}
                style={{ height: 80 }}>
                <div className={`sub-m ${name} ${actives.includes("police") ? " active" : ""}`}>
                    <ul className="sub-menub-lst">
                        <li className="item">
                            <div className="fontFamily" data-title="fontFamily">
                                <FontSelector 
                                    {...this.props}
                                    currentFontFamily={this.props.currentFontFamily}
                                    setCurrentFontFamily={this.props.setCurrentFontFamily}
                                    addFontFamily={this.props.customStylesUtils.addFontFamily}
                                    editorRef={this.props.editorRef}
                                    />
                            </div>
                        </li>
                        <li className="item">
                            <div className="fontSize" data-title="fontSize">
                                <FontSizeChanger 
                                    {...this.props}
                                    currentFontSize={this.props.currentFontSize}
                                    handleCurrentFontSizeChange={this.props.handleCurrentFontSizeChange}
                                    addFontSize={this.props.customStylesUtils.addFontSize}
                                    setCurrentFontSize={this.props.setCurrentFontSize}
                                    hasEditorFocus={this.props.editorFocus}
                                    />
                            </div>
                        </li>
                        <li className="item">
                            <div className="textColor" data-title="textColor">
                                <ColorPicker 
                                    {...this.props}
                                    color={this.props.currentColor}
                                    colorHandle={this.props.colorHandle}
                                    handleColorChange={() =>
                                      handleCurrentColorChange(this.props.customStylesUtils)
                                    }
                                    setEditorBackground={this.props.setEditorBackground}
                                    setCurrentColor={this.props.setCurrentColor}
                                    />
                            </div>
                        </li>
                        <li className="item">
                            <div className="textBackColor" data-title="textBackColor">
                                <BackgroundColorPicker 
                                    {...this.props}
                                    color={this.props.currentColor}
                                    colorHandle={this.props.colorHandle}
                                    handleColorChange={() =>
                                      handleCurrentColorChange(this.props.customStylesUtils)
                                    }
                                    setEditorBackground={this.props.setEditorBackground}
                                    setCurrentColor={this.props.setCurrentColor}
                                    />
                            </div>
                        </li>
                        <li className="item">
                            <div className="bold" data-title="bold">
                                <div 
                                    className={this.props.currentBoldState ? `ico active` : `ico`} 
                                    onClick={this.props.onBoldChange}></div>
                            </div>
                        </li>
                        <li className="item">
                            <div className="italic" data-title="italic">
                                <div 
                                    className={this.props.currentItalicState ? `ico active` : `ico`} 
                                    onClick={this.props.onItalicChange}></div>
                            </div>
                        </li>
                        <li className="item">
                            <div className="underline" data-title="underline">
                                <div 
                                    className={this.props.currentUnderlineState ? `ico active` : `ico`} 
                                    onClick={this.props.onUnderlineChange}></div>
                            </div>
                        </li>
                    </ul>
                    {!!active && <div className="inactive"></div>}
                </div>
                <div className={`sub-m ${name} ${actives.includes("paragraph") ? " active" : ""}`}>
                    <ul className="sub-menub-lst">
                        <li className="item">
                            <div className="alignLeft" data-title="alignLeft">
                            </div>
                        </li>
                        <li className="item">
                            <div className="alignCenter" data-title="alignCenter">
                            </div>
                        </li>
                        <li className="item">
                            <div className="alignRight" data-title="alignRight">
                            </div>
                        </li>
                        <li className="item">
                            <div className="alignJustify" data-title="alignJustify">
                            </div>
                        </li>
                        <li className="item">
                            <div className="textColor" data-title="textColor">
                            </div>
                        </li>
                        <li className="item">
                            <div className="lineHeight" data-title="lineHeight">
                            </div>
                        </li>
                        <li className="item">
                            <div className="textSpacing" data-title="textSpacing">
                            </div>
                        </li>
                    </ul>
                    {!!active && <div className="inactive"></div>}
                </div>
                <div className={`sub-m ${name} ${actives.includes("image") ? " active" : ""}`}>
                    <ul className="sub-menub-lst">
                        <li className="item">
                            <div className="filter" data-title="filter">
                                <FiltersPicker 
                                    filter={this.props.IimageFilter} 
                                    onFilterChange={this.props.onFilterChange}
                                    />
                            </div>
                        </li>
                        <li className="item">
                            <div className="crop" data-title="crop">
                            </div>
                        </li>
                        <li className="item">
                            <div className="rotate90" data-title="rotate90">
                            </div>
                        </li>
                        <li className="item">
                            <div className="rotate180" data-title="rotate180">
                            </div>
                        </li>
                        <li className="item">
                            <div className="transparency" data-title="transparency">
                            </div>
                        </li>
                    </ul>
                    {!!active && <div className="inactive"></div>}
                </div>
            </Scrollbars>
            <div className="translate-rght-btn">
                <div className="ico r" onClick={(e) => this.scrollToRight()}></div>
            </div>
      </div>
    );
  }
}

export default HMenu;