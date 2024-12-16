import * as THREE from 'three';

const container = document.querySelector('#scene-container');

/*
  ===== GLOBAL VARIABLES
*/
const WIDTH = container.clientWidth;
const HEIGHT = container.clientHeight;

const FOV = 50; // Narrower FOV for isometric effect
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 1000;

/*
  ===== SCENE
*/
const scene = new THREE.Scene();
scene.background = new THREE.Color(	0xffffff); // Black background

/*
  ===== CAMERA
*/
const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
camera.position.set(10, 10, 10); // Position for isometric effect
camera.lookAt(0, 0, 0);

/*
  ===== RENDERER
*/
const renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);


/*
  ===== FOLDER DATA
*/
const folderColors = [0xffeb3b, 0x03a9f4, 0x8bc34a, 0xff5722, 0xe91e63]; // Yellow, Blue, Green, Orange, Pink

folderColors.forEach((color, index) => {
  // Create the folder body
  const folderBodyGeometry = new THREE.BoxGeometry(5, 3, 0.1); // Adjust dimensions as needed
  const folderBodyMaterial = new THREE.MeshLambertMaterial({ color });
  const folderBody = new THREE.Mesh(folderBodyGeometry, folderBodyMaterial);

  // Create the folder tab
  const tabGeometry = new THREE.BoxGeometry(1.5, 0.5, 0.1); // Smaller rectangle for the tab
  const tabMaterial = new THREE.MeshLambertMaterial({ color });
  const folderTab = new THREE.Mesh(tabGeometry, tabMaterial);

  // Position the tab slightly above the body
  folderTab.position.set(-1.7, 1.5, 0); // Adjust as needed
  folderBody.add(folderTab); // Attach tab to the body

  // Arrange folders in a staggered, fanned-out layout
  folderBody.position.set(index * 1.2, 0, index,0); // Offset for staggered effect
  folderBody.rotation.set(0, Math.PI / 4, 0); // 45 degrees rotation for isometric look

  // Add folders to the scene
  scene.add(folderBody);
});

/*
  ===== LIGHTING
*/
const ambientLight = new THREE.AmbientLight('white', 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

/*
  ===== ANIMATION LOOP
*/
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();