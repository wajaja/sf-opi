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

    componentDidMount() {
        if(this.props.type === 'image')
            this.props.onSearchReset();
        else if(this.props.type === 'background') 
            this.props.onLoadBackgrounds();
    },

    search(e) {
        e.preventDefault();

        const value = this.state.query;

        if (this.props.type === 'image' && value && value.length > 0) {
          this.props.onSearch(value);
        } else if(this.props.type === 'background') {
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
