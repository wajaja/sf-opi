import React from 'react';
import createReactClass   from 'create-react-class'
import PropTypes from 'prop-types';

export default createReactClass({
  propTypes: {
    query: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
    onSearchReset: PropTypes.func.isRequired,
    onQueryChange: PropTypes.func.isRequired
  },

  search(e) {
    e.preventDefault();

    const value = this.props.query;

    if (value && value.length > 0) {
      this.props.onSearch(value);
    } else {
      this.props.onSearchReset();
    }
  },

  setQuery(e) {
    e.preventDefault();
    const value = e.target.value;
    this.props.onQueryChange && this.props.onQueryChange(value);
  },

  render() {
    return <form onSubmit={this.search}>
      <input type="text" className="SearchBar" placeholder="Search images" onChange={this.setQuery} value={this.props.query} />
    </form>;
  }
});
