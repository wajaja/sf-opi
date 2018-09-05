import React            from 'react';
import classnames       from 'classnames';
import map              from 'lodash/map';
import PropTypes        from 'prop-types'


const SelectedFieldGroup = ({field, value, begin, end, customClassName, error, onChange }) => {
    let interval = [];
    for (var i = begin; i < end+1; i++) {
        interval.push(i)
    }
    const options = map(interval, (val) =>
        <option key={val} value={val}>{val}</option>
    );
    return (
        <select className   = {customClassName} 
                onChange    = {onChange}
                name        = {field} 
                defaultValue= {field} 
        >
            <option value="" >{field}</option>
            {options}
            {error && <span className="help-block">{error}</span>}
        </select>
    )
}
SelectedFieldGroup.propTypes = {
    field       : PropTypes.string.isRequired,
    error       : PropTypes.string,
    begin       : PropTypes.number,
    end         : PropTypes.number,
    onChange    : PropTypes.func.isRequired,
}

SelectedFieldGroup.defaultProps = {
    value        : "",
}

export default SelectedFieldGroup;