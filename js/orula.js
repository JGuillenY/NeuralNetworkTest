$(document).ready(function(){
    //This will be configuration for decomposition:
    const ruleSet1 = [
        ['qu', 'k'],
        ['qu', 'q'],
        ['que', 'q'],
        ['si', 'zi'],
        ['si', 'ci'],
        ['se', 'c'],
        ['se', 'ze'],
        ['ho', 'o'],
        ['o', 'ho'],
        ['s', 'z'],
        ['por', 'x'],
        ['cu', 'ku'],
        ['ca', 'ka'],
        ['ha', 'a'],
        ['a', 'ha'],
        ['he', 'e'],
        ['by', 'bi'],
        ['bi', 'by'],
        ['ve', 'be'],
    ];

    //This will be configuration for process:
    const minWordLength = 1;
    const maxWordLength = 27;
    const notAllowedChars = "/[&\/\\#,+()$~%.'\":*?<>{}¡¿!-_]";
    const purgingPattern = 1;

    //Neural Network variables
    const catalog = {
        "0001" : "salute",
        "0010" : "product",
        "0100" : "question",
        "1000" : "goodbye"
    }

    const cases = {
        "0001" : "saying hello",
        "0010" : "mentioning product",
        "0011" : "say hello to product",
        "0100" : "he is asking something",
        "0101" : "he is asking if someone is there",
        "0110" : "he is asking about a product",
        "0111" : "he is saying hello and asking for a product",
        "1000" : "he is saying goodbye",
        "1001" : "he is saying hello and goodbye",
        "1010" : "he is mentioning a product and saying goodbye",
        "1011" : "he is saying hello to a product and then goodbye",
        "1100" : "he is asking if there is a goodbye",
        "1110" : "he is asking about a product and saying goodbye",
        "1101" : "he is asking a question and saying goodbye",
        "1111" : "he is leaving a note about everything he wants"
    }

    const responses = {
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

    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    const myNetwork = new Network({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    });

    var trainNetwork = () => {
        var now = new Date();

        var word = $("#trainword").val();
        var wordset = [
                        //Welcome
                        ["hola", [0,0,0,1]],
                        ["hey", [0,0,0,1]],
                        //Object
                        ["objeto", [0,0,1,0]],
                        ["cosa", [0,0,1,0]],
                        //Question
                        ["saber", [0,1,0,0]],
                        ["costo", [0,1,0,0]], 
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
                        ["bye", [1,0,0,0]] ];
        var timestotrain = $("#timestotrain").val();
        var result = $("#resultexpected").val();
        var learningRate = .3;
        var trainningArray = {"0001" : [], "0010" : [], "0100" : [], "1000" : []};
        for(var i in wordset){
            switch(wordset[i][1].indexOf(1)){
                case 0:
                    var nobinary = transmute(wordset[i][0]);
                    for(var i in nobinary){
                        trainningArray["0001"].push(toBinary(nobinary[i]));
                    }
                    break;
                case 1:
                    var nobinary = transmute(wordset[i][0]);
                    for(var i in nobinary){
                        trainningArray["0010"].push(toBinary(nobinary[i]));
                    }
                    break;
                case 2:
                    var nobinary = transmute(wordset[i][0]);
                    for(var i in nobinary){
                        trainningArray["0100"].push(toBinary(nobinary[i]));
                    }
                    break;
                case 3:
                    var nobinary = transmute(wordset[i][0]);
                    for(var i in nobinary){
                        trainningArray["1000"].push(toBinary(nobinary[i]));
                    }
                    break;
            }
        }
        console.log(trainningArray);
        console.log("---------------------------------------------------------");
        console.log("Starting to train.");
        for (var i = 0; i < timestotrain; i++) {
            for(var j in trainningArray){
                console.log(j);
                for(var k in trainningArray[j]){
                    var guess = null;
                    console.log("Now Trainning " + trainningArray[j][k]);
                    var expectedResult = numerizeArray(j.split(""));
                    console.log("Expecting " + expectedResult);
                    guess = myNetwork.activate(trainningArray[j][k]);
                    myNetwork.propagate(learningRate, expectedResult);
                    console.log("guess=" + guess + " : result=" + result);
                    $("#log").append("<li>take " + i + ", word # " + k +  " -> aguess=" + guess + " : result=" + expectedResult + "</li>");
                }
            }
        }
        var finish = new Date();
        console.log("Train finished after " + (finish.getTime() - now.getTime()) + " miliseconds.");
    }

    //This is a recursive function that takes away more than the purgingPattern + 1.
    //Returns purged word.
    var purgeChars = (word) => {
        var checkingChar = "";
        var checkflag = 0;
        for(var i in word){
            if(checkingChar == word[i]){
                if(checkflag == purgingPattern){
                    word[i] = "";
                    word = word.slice(0, i-1).concat(word.slice(i));
                    return purgeChars(word);
                }else {
                    checkflag++;
                }
            }else{
                checkingChar = word[i];
                checkflag = 0;
            }
        }
        return word;
    }

    //This will process some standard mistakes like repeated letters.
    //Returns a purged version of the word.
    var purgeString = (word) => {
        var now = new Date();
        var purged = "";
        console.log("---------------------------------------------------------");
        console.log("Word to purge : " + word);
        //First removes all special chars.
        purged = word.replace(/[&\/\\#,+()$~%.'\":*?<>{}¡¿!-_]/g, '');
        //Then we need to check if there are no repeated char.
        purged = purgeChars(purged);
        //Finally we check the length, which should be above min and below max.
        if(purged.length > maxWordLength || purged.length < minWordLength){
            console.log("Word '"+ purged +"' was not accepted.");
            return false;
        }
        console.log("Purged word : " + purged);
        var finish = new Date();
        console.log("Took " + (finish.getTime() - now.getTime()) + " miliseconds to finish.");
        return purged;
    }

    //This function transmutes the word in different ways keeping the same structure, with the purpose of imitate
    //gramatical mistakes.
    //Returns a list of words.
    var transmute = (word) => {
        var now = new Date();
        var rules = [];
        var transmutedList = [];
        console.log("---------------------------------------------------------");
        console.log("Word to transmute : " + word);
        //we will base ourselves in the rules declared in the beginning.
        //plan:
        //1.- check which cases apply to the word.
        //2.- put them all into a single array.
        //3.- start producing different variations in a relationship 1-all.

        //1
        for(var i in ruleSet1){
            //2
            if(word.indexOf(ruleSet1[i][0]) > -1) rules.push(ruleSet1[i]);
        }
        //3
        for(var i in rules){
            transmutedList.push(word.replace(rules[i][0], rules[i][1]));
            console.log("Transmutation #1: " + transmutedList[i]);
        }
        var finish = new Date();
        console.log("Took " + (finish.getTime() - now.getTime()) + " miliseconds to finish.");
        return transmutedList;
    }

    //Final step before sending array to neural network, this function converts every char
    //inside the array into int.
    var numerizeArray = (array) => {
        var newArray = [];
        for(var i in array){
            newArray.push(parseInt(array[i]))
        }
        //console.log("input: " + array);
        //console.log("output: " + newArray);
        return newArray;
    }

    //This function normalizes the binary depending on the max length declared for words.
    //Returns a normalized version of the binary string.
    var normalizeBinary = (binary) => {
        var now = new Date();
        var maxrange = maxWordLength - (binary.length/8);
        //console.log("---------------------------------------------------------");
        //console.log("Binary to normalize : " + binary);
        for(var i = 0; i < maxrange; i++){
            binary += "00000000";
        }
        var finish = new Date();
        //console.log("Took " + (finish.getTime() - now.getTime()) + " miliseconds to finish.");
        return numerizeArray(binary.split(''));
    }

    //This function converts a word into binary code.
    //Returns a binary string.
    var toBinary = (word) => {
        var now = new Date();
        var binaryWord = "";
        //console.log("---------------------------------------------------------");
        //console.log("Word to convert: " + word);
        for(var i in word){
            var binaryChar = "";
            binaryChar += word[i].charCodeAt(0).toString(2);
            binaryChar = new Array(9 - binaryChar.length).join('0') + binaryChar;
            binaryWord += binaryChar;
        }
        //console.log("Converted word: " + binaryWord);
        var finish = new Date();
        //console.log("Took " + (finish.getTime() - now.getTime()) + " miliseconds to finish.");
        return normalizeBinary(binaryWord);
    }

    var startDecomposition = () => {
        var now = new Date();
        var input = $("#wordtotrain").val();
        var listofwords = [];
        listofwords = transmute(input);
        //console.log(listofwords);
        $("#binaryresult").html(listofwords.join(" , "));
        var finish = new Date();
        //console.log("Took " + (finish.getTime() - now.getTime()) + " miliseconds to finish.");
    }

    var startProcess = () => {
        var now = new Date();
        var input = $("#wordtotrain").val();
        var inputArray = [];
        var binaryArray = [];
        var binaries = [];
        //console.log(input);
        inputArray = input.split(" ");
        //console.log(inputArray);
        for(var i in inputArray){
            var purgedWord = purgeString(inputArray[i]);
            if(purgedWord) binaryArray.push(toBinary(purgedWord));
        }
        //console.log("---------------------------------------------------------");
        //console.log("Binary Array :");
        //console.log(binaryArray);
        $("#binaryresult").html(binaryArray.join(" "));
        var finish = new Date();
        //console.log("Took " + (finish.getTime() - now.getTime()) + " miliseconds to finish.");
    }

    var askWord = (word) => {
        //var word = $("#wordAsked").val();
        console.log("ASKING " + word);
        var interpretation = myNetwork.activate(toBinary(purgeString(word)));
        var translation = [];
        for(var x in interpretation){
            if(interpretation[x] >= presicion){
                translation.push(1);
            }else translation.push(0);
        }
        console.log("RESPONSE " + interpretation);
        console.log("INTERPRETATION " + translation.reverse().join());
        console.log("IT IS A " + catalog[translation.join().replace(/,/g, "")]);
        return translation.reverse();
    }

    var askQuestion = () => {
        var question = $("#wordAsked").val().split(" ");
        var preConclusion = [];
        var conclusion = [0, 0, 0, 0];
        for(var i in question){
            var preConclusion = askWord(question[i]);
            for(var j in preConclusion){
                conclusion[j] += preConclusion[j];
                if(conclusion[j] >= 1) conclusion[j] = 1;
            }
        }
        console.log("Conclusion " + conclusion.reverse());
        $("#response").html(responses[conclusion.join().replace(/,/g, "")]);
    }
});