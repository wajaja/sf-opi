import React from 'react';
import createReactClass   from 'create-react-class'
import PropTypes from 'prop-types';
import Option from './Option';

export default createReactClass({
  propTypes: {
    images: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string })).isRequired,
    selectedImage: PropTypes.shape({ url: PropTypes.string }),
    onSelect: PropTypes.func
  },

  getInitialState() {
    return{

    }
  },

  handleSelect(image) {
      this.props.onSelect && this.props.onSelect(image);
  },

  render() {
    const selected = this.props.selected || {};
    return <div className="ImagePicker">
      {this.props.images && this.props.images.map(image => {

        return (
          <div className="ImagePicker-image" onClick={(e) => this.handleSelect(image)} key={image.url}>
            <Option borderStyle="thick-transparent">
                <img src={image.url}/ >
            </Option>
          </div>
        )
      })}
    </div>;
  }
});
