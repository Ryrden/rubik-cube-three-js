import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let isRotating = false;
const moveQueue: { axis: 'x' | 'y' | 'z'; value: number; clockwise: boolean }[] = [];

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

const stickerSize = 0.9;
const stickerOffset = cubeletSize / 2 + 0.01; // Slightly above the surface

// Sticker color per face direction
const stickerColors: Record<string, number> = {
  'x+': 0xff0000, // Right  - Red
  'x-': 0xffa500, // Left   - Orange
  'y+': 0x0000ff, // Top    - Blue
  'y-': 0x00ff00, // Bottom - Green
  'z+': 0xffff00, // Front  - Yellow
  'z-': 0xffffff  // Back   - White
};

const stickerGeo = new THREE.PlaneGeometry(stickerSize, stickerSize);

const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      // Skip the hidden center cubelet
      if (x === 0 && y === 0 && z === 0) continue;

      const cubelet = new THREE.Mesh(geometry, darkMaterial) as unknown as Cubelet;
      const position = new THREE.Vector3(
        x * (cubeletSize + spacing),
        y * (cubeletSize + spacing),
        z * (cubeletSize + spacing)
      );

      cubelet.position.copy(position);
      cubelet.userData.initialPosition = position.clone();

      // Add visible stickers depending on outer faces
      const faces: [THREE.Vector3, string][] = [
        [new THREE.Vector3(1, 0, 0), 'x+'],
        [new THREE.Vector3(-1, 0, 0), 'x-'],
        [new THREE.Vector3(0, 1, 0), 'y+'],
        [new THREE.Vector3(0, -1, 0), 'y-'],
        [new THREE.Vector3(0, 0, 1), 'z+'],
        [new THREE.Vector3(0, 0, -1), 'z-']
      ];

      faces.forEach(([normal, label]) => {
        const axis = label[0] as 'x' | 'y' | 'z';
        const sign = label[1] === '+' ? 1 : -1;

        if (Math.round(cubelet.userData.initialPosition[axis]) === sign) {
          const material = new THREE.MeshBasicMaterial({ color: stickerColors[label] });
          const sticker = new THREE.Mesh(stickerGeo, material);
          sticker.position.copy(normal.clone().multiplyScalar(stickerOffset));
          sticker.lookAt(normal);
          cubelet.add(sticker);
        }
      });

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
  if (isRotating) return;
  isRotating = true;

  const layerGroup = new THREE.Group();

  const selected = cubelets.filter(c => {
    const pos = c.userData.initialPosition;
    return Math.round(pos[axis]) === value;
  });

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
      // Finish rotation
      layerGroup.rotation[axis] = angle;
      layerGroup.updateMatrixWorld(true);

      selected.forEach(cubelet => {
        cubelet.applyMatrix4(layerGroup.matrix);
        cubelet.userData.initialPosition.applyMatrix4(layerGroup.matrix);
        layerGroup.remove(cubelet);
        cubeGroup.add(cubelet);
      });

      scene.remove(layerGroup);
      isRotating = false;

      processNextMove();
    }
  }

  requestAnimationFrame(animateRotation);
}



function processNextMove() {
  if (isRotating || moveQueue.length === 0) return;

  const next = moveQueue.shift();
  if (next) {
    rotateFace(next.axis, next.value, next.clockwise);
  }
}

window.addEventListener('keydown', (e) => {
  const isShift = e.shiftKey;
  const clockwise = !isShift;

  let move: { axis: 'x' | 'y' | 'z'; value: number; clockwise: boolean } | null = null;

  switch (e.key.toLowerCase()) {
    case 'w': move = { axis: 'y', value: 1, clockwise }; break;  // U
    case 's': move = { axis: 'y', value: -1, clockwise }; break; // D
    case 'a': move = { axis: 'x', value: -1, clockwise }; break; // L
    case 'd': move = { axis: 'x', value: 1, clockwise }; break;  // R
    case 'q': move = { axis: 'z', value: 1, clockwise }; break;  // F
    case 'e': move = { axis: 'z', value: -1, clockwise }; break; // B
  }

  if (move) {
    moveQueue.push(move);
    processNextMove();
  }
});



animate();
