import React 	from 'react';
// import styles 	from './LoadingIndicator.css';

export default function LoadingIndicator({ post }) {
  return (
    <div className="loading-ind-ctnr">
      <i className="fa fa-twitter" /> Streaming some tweets...
    </div>
  );
}