// revolvingbox.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube geometry
const geometry = new THREE.BoxGeometry();

// Create a material with 50% transparency
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00, // Green color
    opacity: 0.5,
    transparent: true
});

// Create a mesh with the geometry and material
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create outline material
const outlineMaterial = new THREE.LineBasicMaterial({
    color: 0x000000, // Black color for outline
    linewidth: 2
});

// Create edges geometry and lines
const edges = new THREE.EdgesGeometry(geometry);
const outline = new THREE.LineSegments(edges, outlineMaterial);
scene.add(outline);

// Variables for rotation speed and damping
let rotationSpeed = 0.01;
let targetRotationSpeed = 0.01;
const damping = 0.95; // Factor by which speed is reduced each frame

let mouseMoving = false;

// Function to handle mouse movement
function onMouseMove() {
    mouseMoving = true;
    targetRotationSpeed = 0.01; // Speed when mouse is moving
}

// Function to handle mouse stop
function onMouseStop() {
    mouseMoving = false;
    targetRotationSpeed = 0; // Target speed when mouse stops
}

// Attach event listeners for mouse movements
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseout', onMouseStop); // Optional: handle case when mouse leaves window
window.addEventListener('mousedown', onMouseStop); // Optional: handle case when mouse is pressed

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // Gradually adjust rotation speed
    if (mouseMoving) {
        rotationSpeed = targetRotationSpeed;
    } else {
        rotationSpeed *= damping; // Apply damping to rotation speed
        if (Math.abs(rotationSpeed) < 0.001) {
            rotationSpeed = 0; // Stop rotation when very slow
        }
    }

    // Rotate the cube for some basic animation
    cube.rotation.x += rotationSpeed;
    cube.rotation.y += rotationSpeed;

    renderer.render(scene, camera);
}

animate();

// Handle resizing of the window
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
