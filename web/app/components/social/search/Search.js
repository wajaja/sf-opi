import React            from 'react'
import createReactClass from 'create-react-class'
import { connect }      from 'react-redux'
import ReactDOM         from 'react-dom'
import Filters          from './filter'
import { BASE_PATH } from '../../../config/api'

import { Search as SearchActions } from '../../../actions/social'

//import '../../styles/user/user-search.scss'

//diplay the matched users list

//////
const Search  = createReactClass({

    getInitialState() {
        return {
            data:[],
            query:'',
            value: '',
            active: false,
            filteredData: [],
            intervalDataUsers:false,
        }
    },

    onFocus(e) {
        console.log('search recieve focus')
        this.setState({active: true})
    },

    onBlur(e) {
        this.setState({active: false})
    },

    /**
     * handleSearchChange
     * @param e event
     */
    handleSearchChange(e){

        this.setState({
            value: e.target.value,
        })


        if (this.$i) clearTimeout(this.$i)

        this.$i = setTimeout(() => {

            this.setState({ active: true })

            if (this.state.value == '') {
                //get Recent search
                this.props.dispatch(SearchActions.recent())
                return
            }

            const term = this.state.value,
            params      = `q=${encodeURIComponent(term)}&inline=true`

            this.props.dispatch(SearchActions.search(term, params))
        }, 200)
    },


    //redirect user at site.com/search route
    handleSubmit(e) {
        // e.preventDefault();
        const self = this
         this.setState({
            active: self.state.value == '' ? false : true,
        })

        const term = this.state.value,
        params = `q=${encodeURIComponent(term)}&inline=false&tag=all`
        
        this.props.dispatch(SearchActions.search(term, params))
        .then((res) => this.props.history.push(`/search?q=${encodeURIComponent(this.state.value)}&tag=all`),
              (err) => console.log("error happen")
        )
    },


    /**
     * componentDidMount
     */
    componentDidMount() {
        this.props.dispatch(SearchActions.recent())   
        //programmatically focus inputSearch
        if(this.props.location.pathname === '/search' && !this.state.value) {
            findDOMNode(this._searchField).focus()
        }
    },

    /**
     * componentDidUpdate
     * @param oldProps
     */
    componentDidUpdate(oldProps) {
        if (this.props.search.active != oldProps.search.active) {
        }
    },

    // doSearch(queryText){
    //     //this.getStorageData();
    //     console.log(queryText)
    //     //var users = this.state.users;
    //     var queryResult=[];                 //get query result
        
    //     this.state.data.forEach(function(person){
    //         if(person.name.toLowerCase().indexOf(queryText)!=-1)
    //         queryResult.push(person);
    //     });
 
    //     this.setState({
    //         query:queryText,
    //         filteredData: queryResult
    //     })
    // },

    render() {

        const { recentHits, recentTerms, hits, term, total } = this.props.search
        
        return (
            <div className="frm-contrib-ctnr-b">
                <form action={`/search?q=${encodeURIComponent(this.state.value)}&tag=all`} className="form-search" onSubmit={this.handleSubmit} id="form-search">
                    <input  type="text"
                        ref={el => this._searchField = el } 
                        name="query" 
                        placeholder="search user by his name or username" 
                        className="gb-input-search" 
                        value={this.props.query} 
                        onChange={this.handleSearchChange} 
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                    />
                    <button type="submit" className="icon-search-ctnr">
                        <span className="glyphicon glyphicon-search"></span>
                    </button>                                    
                </form>
                {this.state.active && 
                    <Filters
                        onClick={this.handleFilterClick}
                        recentTerms={recentTerms}
                        recentHits={recentHits}
                        history={this.props.history}
                        dispatch={this.props.dispatch}
                        results={hits}
                        total={total}
                        term={term}/>
                }
            </div>
        );
    }
})

export default connect(state => ({
    search: state.Search
}) /*, */)(Search)