// 基于Three.js的3D粒子效果
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('particles-js'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// 创建粒子系统
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;

const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: 0xffffff,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
  map: createRoundParticleTexture()
});

function createRoundParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.4)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(16, 16, 16, 0, Math.PI * 2);
  context.fill();
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 5;

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  
  particlesMesh.rotation.x += 0.001;
  particlesMesh.rotation.y += 0.001;
  
  renderer.render(scene, camera);
}

animate();

// 响应式调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 智能客服按钮点击事件
const customerServiceBtn = document.querySelector('#customer-service .entry-button');
if (customerServiceBtn) {
  customerServiceBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.consultation-form').scrollIntoView({ behavior: 'smooth' });
  });
}

// 表单提交处理
const form = document.querySelector('.consultation-form form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);
    
    try {
      const response = await fetch('api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showAlert('提交成功！', 'success');
        form.reset();
      } else {
        showAlert(`提交失败: ${result.message}`, 'error');
      }
    } catch (error) {
      showAlert(`网络错误: ${error.message}`, 'error');
    }
  });
}

// 显示消息提示
function showAlert(message, type) {
  const alert = document.createElement('div');
  alert.className = `alert-message ${type}`;
  alert.textContent = message;
  document.body.appendChild(alert);
  
  alert.style.display = 'block';
  setTimeout(() => {
    alert.style.opacity = '0';
    setTimeout(() => {
      alert.remove();
    }, 300);
  }, 3000);
}