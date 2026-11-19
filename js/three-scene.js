/**
 * GROUP PRESTIGE SERVICES - 3D THREE.JS LUXURY EXPERIENCE
 * Interactive WebGL background with 3D Medallion, floating water droplets, 
 * sparkle particles, and dynamic mouse tracking.
 */

(function () {
  'use strict';

  const container = document.getElementById('three-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // Scene setup
  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 18);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const blueLight = new THREE.PointLight(0x00d2ff, 2.5, 50);
  blueLight.position.set(-10, 8, 10);
  scene.add(blueLight);

  const goldLight = new THREE.PointLight(0xffd700, 3, 50);
  goldLight.position.set(12, -6, 8);
  scene.add(goldLight);

  const mouseLight = new THREE.PointLight(0x70b5ff, 2, 30);
  mouseLight.position.set(0, 0, 10);
  scene.add(mouseLight);

  // Group for the 3D Centerpiece
  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  // Positioning the heroGroup to the right on desktop, center on mobile
  function updateGroupPosition() {
    if (window.innerWidth > 1024) {
      heroGroup.position.set(4.2, 0.5, 0);
    } else {
      heroGroup.position.set(0, 1, -2);
    }
  }
  updateGroupPosition();

  // Texture Loader for Badge
  const textureLoader = new THREE.TextureLoader();
  const badgeTexture = textureLoader.load('assets/images/badge-gold-3d-transparent.png');
  badgeTexture.generateMipmaps = true;
  badgeTexture.minFilter = THREE.LinearMipmapLinearFilter;

  // 1. Central 3D Luxury Medallion Disc
  const discGeometry = new THREE.CylinderGeometry(3.2, 3.2, 0.35, 64);
  
  // Materials: rim is polished gold metal, faces are textured
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xdfb743,
    metalness: 0.92,
    roughness: 0.18,
    envMapIntensity: 1.5
  });

  const faceMaterial = new THREE.MeshStandardMaterial({
    map: badgeTexture,
    transparent: true,
    metalness: 0.4,
    roughness: 0.3,
    alphaTest: 0.05
  });

  // Cylinder faces: [side, top, bottom]
  const discMaterials = [goldMaterial, faceMaterial, faceMaterial];
  const medallion = new THREE.Mesh(discGeometry, discMaterials);
  medallion.rotation.x = Math.PI / 2;
  heroGroup.add(medallion);

  // 2. Gyroscopic Orbital Golden Rings
  const ringGeo1 = new THREE.TorusGeometry(4.0, 0.04, 16, 100);
  const ringMat1 = new THREE.MeshStandardMaterial({
    color: 0xf6e27a,
    metalness: 0.95,
    roughness: 0.1
  });
  const orbitalRing1 = new THREE.Mesh(ringGeo1, ringMat1);
  heroGroup.add(orbitalRing1);

  const ringGeo2 = new THREE.TorusGeometry(4.6, 0.03, 16, 100);
  const ringMat2 = new THREE.MeshStandardMaterial({
    color: 0x00d2ff,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.8
  });
  const orbitalRing2 = new THREE.Mesh(ringGeo2, ringMat2);
  orbitalRing2.rotation.x = Math.PI / 3;
  heroGroup.add(orbitalRing2);

  // 3. Floating 3D Water Droplets / Crystal Spheres
  const dropletsCount = 45;
  const dropletGeo = new THREE.SphereGeometry(1, 24, 24);
  const dropletMatBlue = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transmission: 0.85,
    opacity: 0.9,
    transparent: true,
    roughness: 0.05,
    ior: 1.33, // water IOR
    thickness: 1.2
  });

  const dropletMatGold = new THREE.MeshPhysicalMaterial({
    color: 0xfef08a,
    transmission: 0.75,
    opacity: 0.85,
    transparent: true,
    roughness: 0.1,
    ior: 1.5,
    thickness: 1.0
  });

  const droplets = [];
  for (let i = 0; i < dropletsCount; i++) {
    const isGold = Math.random() > 0.75;
    const mesh = new THREE.Mesh(dropletGeo, isGold ? dropletMatGold : dropletMatBlue);

    // Random initial positions around the scene
    const scale = 0.15 + Math.random() * 0.45;
    mesh.scale.set(scale, scale, scale);

    const radius = 4 + Math.random() * 12;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI;

    mesh.position.set(
      radius * Math.cos(theta) * Math.cos(phi),
      radius * Math.sin(phi),
      radius * Math.sin(theta) * Math.cos(phi) - 2
    );

    mesh.userData = {
      baseY: mesh.position.y,
      speedY: 0.005 + Math.random() * 0.015,
      wobbleSpeed: 0.8 + Math.random() * 2,
      wobbleDist: 0.2 + Math.random() * 0.6,
      rotSpeed: (Math.random() - 0.5) * 0.02
    };

    scene.add(mesh);
    droplets.push(mesh);
  }

  // 4. Sparkling Particle Clean Dust
  const particleCount = 180;
  const particlesGeo = new THREE.BufferGeometry();
  const posArray = new Float32Array(particleCount * 3);
  const colorArray = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 35;
    posArray[i + 1] = (Math.random() - 0.5) * 25;
    posArray[i + 2] = (Math.random() - 0.5) * 20;

    // Mix between cyan and gold sparkles
    if (Math.random() > 0.4) {
      colorArray[i] = 0.0;
      colorArray[i + 1] = 0.82;
      colorArray[i + 2] = 1.0;
    } else {
      colorArray[i] = 0.96;
      colorArray[i + 1] = 0.88;
      colorArray[i + 2] = 0.48;
    }
  }

  particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

  // Circular spark texture
  const sparkCanvas = document.createElement('canvas');
  sparkCanvas.width = 64;
  sparkCanvas.height = 64;
  const ctx = sparkCanvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const sparkTexture = new THREE.CanvasTexture(sparkCanvas);

  const particlesMat = new THREE.PointsMaterial({
    size: 0.35,
    map: sparkTexture,
    transparent: true,
    opacity: 0.8,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particleSystem);

  // Mouse Interaction Variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;

    // Update 3D mouse light
    mouseLight.position.x = mouseX * 10;
    mouseLight.position.y = -mouseY * 8;
  }, { passive: true });

  // Touch support for mobile 3D tilt
  document.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
      mouseX = (event.touches[0].clientX - windowHalfX) / windowHalfX;
      mouseY = (event.touches[0].clientY - windowHalfY) / windowHalfY;
    }
  }, { passive: true });

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    updateGroupPosition();
  });

  // Animation Loop with Performance Optimization
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  });
  observer.observe(container);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Smooth lerp mouse tracking
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Hero group floating & tilt
    heroGroup.rotation.y = targetX * 0.6 + Math.sin(elapsedTime * 0.4) * 0.15;
    heroGroup.rotation.x = -targetY * 0.4 + Math.cos(elapsedTime * 0.3) * 0.1;
    heroGroup.position.y = (window.innerWidth > 1024 ? 0.5 : 1) + Math.sin(elapsedTime * 1.2) * 0.25;

    // Rotate orbital rings
    orbitalRing1.rotation.x = elapsedTime * 0.2;
    orbitalRing1.rotation.y = elapsedTime * 0.3;
    orbitalRing2.rotation.z = -elapsedTime * 0.25;
    orbitalRing2.rotation.y = elapsedTime * 0.15;

    // Animate droplets (gentle floating upwards)
    for (let i = 0; i < droplets.length; i++) {
      const d = droplets[i];
      d.position.y += d.userData.speedY;
      d.position.x += Math.sin(elapsedTime * d.userData.wobbleSpeed + i) * 0.005;
      d.rotation.y += d.userData.rotSpeed;

      // Wrap around screen
      if (d.position.y > 14) {
        d.position.y = -14;
      }
    }

    // Gentle particle system swirl
    particleSystem.rotation.y = elapsedTime * 0.03;
    particleSystem.rotation.x = targetY * 0.05;

    renderer.render(scene, camera);
  }

  animate();
})();

