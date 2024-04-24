import React from "react";
import "./LoginPage.css"
import { useRef, useState } from "react";
import ReCAPTCHA from 'react-google-recaptcha'
import Cookies from 'universal-cookie';
import env from "./env.json"
const page_cookies = new Cookies();

let REACT_APP_SITE_KEY = env.REACT_APP_SITE_KEY;

function disableScrolling(){
  var x=window.scrollX;
  var y=window.scrollY;
  window.onscroll=function(){window.scrollTo(x, y);};
}

function enableScrolling(){
  window.onscroll=function(){};
}

const login_style = {
  position: 'fixed',
  height: "50%",
  width: "50%",
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function LoginPage({ loginOpen, closeLogin, loginOrSignUp }){
  const recaptcha = useRef();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");

  let url;
  let success_msg;

   success_msg = "A Mail was sent to your address. Check the inbox and follow the instructions to complete the registration.";
   let signup_url = window.api + "/user/send_sign_up_mail";
   let login_url = window.api + "/user/login";
  
  async function sendRegistrationLink(event) {
    event.preventDefault();
    const captchaValue = recaptcha.current.getValue();
    //console.log(JSON.stringify({ captchaValue }));
    if (!captchaValue) {
      alert("Please verify the reCAPTCHA!");
    } else {
      console.log("verifying via backend")
      let body = { captchaValue };
      body["email"] = email;
      const res = await fetch(signup_url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
      });
      const success = await res.json();
      if (success) {
        alert(success_msg);
      } else {
        alert("reCAPTCHA validation failed!");
      }
    }
  }

  async function sendLogin(event) {
    event.preventDefault();
    const captchaValue = recaptcha.current.getValue();
    if (!captchaValue) {
      alert("Please verify the reCAPTCHA!");
    } else {
      let body = { captchaValue };
      body["email"] = email;
      body['password'] = pwd;
      const res = await fetch(login_url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
      });
      const token = await res.json();
      if (token) {
        page_cookies.set("access_token", token["access_token"]);
        window.location.href = "AppDataLatestContents";
      } else {
        alert("Login failed.");
      }
    }
  }

  if (loginOpen && loginOrSignUp==="sign_up"){
  return (
    <div style={login_style}>
    <div style={{transform:"translateY(10%)"}}>
      <h1>Sign up via email</h1>
      <div onClick={()=>closeLogin()} style={{color:"red", position:"relative", transform: "translate(93%, -320%)", cursor:"pointer"}}>❌</div>
      <form onSubmit={sendRegistrationLink}>
        <input
          name="Email"
          type={"email"}
          value={email}
          required
          placeholder="joe@example.com"
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          name="Name"
          type={"name"}
          value={name}
          required
          placeholder="Joe"
          onChange={(event) => setName(event.target.value)}
        />
        <button type="submit">Sign up</button>
        <ReCAPTCHA ref={recaptcha} sitekey={REACT_APP_SITE_KEY} />
      </form>
    </div>
  </div>
  )}
  
  if (loginOpen && loginOrSignUp==="log_in"){
    return (
      <div style={login_style}>
      <div style={{transform:"translateY(10%)"}}>
        <h1>Log in to your account</h1>
        <div onClick={()=>closeLogin()} style={{color:"red", position:"relative", transform: "translate(93%, -320%)", cursor:"pointer"}}>❌</div>
        <form onSubmit={sendLogin}>
          <input
            name="Email"
            type={"email"}
            value={email}
            required
            placeholder="joe@example.com"
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            name="Name"
            type="password"
            required
            onChange={(event) => setPwd(event.target.value)}
          />
          <button type="submit">Login</button>
          <ReCAPTCHA ref={recaptcha} sitekey={REACT_APP_SITE_KEY} />
        </form>
      </div>
    </div>
    )}
  else return <></>;
};

export default LoginPage;

