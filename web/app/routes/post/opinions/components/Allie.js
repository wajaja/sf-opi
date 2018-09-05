import React 		from 'react'
import createReactClass from 'create-react-class'
import { connect } 	from 'react-redux'


const Allie  = createReactClass({
	render() {
		return(
			<div className="op-cter-a"> 
	            <div className="op-cter-tp">
	                <div className="op-cter-tp-r">
	                    <div className="tp-r-avatar">                  
	                        <Author.Photo author={author} imgHeight={40} />                           
	                   </div>
	                    <div className="tp-r-name">
	                        <Author.Name author={author} className="pst-aut-nm" /> 
	                   </div>
	                </div>
	                <div className="op-lft-tp-l">
	                    <span className="dte-ctnr">
	                        <TimeAgo timestamp={createdAt} />
	                    </span>
	                    <div className="img-opt">
	                        <span className="img-opt-lk" onClick={this.toggleOption}>
	                            <i className="fa fa-chevron-down" aria-hidden="true"></i>
	                        </span>
	                        {this.props.option && 
	                            <Option 
	                                post={this.props.post} 
	                                toggleOption={this.toggleOption} 
	                                handleEdit={this.handleEdit} 
	                                editing={this.props.editing} 
	                                handleRemove={this.handleRemove}
	                                favoritePost={this.favoritePost}
	                                maskPost={this.maskPost} 
	                                author={author} />
	                        }
	                    </div>
	                </div>
	            </div>
	            <div className="op-rght-mdl">
	                <div className="mdl-ct">
	                    <div className="mdl-ct-a">
	                        <BuildContent content={content} />
	                    </div>
	                </div>
	                <div className="mdl-img">
	                    <img src={webPath} className="img-tg" style={{maxHeight: height, height: height}}/>
	                    <div className="shadow"></div>
	                </div>
	            </div>                                                
	        </div>
		)
	}
})