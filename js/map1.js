mapboxgl.accessToken =
    'pk.eyJ1IjoidGoyMDIyMjIiLCJhIjoiY2xhMWk3dTdoMDAyczNubmM4cW5wcjczaCJ9._xPR8eZ1wQpDOCkm7f-vEg';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 3, // starting zoom
        center: [-100, 40] // starting center
    }
);

async function geojsonFetch() { 
    let response = await fetch('assets/us-covid-2020-counts.geojson');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let counts = await response.json();
    console.log("data loaded");

    map.on('load', function loadingData() {
        map.addSource('covid_counts', {
            type: 'geojson',
            data: counts
        });
        
        map.addLayer({
            'id': 'covid_counts',
            'type': 'fill',
            'source': 'covid_counts',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'cases'],
                    '#B54E28',
                    1000,        
                    '#A86D19',   
                    5000,         
                    '#9A8C0A',   
                    9000,          
                    '#7FB605',   
                    13000,         
                    '#64E000',  
                    17000,
                    '#59F000',
                    21000,
                    '#4DFF00',
                    25000,
                    '#3FFF00'
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });
        const layers = [
            '< 1000',
            '1000 - 5000',
            '5000 - 9000',
            '9000 - 13000',
            '13000 - 17000',
            '17000 - 21000',
            '21000 - 25000',
            '> 25000'
        ];
        const colors = [
            '#B54E28',
            '#A86D19',
            '#9A8C0A',
            '#7FB605',
            '#64E000',
            '#59F000',
            '#4DFF00',
            '#3FFF00'
        ];

        // create legend
        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>Number of Covid Cases in Each County: </b><br><br>";

        layers.forEach((layer, i) => {
            const color = colors[i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        });
    });
        
    // map.on('mousemove', ({point}) => {
    //     const county = map.queryRenderedFeatures(point, {
    //         layers: ['covid_counts']
    //     });
    //     document.getElementById('text-description').innerHTML = counts.length ?
    //         `<h3>${counts[0].properties.county}, ${counts[0].properties.state}: </h3><p><strong><em>${counts[0].properties.cases}</strong> cases  and ${counts[0].properties.deaths} deaths.</em></p>` :
    //         `<p>Hover over a County</p>`;
    // });
}

geojsonFetch();