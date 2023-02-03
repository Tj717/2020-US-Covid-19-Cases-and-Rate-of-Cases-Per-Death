mapboxgl.accessToken =
    'pk.eyJ1IjoidGoyMDIyMjIiLCJhIjoiY2xhMWk3dTdoMDAyczNubmM4cW5wcjczaCJ9._xPR8eZ1wQpDOCkm7f-vEg';

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/dark-v10', // style URL
        zoom: 3.8, // starting zoom
        center: [-98, 39] // starting center
    }
);

const grades = [10, 100, 1000, 10000, 100000],
    colors = ['rgb(0, 0, 255)', 'rgb(0, 255, 0)', 'rgb(255, 255, 0)', 'rgb(255, 0, 0)', 'rgb(128, 0, 128)'];
    radii = [1, 3, 6, 10, 15];

async function geojsonFetch() { 
    let response = await fetch('assets/us-covid-2020-counts.geojson');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let cases = await response.json();
    map.setProjection({name: 'albers'});
    map.on('load', () => { 
        map.addSource('covid-cases', {
            type: 'geojson',
            data: cases
        });
        map.addLayer({
                'id': 'cases-points',
                'type': 'circle',
                'source': 'covid-cases',
                'paint': {
                    // increase the radii of the circle as the zoom level and dbh value increases
                    'circle-radius': {
                        'property': 'cases',
                        'stops': [
                            [grades[0], radii[0]],
                            [grades[1], radii[1]],
                            [grades[2], radii[2]],
                            [grades[3], radii[3]],
                            [grades[4], radii[4]]
                        ]
                    },
                    'circle-color': {
                        'property': 'cases',
                        'stops': [
                            [grades[0], colors[0]],
                            [grades[1], colors[1]],
                            [grades[2], colors[2]],
                            [grades[3], colors[3]],
                            [grades[4], colors[4]]
                        ]
                    },
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': 0.6
                }
            }
        );

        map.on('click', 'cases-points', (event) => {
            new mapboxgl.Popup()
                .setLngLat(event.features[0].geometry.coordinates)
                .setHTML(`<strong>Cases:</strong> ${event.features[0].properties.cases}`)
                .addTo(map);
        });
    });

    const legend = document.getElementById('legend');
    //set up legend grades and labels
    var labels = ['<strong>Cases</strong>'], vbreak;
    //iterate through grades and create a scaled circle and label for each
    for (var i = 0; i < grades.length; i++) {
        vbreak = grades[i];
        // you need to manually adjust the radius of each dot on the legend 
        // in order to make sure the legend can be properly referred to the dot on the map.
        dot_radii = 2 * radii[i];
        labels.push(
            '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
            'px; height: ' +
            dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 4 + 'px;">' + vbreak +
            '</span></p>');
    }
        // add the data source
        const source =
            '<a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NY Times</a></p>';
        // combine all the html codes.
        legend.innerHTML = labels.join('') + source;
}

geojsonFetch();