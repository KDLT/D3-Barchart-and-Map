import React, { Component } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { max, extent, min } from "d3-array";
import { select, event } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import { transition } from "d3-transition";

class BarChart extends Component {
  constructor(props) {
    super(props)
    this.createBarChart = this.createBarChart.bind(this);
  }
  componentDidMount() {
    this.createBarChart();
  }
  componentDidUpdate() {
    this.createBarChart();
  }
  createBarChart() {
    const node = this.node;
    const data = this.props.data
    const svgWidth = this.props.size[0];
    const svgHeight = this.props.size[1];
    const padding = 50;
    const dataLength = data.length;
    // const dataMax = max(data, d => d);
    const barGap = 20;
    // yScale starts at zero if minimum value of data is positive
    // yScale starts at the lowest negative number if data contains a negative value
    const yScale = scaleLinear()
                    .domain(min(data) >= 0 ? [0, max(data)] : extent(data, d => d))
                    .range([svgHeight - padding, padding])
    const xScale = scaleBand()
                    .domain(data.map((d,i) => i))
                    .range([padding, svgWidth - padding])
    const xAxis = axisBottom(xScale)
                    .tickSize(-svgHeight+2*padding);
    const yAxis = axisLeft(yScale)
                    .tickSize(-svgWidth+2*padding);
    // console.log("xScale of first item: ", xScale(1))
    const barWidth = svgWidth / dataLength - (2*padding/dataLength) - barGap

    // function handles on mouse events
    // manipulates the position, and styles of the tooltip div in render
    const tooltip = select(".tooltip")
    const handleMouseOver = d => {
      tooltip.transition()
       .duration(200)
       .style("opacity", 0.8)
       .style("transform", "scale(1)")
       .style("transform", "translate(20px, 0)");
    };
    const handleMouseMove = d => {
      tooltip.html("value: " + d)
       .style("left", event.pageX-20+"px")
       .style("top", event.pageY-20+"px");
    };
    const handleMouseOut = d => {
      tooltip.transition()
       .duration(100)
       // .style("opacity", 0)
       .style("transform", "scale(0)");
    };
    // adding the x-axis
    select(node).append("g")
      .attr("class", "x-axis")
      .call(xAxis)
        .attr("transform", `translate(0, ${svgHeight-padding})`);
    // adding the y-axis
    select(node).append("g")
      .attr("class", "y-axis")
      .call(yAxis)
        .attr("transform", `translate(${padding},0)`);
    // creating the group for all rect elements, called bar-graph
    select(node).append("g")
      .attr("class", "bar-graph");
    select(node).select(".bar-graph").selectAll("rect")
      .data(data).enter()
      .append("rect");
    const minToZero = svgHeight - yScale(0) - padding;
    // minToZero represents the pixel distance between zero and minimum data value
    select(node).selectAll("rect")
      .data(data)
      .attr("class", d => (d > 0 ? "rect-positive" : "rect-negative"))
      .attr("x", (d,i) => xScale(i) + barGap/2)
      // if d is negative, starting y-coordinate is always 0
      .attr("y", d => (d >= 0 ? yScale(d) : yScale(0)))
      .attr("width", barWidth)
      // if d < 0, yScale(-d) is used to give the rect height, negate the negative
      // if d >= 0, check still if the min(data) >= 0
      //  in that case, normally calculate for rect height
      //  if there is a negative value, within the dataset, offset the rect height
      //  with minToZero
      .attr("height", d => (
        d >= 0 ?
        (min(data) >= 0 ? svgHeight-yScale(d)-padding :
        svgHeight - yScale(d) - padding - minToZero) : svgHeight-yScale(-d)-padding-minToZero
      ))
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut);
  };
  render() {
    return(
      <div id="bar-div">
        <h2>Bar Chart</h2>
        <svg ref={node => this.node = node}
          width={this.props.size[0]}
          height={this.props.size[1]}>
        </svg>
        <div className={"tooltip"} style={{"opacity": 0}}></div>
      </div>
    );
  };
};
export default BarChart;
