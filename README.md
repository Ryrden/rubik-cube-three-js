# Rubik Cube Three.js

![GitHub last commit](https://img.shields.io/github/last-commit/ryrden/rubik-cube-three-js)
![GitHub language count](https://img.shields.io/github/languages/count/ryrden/rubik-cube-three-js)
![Github repo size](https://img.shields.io/github/repo-size/ryrden/rubik-cube-three-js)
![Github stars](https://img.shields.io/github/stars/ryrden/rubik-cube-three-js?style=social)

![rubik-cube-three-js](https://github.com/user-attachments/assets/c137a600-7009-4734-a45f-cb12569ad702)

> Interactive 3D Rubik’s Cube built with Three.js and TypeScript.  
> This project explores spatial visualization, user interaction, and cube-solving logic — created using a “vibe coding” approach.

## Prerequisites

Before you begin, make sure you have the following dependencies installed:

- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (or [pnpm](https://pnpm.io/), [yarn](https://yarnpkg.com/) if you prefer)

## How to run the project

Execute the following commands from the project root folder:

### Clone this repository

```bash
git clone https://github.com/ryrden/rubik-cube-three-js.git
cd rubik-cube-three-js
```

### Install the dependencies

```bash
npm install
```

### Run the project

```bash
npm run dev
```

This starts the Vite development server on http://localhost:5173.

## Folder Structure

```text
/
|-- src/
|   |-- components/       # Reusable rendering logic (e.g., cubelets, stickers)
|   |-- logic/            # Cube state, rotation logic, and future solving algorithm
|   |-- main.ts           # Three.js scene setup and animation loop
|-- public/
|-- index.html
|-- vite.config.ts
|-- tsconfig.json
```

### Description and styles

- `src/components:` 3D objects like cubelets, stickers, groups.

- `src/logic:` Logical representation of cube state, move queue, solver prep.

- `public:` Static assets, like images or icons (optional).

- `main.ts:` Entry point – sets up the scene, camera, renderer, and interaction logic.

### Configurations and CI/CD

- `vite.config.ts:` Vite config for fast bundling and hot-reload.

- `tsconfig.json:` Strict TypeScript setup for reliability.

## How to Use the Cube

The cube can be rotated using the keyboard in classic Rubik's Cube notation:

| Key | Face  | Description              |
| --- | ----- | ------------------------ |
| W   | Up    | Rotates the top layer    |
| S   | Down  | Rotates the bottom layer |
| A   | Left  | Rotates the left layer   |
| D   | Right | Rotates the right layer  |
| Q   | Front | Rotates the front face   |
| E   | Back  | Rotates the back face    |

### 🔄 Rotation Direction

- By default, rotations are **clockwise** (when looking at that face).
- **Hold `Shift`** to rotate **counterclockwise**.

### 🧠 Move Queue

To ensure smooth and accurate animations:

- The cube uses a **queue system** to store key presses.
- Only **one rotation** animates at a time.
- New moves are automatically processed in sequence once the previous rotation finishes.

This approach guarantees that rotations are visually clean, logically consistent, and prevent glitching when pressing multiple keys quickly.

---

With these controls, you can manually test rotations, simulate scrambles, or start building a solver on top of the cube logic.

## How to Contribute

If you want to contribute to this project, follow the steps below:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and confirm them: `git commit -m '<commit_message>'`
4. Send to the original branch: `git push origin <project_name> / <location>`
5. Create the pull request.

Alternatively, consult the GitHub documentation on [how to create a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ryrden">
        <img src="https://github.com/ryrden.png" width="100px">
        <br>
        <sub>
          <b>Ryrden</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

## License

This project is under license. See [LICENSE](LICENSE) for more information.

## Back to the top

[⬆ Back to the top](#rubik-cube-threejs)
