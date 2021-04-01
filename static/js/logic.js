
var titleLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v10",
  accessToken: API_KEY
})

var myMap = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 4
});
titleLayer.addTo(myMap);
// (Retrieve the data )
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(response) {
  function styleData(feature) {
    return {
      color: "#e5e5e5",
      weight: 1,
      fillOpacity: 0.8,
      opacity: 1,
      fillColor: colors(feature.geometry.coordinates[3]), 
      radius: radfunc(feature.properties.mag),
      stroke: true
    };
  }
  function color(magnitudee) {
    switch (true) {
    case magnitudee > 80:
      return "#ebfb9c";
    case magnitudee > 60: 
      return "#bcb40a";
    case magnitudee > 50:
      return "#e0b757";
    case magnitudee > 35:
      return "#e3965a";
    case magnitudee > 9: 
      return "#e5755d";
    default: 
      return "#ebfb9c";
    }
  }
  function radfunc(rMagnitudee) {
    if (rMagnitudee === 0) {
      return 1; 
    }
    return rMagnitudee * 6;
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
  var color = [
    "#ebfb9c",
    "#bcb40a",
    "#e0b757",
    "#e3965a",
    "#e5755d",
    "#d9555e"
  ];
  for (var i = 0; i < limits.length; i++) {
    div.innerHTML += "<i style='background:"  + color[i] + "'></i>"
    + limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
  }
  return div;
};
// Adding legend to the map
legend.addTo(myMap);
});