var Table = React.createClass({
  render: function () {
    return (
      <table>
        <tbody>
        {this.props.data.map(function(row) {
          return (
            <tr>
              {row.map(function(cell) {
                return <td>{cell}</td>;
              })}
            </tr>);
        })}
      </tbody></table>);
  }
});
