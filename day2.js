const fs = require('fs');
const { Transform } = require('stream');

const readPuzzleFile = './puzzles/dayTwo/puzzle1.json';
// const readPuzzleFile = './puzzles/dayTwo/puzzle1Sample.json';
const readStream = fs.createReadStream(readPuzzleFile);

let PROGRAM = [];
let NOUN = 0;
let VERB = 0;
let CODE = 19690720;

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
    console.info("Program is finished");
    console.info("Position 0 is:", program[0]);
    return 'stop';
}

function restoreGravityAssistProgram(data, position1, position2) {

    console.log('noun:',NOUN, 'verb:', VERB );
    // data[position1] = NOUN;
    // data[position2] = VERB;
    data[position1] = 12;
    data[position2] = 2;

    return data;
}



//stocks and bonds
//_ l _ _ _ ls

function getOutput(){
    // 100* noun + verb
    console.log('noun:', NOUN, 'verb:', VERB);
    return 100 * (NOUN + VERB);
}

function stepForwardNoun(){
    NOUN += 1;
}

function stepForwardVerb() {
    VERB += 1;
}

function stepNounVerbForward(){
    if(NOUN < 99) {
        stepForwardNoun();
    } else {
        stepForwardVerb();
    }
    if(VERB > 98){
        console.log('--------Somthing went Wrong----------');
        return false;
    } 
    return true;
}

function initProgram(data, matchCode = 0) {
    let prog = restoreGravityAssistProgram(data,1,2);
    console.log('InitProgram');
    runProgram(prog, 0, matchCode);   
}

function runProgram(data, index, matchCode = 0){
    let optCodePosition = index;
    let inputPosition1 = index + 1;
    let inputPosition2 = index + 2;
    let outputPosition = index + 3;
    let nextIndex = index + 4;
    let optCode = data[optCodePosition];

    let result = performOptCodeAction(data, optCode, inputPosition1, inputPosition2);
    if(result == 'stop' || result === 'error') {
        console.log('Program Finished!');
        console.log('Result:',data[0]);
        if(matchCode > 0 && matchCode !== data[0]){
            let isSuccess = stepNounVerbForward();
            if(isSuccess){
                console.log('run program again');
                initProgram(PROGRAM, CODE);
            }
        } else if (matchCode > 0 && matchCode == data[0]) {
            const output = getOutput();
            console.log("Output:", output);
        }
        return true;
    } else {
        let outputData = data[outputPosition];
        data[outputData] = result;
        runProgram(data, nextIndex);
    }
}

const getProgram = new Transform({
    transform(chunk, encoding, callback) {
        let prog = JSON.parse(chunk.toString());
        PROGRAM = JSON.parse(JSON.stringify(prog));
        console.log("GetProgram", PROGRAM);
        initProgram(PROGRAM, 0);

        callback();
    }
});

readStream.pipe(getProgram).on('end', function () {

    console.log('Done:', program);
});
