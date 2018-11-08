import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import onClickOutside from "react-onclickoutside";
import { Twitter } from 'react-color';

const PathColor = ({ onClick, color, pathOrder, activeOrder}) => {
    if(color === 'none')
        return <div />

    return (
        <li className="item">
            <div className={activeOrder === pathOrder ? `item-a active` : `item-a` }>
                <div onClick={() => onClick(pathOrder)} style={{backgroundColor: color}} />
            </div>
        </li>
    )
} 

/////////
class PathColors extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            activeOrder: null,
            reactColorActived: false
        }
    }

    handleClickOutside = (evt) => {
        // ...
        this.setState({
            activeOrder: null,
            reactColorActived: false
        })
    }

    onColorBtnClick = (order) => {
        this.setState({
            activeOrder: order,
            reactColorActived: true
        })
    }

    handlePathColorChange = (color, event) => {
        this.props.setVectorImageColor({
            selectedCard, 
            childOrder: this.state.activeOrder, 
            color: color.hex
        });
    }

    render() {
        const { selectedCard } = this.props,
        active = selectedCard && selectedCard.type === 'vectorImage';

        if(!active) {
            return <div />
        }

        let childs = selectedCard.data.childs;

        return (
            <div className={`sub-m vectorImage ${!!active ? " active" : ""}`}>
                <ul className="sub-menub-lst">
                    {childs.map((child, order) => {
                        if(child.name === 'path') 
                            return <PathColor
                                        key={order}
                                        data={child.attrs.d}
                                        color={child.attrs.fill}
                                        pathOrder={order}
                                        activeOrder={this.state.activeOrder}
                                        onClick={ this.onColorBtnClick }
                                        stroke={child.attrs.stroke}
                                        strokeWidth={child.attrs.strokeWidth}
                                        strokeScaleEnabled={false}
                                    />
                        else if(child.name === 'g') {
                            child.childs && child.childs.map((ch, _order) => {
                                if(ch.name === 'path') 
                                    return <PathColor
                                            key={_order}
                                            data={ch.attrs.d}
                                            color={ch.attrs.fill}
                                            pathOrder={_order}
                                            activeOrder={this.state.activeOrder}
                                            onClick={ this.onColorBtnClick  }
                                            stroke={ch.attrs.stroke}
                                            strokeWidth={ch.attrs.strokeWidth}
                                            strokeScaleEnabled={false}
                                            />
                                else 
                                    return <span key={_order} />
                            })
                        }
                        else{
                            return <span key={order} />
                        }
                    })}
                </ul>
                {!!active && <div className="inactive"></div>}
                {this.state.reactColorActived && 
                    <Twitter 
                        triangle="top-left" //hide
                        onChange={this.handlePathColorChange}
                        />
                }
            </div>
        )
    }
}

//FROM DOC
                        // color={color}
/* width - String, Pixel value for picker width. Default 276px
colors - Array of Strings, Color squares to display. Default 
['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', 
'#EB144C', '#F78DA7', '#9900EF']
*/
export default onClickOutside(PathColors);