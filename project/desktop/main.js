const sheetURL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_FkYoX4hOcHbt0_pyiQCg8MYGZ8fRWi97OCOLP0bJaNlFjLlfLiwCVO5fVa_SXRrXRKpI6CX6sQVS/pub?output=csv';

let folderData = {}; // Global variable to store folder data

const tagColors = {
    'Gestures': '#FF4C4C',       // Red
    'Group Dynamics': '#FF9F40', // Orange
    'Symbols': '#4CD964',        // Green
    'Actions': '#FFC107'         // Yellow
};

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

        // Split tags into arrays for each image
        const imageTags = item.tags
            ? item.tags.split(';').map(tag => tag.trim())
            : []; // Default to empty array if no tags exist

        // Ensure folderData[year] exists before accessing folderData[year][folderName]
        if (!folderData[year]) folderData[year] = {};
        if (!folderData[year][folderName]) {
            folderData[year][folderName] = {
                description: item.tags || '',
                images: [],
                imgNames: [],
                tags: [], // Initialize tags as an array of arrays
            };
        }

        // Add images, names, and tags to folderData
        folderData[year][folderName].images.push(...images);
        folderData[year][folderName].imgNames.push(...imgNames);

        images.forEach((_, idx) => {
            folderData[year][folderName].tags.push([imageTags[idx] || "No Tag"]);
        });

        // Add global tags for filtering
        imageTags.forEach(tag => tags.add(tag));
    });

    renderFolders(folderData);
    populateFavorites(favorites);
    populateTags(tags);
}


// Render folders
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
                openFolder(folderData[year][folderName], folderName)
            );
            folderGroupDiv.appendChild(folderDiv);
        });

        folderContainer.appendChild(yearDiv);
        folderContainer.appendChild(folderGroupDiv);
    });
}

// Open folder and display images
function openFolder(folder, folderName) {
    let modal = document.getElementById('modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal';
        modal.classList.add('modal');
        document.body.appendChild(modal);
    }

    const images = folder.images || [];
    const imgNames = folder.imgNames || [];
    const tags = folder.tags || []; // Ensure tags is an array of arrays

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="document.getElementById('modal').style.display='none'">&times;</span>
            <h2>${folderName}</h2>
            <div class="image-gallery">
                ${images.map((image, idx) => `
                    <div class="image-item">
                        <img src="${image}" alt="${imgNames[idx]}" onerror="this.src='asset/placeholder.png';">
                        <p>${imgNames[idx]}</p>
                        <div class="image-tags">
                            ${(Array.isArray(tags[idx]) ? tags[idx] : []).map((tag, tagIdx) => `
                                <span class="tag-circle" style="
                                    background-color: ${tagColors[tag] || '#ccc'};
                                    z-index: ${tags[idx].length - tagIdx};
                                    left: ${tagIdx * 8}px;
                                "></span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
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

// Open favorite folder
function openFavoriteFolder(folderName) {
    let selectedFolder = null;

    Object.keys(folderData).forEach(year => {
        if (folderData[year][folderName]) {
            selectedFolder = folderData[year][folderName]; // Select the correct folder object
        }
    });

    if (selectedFolder) {
        openFolder(selectedFolder, folderName); // Pass the folder object
    } else {
        alert('Favorite folder not found!');
    }
}


// Render favorite folders
function renderFavorites() {
    const favoritesList = document.getElementById('favorites');
    favoritesList.innerHTML = '';
    favoriteFolders.forEach(folder => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="asset/favoritefolder.svg" alt="Favorite Folder" class="folder-icon">
            <span>${folder}</span>
        `;
        li.addEventListener('click', () => alert(`Favorite Folder: ${folder}`));
        favoritesList.appendChild(li);
    });
}

// Populate tags
function populateTags(tags) {
    const tagsList = document.getElementById('tags');
    tagsList.innerHTML = '';
    tags.forEach(tag => {
        const li = document.createElement('li');
        li.classList.add('tag-item');
        li.innerHTML = `
            <span class="tag-circle" style="background-color: ${tagColors[tag] || '#999'};"></span>
            ${tag}
        `;
        li.addEventListener('click', () => filterImagesByTag(tag));
        tagsList.appendChild(li);
    });
}

// Filter images by tag
function filterImagesByTag(tag) {
    let modal = document.getElementById('modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal';
        modal.classList.add('modal');
        document.body.appendChild(modal);
    }

    const filteredImages = [];
    Object.keys(folderData).forEach(year => {
        Object.keys(folderData[year]).forEach(folderName => {
            folderData[year][folderName].forEach(item => {
                if (item.tags.includes(tag)) {
                    filteredImages.push(item);
                }
            });
        });
    });

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="document.getElementById('modal').style.display='none'">&times;</span>
            <h2>Images for Tag: ${tag}</h2>
            <div class="image-gallery">
                ${filteredImages.map(item => `
                    <div class="image-item">
                        <img src="${item.image}" alt="${item.imgName}" onerror="this.src='asset/placeholder.png';">
                        <p>${item.imgName}</p>
                        <div class="image-tags">
                            ${item.tags.map((t, idx) => `
                                <span class="tag-circle" style="
                                    background-color: ${tagColors[t] || '#ccc'};
                                    z-index: ${item.tags.length - idx};
                                    left: ${idx * 8}px;
                                "></span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

// Initialize data
populateData();