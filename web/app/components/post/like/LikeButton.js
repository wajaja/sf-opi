import React                from 'react'
import createReactClass     from 'create-react-class'
import { connect }          from 'react-redux'
//import { likePhoto } from 'utils/analytics'

import { 
    Likes as LikesActions 
} from '../../../actions/post'

/**
 * LikeButton index component
 */
const LikeButton  = createReactClass({

    shouldComponentUpdate(nextProps) {
        return this.props.liked !== nextProps.like
    },
    
    /**
     * handleClick
     * @param e event
     */
    handleClick(e) {
        e.preventDefault();
        const self = this,
        { dispatch, object: { id, author }, user, refer, onLike, liked } = this.props;

        // onLike({userId: user.id, authorId: author.id, liked: !liked, refer: refer}); //analytic

        if (liked) {
            return dispatch(LikesActions.deleteLike(id, refer)).then(value => {
                self.props.onLike(value, id, refer)
            })
        }
        
        dispatch(LikesActions.like(id, refer)).then(value => {
            self.props.onLike(value, id, refer)
        })
        //analytic
//        if (!this.props.liked) {
//            likePhoto(this.props.user.id, this.props.id)
//        }
    },
    
    renderPost () {
        let classes = ['linkPlike', 'like-sty']
        if (this.props.liked) classes.push('checked')
        if (!this.props.liked) classes.push('unchecked')
        return (
            <span className={classes.join(' ')}  onClick={this.handleClick}>
                <i className="fa fa-heart"></i>
                <span className="txt">I Love</span>
            </span>
        )
    },
    /////
    /////
    renderPhoto () {
        let classes = ['linkPlike', 'like-sty']
        if (this.props.liked) classes.push('checked')
        if (!this.props.liked) classes.push('unchecked')
        return (
            <span className={classes.join(' ')}  onClick={this.handleClick}>
                <i className="fa fa-heart"></i>
                <span className="txt">I Love</span>
            </span>
        )
    },
    
    //////
    //////
    renderComment () {
        let classes = ['linkPlike', 'like-sty']
        if (this.props.liked) classes.push('checked')
        if (!this.props.liked) classes.push('unchecked')
        return (
            <span className={classes.join(' ')} onClick={this.handleClick}>
                <i className="fa fa-thumbs-o-up"></i>
                <span className="txt">I Like</span>
            </span>
        )
    },

    //////
    //////
    renderSideComment () {
        let classes = ['linkPlike', 'like-sty']
        if (this.props.liked) classes.push('checked')
        if (!this.props.liked) classes.push('unchecked')
        return (
            <span className={classes.join(' ')} onClick={this.handleClick}>
                <i className="fa fa-gavel" aria-hidden="true"></i>
                <span className="txt" style={{marginLeft: "4px"}}>Legal</span>
            </span>
        )
    },

    /////
    /////
    renderReply () {
        let classes = ['linkPlike', 'like-sty']
        if (this.props.liked) classes.push('checked')
        if (!this.props.liked) classes.push('unchecked')
        return (
            <span className={classes.join(' ')} onClick={this.handleClick}>
                <i className="fa fa-thumbs-o-up"></i>
                <span className="txt">I Like</span>
            </span>
        )
    },

    /////
    /////
    render() {
        const { refer } = this.props;
        if (refer === 'post') return this.renderPost();
        if (refer === 'picture') return this.renderPhoto();
        if (refer === 'comment') return this.renderComment();
        if (refer === 'undercomment') return this.renderReply();
        if (refer === 'left' || refer === 'right') return this.renderSideComment();

        return <i className="fa fa-thumbs-o-up like-sty"></i>
    }

})
////
export default connect(state => ({
    user: state.User.user,
}))(LikeButton)
