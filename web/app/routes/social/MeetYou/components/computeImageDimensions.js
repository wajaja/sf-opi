import React from 'react';

const SIZES = {
  tall: [500, 750],
  square: [500, 500],
  wide: [500, 250]
};

export default (Component) => {
  return ({ page, ...rest }) => {
    const [canvasWidth, canvasHeight] = SIZES[page.size];
    return <Component page={page} {...rest} {...{canvasWidth, canvasHeight}} />;
  };
};
