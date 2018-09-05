import React                        from 'react'
import createReactClass             from 'create-react-class'
import { Link, Router }             from 'react-router-dom'
import { connect }                  from 'react-redux'
import classnames                   from 'classnames';
import * as axios                   from 'axios'

import { BASE_PATH }                from '../../../../config/api'
import * as DraftFuncs              from '../../../../components/social/home/form/DraftFuncs'
import { BuildContent, LikeButton, 
         Images, Author, TimeAgo,
         CommentForm, EditCommentForm }  from '../../../../components' 
import  SideComment                 from './SideComment'

import { 
    App as AppActions
}                                   from '../../../../actions'


const LeftComments  = createReactClass( {

	getInitialState() {
		return {
            argument: {},
            comments: [],
            loading: false,
            editingComment: false,
        }
	},

    onLike () {

    },

    onComment(comment) {
        this.props.onComment(comment);
    },

    componentDidMount() {
        const { allie_id, post:{ id }, sideComment } = this.props,
        argument = this.props.arguments
            .filter((p, i) => {
              for(var prop in p) {
                  return p[prop].postValid === id 
              }
            })
            .map((p, i) => {
                for(var prop in p) {
                    return p[prop];
                }
            })[0] || {},
        loading = sideComment.loading;
        this.setState({
            loading : loading, 
            argument: argument
        })
    },

    componentWillReceiveProps(nextProps) {
        const next_order = Number(nextProps.allie_id),
              this_order = Number(this.props.allie_id);
        if((this.props.arguments !== nextProps.arguments) || (next_order !== this_order)) {
            const { post:{ id } } = nextProps,
            sideComment = nextProps.sideComment,
            argument    = nextProps.arguments
                .filter((p, i) => {
                    for(var prop in p) {
                        return p[prop].postValid ===  id
                    }
                })
                .map((p, i) => {
                    for(var prop in p) {
                        return p[prop];
                    }
                })[0] || {},
            loading = sideComment.loading && 
                      sideComment.allie_id === id && 
                      sideComment.side === 'left'
            this.setState({
                loading : loading, 
                argument: argument
            })
        }
    },

	render() {
        const { mainPost: { leftEditors, nbAllies }, mainPost } = this.props,
              { argument, editingComment, loading } = this.state,
              editor = leftEditors[0] || {};
		return(                
            <div className="lft-a">
                <div className="lft-b">
                    <div className="actties-ctnr">                          
                        <SideComment 
                            {...this.props}
                            refer='left'
                            side='leftcomment'
                            editor={editor}
                            loading={loading}
                            argument={argument}
                            onComment={this.onComment}
                            />
                    </div> 
                </div>
            </div>   
		)
	}
})

///
export default connect(state =>({
	comments: state.Comments.comments,
    arguments: state.Comments.leftcomments,
    sideComment: state.App.sideComment,
}))(LeftComments)