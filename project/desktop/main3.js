const sheetURL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_FkYoX4hOcHbt0_pyiQCg8MYGZ8fRWi97OCOLP0bJaNlFjLlfLiwCVO5fVa_SXRrXRKpI6CX6sQVS/pub?output=csv';



// Fetch data from Google Sheet
async function fetchGoogleSheetData() {
    const response = await fetch(sheetURL);
    const csvText = await response.text();
    return parseCSV(csvText);
}

// Parse CSV data
function parseCSV(csvText) {
    const rows = csvText.split('\n').filter(row => row.trim());
    const headers = rows[0].split(',').map(header => header.trim());

    return rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index]?.trim() || '';
            return obj;
        }, {});
    });
}

// Populate data into the webpage
let folderData = {}; // Global variable to store folder data

async function populateData() {
    const data = await fetchGoogleSheetData(); // Fetch data from Google Sheets
    folderData = {}; // Reset folder data

    const favorites = [];
    const tags = new Set();

    // Group folders by year and folder name
    data.forEach(item => {
        const year = item.year?.trim();
        const folderName = item.folder?.trim();
        const images = item.image
            ? item.image.split(';').map(img => img.trim())
            : [];
        const imgNames = item.imgname
            ? item.imgname.split(';').map(name => name.trim() || "Unnamed")
            : Array(images.length).fill("Unnamed");
    
        // Ensure folderData[year] exists before accessing folderData[year][folderName]
        if (!folderData[year]) folderData[year] = {};
        if (!folderData[year][folderName]) {
            folderData[year][folderName] = {
                description: item.tags || '', // Store tags for each image
                images: [],
                imgNames: [],
                tags: item.tags ? item.tags.split(';').map(tag => tag.trim()) : [] // Split tags into an array
            };            
        }

        folderData[year][folderName].images.push(...images);
        folderData[year][folderName].imgNames.push(...imgNames);
    
        favorites.push(folderName);
        item.tags?.split(';').forEach(tag => tags.add(tag.trim()));
    });

    renderFolders(folderData);
    populateFavorites(favorites);
    populateTags(tags);
}

function renderFolders(folderData) {
    const folderContainer = document.getElementById('folders');
    folderContainer.innerHTML = '';

    Object.keys(folderData).forEach(year => {
        const yearDiv = document.createElement('div');
        yearDiv.classList.add('year');
        yearDiv.textContent = year;

        const folderGroupDiv = document.createElement('div');
        folderGroupDiv.classList.add('folder-group');

        Object.keys(folderData[year]).forEach(folderName => {
            const folderDiv = document.createElement('div');
            folderDiv.classList.add('folder');
            folderDiv.innerHTML = `
                <img src="asset/folder.svg" alt="${folderName}" class="folder-icon">
                <p>${folderName}</p>
            `;
            folderDiv.addEventListener('click', () =>
                openFolder(
                    folderName, 
                    folderData[year][folderName].images, 
                    folderData[year][folderName].imgNames // Pass imgNames here
                )
            );
            folderGroupDiv.appendChild(folderDiv);
        });

        folderContainer.appendChild(yearDiv);
        folderContainer.appendChild(folderGroupDiv);
    });
}

// function openFolder(folderName, images) {
//     console.log("Images being loaded:", images); // Debug: Check the URLs

//     let modal = document.getElementById('modal');
//     if (!modal) {
//         modal = document.createElement('div');
//         modal.id = 'modal';
//         modal.classList.add('modal');
//         document.body.appendChild(modal);
//     }

//     // Render the modal content
//     modal.innerHTML = `
//         <div class="modal-content">
//             <span class="close" onclick="document.getElementById('modal').style.display='none'">&times;</span>
//             <h2>${folderName}</h2>
//             <div class="image-gallery">
//                 ${images.map(img => {
//                     const cleanURL = encodeURI(img.trim()); // Ensure proper URL encoding
//                     return `<img src="${cleanURL}" alt="${folderName}" 
//                                  onerror="this.onerror=null; this.src='asset/placeholder.png';">`;
//                 }).join('')}
//             </div>
//         </div>
//     `;
//     modal.style.display = 'block';
// }

