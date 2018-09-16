import React from "react"
import PropTypes from "prop-types"
import createReactClass from 'create-react-class'
import ReactGoogleMapLoader from "react-google-maps-loader"
import ReactGooglePlacesSuggest from "react-google-places-suggest"

//TODO more config

//  from google console 
const API_KEY = "AIzaSyBr1K8EwSXriQwNnVnJwp35MNOTTUqMtqU"
const PlacesSuggest = createReactClass({

    getInitialState() {
        return {
            search: "",
            value: "",
        }
    },

    handleInputChange(e) {
        this.setState({search: e.target.value, value: e.target.value})
    },

    handleSelectSuggest(suggest) {
        this.setState({search: "", value: suggest.formatted_address})

        //perform ajax request 
        this.props.pushPlace(suggest);
    },

    render() {
        const {search, value } = this.state;
        const { placeInput } = this.props;
        return (
            <div className={(placeInput === true) ? `pst-places-suggest` : `pst-places-hide pst-places-suggest`}>
                <div className="pst-places-suggest-b">
                    <ReactGoogleMapLoader
                        params={{
                            key: API_KEY,
                            libraries: "places,geocode",
                        }}
                        render={googleMaps =>
                            googleMaps && (
                                <div className="pst-places-m-loader">
                                    <ReactGooglePlacesSuggest
                                        autocompletionRequest={{input: search}}
                                        googleMaps={googleMaps}
                                        onSelectSuggest={this.handleSelectSuggest}
                                        >
                                        <input
                                            type="text"
                                            value={value}
                                            placeholder="Search a location"
                                            onChange={this.handleInputChange}
                                            />
                                    </ReactGooglePlacesSuggest>
                                </div>
                            )
                        }
                    />
                </div>
            </div>
        )
    }
})

PlacesSuggest.propTypes = {
  googleMaps: PropTypes.object,
}

export default PlacesSuggest