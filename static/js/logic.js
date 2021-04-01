// Adding a tile layer to myMap
var tLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
})
// Creating initial map 
var myMap = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 5
});
tLayer.addTo(myMap);
// Retrieve the data 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(response) {
  function styleData(feature) {
    return {
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8,
      opacity: 1,
      fillColor: colors(feature.geometry.coordinates[2]), 
      radius: radfunc(feature.properties.mag),
      stroke: true
    };
  }
  function colors(magnitude) {
    switch (true) {
    case magnitude > 90:
      return "#C90D1A";
    case magnitude > 70: 
      return "#DA3B18";
    case magnitude > 50:
      return "#D76A14";
    case magnitude > 30:
      return "#D49910";
    case magnitude > 10: 
      return "#D1C80C";
    default: 
      return "#CEF708";
    }
  }
  function radfunc(rMagnitude) {
    if (rMagnitude === 0) {
      return 1; 
    }
    return rMagnitude * 4;
  }
  L.geoJson(response, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);   
  },
  style: styleData,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: "+ feature.properties.mag + "Depth: "+  feature.geometry.coordinates[2]  + "<h3>" + feature.properties.place +
        "</h3>" + new Date(feature.properties.time));
        }
}).addTo(myMap);
// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = [-10, 10, 30, 50, 70, 90];
  var colors = [
    "#CEF708",
    "#D1C80C",
    "#D49910",
    "#D76A14",
    "#DA3B18",
    "#C90D1A"
  ];
  for (var i = 0; i < limits.length; i++) {
    div.innerHTML += "<i style='background:"  + colors[i] + "'></i>"
    + limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
  }
  return div;
};
// Adding legend to the map
legend.addTo(myMap);
});