// let artist_info = {
//     first_name: "Frida",
//     last_name: "Kahlo",
//     year_of_birth: 1907,
//     country_of_birth: "Mexico",
//     fullName: function() {
//         return` $(this.first_name) $(this.last_name)`
//     },
//     // methods
//     printShortBio: function() {
//     return ` $(this.first_name) $(this.last_name)`+ " was born in" +
//     this.countryOfBirth;
// }
// };

// let items = { a: 1, b: 2, c: 3 }
// for (property in items) {
// console.log( items[property] );
// }

let nums = [1, 2, 3, 4, 5, 6];
function square (num) {
console.log( num * num );
}
nums.forEach(square)