function openFolder(folderName, images, imgNames, tags = []) {
    let modal = document.getElementById('modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal';
        modal.classList.add('modal');
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="document.getElementById('modal').style.display='none'">&times;</span>
            <h2>${folderName}</h2>
            <div class="image-gallery">
                ${images.map((img, index) => {
                    const cleanURL = img.trim();
                    const imageName = imgNames[index] || "Unnamed";
                    const imageTags = tags[index] ? tags[index].split(';') : [];

                    return `
                        <div class="image-item">
                            <img src="${cleanURL}" alt="${imageName}" 
                                onerror="this.onerror=null; this.src='asset/placeholder.png';">
                            <p>${imageName}</p>
                            <div class="image-tags">
                                ${imageTags.map(tag => `
                                    <span class="tag-circle" style="background-color: ${tagColors[tag] || '#999'};"></span>
                                `).join('')}
                            </div>
                        </div>`;
                }).join('')}
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

function populateFavorites(favorites) {
    const favoritesList = document.getElementById('favorites');
    favoritesList.innerHTML = '';
    [...new Set(favorites)].forEach(folder => {
        const li = document.createElement('li');
        li.classList.add('favorite-item');

        // Add icon and make it clickable
        li.innerHTML = `
            <img src="asset/favoritefolder.svg" alt="folder-icon" class="folder-icon"> 
            <span>${folder}</span>
        `;

        li.addEventListener('click', () => openFavoriteFolder(folder));
        favoritesList.appendChild(li);
    });
}


function openFavoriteFolder(folderName) {
    // Look for the matching folder data
    const folderData = findFolderDataByName(folderName);
    if (folderData) {
        openFolder(folderName, folderData.images, folderData.imgNames);
    } else {
        alert(`Folder "${folderName}" not found.`);
    }
}

// Helper function to find folder data by name
function findFolderDataByName(folderName) {
    for (const year in folderData) {
        for (const folder in folderData[year]) {
            if (folder === folderName) {
                return folderData[year][folder];
            }
        }
    }
    return null; // Folder not found
}

const tagColors = {
    'Gestures': '#FF4C4C',       // Red
    'Group Dynamics': '#FF9F40', // Orange
    'Symbols': '#4CD964',        // Green
    'Actions': '#FFC107'         // Yellow
};


// function populateTags(tags) {
//     const tagsList = document.getElementById('tags');
//     tagsList.innerHTML = '';
//     tags.forEach(tag => {
//         const li = document.createElement('li');
//         li.classList.add('tag-item');
//         const tagColor = tagColors[tag] || '#999'; // Default color if not mapped

//         li.innerHTML = `
//             <span class="tag-circle" style="background-color: ${tagColor};"></span>
//             <span class="tag-text">${tag}</span>
//         `;
//         tagsList.appendChild(li);
//     });
// }

function populateTags(tags) {
    const tagsList = document.getElementById('tags');
    tagsList.innerHTML = '';
    tags.forEach(tag => {
        const li = document.createElement('li');
        li.classList.add('tag-item');
        const tagColor = tagColors[tag] || '#999';

        li.innerHTML = `
            <span class="tag-circle" style="background-color: ${tagColor};"></span>
            <span class="tag-text">${tag}</span>
        `;

        // Click event to filter images
        li.addEventListener('click', () => filterImagesByTag(tag));
        tagsList.appendChild(li);
    });
}


function filterImagesByTag(selectedTag) {
    const filteredImages = [];

    // Loop through all folderData to find images containing the selected tag
    Object.keys(folderData).forEach(year => {
        Object.keys(folderData[year]).forEach(folderName => {
            const folder = folderData[year][folderName];

            // Split tags and match with the selected tag
            const folderTags = folder.description
                ? folder.description.split(';').map(tag => tag.trim().toLowerCase())
                : [];

            // Check for a match (case-insensitive)
            if (folderTags.includes(selectedTag.toLowerCase())) {
                folder.images.forEach((image, index) => {
                    filteredImages.push({
                        image,
                        name: folder.imgNames[index] || "Unnamed",
                        folder: folderName,
                        year: year
                    });
                });
            }
        });
    });

    renderFilteredImages(filteredImages, selectedTag);
}


function renderFilteredImages(images, tag) {
    let modal = document.getElementById('filtered-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'filtered-modal';
        modal.classList.add('modal');
        document.body.appendChild(modal);
    }

    // Display images with their names, folder, and year
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="document.getElementById('filtered-modal').style.display='none'">&times;</span>
            <h2>Images for Tag: "${tag}"</h2>
            <div class="image-gallery">
                ${images.length > 0 ? images.map(img => `
                    <div class="image-item">
                        <img src="${img.image}" alt="${img.name}" 
                             onerror="this.onerror=null; this.src='asset/placeholder.png';">
                        <p>${img.name} (${img.folder}, ${img.year})</p>
                    </div>
                `).join('') : `<p>No images found for this tag.</p>`}
            </div>
        </div>
    `;
    modal.style.display = 'block';
}



// Initialize
populateData();