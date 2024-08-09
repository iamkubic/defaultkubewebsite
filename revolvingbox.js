// Basic setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xf8f8f8); // Light gray background color
document.body.appendChild(renderer.domElement);

// Create a smaller cube with basic material
const geometry = new THREE.BoxGeometry(1, 1, 1); // Size reduced to 1x1x1
const material = new THREE.MeshBasicMaterial({
    color: 0xbfbfbf, // Gray color (Blender default cube color)
    wireframe: false // No wireframe for solid appearance
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create and add black edges for the cube
const edgesGeometry = new THREE.EdgesGeometry(geometry);
const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }); // Black edges
const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
scene.add(edges);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0x404040); // Ambient light with a soft white color
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White directional light
directionalLight.position.set(5, 5, 5).normalize(); // Position the light
scene.add(directionalLight);

// Position the camera
camera.position.z = 5;

// Randomize cube rotation
function randomizeRotation() {
    cube.rotation.x = Math.random() * Math.PI * 2;
    cube.rotation.y = Math.random() * Math.PI * 2;
    cube.rotation.z = Math.random() * Math.PI * 2;
}
randomizeRotation(); // Initialize with random rotation

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Slow down the rotation
    cube.rotation.x += 0.003;
    cube.rotation.y += 0.003;

    // Update edges with the same rotation
    edges.rotation.x = cube.rotation.x;
    edges.rotation.y = cube.rotation.y;

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Start the animation
animate();
