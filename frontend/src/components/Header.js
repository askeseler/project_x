import React from "react";
import home_icon from './icons/home_icon.svg';

function Header(props) {
  return (
    <div className="header">
      <a href="/LandingPage"><img src={home_icon} style={{ width: "50px", height: "50px", float: "left", top: "5px" }} alt="" /></a>
      <div className="content_header_tab" style={{ float: "left", top: "18px" }}> socialmediahub.pro</div>
    </div>
  );
}

export default Header;