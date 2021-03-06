//This script contains all methods related to word processing and binary composition.

//These are configuration variables for word processing, main conditionals and allowed chars:
const minWordLength = 1;
const maxWordLength = 27;
const notAllowedChars = "/[&\/\\#,+()$~%.'\":*?<>{}¡¿!-_]";
const purgingPattern = 1;

//This will be configuration for decomposition:
//They mean the following:
//[<original substring> , <substring wanted> , <position code>]
// Position Codes:
// '*' -> Apply in every position
// 's' -> Apply only at the beginning of the word.
// 'e' -> Apply only at the end of the word.
const ruleSet1 = [
    ['qu', 'k', '*'],
    ['qu', 'q', '*'],
    ['que', 'q', 's'],
    ['si', 'zi', '*'],
    ['si', 'ci', '*'],
    ['se', 'c', 's'],
    ['se', 'ze', '*'],
    ['ho', 'o', 's'],
    ['o', 'ho', 's'],
    ['s', 'z', '*'],
    ['por', 'x', 's'],
    ['cu', 'ku', '*'],
    ['ca', 'ka', '*'],
    ['ha', 'a', 's'],
    ['a', 'ha', 's'],
    ['he', 'e', 's'],
    ['by', 'bi', 's'],
    ['ve', 'be', '*'],
    ['á', 'a', '*'],
    ['é', 'e', '*'],
    ['í', 'i', '*'],
    ['ó', 'o', '*'],
    ['ú', 'u', '*'],
];

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
    //var now = new Date();
    var purged = "";
    //console.log("---------------------------------------------------------");
    //console.log("Word to purge : " + word);
    //First removes all special chars.
    purged = word.replace(/[&\/\\#,+()$~%.'\":*?<>{}¡¿!-_]/g, '');
    //Then we need to check if there are no repeated char.
    purged = purgeChars(purged);
    //Finally we check the length, which should be above min and below max.
    if(purged.length > maxWordLength || purged.length < minWordLength) return false;
    //console.log("Purged word : " + purged);
    //var finish = new Date();
    //console.log("Took " + (finish.getTime() - now.getTime()) + " miliseconds to finish.");
    return purged;
}

//This function transmutes the word in different ways keeping the same structure, with the purpose of imitate
//grammatical mistakes.
//Returns a list of words.
var transmute = (word) => {
    //var now = new Date();
    var rules = [];
    var transmutedList = [];
    // console.log("---------------------------------------------------------");
    // console.log("Word to transmute : " + word);
    //we will base ourselves in the rules declared at the beginning.
    
    //First we iterate the ruleSet declared at the beginning, we check if a rule may be applied to the word requested.
    for(var i in ruleSet1) if(word.indexOf(ruleSet1[i][0]) > -1) rules.push(ruleSet1[i]);
    //Finally, all those rules were pushed into a new array called 'rules' and we now iterate it.
    for(var i in rules){
        //This checks the third parameter, that has to do with the position.
        switch(rules[i][2]){
            case "*":
                transmutedList.push(word.replace(rules[i][0], rules[i][1]));
                break;
            case "s":
                if(word.indexOf(rules[i][0]) == 0) transmutedList.push(word.replace(rules[i][0], rules[i][1]));
                break;
            case "e":
                if(word.indexOf(rules[i][0]) == word.length - (rules[i][0].length)) transmutedList.push(word.replace(rules[i][0], rules[i][1]));
                break;
            default:
                console.log("Using * as default. Specify otherwise.");
                transmutedList.push(word.replace(rules[i][0], rules[i][1]));
                break;
        }
    }
    //var finish = new Date();
    //console.log("Took " + (finish.getTime() - now.getTime()) + " miliseconds to finish.");
    return transmutedList;
}

//Final step before sending array to neural network, this function converts every char
//inside the array into int.
var numerizeArray = (array) => {
    var newArray = [];
    for(var i in array) newArray.push(parseInt(array[i]))
    return newArray;
}

//This function normalizes the binary depending on the max length declared for words.
//Returns a normalized version of the binary string.
var normalizeBinary = (binary) => {
    //var now = new Date();
    var maxrange = maxWordLength - (binary.length/8);
    //console.log("---------------------------------------------------------");
    //console.log("Binary to normalize : " + binary);
    for(var i = 0; i < maxrange; i++) binary += "00000000";
    //console.log("Normalized binary: " + binary);
    //var finish = new Date();
    //console.log("Took " + (finish.getTime() - now.getTime()) + " miliseconds to finish.");
    return numerizeArray(binary.split(''));
}

//This function converts a word into binary code.
//Returns a binary string.
var toBinary = (word) => {
    //var now = new Date();
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
    //var finish = new Date();
    //console.log("Took " + (finish.getTime() - now.getTime()) + " miliseconds to finish.");
    return normalizeBinary(binaryWord);
}

//This function converts a normalized binary into a string.
//Returns a String.
var normalizedBinaryToString = (binary) =>{
    var word = "";
    //console.log("---------------------------------------------------------");
    //console.log("Transforming " + binary + " into String.");
    binary = binary + "";
    for(var i = 0; i < maxWordLength; i++){
       // console.log(binary.slice(i * 8, (i*8) + 8));
        var character = String.fromCharCode(parseInt(binary.slice(i * 8, (i*8) + 8), 2));
        //console.log("Binary char : " + binary.slice(i * 8, (i*8) + 8));
        //console.log(i + ". Extracted char "+ character);
        if(character != " ") word += character;
    }
    return word;
}