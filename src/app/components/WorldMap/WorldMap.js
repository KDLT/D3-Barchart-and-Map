import React, { Component } from "react";
import { geoMercator, geoPath } from "d3-geo";

class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      worldfeatures: []
    }
    this.getWorldFeatures = this.getWorldFeatures.bind(this)
    this.dataFetch = this.dataFetch.bind(this)
  }
  componentDidMount() {
    this.dataFetch()
  }
  componentDidUpdate() {
    // console.log("state ito:",this.state.worldfeatures)
  }
  dataFetch() {
    fetch("https://raw.githubusercontent.com/KDLT/D3-Barchart-and-Map/master/worlddata.json")
    .then(response => response.json())
    .then(worlddata => {
      this.getWorldFeatures(worlddata)
    })
  }
  getWorldFeatures(worlddata) {
    this.setState({ worldfeatures: worlddata.features })
  }
  render() {
    const projection = geoMercator()
    const pathGenerator = geoPath().projection(projection)
    const countries = this.state.worldfeatures.map((d,i) => <path key={"path" + i} d={pathGenerator(d)} className="countries" />)
    return(
      <div id="map-div">
        <h2>World Map</h2>
        <svg width={1200} height={600}>
          {countries}
        </svg>
      </div>
    );
  }
}

export default WorldMap
