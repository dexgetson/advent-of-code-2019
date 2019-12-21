const fs = require('fs');
const { Transform } = require('stream');
const es = require('event-stream');

const readPuzzleFile = './puzzles/dayOne/puzzle2.json';
// const readPuzzleFile = './puzzles/dayOne/puzzle2Sample.json';
const readStream = fs.createReadStream(readPuzzleFile);

let sumAllFuelRequired = 0;
// find fuel required formula
// round((mass / 3), down) - 2

function applyFuelFormula(line) {
    let fuelMass = parseInt(line);
    let requiredFuel = (Math.trunc((fuelMass / 3))) - 2;
    if(isNaN(requiredFuel) || requiredFuel < 1) {
        requiredFuel = 0;
    }
    sumAllFuelRequired += requiredFuel;

    // Calculate required fuel on already calcualted fuel until you reach 0
    if(requiredFuel != 0){
        applyFuelFormula(requiredFuel);
    }
}

try {
    readStream.on('open', function () {
        readStream.pipe(es.split()).pipe(es.mapSync(applyFuelFormula)).on('end', function(){
            console.log('Sum of all Fuel Required:', sumAllFuelRequired);
        });
    });
} catch (error) {
    console.log("Error with piping:", error);
}

