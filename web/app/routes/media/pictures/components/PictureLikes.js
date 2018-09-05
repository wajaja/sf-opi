import React                from 'react'
import createReactClass     from 'create-react-class'
import { connect }          from 'react-redux'
import { EmojisContainer, }  from '../../../../components' 


const PictureLikes  = createReactClass({

	render() {
        const { showLikes, } = this.props,
        display = showLikes ? 'block' : 'none';
		return (
			<div style={{display}} className="ph-pls-likes">
                <div className="ph-pls-likes-a">
                    <div className="pls-statistic">
                        <EmojisContainer 
                            {...this.props} 
                            photo={this.props.photo}
                            />
                    </div> 
                </div>
            </div>
		)
	}
})
/////////
export default connect(null)(PictureLikes)