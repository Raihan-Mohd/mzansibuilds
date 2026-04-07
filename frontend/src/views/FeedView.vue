<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const projects = ref([]); 

const fetchProjects = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/projects');
    projects.value = response.data;
  } catch (error) {
    console.error("Failed to load feed", error);
  }
};

onMounted(() => {
  fetchProjects();
});
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <h1 class="text-4xl font-extrabold text-white border-b-4 border-mzansi-green pb-2 inline-block">
      Live Developer Feed
    </h1>
    
    <div v-for="project in projects" :key="project.id" 
         class="bg-mzansi-card p-6 rounded-xl shadow-2xl border border-gray-800 hover:border-mzansi-green/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 group">
      
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-2xl font-bold text-white group-hover:text-mzansi-green transition-colors">{{ project.title }}</h3>
        
        <span class="bg-mzansi-dark text-mzansi-green text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wide border border-mzansi-green/30">
          {{ project.stage }}
        </span>
      </div>
      
      <p class="text-gray-300 text-lg mb-6 leading-relaxed">{{ project.description }}</p>
      
      <div class="flex space-x-6 border-t border-gray-800 pt-4">
        <button class="text-sm font-semibold text-gray-500 hover:text-white transition-colors flex items-center gap-2">
          <span>💬</span> Comment
        </button>
        <button class="text-sm font-semibold text-gray-500 hover:text-mzansi-green transition-colors flex items-center gap-2">
          <span>✋</span> Raise Hand
        </button>
      </div>
    </div>
    
    <div v-if="projects.length === 0" class="text-center text-gray-500 italic py-10">
      No projects built yet. Be the first!
    </div>

  </div>
</template>