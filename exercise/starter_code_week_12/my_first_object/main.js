/*
 Create your own JavaScript object representing your favorite movie.
  
 Example:
 
 const blade = {
  title: 'Blade',
  director: 'Stephen Norrington',
  actors: ['Wesley Snipes', 'Stephen Dorff', 'Kris Kristofferson'],
  releaseYear: 1998,
  duration: 120,
 };
 
 1. After you have created your movie object, print the title of your movie using dot notation
 2. Print the director's name
 3. Print the release year
 4. Maybe your favorite movie came with an extended director's cut - write a statement that increases your movie object's duration by 25 minutes
*/

var blade = {
    title: 'Blade',
    director: 'Stephen Norrington',
    actors: ['Wesley Snipes', 'Stephen Dorff', 'Kris Kristofferson'],
    releaseYear: 1998,
    duration: 120,
    extendedCut: function(){
      return this.duration += 25;
    }
   };
  
  console.log(blade.title);
  console.log(blade.director);
  console.log(blade.releaseYear);
  console.log(blade.extendedCut())  