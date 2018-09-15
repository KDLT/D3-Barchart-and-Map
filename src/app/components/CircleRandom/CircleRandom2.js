import React, { Component } from "react";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";

class CircleRandom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      xData: [],
      numCircles: 5,
      radius: 10,
    }
    this.createCircles = this.createCircles.bind(this);
    this.fillRandom = this.fillRandom.bind(this);
  }
  componentDidMount() {
    let numData = this.state.numCircles;
    let data = Array(numData).fill(null);
    let randomData = data.map(i => Math.floor(Math.random() * numData + 1));
    console.log("randomData: ", randomData);
    this.fillRandom(randomData)
    console.log("xData after fillRandom: ", this.state.xData)
    this.createCircles()
  }

  fillRandom(data) {
    console.log("data in fillRandom: ", data)
    this.setState({ xData: data }, () => console.log("xData: ", this.state.xData))
    // console.log("state after setstate: ", this.state.xData)
  }

  createCircles() {
    const node = this.node;
    const w = 500;
    const h = 500;
    const padding = 40;
    const xScale = scaleLinear()
                    .domain([0,this.state.numCircles])
                    .range([padding, w-padding])

    console.log("xData in createCircles: ", this.state.xData)

    select(node).selectAll("circle")
        .data(this.state.xData)
        .enter()
        .append("circle")
        .attr("class", "circle")

    select(node).selectAll("circle")
        .data(this.state.xData)
        .exit()
        .remove()

    select(node).selectAll("circle")
        .data(this.state.xData)
        .attr("cx", (d,i) => d )
        .attr("cy", h)
        .attr("r", this.state.radius)
  }
  render() {
    return(
      <div id="circles-div">
        <h2>Circles Random</h2>
        <svg ref={node => this.node = node} width={1200} height={100}>
        </svg>
      </div>
    );
  }
}

export default CircleRandom
