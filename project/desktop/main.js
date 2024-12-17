const sheetURL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_FkYoX4hOcHbt0_pyiQCg8MYGZ8fRWi97OCOLP0bJaNlFjLlfLiwCVO5fVa_SXRrXRKpI6CX6sQVS/pub?output=csv';

const tagColors = {
    'Gestures': '#FF4C4C',
    'Group Dynamics': '#FF9F40',
    'Symbols': '#4CD964',
    'Actions': '#FFC107'
};

let folderData = {}; 

// Variable to track current view mode
let currentView = 'gallery'; // 'gallery' or 'icon'

async function fetchGoogleSheetData() {
    const response = await fetch(sheetURL);
    const csvText = await response.text();
    return parseCSV(csvText);
}

function parseCSV(csvText) {
    const rows = csvText.split('\n').filter(row => row.trim());
    const headers = rows[0].split(',').map(header => header.trim());

    return rows.slice(1).map(row => {
        const values = row.split(',').map(value => value.trim());
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
        }, {});
    });
}

async function populateData() {
    const data = await fetchGoogleSheetData();
    folderData = {};
    const tags = new Set();

    // Process data
    data.forEach(item => {
        const year = item.year?.trim();
        const folderName = item.folder?.trim();
        const description = item.description?.trim();
        const images = item.image ? [item.image.trim()] : [];
        const imgNames = item.imgname ? [item.imgname.trim()] : ["Unnamed"];
        const imageTags = [item.tag1, item.tag2, item.tag3].filter(Boolean).map(tag => tag.trim());

        if (!folderData[year]) folderData[year] = {};
        if (!folderData[year][folderName]) {
            folderData[year][folderName] = { images: [], imgNames: [], descriptions: [], tags: [] };
        }

        folderData[year][folderName].images.push(...images);
        folderData[year][folderName].imgNames.push(...imgNames);
        folderData[year][folderName].descriptions.push(description);
        folderData[year][folderName].tags.push(imageTags);

        imageTags.forEach(tag => tags.add(tag));
    });

    // Render elements
    renderFolders(folderData);
    populateTags(tags);
    populateFavorites();

    // Default active folder
    highlightActiveFolder('Documenting Global Protest Symbols');
    goBackToHome();
}


function renderFolders(folderData) {
    const folderContainer = document.getElementById('folders');
    folderContainer.innerHTML = '';

    Object.keys(folderData).forEach(year => {
        // Create Year Container
        const yearDiv = document.createElement('div');
        yearDiv.classList.add('year-container');

        // Year Header
        const yearHeader = document.createElement('h3');
        yearHeader.classList.add('year-header');
        yearHeader.textContent = year;

        // Divider
        const divider = document.createElement('hr');
        divider.classList.add('year-divider');

        // Folder Row Container
        const foldersRow = document.createElement('div');
        foldersRow.classList.add('folders-row');

        Object.keys(folderData[year]).forEach(folderName => {
            const folderDiv = document.createElement('div');
            folderDiv.classList.add('folder');
            folderDiv.innerHTML = `
                <img src="asset/folder.svg" alt="${folderName}">
                <p>${folderName}</p>
            `;
            folderDiv.addEventListener('click', () => {
                updateMainContent(folderName, folderData[year][folderName]);
                highlightActiveFolder(folderName);
            });
            foldersRow.appendChild(folderDiv);
        });

        // Append Header, Divider, and Folders Row to Year Container
        yearDiv.appendChild(yearHeader);
        yearDiv.appendChild(foldersRow);
        yearDiv.appendChild(divider);

        // Append Year Container to Main Folder Container
        folderContainer.appendChild(yearDiv);
    });
}


