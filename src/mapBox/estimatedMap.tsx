import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as d3queue from 'd3-queue';
import * as d3 from 'd3';
import './estimatedMap.css';
mapboxgl.accessToken = 'pk.eyJ1IjoiemVueXV1IiwiYSI6ImNrcmczN2gxdjBkc3MzMXFuZXljYmdjdncifQ.ZAJfqGXOl6_9uHOnSWItAQ';
const EstimatedMap: React.FC = () => {

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map>();
  // 2050年の人口から10段階のカテゴリ別に分類するためのフィルタ
  const PT0_2050_1 = ["<", ["get", "PT0_2050"], 4000];
  const PT0_2050_2 = ["all", [">=", ["get", "PT0_2050"], 4000], ["<", ["get", "PT0_2050"], 8000]];
  const PT0_2050_3 = ["all", [">=", ["get", "PT0_2050"], 8000], ["<", ["get", "PT0_2050"], 12000]];
  const PT0_2050_4 = ["all", [">=", ["get", "PT0_2050"], 12000], ["<", ["get", "PT0_2050"], 16000]];
  const PT0_2050_5 = ["all", [">=", ["get", "PT0_2050"], 16000], ["<", ["get", "PT0_2050"], 20000]];
  const PT0_2050_6 = ["all", [">=", ["get", "PT0_2050"], 20000], ["<", ["get", "PT0_2050"], 24000]];
  const PT0_2050_7 = ["all", [">=", ["get", "PT0_2050"], 24000], ["<", ["get", "PT0_2050"], 28000]];
  const PT0_2050_8 = ["all", [">=", ["get", "PT0_2050"], 28000], ["<", ["get", "PT0_2050"], 32000]];
  const PT0_2050_9 = ["all", [">=", ["get", "PT0_2050"], 32000], ["<", ["get", "PT0_2050"], 36000]];
  const PT0_2050_10 = ["all", [">=", ["get", "PT0_2050"], 36000], ["<", ["get", "PT0_2050"], 40000]];

  // 色の設定
  const colors = ['rgb(215, 25, 28)',   'rgb(232, 91, 58)', 
                'rgb(249, 158, 89)',  'rgb(254, 201, 128)',
                'rgb(255, 237, 170)', 'rgb(237, 247, 201)',
                'rgb(199, 230, 219)', 'rgb(157, 207, 228)',
                'rgb(100, 165, 205)', 'rgb(44, 123, 182)'] 
  
  useEffect(() => {
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
    
    const meshToMap = (meshdata: any) => {
      console.log('map.................:', meshdata);
      if (map === undefined) return;
      // map.addSource に 読み込んだ GeoJSON を設定 
      map.addSource('meshdata',{
        type: 'geojson',
        data: meshdata,
      });
  
      // map.addLayer で メッシュの色や幅、塗り潰し等の見た目を設定して、メッシュを表示
      // メッシュの色分け表示は、case オプションにより人口の属性値で分けて表示するように設定
      map.addLayer({
        'id': '2DmeshLayer',
        'type': 'fill',
        'source': 'meshdata',
        'layout': {},
        'paint': {
            "fill-color": 
              ["case",
                PT0_2050_1, colors[0],
                PT0_2050_2, colors[1],
                PT0_2050_3, colors[2],
                PT0_2050_4, colors[3], 
                PT0_2050_5, colors[4], 
                PT0_2050_6, colors[5], 
                PT0_2050_7, colors[6], 
                PT0_2050_8, colors[7], 
                PT0_2050_9, colors[8], 
                PT0_2050_10, colors[9], 
                colors[9]
              ],
            "fill-outline-color": "white"
          }
      });
    }
    //  1km メッシュ GeoJSON
    const meshGeoJsonURL = 'https://raw.githubusercontent.com/valuecreation/mapbox-prj/b014b62e2c4db92726ca35ca8ec9a52b2acd5f28/data/1km_mesh_2018_13.geojson';
  
    console.log('meshGeoJsonURL:', meshGeoJsonURL);
    const handleGetData = (err: any, meshdata: any) => {
      console.log('meshdata:', meshdata);
      meshToMap(meshdata);
    }
    map.addControl(new mapboxgl.NavigationControl());

    const scale = new mapboxgl.ScaleControl({
      maxWidth: 250,
      unit: 'metric'
    });
    
    map.addControl(scale);
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    // マウスポインタがメッシュの領域に入ったら属性情報をポップアップで表示
    map.on("mousemove", "2DmeshLayer", function(e: any) {

      map.getCanvas().style.cursor = 'pointer';

      popup.setLngLat(e.lngLat)
        .setHTML(
          "<div><b>市区町村コード &nbsp;</b>" + e.features[0].properties.SHICODE + "</div>" + 
          "<div><b>将来推計人口 2050年 (男女計)</b></div>" + 
          "<div>" + Math.round(e.features[0].properties.PT0_2050) + " 人</div>")
        .addTo(map);

    });

    // マウスポインタがメッシュの領域から離れたらポップアップをクリア
    map.on("mouseleave", "2DmeshLayer", function() {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });

    map.on('load', () => {
      // Promise.all([d3.json, meshGeoJsonURL]).then(()=>{
        console.log('handleGetData');
        handleGetData(null, meshGeoJsonURL);
      // });
    });
    // const temqueue = d3queue.queue()
    // .defer(d3.json, meshGeoJsonURL)
    // .await(handleGetData);
    
  }, [mapContainerRef, map]);

  return (
    <div>
      <div id="tooltip"></div>
      <div id='map' ref={mapContainerRef as React.RefObject<HTMLDivElement>}></div>
      <div id='county-legend' className='legend'>
        <h4>1kmメッシュ別将来推計人口 2050年</h4>
          <div><span style={{backgroundColor: 'rgb(215, 25, 28)'}}></span>0 - 4,000</div>
          <div><span style={{backgroundColor: 'rgb(232, 91, 58)'}}></span>4,000 - 8,000</div>
          <div><span style={{backgroundColor: 'rgb(249, 158, 89)'}}></span>8,000 - 12,000</div>
          <div><span style={{backgroundColor: 'rgb(254, 201, 128)'}}></span>12,000 - 16,000</div>
          <div><span style={{backgroundColor: 'rgb(255, 237, 170)'}}></span>16,000 - 20,000</div>
          <div><span style={{backgroundColor: 'rgb(237, 247, 201)'}}></span>20,000 - 24,000</div>
          <div><span style={{backgroundColor: 'rgb(199, 230, 219)'}}></span>24,000 - 28,000</div>
          <div><span style={{backgroundColor: 'rgb(157, 207, 228)'}}></span>28,000 - 32,000</div>
          <div><span style={{backgroundColor: 'rgb(100, 165, 205)'}}></span>32,000 - 36,000</div>
          <div><span style={{backgroundColor: 'rgb(44, 123, 182)'}}></span>36,000 - 40,000</div>
    　</div> 
    </div>
  )
}

export default EstimatedMap;
