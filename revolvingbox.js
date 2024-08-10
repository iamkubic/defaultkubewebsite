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
    wireframe: false, // No wireframe for solid appearance
    transparent: true, // Enable transparency
    opacity: 0.5 // Set opacity to 50%
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create and add bold black edges for the cube
const edgesGeometry = new THREE.EdgesGeometry(geometry);
const edgesMaterial = new THREE.LineBasicMaterial({
    color: 0x000000, // Black edges
    linewidth: 5, // Increase the line width to make edges bold
});
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

let mouseMoved = false;
let mouseMoveTimeout;
let autoRotateEnabled = true;

// Ramp up and ramp down parameters
let rotationSpeed = 0.003;
const maxRotationSpeed = 0.003;
const acceleration = 0.0001; // Speed increase per frame when ramping up
const deceleration = 0.0002; // Speed decrease per frame when ramping down

// Parallax effect
document.addEventListener('mousemove', (event) => {
    const { clientX, clientY } = event;
    mouseMoved = true;

    // Clear any previous timeout
    clearTimeout(mouseMoveTimeout);

    // Calculate the mouse position relative to the center of the screen
    const mouseX = (clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(clientY / window.innerHeight) * 2 + 1;

    // Apply the parallax effect by adjusting the cube's rotation
    cube.rotation.x += mouseY * 0.02;
    cube.rotation.y += mouseX * 0.02;

    // Update edges with the same rotation
    edges.rotation.x = cube.rotation.x;
    edges.rotation.y = cube.rotation.y;

    // Set a timeout to resume automatic rotation after mouse stops moving
    mouseMoveTimeout = setTimeout(() => {
        mouseMoved = false;
    }, 1000); // 1 second after mouse stops moving
});

// Toggle auto-rotation when clicking outside the cube
document.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(cube);
    
    if (intersects.length === 0) {
        autoRotateEnabled = !autoRotateEnabled;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (!mouseMoved && autoRotateEnabled) {
        // Ramp up speed if auto-rotation is enabled
        if (rotationSpeed < maxRotationSpeed) {
            rotationSpeed += acceleration;
            if (rotationSpeed > maxRotationSpeed) rotationSpeed = maxRotationSpeed;
        }
        // Apply the rotation
        cube.rotation.x += rotationSpeed;
        cube.rotation.y += rotationSpeed;
    } else {
        // Ramp down speed if auto-rotation is disabled
        if (rotationSpeed > 0) {
            rotationSpeed -= deceleration;
            if (rotationSpeed < 0) rotationSpeed = 0;
        }
    }

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
