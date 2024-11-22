console.log('this works');

const people = [
    { name: "adri" },
    { name: "becky" },
    { name: "chris" },
    { name: "dillon" },
    { name: "evan" },
    { name: "frank" },
    { name: "georgette" },
    { name: "hugh" },
    { name: "igor" },
    { name: "jacoby" },
    { name: "kristina" },
    { name: "lemony" },
    { name: "matilda" },
    { name: "nile" },
    { name: "ophelia" },
    { name: "patrick" },
    { name: "quincy" },
    { name: "roslyn" },
    { name: "solene" },
    { name: "timothy" },
    { name: "uve" },
    { name: "violet" },
    { name: "wyatt" },
    { name: "xenia" },
    { name: "yadri" },
    { name: "zack" }
];


// To put th name to the html dynamically

// 1. get the container element
const container = document.querySelector('.container');
console.log(container)
// 2. iterate over the people array
people.forEach(person => {
    console.log (person)
    // 3. for every element in the people array, create the new listItem
    const listItem = document.createElement('li');
    // 4. add the name of listitem to the listItem 
    listItem.textContent = person.name;
    // 5. append the listItem to the container
    container.appendChild(listItem)

})


