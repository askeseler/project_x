import React from "react";
import SideMenu from "./components/SideMenu.js";
import Header from "./components/Header.js";
import ContentHeader from "./components/ContentHeader.js";
import AppDataLatestContents from "./components/AppDataLatestContents.js"
import LandingPage from "./components/LandingPage.js"

import './MainScreen.css';

//window.onload = function() {console.log(window.location.pathname.split('/').slice(1));}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.default_page = "LandingPage"//SET THIS PAGE
    this.state = { page: this.default_page}
  }

  componentDidMount() {
      // Prevent navigation via href. Change url instead manually and update state.page for conditional rendering.
      window.block_navigation = true;
      window.navigation.addEventListener("navigate", (event) => {
        if(window.block_navigation){
          event.preventDefault();
          let new_slug = new URL(event.destination.url).pathname;
          window.block_navigation = false;
          window.history.pushState('', document.title, new_slug);
          window.block_navigation = true;
          this.setState({page: new_slug.slice(1)})
        };
      });
    }

  render() {
    return (
      <> 
        {this.state.page === "LandingPage" ? (<LandingPage />) : (
          <div className="container" style={{ width: "100%" }}>
            <Header />
            {this.state.page === "AppDataLatestContents" ? (<AppDataLatestContents />) : (<></>)}
            <ContentHeader />
            <SideMenu />
          </div>
        )}
      </>
    );
  }
}

export default App;
