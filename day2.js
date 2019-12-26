const fs = require('fs');
const { Transform } = require('stream');

const readPuzzleFile = './puzzles/dayTwo/puzzle1.json';
// const readPuzzleFile = './puzzles/dayTwo/puzzle1Sample.json';
const readStream = fs.createReadStream(readPuzzleFile);

let PROGRAM = [];
let NOUN = 0;
let VERB = 0;
let CODE = 19690720;
let OUTPUT = 0;
const MAX_NOUN = 99;
const MAX_VERB = 99;

function performOptCodeAction(data, optCode, position1, position2) {
    let action = null;

    switch (optCode) {
        case 1:
            action = optCode1(data[data[position1]], data[data[position2]]);
            break;
        case 2:
            action = optCode2(data[data[position1]], data[data[position2]]);
            break;
        case 99:
            action = haltProgram(data);
            break;
        default:
            console.error('<--------Invalid Code----->');
            action = 'error';
    }

    return action;
}

function optCode1(position1, position2) {
    return position1 + position2;
}

function optCode2(position1, position2) {
    return position1 * position2;
}

function haltProgram(program) {
    return 'stop';
}

//stocks and bonds
//_ l _ _ _ ls

function getOutput() {
    let result = (100 * NOUN) + VERB;

    return result;
}

function restoreGravityAssistProgram(data, position1, position2, noun, verb, useNounVerb) {

    if (useNounVerb) {
        data[position1] = noun;
        data[position2] = verb;
    } else {
        data[position1] = 12;
        data[position2] = 2;
    }

    return data;
}

function runProgram(data, index, matchCode = 0) {
    let optCodePosition = index;
    let inputPosition1 = index + 1;
    let inputPosition2 = index + 2;
    let outputPosition = index + 3;
    let nextIndex = index + 4;
    let optCode = data[optCodePosition];

    let result = performOptCodeAction(data, optCode, inputPosition1, inputPosition2);
    if (result === 'stop' || result === 'error') {

        if (matchCode > 0 && matchCode !== data[0]) {
            return false;

        } else if (matchCode > 0 && matchCode == data[0]) {
            OUTPUT = getOutput();
            return OUTPUT;
        }
    } else {
        let outputData = data[outputPosition];
        data[outputData] = result;
        runProgram(data, nextIndex, CODE);
    }
}

function initProgram(paramProg, paramCode, noun, verb) {
    let data = restoreGravityAssistProgram(paramProg, 1, 2,noun, verb, true);
    // console.log('InitProgram');
    let result = runProgram(data, 0, paramCode);
    return result;
}

const getProgram = new Transform({
    transform(chunk, encoding, callback) {
        PROGRAM = JSON.parse(chunk.toString());
        console.log("GetProgram");

        for(let i = 0; i < MAX_NOUN; i++){
            for(let j = 0; j < MAX_VERB; j++) {
                if(OUTPUT > 0){
                    console.log('Found the Answer');
                    console.log('Output:', OUTPUT);
                    break;
                } else {
                    NOUN = i;
                    VERB = j;
                    let data = JSON.parse(JSON.stringify(PROGRAM));
                    initProgram(data, CODE, i, j);
                }
            }
            if(OUTPUT > 0){
                break;
            }
        }

        callback();
    }
});

readStream.pipe(getProgram);


// First Puzzle Solution: 2842648
// First puzzle output: 1202
// Second Puzzle output: 9074