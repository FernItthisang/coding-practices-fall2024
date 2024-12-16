// Sample data for folders and tags
const folderData = [
    { year: "Today", folders: ["Protest_Name1", "Protest_Name2", "Protest_Name3"] },
    { year: "2020", folders: ["Protest_Name4", "Protest_Name5", "Protest_Name6"] }
];

const favorites = [
    "Thai Protest 2020",
    "Hong Kong Protest",
    "Black Matter Protest",
    "Thai Yellow Shirt Protest"
];

const tags = [
    { name: "Gestures", color: "#FF5733" },
    { name: "Group Dynamics", color: "#FFC300" },
    { name: "Symbols", color: "#33FF57" },
    { name: "Actions", color: "#33C7FF" }
];

// Get references to existing elements
const folderContainer = document.getElementById('folders');
const yearElement = folderContainer.querySelector('.year');
const folderGroupElement = folderContainer.querySelector('.folder-group');

// Populate folders based on existing structure
folderData.forEach((group, index) => {
    // Update the year element for the first group
    if (index === 0) {
        yearElement.textContent = group.year;
    } else {
        // Clone the year element for additional groups
        const yearClone = yearElement.cloneNode(true);
        yearClone.textContent = group.year;
        folderContainer.appendChild(yearClone);
    }

    // Update the folder-group for the first group
    if (index === 0) {
        updateFolderGroup(folderGroupElement, group.folders);
    } else {
        // Clone the folder-group for additional groups
        const folderGroupClone = folderGroupElement.cloneNode(true);
        updateFolderGroup(folderGroupClone, group.folders);
        folderContainer.appendChild(folderGroupClone);
    }
});

// Function to update folder-group with folder data
function updateFolderGroup(folderGroup, folders) {
    // Clear existing folder contents
    folderGroup.innerHTML = '';

    folders.forEach((folderName) => {
        const folder = document.createElement('div');
        folder.classList.add('folder');
        folder.innerHTML = `
            <img src="asset/folder.svg" alt="Folder Icon">
            <p>${folderName}</p>
        `;
        folderGroup.appendChild(folder);
    });
}

// Populate favorites
const favoritesList = document.getElementById('favorites');
favorites.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    favoritesList.appendChild(li);
});

// Populate tags
const tagsList = document.getElementById('tags');
tags.forEach((tag) => {
    const li = document.createElement('li');
    li.textContent = tag.name;
    li.style.color = tag.color;
    tagsList.appendChild(li);
});