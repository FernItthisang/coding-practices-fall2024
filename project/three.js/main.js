console.log('this file is loaded');

import * as THREE from 'three';
// addons
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// debugging
import datgui from 'https://cdn.jsdelivr.net/npm/dat.gui@0.7.9/+esm';
import statsJs from 'https://cdn.jsdelivr.net/npm/stats-js@1.0.1/+esm';

const stats = new statsJs();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Get a reference to the container that will hold the scene
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
  ===== TAPE DATA
*/
const tapesData = [
  { label: 'Mixtape #20', artist: 'Laurie Anderson', year: 1982 },
  { label: 'Mixtape #21', artist: 'Philip Glass', year: 1983 },
  { label: 'Mixtape #22', artist: 'Debussy', year: 1884 },
];

/*
  ===== GEOMETRY -> CASSETTE TAPES
*/
tapesData.forEach((data, index) => {
  // Create tape geometry
  const tapeGeometry = new THREE.BoxGeometry(4, 2, 0.2);

  // Create tape material
  const tapeMaterial = new THREE.MeshLambertMaterial({ color: 0x8f6d2e });

  // Create tape mesh
  const tape = new THREE.Mesh(tapeGeometry, tapeMaterial);

  // Position tapes in a staggered layout
  tape.position.set(index * 5, 0, index * -2);

  // Rotate tapes slightly for an isometric effect
  tape.rotation.set(0, Math.PI / 4, 0); // 45 degrees on the Y-axis

  // Add label to the tape
  const tapeLabel = createTapeLabel(data.label, data.artist, data.year);
  tape.add(tapeLabel);

  // Add tape to the scene
  scene.add(tape);
});

// Function to create a text label for the tape
function createTapeLabel(label, artist, year) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 128;

  // Draw the label on the canvas
  context.fillStyle = '#fff'; // white background
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#000'; // black text
  context.font = '20px Arial';
  context.fillText(label, 10, 40);
  context.fillText(artist, 10, 80);
  context.fillText(year, 10, 120);

  // Create a texture from the canvas
  const texture = new THREE.CanvasTexture(canvas);
  const labelMaterial = new THREE.MeshBasicMaterial({ map: texture });

  // Create a plane geometry for the label
  const labelGeometry = new THREE.PlaneGeometry(4, 2);

  // Create a mesh with the label
  const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);

  // Position the label on the front face of the tape
  labelMesh.position.set(0, 0, 0.11); // Slightly in front of the tape

  return labelMesh;
}

/*
  ===== LIGHTING
*/
const ambientLight = new THREE.AmbientLight('white', 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

/*
  ===== ORBIT CONTROLS (Optional)
*/
// Allows you to orbit, zoom, and pan the scene
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth controls
controls.target.set(0, 0, 0);
controls.update();

/*
  ===== ANIMATION LOOP
*/
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  stats.update();
}

animate();