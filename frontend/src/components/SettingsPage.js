import alt_data from "./scenarios.json";
import React, { useEffect, useState, useRef } from 'react';
import { Checkbox, Table, Icon } from "semantic-ui-react";
import Cookies from 'universal-cookie';
import "./SettingsPage.css"

const cookies = new Cookies();

var checkCookie = function(callback) {

    var lastCookie = document.cookie; // 'static' memory between function calls

    return function() {

        var currentCookie = document.cookie;

        if (currentCookie != lastCookie) {

            callback()

            lastCookie = currentCookie; // store latest cookie

        }
    };
}();

function SettingsPage(props) {
    const rusername = useRef();
    const rpwd = useRef();
    const rpwd_repeat = useRef();

    let url = window.api + "/user/change_password"
    async function update_password(){
        let email = cookies.get("email");
        let token = cookies.get("new_pwd_token");
        let pwd = rpwd.current.value;
        let pwd_repeat = rpwd_repeat.current.value;
        let username = rusername.current.value;
        if(pwd == pwd_repeat){
            let body = {email:email, token:token, password:pwd, fullname:username}
            console.log(body);
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
            alert("Passwords do not match")
        }
    }

    return (
        <div className="content" style={{ padding: "50px" }}>
            <div class={"flex-container-settings"}>
                <div class={"settings-c1"}>
                <label for="email" class="settings_input_label">Email Address</label>
                <input type="text" id="email" autocomplete="off" class="settings_input" value={cookies.get("email")}></input>
                <label for="token" class="settings_input_label">Password Update Token</label>
                <input type="text" id="token" autocomplete="off" class="settings_input" value={cookies.get("new_pwd_token")}></input>
                <label for="username" class="settings_input_label">Name</label>
                <input ref={rusername} type="text" id="username" data-ref="cardNumber" autocomplete="off" class="settings_input"></input>
                <label for="pwd" class="settings_input_label">Password</label>
                <input ref = {rpwd} type="password" id="pwd" data-ref="cardNumber" autocomplete="off" class="settings_input"></input>
                <label for="pwd_repeat" class="settings_input_label">Repeat Password</label>
                <input ref ={rpwd_repeat} type="password" id="pwd_repeat" data-ref="cardNumber" autocomplete="off" class="settings_input"></input>
                <br/>
                <br/>
                <button onClick={()=>update_password()}>Update Password</button>
                </div>
                <div class={"settings-c2"}></div>
            </div>
        </div>
       );
}
export default SettingsPage;