import * as d3 from "d3";
import { useEffect, useRef } from "react";

let plot = (ref, height, width, url, data, title, xmin, ymin, xmax, ymax)=>{

// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 60};
        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select(ref.current)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    function plot(data) {
      if(xmax === undefined)xmax = Math.max(...data.map((item)=>item.x));
      if(xmin === undefined)xmin = Math.min(...data.map((item)=>item.x));
      if(ymin === undefined)ymin = Math.min(...data.map((item)=>item.y));
      if(ymax === undefined)ymax = Math.max(...data.map((item)=>item.y));

      // Add X axis
      const x = d3.scaleLinear()
      .domain([0, xmax])
      .range([ 0, width ]);
      svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
  
      // Add Y axis
      const y = d3.scaleLinear()
      .domain([0, ymax])
      .range([ height, 0]);
      svg.append("g")
      .call(d3.axisLeft(y));
  
      // Add dots
      svg.append('g')
      .selectAll("dot")
      .data(data)
      .join("circle")
          .attr("cx", function (d) { return x(d.x); } )
          .attr("cy", function (d) { return y(d.y); } )
          .attr("r", 1.5)
          .style("fill", "#69b3a2")

          svg.append('text')
          .attr('class', 'title')
          .attr('x', width / 2)
          .attr('y', margin.top / 2)
          .attr('text-anchor', 'middle')
          .text(title);    
  
      }

  if(data===undefined)d3.json(url).then((data)=>plot(data));
  else plot(data);
}

const Scatterplot = (props) => {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    if(ref.current.clientHeight !==0)plot(ref, ref.current.clientHeight, ref.current.clientWidth, props.url, props.data, props.title, props.xmin, props.ymin, props.xmax, props.ymax);
    }, []);
  return <div ref={ref} style={{height:"100%"}} />;
};

export default Scatterplot;