// array of integers
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const greaterThanFive = numbers.filter(function(number) {
    return number > 5;
})

const greaterThanFive_02 = numbers.filter(number => {
    return number > 5;
})

console.log(numbers)
console.log(greaterThanFive)

// array of strings
let words = ["dog", "cat", "bat", "rat", "elephant", "lion", "tiger", "cheetah"];

const result = words.filter(word => {
    return word.length > 6;
})

console.log(result)

// array of objects
const creatures = [
    {name: 'shark', habitat: 'Ocean'},
    {name: 'whale', habitat: 'Ocean'},
    {name: 'lion', habitat: 'Savannah'},
    {name: 'monkey', habitat: 'Jungle'},
]

const aquaticCreatures = creatures.filter(creature => {
    return creature.name.toLowerCase() === 'lion';
})

console.log(aquaticCreatures)

// sorting by age (integer)
const names = [
    {name: 'John', age: 25},
    {name: 'Sara', age: 20},
    {name: 'Adrian', age: 30},
]

function compare(a, b){
    return a.age - b.age;
}

console.log(names.sort(compare))

// sorting by name (string)

function compareNames(a, b){
    let comparison = 0;

    if(a.name > b.name){
        comparison = 1;
    } else if (a.name < b.name){
        comparison = -1;
    }
    return comparison;
}

console.log(names.sort(compareNames))