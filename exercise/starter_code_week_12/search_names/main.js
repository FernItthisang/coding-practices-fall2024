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

// 1. Get the container element
const container = document.querySelector('.container');
console.log(container);

// 2. Iterate over the people array
people.forEach(person => {
    console.log(person);
    // 3. Create a new list item for each person
    const listItem = document.createElement('li');
    // 4. Add the name to the list item
    listItem.textContent = person.name;
    // 5. Append the list item to the container
    container.appendChild(listItem);
});

// Search functionality
const searchBar = document.querySelector('.input');

// Clear the list of displayed names
const clearList = () => {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};

// Display filtered results
const displayFiltered = (filteredNames) => {
    console.log(filteredNames);
    // Clear the container
    clearList();

    filteredNames.forEach(person => {
        // Create a new list item
        const listItem = document.createElement('li');
        // Add text content to the list item
        listItem.textContent = person.name;
        // Append the list item to the container
        container.appendChild(listItem);
    });
};

// Search function
const searchName = (event) => {
    const searchString = event.target.value.toLowerCase();
    console.log('Search String:', searchString);

    const filteredPeople = people.filter(person => {
        return person.name.toLowerCase().includes(searchString);
    });
    console.log('Filtered People:', filteredPeople);
    displayFiltered(filteredPeople);
};

// Add event listener for the search bar
searchBar.addEventListener('keyup', searchName);