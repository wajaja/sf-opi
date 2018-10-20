import React from 'react';
import PropTypes from 'prop-types';

export default class TextPicker extends React.PureComponent{

    handleSelect = (val) => {
        this.props.pushEditor && this.props.pushEditor(val);
    }

    render() {
        const selected = this.props.selected || {};
        return (
            <React.Fragment>
                <div className="add-edtx-btn" onClick={this.handleSelect.bind(this, 'richtext')}>
                  <div>
                      rich zone text
                  </div>
                </div>
                <div className="add-tx-btn" onClick={this.handleSelect.bind(this, 'text')}>
                    <div>
                      simple text zone
                    </div>
                </div>
            </React.Fragment>
        )
    }
};
