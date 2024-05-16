import alt_data from "./scenarios.json";
import React, { useEffect, useState, useRef } from 'react';
import { Checkbox, Table, Icon } from "semantic-ui-react";
import Cookies from 'universal-cookie';
import "./SettingsPage.css"

const page_cookies = new Cookies();

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function validatePassword(pw) {
    return /[A-Z]/       .test(pw) &&
           /[a-z]/       .test(pw) &&
           /[0-9]/       .test(pw) &&
           /[^A-Za-z0-9]/.test(pw) &&
           pw.length > 8;
}

function cookies2state(cookies, setters){
    for(let tuple of zip(cookies, setters)){
        let cookie_val = page_cookies.get(tuple[0]);
        if(cookie_val)tuple[1](cookie_val);
        //page_cookies.remove(tuple[0], { path: '/' });
    }
}

function SettingsPage(props) {
    const rpwd = useRef();
    const rpwd_repeat = useRef();

    const [email, set_email] = useState("");
    const [user_has_token, set_user_has_token] = useState(0);


    const sendMail = async () =>{
        let response = await fetch(window.api + "/user/details");
        let user_details = await response.json();
        set_email(user_details["email"]);
    }

    useEffect(() => {sendMail()}, []);

    //cookies2state(["user_email", "user_has_token"],[set_email, set_user_has_token]);

    let url = window.api + "/user/change_password"
    async function update_password(){
        let pwd = rpwd.current.value;
        let pwd_repeat = rpwd_repeat.current.value;
        if(pwd == pwd_repeat){
            if (validatePassword(pwd)){
            let body = {password:pwd, email:"n@n.com"}
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                  "content-type": "application/json",
                },
              });
              const success = await res.json();
              alert(JSON.stringify(success));
            }else{
                alert("Passwords must match these conditions: At least one uppercase letter. At least one lowercase letter. At least one digit. At least one special symbol. At least 8 signs");
            }
        }else{
            alert("Passwords do not match.");
        }
    }

    return (
        <div className="content" style={{ padding: "50px" }}>
            <div className={"flex-container-settings"}>
                <div className={"settings-c1"}>
                    <div>Change Password</div>
                <label htmlFor="email" className="settings_input_label">Email Address</label>
                <input type="text" readOnly="readonly" id="email" autoComplete="off" className="settings_input" value={email}></input>
                <label htmlFor="pwd" className="settings_input_label">Password</label>
                <input ref = {rpwd} type="password" id="pwd" data-ref="cardNumber" autoComplete="off" className="settings_input"></input>
                <label htmlFor="pwd_repeat" className="settings_input_label">Repeat Password</label>
                <input ref ={rpwd_repeat} type="password" id="pwd_repeat" data-ref="cardNumber" autoComplete="off" className="settings_input"></input>
                <br/>
                <br/>
                <button onClick={()=>update_password()}>Update Password</button>
                </div>
                <div className={"settings-c2"}></div>
            </div>
        </div>
       );
}
export default SettingsPage;