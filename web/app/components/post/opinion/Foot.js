import React                from 'react'
import createReactClass     from 'create-react-class'
import { connect }          from 'react-redux'
import { RateButton }       from '../like'

import bindFunctions from '../../../utils/bindFunctions'

import { LeftForm, RightForm } from '../opinion'

const Detail  = createReactClass({
    render() {
        return(
            <div className="op-descript"> 
                This assumes that you’re using npm package manager with a module bundler 
                like Webpack or Browserify to consume CommonJS modules.
            </div>
        )
    }
})
////
////
const Foot  = createReactClass({

    onDownLike () {
        console.log('something work well in down')
        // this.props.onDownLike()
    },

    onUpLike () {
        console.log('something work well in up')
        // this.props.onUpLike()
    },

    onLike(value, postId, refer) {
        this.props.onLike(value, postId, refer)
    },

    onSideComment(comment, side) {
        this.props.onSideComment(comment, side)
    },

    onComment(comment) {
        this.props.onComment(comment)
    },

    nextStep(e) {
        if(!this.props.nextPostForm) {
            this.props.nextPost();
        }
    },

    subcribe(e) {
        this.props.subcribe();
    },

    onShare(postId, e) {
        e.preventDefault();
        this.props.onShare(postId, 'post');
    },
 
    componentWillMount() {

    },

    componentDidMount() {

    },

    componentDidUpdate() {

    },
 
	render() {
        const {post: {id, leftEditors, rightEditors, author}, userID} = this.props,
        rightEditorId = rightEditors.map((ed) => ed.id)[0],
        leftEditorId = leftEditors.map((ed) => ed.id)[0],
        authorId = author.id;

		return(
			<div className={this.props.editPostFormFocus && this.props.editing ? `fooPost editing`: `fooPost`}>
                <div className="fooPost-a">
                    <div className="fooPost-b op-lks-actties" >
                        <div className="fooOpi-c opn" >
                            <div className="mdl-pst-ctnr">
                                {authorId !== userID && 
                                    <div className="pst-sbcrb" >
                                        <span className="lkSubcribe" onClick={this.subcribe}> 
                                            subcribe
                                        </span>
                                        <span className="pst-sbcrber-nb"> </span>
                                    </div>
                                }
                                {authorId === userID && 
                                    <div className="pst-sbcrb" >
                                        <span className="lkSubcribe" onClick={this.nextStep}> 
                                            next Step
                                        </span>
                                        <span className="pst-sbcrber-nb"> </span>
                                    </div>
                                }
                                <div id="postShareDiv" className="postShareDiv">
                                    <span className="postShare-icon-form" onClick={this.onShare.bind(this, id)}>
                                        <i className="fa fa-share-alt"></i>
                                        <span className="txt">share</span>
                                    </span>
                                </div>
                                <div className="plikeDv" >
                                    <RateButton 
                                        {...this.props}
                                        post={this.props.post} 
                                        type="post" 
                                        onLike={this.onLike}
                                        onUpLike={this.onUpLike} 
                                        onDownLike={this.onDownLike}
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="postDetail">
                    <div className="postDetail-a" style={{width: "auto", overflow: "visible", backgroundColor: "#f6f7f8"}}>
                        <div className="">
                            <span> </span> <a href=""> </a>
                            <span> </span>
                        </div>
                    </div>
                </div>
                <div className="pst-cmt-frm">
                    <div className="pst-cmt-frm-a">
                        <div className="pst-lr-cmts-frm-b">
                            {userID === leftEditorId &&
                                <div className="pst-lft-frm-ctnr">
                                    <LeftForm 
                                        {...this.props}
                                        key={id}
                                        refer='left'
                                        post={this.props.post}
                                        onSideComment={this.onSideComment}
                                        postId={id} 
                                        />
                                </div>
                            }
                            {userID === rightEditorId &&
                                <div className="pst-rght-frm-ctnr">
                                    <RightForm 
                                        {...this.props}
                                        key={id}
                                        refer='right'
                                        post={this.props.post}
                                        onSideComment={this.onSideComment}
                                        postId={id} />
                                </div>
                            }
                            {userID !== leftEditorId && userID !== leftEditorId &&
                                <Detail 
                                    {...this.props}
                                    />
                            }
                        </div>
                    </div>
                </div>
            </div>
		)
	}
})

export default connect(state => ({
    editPostFormFocus: state.App.editPostFormFocus
}))(Foot)