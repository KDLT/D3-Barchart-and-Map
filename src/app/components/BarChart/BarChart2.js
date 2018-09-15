import React, { Component } from "react";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { select } from "d3-selection";

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
    const svgWidth = this.props.size[0];
    const svgHeight = this.props.size[1];
    const paddingX = 100; const paddingY = 50;
    const dataLength = this.props.data.length;
    const dataMax = max(this.props.data/*, d=>d*/);
    const yScale = scaleLinear()
                    .domain([0, dataMax])
                    .range([paddingY, svgHeight - paddingY])
    const xScale = scaleLinear()
                    .domain([0, dataLength])
                    .range([paddingX, svgWidth - paddingX])
    // console.log("xScale of first item: ", xScale(1))
    const barWidth = svgWidth/dataLength-(2*paddingX/dataLength)
    // IMPORTANT 'YUNG PADDING sa height ng bar chart
    // width ng bawat isa accounting for padding
    // divide twice the padding by the number of data points
    // console.log("barWidth of first item: ", barWidth)

    select(node).selectAll("rect")
      .data(this.props.data)
      .enter()
      .append("rect")
      .attr("class", "bar")

    select(node).selectAll("rect")
      .data(this.props.data)
      .exit()
      .remove()

    select(node).selectAll("rect")
      .data(this.props.data)
      .attr("x", (d,i) => xScale(i))
      .attr("y", d => svgHeight - yScale(d))
      .attr("height", d => yScale(d)-paddingY)
      .attr("width", barWidth)

    select(node).selectAll("text")
        .data(this.props.data).enter()
        .append("text")
        .attr("class", "rect-text")

    select(node).selectAll("text")
      .data(this.props.data)
      .attr("x", (d,i) => xScale(i))
      .attr("y", (d,i) => svgHeight - yScale(d)-5)
      .text(d => d)
  }

  render() {
    return(
      <div id="bar-div">
        <h2>Bar Chart</h2>
        <svg ref={node => this.node = node}
          width={this.props.size[0]}
          height={this.props.size[1]}>
        </svg>
      </div>
    );
  }
}

export default BarChart
