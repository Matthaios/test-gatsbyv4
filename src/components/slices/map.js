import get from "lodash/get";
import React from "react";
import GoogleMapReact from "google-map-react";
import MapStyles from "./map-styles.json";
export default function MapWrapper({ data }) {
  const lat = get(data, "primary.latitude");
  const lng = get(data, "primary.longitude");
  const zoom = get(data, "primary.zoom");
  return (
    <div className="w-full  " style={{ height: 500 }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyAUfLdABzGR45zW1GtW0akXnIQ1idc3K_E" }}
        defaultCenter={{
          lat,
          lng,
        }}
        defaultZoom={zoom}
        options={{
          styles: MapStyles,
        }}
      ></GoogleMapReact>
    </div>
  );
}
