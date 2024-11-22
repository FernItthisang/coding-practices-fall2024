// Part 1
/** WRITE YOUR CODE BELOW EACH COMMENT **/

/* [1] Get the element with an ID of 'title' using the method getElementById, then console.log the result */

let title = document.getElementById('title');
console.log(title);

/* [2] Now delete that first element (in the html file), and re-run your code. What changed? */

// If you have the multiple same id you will get the first one


/* [3] Get the elements with a class of 'pullquote' with getElementsByClassName, then console.log the result */

let pullquote =  document.getElementsByClassName('pullquote');
console.log(pullquote);

/* Delete one of the elements with a class of 'pullquote' and refresh the page. Do you get a similar result? */

/* Get the span element using getElementsByTagName, then console.log the result */

let span = document.getElementsByTagName('span');
console.log(span)

/* Add a span element anywhere, and re-run the last piece of code. What's different? */
// span[0].style.color = "red" to put in the inspect



// Part 2 : using querySelector 

// 1. Get the element with an ID of 'title' using querySelector
let titleQuery = document.querySelector('#title')
console.log(titleQuery);

// 2. Get the elements with a class of 'pullquote' with querySelector
let pullquoteQuery =  document.querySelector('.pullquote');
console.log(pullquoteQuery);
// This will get just one  from all but if we nedd all use querySelectorAll

// 3. Try the above prompt with querySelectorAll. What's the difference between what these two methods return?
let pullquoteQueries =  document.querySelectorAll('.pullquote');
console.log(pullquoteQueries);

// 4. Get the span element using querySelector
let spanQuery = document.querySelector('span');
console.log('span element', spanQuery);

// 5. Get multiple span elements using querySelectorAll
let spanQueries = document.querySelectorAll('span');
console.log(spanQueries);

// 6. Select only "a" tags *directly inside* of a <p> tag (no grandchildren).

let aTag = document.querySelectorAll('p > a');
console.log(aTag);
