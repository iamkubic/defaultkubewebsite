// revolvingbox.js
// Assuming you've already set up a basic Three.js scene with camera and renderer

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
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

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube for some basic animation
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();

// Handle resizing of the window
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
