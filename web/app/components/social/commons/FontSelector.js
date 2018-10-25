import React, { Fragment }  from 'react';
import camelCase      from 'lodash/camelCase';
import find           from 'lodash/find';
import PropTypes      from 'prop-types';
import Select         from 'react-select';
import onClickOutside from "react-onclickoutside";

const customStyles = {
  control: base => ({
    ...base,
    width: 'unset',
    minWidth: 120,
    height: 26,
    minHeight: 30
  }),
  option: (styles, { data }) => {
    // Apply the same font to the option as well, which it intends to apply in the editor
    return { ...styles, fontFamily: data.label };
  },
};

function doesFontExist(fontName) {
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  let text = "test";
  // specifying the baseline font
  context.font = '72px monospace';
  let baselineSize = context.measureText(text).width;
  context.font = "72px '" + fontName + "', monospace";
  let newSize = context.measureText(text).width;
  canvas = null;

  if (newSize === baselineSize) {
    return false;
  } else {
    return true;
  }
}

// TODO: array of objects instead of strings, so that fonts can be related to which language they should be used with
const googleFontsToDownload = [
  'Century Gothic',
  'Calibri',
  'Journal',
  'Marguerita',
  'Dylan',
  'Crimson Text',
  'Josefin Sans',
  'Merriweather',
  'Droid Serif',
  'Gloria Hallelujah',
  'Rambla',
  'Satisfy',
  'Catamaran',
  'Marcellus',
  'Orbitron',
  'Titillium Web',
  'Arya', // hindi
  'Khand', // hindi
  'Kurale', // hindi
  'Rozha One', // hindi
  'Alex Brush',
  'Barrio',
  'Chewy',
  'Great Vibes',
  'Karma', // hindi
  'Metamorphous',
  'Montserrat Subrayada',
  'Pacifico',
  'Princess Sofia',
  'Righteous',
  'Rochester',
  'Sacramento',
  'Sahitya', // hindi,
  'Shadows Into Light',
  'Glegoo', // hindi font
  'Open Sans',
  'Ubuntu',
  'Baloo Thambi',
  'Cinzel Decorative',
  'Kaushan Script',
  'Lobster',
  'Tangerine',
  'VT323',
  'Atma',
  'Arima Madurai',
  'Kavivanar',
  'Roboto',
  'Lateef', // urdu
  'Mirza', // urdu
  'Acme',
  'Meera Inimai', // other
];

const fontOptionsToCheck = [
  { value: 'arial', label: 'Arial' },
  { value: 'timesNewRoman', label: 'Times New Roman' },
  { value: 'helvetica', label: 'Helvetica' },
  { value: 'times', label: 'Times' },
  { value: 'garamond', label: 'Garamond' },
];

const falsePositiveNecessaryOptions = [
  { value: 'veranda', label: 'Veranda' },
  { value: 'monospace', label: 'monospace' },
  { value: 'courier', label: 'Courier' },
  { value: 'courierNew', label: 'Courier New' },
  { value: 'consolas', label: 'Consolas' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'segoeUI', label: 'Segoe UI' },
];

const filteredAvailableOptions = fontOptionsToCheck.filter(fontObject => {
  return doesFontExist(fontObject.label);
});

const allAvailableOptions = filteredAvailableOptions.concat(
  falsePositiveNecessaryOptions,
);

class FontSelector extends React.Component {
  state = {
    fonts: allAvailableOptions,
    active: false,
  };

  static propTypes = {
    setCurrentFontFamily: PropTypes.func.isRequired,
    addFontFamily: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const WebFontConfig = {
      google: {
        families: googleFontsToDownload,
      },
      fontloading: (familyName, fvd) => {
        // console.log('loading... ', familyName, fvd);
      },
      fontactive: (familyName, fvd) => {
        this.setState((prevState, props) => {
          return {
            fonts: [
              ...prevState.fonts,
              { value: camelCase(familyName), label: familyName },
            ],
          };
        });
      },
      active: () => {
        // console.log(allAvailableOptions);
      },
      classes: false,
    };
    const WebFont = await import('webfontloader');

    WebFont.load(WebFontConfig);
  }

  handleChange = ({ value, label }, { action }) => {
    if (action === 'select-option') {
      const { addFontFamily, editorRef, setCurrentFontFamily } = this.props;

      if (window.requestAnimationFrame) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setCurrentFontFamily(label);
            addFontFamily(label);
          });
        });
      }
    }
  };

  handleClickOutside = evt => {
    // ..handling code goes here...
    if(this.state.active)
      this.setState({active: false})
  };

  onClick = (evt) => {
    evt.preventDefault();
    this.setState({active: !this.state.active})
  }

  render() {
    const { currentFontFamily } = this.props;
    const { fonts, active } = this.state;

    const value = currentFontFamily
      ? find(fonts, ['label', this.props.currentFontFamily])
      : find(fonts, ['label', 'Arial']);

          // <div className={active ? `ico active` : `ico`} onClick={this.onClick}></div>
    return (
        <Fragment>
          <Select
              styles={customStyles}
              options={fonts}
              placeholder={`Apply Font`}
              onChange={this.handleChange}
              value={value}
              onFocus={this.handleFocus}
              />
        </Fragment>
    );
  }
}

export default onClickOutside(FontSelector);
