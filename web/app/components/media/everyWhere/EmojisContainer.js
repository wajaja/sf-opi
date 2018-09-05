import React 		from 'react'
import createReactClass from 'create-react-class'
import Emoji 		from './Emoji'


const EmojisContainer = createReactClass({
	getInitialState() {
		let everywhere  = this.props.photo ? this.props.photo.everywhere : {},
		selection = everywhere && everywhere.char_code ? everywhere.char_code : '';
		return{
			list: [
				{ id: 1, emoji:{title:"heart"}, className:"emo-bx center"},
				{ id: 2, emoji:{title:"fire"}, className:"emo-bx deg0"},
				{ id: 3, emoji:{title:"+1"}, className:"emo-bx deg240"},
				{ id: 4, emoji:{title:"clap"}, className:"emo-bx deg280"},
				{ id: 5, emoji:{title:"joy"}, className:"emo-bx deg320"},
				{ id: 6, emoji:{title:"heart_eyes"}, className:"emo-bx deg200"},
				{ id: 7, emoji:{title:"relaxed"}, className:"emo-bx deg160"},
				{ id: 8, emoji:{title:"broken_heart"}, className:"emo-bx deg120"},
				{ id: 9, emoji:{title:"-1"}, className:"emo-bx deg80"},
				{ id: 10, emoji:{title:"cry"}, className:"emo-bx deg40"},
			],
			selection: selection,
		}
	},

	moveEmoji() {

	},

	removeEmoji() {

	},

	onDragEnded(title) {
		this.setState({selection: title})
	},

	render() {
		const { list, selection, } = this.state
		return (
			<div className='emo-circle-container'>
				{list.map((el, i) => {
					return (
						<Emoji 
							key={i}
							index={i}
							emoji={el.emoji}
							selection={selection}
							className={el.className} 
							moveEmoji={this.moveEmoji}
							onDragEnded={this.onDragEnded}
							removeEmoji={this.removeEmoji}
							/>							
					);
				})}
			</div>
		)
	}
})

export default EmojisContainer