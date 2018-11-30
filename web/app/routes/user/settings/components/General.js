import React            from 'react'
import createReactClass from 'create-react-class'
import { connect }      from 'react-redux'
import { withRouter }   from 'react-router-dom'
import { 
    LangForm,
    StatusForm,
    NameForm,
    BuildContent,
}                       from '../../../../components'  

const General = createReactClass({

    getInitialState() {
        return {
            nameSubmitting: false,
            langSubmitting: false,
            statusSubmitting: false,
        }
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.tag !== nextProps.tab) {
            console.log('data tab changed');
        }
    },

    handleSubmitName(e) {
        e.preventDefault();
        const { nameForm } = this.props
        if(typeof nameForm.syncErrors !== 'object') {
            const data = {
                name: {...nameForm.values}
            }
            console.log(data);
            this.props.submitName(data);
        }
    },

    handleSubmitStatus(content) {
        const data = {
            status: {
                content: content
            }
        }
        this.props.submitStatus(data);
    },

    handleSubmitLang(lang) {
        const data = {lang: lang,}
        this.props.handleSubmit(data)
    },

    render() {
        const { user, loadData }  = this.props
        if(loadData) {
            return(
                <div className="op-load-dta-pg"></div>
            )
        }

        return(
            <div className="sttg-center-cmp-ctnr">
                <div className="sttg-center-cmp-ctnr-a">
                    <div className="sttg-center-cmp-tp setting-tp-tag">
                        <div className="nm-ctnr">
                            <div className="nm-ctnr-lft">
                                <div className="nm-ctnr-lft-a">
                                    names
                                </div>
                            </div>
                            <div className="nm-ctnr-rght">
                                <div className="nm-ctnr-rght-a">
                                    <div className="nm-ctnr-opt">
                                        <div className="nm-ky">firstname</div>
                                        <div className="nm-val">{user.firstname}</div>
                                    </div>
                                    <div className="nm-ctnr-opt">
                                        <div className="nm-ky">nickname</div>
                                        <div className="nm-val">
                                            {user.nickname ? `${user.nickname}` : `_`}
                                        </div>
                                    </div>
                                    <div className="nm-ctnr-opt">
                                        <div className="nm-ky">lastname</div>
                                        <div className="nm-val">{user.lastname}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="stt-ctnr">
                            <div className="stt-ctnr-lft">
                                <div className="stt-ctnr-lft-ttl">
                                    status
                                </div>
                            </div>
                            <div className="stt-ctnr-rght">
                                <div className="stt-ctnr-rght-bdy">
                                    <BuildContent
                                        contentFor="status"
                                        content={this.props.status}
                                        />
                                </div>
                            </div>
                        </div>
                        <div className="lang-ctnr">
                            <div className="lang-ctnr-lft">
                                <div className="lang-ctnr-ttl">
                                    languages
                                </div>
                            </div>
                            <div className="lang-ctnr-rght">
                                <div className="lang-opt">
                                    <div className="lang-opt-key">
                                        global
                                    </div>
                                    <div className="lang-opt-val">
                                        {user.locale}
                                    </div>
                                </div>
                                <div className="lang-ctnr-in-use">
                                </div>
                            </div>
                        </div>
                     </div>
                
                    <div className="sttg-center-cmp-bd setting-bd-tag">
                        <div className="nm-ctnr">
                            <div className="nm-ctnr-a">
                                <div className="nm-ctnr-lft">
                                    <div className="nm-ctnr-lft-a">
                                        names
                                    </div>
                                </div>
                                <div className="nm-ctnr-rght">
                                    <NameForm 
                                        {...this.props}
                                        submitting={this.state.nameSubmitting}
                                        onSubmit={this.handleSubmitName}
                                        onAbord={this.onAbordName}
                                        />
                                </div>
                            </div>
                        </div>
                        <div className="stt-ctnr">
                            <div className="stt-ctnr-a">
                                <div className="stt-ctnr-lft">
                                    <div className="stt-ctnr-lft-a">
                                        status
                                    </div>
                                </div>
                                <div className="stt-ctnr-rght">
                                    <StatusForm 
                                        {...this.props}
                                        handleSubmit={this.handleSubmitStatus}
                                        submitting={this.state.statusSubmitting}
                                        onAbord={this.onAbordStatus}
                                        />
                                </div>
                            </div>
                        </div>
                        <div className="lang-ctnr">
                            <div className="lang-ctnr-a">
                                <div className="lang-ctnr-lft">
                                    <div className="lang-ctnr-ttl">
                                        languages
                                    </div>
                                </div>
                                <div className="lang-ctnr-rght">
                                    <div className="form-wrp">
                                        <LangForm 
                                            {...this.props}
                                            handleSubmit={this.handleSubmitLang}
                                            submitting={this.state.langSubmitting}
                                            onAbord={this.onAbordLang}
                                            />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

//////
export default withRouter(connect(state => ({
    loadData: !!state.User.setting && state.User.setting.loadData,
    status: state.User.status,
    nameForm: state.form.NameForm,
}))(General))