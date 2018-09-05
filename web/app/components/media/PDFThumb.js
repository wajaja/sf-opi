const PDF_URL = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'


class PDF extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pdf: null,
      scale: 1.2
    }
  }
  getChildContext () {
    return {
      pdf: this.state.pdf,
      scale: this.state.scale
    }
  }
  componentDidMount () {
    PDFJS.getDocument(this.props.src).then((pdf) => {
      console.log(pdf)
      this.setState({ pdf })
    })
  }
  render () {
    return (<div className='pdf-context'>{this.props.children}</div>) 
  }
}

PDF.propTypes = {
  src: React.PropTypes.string.isRequired
}

PDF.childContextTypes = {
  pdf: React.PropTypes.object,
  scale: React.PropTypes.number
}

class Page extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 'N/A',
      page: null,
      width: 0,
      height: 0
    }
  }
  shouldComponentUpdate (nextProps, nextState, nextContext) {
    return this.context.pdf != nextContext.pdf || this.state.status !== nextState.status
  }
  componentDidUpdate (nextProps, nextState, nextContext) {
    this._update(nextContext.pdf) 
  }
  componentDidMount () {
    this._update(this.context.pdf) 
  }
  _update (pdf) {
    if (pdf) {
      this._loadPage(pdf)
    } else {
      this.setState({ status: 'loading' }) 
    }
  }
  _loadPage (pdf) {
    if (this.state.status === 'rendering' || this.state.page != null) return; 
    pdf.getPage(this.props.index).then(this._renderPage.bind(this))
    this.setState({ status: 'rendering' })
  } 
  _renderPage (page) {
    console.log(page)
    let { scale } = this.context 
    let viewport = page.getViewport(scale)
    let { width, height } = viewport
    let canvas = this.refs.canvas
    let context = canvas.getContext('2d')
    console.log(viewport.height, viewport.width)
    canvas.width = width
    canvas.height = height
    
    page.render({
      canvasContext: context,
      viewport
    })
    
    this.setState({ status: 'rendered', page, width, height })
  }
  render () {
    let { width, height, status } = this.state
    return (
      <div className={`pdf-page {status}`} style={{width, height}}>
        <canvas ref='canvas' />
      </div>
    )
  }
}

Page.propTypes = {
  index: React.PropTypes.number.isRequired
}
Page.contextTypes = PDF.childContextTypes

class Viewer extends React.Component {
  render () {
    let { pdf } = this.context
    let numPages = pdf ? pdf.pdfInfo.numPages : 0
    let fingerprint = pdf ? pdf.pdfInfo.fingerprint : 'none'
    let pages = Array.apply(null, { length: numPages })
      .map((v, i) => (<Page index={i + 1} key={`${fingerprint}-${i}`}/>))
    
    return (
      <div className='pdf-viewer'>
        {pages}
      </div>
    )
  }
}
Viewer.contextTypes = PDF.childContextTypes

React.render((
  <PDF src={PDF_URL}>
    <Viewer />
  </PDF>
), document.getElementById('container'))












html, body {
  position: relative;
  width: 100%;
  height: 100%;
}
#container {
  position: relative;
  width: 100%;
  min-height: 100%;
}

.pdf-context, .pdf-viewer {
  position: relative;
  width: 100%;
}
.pdf-viewer {
  padding-top: 3em;
  padding-bottom: 3em;
  background: #3E3E3E
}
.pdf-page {
  position: relative;
  margin: 0 auto 3em auto;
  padding: 0;
  overflow: visible;
  background-clip: content-box;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.54);
  background-color: white;
}




<div id='container'></div>
