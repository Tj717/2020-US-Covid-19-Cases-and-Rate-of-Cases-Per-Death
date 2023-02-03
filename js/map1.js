mapboxgl.accessToken =
    'pk.eyJ1IjoidGoyMDIyMjIiLCJhIjoiY2xhMWk3dTdoMDAyczNubmM4cW5wcjczaCJ9._xPR8eZ1wQpDOCkm7f-vEg';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 4, // starting zoom
        center: [-100, 40] // starting center
    }
);

async function geojsonFetch() { 
    let response = await fetch('assets/us-covid-2020-rates.geojson');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let rates = await response.json();

    map.on('load', function loadingData() {
        map.addSource('covid_rates', {
            type: 'geojson',
            data: rates
        });
        
        map.addLayer({
            'id': 'covid_rates_layer',
            'type': 'fill',
            'source': 'covid_rates',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'rates'],
                    '#ff3333',
                    30,        
                    '#ffcc33',   
                    40,         
                    '#ccff33',   
                    50,          
                    '#66ff33',   
                    60,         
                    '#33ff99',  
                    70,
                    '#33ffff',
                    80,
                    '#3399ff',
                    90,
                    '#3333ff'
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });
        const layers = [
            '< 30',
            '30 - 40',
            '40 - 50',
            '50 - 60',
            '60 - 70',
            '70 - 80',
            '80 - 90',
            '90 <'
        ];
        const colors = [
            '#ff3333',
            '#ffcc33',
            '#ccff33',
            '#66ff33',
            '#33ff99',
            '#33ffff',
            '#3399ff',
            '#3333ff'
        ];

        // create legend
        const legend = document.getElementById('legend');
        legend.innerHTML = "<b> Covid Cases per Death in Each County: </b><br><br>";

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
        
    map.on('mousemove', ({point}) => {
        const counties = map.queryRenderedFeatures(point, {
            layers: ['covid_rates_layer']
        });
        let rate = Math.floor(counties[0].properties.rates);
        document.getElementById('text-description').innerHTML = counties.length ?
            `<h3>${counties[0].properties.county}, ${counties[0].properties.state}: </h3><p><strong><em>${rate}</strong> cases  per death.</em></p>` :
            `<p>Hover over a County</p>`;
    });
}

geojsonFetch();