function updateMainContent(folderName, folderDetails) {
    const mainContent = document.getElementById('main-content');
    const topright = document.getElementById('topright');
    mainContent.style.display = 'block';
    document.getElementById('folders').style.display = 'none';

    // Update the header without inline onclick
    topright.innerHTML = `
        <div class="main-header" style="display: flex; align-items: center; gap: 10px;">
            <div class="svg-button" id="back-btn" style="cursor: pointer;">
                <img src="asset/arrow.svg" alt="Back" class="button-icon">
            </div>
            <h2 style="margin: 0;">${folderName}</h2>
        </div>
    `;

    // Clear the main content and render images
    mainContent.innerHTML = `
        <div class="image-gallery" id="image-gallery"></div>
    `;

    // Attach the event listener for the back button
    document.getElementById('back-btn').addEventListener('click', () => {
        document.getElementById('folders').style.display = 'block';
        mainContent.style.display = 'none';
        topright.innerHTML = `<h2>Documenting Global Protest Symbols</h2>`;
    });

    const imageGallery = document.getElementById('image-gallery');
    folderDetails.images.forEach((img, index) => {
        const tagCircles = folderDetails.tags[index]
            .map(tag => `<span class="tag-circle" style="background-color: ${tagColors[tag] || '#999'};"></span>`)
            .join('');

        const imageItem = document.createElement('div');
        imageItem.classList.add('image-item');

        imageItem.innerHTML = `
            <img src="${img}" alt="${folderDetails.imgNames[index] || 'Unnamed'}" style="max-width: 150px; height: auto;">
            <p>${folderDetails.imgNames[index] || 'Unnamed'}</p>
            <div class="image-tags">${tagCircles}</div>
        `;

        // Attach click event listener
        imageItem.addEventListener('click', () => {
            showImageDetail(img, folderDetails, index, folderName, Object.keys(folderData).find(y => folderData[y][folderName]));
        });

        imageGallery.appendChild(imageItem);
    });
}


function goBackToHome() {
    document.getElementById('folders').style.display = 'block';
    document.getElementById('main-content').style.display = 'none';

    const topright = document.getElementById('topright');
    topright.innerHTML = `<h2>Documenting Global Protest Symbols</h2>`;
    highlightActiveFolder('Home');
}

function highlightActiveFolder(activeFolderName) {
    // Clear all active tags
    document.querySelectorAll('#tags .tag-item').forEach(item => {
        item.classList.remove('active-tab');
    });

    // Highlight the selected folder
    document.querySelectorAll('#favorites .favorite-item').forEach(item => {
        const folderText = item.querySelector('span').textContent.trim();
        if (folderText === activeFolderName) {
            item.classList.add('active-tab');
        } else {
            item.classList.remove('active-tab');
        }
    });
}

function highlightActiveTag(activeTag) {
    // Clear active state in favorites
    document.querySelectorAll('#favorites .favorite-item').forEach(item => {
        item.classList.remove('active-tab');
    });

    // Highlight the selected tag
    document.querySelectorAll('#tags .tag-item').forEach(item => {
        const tagText = item.querySelector('.tag-text').textContent.trim();
        if (tagText === activeTag) {
            item.classList.add('active-tab');
        } else {
            item.classList.remove('active-tab');
        }
    });
}

function populateFavorites() {
    const favoritesList = document.getElementById('favorites');
    favoritesList.innerHTML = '';

    // Add Home Item (Default Selected)
    const homeItem = document.createElement('li');
    homeItem.classList.add('favorite-item', 'active-tab'); // Set as active by default
    homeItem.innerHTML = `
        <img src="asset/favoritefolder.svg" alt="Home">
        <span>Documenting Global Protest Symbols</span>
    `;
    homeItem.addEventListener('click', () => {
        goBackToHome();
        highlightActiveFolder('Documenting Global Protest Symbols');
    });
    favoritesList.appendChild(homeItem);

    // Add Project Information Folder
    const projectInfoItem = document.createElement('li');
    projectInfoItem.classList.add('favorite-item');
    projectInfoItem.innerHTML = `
        <img src="asset/document.svg" alt="Project Information">
        <span>Project Information</span>
    `;
    projectInfoItem.addEventListener('click', () => {
        showProjectInformation();
        highlightActiveFolder('Project Information');
    });
    favoritesList.appendChild(projectInfoItem);

    // Dynamically Populate Other Folders
    Object.keys(folderData).forEach(year => {
        Object.keys(folderData[year]).forEach(folderName => {
            const li = document.createElement('li');
            li.classList.add('favorite-item');
            li.innerHTML = `
                <img src="asset/favoritefolder.svg" alt="folder-icon">
                <span>${folderName}</span>
            `;
            li.addEventListener('click', () => {
                updateMainContent(folderName, folderData[year][folderName]);
                highlightActiveFolder(folderName);
            });
            favoritesList.appendChild(li);
        });
    });
}


