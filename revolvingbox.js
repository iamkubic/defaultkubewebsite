// Initialize the scene
const scene = new THREE.Scene();

// Set the background color
scene.background = new THREE.Color('#f8f8f8'); // Light gray background color (same as your website)

// Initialize the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Initialize the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow maps
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows
document.body.appendChild(renderer.domElement);

// Create a cube with a basic material
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({
    color: 0xcccccc, // Lighter gray color to match Blender's default cube
    metalness: 0.5, // Medium metalness for some reflectivity
    roughness: 0.2, // Low roughness for a smoother surface
    transparent: true, // Enable transparency
    opacity: 0.5 // 50% opacity
});
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true; // Allow cube to cast shadows
cube.receiveShadow = true; // Allow cube to receive shadows
scene.add(cube);

// Create a cube outline
const edgesGeometry = new THREE.EdgesGeometry(geometry);
const edgesMaterial = new THREE.LineBasicMaterial({
    color: 0x000000, // Black color for the outline
    linewidth: 1 // Adjust thickness here
});
const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

// Create a group to hold the cube and the outline
const cubeWithOutline = new THREE.Group();
cubeWithOutline.add(cube);
cubeWithOutline.add(edges);
scene.add(cubeWithOutline);

// Add an overhead spot light for soft shadow
const spotLight = new THREE.SpotLight(0xffffff, 1.2); // Slightly brighter light
spotLight.position.set(0, 10, 0); // Positioned directly above the cube
spotLight.castShadow = true; // Enable shadow for the spot light
spotLight.angle = Math.PI / 6; // Wider angle for softer shadows
spotLight.penumbra = 0.3; // Soft edge for the shadow
spotLight.decay = 1; // Light decay
spotLight.distance = 50; // Light distance
spotLight.shadow.mapSize.width = 2048; // Increase shadow map resolution for softer shadows
spotLight.shadow.mapSize.height = 2048; // Increase shadow map resolution for softer shadows
spotLight.shadow.bias = -0.005; // Adjust shadow bias
scene.add(spotLight);

// Add a shadow plane
const planeGeometry = new THREE.PlaneGeometry(10, 10); // Larger plane to catch the shadow
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 }); // Lighter shadow material
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
plane.position.y = -0.1; // Position the plane slightly below the cube
plane.receiveShadow = true; // Allow the plane to receive shadows
scene.add(plane);

// Add Key Light
const keyLight = new THREE.PointLight(0xffffff, 1, 100); // Key light to illuminate the cube
keyLight.position.set(5, 5, 5); // Position it at an angle to the cube
keyLight.castShadow = false; // Do not affect shadows
scene.add(keyLight);

// Add Fill Light
const fillLight = new THREE.PointLight(0xffffff, 0.5, 100); // Fill light to soften shadows
fillLight.position.set(-5, 5, 5); // Position it to fill the shadows from the key light
fillLight.castShadow = false; // Do not affect shadows
scene.add(fillLight);

// Add Back Light
const backLight = new THREE.PointLight(0xffffff, 0.5, 100); // Back light to highlight edges
backLight.position.set(0, -5, -5); // Position it behind and below the cube
backLight.castShadow = false; // Do not affect shadows
scene.add(backLight);

// Randomize rotation speed with moderate values
const rotationSpeed = {
    x: Math.random() * 0.005 + 0.001, // Moderate speed for x-axis
    y: Math.random() * 0.005 + 0.001, // Moderate speed for y-axis
    z: Math.random() * 0.005 + 0.001  // Moderate speed for z-axis
};

// Render the scene with rotation
function render() {
    cubeWithOutline.rotation.x += rotationSpeed.x; // Apply random rotation speed to X-axis
    cubeWithOutline.rotation.y += rotationSpeed.y; // Apply random rotation speed to Y-axis
    cubeWithOutline.rotation.z += rotationSpeed.z; // Apply random rotation speed to Z-axis
    renderer.render(scene, camera);
    requestAnimationFrame(render); // Continue rendering
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render(); // Render after resizing
});

// Start rendering
render();
