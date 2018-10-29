import React from 'react';
import PropTypes from 'prop-types';

export default class TextPicker extends React.PureComponent{

    handleSelect = (val) => {
        this.props.pushEditor && this.props.pushEditor(val);
    }

    render() {
        const { selected, textCards } = this.props;

        return (
            <React.Fragment>
                <div className="add-ctnr">
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
                </div>
                <div className="list-txts-ctnr">
                    {textCards  && textCards.map(function() {
                        return(
                            <div>text list</div>
                        )
                    })}
                </div>
            </React.Fragment>
        )
    }
};


// <TextPath
//     x={30}
//     y={30}
//     fill="#000"
//     text="simple text zone"
//     align='center'
//     data='M100,100 C100,20 40,200 100,100 S345,140 100,250'
//     fontSize={25}
//     fontFamily="Arial"
//     fontStyle="italic"
//     letterSpacing="1"
// />