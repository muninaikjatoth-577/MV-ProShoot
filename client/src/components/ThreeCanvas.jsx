import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 16);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Studio & Palette Lighting
    const ambientLight = new THREE.AmbientLight(0x5b21b6, 1.5);
    scene.add(ambientLight);

    // Key Light (Warm Gold / Amber)
    const keyLight = new THREE.DirectionalLight(0xf59e0b, 3.2);
    keyLight.position.set(12, 10, 10);
    scene.add(keyLight);

    // Fill Light (Neon Magenta / Pink)
    const fillLight = new THREE.PointLight(0xec4899, 4.5, 35);
    fillLight.position.set(-10, 6, 8);
    scene.add(fillLight);

    // Rim / Edge Light (Electric Cyan)
    const rimLight = new THREE.PointLight(0x06b6d4, 4.0, 30);
    rimLight.position.set(6, -8, -6);
    scene.add(rimLight);

    // Backstage Violet Glow
    const backLight = new THREE.PointLight(0x8b5cf6, 3.0, 30);
    backLight.position.set(0, -6, 10);
    scene.add(backLight);

    // ==========================================
    // 🎥 3D CINEMA CAMERA & LENS RIG
    // ==========================================
    const cameraRig = new THREE.Group();
    scene.add(cameraRig);

    // Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x12111d,
      roughness: 0.35,
      metalness: 0.85,
    });

    const gripMaterial = new THREE.MeshStandardMaterial({
      color: 0x090812,
      roughness: 0.8,
      metalness: 0.2,
    });

    const goldCinemaRingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x78350f,
      emissiveIntensity: 0.4,
    });

    const redAccentMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xdc2626,
      emissiveIntensity: 0.6,
    });

    const glassLensMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      transmission: 0.75,
      opacity: 0.95,
      transparent: true,
      roughness: 0.05,
      ior: 1.65,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.25,
    });

    const monitorScreenMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
    });

    // 1. Camera Main Body
    const bodyGeo = new THREE.BoxGeometry(3.6, 2.6, 2.8);
    const cameraBody = new THREE.Mesh(bodyGeo, bodyMaterial);
    cameraRig.add(cameraBody);

    // 2. Ergonomic Right Grip
    const gripGeo = new THREE.BoxGeometry(1.0, 2.4, 2.2);
    const grip = new THREE.Mesh(gripGeo, gripMaterial);
    grip.position.set(-1.85, -0.05, 0.3);
    cameraRig.add(grip);

    // 3. Shutter / Record Button on Grip
    const recButtonGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.18, 24);
    const recButton = new THREE.Mesh(recButtonGeo, redAccentMat);
    recButton.position.set(-1.85, 1.25, 0.8);
    cameraRig.add(recButton);

    // 4. Viewfinder / Top Prism Housing
    const prismGeo = new THREE.BoxGeometry(1.6, 0.9, 2.0);
    const prism = new THREE.Mesh(prismGeo, bodyMaterial);
    prism.position.set(0.1, 1.6, 0);
    cameraRig.add(prism);

    // Cold shoe / Top bracket
    const shoeGeo = new THREE.BoxGeometry(0.8, 0.15, 0.8);
    const shoe = new THREE.Mesh(shoeGeo, goldCinemaRingMat);
    shoe.position.set(0.1, 2.1, 0);
    cameraRig.add(shoe);

    // Top Audio Mic / Viewfinder Tube
    const topTubeGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.4, 16);
    const topTube = new THREE.Mesh(topTubeGeo, bodyMaterial);
    topTube.rotation.x = Math.PI / 2;
    topTube.position.set(0.1, 2.2, 0.1);
    cameraRig.add(topTube);

    // 5. Rear LCD Monitor Display Screen
    const monitorFrameGeo = new THREE.BoxGeometry(2.4, 1.7, 0.15);
    const monitorFrame = new THREE.Mesh(monitorFrameGeo, bodyMaterial);
    monitorFrame.position.set(0.2, 0, -1.45);
    cameraRig.add(monitorFrame);

    const screenGeo = new THREE.PlaneGeometry(2.1, 1.4);
    const screen = new THREE.Mesh(screenGeo, monitorScreenMat);
    screen.position.set(0.2, 0, -1.54);
    screen.rotation.y = Math.PI;
    cameraRig.add(screen);

    // 6. Front Lens Mount Collar
    const mountGeo = new THREE.CylinderGeometry(1.35, 1.45, 0.5, 32);
    const mountCollar = new THREE.Mesh(mountGeo, bodyMaterial);
    mountCollar.rotation.x = Math.PI / 2;
    mountCollar.position.set(0.1, 0, 1.6);
    cameraRig.add(mountCollar);

    // 7. Cinema Lens Barrel Section 1 (Base Barrel)
    const barrelGeo1 = new THREE.CylinderGeometry(1.28, 1.28, 1.2, 32);
    const barrel1 = new THREE.Mesh(barrelGeo1, bodyMaterial);
    barrel1.rotation.x = Math.PI / 2;
    barrel1.position.set(0.1, 0, 2.4);
    cameraRig.add(barrel1);

    // 8. Luxury Gold Cinema Accent Ring (Canon L / Master Prime style)
    const goldRingGeo = new THREE.TorusGeometry(1.32, 0.07, 16, 48);
    const goldRing = new THREE.Mesh(goldRingGeo, goldCinemaRingMat);
    goldRing.position.set(0.1, 0, 2.2);
    cameraRig.add(goldRing);

    // 9. Focus Gear Ring with Teeth / Knurls
    const gearRingGeo = new THREE.CylinderGeometry(1.36, 1.36, 0.6, 24);
    const gearRing = new THREE.Mesh(gearRingGeo, gripMaterial);
    gearRing.rotation.x = Math.PI / 2;
    gearRing.position.set(0.1, 0, 3.1);
    cameraRig.add(gearRing);

    // 10. Front Lens Barrel Section 2 (Wide Iris)
    const barrelGeo2 = new THREE.CylinderGeometry(1.48, 1.32, 1.1, 32);
    const barrel2 = new THREE.Mesh(barrelGeo2, bodyMaterial);
    barrel2.rotation.x = Math.PI / 2;
    barrel2.position.set(0.1, 0, 3.8);
    cameraRig.add(barrel2);

    // 11. Red Anamorphic Ring
    const redRingGeo = new THREE.TorusGeometry(1.5, 0.06, 16, 48);
    const redRing = new THREE.Mesh(redRingGeo, redAccentMat);
    redRing.position.set(0.1, 0, 4.2);
    cameraRig.add(redRing);

    // 12. Front Curved Optical Glass Lens (Refractive & Iridescent)
    const lensFrontGeo = new THREE.SphereGeometry(1.38, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.4);
    const lensFront = new THREE.Mesh(lensFrontGeo, glassLensMat);
    lensFront.position.set(0.1, 0, 4.15);
    cameraRig.add(lensFront);

    // 13. Professional Matte Box Hood Flags
    const hoodGroup = new THREE.Group();
    hoodGroup.position.set(0.1, 0, 4.4);

    // Matte Box Outer Shield
    const hoodGeo = new THREE.CylinderGeometry(1.85, 1.5, 0.7, 4); // Rectangular 4-sided hood
    const hood = new THREE.Mesh(hoodGeo, bodyMaterial);
    hood.rotation.x = Math.PI / 2;
    hood.rotation.y = Math.PI / 4;
    hoodGroup.add(hood);

    // Top Flag Bar
    const topFlagGeo = new THREE.BoxGeometry(2.4, 0.08, 0.9);
    const topFlag = new THREE.Mesh(topFlagGeo, bodyMaterial);
    topFlag.position.set(0, 1.45, 0.4);
    topFlag.rotation.x = 0.25;
    hoodGroup.add(topFlag);

    cameraRig.add(hoodGroup);

    // 14. Blinking Front Record Tally LED Light
    const tallyGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const tallyMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tallyLightMesh = new THREE.Mesh(tallyGeo, tallyMat);
    tallyLightMesh.position.set(-1.0, 1.0, 1.42);
    cameraRig.add(tallyLightMesh);

    const tallyPointLight = new THREE.PointLight(0xef4444, 2.5, 4);
    tallyPointLight.position.set(-1.0, 1.0, 1.55);
    cameraRig.add(tallyPointLight);

    // 15. Dynamic Cinema Bokeh Particle Swarm
    const particleCount = 1300;
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const paletteColors = [
      new THREE.Color('#8b5cf6'), // violet
      new THREE.Color('#ec4899'), // pink
      new THREE.Color('#06b6d4'), // cyan
      new THREE.Color('#f59e0b'), // gold
      new THREE.Color('#ffffff'), // pure white sparkle
    ];

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3 + 0] = (Math.random() - 0.5) * 38;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 28;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 32;

      const randomColor = paletteColors[Math.floor(Math.random() * paletteColors.length)];
      colorArray[i * 3 + 0] = randomColor.r;
      colorArray[i * 3 + 1] = randomColor.g;
      colorArray[i * 3 + 2] = randomColor.b;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Mouse Interaction Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Position the camera rig prominently on the right half of the screen
      cameraRig.position.x = 2.8 + targetX * 1.0;
      cameraRig.position.y = Math.sin(elapsedTime * 0.8) * 0.35 + targetY * 0.8;
      cameraRig.position.z = Math.cos(elapsedTime * 0.6) * 0.2;

      // Cinematic smooth rotation displaying 3D depth of the camera body & cinema lens
      cameraRig.rotation.y = Math.sin(elapsedTime * 0.45) * 0.55 - 0.35 + targetX * 0.4;
      cameraRig.rotation.x = Math.cos(elapsedTime * 0.4) * 0.2 + 0.1 + targetY * 0.3;
      cameraRig.rotation.z = Math.sin(elapsedTime * 0.3) * 0.1;

      // Subtle gear rotation
      gearRing.rotation.z = elapsedTime * 0.2;

      // Blinking Tally LED Pulse (Record mode simulation)
      const tallyPulse = Math.sin(elapsedTime * 5.0) > 0 ? 1 : 0.15;
      tallyMat.opacity = tallyPulse;
      tallyPointLight.intensity = tallyPulse * 3.0;

      // Particle subtle ambient drift
      particleSystem.rotation.y = elapsedTime * 0.025;
      particleSystem.rotation.x = targetY * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
