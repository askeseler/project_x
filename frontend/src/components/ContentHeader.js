import React from "react";

function ContentHeader(props) {
    let tabs = []
    if(props.tabs) tabs = props.tabs;
    return (
        <div className="content_header">
            <div style={{ padding: "32px" }}>
                {tabs.map((name)=><><div className="content_header_tab" style={{ width: "50px" }}></div>
                <div className={["active", "underline", "content_header_tab"].join(" ")}>{name}</div></>)}
            </div>
        </div>
    );
}

export default ContentHeader;