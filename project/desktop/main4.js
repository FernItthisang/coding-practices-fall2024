const sheetURL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_FkYoX4hOcHbt0_pyiQCg8MYGZ8fRWi97OCOLP0bJaNlFjLlfLiwCVO5fVa_SXRrXRKpI6CX6sQVS/pub?output=csv';



// Fetch data from Google Sheet
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
        const values = row.split(',').map(value => value.trim());
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || ''; // Assign default empty string for missing values
            return obj;
        }, {});
    });
}

const tagColors = {
    'Gestures': '#FF4C4C',       // Red
    'Group Dynamics': '#FF9F40', // Orange
    'Symbols': '#4CD964',        // Green
    'Actions': '#FFC107'         // Yellow
};

// // Parse CSV data
// function parseCSV(csvText) {
//     const rows = csvText.split('\n').filter(row => row.trim());
//     const headers = rows[0].split(',').map(header => header.trim());

//     return rows.slice(1).map(row => {
//         const values = row.split(',');
//         return headers.reduce((obj, header, index) => {
//             obj[header] = values[index]?.trim() || '';
//             return obj;
//         }, {});
//     });
// }

// Populate data into the webpage
let folderData = {}; // Global variable to store folder data
async function populateData() {
    const data = await fetchGoogleSheetData(); // Fetch data from Google Sheets
    folderData = {}; // Reset folder data

    const favorites = [];
    const tags = new Set(); // Collect all unique tags

    // Process each row of data
    data.forEach(item => {
        const year = item.year?.trim();
        const folderName = item.folder?.trim();
        const images = item.image ? [item.image.trim()] : [];
        const imgNames = item.imgname ? [item.imgname.trim()] : ["Unnamed"];

        // Combine tags from multiple columns into an array
        const imageTags = [];
        if (item.tag1) imageTags.push(item.tag1.trim());
        if (item.tag2) imageTags.push(item.tag2.trim());
        if (item.tag3) imageTags.push(item.tag3.trim());
        // Add more tag columns as needed (e.g., tag4, tag5...)

        // Flatten tags before adding to the folderData
        const flattenedTags = imageTags.flat();  // Flatten the tags array if it's nested

        // Ensure folderData[year][folderName] exists
        if (!folderData[year]) folderData[year] = {};
        if (!folderData[year][folderName]) {
            folderData[year][folderName] = {
                images: [],
                imgNames: [],
                tags: [], // Folder-level tags
            };
        }

        // Add images, image names, and tags to the folderData
        folderData[year][folderName].images.push(...images);
        folderData[year][folderName].imgNames.push(...imgNames);
        folderData[year][folderName].tags.push(flattenedTags); // Add flattened tags as arrays

        // Add folder name to favorites
        if (!favorites.includes(folderName)) {
            favorites.push(folderName);
        }

        // Collect all unique tags
        flattenedTags.forEach(tag => tags.add(tag));
    });

    renderFolders(folderData);
    populateFavorites(favorites); // Ensure favorites are populated
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
                    folderData[year][folderName].imgNames,
                    folderData[year][folderName].tags // Pass tags as nested arrays
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

// function openFolder(folderName, images, imgNames, tags = []) {
//     let modal = document.getElementById('modal');
//     if (!modal) {
//         modal = document.createElement('div');
//         modal.id = 'modal';
//         modal.classList.add('modal');
//         document.body.appendChild(modal);
//     }

//     modal.innerHTML = `
//         <div class="modal-content">
//             <span class="close" onclick="document.getElementById('modal').style.display='none'">&times;</span>
//             <h2>${folderName}</h2>
//             <div class="image-gallery">
//                 ${images.map((img, index) => {
//                     const cleanURL = img.trim();
//                     const imageName = imgNames[index] || "Unnamed";
//                     // Ensure tags are always an array
//                     const imageTags = Array.isArray(tags[index]) ? tags[index] : [];

//                     return `
//                         <div class="image-item">
//                             <img src="${cleanURL}" alt="${imageName}" 
//                                 onerror="this.onerror=null; this.src='asset/placeholder.png';">
//                             <p>${imageName}</p>
//                             <div class="image-tags">
//                                 ${imageTags.length > 0
//                                     ? imageTags.map(tag => `
//                                         <span class="tag-circle" style="background-color: ${tagColors[tag] || '#999'};" title="${tag}"></span>
//                                     `).join('')
//                                     : `<span>No Tags</span>`}
//                             </div>
//                         </div>`;
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
            <div class="modal-header">
                <span class="folder-name">${folderName}</span>
                <span class="exit-arrow" onclick="goBackToFolderList()">
                    <img src="asset/arrow.svg" alt="Back to Folder List">
                </span>
            </div>
            <div class="image-gallery">
                ${images.map((img, index) => {
                    const cleanURL = img.trim();
                    const imageName = imgNames[index] || "Unnamed";
                    const imageTags = Array.isArray(tags[index]) ? tags[index] : [];

                    return `
                        <div class="image-item">
                            <img src="${cleanURL}" alt="${imageName}" 
                                 onerror="this.onerror=null; this.src='asset/placeholder.png';">
                            <p>${imageName}</p>
                            <div class="image-tags">
                                ${imageTags.length > 0
                                    ? imageTags.map(tag => `
                                        <span class="tag-circle" style="background-color: ${tagColors[tag] || '#999'};" title="${tag}"></span>
                                    `).join('')
                                    : `<span>No Tags</span>`}
                            </div>
                        </div>`;
                }).join('')}
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

function goBackToFolderList() {
    let modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none'; // Hide the modal when going back
        renderFolders(folderData); // Re-render the folder list
    }
}






