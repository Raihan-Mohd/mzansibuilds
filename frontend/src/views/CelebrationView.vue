<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import confetti from 'canvas-confetti';

const completedProjects = ref([]);
const authorProfiles = ref({});

const fetchAuthorProfile = async (email) => {
  if (authorProfiles.value[email]) return;
  try {
    const res = await axios.get(`http://localhost:5000/api/users/${email}`);
    if (res.data) authorProfiles.value[email] = res.data;
  } catch (err) {}
};

onMounted(async () => {
  // Fire Confetti
  const duration = 3 * 1000;
  const end = Date.now() + duration;
  const frame = () => {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#10b981', '#a855f7', '#ffffff'] });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#10b981', '#a855f7', '#ffffff'] });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();

  // Fetch all projects and filter only completed ones
  try {
    const response = await axios.get('http://localhost:5000/api/projects');
    completedProjects.value = response.data.filter(p => p.status === 'Completed');
    completedProjects.value.forEach(p => fetchAuthorProfile(p.author));
  } catch (error) {
    console.error("Failed to load completed projects", error);
  }
});
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-12 pt-8 pb-16 relative z-10">
    
    <div class="text-center space-y-4">
      <h1 class="text-5xl md:text-6xl font-extrabold text-white tracking-tight animate-slide-up">
        The Celebration <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">Wall</span>
      </h1>
      <p class="text-xl text-gray-400 font-medium max-w-2xl mx-auto animate-slide-up" style="animation-delay: 0.2s; animation-fill-mode: both;">
        A Hall of Fame for Mzansi developers who turned ideas into reality. These projects have been officially shipped.
      </p>
    </div>

    <div v-if="completedProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up" style="animation-delay: 0.4s; animation-fill-mode: both;">
      
      <div v-for="project in completedProjects" :key="project.id" 
           class="bg-mzansi-card p-6 rounded-2xl shadow-2xl border border-purple-900/50 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 group flex flex-col relative overflow-hidden">
        
        <div class="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent pointer-events-none"></div>

        <div class="flex items-center gap-3 mb-4 relative z-10">
          <RouterLink :to="`/developer/${project.author}`" class="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner border border-gray-600 hover:scale-110 transition cursor-pointer" :class="authorProfiles[project.author]?.avatarClass || 'bg-gray-800'">
            {{ authorProfiles[project.author]?.avatarIcon || '👤' }}
          </RouterLink>
          <div>
            <h3 class="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{{ project.title }}</h3>
            <p class="text-xs text-gray-400">By {{ authorProfiles[project.author]?.displayName || 'Anonymous' }}</p>
          </div>
        </div>
        
        <p class="text-gray-300 text-sm flex-grow mb-6 relative z-10">{{ project.description }}</p>
        
        <div class="flex justify-between items-center border-t border-gray-800 pt-4 relative z-10">
          <span class="text-purple-400 font-bold text-sm flex items-center gap-1"><span>🚀</span> Shipped</span>
          
          <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="text-gray-400 hover:text-white transition flex items-center gap-1 text-sm font-bold bg-gray-800 px-3 py-1.5 rounded">
            <span>🔗</span> Repo
          </a>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center text-gray-500 italic py-20 bg-mzansi-card rounded-2xl border border-gray-800 animate-slide-up" style="animation-delay: 0.4s; animation-fill-mode: both;">
      No projects have been shipped yet. Will you be the first on the wall?
    </div>
    
  </div>
</template>