import React from "react";

function ContentHeader(props) {
    return (
        <div className="content_header">
            <div style={{ padding: "32px" }}>
                <div className="content_header_tab" style={{ width: "50px" }}></div>
                <div className={["active", "underline", "content_header_tab"].join(" ")}>LATEST CONTENTS</div>
                <div className="content_header_tab" style={{ width: "50px" }}></div>
                <div className={["active", "underline", "content_header_tab"].join(" ")}>USER HISTORY</div>
                <div className="content_header_tab" style={{ width: "50px" }}></div>
                <div className={["active", "underline", "content_header_tab"].join(" ")}>SEARCH & FILTER</div>
            </div>
        </div>
    );
}

export default ContentHeader;