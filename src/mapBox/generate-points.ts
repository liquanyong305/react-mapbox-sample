import { pointsWithinPolygon, bbox } from '@turf/turf';
import { randomPoint } from '@turf/random'

function generatePoints(pointCount: number, polygon: any) {
  const bb = bbox(polygon);
  const p = randomPoint(pointCount, { bbox: bb });
  const r = pointsWithinPolygon(p, polygon);
  return r;
}

export function generateRandomPointsByPolygons(polygons: any, numPoints=200) {

  const generatedPoints:any = {
    type: "FeatureCollection",
    features: []
  };

  let timer = Date.now();

  polygons.features.forEach((f: any) => {
    if (f.geometry.type == "Polygon") {
      const pts = generatePoints(numPoints, f);
      pts.features.forEach(p => {

        generatedPoints.features.push({
          type: "Feature",
          properties: {
            name: f.properties.laa,
          },
          geometry: {
            type: "Point",
            coordinates: p.geometry.coordinates
          }
        });

      });
    }
  });

  timer = Date.now() - timer;
  console.info(`${generatedPoints.features.length} random points generated in ${timer}ms (${polygons.features.length} polygons)`);

  return generatedPoints;
}


export function pointCount(points: any, featureName: string){

  return points.filter( (p: any) => p.properties.name === featureName).length;
}