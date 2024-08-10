// revolvingbox.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube geometry
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    opacity: 0.5,
    transparent: true
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create outline material with custom shader to simulate thicker edges
const outlineMaterial = new THREE.ShaderMaterial({
    uniforms: {
        color: { value: new THREE.Color(0x000000) },
        thickness: { value: 2.0 } // Adjust this value to make the outline thicker or thinner
    },
    vertexShader: `
        uniform float thickness;
        varying vec3 vPosition;
        void main() {
            vPosition = position;
            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            vec4 projectionPosition = projectionMatrix * modelViewPosition;
            gl_Position = projectionPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        varying vec3 vPosition;
        void main() {
            float edgeWidth = 0.02;
            float dist = length(gl_FragCoord.xy / vec2(1.0) - gl_Position.xy);
            if (dist < thickness) {
                gl_FragColor = vec4(color, 1.0);
            } else {
                discard;
            }
        }
    `,
    side: THREE.BackSide,
    depthWrite: false
});

const edges = new THREE.EdgesGeometry(geometry);
const outline = new THREE.LineSegments(edges, outlineMaterial);
scene.add(outline);

// Animation with roll-off period
let rotationSpeed = 0.01;
let slowingDown = false;
let slowdownFactor = 0.99;

function animate() {
    requestAnimationFrame(animate);

    if (rotationSpeed > 0) {
        if (slowingDown) {
            rotationSpeed *= slowdownFactor;
            if (rotationSpeed < 0.001) rotationSpeed = 0; // Stop the rotation when it's very slow
        }
    }

    cube.rotation.x += rotationSpeed;
    cube.rotation.y += rotationSpeed;

    renderer.render(scene, camera);
}

animate();

// Start slowing down after 2 seconds
setTimeout(() => {
    slowingDown = true;
}, 2000);

// Handle resizing of the window
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
