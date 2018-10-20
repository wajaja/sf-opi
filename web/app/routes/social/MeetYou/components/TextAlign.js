import React from 'react';

export default ({currentTextAlign, value, toggleTextAlign}) => {
  	return <div 
  				onClick={() => toggleTextAlign(value)}
  				className={`ico ${currentTextAlign === value ? " active" : "ico"}`} 
  				/>;
};