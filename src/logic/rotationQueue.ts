import * as THREE from 'three';
import { Cubelet } from '../components/cube';

let isRotating = false;
const moveQueue: { axis: 'x' | 'y' | 'z'; value: number; clockwise: boolean }[] = [];
let sceneRef: THREE.Scene;
let cubeGroupRef: THREE.Group;
let cubeletsRef: Cubelet[];

export function setupRotationQueue(
  scene: THREE.Scene,
  cubeGroup: THREE.Group,
  cubelets: Cubelet[]
) {
  sceneRef = scene;
  cubeGroupRef = cubeGroup;
  cubeletsRef = cubelets;
}

export function handleKeyboardInput(e: KeyboardEvent) {
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
}

function processNextMove() {
  if (isRotating || moveQueue.length === 0) return;

  const next = moveQueue.shift();
  if (next) {
    rotateFace(next.axis, next.value, next.clockwise);
  }
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
  const selected = cubeletsRef.filter(c => Math.round(c.userData.initialPosition[axis]) === value);

  selected.forEach(cubelet => {
    cubeGroupRef.remove(cubelet);
    layerGroup.add(cubelet);
  });

  sceneRef.add(layerGroup);

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
        cubeGroupRef.add(cubelet);
      });

      sceneRef.remove(layerGroup);
      isRotating = false;
      processNextMove();
    }
  }

  requestAnimationFrame(animateRotation);
}