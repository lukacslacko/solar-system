
var ph = 0;

function addTriangle(geometry, a, b, c) {
  geometry.faces.push(new THREE.Face3(a, b, c) );
  geometry.faces.push(new THREE.Face3(a, c, b) );
}

function spiral(r, a, y, phase) {
  return new THREE.Vector3(r*Math.cos(2*Math.PI*(y/a+phase)),r*Math.sin(2*Math.PI*(y/a+phase)),y);
}

function makeMesh(geometry) {
  geometry.castShadow = true;
  geometry.receiveShadow = true;
  
  geometry.computeFaceNormals();
  
  var material = new THREE.MeshNormalMaterial();
  
  return new THREE.Mesh( geometry, material );
}

function createSpiral(r1, r2, period, h, st, phase) {
  var geometry = new THREE.Geometry();

  var n = 0;
  for (var y = -h/2; y < h/2; y += st) {
    var a = spiral(r1, period, y, phase);
    var b = spiral(r2, period, y, phase);
    var c = spiral(r1, period, y+st, phase);
    var d = spiral(r2, period, y+st, phase);
    geometry.vertices.push(a, b, c, d);
    addTriangle(geometry, n, n+1, n+3);
    addTriangle(geometry, n, n+2, n+3);
    n += 4;
  }
  return makeMesh(geometry);
}

function square(a, z) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(a,a,z), new THREE.Vector3(a,-a,z), new THREE.Vector3(-a,-a,z), new THREE.Vector3(-a,a,z));
  addTriangle(geometry, 0, 1, 2);
  addTriangle(geometry, 0, 2, 3);
  return makeMesh(geometry);
}

function generateScene(scene) {
  var h = 10;
  scene.add(createSpiral(0.7, 0.6, 1.0, h, 0.05, 0.7));
  scene.add(createSpiral(1.0, 0.9, 2.0, h, 0.05, 0.0));
  scene.add(createSpiral(-0.05, 0.05, 1.0, h, 0.05, 0.0));
}

function createJupiter() {
  return createSpiral(2.0, 1.9, 3.0, 5.0, 0.05, ph);
}

var jupiter = createJupiter();

var scene = new THREE.Scene();

scene.add(jupiter);

generateScene(scene);

var camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: cnv});

camera.position.z = 5;

controls = new THREE.TrackballControls( camera, document.getElementById("cnv") );
controls.rotateSpeed = 5.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

renderer.render( scene, camera );

var animId;
function slide() {
  ph = 0.01 * Number(document.getElementById("rng").value);
  scene.remove(jupiter);
  jupiter.geometry.dispose();
  jupiter = createJupiter();
  scene.add(jupiter);
  renderer.render(scene, camera);
}


function animate() {
	animId = requestAnimationFrame( animate );
	renderer.render( scene, camera );
  controls.update();
}

function canvasDrag() {
  animate();
}

function canvasStopDrag() {
  cancelAnimationFrame( animId );
}

function canvasWheel() {
  controls.update();
  renderer.render( scene, camera );
}
