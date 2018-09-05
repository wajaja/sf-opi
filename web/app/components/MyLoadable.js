import React        from 'react';
import Loadable 	from 'react-loadable';
const Loading = () => {
    return(
        <div className="load-comp">loading</div>
    )
}

export default function MyLoadable(opts) {
    return Loadable(Object.assign({
        loading: Loading,
        delay: 200,
        timeout: 10000,
    }, opts));
};