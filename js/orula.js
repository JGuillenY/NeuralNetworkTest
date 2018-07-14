//This library contains all the functions related to neural network trainning.
//It needs to have wordprocessor.js added in order to work (it uses methods from there.)

//Neural Network variables

//Possible Classes.
const catalog = {
    "0001" : "salute",
    "0010" : "product",
    "0100" : "question",
    "1000" : "goodbye",
    "0000" : "unknown"
}

//Possible States.
const states = {
    "0001" : "welcoming",
    "0010" : "asking question",
    "0100" : "answering question",
    "1000" : "goodbye"
}

//Possible Cases
// "0001" : "saying hello",
// "0010" : "mentioning product",
// "0011" : "say hello to product",
// "0100" : "he is asking something",
// "0101" : "he is asking if someone is there",
// "0110" : "he is asking about a product",
// "0111" : "he is saying hello and asking for a product",
// "1000" : "he is saying goodbye",
// "1001" : "he is saying hello and goodbye",
// "1010" : "he is mentioning a product and saying goodbye",
// "1011" : "he is saying hello to a product and then goodbye",
// "1100" : "he is asking if there is a goodbye",
// "1110" : "he is asking about a product and saying goodbye",
// "1101" : "he is asking a question and saying goodbye",
// "1111" : "he is leaving a note about everything he wants"

const responses = {
    "0000" : "You should try to be more clear this time...",
    "0001" : "Hello! how can i help you?",
    "0010" : "Do you need help with <x>?",
    "0011" : "Hello! Do you need help with <x>?",
    "0100" : "What was the question again?",
    "0101" : "Hello, yes i am here for you.",
    "0110" : "What do you need to know about <x>?",
    "0111" : "Hi! What do you need to know about <x>?",
    "1000" : "Good-bye!",
    "1001" : "Hi! Anything else you need?",
    "1010" : "Goodbye! I hope you liked <x>",
    "1011" : "Hello! I could not understand what you asked",
    "1100" : "I am not leaving yet",
    "1110" : "Do you need me to send this question about <x> to administrator before you leave?",
    "1101" : "Hi! Do you need me to send this question to administrator before you leave?",
    "1111" : "Hi! Do you need me to send this question about <x> to administrator before you leave?"
}

const Layer = synaptic.Layer;
const Network = synaptic.Network;
const Trainer = synaptic.Trainer;

const inputLayer = new Layer(maxWordLength * 8);
const hiddenLayer = new Layer(maxWordLength * 6);
const outputLayer = new Layer(4);

const presicion = .9;

//Depending on the context, the currentState will be changing in order to maintain a general notion of
//what is the purpose of what is being talked currently.
var currentState = "0001" //The initial state is always Welcoming.

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

const myNetwork = new Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
});

var trainNetwork = () => {
    var now = new Date();
    var wordset = [
                    //Welcome
                    ["hola", [0,0,0,1]],
                    ["hey", [0,0,0,1]],
                    ["alo", [0,0,0,1]],
                    //Object
                    ["objeto", [0,0,1,0]],
                    ["cosa", [0,0,1,0]],
                    ["chingadera", [0,0,1,0]],
                    ["pendejada", [0,0,1,0]],
                    ["rollo", [0,0,1,0]],
                    ["cancion", [0,0,1,0]],
                    ["esto", [0,0,1,0]],
                    //Question
                    ["saber", [0,1,0,0]],
                    ["costo", [0,1,0,0]],
                    ["precio", [0,1,0,0]],
                    ["cuesta", [0,1,0,0]],
                    ["sale", [0,1,0,0]],
                    ["cuánto", [0,1,0,0]],
                    ["qué", [0,1,0,0]],
                    //Ignored
                    ["la", [0,0,0,0]],
                    ["el", [0,0,0,0]],
                    ["tu", [0,0,0,0]],
                    ["para", [0,0,0,0]],
                    ["por", [0,0,0,0]],
                    ["que", [0,0,0,0]],
                    ["yo", [0,0,0,0]],
                    ["esa", [0,0,0,0]],
                    ["ese", [0,0,0,0]],
                    //Goodbye
                    ["adios", [1,0,0,0]],
                    ["nos vemos", [1,0,0,0]],
                    ["bye", [1,0,0,0]] ];
    var timestotrain = $("#timestotrain").val();
    var learningRate = .3;
    var trainningArray = {"0001" : [], "0010" : [], "0100" : [], "1000" : [], "0000" : []};
    for(var i in wordset){
        switch(wordset[i][1].indexOf(1)){
            case 0:
                var nobinary = transmute(wordset[i][0]);
                trainningArray["1000"].push(toBinary(wordset[i][0]));
                for(var i in nobinary) trainningArray["1000"].push(toBinary(nobinary[i]));
                break;
            case 1:
                var nobinary = transmute(wordset[i][0]);
                trainningArray["0100"].push(toBinary(wordset[i][0]));
                for(var i in nobinary) trainningArray["0100"].push(toBinary(nobinary[i]));
                break;
            case 2:
                var nobinary = transmute(wordset[i][0]);
                trainningArray["0010"].push(toBinary(wordset[i][0]));
                for(var i in nobinary) trainningArray["0010"].push(toBinary(nobinary[i]));
                break;
            case 3:
                var nobinary = transmute(wordset[i][0]);
                trainningArray["0001"].push(toBinary(wordset[i][0]));
                for(var i in nobinary) trainningArray["0001"].push(toBinary(nobinary[i]));
                break;
            default:
                var nobinary = transmute(wordset[i][0]);
                trainningArray["0000"].push(toBinary(wordset[i][0]));
                for(var i in nobinary) trainningArray["0000"].push(toBinary(nobinary[i]));
                break;
        }
    }
    console.log(trainningArray);
    console.log("---------------------------------------------------------");
    console.log("Starting to train.");
    console.log("---------------------------------------------------------");
    for (var i = 0; i < timestotrain; i++) {
        for(var j in trainningArray){
            for(var k in trainningArray[j]){
                var guess = null;
                //console.log("Now Trainning " + trainningArray[j][k]);
                var expectedResult = numerizeArray(j.split(""));
                console.log("Now Trainning " + normalizedBinaryToString(trainningArray[j][k].join().replace(/,/g, "")));
                // console.log("Expecting " + expectedResult);
                guess = myNetwork.activate(trainningArray[j][k]);
                myNetwork.propagate(learningRate, expectedResult);
                console.log("guess=" + guess + " : result=" + expectedResult);
                $("#log").append("<li>Word : " + normalizedBinaryToString(trainningArray[j][k].join().replace(/,/g, "")) + " ("+ expectedResult +") -> GUESS = " + interpretResult(guess).join().replace() +"</li>");
            }
        }
    }
    var finish = new Date();
    console.log("Train finished after " + (finish.getTime() - now.getTime()) + " miliseconds.");
}

var interpretResult = (guess) => {
    var interpretation = [];
    for(var x in guess){
        if(guess[x] >= presicion){
            interpretation.push(1);
        }else interpretation.push(0);
    }
    return interpretation
}

//Receives a word and asks orula what it means.
//Returns a translation of the word.
var askWord = (word) => {
    //var word = $("#wordAsked").val();
    console.log("ASKING " + word);
    var guess = myNetwork.activate(toBinary(purgeString(word)));
    var interpretation = interpretResult(guess);
    //console.log("RESPONSE " + guess);
    console.log("INTERPRETATION " + interpretation.join());
    console.log("IT IS A " + catalog[interpretation.join().replace(/,/g, "")]);
    return interpretation;
}

//Based on the caseId and the current state it formulates a response.
var formulateResponse = (caseId) => {
    
}