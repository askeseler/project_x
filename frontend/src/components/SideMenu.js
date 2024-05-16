import React from "react";
import { useState } from 'react';

import database_icon from './icons/database_icon.svg';
import dashboard_icon from './icons/dashboard_icon.svg';
import home_icon from './icons/home_icon.svg';
import settings_icon from './icons/settings_icon.svg';
import extension_icon from './icons/extension_icon.svg';
import user_administration from './icons/user_administration.svg';
import users_icon from './icons/users_icon.svg';

function SideMenu(props) {
    return (
        <div className="menu">
            <a href="AppDataLatestContents">
            <div className="sidemenuitem">
                <div className="sidemenuitem_panel">
                    <img className="sidemenuitem_icon" src={database_icon} alt="" />
                </div>
                <div className="sidemenuitem_text">Data</div>
            </div></a>
            <a href="DashboardPage">
            <div className="sidemenuitem">
                <div className="sidemenuitem_panel">
                <img className="sidemenuitem_icon" src={dashboard_icon} alt="" />
                </div>
                <div className="sidemenuitem_text">Dashboard</div>
            </div></a>
            <a href="UsersPage">
            <div className="sidemenuitem">
                <div className="sidemenuitem_panel">
                <img className="sidemenuitem_icon" src={users_icon} alt="" />
                </div>
                <div className="sidemenuitem_text">Users</div>
            </div></a>
            <a href="ExtensionPage">
            <div className="sidemenuitem">
                <div className="sidemenuitem_panel">
                <img className="sidemenuitem_icon" src={extension_icon} alt="" />
                </div>
                <div className="sidemenuitem_text">Extension</div>
            </div></a>
            <a href="SettingsPage">
            <div className="sidemenuitem">
                <div className="sidemenuitem_panel">
                    <img className="sidemenuitem_icon" src={settings_icon} alt="" />
                </div>
                <div className="sidemenuitem_text">Settings</div>
            </div></a>
        </div>
    );
}

export default SideMenu;