import React, { Component } from "react";
import { scaleLinear, scaleBand } from "d3-scale"
import { max } from "d3-array";
import { select } from "d3-selection";
import { dsv } from "d3-fetch";
import { axisLeft, axisBottom } from "d3-axis";

class TSVHorizontalChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      title: "TSV Horizontal Chart",
      svgSize: { w: 1200, h: 500 },
      padding: 50
    };
    this.fetchTSV = this.fetchTSV.bind(this);
    this.createTSVChart = this.createTSVChart.bind(this);
  };
  componentDidMount() {
    this.fetchTSV("https://raw.githubusercontent.com/KDLT/D3-Barchart-and-Map/master/d3.tsv");
    // console.log("data on mount: ", this.state.data);
  };
  componentDidUpdate() {
    this.createTSVChart();
    // console.log("data on update: ", this.state.data);
  };
  fetchTSV(address) {
    // integrated na ang pag-parse ng data types
    dsv("\t", address, (data) => ({
      name: data.name,
      value: +data.value // + converts into int
    }))
    .then((data) => {
      let newData = data.slice(0, data.length); // para matanggal 'yung dulong element
      this.setState({ data: newData });
      console.log("data after fetch: ", this.state.data);
    })
  };
  createTSVChart() {
    console.log("data on createTSVChart: ", this.state.data)
    const node = this.node;
    const data = this.state.data;
    const dataLength = data.length;
    const svgWidth = this.state.svgSize.w;
    const svgHeight = this.state.svgSize.h;
    const padding = this.state.padding;
    const dataMax = max(data, d => d.value);
    console.log(dataMax);
    const xScale = scaleLinear()
                    .domain([0, dataMax])
                    .range([padding, svgWidth - padding])
    const yScale = scaleLinear()
                    .domain([0, dataLength])
                    .range([padding, svgHeight - padding])

    const barHeight = svgHeight / dataLength - (2 * padding / dataLength) - 10

    const xAxis = axisBottom(xScale);
    const yAxis = axisLeft(yScale);
    // x-axis group
    select(node).append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${svgHeight-padding})`)
      .call(xAxis)
    // rect group
    select(node).append("g")
      .attr("class", "bar-group")
      .selectAll("rect")
        .data(data).enter()
        .append("rect")
          .attr("class", "bar")
          .attr("x", (d,i) => padding)
          .attr("y", (d,i) => yScale(i))
          .attr("width", (d,i) => xScale(d.value)-padding)
          .attr("height", (d,i) => barHeight)
    // text labels group
    select(node).append("g")
      .attr("class", "rect-text")
      .selectAll("text")
        .data(data).enter()
        .append("text")
      select(".rect-text").selectAll("text")
        .data(data)
        .attr("x", (d,i) => xScale(d.value))
        .attr("dx", "-1.2em")
        .attr("y", (d,i) => yScale(i)+barHeight/2+10)
        .text((d,i) => d.value)
    // horizontal bars
    // select(node).selectAll("rect")
    //   .data(data)


  };
  render() {
    return(
      <div id="bar-div">
        <h2>{this.state.title}</h2>
        <svg ref={node => this.node = node}
          width={this.state.svgSize.w}
          height={this.state.svgSize.h}
          className={"tsv-bar"}>
        </svg>
      </div>
    );
  };
};

export default TSVHorizontalChart;
