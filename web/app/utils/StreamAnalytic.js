
export default class StreamAnalytic {
    constructor(user) {

        import('stream-analytics').then(StreamAnalytics => {
            // Instantiate a new StreamAnalytic (client side)
            this.client = new StreamAnalytics({
    		  apiKey: "sewzt6y5y29n",
    		  token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6ImFuYWx5dGljcyIsImFjdGlvbiI6IioiLCJ1c2VyX2lkIjoiKiJ9.Iv8yttJgvwuXeSCHHnhVsa2Usx_uCS3z10ttVoBnu78"
    		});
    		// user id and a friendly alias for easier to read reports
    		this.client.setUser({id: user.id, alias: user.username});
        })
    }

    /**
    * The snippet below shows an example of how to track engagements. 
    * Emgagement examples include likes, comments, profile views and link clicks
    */
    trackEngagements({label, content, score, position, user, location}) {
        var engagement = {
			// the label for the engagement, ie click, retweet etc.
			'label': label,
			// the ID of the content that the user clicked
			'content': {
				'foreign_id': `${content.type}:${content.id}`
			},
			// score between 0 and 100 indicating the importance of this event 
			// IE. a like is typically a more significant indicator than a click
			'score': score,
			// (optional) the position in a list of activities
			'position': position,
			// (optional) the feed the user is looking at
			'feed_id': 'user:${user.id}',
			// (optional) the location in your app. ie email, profile page etc
			'location': location
		};

		this.client.trackEngagement(engagement);
    }

    /**
    * Tracking impressions allows you to learn what specific users are not interested in. 
    * If the app often shows posts about football, and the user never engages with those posts, 
    * we can conclude that we're displaying the wrong content. 
    * The code below shows how to track that a user viewed 3 specific activities:
    */
    trackImpressions({label, content, score, position, user, location}) {
        var impression = {
		  // the list of content IDs displayed to the user
		  'content_list': ['tweet:34349698', 'tweet:34349699', 'tweet:34349697'],
		  // (optional) the feed where this content is coming from
		  'feed_id': 'flat:tommaso',
		  // (optional) the location in your app. ie email, profile page etc
		  'location': 'profile_page'
		};

		// send the impression events
		this.client.trackImpression(impression);
    }

    // follow 'notifications' feed
    notification(userId) {
        this.notification = this.client.feed('notification', userId, this.props.tokens.notification)
        this.notification
            .subscribe(data => {
                this.props.dispatch(StreamActions.event(data))
            })
            .then(() => {
                //console.log('Full (Notifications): Connected to faye channel, waiting for realtime updates');
            }, (err) => {
                console.error('Full (Notifications): Could not estabilsh faye connection', err);
            });
    }
}