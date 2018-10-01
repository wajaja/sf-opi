import React from 'react';
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types';

export default createReactClass({
  propTypes: {
    drawing: PropTypes.string
  },

  handleDownload(e) {
    const uri = this.props.drawing;
    const link = e.target;
    link.href = uri;
    link.click();
  },

  render() {
    return <div>
      <a className="Button" download="pabla.jpg" target="_blank" onClick={this.handleDownload}>Download</a>
    </div>;
  }
});
