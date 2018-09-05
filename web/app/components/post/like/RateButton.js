import React            from 'react'
import createReactClass from 'create-react-class'
import { connect }      from 'react-redux'
import { findDOMNode }  from 'react-dom'

import bindFunctions from '../../../utils/bindFunctions'
//import { likePhoto } from 'utils/analytics'

import '../../../styles/post/like.scss'
import { 
    Rates as RatesActions 
} from '../../../actions/post'

/**
* Create drawable canvas element for rate
* 
*/
const Graph  = createReactClass({

    getInitialState() {
        return {
            hover: false,
            barWidth: 70,
            barHeight: 0,
            hoverValue: 0,
            selectValue: 0,
            userBar: null,
            mainBar: null,
            width: 68,
            height: 6,
            rate: 0,
            totalRate: 0,
            color: "#e3e8e8"            //string color
        }
    },

    /**
    * @Author Cedrick Ngeja
    * @param {ctx} : canvas context
    * @this :create graphis bar for like
    * Draw method updates the canvas with the current display
    */ 
    draw(ctx, totalRate, rate) {

        let  barWidth,    barHeight, maxBarWidth, backgroundColor = "#6dd1f3";
        // Update the dimensions of the canvas only if they have changed
        if (ctx.canvas.width !== this.state.width || ctx.canvas.height !== this.state.height) {
            ctx.canvas.width = this.state.width;
            ctx.canvas.height = this.state.height;
        }
        // Draw the background color
        //set color value when the rate is latest than half totalrate
        if(rate < Math.floor(totalRate/2)){
            backgroundColor = "#dc8b8b";
        }else{
            backgroundColor = "#8fd4bb";
        }
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, this.state.width * rate / totalRate, this.state.height);
    
        // Turn on shadow
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 2;
        ctx.shadowColor = "#999";

    },

    onRate(e) {
        e.preventDefault();
        const elem  = e.target,
        x           = e.pageX - $(elem).offset().left, // or e.offsetX (less support, though)
        value       = ((x * this.state.barWidth) / 100);

        this.props.onRate(value);
        this.setState({selectValue: value});
    },

    onMouseOver(e) {
        this.setState({hover: true})
        const elem  = e.target,
        x           = e.pageX - $(elem).offset().left, // or e.offsetX (less support, though)
        value       = ((x * this.state.barWidth) / 100);

        this.setState({hoverValue: value})
    },

    onMouseOut(e) {        
        this.setState({hover: false})
    },

    componentWillMount() {

    },

    componentDidMount() {
        const { nbRates, rate, obtained } = this.props,
        uCanv       = findDOMNode(this.refs.userCanvas),
        mainCanv    = findDOMNode(this.refs.mainCanvas),
        uCtx        = uCanv.getContext('2d'),
        mainCtx     = mainCanv.getContext('2d'),
        totalRate   = nbRates * 50;

        this.draw(uCtx, 50, rate);
        this.draw(mainCtx, totalRate, obtained);
    },
   
    componentDidUpdate(prevProps, prevState) {
        if(this.props != prevProps) {
            const { nbRates, rate, obtained } = this.props,
            uCanv       = findDOMNode(this.refs.userCanvas),
            mainCanv    = findDOMNode(this.refs.mainCanvas),
            uCtx        = uCanv.getContext('2d'),
            mainCtx     = mainCanv.getContext('2d'),
            totalRate   = nbRates * 50;

            this.draw(uCtx, 50, rate);
            this.draw(mainCtx, totalRate, obtained);
        }
    },

    render() {
        const { obtained, rate, nbRates }  = this.props,
        totalPercent    = (obtained / nbRates * 50) + " %",
        userPercent     = (rate / 50) + " %";

        return (
            <div className="gph-ctnr">
                <span className={this.state.hover ? `pst-like-rat-ctnr vis` : `pst-like-rat-ctnr`}>
                    <div className="gl-plike-frm-ctnr">
                        <div className="gl-plike-frm">
                            <span className="pst-like-obtained-ctnr">
                                <span className="per-sp">{totalPercent}</span>
                                <span className="txt-msg"> of the right users on opinion</span>
                            </span>
                            <span className="pst-like-rate-ctnr">
                                <span className="per-sp">{userPercent}</span>
                                <span className="txt-msg"> your are right with the right </span>
                            </span>
                        </div>
                    </div>
                </span>
                <span className="sp-like-mr-i">
                    <a href="" className="lk-graph-plike"  onClick={this.onRate} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
                        <span className={!this.state.hover ? `main-rate-ctnr vis` : `main-rate-ctnr`}>
                            <canvas ref="mainCanvas" className="rate-bar"></canvas>
                        </span>
                        <span className={this.state.hover ? `usr-rate-ctnr vis` : `usr-rate-ctnr`}>
                            <canvas ref="userCanvas" className="rate-bar"></canvas>
                        </span>
                    </a>
                    <span name="nbPlikes" className="nbPlikes"></span>
                </span>
            </div>
        )
    }
})

