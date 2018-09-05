import React                from 'react'
import createReactClass     from 'create-react-class'
import { connect } 			from 'react-redux'
import { Link } 			from 'react-router-dom'

import { BuildContent } 	from '../social'
import { Author } 			from '../post'
import { TimeAgo } 			from '../social/commons'
import bindFunctions 		from '../../utils/bindFunctions'
import { Images }			from '../media'

const Secret = createReactClass({

	render() {
		const { secret:{ id, author, content, images, createdAt }, userId } 	= this.props,
        authorMsg = userId === author.id ? true : false;
		return(
			<div className="res-info-dv">
                <div className={authorMsg ? `res-info-dv-b left` : `res-info-dv-b right`}>
                    <div className="res-lft-part">
                    	<Author.Photo type='secret' author={author} imgHeight={23} />
                    </div>
                    <div className="res-rght-part">
                        {authorMsg && <div className="arrow left"></div> }
                        <div className="res-rght-part-a">
                            <div className="res-content">
                                <div className="res-cont-ctnr"> 
                                    <BuildContent content={content} />
                                </div>
                                <div className="res-img-ctnr">
                                    <Images images={images} />
                                </div>
                            </div>
                            <span className="res-dte-ctnr">
                                <span className="res-dte-ctnr-a">
                                	<TimeAgo timestamp={createdAt} /> 
                                </span>
                            </span>
                        </div>
                        {!authorMsg && <div className="arrow right"></div> }
                    </div>
                </div>
            </div>
		)
	}
})

///////
//////
export default connect(state=> ({
	authors: state.Authors.authors,
    userId: state.User.user.id
}))(Secret)