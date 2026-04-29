const map = L.map("map").setView([36.17, -115.14], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

L.control.scale().addTo(map);

const restaurantsLayer = L.layerGroup().addTo(map);
const railwaysLayer = L.layerGroup().addTo(map);
const landuseLayer = L.layerGroup().addTo(map);

function popupContent(feature) {
  const props = feature.properties;
  return `
    <strong>Name:</strong> ${props.name || "N/A"}<br>
    <strong>Type:</strong> ${props.fclass || "N/A"}<br>
    <strong>County:</strong> ${props.county_name || "Clark County"}
  `;
}

// 🍔 Restaurants (RED points)
fetch("data/restaurants_clark_county.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 5,
          color: "red",
          fillColor: "red",
          fillOpacity: 0.8
        });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(popupContent(feature));
      }
    }).addTo(restaurantsLayer);
  });

// 🚆 Railways (BLACK lines)
fetch("data/railways_clark_county.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: "black",
        weight: 3
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(popupContent(feature));
      }
    }).addTo(railwaysLayer);
  });

// 🌿 Land Use (GREEN polygons)
fetch("data/landuse_clark_county.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: "green",
        weight: 1,
        fillColor: "green",
        fillOpacity: 0.3
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(popupContent(feature));
      }
    }).addTo(landuseLayer);
  });

const overlays = {
  "Restaurants": restaurantsLayer,
  "Railways": railwaysLayer,
  "Land Use Areas": landuseLayer
};

L.control.layers(null, overlays).addTo(map);