import React, { Component } from "react";
import LoginPage from "./LoginPage";
import './LandingPage.css';
import social_media_research from "./imgs_landing_page/social_media_research.png"
import social_media_user from "./imgs_landing_page/social_media_user.jpg"
import social_media_user2 from "./imgs_landing_page/social_media_user2.jpg"
import social_media_user3 from "./imgs_landing_page/social_media_user3.jpg"
import atsign from "./imgs_landing_page/atsign.png";

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = { loginOpen: false };
    }

    render() {
        return (
            <div style={{overflow: "hidden"}}>

                <div class={"flex-container"} style={{"background": "rgb(28, 29, 29)"}}>
                <div style={{width: "100vw", float: "right", height: "100%", padding: "10px", display: "flex"}}> 
                <div style={{ "fontSize": "24px", "color": "rgb(255,255,255)" }}> SOCIALMEDIAHUB <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PRO</div>      
                </div>
                <div style={{width: "100vw", float: "right", height: "100%", padding: "10px", display: "flex"}}> 
                        <button onClick={()=>this.setState({loginOpen:true, loginOrSignUp:"sign_up"})} style={{ marginLeft: "auto", order: "2", backgroundColor: "#04AA6D", "border": "none", "color": "white", "paddingTop": "10px", "marginRight": "20px", "textAlign": "center", "textDecoration": "none", "display": "inline-block", "fontSize": "16px", "padding": "12px", "marginRight": "20px", "cursor": "pointer" }}>Sign Up</button>
                        <button onClick={()=>this.setState({loginOpen:true, loginOrSignUp:"log_in"})} style={{  order: "2", backgroundColor: "#04AA6D", "border": "none", "color": "white", "paddingTop": "10px", "marginRight": "20px", "textAlign": "center", "textDecoration": "none", "display": "inline-block", "fontSize": "16px", "padding": "12px", "marginRight": "20px", "cursor": "pointer" }}>Log in</button>
                </div>
                </div>
                
                <div style={{ "height": "100vh", "background": "rgb(28, 29, 29)", "width":"100%"}}>
                    <div style={{
                        transform: "translate(20vw, 40vh)",
                        color: "white",
                        fontFamily: "fantasy",
                        fontSize: "3vw"
                    }}>
                        Know the consumer, optimize your communication.
                        <br /> <br /> <br /> We enable datadriven social media research
                    </div>
                </div>
                <LoginPage loginOpen={this.state.loginOpen} closeLogin={()=>this.setState({loginOpen:false})} loginOrSignUp={this.state.loginOrSignUp}/>

                <div class={"flex-container"}>
                <div style={{
                        width: "100vw", float: "right", padding: "10%", display: "flex", alignItems: "center",
                        textJustify: "inter-word", fontSize: "16px"}}> <img style={{ maxWidth: "100%" }} src={social_media_research} /> </div>
                    <div style={{
                        width: "100vw", float: "right", height: "100%", padding: "10%", display: "flex", alignItems: "center", textAlign: "justify",
                        textJustify: "inter-word", fontSize: "16px"
                    }}> Socialmediahub.pro is a platform to study social media usage with a special focus on the history of items in endless-feed user interaces such as the YouTube Shorts platform or the Instagram Feed. We both maintain a panel of users ourselves and offer the tools to recruit and collect your own data. Learn more about your target groups media preferences,
                        the relationships to general opinions and characteristics and monitor current trends and viral contents quantitatively. In addition our tools offers the possibility to consentfully modify the social media feed of your panel users and thus enables experimental studies. We offer on-site data analysis, AI Services including LLM based solutions to enrich and preprocess aquired feature descriptors of media items, Dashboard visualizations but also a simple Excel export of raw and processed data. </div>
                </div>

                <div style={{ height: "10vh", background: "rgb(241, 241, 241)" }}></div>
                <div class={"flex-container"}>
                    <div style={{"backgroundColor":"#f1f1f1","padding":"30px","flex":"33%","width":"100vw"}}>
                        <div>
                            <div style={{ background: "rgb(182, 96, 116)", borderTopLeftRadius: "15px", borderTopRightRadius: "15px", height: "40px", }}><div style={{ transform: "translateY(10px)", fontSize: "20px", color: "white" }}>Free</div></div>
                            <div style={{ background: "rgb(245, 245, 244)", height: "250px" }}><div style={{ display: "flex", justifyContent: "center" }}><img className={"callForActionImg"} src="https://i.postimg.cc/2jcfMcf4/hot-air-balloon.png" alt="hot-air-balloon" /></div><br />0$</div>
                            <div style={{ background: "rgb(255, 255, 255)", height: "45vh", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                                <ul>
                                    <li>Single license for starters</li>
                                    <li>Access to all basic features</li>
                                    <li>Create your own panel of participants</li>
                                    <li>Free Download of browser extension</li>
                                    <li>Basic support</li>
                                    <li>For academic use only</li>
                                </ul>
                                <br />
                            </div>
                            <button className={"freeTrialButton"}> Free Trial</button>

                        </div>
                    </div>
                    <div style={{"backgroundColor":"#f1f1f1","padding":"30px","flex":"33%","width":"100vw"}}>
                        <div>
                            <div style={{ background: "rgb(69, 121, 166)", borderTopLeftRadius: "15px", borderTopRightRadius: "15px", height: "40px", }}><div style={{ transform: "translateY(10px)", fontSize: "20px", color: "white" }}>Basic</div></div>
                            <div style={{ background: "rgb(245, 245, 244)", height: "250px" }}><div style={{ display: "flex", justifyContent: "center" }}><img className={"callForActionImg"} src="https://i.postimg.cc/DzrTN72Z/airplane.png" alt="hot-air-balloon" /></div><br />Coming soon</div>
                            <div style={{ background: "rgb(255, 255, 255)", height: "45vh", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                                <ul>
                                    <li>Up to five licenses and accounts</li>
                                    <li>Access to all basic features</li>
                                    <li>Create and maintain multiple panels</li>
                                    <li>Free download of browser extension</li>
                                    <li>Special support and custom features</li>
                                    <li>For academic use only</li>
                                </ul>
                                <br />
                            </div>
                            <button className={"freeTrialButton"}> Coming Soon</button>
                        </div>
                    </div>
                    <div style={{"backgroundColor":"#f1f1f1","padding":"30px","flex":"33%","width":"100vw"}}>
                        <div>
                            <div style={{ background: "rgb(111, 184, 180)", borderTopLeftRadius: "15px", borderTopRightRadius: "15px", height: "40px", }}><div style={{ transform: "translateY(10px)", fontSize: "20px", color: "white" }}>Full Commercial</div></div>
                            <div style={{ background: "rgb(245, 245, 244)", height: "250px" }}><div style={{ display: "flex", justifyContent: "center" }}><img className={"callForActionImg"} src="https://i.postimg.cc/wvFd6FRY/startup.png" alt="hot-air-balloon" /></div><br />Coming soon</div>
                            <div style={{ background: "rgb(255, 255, 255)", height: "45vh", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                                <ul>
                                    <li>Access to all basic features</li>
                                    <li>Create and maintain multiple panels</li>
                                    <li>Free download of browser extension</li>
                                    <li>Special support and custom features</li>
                                    <li>Commercial license</li>
                                </ul>
                                <br />
                            </div>
                            <button className={"freeTrialButton"}> Coming Soon</button>

                        </div>
                    </div>
                </div>
                <div style={{ height: "10vh", background: "rgb(241, 241, 241)", width: "100%" }}></div>

                <div style={{ "height": "100vh", "background": "rgb(100, 211, 152)" }}>
                    <div style={{
                        width: "33%", float: "left", height: "100%", padding: "5%", display: "flex", alignItems: "center", textAlign: "justify",
                        textJustify: "inter-word", fontSize: "16px"
                    }}> <img style={{ width: "120%" }} src={social_media_user} /> </div>
                    <div style={{
                        width: "33%", float: "left", height: "100%", padding: "5%", display: "flex", alignItems: "center", textAlign: "justify",
                        textJustify: "inter-word", fontSize: "16px"
                    }}> <img style={{ width: "120%" }} src={social_media_user3} /> </div>
                    <div style={{
                        width: "33%", float: "left", height: "100%", padding: "5%", display: "flex", alignItems: "center", textAlign: "justify",
                        textJustify: "inter-word", fontSize: "16px"
                    }}> <img style={{ width: "120%" }} src={social_media_user2} /> </div>

                </div>
                <div style={{ "height": "30vh", "background": "rgb(28, 29, 29)" }}>
                    <div style={{ color: "white", float: "right", width: "250px", transform: "translate(-50px,50px)" }}>Data Protection: This site does not use cookies other then the ones being technically strictly necessary.<br />
                        Contact: hordeum.berlin<img src={atsign} style={{ width: "12px", height: "12px", top: "3px" }} />gmail.com
                    </div>
                </div>


            </div>
        );
    }
}

export default LandingPage;