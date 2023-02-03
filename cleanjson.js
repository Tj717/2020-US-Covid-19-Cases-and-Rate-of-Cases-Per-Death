'use strict';

const src = 'assets/us-covid-2020-rates.geojson';
const fields = ["fips", "deaths"];

// async function geojsonFetch() { 
//     let response = await fetch(src);
//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     let data = await response.json();
//     for (let i = 0; i < data.features.length; i++) {
//         for (let j = 0; j < fields.length; j++) {
//             delete data.features[i].properties[fields[j]];
//         }
//         // delete data[0].fips;
//         // delete data[0].deaths;
//     }
//     // output data to a new File
//     // let output = new File([JSON.stringify(data)], "us-covid-2020-rates-cleaned.geojson", {type: "application/json;charset=utf-8"});
// }

// geojsonFetch();

const fs = require('fs');

let data = fs.readFileSync(src);

// let length = Object.keys(data.features).length
// for (let i = 0; i < length; i++) {
//     for (let j = 0; j < fields.length; j++) {
//         delete data.features[i].properties[fields[j]];
//     }
// }

for(var feature in data.features) {
    delete data.features.properties['fips'];
    console.log(JSON.stringify(data.features.properties));
}

// const jsonString = JSON.stringify(data)
// fs.writeFile('./cleaned.json', jsonString, err => {
//     if (err) {
//         console.log('Error writing file', err)
//     } else {
//         console.log('Successfully wrote file')
//     }
// })
