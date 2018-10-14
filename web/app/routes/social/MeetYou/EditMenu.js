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
                className="Menubar" 
                onMouseOver={(e) => this.setState({hover: false})}
                onMouseOver={(e) => this.setState({hover: true})}>
                <div className="Menubar-a">
                    <div className="Menubar-lft">
                        <div className="sub-menub">
                            <ul className="sub-menub-lst">
                                <li className="item">
                                    <div className="ico edittext"></div>
                                </li>
                                <li className="item">
                                    <div className="ico image"></div>
                                </li>
                                <li className="item">
                                    <div className="ico modele"></div>
                                </li>
                                <li className="item">
                                    <div className="ico fill"></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="Menubar-ctr">
                        <HMenu 
                            {...this.props}
                            translate={this.state.translateX} 
                            activeType={activeType}
                            />
                    </div>
                    <div className="Menubar-rght">
                        <div className="sub-menub">
                            <ul className="sub-menub-lst">
                                <li className="item">
                                    <div className="send">send</div>
                                </li>
                                <li className="item">
                                    <div className="post">post</div>
                                </li>
                                <li className="item">
                                    <div className="share">share</div>
                                </li>
                                <li className="item">
                                    <div className="download">download</div>
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
