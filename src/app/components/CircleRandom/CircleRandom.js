import React, { Component } from "react";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";

class CircleRandom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      numCircles: 5,
      radius: 50,
      w: 1200,
      h: 100
    }
    this.createCircles = this.createCircles.bind(this);
    this.randomizeData = this.randomizeData.bind(this);
  }
  componentDidMount() {
    this.randomizeData()
    this.interval = setInterval(this.randomizeData, 1000);
  }

  randomizeData() {
    let numData = this.state.numCircles;
    let data = Array(numData).fill(null);
    let randomData = data.map(i => Math.random() * numData);
    // console.log("randomData: ", randomData) // RANDOM DATA DISPLAY ON CONSOLE
    // this.setState((randomData) => ({ randomData: randomData }));
    this.createCircles(randomData)
  }

  createCircles(data) {
    const node = this.node;
    const w = this.state.w;
    const h = this.state.h;
    const padding = 50;
    const xScale = scaleLinear()
                    .domain([0, this.state.numCircles])
                    .range([padding, w-padding])
    const yScale = scaleLinear()
                    .domain([0, this.state.radius*2])
                    .range([padding, h-padding])

    // console.log("createCircles data: ", data)
    // console.log("xScale(5): ", xScale(5))
    select(node).selectAll("circle")
        .data(data).enter()
        .append("circle")
        .attr("class", "circle")

    select(node).selectAll("circle")
        .data(data)
        .attr("cx", (d,i) => xScale(d) )
        .attr("cy", h-50)
        .attr("r", this.state.radius)

    select(node).selectAll("text")
        .data(data).enter()
        .append("text")
        .attr("class", "circle-text")

    select(node).selectAll("text")
        .data(data)
        .attr("x", (d,i) => xScale(d)-22.5)
        .attr("y", (d,i) => h-40)
        .text(d => xScale(d).toFixed(0))

    // select(node).selectAll("circle")
    //     .data(data)
    //     .exit()
    //     .remove()
    //
    // select(node).selectAll("text")
    //     .data(data)
    //     .exit()
    //     .remove()

  }
  render() {
    return(
      <div id="circles-div">
        <h2>Circles Random</h2>
        <svg ref={node => this.node = node} width={this.state.w} height={this.state.h}>
        </svg>
      </div>
    );
  }
}

export default CircleRandom
