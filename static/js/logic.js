// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log(data.features)
  createMap(data.features);
});


function createMap(earthquakes) {
    let quakeMarkers = [];

    for (var i = 0; i < earthquakes.length; i++){
        quakeMarkers.push(
            // Coordinates were backwards so needed to pull each value and reverse the order
            L.circle([earthquakes[i].geometry.coordinates[1],earthquakes[i].geometry.coordinates[0]], {
                    stroke: true,
                    fillColor: "red",
                    color: "grey", //border color
                    fillOpacity: 0.8,
                    // Making radius dependent on magnitude
                    radius: earthquakes[i].properties.mag * 20000
                }
            )
            // .bindPopup(<h2>${earthquakes[i].properties.place}: ${earthquakes[i].properties.mag}</h2>)
        );
    }

    console.log(quakeMarkers)

    let quakeLayer = L.layerGroup(quakeMarkers);

  // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };



  // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [street, quakeLayer]
      });

  // Create an overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: quakeLayer
    };

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}
