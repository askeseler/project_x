import React from "react";
import SideMenu from "./components/SideMenu.js";
import Header from "./components/Header.js";
import ContentHeader from "./components/ContentHeader.js";
import AppDataLatestContents from "./components/AppDataLatestContents.js"
import SettingsPage from "./components/SettingsPage.js"
import LandingPage from "./components/LandingPage.js"

import './MainScreen.css';

//window.onload = function() {console.log(window.location.pathname.split('/').slice(1));}

const key = process.env.REACT_APP_API_KEY;

class App extends React.Component {
  constructor(props) {
    super(props)
    this.default_page = "LandingPage"//SET THIS PAGE
    this.state = { page: this.default_page }
  }

  componentDidMount() {
    // Prevent navigation via href. Change url instead manually and update state.page for conditional rendering.
    //this.setState({page: window.location.href});
    let page = new URL(window.location.href).pathname.slice(1)
    if (page == "") page = this.default_page;
    this.setState({ page: page });

    window.block_navigation = true;
    window.navigation.addEventListener("navigate", (event) => {
      if (window.block_navigation) {
        event.preventDefault();
        let new_slug = new URL(event.destination.url).pathname;
        window.block_navigation = false;
        window.history.pushState('', document.title, new_slug);
        window.block_navigation = true;
        this.setState({ page: new_slug.slice(1) })
      };
    });
  }

  render() {

    if (this.state.page === "LandingPage") return <LandingPage />;
    if (this.state.page == "AppDataLatestContents") {
      return (<div className="container" style={{ width: "100%" }}>
        <Header /><AppDataLatestContents /><ContentHeader tabs={["LATEST CONTENTS", "USER HISTORY", "SEARCH & FILTER"]} /><SideMenu />
      </div>)
    }
    else if (this.state.page == "SettingsPage") {
      return (<div className="container" style={{ width: "100%" }}>
        <Header /><SettingsPage /><ContentHeader tabs={["GENERAL SETTINGS"]} /><SideMenu />
        </div>)
    }
  }
}

export default App;
