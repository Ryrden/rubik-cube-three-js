import * as THREE from 'three';

export type Cubelet = THREE.Mesh & { userData: { initialPosition: THREE.Vector3 } };

const cubeletSize = 1;
const spacing = 0.05;
const stickerSize = 0.9;
const stickerOffset = cubeletSize / 2 + 0.01;

const stickerColors: Record<string, number> = {
  'x+': 0xff0000, // Right
  'x-': 0xffa500, // Left
  'y+': 0x0000ff, // Top
  'y-': 0x00ff00, // Bottom
  'z+': 0xffff00, // Front
  'z-': 0xffffff  // Back
};

export function createCube(): {
  cubeGroup: THREE.Group;
  cubelets: Cubelet[];
} {
  const cubeGroup = new THREE.Group();
  const cubelets: Cubelet[] = [];

  const geometry = new THREE.BoxGeometry(cubeletSize, cubeletSize, cubeletSize);
  const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const stickerGeo = new THREE.PlaneGeometry(stickerSize, stickerSize);

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue; // Skip center

        const cubelet = new THREE.Mesh(geometry, darkMaterial) as unknown as Cubelet;
        const position = new THREE.Vector3(
          x * (cubeletSize + spacing),
          y * (cubeletSize + spacing),
          z * (cubeletSize + spacing)
        );

        cubelet.position.copy(position);
        cubelet.userData.initialPosition = position.clone();

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

  return { cubeGroup, cubelets };
}