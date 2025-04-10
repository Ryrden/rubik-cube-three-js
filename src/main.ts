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

type Cubelet = THREE.Mesh & { userData: { initialPosition: THREE.Vector3 } };
const cubelets: Cubelet[] = [];

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      const cubelet = new THREE.Mesh(geometry, materials) as unknown as Cubelet; // NOTE: Type assertion could result some bug here
      const position = new THREE.Vector3(
        x * (cubeletSize + spacing),
        y * (cubeletSize + spacing),
        z * (cubeletSize + spacing)
      );
      cubelet.position.copy(position);
      cubelet.userData.initialPosition = position.clone(); // Save logical position
      cubeGroup.add(cubelet);
      cubelets.push(cubelet);
    }
  }
}


scene.add(cubeGroup);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function rotateTopFaceClockwise() {
  const layerY = Math.max(...cubelets.map(c => c.userData.initialPosition.y));

  const faceGroup = new THREE.Group();
  const selected = cubelets.filter(c =>
    Math.abs(c.userData.initialPosition.y - layerY) < 0.01
  );

  selected.forEach(c => {
    cubeGroup.remove(c);
    faceGroup.add(c);
  });

  scene.add(faceGroup);

  const duration = 500; // ms
  const startTime = performance.now();

  function animateRotation(time: number) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const angle = progress * (Math.PI / 2); // 90° clockwise

    faceGroup.rotation.y = -angle;

    if (progress < 1) {
      requestAnimationFrame(animateRotation);
    } else {
      faceGroup.updateMatrixWorld(true);
      selected.forEach(cubelet => {
        cubelet.applyMatrix4(faceGroup.matrix);
        cubelet.userData.initialPosition.applyMatrix4(faceGroup.matrix);
        faceGroup.remove(cubelet);
        cubeGroup.add(cubelet);
      });

      scene.remove(faceGroup);
    }
  }

  requestAnimationFrame(animateRotation);
}

window.addEventListener('keydown', (e) => {
  if (e.key === 't') { // 't' for top
    rotateTopFaceClockwise();
  }
});


animate();
