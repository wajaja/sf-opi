import React from 'react'
import createReactClass from 'create-react-class'
import { connect } from 'react-redux'
import { withRouter } 		from 'react-router-dom'
import { getUrlParameterByName } 	from '../../../utils/funcs'
import { 
    Posts as PostsActions,
    App as AppActions,
}                                   from '../../../actions'


const Opinion = require('../opinions/Opinion').default,
Basic 		  = require('../posts/basic/Basic').default

const Post  = createReactClass( {

	getInitialState() {
		return {
			loading: true,
			status: '',
			post:{},
		}
	},

	refreshPost(props) {
		const { match : { params : { id } }, 
    		location, postsStore, alliesStore
    	} 				= props;
        const post = postsStore[id];

        if(!!post) {
        	
        	this.setState({
                loading: false,
        		post: post,
        	})
        } else {
        	this.props.dispatch(PostsActions.load(id)).then(
        		(post) => { this.setState({ loading: false }) },
        		(error) => { this.setState({ loading: false }) }
        	)
        }
	},

	componentWillMount() {

	},

	componentDidMount() {
		this.refreshPost(this.props);
		// p_type = getUrlParameterByName('p_type', this.props.location.search);
		// if(!p_type) {
		// 	$
		// }
	},

	componentWillReceiveProps(nextProps) {
        const next_order = Number(getUrlParameterByName('allie_id', nextProps.location.search)),
              this_order = Number(getUrlParameterByName('allie_id', this.props.location.search)),
              { params: {id} } = this.props.match;
        	console.log('update in postsStore')

        if(id !== nextProps.match.params.id || this.props.postsStore !== nextProps.postsStore) {
        	this.refreshPost(nextProps);
        }        
    },

    shouldComponentUpdate(nextProps, nextState) {
    	return this.state !== nextState
    },

	render() {

		const { location, } = this.props,
		{ post, loading } 	= this.state,
		p_type = getUrlParameterByName('p_type', location.search);

		if(!post.id && loading) {
			return <div />
		}

		if(!post.id && !loading) {
			return (<div className="pst-not-fd">Not found</div>)
		}

		if(p_type === 'opinion' || post.type === 'opinion') {
			return (
				<Opinion 
					{...this.props}
					post={post} 
					/>
			)
		}

		else if (p_type === 'post' || post.type === 'post') {
			return (
				<Basic 
					{...this.props}
					post={post} 
					/>
			)
		}

		else {
			return (
				<div className="hm-container" ref={c => this._pageElm = c}>
	                <div id="hm_main_blk" className="">
	                    <div className="hm-main-blk-ctnr">
	                    	post not found
	                    </div>
		                <div className={this.props.postFormFocus ? `gl-frm-out out-active` : `gl-frm-out`}></div>
		                <div className={this.props.editPostFormFocus ? `edt-pst-out out-active` : `edt-pst-out`}></div>
		                <ModalVideoConfirm />
		            </div>
	            </div>
			)
		}
	}
})

/////////

// function mapDispatchToProps(dispatch) {
//     return({
//         loadPost: (id) => {)}
//     })
// }

export default  withRouter(connect(state => ({
	postIds: state.Posts.postIds,
	alliesStore: state.Posts.allies, 
	postsStore: state.Posts.postsById,
}))(Post));