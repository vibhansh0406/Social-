// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Lenis Smooth Scrolling
let lenis;
if (!isReducedMotion) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// 2. Custom Cursor
const cursor = document.querySelector('.cursor');
if (cursor && window.matchMedia('(pointer: fine)').matches && !isReducedMotion) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  const links = document.querySelectorAll('a, button, input, select, textarea');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      cursor.style.backgroundColor = 'transparent';
      cursor.style.border = '1px solid var(--text-dark)';
    });
    link.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.backgroundColor = 'var(--text-dark)';
      cursor.style.border = 'none';
    });
  });
} else if (cursor) {
  cursor.style.display = 'none';
}

// 3. WebGL Background (Three.js Shader)
let scene, camera, renderer, material;
let animationFrameId;

function initWebGL() {
  if (isReducedMotion || !document.getElementById('canvas-container')) return;

  const container = document.getElementById('canvas-container');

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(2, 2);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 st = gl_FragCoord.xy/u_resolution.xy;
      st.x *= u_resolution.x/u_resolution.y;

      vec3 color = vec3(0.035, 0.035, 0.035); // Base Dark #090909 equivalent

      vec2 q = vec2(0.);
      q.x = snoise( st + 0.00 * u_time);
      q.y = snoise( st + vec2(1.0));

      vec2 r = vec2(0.);
      r.x = snoise( st + 1.0 * q + vec2(1.7,9.2)+ 0.15 * u_time );
      r.y = snoise( st + 1.0 * q + vec2(8.3,2.8)+ 0.126 * u_time);

      float f = snoise(st+r);

      color = mix(
        color,
        vec3(0.15, 0.15, 0.15),
        clamp((f*f)*4.0, 0.0, 1.0)
      );

      color = mix(
        color,
        vec3(0.05, 0.05, 0.05),
        clamp(length(q), 0.0, 1.0)
      );

      color = mix(
        color,
        vec3(0.1, 0.1, 0.1),
        clamp(length(r.x), 0.0, 1.0)
      );

      gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color, 1.0);
    }
  `;

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  window.addEventListener('resize', onWindowResize, false);

  // Pause rendering when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      render();
    }
  });

  render();
}

function onWindowResize() {
  if (!renderer || !material) return;
  renderer.setSize(window.innerWidth, window.innerHeight);
  material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
}

const clock = new THREE.Clock();

let isCanvasVisible = true;
const canvasContainer = document.getElementById('canvas-container');
if (canvasContainer && window.IntersectionObserver) {
  const observer = new IntersectionObserver((entries) => {
    isCanvasVisible = entries[0].isIntersecting;
  });
  observer.observe(canvasContainer);
}

function render() {
  if (!renderer || !scene || !camera || !material) return;
  if (isCanvasVisible) {
    material.uniforms.u_time.value = clock.getElapsedTime() * 0.5;
    renderer.render(scene, camera);
  }
  animationFrameId = requestAnimationFrame(render);
}

// 4. GSAP Animations & SplitText
function initAnimations() {
  if (isReducedMotion) return;

  // Split Text
  const splitTitles = document.querySelectorAll('[data-split]');
  splitTitles.forEach(title => {
    const split = new SplitType(title, { types: 'lines, words, chars' });

    gsap.from(split.chars, {
      scrollTrigger: {
        trigger: title,
        start: 'top 90%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.02,
      ease: 'power3.out'
    });
  });

  // Fade up elements
  const fadeElements = document.querySelectorAll('.service-col, .work-item, .process-step, .about-text p');
  fadeElements.forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });
}

// 5. Form Submission
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const btnSubmit = document.querySelector('.btn-submit');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check honeypot
    if (document.getElementById('bot_field').value) {
      return; // Silent fail for bots
    }

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    btnSubmit.classList.add('is-loading');
    btnSubmit.disabled = true;
    formStatus.className = 'form-status';
    formStatus.style.display = 'none';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        formStatus.textContent = 'Message sent successfully. I will get back to you soon.';
        formStatus.classList.add('success');
        contactForm.reset();
      } else {
        throw new Error(result.error || 'Failed to send message.');
      }
    } catch (error) {
      formStatus.textContent = error.message;
      formStatus.classList.add('error');
    } finally {
      btnSubmit.classList.remove('is-loading');
      btnSubmit.disabled = false;
    }
  });
}

// 6. Footer Year
document.getElementById('year').textContent = new Date().getFullYear();

// Initialize everything on load
window.addEventListener('DOMContentLoaded', () => {
  initWebGL();
  // Small delay to let fonts load before splitting text
  setTimeout(initAnimations, 100);
});
