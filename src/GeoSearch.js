import React, { Component } from "react";
import { withLeaflet, MapControl } from "react-leaflet";
import L from "leaflet";
import { OpenStreetMapProvider,GeoSearchControl, GoogleProvider, BingProvider } from "leaflet-geosearch";

class GeoSearch extends MapControl {
  constructor(props, context) {
    super(props);
  }

  createLeafletElement(opts) {
    const provider = new OpenStreetMapProvider();
    // const provider = new GoogleProvider({ 
    // params: {
    //   key: 'AIzaSyDV-Qiaydvq7kZ4KpCFHYHkJ977AkbIA6s',
    // },
    // });
    // const provider = new BingProvider({ 
    //   params: {
    //     key: 'AqbjLrfVbZf4G0f1lgRNxy6pnf8OebfpH0zfWIrSBGwMeYfIR7_ORw9koBzdvEGP'
    //   },
    // });
    const searchControl = new GeoSearchControl({
      provider: provider,
      position: "topleft"
    });
    return searchControl;
  }

  componentDidMount() {
    const { map } = this.props.leaflet;
    map.addControl(this.leafletElement);
  }
}

export default withLeaflet(GeoSearch);
