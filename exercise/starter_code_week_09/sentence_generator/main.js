/*

    ----------------------------------------
    PART 1
    ----------------------------------------
    1. Create three variables called noun verb and adjective and store one of each type.
    2. Choose a short one sentence poem that includes the following variables:
         —  Sample sentence: `My ${noun} leaps ${adjective} when I ${verb} a rainbow in the sky:`
    3. Create five different versions of this sentence with different variables.
    4. Write it to the browser window using document.write()

    ----------------------------------------
    PART 2
    ----------------------------------------
    1. Make Make a list of at least five words for each variable:
        — Sample array: let nouns = [ ‘heart’, ‘rainbow’, ‘ocean’];.
    2. Create a randomly generated sentence by using the variables.
        — Sample sentence: `My ${noun} leaps ${adjective} when I ${verb} a rainbow in the sky:`
    3. Write it to the browser window using document.write()

    Hint: Formula for selecting a random element from an array
    Article: https://css-tricks.com/snippets/javascript/select-random-item-array/
    let item = arrayName[Math.floor(Math.random()*arrayName.length)];

    let nouns = ["heart", "rainbow", "ocean"];
    let verbs = ["look", "make", "continue"];
    let adjectives = ["good", "different", "possible"];

*/

// Part 1

let noun = "heart";
let verb = "look";
let adjective = "good";

let sentence = `My ${noun} ${verb} brighthly at the ${adjective} sky.`
console.log(sentence)
document.write(sentence)

//Part 2
let nouns = ["heart", "rainbow", "ocean"];
let verbs = ["look", "make", "continue"];
let adjectives = ["good", "different", "possible"];

let randomNouns = nouns[Math.floor(Math.random()*nouns.length)];
console.log(randomNouns)

let randomVerbs = verbs[Math.floor(Math.random()*verbs.length)];
console.log(randomVerbs)

let randomAdjectives = adjectives[Math.floor(Math.random()*adjectives.length)];
console.log(randomAdjectives)

let randomSentence = `My ${randomNouns} ${randomVerbs} brighthly at the ${randomAdjectives} sky.`;
console.log(randomSentence)
document.write(randomSentence)


