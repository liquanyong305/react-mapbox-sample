import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as sensorJson from "./data/features.geojson";
import BasicLineChart from '../components/lineChart/basicLineChart'
import LineChartDateBisectorWidget from '~/sensor/lineChartDateBisectorWidget'
import { Types } from '../type/Types'
import './sensor.css';
import Modal from "react-modal";

Modal.setAppElement("#root");
const modalStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "rgba(250,250,250,0.25)",
    display: "flex",
    justifyContent: "center",
  },
  content: {
    position: "absolute",
    top: "6rem",
    left: "10rem",
    // right: "5rem",
    // bottom: "5rem",
    width: "700px",
    height: "500px",
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "1.5rem",
    display: "flex",
    justifyContent: "center",
  }
};
mapboxgl.accessToken = 'pk.eyJ1IjoiemVueXV1IiwiYSI6ImNrcmczN2gxdjBkc3MzMXFuZXljYmdjdncifQ.ZAJfqGXOl6_9uHOnSWItAQ';
const Sensor: React.FC = () => {

  const initDataSet:Types.Data[] = [];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map>();
  const [dataSet, setDataSet] = useState(initDataSet);
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    //console.log('sensorJson:', JSON.stringify(sensorJson));
    if (mapContainerRef.current && !map) {
      console.log('mapcontainer');
      const mapt = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [139.657125, 35.661236],
        zoom: 10,
        pitch: 40
      });
      setMap(mapt);
    }
    console.log('useEffect map', map);
    if (map === undefined) {
      return;
    }

    map.addControl(new mapboxgl.NavigationControl());

    const scale = new mapboxgl.ScaleControl({
      maxWidth: 250,
      unit: 'metric'
    });
    
    map.addControl(scale);

    map.on('load', () => {
      map.addSource('sensorData',{
        type: 'geojson',
        data: sensorJson,
      });
      // map.addLayer({
      //   id: 'sensor',
      //   type: 'circle',
      //   source: 'sensorData',
      //   paint: {
      //     'circle-radius': 10,
      //     'circle-opacity': 0.3,
      //     'circle-color': "blue",
      //     "circle-stroke-width": 1,
      //     "circle-stroke-color": "#fff"
      //   }
      // });
      // console.log('sensorJson.features:', sensorJson.features);
      for (const marker of sensorJson.features) {
        // console.log('markers:', marker);
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'warter-sensor';
      
        // make a marker for each feature and add to the map
        const sensorMarker = new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
              "<div><b>センサーコード &nbsp;</b>" + marker.properties.sensorId + "</div>" 
            )
        )
        .addTo(map);
        el.addEventListener('mouseover', () => {
          sensorMarker.togglePopup();
        });
        el.addEventListener('mouseleave', () => {
          sensorMarker.getPopup().remove();
        });
        el.addEventListener('click', () => {
          // const sensorEl = document.querySelector('#lineChartDateBisector');
          // if (sensorEl) {
          //   sensorEl.innerHTML = '';
          // }
          setDataSet(marker.properties.sensorData);
          setIsOpen(true);
        });

      }
    });

    // const popup = new mapboxgl.Popup({
    //   closeButton: false,
    //   closeOnClick: false
    // });
    // マウスポインタがメッシュの領域に入ったら属性情報をポップアップで表示
    // map.on("mousemove", "sensor", function(e: any) {
      
      // map.getCanvas().style.cursor = 'pointer';

      // popup.setLngLat(e.lngLat)
      //   .setHTML(
      //     "<div><b>センサーコード &nbsp;</b>" + e.features[0].properties.sensorId + "</div>" )
      //   .addTo(map);

    // });

    // マウスポインタがメッシュの領域から離れたらポップアップをクリア
    // map.on("mouseleave", "sensor", function() {
    //   map.getCanvas().style.cursor = '';
    //   popup.remove();
    // });

    // map.on("click", "sensor", function(e: any) {
    //   console.log('e.features[0].properties.sensorData:', JSON.parse(e.features[0].properties.sensorData));
    //   const sensorEl = document.querySelector('.basicLineChart');
    //   if (sensorEl) {
    //     sensorEl.innerHTML = '';
    //   }
    //    setDataSet(JSON.parse(e.features[0].properties.sensorData));
    // })

  }, [mapContainerRef, map]);

  return (
    <div>
      <div id="tooltip"></div>
      <div id='map' ref={mapContainerRef as React.RefObject<HTMLDivElement>}></div>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setIsOpen(false)} style={modalStyle}>
        <div style={{fontSize: "1.6rem", fontWeight:"bold"}}>河川名：荒川</div>
        {
          dataSet.length <= 0? '' : 
          <div id='county-legend' className="legend">
                    
            {/* <BasicLineChart data={dataSet} top={10} right={50} bottom={50} left={50} width={400} height={300} fill="blue" /> */}
            <LineChartDateBisectorWidget data={dataSet}></LineChartDateBisectorWidget>
        　</div>
        }
      </Modal>
    </div>
  )
}

export default Sensor;