///////
/**
 * LikeButton index component
 */
const RateButton  = createReactClass({

    getInitialState() {
        return {}
    },

    handleDownLike(e) {
        e.preventDefault();
        const { dispatch, post, type } = this.props,
        data = {
            rate : 0,
            refValid: post.id
        },
        self = this;
        this.props.onRate({id: this.props.id, liked: !this.props.liked, type: this.type})

        if (post.liked) {
            if (post.rate == 0) {
                return dispatch(RatesActions.deleteRate(post.id, type)).then(value => {
                        self.props.onLike(value, id, refer)
                })
            }
            return dispatch(RatesActions.updateRate(data, post.id, type)).then(value => {
                self.props.onLike(value, id, refer)
            })
        }

        dispatch(RatesActions.rate(data, post.id, type)).then(value => {
            self.props.onLike(value, id, refer)
        })
        //analytic
//        if (!this.props.liked) {
//            likePhoto(this.props.user.id, this.props.id)
//        }
    },

    onRate(value) {
        const { dispatch, post, type } = this.props,
        data = {
            rate : value,
            refValid: post.id
        },
        self = this;
        // this.props.onRate({id: this.props.id, liked: !this.props.liked, type: type})

        if (post.liked) {
            return dispatch(RatesActions.updateRate(data, post.id, type)).then(value => {
                self.props.onLike(value, id, refer)
            })
        }
        dispatch(RatesActions.rate(data, post.id, type)).then(value => {
                self.props.onLike(value, id, refer)
        })
    },

    /**
     * handleClick
     * @param e event
     */
    handleUpLike(e) {
        e.preventDefault();

        const { dispatch, post, type } = this.props,
        data = {
            rate : 50,
            refValid: post.id
        },
        self = this;
        // this.props.onRate({id: this.props.id, liked: !this.props.liked, type: this.props.type})
        if (post.liked) {
            if (post.rate == 50) {
                return dispatch(RatesActions.deleteRate(post.id, type)).then(value => {
                    self.props.onLike(value, id, refer)
                })
            }
            return dispatch(RatesActions.updateRate(data, post.id, type)).then(value => {
                self.props.onLike(value, id, refer)
            })
        }
        dispatch(RatesActions.rate(data, post.id, type)).then(value => {
            self.props.onLike(value, id, refer)
        })
        //analytic
//        if (!this.props.liked) {
//            likePhoto(this.props.user.id, this.props.id)
//        }
    },
    
    ///
    ///
    renderMain () {
        const { post, type }= this.props,
            rated           = post.rate,
            obtained        = post.totalRate,
            nbRates         = post.nbRates;

        let downClasses = ['fa', 'fa-thumbs-o-down', 'like-sty'],
            upClasses = ['fa', 'fa-thumbs-o-up', 'like-sty'];

        if (rated/2 < 100 && rated > 0 ) downClasses.push('checked')
        if (rated/2 > 100) upClasses.push('checked')

        return (
            <div id="_plke_dv" className="plikeDiv" data-pst-id={post.id}>
                <span className="sp-like-icn-ctnr">
                    <a href="" className="linkPlike" rel="linkPlike" onClick={this.handleDownLike}>
                        <i className={downClasses.join(' ')}></i>
                    </a>
                </span>                
                <Graph 
                    obtained={post.totalRate} 
                    rate={post.rate}
                    nbRates={nbRates} 
                    onRate={this.onRate} />                
                <span className="sp-like-icn-ctnr">
                    <a href="" className="linkPlike" rel="linkPlike" onClick={this.handleUpLike}>
                        <i className={upClasses.join(' ')}></i>
                    </a>
                </span>
            </div>
        )
    },
    
    ///
    ///
    renderComment () {
        let classes = ['item']
        if (this.props.liked) classes.push('ion-ios-heart')
        if (!this.props.liked) classes.push('ion-ios-heart-outline')
        return (
            <a href="" className="linkPlike" rel="linkPlike" onClick={this.handleClick}>
                <i className={classes.join(' ')} className="fa fa-thumbs-o-up like-sty"></i>
            </a>
        )
    },

    /**
     * render
     * @returns markup
     */
    render() {
        if (this.props.type == 'post') return this.renderMain();
        if (this.props.type == 'comment') return this.renderComment();

        return <i className="fa fa-thumbs-o-up like-sty"></i>
    }

})

export default connect(state => ({
    user: state.User.user,
}))(RateButton)