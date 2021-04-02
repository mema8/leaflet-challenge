
var tileLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
})

var MMap = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 4
});
tileLayer.addTo(MMap);
// (Retrieve the data )
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(AllWeekData) {
  function styles(feature) {
    return {
      color: "#e5e5e5",
      weight: 1,
      fillOpacity: 0.8,
      opacity: 1,
      fillColor: createColors(feature.geometry.coordinates[2]), 
      radius: createRadius(feature.properties.mag),
      stroke: true
    };
  }
  function createColors(colorMag) {
    switch (true) {
    case colorMag > 80:
      return "#ebfb9c";
    case colorMag > 60: 
      return "#bcb40a";
    case colorMag > 50:
      return "#e0b757";
    case colorMag > 35:
      return "#e3965a";
    case colorMag > 9: 
      return "#e5755d";
    default: 
      return "#ebfb9c";
    }
  }
  function createRadius(radiusMag) {
    if (radiusMag === 0) {
      return 1; 
    }
    return radiusMag * 6;
  }
  L.geoJson(AllWeekData, {
    pointToLayer: function(feature, latlon) {
      return L.circleMarker(latlon);   
  },
  style: styles,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: "+ feature.properties.mag + "Depth: "+  feature.geometry.coordinates[2]  + "<h3>" + feature.properties.place +
        "</h3>" + new Date(feature.properties.time));
        }
}).addTo(MMap);
// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var ranges = [-10, 10, 30, 50, 70, 90];
  var color = [
    "#ebfb9c",
    "#bcb40a",
    "#e0b757",
    "#e3965a",
    "#e5755d",
    "#d9555e"
  ];
  for (var i = 0; i < ranges.length; i++) {
    div.innerHTML += "<i style='background:"  + color[i] + "'></i>"
    + ranges[i] + (ranges[i + 1] ? "&ndash;" + ranges[i + 1] + "<br>" : "+");
  }
  return div;
};
// Adding legend to the map
legend.addTo(MMap);
});