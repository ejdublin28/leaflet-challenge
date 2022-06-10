// Store the queryUrl of the json data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createMap(data.features);
});


function createMap(earthquakes) {
    let quakeMarkers = [];
    
    
    var customColor = "red";
    //Setting up color to change based on depth (third element in coordinates)
    for (var i = 0; i < earthquakes.length; i++){
        if (earthquakes[i].geometry.coordinates[2] < 10)
            customColor = "#1FE511";
        else if (earthquakes[i].geometry.coordinates[2] < 30)
            customColor = "#98E511";
        else if (earthquakes[i].geometry.coordinates[2] < 50)
            customColor = "yellow";
        else if (earthquakes[i].geometry.coordinates[2] < 70)
            customColor = "orange";
        else if (earthquakes[i].geometry.coordinates[2] < 90)
            customColor = "#E53711";

        quakeMarkers.push(
            // Coordinates were backwards so needed to pull each value and reverse the order
            L.circle([earthquakes[i].geometry.coordinates[1],earthquakes[i].geometry.coordinates[0]], {
                    stroke: true,
                    fillColor: customColor,
                    color: "grey", //border color
                    fillOpacity: 0.8,
                    // Making radius dependent on magnitude
                    radius: earthquakes[i].properties.mag * 20000
                }
            ).bindPopup(`<h4>${earthquakes[i].properties.place}</h4> <hr> <h4> Magnitude: ${earthquakes[i].properties.mag}</h4>
             <h4> Depth: ${earthquakes[i].geometry.coordinates[2]}</h4>`)
        );
    }

    console.log(quakeMarkers)

    let quakeLayer = L.layerGroup(quakeMarkers);

  // Create the base layers
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
          40.0, -105.75
        ],
        zoom: 5,
        layers: [street, quakeLayer]
      });

  // Create an overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: quakeLayer
    };

    function getColor(d) {
        return d < 10 ? '#1FE511' :
               d < 30 ? '#98E511' :
               d < 50 ? 'yellow' :
               d < 70 ? 'orange' :
               d < 90 ? '#E53711' :
                        'red';
    }

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

//Attempt to add a legend in the bottom right
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [ 10, 30, 50, 70, 90],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);

}
