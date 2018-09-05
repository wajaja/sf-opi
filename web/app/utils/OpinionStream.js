import { StreamActions } from '../actions';
// import tinytime from 'tinytime';

const BATCH_SIZE = 20;

// const timeTemplate = tinytime('{Mo}/{DD} {h}:{mm}:{ss} {a}');

/*const stream = require('getstream');*/

// TODO Replace this with something that consumes Twitter's OAUTH API
export default class OpinionStream {
    constructor(dispatch, userId, lastStreamId) {

        import('getstream').then(stream => {
            this.activities = [];
            this._posts     = []; //posts
            this._groups    = []; //aggregated
            this._loading    = false;
            this.userId     = userId;
            this.dispatch   = dispatch;
            this._noResults = false;
            this._lastStreamId= lastStreamId;  ///Work on this 
            this.client     = stream.connect('sewzt6y5y29n', null, '21564');
            this.timeline   = this.client.feed('timeline', userId);
            this.aggregated = this.client.feed('timeline_aggregated', userId);
        });
    }

    // Listen to feed changes in realtime
    // The access token at the end is only needed for client side integrations
    subscribeRealTime(userId) {
        const tToken  = this.client.feed('timeline', userId).getReadOnlyToken(),
        timeline = this.client.feed('timeline', userId, tToken);
        timeline.subscribe(data => {
            this.dispatch(StreamActions.timeline(data))
        }).then(() => {
                //console.log('Full (Timeline Flat): Connected to faye channel, waiting for realtime updates');
            }, (err) => {
                console.error('Full (Timeline Flat): Could not estabilsh faye connection', err);
        });

        
        const fToken = this.client.feed('timeline', userId).getReadOnlyToken(),
        feed    = this.client.feed('user', userId, fToken);
        feed.subscribe(function(data){
            alert("Eric's feed was updated!");
            console.log("Eric's feed was updated!", data);
        }).then(() => {
            // Add an activity when the websocket is ready
            //this.feed.addActivity({actor:'eric', verb: 'tweet', object: 2, tweet: 'Cool stuff!'});
            }, (err) => {
                console.log('faillllll')
        });


        const nToken      = this.client.feed('notification', userId).getReadOnlyToken(),
        notification = this.client.feed('notification', userId, nToken);
        notification.subscribe(data => {
                this.props.dispatch(StreamActions.event(data))
        }).then(() => {
                //console.log('Full (Notifications): Connected to faye channel, waiting for realtime updates');
            }, (err) => {
                console.error('Full (Notifications): Could not estabilsh faye connection', err);
        });
    }

    load() {
        if (this._loading)
            return;

        if(this._noTimeline && this._noAggregated) {
            this._noResults = true;
            return;
        }

        this._loading = true;
        //Read the next page, use id filtering for optimal performance
        let data, last_id;
        if(this.stream_type === 'timeline' && !this._noTimeline) {
            last_id = this._posts.length ? this._posts[-1]['id'] : this._lastStreamId;
            data = this.timeline.get(limit=10, id_lt=last_id);
            data.then((results) => {
                // work with the feed activities
                this._loading = false;
                console.log(results)
                if(!results.length) 
                    this._noTimeline = true;

                this.dispatch(StreamActions.timeline(results)); //perform ajax request to load posts
                this._posts.push(results);
            }, (err) => {
                // Handle or raise the Error.
                console.log(err);
                // TODO check error reason before retrying load function
                // this.load();
                this._loading = true; //TODO remove
            });
            this.stream_type = 'aggregated';
        } else {

            if (!this._groups.length) 
                data = this.aggregated.get(limit=3);
            else 
                data = this.aggregated.get(limit=3, id_lt=this._groups[-1]['id']);

            data.then((results) => {
                // work with the feed activities
                this._loading = false;
                console.log(results)
                if(!results.length) 
                    this._noAggregated = true;

                this.dispatch(StreamActions.aggregated(results)); //perform ajax
                this._groups.push(results);
            }, (err) => {
                // Handle or raise the Error.
                console.log(err);
                // TODO check error reason before retrying load function
                // this.load();
                this._loading = true; //TODO remove
            });
            this.stream_type = 'timeline';
        }

        this.dispatch(StreamActions.setLastTimelineId(this._posts[-1]['id'])); //perform ajax
    }

    loadProfile() {
        if (this._loading)
            return;

        if(this._noResults)
            return;

        this._loading = true;
        const last_id = (this.activities && this.activities.length) ? this.activities[-1]['id'] : this._lastActivityId;
        const feed    = this.client.feed('user', this.userId);
        const data    = feed.get(limit=10, id_lt=last_id);
        data.then((results) => {
            // work with the feed activities
            this._loading = false;
            console.log(results)
            if(!results.length) 
                this._noResults = true;

            this.dispatch(StreamActions.feed(data)) //perform ajax request for each activities
            this.activities.push(results);
        }, (err) => {
            // Handle or raise the Error.
            console.log(err);
            // TODO check error reason before retrying load function
            // this.load();
            this._loading = true; //TODO remove after test
        });
    }

    loadGroup() {
        if (this._loading)
            return;

        if(this._noResults)
            return;

        this._loading = true;
        const last_id = (this.activities && this.activities.length) ? this.activities[-1]['id'] : this._lastActivityId;
        const feed    = this.client.feed('group_users', this.userId);
        const data    = feed.get(limit=10, id_lt=last_id);
        data.then((results) => {
            // work with the feed activities
            this._loading = false;
            console.log(results)
            if(!results.length) 
                this._noResults = true;

            this.dispatch(StreamActions.feed(data)) //perform ajax request for each activities
            this.activities.push(results);
        }, (err) => {
            // Handle or raise the Error.
            console.log(err);
            // TODO check error reason before retrying load function
            // this.load();
            this._loading = true; //TODO remove after test
        });
    }

    // Let Jessica's flat feed follow Eric's feed
    // jessicaFlatFeed = client.feed('timeline', 'jessica', '0Pt7BnmUM4BIF1eGa6tgj33P-F4');

    get loading() {
        return this._loading;
    }
}