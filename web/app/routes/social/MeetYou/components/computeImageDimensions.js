import React from 'react';

const SIZES = {
  tall: [400, 600],
  square: [400, 400],
  wide: [400, 200]
};

export default (Component) => {
  	return ({ page, ...rest }) => {
	    const [canvasWidth, canvasHeight] = SIZES[page.size];
	    return <Component page={page} {...rest} {...{canvasWidth, canvasHeight}} />;
  	};
};
