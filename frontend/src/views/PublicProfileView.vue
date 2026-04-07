<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const developerEmail = route.params.email;

const profile = ref(null);
const developerProjects = ref([]);

onMounted(async () => {
  try {
    // Fetch identity
    const profileRes = await axios.get(`https://mzansibuilds-api.onrender.com/api/users/${developerEmail}`);
    profile.value = profileRes.data || { displayName: 'Anonymous Developer', email: developerEmail };

    // Fetch portfolio
    const projectsRes = await axios.get(`https://mzansibuilds-api.onrender.com/api/projects/author/${developerEmail}`);
    developerProjects.value = projectsRes.data;
  } catch (error) {
    console.error("Failed to load public profile data", error);
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8 pb-12">
    
    <div class="bg-mzansi-card p-8 rounded-xl border border-gray-800 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-2" :class="profile?.avatarClass || 'bg-mzansi-green'"></div>
      
      <div class="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border-4 border-gray-800 z-10" :class="profile?.avatarClass || 'bg-gray-800'">
        {{ profile?.avatarIcon || '👤' }}
      </div>
      
      <div class="flex-grow text-center md:text-left z-10">
        <h1 class="text-4xl font-extrabold text-white mb-2">{{ profile?.displayName || 'Unknown Developer' }}</h1>
        <p class="text-mzansi-green font-bold mb-4">{{ developerEmail }}</p>
        
        <p class="text-gray-300 text-lg mb-6 max-w-2xl leading-relaxed">
          {{ profile?.bio || 'This developer prefers to let their code do the talking.' }}
        </p>
        
        <a v-if="profile?.githubUrl" :href="profile.githubUrl" target="_blank" class="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full transition border border-gray-600">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path></svg>
          View GitHub Profile
        </a>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold text-white border-b-2 border-gray-800 pb-2 mb-6">Developer Portfolio</h2>
      
      <div v-if="developerProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="project in developerProjects" :key="project.id" class="bg-mzansi-dark p-6 rounded-xl border border-gray-800 hover:border-mzansi-green transition group relative">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xl font-bold text-white group-hover:text-mzansi-green transition">{{ project.title }}</h3>
            <span :class="project.status === 'Completed' ? 'text-purple-400' : 'text-mzansi-green'" class="text-xs font-bold uppercase tracking-wide">
              {{ project.stage }}
            </span>
          </div>
          <p class="text-gray-400 text-sm line-clamp-3 mb-4">{{ project.description }}</p>
          <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="text-gray-500 hover:text-white transition flex items-center gap-1 text-sm font-semibold">
            <span>🔗</span> Repository
          </a>
        </div>
      </div>
      
      <div v-else class="text-gray-500 italic text-center py-10 bg-mzansi-card rounded-xl border border-gray-800">
        This developer hasn't published any projects yet.
      </div>
    </div>

  </div>
</template>