import React 		from 'react'
import { connect } 	from 'react-redux'
import createReactClass from 'create-react-class'
import Image 		from './Image'


const ImagesContainer = createReactClass({
	getInitialState() {
		selection = ''; //url
		return{
			last_selection: selection,
		}
	},

	moveImage() {

	},

	removeImage() {

	},

	onDragEnded(url) {
		this.setState({selection: url})
		this.props.onDragEnded(url);
	},

	render() {
		const { last_selection,  } = this.state,
		{ style, list } = this.props
		return (
			<div style={{style}} className="mt-my-imgs">
                <div className="mt-my-imgs-a">
					<div className='mt-my-imgs-container'>
						{list.map((el, i) => {
							return (
								<Image 
									key={i}
									index={i}
									url={el.url}
									selection={selection}
									showImages={showImages}
									moveEmoji={this.moveEmoji}
									onDragEnded={this.onDragEnded}
									removeEmoji={this.removeEmoji}
									/>							
							);
						})}
					</div>
				</div>
			</div>
		)
	}
})

export default connect(state => ({
	list: state.MeetYou.photos
}), null) (ImagesContainer)