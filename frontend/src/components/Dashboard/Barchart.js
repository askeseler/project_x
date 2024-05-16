import * as d3 from "d3";
import { useEffect, useRef } from "react";

let plot = (ref, height, width, url, data, vmax, title)=>{
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data

    function plot(data) {
      if(vmax === undefined) vmax = Math.max(...data.map((x)=>x.Value));
      // X axis
      const x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(d => d.Label))
        .padding(0.2);

      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");
      
      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0, vmax])
        .range([ height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));
      
      // Bars
      svg.selectAll("mybar")
        .data(data)
        .join("rect")
          .attr("x", d => x(d.Label))
          .attr("y", d => y(d.Value))
          .attr("width", x.bandwidth())
          .attr("height", d => height - y(d.Value))
          .attr("fill", "#69b3a2")

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

const Barchart = (props) => {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    if(ref.current.clientHeight !==0)plot(ref, ref.current.clientHeight, ref.current.clientWidth, props.url, props.data, props.vmax, props.title);
    }, []);
  return <div ref={ref} style={{height:"100%"}} />;
};

export default Barchart;