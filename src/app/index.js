import React, { Component } from "react";
import { render } from "react-dom";

import "../styles/main.scss";

import BarChart from "./components/BarChart/BarChart";
import WorldMap from "./components/WorldMap/WorldMap";
import CircleRandom from "./components/CircleRandom/CircleRandom";
import TSVHorizontalChart from "./components/TSVBarChart/TSVHorizontalChart";
import TSVBarChart from "./components/TSVBarChart/TSVBarChart";
import LineGraph from "./components/LineGraph/LineGraph";
import LineDotGraph from "./components/LineDotGraph/LineDotGraph";
import ScatterPlot from "./components/ScatterPlot/ScatterPlot";
// import ScatterPlot from "./components/ScatterPlot/ScatterPlot";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [5,10,1,3,6,7,9,5,3,-7,8,2,8,23,2,1],
      scatter: [[34, 78],[109, 280],[310, 120 ],[79, 411],[420, 220],[233, 145],[333, 96],[222, 333],[78, 320],[21, 123]],
      size: [1200,500]
    };
  };
  render() {
    return(
      <div className="index-wrapper">
        <h1>I LEVEL UP EVERYTIME DOG SAYS SO</h1>
        <BarChart data={this.state.data} size={this.state.size}/>
        <br />
        <TSVHorizontalChart />
        <br />
        <TSVBarChart />
        <br />
        <CircleRandom />
        <br />
        <ScatterPlot data={this.state.scatter} size={this.state.size}/>
        <br />
        <LineGraph />
        <br />
        <LineDotGraph size={this.state.size}/>
        <br />
        <WorldMap />
        <br />
        <div id={"background-fixed"}></div>
      </div>
    );
  };
};

render(
  <App />,
  document.getElementById("root")
);
