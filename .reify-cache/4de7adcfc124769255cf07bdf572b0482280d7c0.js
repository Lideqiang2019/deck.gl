"use strict";module.export({default:()=>FlyToInterpolator});var TransitionInterpolator;module.link('./transition-interpolator',{default(v){TransitionInterpolator=v}},0);var lerp;module.link('math.gl',{lerp(v){lerp=v}},1);var flyToViewport;module.link('viewport-mercator-project',{flyToViewport(v){flyToViewport=v}},2);




const LINEARLY_INTERPOLATED_PROPS = ['bearing', 'pitch'];

/**
 * This class adapts mapbox-gl-js Map#flyTo animation so it can be used in
 * react/redux architecture.
 * mapbox-gl-js flyTo : https://www.mapbox.com/mapbox-gl-js/api/#map#flyto.
 * It implements “Smooth and efficient zooming and panning.” algorithm by
 * "Jarke J. van Wijk and Wim A.A. Nuij"
 */
class FlyToInterpolator extends TransitionInterpolator {
  constructor() {
    super({
      compare: ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'],
      extract: ['width', 'height', 'longitude', 'latitude', 'zoom', 'bearing', 'pitch'],
      required: ['width', 'height', 'latitude', 'longitude', 'zoom']
    });
  }

  interpolateProps(startProps, endProps, t) {
    const viewport = flyToViewport(startProps, endProps, t);

    // Linearly interpolate 'bearing' and 'pitch'.
    // If pitch/bearing are not supplied, they are interpreted as zeros in viewport calculation
    // (fallback defined in WebMercatorViewport)
    // Because there is no guarantee that the current controller's ViewState normalizes
    // these props, safe guard is needed to avoid generating NaNs
    for (const key of LINEARLY_INTERPOLATED_PROPS) {
      viewport[key] = lerp(startProps[key] || 0, endProps[key] || 0, t);
    }

    return viewport;
  }
}