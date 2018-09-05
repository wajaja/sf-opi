var UserCategoryRow = React.createClass({
  render: function() {
    return (<tr><th colSpan="2">{this.props.category}</th></tr>);
  }
});

var UserRow = React.createClass({
  render: function() {
    var name = this.props.user.stocked ?
      this.props.user.name :
      <span style={{color: 'red'}}>
        {this.props.user.name}
      </span>;
    return (
      <tr>
        <td>{name}</td>
        <td>{this.props.user.price}</td>
      </tr>
    );
  }
});

var UserTable = React.createClass({
    render: function() {
        var rows = [];
        var lastCategory = null;
        this.props.users.forEach(function(user) {
            if (user.name.indexOf(this.props.filterText) === -1 || (!user.stocked && this.props.inStockOnly)) {
                return;
            }
            if (user.category !== lastCategory) {
                rows.push(<UserCategoryRow category={User.category} key={user.category} />);
            }
            rows.push(<UserRow User={User} key={User.name} />);
                lastCategory = User.category;
        }.bind(this));
    return (
        <table>
            // <thead>
            //     // <tr>
            //     //     <th>Name</th>         return only the body of table instead the all table (incluse head + body)
            //     //     <th>Price</th>
            //     // </tr>
            // </thead>
            <tbody>{rows}</tbody>
        </table>
    );
  }
});


var FilterableUserTable = React.createClass({
    getInitialState: function() {
        return {
          filterText: '',
          inStockOnly: false
        };
    },

    handleUserInput: function(filterText, inStockOnly) {
        this.setState({
          filterText: filterText,
          inStockOnly: inStockOnly
        });
    },
    render: function() {
        return (<div> <SearchBar filterText={this.state.filterText}
                                inStockOnly={this.state.inStockOnly}
                                onUserInput={this.handleUserInput}
                         />
                            <UserTable Users={this.props.Users} filterText={this.state.filterText}
                                inStockOnly={this.state.inStockOnly}
                            />
                </div>
            );
        }
});


var UserS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDOM.render(
  <FilterableUserTable Users={UserS} />,
  document.getElementById('container')
);
