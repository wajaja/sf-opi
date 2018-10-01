import React from 'react';
import {connect} from 'react-redux';
import {
    setFilter, setFont, setFontSize, 
    setColor, setBold, setItalic, setSize
}                   from '../../../actions/social/MeetYou';

import Card from './components/Card';
import FiltersPicker from './components/FiltersPicker';
import TextPropertiesPicker from './components/TextPropertiesPicker';
import SizePicker from './components/SizePicker';
import DownloadButton from './components/DownloadButton';
import Foot            from './Foot'

const RightSidebar = ({ drawing, filter, onFilterChange, textAttrs, onFontChange, onFontSizeChange, onColorChange, onBoldChange, onItalicChange, size, onSizeSelect }) => {
    return <div className="Sidebar">
        <Card title="Sizes">
            <SizePicker size={size} onSizeSelect={onSizeSelect} />
        </Card>
        <Card title="Filters">
            <FiltersPicker filter={filter} onFilterChange={onFilterChange} />
        </Card>
        <Card title="Text">
            <TextPropertiesPicker
                textAttrs={textAttrs}
                onFontChange={onFontChange}
                onFontSizeChange={onFontSizeChange}
                onColorChange={onColorChange}
                onBoldChange={onBoldChange}
                onItalicChange={onItalicChange} />
        </Card>
        <DownloadButton drawing={drawing} />
        <div className="Credit">
            <Foot />
        </div>
    </div>;
};

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

export default connect(mapStateToProps, mapDispatchToProps)(RightSidebar);
