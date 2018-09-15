import React, { Component } from "react";
import { scaleLinear, scaleTime } from "d3-scale";
import { max, extent, min } from "d3-array";
import { select, event } from "d3-selection";
import { dsv } from "d3-fetch";
import { axisLeft, axisBottom } from "d3-axis";
import { timeFormat } from "d3-time-format";
import { line } from "d3-shape"
import { transition } from "d3-transition";

class LineDotGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      padding: 50
    };
    this.fetchCSV = this.fetchCSV.bind(this);
    this.createLineDotGraph = this.createLineDotGraph.bind(this);
  };
  componentDidMount() {
    this.fetchCSV("https://raw.githubusercontent.com/KDLT/D3-Barchart-and-Map/master/linedata.csv");
  };
  componentDidUpdate() {
    console.log("lineDotGraph update:",this.state.data)
    this.createLineDotGraph();
  };
  fetchCSV(address) {
    dsv(",", address, d => ({
      date: new Date(d.date),
      close: +d.close
    }))
    .then(d => {
      this.setState({ data: d.slice(0, d.length) })
    })
  };
  createLineDotGraph() {
    // console.log("createLineDotGraph...");
    const node = this.node;
    const data = this.state.data;
    const padding = this.state.padding;
    const h = this.props.size[1];
    const w = this.props.size[0];
    // console.log("data: ", data);
    const xScale = scaleTime()
                    .domain(extent(data, d=>d.date))
                    .range([padding, w-padding])
    const yScale = scaleLinear()
                    .domain([0, max(data, d => d.close)])
                    .range([h-padding, padding])
    const yAxis = axisLeft(yScale)
                    .ticks(5);
    const xAxis = axisBottom(xScale)
                    .ticks(10)
                    .tickFormat(timeFormat("%a %d"));
    const maxClose = max(data, d => d.close); console.log("maxClose: ",maxClose)
    const minClose = min(data, d => d.close);
    select(node).append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${h-padding})`)
      .call(xAxis)

    select(node).append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .attr("class", "y-axis")
      .call(yAxis)

    const valueLine = line().x(d => xScale(d.date)).y(d => yScale(d.close))

    select(node).append("g")
      .attr("class", "line-dot-graph")
      .append("path")
      .attr("id", "line-path")
    select(node).select("#line-path")
      .data([data])
      .attr("d", valueLine)

    const tooltip = select(".line-points-tooltip");

    const handleMouseOver = d => {
      tooltip.transition()
        .duration(100)
        .style("opacity", 0.9)
        .style("width", 185)
        .style("transform", "scale(1)")
        .style("transform", "translate(0, -36px)")
    };
    const formatTime = timeFormat("%a %d %b %Y");
    const handleMouseMove = d => {
      tooltip.html("date: " + formatTime(d.date) + " <br />" + "close: " + d.close)
        .style("left", event.pageX-92.5+"px")
        .style("top", event.pageY-12+"px");
    };
    const handleMouseOut = d => {
      tooltip.transition()
        .duration(100)
        .style("transform", "scale(0)")
        .style("opacity", 0)
    };

    select(node).append("g")
      .attr("class", "points-group")
      .selectAll("circle")
        .data(data).enter()
        .append("circle")
        .attr("class", "data-point")

    select(node).selectAll("circle")
      .data(data)
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.close))
      .attr("r", 2)
      .style("stroke", d => d.close == maxClose ? "rgb(106, 104, 252)" :
        (d.close == minClose ? "rgb(255, 59, 80)" : "navy") : "navy" )
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut)
  };
  render() {
    return(
      <div id="line-dot-graph">
        <h2>Line Dot Graph</h2>
        <svg ref={node => this.node = node}
          width={this.props.size[0]}
          height={this.props.size[1]}/>
        <div className={"line-points-tooltip"}
          style={{"opacity": 0}}></div>
      </div>
    );
  };
};

export default LineDotGraph;
