import * as d3 from "d3";
import { useEffect, useRef } from "react";

let addLinechart = (ref, height, width, data, url, title) => {
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 };
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select(ref.current)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  // When reading the csv, I must format variables:
  //function(d){
  //  return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
  //}).then(
  // Now I can use this dataset:
  function plot(data) {
   console.log(data);
    data = data.map(function (d) { return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value } });

    console.log(data);

  // Add X axis --> it is a date format
  const x = d3.scaleTime()
    .domain(d3.extent(data, function (d) { return d.date; }))
    .range([0, width]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) { return +d.value; })])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add the line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y(d.value) })
    )

    svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2)
    .attr('y', margin.top / 2)
    .attr('text-anchor', 'middle')
    .text(title);
  }


  if(data===undefined)d3.json(url).then((data)=>plot(data));
  else plot(data);
  //console.log(all_data)


}

const Linechart = (props) => {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.clientHeight !== 0) addLinechart(ref, ref.current.clientHeight, ref.current.clientWidth, props.data, props.url, props.title);
  }, []);
  return <div ref={ref} style={{ height: "100%" }} />;
};

export default Linechart;