import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class CardWrapper extends PureComponent {
  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    isHovered: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  render() {
    const { isDragging, isSelected, isActive, isHovered, /*x, y*/ } = this.props;

    const styleClasses = [];
    if (isActive) {
      styleClasses.push('card-wrapper-active');
    }
    if (isSelected) {
      styleClasses.push('card-wrapper-selected');
    }
    if (isDragging) {
      styleClasses.push('card-wrapper-dragging');
    }
    if (isHovered) {
      styleClasses.push('card-wrapper-hovered');
    }

    return <div className={'card-wrapper ' + styleClasses.join(' ')}>{this.props.children}</div>;
  }
}
