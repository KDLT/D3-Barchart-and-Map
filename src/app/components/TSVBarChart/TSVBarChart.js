import React, { Component } from "react";
import { scaleLinear, scaleBand } from "d3-scale"
import { max, min } from "d3-array";
import { select, event } from "d3-selection";
import { dsv } from "d3-fetch";
import { axisLeft, axisBottom } from "d3-axis"
import { transition } from "d3-transition";

class TSVBarChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      title: "TSV Vertical Chart",
      size: { w: 1200, h: 500 },
      margin: { top: 20, right: 30, bottom: 30, left: 40 },
      padding: 50,
      barGap: 10
    };
    this.fetchTSV = this.fetchTSV.bind(this);
    this.createTSVChart = this.createTSVChart.bind(this);
  };
  componentDidMount() {
    this.fetchTSV("https://raw.githubusercontent.com/KDLT/D3-Barchart-and-Map/master/data.tsv");
    // console.log("data on mount: ", this.state.data);
  };
  componentDidUpdate() {
    this.createTSVChart();
    // console.log("data on update: ", this.state.data);
  };
  fetchTSV(address) {
    // integrated na ang pag-parse ng data types
    dsv("\t", address, (data) => ({
      letter: data.name,
      value: +data.value // + converts into int
    }))
    .then((data) => {
      let newData = data.slice(0, data.length); // para matanggal 'yung dulong element
      this.setState({ data: newData });
      console.log("data after fetch: ", this.state.data);
    })
  };
  createTSVChart() {
    // console.log("data on createTSVChart: ", this.state.data)
    const node = this.node;
    const data = this.state.data;

    const dataLength = data.length;
    const padding = this.state.padding;
    const svg_w = this.state.size.w;
    const svg_h = this.state.size.h;
    const dataMax = max(data, d => d.value);
    const dataMin = min(data, d => d.value);
    const xDomain = data.map((i) => i.letter);
    // console.log("xDomainTest: ", xDomain);
    const xScale = scaleBand() // scaleBand is different, input is the actual letter
                    .domain(data.map(d => d.letter))
                    .range([padding, svg_w - padding])
                    // it interpolates the index of that letter in the range you gave
    const yScale = scaleLinear()
                    .domain([0, dataMax])
                    // .range([padding, svg_h - padding])
                    .range([svg_h - padding, padding])

    const barWidth = svg_w / dataLength - (2 * padding / dataLength) - this.state.barGap

    const xAxis = axisBottom(xScale);
    const yAxis = axisLeft(yScale)
                    .ticks(10, "%")
                    .tickSize(-svg_w+padding*2); //note the negative svg_w
                    // format ng tickmarks sakas kung ilan
                    // kahit 10 ito, 13 ang ididisplay kasi maganda dapat
    // x-axis group
    select(node).append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${svg_h - padding})`)
      .call(xAxis);
    // y-axis group
    select(node).append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);
    // mouse event handlers
    const tooltip = select("#tsv-tooltip")
    const handleMouseOver = () => {
      tooltip.transition().duration(100)
        .style("opacity", 0.9)
        .style("transform", "scale(1) translate(0px, -20px)")
    };
    const handleMouseMove = d => {
      tooltip.html((d.value*100).toFixed(2)+"%")
        .style("left", event.pageX-27.5+"px")
        .style("top", event.pageY-18+"px")
    };
    const handleMouseOut = () => {
      tooltip.transition().duration(200)
        .style("opacity", 0)
        .style("transform", "scale(0)")
    };
    // group for actual chart rect elements
    select(node).append("g")
      .attr("class", "bar-group")
    select(".bar-group").selectAll("rect")
      .data(data).enter()
      .append("rect")
      .attr("class", "tsv-col-bar")
    select(node).selectAll("rect")
      .data(data)
      // scaleBand's effect is instead of using i for placing rect,
      // the name property can and must be used
      .attr("x", (d,i) => xScale(d.letter) + this.state.barGap/2)
      .attr("y", (d,i) => yScale(d.value))
      .attr("width", (d,i) => barWidth)
      .attr("height", (d,i) => svg_h - yScale(d.value) - padding)
      .style("fill", d => (
        d.value == dataMax ? "rgb(43, 27, 224)" :
        (d.value == dataMin ? "rgb(186, 32, 32)" : "rgba(93, 255, 202, 0.8)")
        : "rgba(93, 255, 202, 0.8)"
      ))
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut)
  };
  render() {
    return(
      <div id="bar-div">
        <h2>{this.state.title}</h2>
        <svg ref={node => this.node = node}
          width={this.state.size.w}
          height={this.state.size.h}
          className={"tsv-bar"} />
        <div id={"tsv-tooltip"} style={{"opacity":0}}></div>
      </div>
    );
  };
};

export default TSVBarChart;
