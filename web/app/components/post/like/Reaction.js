import React            from 'react'
import createReactClass from 'create-react-class'
import { connect }      from 'react-redux'
//import { likePhoto } from 'utils/analytics'

/**
 * LikeButton index component
 */
const Reaction  = createReactClass({
    /**
     * handleClick
     * @param e event
     */
    handleClick(e) {
        this.props.onLike({id: this.props.id, liked: !this.props.liked})
        // if (!this.props.liked) {
        //     likePhoto(this.props.user.id, this.props.id)
        // }
    },

    /**
     * render
     * @returns markup
     */
    render() {
        let classes = ['item']
        if (this.props.liked) classes.push('ion-ios-heart')
        if (!this.props.liked) classes.push('ion-ios-heart-outline')

        return <i className={classes.join(' ')} onClick={this.handleClick}/>
    }

})

export default connect(state => ({
    user: state.User.user,
}))(Reaction)
