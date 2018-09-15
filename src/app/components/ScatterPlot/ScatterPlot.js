import React, { Component } from "react";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { select, event } from "d3-selection";
import { axisLeft, axisBottom } from "d3-axis";
import { transition } from "d3-transition";

class ScatterPlot extends Component {
  constructor(props) {
    super(props)
    this.state = {};
    this.createScatter = this.createScatter.bind(this);
  };
  componentDidMount() {
    this.createScatter();
  };
  createScatter() {
    const node = this.node;
    const data = this.props.data;
    const svg_h = this.props.size[1];
    const svg_w = this.props.size[0];
    const padding = 50;
    const radius = 10;
    const xMax = max(data, d => d[0]);
    console.log("xMax: ",xMax);
    const yMax = max(data, d => d[1]);
    console.log("yMax: ",yMax);

    const xScale = scaleLinear()
              .domain([0, xMax + 20])
              .range([padding, svg_w-padding]);
    const yScale = scaleLinear()
              .domain([0, yMax + 50])
              .range([svg_h-padding, padding]);
    console.log("xScale 34: ", xScale(34));
    console.log("yScale 78: ", yScale(78));
    const xAxis = axisBottom(xScale).ticks(10).tickSize(-svg_h+padding*2);
    const yAxis = axisLeft(yScale).tickSize(-svg_w+padding*2);
    // group for x-axis
    select(node).append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${svg_h - padding})`)
      .call(xAxis)
    // groups for y-axis
    select(node).append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${padding},0)`)
      .call(yAxis)
    // mouse event handlers
    const tooltip = select(".scatter-tooltip");
    const handleMouseOver = d => {
      tooltip.transition().duration(100)
        .style("opacity", 0.9)
        .style("transform", "scale(1) translate(0, -10px)")
    };
    const handleMouseMove = d => {
      tooltip.html(d[0] + ", " + d[1])
        .style("top", event.pageY-18+"px")
        .style("left", event.pageX-35+"px")
    };
    const handleMouseOut = d => {
      tooltip.transition().duration(100)
        .style("opacity", 0)
        .style("transform", "scale(0)")
    };
    // make new group for scatter plot
    select(node).append("g")
      .attr("class", "circles-group")
    select(".circles-group").selectAll("circle")
      .data(data).enter()
      .append("circle")
      .attr("class", "circle-scatter")
    select(node).selectAll("circle")
      .data(data)
      .attr("cx", d => xScale(d[0]))
      .attr("cy", d => yScale(d[1]))
      .attr("r", d => Math.floor(Math.random()*12 + 5))
      .on("mouseenter", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut)

  };
  render() {
    return(
      <div id="scatter-plot">
        <h2>Scatter Plot</h2>
        <svg ref={node => this.node = node}
          width={this.props.size[0]}
          height={this.props.size[1]}/>
        <div className={"scatter-tooltip"} style={{"opacity": 0}}></div>
      </div>
    );
  }
}

export default ScatterPlot
