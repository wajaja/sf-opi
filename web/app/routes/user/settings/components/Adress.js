import React            from 'react'
import createReactClass from 'create-react-class'
import { connect }      from 'react-redux'
import { withRouter }   from 'react-router-dom'
import { AdressForm }   from '../../../../components'
import { 
    HeadContainer, FormContainer 
}                       from '../components'

const Adress = createReactClass({

    getInitialState() {
        return {
            submitting: false,
        }
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.tag !== nextProps.tab) {
            console.log('data tab changed');
        }
    },

    handleSubmitAdress(adress) {
        const data = {
            //address insteadof adress as named in server side
            address: {...adress}  
        };
        this.props.submitAdress(data);
    },

    render() {
        const { user, adress, loadData }  = this.props

        if(loadData) {
            return(
                <div className="op-load-dta-pg"></div>
            )
        }
        /////////
        return(
            <div className="sttg-center-cmp-ctnr">
                <div className="sttg-center-cmp-ctnr-a">
                    <div className="adr-ctnr-tp setting-tp-tag">
                        <div className="adr-ctnr-lft">
                            <div className="adr-ctnr-lft-a">
                                Adress
                            </div>
                        </div>
                        <div className="adr-ctnr-rght">
                            <div className="adr-ctnr-rght-a">
                                <div className="adr-ctnr-opt">
                                    <div className="adr-ky">country</div>
                                    <div className="adr-val">
                                        {adress && adress.country ? `${adress.country}` : `_`}
                                    </div>
                                </div>
                                <div className="adr-ctnr-opt">
                                    <div className="adr-ky">city</div>
                                    <div className="adr-val">
                                        {adress && adress.city ? `${adress.city}` : `_`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            
                    <div className="adr-ctnr-bd setting-bd-tag">
                        <div className="adr-ctnr">
                            <div className="adr-ctnr-lft">
                                AdressForm
                            </div>
                            <div className="adr-ctnr-rght">
                                <AdressForm 
                                    {...this.props}
                                    submitting={this.state.submitting}
                                    handleSubmit={this.handleSubmitAdress}
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

/////
export default withRouter(connect(state => ({
    adress: state.User.setting.adress,
    loadData: state.User.setting.loadData
}))(Adress))