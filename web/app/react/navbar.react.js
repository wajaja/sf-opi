var SearchSection = React.createClass({
    getInitialState: function() {
        return {
            results: []
        }
    },
    componentDidMount: function() {
        this.loadResultsFromServer();
        setInterval(this.loadResultsFromServer, 1000);
    },
    loadNotesFromServer: function() {
        $.ajax({
            url: '',
            success: function (data) {
                this.setState({results: data.results});
            }.bind(this)
        });
    },
    render: function() {
                <div className="results-container">
                    <div className="">Notes</div>
                    <div><i className="fa fa-plus plus-btn"></i></div>
                </div>
                <NoteList notes={this.state.notes} />
        );
    }
});
var NoteList = React.createClass({
    render: function() {
        var noteNodes = this.props.notes.map(function(note) {
            return (
                <NoteBox username={note.username} avatarUri={note.avatarUri} date={note.date} key={note.id}>{note.note}</NoteBox>
            );
        });
        return (
            <section id="cd-timeline">
                {noteNodes}
            </section>
        );
    }
});
var NoteBox = React.createClass({
    render: function() {
        return (
            <div className="cd-timeline-block">
                <div className="cd-timeline-img">
                    <img src={this.props.avatarUri} className="img-circle" alt="Leanna!" />
                </div>
                <div className="cd-timeline-content">
                    <h2><a href="#">{this.props.username}</a></h2>
                    <p>{this.props.children}</p>
                    <span className="cd-date">{this.props.date}</span>
                </div>
            </div>
        );
    }
});
window.NoteSection = NoteSection;
