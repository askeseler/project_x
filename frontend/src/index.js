import React from "react";
import ReactDOM from "react-dom";
import MainScreen from "./MainScreen";
import 'semantic-ui-css/semantic.min.css'

window.api = window.location.protocol  + '//' + window.location.host//"http://localhost:8081";
class App extends React.Component {
  render() {
    return (
        <MainScreen/>
    );
  }
}

// For latest version, check https://react.semantic-ui.com/usage/
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);


/*ReactDOM.render(
  <GoogleReCaptchaProvider reCaptchaKey="6LdlucIpAAAAAE-4EBPBJD_cyJgbrWlYo3qvi-hj">
    <App/>
  </GoogleReCaptchaProvider>,
  rootElement
);*/