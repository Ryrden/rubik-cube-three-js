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

function rotateFace(
  axis: 'x' | 'y' | 'z',
  value: number,
  clockwise: boolean = true,
  duration: number = 300
) {

  const layerGroup = new THREE.Group();

  const selected = cubelets.filter(c => {
    const pos = c.userData.initialPosition;
    const rounded = Math.round(pos[axis]);
    const match = rounded === value;
    return match;
  });

  if (selected.length !== 9) {
    console.warn(`⚠️ Expected 9 cubelets but found ${selected.length}. Check layer selection logic.`);
  }

  selected.forEach(cubelet => {
    cubeGroup.remove(cubelet);
    layerGroup.add(cubelet);
  });

  scene.add(layerGroup);

  const startTime = performance.now();
  const angle = (Math.PI / 2) * (clockwise ? 1 : -1);


  function animateRotation(now: number) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const currentAngle = angle * t;

    layerGroup.rotation.set(0, 0, 0);
    layerGroup.rotation[axis] = currentAngle;

    if (t < 1) {
      requestAnimationFrame(animateRotation);
    } else {

      layerGroup.rotation[axis] = angle;
      layerGroup.updateMatrixWorld(true);

      selected.forEach(cubelet => {
        cubelet.applyMatrix4(layerGroup.matrix);
        cubelet.userData.initialPosition.applyMatrix4(layerGroup.matrix);
        layerGroup.remove(cubelet);
        cubeGroup.add(cubelet);

      });

      scene.remove(layerGroup);
    }
  }

  requestAnimationFrame(animateRotation);
}


window.addEventListener('keydown', (e) => {
  const isShift = e.shiftKey;

  switch (e.key.toLowerCase()) {
    case 'w': // U
      rotateFace('y', 1, !isShift);
      break;
    case 's': // D
      rotateFace('y', -1, !isShift);
      break;
    case 'a': // L
      rotateFace('x', -1, !isShift);
      break;
    case 'd': // R
      rotateFace('x', 1, !isShift);
      break;
    case 'q': // F
      rotateFace('z', 1, !isShift);
      break;
    case 'e': // B
      rotateFace('z', -1, !isShift);
      break;
  }
});


animate();
