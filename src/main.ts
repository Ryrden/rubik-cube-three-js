import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(4, 4, 7);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cubeletSize = 1;
const spacing = 0.05;

const faceColors = [
  0xff0000, // Right - Red
  0xffa500, // Left - Orange
  0x0000ff, // Top - Blue
  0x00ff00, // Bottom - Green
  0xffff00, // Front - Yellow
  0xffffff  // Back - White
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
  cubeGroup.rotation.x += 0.01;
  cubeGroup.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
