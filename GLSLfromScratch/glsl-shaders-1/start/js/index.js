const vshader =
  `void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 0.5,1.0); // 计算顶点着色器中顶点的位置
  }`

const fshader = `
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform vec3 u_color;
 void main(){
  //  vec2 v = u_mouse / u_resolution;
  //  vec3 color = vec3(v.x , 0.0 , v.y);
   vec2 uv = gl_FragCoord.xy/u_resolution;
  //  vec3 color = vec3((sin(u_time)+1.0)/2.0, 0.0 ,(cos(u_time)+1.0)/2.0);
   vec3 color = mix(vec3(1.0,0.0,0.0),vec3(0.0,0.0,1.0),uv.y);
   gl_FragColor = vec4(color,1.0); // 设置片元着色器颜色 
 }
`

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock()
const geometry = new THREE.PlaneGeometry(2, 2);

const uniforms = {
  u_time: { value: 0.0 },
  u_mouse: { value: { x: 0.0, y: 0.0 } },
  u_resolution: { value: { x: 0.0, y: 0.0 } },
  u_color: { value: new THREE.Color(0xFFFF00) }
}

const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vshader,
  fragmentShader: fshader,
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
camera.position.z = 1;

if ('ontouchstart' in window) {
  document.addEventListener("touchmove", Move)
} else {
  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("mousemove", Move)
}

function Move(ev) {
  uniforms.u_mouse.value.x = (ev.touches) ? ev.touches[0].clientX : ev.clientX
  uniforms.u_mouse.value.y = (ev.touches) ? ev.touches[0].clientY : ev.clientY
}

onWindowResize();


animate();

function onWindowResize(event) {
  const aspectRatio = window.innerWidth / window.innerHeight;
  let width, height;
  if (aspectRatio >= 1) {
    width = 1;
    height = (window.innerHeight / window.innerWidth) * width;
  } else {
    width = aspectRatio;
    height = 1;
  }
  camera.left = -width;
  camera.right = width;
  camera.top = height;
  camera.bottom = -height;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (uniforms.u_resolution !== undefined) {
    uniforms.u_resolution.value.x = window.innerWidth;
    uniforms.u_resolution.value.y = window.innerHeight;
  }

}

function animate() {
  uniforms.u_time.value = clock.getElapsedTime();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
