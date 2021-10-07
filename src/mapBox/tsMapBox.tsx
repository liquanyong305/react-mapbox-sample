import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl, {LngLatLike, Marker, LngLatBounds, Popup } from 'mapbox-gl';

//import {GeoJsonObject} from 'geojson';

import { generateRandomPointsByPolygons, pointCount } from './generate-points';

// import { Widget } from './sidebar';

import { centroid, intersect } from '@turf/turf';

// import { AppNavbar } from './navbar';

import 'mapbox-gl/dist/mapbox-gl.css'
import './tsMapBox.css';

import * as geoOpstine from './data/serbia.geo.min.json';

mapboxgl.accessToken = 'pk.eyJ1IjoiemVueXV1IiwiYSI6ImNrcmczN2gxdjBkc3MzMXFuZXljYmdjdncifQ.ZAJfqGXOl6_9uHOnSWItAQ';
  // https://stackblitz.com/edit/react-ts-mapbox?file=index.tsx 例子網站地址
class TsMapBox extends React.Component {

  private mapContainer: HTMLDivElement | null;
  public state: any;

  constructor(props: any) {
    super(props);
    this.state = {
      lng: 19.8265,
      lat: 45.2555,
      zoom: 12
    };
    this.mapContainer = null;
  }


  private fixdec(n: number | number[], decimals: number): string {
    if (typeof n == "number")
      return n.toFixed(decimals);
    else {
      const s: string[] = [];
      n.forEach(e => {
        s.push(e.toFixed(decimals));
      });
      return s.join(", ");
    }
  }
  componentDidMount() {
    if (!this.mapContainer) return;
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
      bounds: [18.8, 42.2, 23.0, 46.2],
      maxBounds: [17, 41, 24, 47]
    });

    map.addControl(new mapboxgl.NavigationControl(
      { showCompass: true }
    ));

    map.on('load', () => {

      map.addSource('opštine-src', {
        type: "geojson",
        data: geoOpstine,
      });

      map.addLayer({
        id: "opštine",
        type: "line",
        source: "opštine-src",
        paint: {
          'line-color': "blue",
          "line-width": 3,
          "line-opacity": 0.2
        }
      }, 'country-label');
      console.log('geoOpstine:', geoOpstine);

      const generatedPoints = generateRandomPointsByPolygons(geoOpstine, 200);

      map.addSource('generated-src', {
        type: 'geojson',
        data: generatedPoints
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true
      });

      map.on('click', 'opštine', (e:any) => {

        if (popup.isOpen()) popup.remove();

        const coordinates  = centroid(e.features[0]).geometry.coordinates as [number, number];
        const description = 
            `<h2>${e.features[0].properties.laa}</h2>
            <p>Populacija: ${e.features[0].properties.pop}</p>
            <p>Broj generisanih tačaka: ${pointCount(generatedPoints.features, e.features[0].properties.laa )}</p>
            `;

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      });


    // map.addLayer({
    //   id: "population-heat",
    //   type: "heatmap",
    //   source: "generated-src",
    //   maxzoom: 9,
    //   paint: {
    //     "heatmap-weight": [
    //       "interpolate",
    //       ["linear"],
    //       ["get", "pop"],
    //       10, 0,
    //       10000, 1
    //     ],
    //   }
    // }, 'opštine');

    //         map.addLayer({
    //     id: "population-label",
    //     type: "symbol",
    //     source: "generated-src",
    //     minzoom: 9,
    // layout: {
    //   "text-field": ['get', 'pop'],
    //   "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
    //   "text-size": 14,
    // }
    //   }, 'country-label');



    // map.addLayer({
    //     id: "centroids",
    //    type: "circle",
    //    source: "generated-src",
    //    paint: {
    //      "circle-radius": 2,
    //      "circle-color": "blue",
    //    }
    // });

    this.setState({
      bounds: map.getBounds(),
      lng: map.getCenter().lng.toFixed(4),
      lat: map.getCenter().lat.toFixed(4),
      zoom: map.getZoom().toFixed(2)
    });
  });

  map.on('move', () => {
    this.setState({
      bounds: map.getBounds(),
      lng: map.getCenter().lng.toFixed(4),
      lat: map.getCenter().lat.toFixed(4),
      zoom: map.getZoom().toFixed(2)
    });
  });
  }

  private bounds2string(): string {
  const b = this.state.bounds as LngLatBounds;
  if (!b) return "";
  const sw = b.getSouthWest().toArray();
  const ne = b.getNorthEast().toArray();

  return this.fixdec(sw.concat(ne), 6);
}

//        <AppNavbar/>

render() {
  return (
    <div>

      <div className='sidebarStyle'>
        <div>Center:  {this.state.lng}, {this.state.lat} | Zoom: {this.state.zoom}</div>

        <div>Bounds: {this.bounds2string()}</div>

      </div>
      <div ref={el => this.mapContainer = el} className='mapContainer' />
    </div>
  )
}
}

export default TsMapBox;
// ReactDOM.render(<Application />, document.getElementById('app'));