function showProjectInformation() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('folders').style.display = 'none';
    mainContent.style.display = 'block';

    const topright = document.getElementById('topright');
    topright.innerHTML = `
        <div class="main-header" style="display: flex; align-items: center; gap: 10px;">
            <div class="svg-button" onclick="goBackToHome()">
                <img src="asset/arrow.svg" alt="Back" class="button-icon">
            </div>
            <h2 style="margin: 0;">Project Information</h2>
        </div>
    `;

    // Display only the clickable icon initially
    mainContent.innerHTML = `
        <div id="project-icon-container" style="text-align: center; margin-top: 50px; cursor: pointer;">
            <img src="asset/info.svg" alt="Project Icon" style="width: 100px; height: 100px;" id="project-info-icon">
            <p style="font-size: 1rem; color: #555;">Click to view Project Information</p>
        </div>
    `;

    // Add click event listener to show the detailed project information
    document.getElementById('project-info-icon').addEventListener('click', () => {
        displayProjectDetails();
    });
}

// Function to display the detailed project information
function displayProjectDetails() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div style="padding: 20px; line-height: 1.6; font-size: 1rem;">
            <h2>Documenting Protest Symbols: Visual Codes and Predicting Solidarity</h2>
            <p>
                This project critically examines the <strong>Visual Codes of Protest</strong>, analyzing how symbols, gestures, actions, and group dynamics express solidarity in global protest movements. 
                Using a carefully designed ontology, the project identifies and categorizes visual markers that signify collective resistance, unity, and protection within specific socio-political contexts.
            </p>

            <h3>The project focuses on four key components of protest visuals:</h3>
            <ul>
                <li><strong>Gestures:</strong> Raised fists, interlocked arms, hands held in unity.</li>
                <li><strong>Symbols:</strong> National flags, protest icons, and slogans displayed on banners or signs.</li>
                <li><strong>Actions:</strong> Chaining oneself, kneeling, and synchronized marching.</li>
                <li><strong>Group Dynamics:</strong> Crowds gathered under banners, human chains, and coordinated attire.</li>
            </ul>

            <p>
                Images sourced from movements like the <strong>Umbrella Movement</strong> (Hong Kong), <strong>Black Lives Matter</strong> (United States), and <strong>Red Shirt Protests</strong> (Thailand) 
                are annotated to highlight these markers and their relationships.
            </p>

            <p>
                The project uses a relational ontology to move beyond static visual recognition, focusing on how elements interact to predict solidarity. 
                For example, raised fists combined with banners signify resistance, while human chains and synchronized movements emphasize unity and protection.
            </p>

            <p>
                Through this exploration, the project underscores how solidarity emerges as a universal <strong>“grammar of resistance”</strong>, weaving together shared struggles across borders. 
                The outputs provide insights into the emotional and visual power of protest imagery, revealing patterns that inspire courage and foster collective action.
            </p>
        </div>
    `;
}


function populateTags(tags) {
    const tagsList = document.getElementById('tags');
    tagsList.innerHTML = '';

    tags.forEach(tag => {
        const li = document.createElement('li');
        li.classList.add('tag-item');
        li.innerHTML = `
            <span class="tag-circle" style="background-color: ${tagColors[tag] || '#999'};"></span>
            <span class="tag-text">${tag}</span>
        `;
        li.addEventListener('click', () => {
            filterImagesByTag(tag);
        });
        tagsList.appendChild(li);
    });
}


function filterImagesByTag(selectedTag) {
    const filteredImages = [];

    // Collect images matching the selected tag
    Object.keys(folderData).forEach(year => {
        Object.keys(folderData[year]).forEach(folderName => {
            const folder = folderData[year][folderName];
            folder.images.forEach((image, index) => {
                if (folder.tags[index]?.includes(selectedTag)) {
                    filteredImages.push({
                        image,
                        name: folder.imgNames[index] || "Unnamed",
                        tags: folder.tags[index] || [],
                        description: folder.descriptions[index] || "No description",
                        folder: folderName,
                        year: year,
                        folderDetails: folder,
                        selectedIndex: index
                    });
                }
            });
        });
    });

    // Update the header to show the selected tag
    const topright = document.getElementById('topright');
    topright.innerHTML = `
        <div class="main-header" style="display: flex; align-items: center; gap: 10px;">
            <div class="svg-button" onclick="goBackToHome()">
                <img src="asset/arrow.svg" alt="Back" class="button-icon">
            </div>
            <h2 style="margin: 0;">${selectedTag}</h2>
        </div>
    `;

    // Update main content to display filtered images
    const mainContent = document.getElementById('main-content');
    document.getElementById('folders').style.display = 'none';
    mainContent.style.display = 'block';

    mainContent.innerHTML = `
        <div class="image-gallery" id="image-gallery">
            ${filteredImages.length > 0
                ? filteredImages.map((img, index) => {
                    const tagCircles = img.tags.map(tag => `
                        <span class="tag-circle" style="background-color: ${tagColors[tag] || '#999'};"></span>
                    `).join('');
                    return `
                        <div class="image-item" data-index="${index}" style="text-align: center; cursor: pointer;">
                            <img src="${img.image}" alt="${img.name}" onerror="this.src='asset/placeholder.png';" 
                                style="max-width: 150px; height: auto; object-fit: contain;">
                            <p>${img.name} (${img.folder}, ${img.year})</p>
                            <div class="image-tags" style="display: flex; justify-content: center; gap: 5px;">
                                ${tagCircles}
                            </div>
                        </div>
                    `;
                }).join('')
                : `<p>No images found for this tag.</p>`}
        </div>
    `;

    // Attach click events to open image details
    document.querySelectorAll('.image-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            const imgData = filteredImages[index];
            showImageDetail(
                imgData.image, 
                imgData.folderDetails, 
                imgData.selectedIndex, 
                imgData.folder, 
                imgData.year
            );
        });
    });

    // Highlight the selected tag and clear favorites
    highlightActiveTag(selectedTag);
}


function showImageDetail(selectedImage, folderDetails, selectedIndex, folderName, year) {
    const mainContent = document.getElementById('main-content');
    document.getElementById('folders').style.display = 'none';

    // Fetch metadata for the selected image
    const selectedImageName = folderDetails.imgNames[selectedIndex] || 'Unnamed';
    const selectedImageTags = folderDetails.tags[selectedIndex] || [];
    const description = folderDetails.descriptions[selectedIndex] || 'No description';

    const tagCircles = selectedImageTags.map(tag => `
        <span class="tag-circle" style="background-color: ${tagColors[tag] || '#999'};"></span>
    `).join('');

    // Render main content
    mainContent.innerHTML = `
        <div class="image-detail-container">
            <div class="detail-header" id="back-container"></div>
            <div class="image-detail">
                <img id="current-image" src="${selectedImage}" alt="${selectedImageName}" style="width: 100%; max-height: 80vh; object-fit: contain;">
                <div class="image-metadata">
                    <h2>${selectedImageName}</h2>
                    <p><strong>Description:</strong> ${description}</p>
                    <p><strong>Year:</strong> ${year}</p>
                    <p><strong>Folder:</strong> ${folderName}</p>
                    <p><strong>Tags:</strong> ${tagCircles || 'No Tags'}</p>
                </div>
            </div>
            <div class="image-gallery bottom-gallery" style="display: flex; overflow-x: scroll; gap: 10px; padding-bottom: 10px;">
                ${folderDetails.images.map((img, index) => `
                    <div class="image-item2 ${index === selectedIndex ? 'active-image' : ''}" data-index="${index}" style="cursor: pointer;">
                        <img src="${img}" alt="${folderDetails.imgNames[index] || 'Other Image'}" style="max-width: 150px; height: auto; object-fit: cover;">
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Use reusable back button
    const backContainer = document.getElementById('back-container');
    backContainer.appendChild(createBackButton(() => updateMainContent(folderName, folderDetails)));

    // Attach events for other images
    document.querySelectorAll('.image-item2').forEach(item => {
        item.addEventListener('click', () => {
            const newIndex = parseInt(item.getAttribute('data-index'));
            showImageDetail(folderDetails.images[newIndex], folderDetails, newIndex, folderName, year);
        });
    });
}
function createBackButton(callback) {
    const backButton = document.createElement('button');
    backButton.classList.add('back-button');

    // Add the SVG as an <img> element
    const backIcon = document.createElement('img');
    backIcon.src = 'asset/arrow_back_ios.svg'; // Replace with your SVG file path
    backIcon.style.width = '24px'; // Adjust size as needed
    backIcon.style.height = '24px';
    backIcon.style.border = 'none';


    // Append the icon and add functionality
    backButton.appendChild(backIcon);
    backButton.addEventListener('click', callback);

    return backButton;
}


populateData();