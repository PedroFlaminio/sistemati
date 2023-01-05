import InfoIcon from '../../assets/icons/InfoIcon'
import SuccessIcon from '../../assets/icons/SuccessIcon'
import ErrorIcon from '../../assets/icons/ErrorIcon'
import CloseIcon from '../../assets/icons/CloseIcon'
import { AlertTemplateProps } from 'react-alert'

const alertStyle = {
  color: 'white',
  padding: '10px',
  borderRadius: '3px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
  fontFamily: 'Arial',
  width: '350px',
  zIndex: 200000,
}

const buttonStyle = {
  marginLeft: '20px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
}
const AlertTemplate = (props: AlertTemplateProps) => {  
  const { message, options, style, close } = props;
  let color, colorLight;
  switch(options.type) {
    case 'success': color = "#104000"; colorLight = "#CFC"; break;
    case 'error': color = "#500"; colorLight = "#FCC";  break;
    case 'info': color = "#0d3aa3"; colorLight = "#7aa2ff";  break;
    default: color = "";
  }
  return (
    <div style={{ ...alertStyle, backgroundColor: colorLight, ...style }}>
      {options.type === 'info' && <InfoIcon />}
      {options.type === 'success' && <SuccessIcon />}
      {options.type === 'error' && <ErrorIcon />}
      <span style={{ flex: 2, color, paddingLeft: "15px" }}>{message}</span>
      <button onClick={close} style={buttonStyle}>
        <CloseIcon color={color} />
      </button>
    </div>
  )
}

export default AlertTemplate
