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

  componentDidMount() {
      this.props.onLoadBackgrounds();
  },

  handleSelect(image) {
    this.props.onSelect && this.props.onSelect(image);
  },

  render() {
    const selected = this.props.selected || {};
    return (
      <div className="BackgroundPicker">
          {this.props.images && this.props.images.map(image => {
            const sel = image.url === selected.url;
            const className = 'ImagePicker-image' + (sel ? ' ImagePicker-image--selected' : '');
            const imageUrl = image.url + "&w=364";

            return (
              <div className={className} onClick={this.handleSelect.bind(this, image)} key={image.url}>
                <Option selected={sel} borderStyle="thick-transparent">
                    <img src={imageUrl}/ >
                </Option>
              </div>
            )
        })}
      </div>
    )
  }
});
