console.log('this work!')

// Get the element with the id of 'special'

let myElement = document.getElementById('special');
console.log(myElement);
myElement.style.color ="blue";
myElement.innerText;
myElement.classList;
console.log('color of the text',myElement.style.color);
console.log('grab the text:',myElement.innerText);
console.log('List the class:',myElement.classList);

//change the text
myElement.innerHTML = '<h2>Hey!</h2>';

//1. create the new element
const listItem = document.createElement('li');

// 2. add class list
listItem.classList.add('list-item');

//2.1 add text
listItem.innerText ='I am a list Item.'
//3. append to DOM
myElement.appendChild(listItem)
// Removes the bullet point
listItem.style.listStyle = 'none'; 
