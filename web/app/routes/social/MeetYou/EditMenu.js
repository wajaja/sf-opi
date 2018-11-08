import React                from 'react';
import {connect}            from 'react-redux';
import {
    setFilter, setFont, setFontSize, 
    setColor, setBold, setItalic, setSize
}                           from '../../../actions/social/MeetYou';

import Card                 from './components/Card';
import FiltersPicker        from './components/FiltersPicker';
// import TextPropertiesPicker from './components/TextPropertiesPicker';
import SizePicker           from './components/SizePicker';
import DownloadButton       from './components/DownloadButton';
import Foot                 from './Foot'
import HMenu                from './HMenu'

class EditMenu extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            translateX: 0,
            hover: false,
        }
    }


    render() {

        const { drawing, filter, onFilterChange, 
            textAttrs, onFontChange, onFontSizeChange, 
            onColorChange, onBoldChange, size, onSizeSelect,
            selectedCard, editing,
            onItalicChange } = this.props;


        let activeType = !!selectedCard ? selectedCard.type : ''
        return (
            <div 
                className="Menubar top" 
                onMouseOver={(e) => this.setState({hover: false})}
                onMouseOver={(e) => this.setState({hover: true})}>
                <div className="Menubar-a">
                    <div className="Menubar-lft">
                        <div className="sub-menub">
                            <ul className="sub-menub-lst">
                                <li className="item">
                                    <div 
                                        className="ico edittext" 
                                        onClick={() => this.props.switchLefSide('text')}></div>
                                </li>
                                <li className="item">
                                    <div 
                                        className="ico image"
                                        onClick={() => this.props.switchLefSide('image')}></div>
                                </li>
                                <li className="item">
                                    <div 
                                        className="ico fill"
                                        onClick={() => this.props.switchLefSide('fill')}></div>
                                </li>
                                <li className="item">
                                    <div 
                                        className="ico modele"
                                        onClick={() => this.props.switchLefSide('modele')}></div>
                                </li>
                                <li className="item">
                                    <div 
                                        className="ico shape"
                                        onClick={() => this.props.switchLefSide('shape')}></div>
                                </li>
                                <li className="item">
                                    <div 
                                        className="ico path"
                                        onClick={() => this.props.switchLefSide('path')}></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="Menubar-ctr top">
                        <HMenu 
                            {...this.props}
                            selectedCard={selectedCard}
                            toggleTextAlign={this.props.toggleTextAlign}
                            setVectorImageColor={this.props.setVectorImageColor}
                            currentTransparency={this.props.currentTransparency}
                            imageFilter={this.props.imageFilter}
                            translate={this.state.translateX} 
                            activeType={activeType}
                            editorRef={this.props.editorRef}
                            updateCardRGBA={this.props.updateCardRGBA}
                            updateCardStroke={this.props.updateCardStroke}
                            />
                    </div>
                    <div className="Menubar-rght">
                        <div className="sub-menub">
                            <ul className="sub-menub-lst">
                                <li className="item">
                                    <button 
                                        className="btn btn-sm send"
                                        onClick={this.props.openAdminSender}>
                                        <div className="btn-ico"></div>
                                        <div className="txt">send</div>
                                    </button>
                                </li>
                                <li className="item">
                                    <button 
                                        className="btn btn-sm btn-primary post"
                                        onClick={this.props.createPost}>post</button>
                                </li>
                                <li className="item">
                                    <button 
                                        className="btn btn-sm download"
                                        onClick={this.props.download}>
                                        <div className="btn-ico"></div>
                                        <div className="txt">download</div>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

                // <Card title="Sizes">
                //     <SizePicker size={size} onSizeSelect={onSizeSelect} />
                // </Card>
                // <Card title="Filters">
                //     <FiltersPicker filter={filter} onFilterChange={onFilterChange} />
                // </Card>
                // <Card title="Text">
                //     <TextPropertiesPicker
                //         textAttrs={textAttrs}
                //         onFontChange={onFontChange}
                //         onFontSizeChange={onFontSizeChange}
                //         onColorChange={onColorChange}
                //         onBoldChange={onBoldChange}
                //         onItalicChange={onItalicChange} />
                // </Card>
                // <DownloadButton drawing={drawing} />
                // <div className="Credit">
                //     <Foot />
                // </div>
const mapStateToProps = (state) => ({
    textAttrs: state.MeetYou.textAttrs,
    filter: state.MeetYou.filter,
    size: state.MeetYou.size,
    drawing: state.MeetYou.drawing
});

const mapDispatchToProps = (dispatch) => ({
    onFontChange(font) {
        dispatch(setFont(font));
    },

    onFontSizeChange(size) {
        dispatch(setFontSize(size));
    },

    onColorChange(color) {
        dispatch(setColor(color));
    },

    onBoldChange(bold) {
        dispatch(setBold(bold));
    },

    onItalicChange(italic) {
        dispatch(setItalic(italic));
    },

    onFilterChange(filter) {
        dispatch(setFilter(filter));
    },

    onSizeSelect(size) {
        dispatch(setSize(size));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditMenu);
