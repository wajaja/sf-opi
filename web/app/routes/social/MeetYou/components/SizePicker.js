import React from 'react';
import createReactClass   from 'create-react-class'
import PropTypes from 'prop-types';
import Option from './Option';

const SizeItem = ({ name, code, currentCode, onSelect }) => {
  const onClick = (e) => {
    e.preventDefault();
    onSelect(code);
  };
  const className = `SizePicker-size SizePicker-size--${code}`;

  return <div className={className} onClick={onClick}>
    <Option selected={code === currentCode}>
      {name}
    </Option>
  </div>
};

export default createReactClass({
  propTypes: {
    size: PropTypes.oneOf(['tall', 'square', 'wide']).isRequired,
    onSizeSelect: PropTypes.func.isRequired
  },

  render() {
    const {size, onSizeSelect} = this.props;

    return <div className="SizePicker">
      <SizeItem name="Tall" code="tall" currentCode={size} onSelect={onSizeSelect} />
      <SizeItem name="Square" code="square" currentCode={size} onSelect={onSizeSelect} />
      <SizeItem name="Wide" code="wide" currentCode={size} onSelect={onSizeSelect} />
    </div>;
  }
});
