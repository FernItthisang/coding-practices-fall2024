console.log('this works')

// Grab the anchor tag
let anchor = document.querySelector('a')

// write the function
const viewComments  = (event) => {
    console.log(event)
    event.preventDefault();
    let comments = 
    document.querySelector('#comments');
    comments.className ='show-comments';
}

anchor.addEventListener('click', viewComments);