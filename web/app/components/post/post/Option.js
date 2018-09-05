import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { ReactDOM } 		from 'react-dom'
import { connect } 			from 'react-redux'

const Option  = createReactClass({

	getInitialState(props) {
		return {}
	},

	renderForAuthor() {
		return(
			<div className="pst-opt-ctnr-a">
                <div className="opt-rel-ctnr">
                    <i className="opt-arraw"><i></i></i>
                    <span className="pst-opt-ctnr-b">
                        <a href="" className="pst-opt-edit" data-pst-id={post_id}>
                            <span className="pst-opt-edit-ico"><i className="fa fa-pencil" aria-hidden="true"></i></span>
                            <span className="pst-opt-edit-txt"> Edit</span>
                        </a>
                        <a href="" className="pst-opt-remove" data-pst-id={post_id}>
                            <span className="pst-opt-remove-ico"><i className="fa fa-times" aria-hidden="true"></i></span>
                            <span className="pst-opt-remove-txt"> Trash</span>
                        </a>
                    </span>
               </div>
            </div>
		)
	},

	renderForUser() {
		return(
			<div className="pst-opt-ctnr-a">
	           <div className="opt-rel-ctnr">
	                <i className="opt-arraw"><i></i></i>
	                <span className="pst-opt-ctnr-b">                                    
	                    <a href="" className="pst-opt-mask" data-pst-id={post_id}>
	                        <span className="pst-opt-mask-ico"><i className="fa fa-trash" aria-hidden="true"></i></span>
	                        <span className="pst-opt-mask-txt">Mask</span>
	                    </a>
	                    <a href="" className="pst-opt-favorite" data-pst-id={post_id}>
	                        <span className="pst-opt-favorite-ico"><i className="fa fa-star" aria-hidden="true"></i></span>
	                        <span className="pst-opt-favorite-txt">Favorite</span>
	                    </a>
	                </span>
               	</div>
            </div>
		)
	},

	render() {
		if(this.props.post.author.id === this.props.userId) {
			return this.renderForAuthor();
		} esle {
			return this.renderForUser();
		}
	}
})
