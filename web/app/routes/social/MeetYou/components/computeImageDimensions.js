import React from 'react';

export const SIZES = {
  tall: [500, 400],
  square: [400, 400],
  wide: [300, 400]
};

export default (Component) => {
  	return ({ page, ...rest }) => {
	    const [canvasWidth, canvasHeight] = SIZES[page.size];
	    return <Component page={page} {...rest} {...{canvasWidth, canvasHeight}} />;
  	};
};
