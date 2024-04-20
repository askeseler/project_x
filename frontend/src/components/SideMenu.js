import React from "react";
import { useState } from 'react';

import database_icon from './icons/database_icon.svg';
import dashboard_icon from './icons/dashboard_icon.svg';
import home_icon from './icons/home_icon.svg';
import settings_icon from './icons/settings_icon.svg';
import user_administration from './icons/user_administration.svg';
import users_icon from './icons/users_icon.svg';

function SideMenu(props) {
    return (
        <div className="menu">
            <div className="sidemenuitem">
                <div className="sidemenuitem_panel">
                    <img className="sidemenuitem_icon" src={database_icon} alt="" />
                </div>
                <div className="sidemenuitem_text">Data</div>
            </div>
            <div className="sidemenuitem">
                <div className="sidemenuitem_panel">
                    <img className="sidemenuitem_icon" src={dashboard_icon} alt="" />
                </div>
                <div className="sidemenuitem_text">Dashboard</div>
            </div>
            <div className="sidemenuitem">
                <div className="sidemenuitem_panel">
                    <img className="sidemenuitem_icon" src={users_icon} alt="" />
                </div>
                <div className="sidemenuitem_text">Users</div>
            </div>
            <div className="sidemenuitem">
                <div className="sidemenuitem_panel">
                    <img className="sidemenuitem_icon" src={settings_icon} alt="" />
                </div>
                <div className="sidemenuitem_text">Settings</div>
            </div>
        </div>
    );
}

export default SideMenu;