import React 					from 'react'
import createReactClass 		from 'create-react-class'
import classnames 					from 'classnames'
import { connect } 					from 'react-redux'
import _  							from 'lodash'
import { BuildContent, LikeButton, 
         Images, Author, TimeAgo,
         CommentForm, EditCommentForm,
         Comments  }  				from '../../../../components' 
import { Scrollbars } 				from 'react-custom-scrollbars'
import  Photos						from '../../../../components/post/comment/Photos'

const Option  = createReactClass({

	render() {
		return(
			<div>option</div>
		)
	}
})

////////
///////
const SideComment  = createReactClass( {

	getInitialState() {
		return {
			down: true,
			comments: [], 
			argument: {},
			scroll_height: 300,
			resizeHeight: true,
			editingComment: false,
			fullContentHeight: false,
		}
	},

	toggleSize(e) {
		const self = this;
		this.setState({
			fullContentHeight: !self.state.fullContentHeight
		})
	},

	onComment(comment) {
        this.props.onComment(comment);
    },

	componentDidMount() {
		let { comments, refer, argument: {id}, loading } = this.props, 
		data,
		winHeight 			= window.innerHeight,
        photo_height 		= (winHeight - (25 * 2)),
        scroll_height 		= (photo_height - 60 - 60 - 23 - 130 );  //150 the min-height of side comment content
        data = comments
        		.filter((c, i) => {
		            for(var prop in c) {
		                return 	c[prop].postValid === id && 
		                		c[prop].refer    === refer
		            }
		        }).map((c, i) => {
		            for(var prop in c) {
		                return c[prop];
		            }
		        }).sort((a, b) => {
		            if (a.createdAt < b.createdAt) return -1;
		            if (a.createdAt > b.createdAt) return 1;
		            return 0;
		        }),
        this.setState({ 
        	scroll_height: scroll_height,
        	comments: _.uniqBy(data, 'id') 
        })
	},

	componentWillReceiveProps(nextProps) {
		if(this.props.comments != nextProps.comments) {
			let { comments } 				= nextProps,
				{ refer, argument: {id} } 	= this.props, data;
	        data = comments
	        		.filter((c, i) => {
			            for(var prop in c) {
			                return 	c[prop].postValid === id && 
			                		c[prop].refer    === refer
			            }
			        }).map((c, i) => {
			            for(var prop in c) {
			                return c[prop];
			            }
			        }).sort((a, b) => {
			            if (a.createdAt < b.createdAt) return -1;
			            if (a.createdAt > b.createdAt) return 1;
			            return 0;
			        })

	        this.setState({comments: _.uniqBy(data, 'id')})
		}
	},


	render() {
		const { editor, argument: {id, updated, createdAt, content, images, legal,},
				loading, refer, side } 					= this.props,
			  { scroll_height, comments, editingComment, 
			  	down, resizeHeight, fullContentHeight }    	= this.state;
		return(
			<div className="actties-ctnr-a">
				<div className="side-div-a" onMouseOver={this.commentMouseHover} onMouseOut={this.commentMouseOut}>
				    {!this.state.editing && 
				    	<div className="side-div-b">
					    		{editor !== null && 
							    	<div className="side-div-c">
					    				<div className="side-head" >
									        <div className="side-div-left">
									            <Author.Photo type="side-comment" author={editor} imgHeight={34}/>
									         </div>
									        <div className="side-div-right">
								            	<div className="side-div-right-a">							                 
								                    <div className="side-head-name">
								                        <div className="side-sp-nm-ct">
								                        	<Author.Name  author={editor} className="side-link-name" />
								                            {id !== undefined && 
								                            	<span className="side-dv-dte">
									                             	<span className="side-head-time" >                                    
									                                 	<span className={updated ? `op-dte dte-mdf` : `op-dte`}>
									                                   	 	<TimeAgo timestamp={createdAt} />
									                                 	</span>
									                             	</span>
									                         	</span>
									                        }
								                         	{id !== undefined &&  
								                         		<div className="side-head-opt">
											                        <div className="side-head-opt-a">
											                            <span className="cmt-opt-lk" onClick={this.toggleOption}></span>
											                        </div>
											                        {this.state.option && 
												                   		<Option 
												                   			argument={argument} 
											                   				toggleOption={this.toggleOption} 
											                   				handleEdit={this.handleEdit} 
											                   				editing={this.props.editing} 
											                   				handleRemove={this.handleRemove}
											                   				maskComment={this.maskComment} 
											                   				postAuthorId={postAuthorId}
											                   				authorId={editor.id} />
												                   	}
										                    	</div>
										                    }
								                        </div>                     
									                    {!loading && id === undefined && <div className="wait">...</div> }
								                    </div>
								                </div>
								        	</div>
								        </div>
						                {!loading && id !== undefined && 
					                		<div className="side-foo">
					                			<div className="side-foo-content" style={{height: !fullContentHeight ? `60px` : `auto`}}>
						                			<div className="contentComment">
							                         	<BuildContent content={content} />
							                        </div>
							                        <div className="side-img-container" >
								                 		
								                	</div>
								                </div>
							                    <div className="side-foo-left">
							                    	{resizeHeight && 
								                		<div className="mr-btn-ctnr">
									                		<div className="mr-btn-ctnr-a">
									                			<span className="see-ll-out"></span>
										                		<span className="see-ll-btn" onClick={this.toggleSize}>
										                			{!fullContentHeight && <i className="fa fa-chevron-down" aria-hidden="true"></i>}
										                			{fullContentHeight && <i className="fa fa-chevron-up" aria-hidden="true"></i>}
										                 		</span>           	
										                	</div>
										                </div>
									                }
							                     	<div className="pls-lks-a">
					                                    <div className={classnames('like-dv', 'side-like-ctnr')}>
					                                        <LikeButton 
					                                            object={this.props.argument} 
					                                            refer={refer} 
					                                            liked={legal} 
					                                            onLike={this.onLike} />
					                                    </div>
					                                    <div className={classnames('cmt-dv', '')}>
					                                        <span className={classnames('selec-sp', '')}></span>
					                                        <span className="linkPcomment" onClick={this.renderComments}>
					                                            <i className="fa fa-comment"></i>
					                                            <span className="txt" style={{marginLeft: "4px"}}>comment</span>
					                                        </span>
					                                    </div>
					                                </div>
							                    </div>
						                	</div>
						                }
						                {loading && <div className="load-cmt"></div> }
								    </div>
								}
				     	</div>
				    }
				</div>
				<div className="cmts-ctnr">
	                <div className="cmts-ctnr-a">
	                	{comments.length > 0 &&
		                	 <Scrollbars
		                	 	universal
	                			style={{ height: scroll_height }}>
	                            <Comments 
	                                {...this.props} 
	                                comments={comments} 
	                                postAuthorId={editor.id}
	                                editingComment={editingComment}
	                                handleCommentEdit={this.handleCommentEdit} 
	                                postId={id}
	                                />
		                   	</Scrollbars>
	                    }
	                </div>
	                <div className="frm-ctnr">
                        {id !== undefined && 
                            <div className="frm-ctnr-a">
                                {!editingComment && 
                                    <CommentForm 
                                    	onComment={this.onComment}
                                        post={this.props.argument} 
                                        refer={side}
                                        postId={id} 
                                        />}
                                {editingComment && 
                                    <EditCommentForm 
                                        refer={side}
                                        postId={id}
                                        comment={editedComment} 
                                        post={this.props.argument} 
                                        commentEdited={this.commentEdited}
                                    />}
                            </div>
                        }
                    </div> 
	            </div>
	        </div>
		)
	}
})
//////
/////
export default connect(state => ({
	comments: state.Comments.comments,
}))(SideComment);