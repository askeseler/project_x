import alt_data from "./scenarios.json";
import React, { useEffect, useState, useRef } from 'react';
import "./DashboardPage.css"
import Barchart from "./Dashboard/Barchart.js"
import Scatterplot from "./Dashboard/Scatterplot.js"
import Linechart from "./Dashboard/Linechart.js"
import data1 from './Dashboard/data1.json';
import data2 from './Dashboard/data2.json';
import data3 from './Dashboard/data3.json';

function DashboardPage(props) {
    //const [data1, setData1] = useState([]);

    return (
        <div className="content" style={{ padding: "50px", borderRadius:"5px" }}>
            <div class="dashboard-container">
            <div class="ul"></div>
            <div class="t1l1" style={{}}> <Barchart url={window.api + "/plots/dist_comments/"} title="Distribution of Comments"/></div>
            <div class="t1l2" style={{}}> <Scatterplot url={window.api + "/plots/scatterplot_comments_likes/"} title="n_comments x n_likes"/></div>
            <div class="t1l3"> <Linechart url={window.api + "/plots/daily_user_activity/"} title="Daily User Activity"/></div>
            <div class="t2l1"> <Barchart url={window.api + "/plots/dist_likes/"} title="Distribution of likes"/></div>
            <div class="t2l2"> </div>
            <div class="t2l3"> </div>
            <div class="t3l1"> </div>
            <div class="t3l2"> </div>
            <div class="t3l3"> </div>
        </div>
        </div>
       );
}
export default DashboardPage;