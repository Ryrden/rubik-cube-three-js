import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const size = 1;
const geometry = new THREE.BoxGeometry(size, size, size);

const faceColors = [
  0xff0000, // Right - Red
  0xffa500, // Left  - Orange
  0x0000ff, // Top   - Blue
  0x00ff00, // Bottom - Green
  0xffff00, // Front - Yellow
  0xffffff, // Back  - White
];

// Create one material per face
const materials = faceColors.map(color => new THREE.MeshBasicMaterial({ color }));

const cubelet = new THREE.Mesh(geometry, materials);
scene.add(cubelet);

function animate() {
  requestAnimationFrame(animate);
  cubelet.rotation.x += 0.01;
  cubelet.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
