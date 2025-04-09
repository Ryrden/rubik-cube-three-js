import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(4, 4, 7);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;

const cubeletSize = 1;
const spacing = 0.05;

const faceColors = [
  0xff0000, // Right
  0xffa500, // Left
  0x0000ff, // Top
  0x00ff00, // Bottom
  0xffff00, // Front
  0xffffff  // Back
];

const geometry = new THREE.BoxGeometry(cubeletSize, cubeletSize, cubeletSize);
const materials = faceColors.map(color => new THREE.MeshBasicMaterial({ color }));

const cubeGroup = new THREE.Group();

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      const cubelet = new THREE.Mesh(geometry, materials);
      cubelet.position.set(
        x * (cubeletSize + spacing),
        y * (cubeletSize + spacing),
        z * (cubeletSize + spacing)
      );
      cubeGroup.add(cubelet);
    }
  }
}

scene.add(cubeGroup);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
