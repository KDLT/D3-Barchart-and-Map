import React, { Component } from "react";
import { scaleLinear, scaleOrdinal } from "d3-scale"
import { max } from "d3-array";
import { select } from "d3-selection";
import { dsv } from "d3-fetch";
import { axisLeft, axisBottom } from "d3-axis"

class TSVBarChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      title: "TSV Vertical Chart",
      svgSize: { w: 1200, h: 500 },
      padding: 50
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
    // console.log("data on createTSVChart: ", this.state.data)
    const node = this.node;
    const data = this.state.data;
    const dataLength = data.length;
    const svgWidth = this.state.svgSize.w;
    const svgHeight = this.state.svgSize.h;
    const padding = this.state.padding;
    const dataMax = max(data, d => d.value);
    const xDomain = data.map((i) => i.name);
    console.log("xDomainTest: ", xDomain);
    const xScale = scaleLinear()
                    .domain([0, dataLength])
                    .range([padding, svgWidth - padding])
    const yScale = scaleLinear()
                    .domain([0, dataMax])
                    .range([padding, svgHeight - padding])
    const barWidth = svgWidth / dataLength - (2 * padding / dataLength)-20

    select(node).selectAll("rect")
      .data(data).enter()
      .append("rect")
      .attr("class", "bar")
    select(node).selectAll("rect")
      .data(data)
      .exit()
      .remove()
    // horizontal bars
    select(node).selectAll("rect")
      .data(data)
      .attr("x", (d,i) => xScale(i))
      .attr("y", (d,i) => svgHeight - yScale(d.value))
      .attr("width", (d,i) => barWidth)
      .attr("height", (d,i) => yScale(d.value)-padding)
    select(node).selectAll("text")
      .data(data).enter()
      .append("text")
      .attr("class", "rect-text")
    select(node).selectAll("text")
      .data(data)
      .attr("x", (d,i) => xScale(i))
      .attr("y", (d,i) => svgHeight - yScale(d.value))
      .attr("dy", "1em")
      .text((d,i) => d.name+": "+d.value)
  };
  render() {
    return(
      <div id="bar-div">
        <h2>{this.state.title}</h2>
        <svg ref={node => this.node = node}
          width={this.state.svgSize.w}
          height={this.state.svgSize.h}>
        </svg>
      </div>
    );
  };
};

export default TSVBarChart;
