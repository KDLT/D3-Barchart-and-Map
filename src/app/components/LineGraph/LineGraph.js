import React, { Component } from "react";
import { scaleLinear, scaleTime } from "d3-scale";
import { max, extent } from "d3-array";
import { select } from "d3-selection";
import { dsv } from "d3-fetch";
import { axisLeft, axisBottom } from "d3-axis";
import { timeFormat } from "d3-time-format";
import { line } from "d3-shape";

class LineGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      size: { w: 1200, h: 500 },
      data: [],
      padding: 50
    };
    this.fetchCSV = this.fetchCSV.bind(this);
    this.createLineGraph = this.createLineGraph.bind(this);
  };
  componentDidMount() {
    this.fetchCSV("https://raw.githubusercontent.com/KDLT/D3-Barchart-and-Map/master/linedata.csv")
  };
  componentDidUpdate() {
    // console.log("update data state: ", this.state.data)
    this.createLineGraph();
  };
  fetchCSV(address) {
    const formatTime = timeFormat("%b %d %y");
    dsv(",", address, d => ({
      date: new Date(d.date),
      close: +d.close
    }))
    .then(data => {
      this.setState({ data: data.slice(0, data.length) })
    })
  };
  createLineGraph() {
    // console.log("createLineGraph data state: ", this.state.data)
    // console.log("creating line graph...")
    const node = this.node;
    const data = this.state.data;
    const padding = this.state.padding;
    // h and w are graph height and width, bawas na 'yung margins sa sukat nila
    const h = this.state.size.h;
    const w = this.state.size.w;
    // console.log("extent: ", extent(data, d => d.date))
    // dates ang x-axis
    const xScale = scaleTime()
                    .domain(extent(data, (d=>d.date)))
                    .range([padding, w-padding])
    // close values ang y-axis
    const yScale = scaleLinear()
                      .domain([0, max(data, d => d.close) + 30])
                      .range([h-padding, padding])
    // extent returns an array with two elements: [min_val, max_val]
    // console.log("extent: ", extent(data.map(d=>d.date)));
    // console.log("xScale May 1: ", xScale(new Date("May 1 2012")));

    const xAxis = axisBottom(xScale)
                    .ticks(10)
                    .tickFormat(timeFormat("%a %d"))
                    // .tickSize(-h+2*padding)
    const yAxis = axisLeft(yScale).ticks(5).tickSize(-w+2*padding);

    select(node).append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${h-padding})`)
      .call(xAxis)
      // .selectAll("text")
        // .attr("dx", "-1em")
        // .attr("dy", "2em")
        // .attr("transform", "rotate(-60)")

    select(node).append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    const valueLine = line()
                        .x(d => xScale(d.date))
                        .y(d => yScale(d.close));

    select(node).append("g")
      .attr("class", "graph")
      .append("path")
      .attr("id", "line-path")

    // selected all "path" elements, then pointed to the last instance
    // kaka-create lang ng last path sa previous block
    // select(node).selectAll("path").filter(":last-child")
    select(node).select("#line-path")
      .data([data])
      // .attr("class", "line-path")
      .attr("d", valueLine)
  }
  render() {
    return(
      <div className="csv-line">
        <h2>CSV Line Graph</h2>
        <svg ref={node => this.node = node}
          width={this.state.size.w}
          height={this.state.size.h}/>
      </div>
    );
  };
};

export default LineGraph
