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

  getInitialState() {
    return{
      query: "",
    }
  },

  // componentDidMount() {
  //   this.props.onSearchReset();
  // },

  search(e) {
    e.preventDefault();

    const value = this.state.query;

    if (value && value.length > 0) {
      this.props.onSearch(value);
    } else {
      this.props.onSearchReset();
    }
  },

  setQuery(e) {
    e.preventDefault();
    const value = e.target.value;
    this.setState({query: value})
    //this.props.onQueryChange && this.props.onQueryChange(value);
  },

  render() {
    return <form onSubmit={this.search}>
      <input 
        type="text" 
        className="SearchBar" 
        placeholder="Search images" 
        onChange={this.setQuery} 
        value={this.state.query} />
    </form>;
  }
});
