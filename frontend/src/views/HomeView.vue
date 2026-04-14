<template>
  <div class="relative w-full min-h-screen flex flex-col items-center pb-20 overflow-hidden bg-mzansi-dark">
    
    <canvas ref="waveCanvas" class="absolute inset-0 w-full h-full z-0 opacity-60 pointer-events-none will-change-transform"></canvas>

    <div class="relative z-10 w-full flex flex-col items-center space-y-32 pt-10">

      <div class="w-full flex flex-col items-center justify-center min-h-[75vh] text-center px-4">
        <div class="flex flex-col items-center space-y-8 max-w-4xl mx-auto">
          
          <div class="animate-slide-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/50 border border-gray-700 backdrop-blur-md text-sm font-semibold text-gray-300 shadow-lg">
            <span class="w-2 h-2 rounded-full bg-mzansi-green animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            MzansiBuilds V1.0 is now live
          </div>
          
          <h1 class="text-6xl md:text-8xl font-extrabold text-white tracking-tighter animate-slide-up leading-tight" style="animation-delay: 0.1s; animation-fill-mode: both;">
            Build in <br class="md:hidden" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-mzansi-green to-white drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">Public.</span>
          </h1>
          
          <p class="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed animate-slide-up max-w-2xl" style="animation-delay: 0.2s; animation-fill-mode: both;">
            The premier platform for Mzansi developers to pitch ideas, find collaborators, and ship real code to the real world.
          </p>
          
          <div class="flex flex-col sm:flex-row justify-center gap-6 pt-6 animate-slide-up w-full sm:w-auto" style="animation-delay: 0.3s; animation-fill-mode: both;">
            <RouterLink to="/create" class="w-full sm:w-auto text-center bg-mzansi-green text-mzansi-dark font-extrabold text-lg px-10 py-4 rounded-full hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300 hover:-translate-y-1">
              Start Building
            </RouterLink>
            <RouterLink to="/feed" class="w-full sm:w-auto text-center bg-gray-900/50 backdrop-blur-md border border-gray-700 text-white font-bold text-lg px-10 py-4 rounded-full hover:border-mzansi-green hover:bg-gray-800 transition-all duration-300 hover:-translate-y-1 shadow-lg group">
              Explore Feed <span class="inline-block transition-transform group-hover:translate-x-1 ml-1">&rarr;</span>
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="w-full max-w-6xl mx-auto px-4 animate-slide-up" style="animation-delay: 0.4s; animation-fill-mode: both;">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(stat, index) in stats" :key="index" 
               class="bg-mzansi-card/40 backdrop-blur-md border border-gray-800 p-8 rounded-2xl text-center hover:border-mzansi-green/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300 group">
            <h3 class="text-4xl font-extrabold text-white mb-2 group-hover:text-mzansi-green transition-colors">{{ stat.value }}</h3>
            <p class="text-gray-500 font-bold uppercase tracking-widest text-xs">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <div class="w-full max-w-6xl mx-auto px-4 animate-slide-up" style="animation-delay: 0.5s; animation-fill-mode: both;">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-extrabold text-white mb-4">Scalable Web Solutions.</h2>
          <p class="text-gray-400 text-lg">Everything you need to take your project from an idea to the Celebration Wall.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(feature, index) in features" :key="index" 
               class="bg-mzansi-card/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 hover:-translate-y-2 hover:border-mzansi-green/50 hover:shadow-[0_10px_40px_rgba(16,185,129,0.1)] transition-all duration-300 group relative overflow-hidden">
            
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mzansi-green to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div class="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center text-3xl mb-6 border border-gray-700 shadow-inner group-hover:scale-110 transition-transform duration-300 group-hover:border-mzansi-green/50">
              {{ feature.icon }}
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">{{ feature.title }}</h3>
            <p class="text-gray-400 leading-relaxed text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </div>

      <div class="w-full max-w-4xl mx-auto px-4 text-center pb-20 animate-slide-up" style="animation-delay: 0.6s; animation-fill-mode: both;">
        <h2 class="text-3xl font-bold text-white mb-6">Ready to execute?</h2>
        <p class="text-gray-400 mb-8 max-w-xl mx-auto text-sm">Join the fastest growing community of developers in Mzansi. Push boundaries in code.</p>
        <RouterLink to="/login" class="inline-block bg-white text-mzansi-dark font-extrabold px-10 py-4 rounded-full hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 hover:-translate-y-1">
          Explore &darr;
        </RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const stats = [
  { value: '🚀', label: 'Idea to Launch' },
  { value: '🤝', label: 'Find Collaborators' },
  { value: '🏆', label: 'Celebration Wall' }
];

const features = [
  {
    icon: '🌍',
    title: 'Build in Public',
    description: 'Share your journey, post timeline updates, and build an audience before you even write your first line of code.'
  },
  {
    icon: '⚡',
    title: 'Find Your Squad',
    description: 'Stuck on UI? Need a backend dev? Raise your hand on the feed and instantly find collaborators for your stack.'
  },
  {
    icon: '🎉',
    title: 'Ship Faster',
    description: 'Use public accountability to your advantage. Log your milestones, finish the build, and get immortalized on the Wall.'
  }
];

//Used AI to create that wave look for the home page
const waveCanvas = ref(null);
let animationFrameId;
let resize;

onMounted(() => {
  const canvas = waveCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width, height;
  let particles = [];
  const spacing = 45;
  const isMobile = window.innerWidth < 768;
  const rows = isMobile ? 20 : 40;
  const cols = isMobile ? 30 : 60;
  let time = 0;

  resize = () => {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  };

  window.addEventListener('resize', resize);
  resize();

  particles = [];
  for (let ix = 0; ix < cols; ix++) {
    for (let iy = 0; iy < rows; iy++) {
      particles.push({ x: ix, y: iy });
    }
  }

  const render = () => {
    ctx.clearRect(0, 0, width, height);
    time += 0.03;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      const xPos = (p.x - cols / 2) * spacing;
      const zPos = (p.y - rows / 2) * spacing;

      const wave1 = Math.sin((p.x + time) * 0.3) * 60;
      const wave2 = Math.cos((p.y + time) * 0.2) * 60;
      const wave3 = Math.sin((p.x + p.y + time) * 0.1) * 40;
      const yPos = wave1 + wave2 + wave3 + 100;

      const fov = 800;
      const scale = fov / (fov + zPos + 500);

      if (scale < 0) continue;

      const screenX = width / 2 + xPos * scale;
      const screenY = height / 2 + yPos * scale;

      const radius = scale * 1.5;

      const depthAlpha = Math.max(0, Math.min(0.8, scale * 1.2 - 0.2));
      const edgeFade = Math.sin((p.x / cols) * Math.PI) * Math.sin((p.y / rows) * Math.PI);
      const finalAlpha = depthAlpha * edgeFade;

      ctx.beginPath();
      ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16, 185, 129, ${finalAlpha})`;
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(render);
  };

  render();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
  cancelAnimationFrame(animationFrameId);
});
</script>