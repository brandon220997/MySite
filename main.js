import './style.css'

import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

let clock = new THREE.Clock();

const cloudTexture = textureLoader.load( '/images/texture/cloud.png' );
const lavaTexture = textureLoader.load( '/images/texture/lavatile.jpg' );

lavaTexture.colorSpace = THREE.SRGBColorSpace;

cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

const volcanic = textureLoader.load( '/images/texture/Volcanic.png' );
const volcanicNormal = textureLoader.load( '/images/texture/VolcanicNormal.jpg' );

volcanic.colorSpace = THREE.SRGBColorSpace;

volcanic.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
volcanicNormal.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

const earth = textureLoader.load( '/images/texture/Earth.png' );
const earthNormal = textureLoader.load( '/images/texture/EarthNormal.jpg' );

earth.colorSpace = THREE.SRGBColorSpace;

earth.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
earthNormal.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

let uniforms = {

  'fogDensity': { value: 0.02 },
  'fogColor': { value: new THREE.Vector3( 0, 0, 0 ) },
  'time': { value: 1.0 },
  'uvScale': { value: new THREE.Vector2( 3.0, 1.0 ) },
  'texture1': { value: cloudTexture },
  'texture2': { value: lavaTexture }

};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  setPixelRatio: window.devicePixelRatio,
  antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const sunGeometry = new THREE.SphereGeometry(10, 24, 24);
const sunMaterial = new THREE.ShaderMaterial( {

  uniforms: uniforms,
  vertexShader: document.getElementById( 'vertexShader' ).textContent,
  fragmentShader: document.getElementById( 'fragmentShader' ).textContent

} );
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

sun.position.set(0, 0, -11);

// Small Planet
var smallPlanetMaterial = new THREE.MeshBasicMaterial({
  map: volcanic,
  normalMap: volcanicNormal,
});
smallPlanetMaterial.color = new THREE.Color(1, 1, 1);
var smallPlanetGeometry = new THREE.SphereGeometry(1.8, 24, 24);

var smallPlanetOrbit = new THREE.Mesh();
var smallPlanet = new THREE.Mesh(smallPlanetGeometry, smallPlanetMaterial);
smallPlanet.position.z = 13;

smallPlanetOrbit.add(smallPlanet);
smallPlanetOrbit.position.set(0, 0, -11);

scene.add(smallPlanetOrbit);

// Earth Planet
var earthPlaneMaterial = new THREE.MeshBasicMaterial({
  map: earth,
  normalMap: earthNormal,
});
earthPlaneMaterial.color = new THREE.Color(1, 1, 1);
var earthPlanetGeometry = new THREE.SphereGeometry(1.8, 24, 24);

var earthPlanetOrbit = new THREE.Mesh();
var earthPlanet = new THREE.Mesh(earthPlanetGeometry, earthPlaneMaterial);
earthPlanet.position.z = 33;

earthPlanetOrbit.add(earthPlanet);
earthPlanetOrbit.position.set(0, 0, -11);

scene.add(earthPlanetOrbit);

scene.add(sun);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 500.0;
scene.add(ambientLight);

// const lighthelper = new THREE.PointLightHelper(pointLight);
// scene.add(lighthelper);

// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

function addNearStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star);
}

function addFarStar() {
  const geometry = new THREE.SphereGeometry(0.25, 8, 8);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(400));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(450).fill().forEach(addFarStar);
Array(450).fill().forEach(addNearStar);

function animate() {
  requestAnimationFrame(animate);

  // controls.update();

  const delta = 5 * clock.getDelta();
  uniforms[ 'time' ].value += 0.2 * delta;

  renderer.render(scene, camera);
}

animate();

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  sun.rotation.y = t * -0.0005;

  smallPlanetOrbit.rotation.y = 4.2 + t * -0.002;
  smallPlanet.rotation.y = t * -0.02;

  earthPlanetOrbit.rotation.y = 3.5 + t * -0.001;
  earthPlanet.rotation.y = t * -0.02;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;

}

document.body.onscroll = moveCamera;