function populateFavorites(favorites) {
    const favoritesList = document.getElementById('favorites');
    favoritesList.innerHTML = '';
    
    // Loop through the favorites array to add each favorite folder
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

    // Add a special folder for the Project Information
    const li = document.createElement('li');
    li.classList.add('favorite-item');
    li.innerHTML = `
        <img src="asset/favoritefolder.svg" alt="folder-icon" class="folder-icon"> 
        <span>Project Information</span>
    `;
    li.addEventListener('click', () => openProjectInformation());
    favoritesList.appendChild(li);
}

function openProjectInformation() {
    let modal = document.getElementById('project-information-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'project-information-modal';
        modal.classList.add('modal');
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="document.getElementById('project-information-modal').style.display='none'">&times;</span>
            <div id="modal-illustration">
                <img src="asset/file.svg" alt="Illustration" style="width: 40%; height: auto; cursor: pointer;" onclick="showProjectDetails()"/>
            </div>
            <div id="modal-text" style="text-align: center; font-size: 18px; margin-top: 10px; cursor: pointer;" onclick="showProjectDetails()">Project Information</div>
            <div id="modal-details" style="display: none;">
                <h2>Project Information</h2>
                <p><strong>Project Title:</strong> Voices of Unity: Global Demonstrations for Peace and Solidarity</p>
                <p><strong>Project Overview:</strong> “Voices of Unity” captures the spirit of global protests and collective movements in response to conflicts and social justice issues. It focuses on Ukraine solidarity protests, anti-war messages, and scenes of hope and resistance through dynamic photography.</p>
                <p><strong>Purpose of the Project:</strong> This project aims to amplify calls for peace, justice, and support for Ukraine through powerful imagery.</p>
                <p><strong>Conclusion:</strong> “Voices of Unity” is a testament to the shared humanity of people worldwide, capturing stories of bravery, hope, and the demand for a better future.</p>
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

function showProjectDetails() {
    const illustration = document.getElementById('modal-illustration');
    const text = document.getElementById('modal-text');
    const details = document.getElementById('modal-details');

    illustration.style.display = 'none';  // Hide the illustration
    text.style.display = 'none';  // Hide the "Project Information" text
    details.style.display = 'block';  // Show the project details
}




function openFavoriteFolder(folderName) {
    // Look for the matching folder data
    const folder = findFolderDataByName(folderName);
    if (folder) {
        // Pass the correct data to openFolder
        openFolder(folderName, folder.images, folder.imgNames, folder.tags);
    } else {
        alert(`Folder "${folderName}" not found.`);
    }
}



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

            // Check each image's tags (flattened)
            folder.images.forEach((image, index) => {
                const imageTags = folder.tags[index] || []; // Get tags for the current image
                const imageTagsLower = imageTags.map(tag => tag.toLowerCase());

                // Check if the image contains the selected tag
                if (imageTagsLower.includes(selectedTag.toLowerCase())) {
                    filteredImages.push({
                        image,
                        name: folder.imgNames[index] || "Unnamed",
                        folder: folderName,
                        year: year,
                        tags: imageTags // Store the tags for this image
                    });
                }
            });
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

    // Display images with their names, folder, and year, and their tags as clickable circles
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
                        <div class="image-tags">
                            ${img.tags.map(tag => `
                                <span class="tag-circle" style="background-color: ${tagColors[tag] || '#999'};" title="${tag}" 
                                      onclick="filterImagesByTag('${tag}')"></span>
                            `).join('')}
                        </div>
                    </div>
                `).join('') : `<p>No images found for this tag.</p>`}
            </div>
        </div>
    `;
    modal.style.display = 'block';
}



// Initialize
populateData();