console.log('this works');

const flowers = [
    {
        name: "Tulip",
        color: "yellow",
        image:
        "https://cdn.britannica.com/37/227037-050-CA792866/Broken-tulip-flower.jpg"
    },
    {
        name: "Daffodil",
        color: "yellow",
        image: "https://h2.commercev3.net/cdn.brecks.com/images/800/67248A.jpg"
    },
    {
        name: "Sunflower",
        color: "yellow",
        image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/800px-Sunflower_sky_backdrop.jpg"
    },
    {
        name: "Bluebell",
        color: "blue",
        image:
        "https://upload.wikimedia.org/wikipedia/commons/a/a8/Hyacinthoides_non-scripta_%28Common_Bluebell%29.jpg"
    },
    {
        name: "Rose",
        color: "red",
        image: "https://www.jacksonandperkins.com/images/xxl/v1780.jpg"
    }
];

// 1. grab the point of insertion, ul
const ul = document.querySelector('ul');
console.log(ul);

// 2. loop through the flowers array of objects
flowers.forEach(flower => {
    console.log(flower)
    // 3. create a new li element for each flower
    const li = document.createElement('li');
    li.classList.add('card');
    const p = document.createElement('p');
    // 4. create a new img element for each flower
    const img = document.createElement('img');
    // 5. set the src attribute of the img element to the image property of the flower object
    img.setAttribute('src', flower.image);
    // add text
    p.textContent = flower.name;

    // 6. append the img element to the li element
    li.appendChild(img);
    li.appendChild(p);
    // 7. append the listItem to the ul
    ul.appendChild(li);
})