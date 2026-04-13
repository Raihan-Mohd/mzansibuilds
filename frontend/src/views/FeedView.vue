<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useToast } from 'vue-toastification';

import ProjectCard from '../components/ProjectCard.vue';

const projects = ref([]);
const currentUserEmail = ref('');
const currentUserProfile = ref(null);
const authorProfiles = ref({}); 

const toast = useToast();
const isLoading = ref(true);

const fetchAuthorProfile = async (email) => {
  if (authorProfiles.value[email]) return; 
  try {
    const res = await axios.get(`https://mzansibuilds-api.onrender.com/api/users/${email}`);
    if (res.data) authorProfiles.value[email] = res.data;
  } catch (err) {
    console.error("Failed to load author profile", err);
  }
};

const fetchProjects = async () => {
  try {
    const response = await axios.get('https://mzansibuilds-api.onrender.com/api/projects');
    projects.value = response.data;
    projects.value.forEach(p => fetchAuthorProfile(p.author));
  } catch (error) {
    console.error("Failed to load feed", error);
    toast.error("Failed to connect to the server. It might be waking up!");
  }
  finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchProjects();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUserEmail.value = user.email;
      try {
        const res = await axios.get(`https://mzansibuilds-api.onrender.com/api/users/${user.email}`);
        if (res.data) currentUserProfile.value = res.data;
      } catch (err) {}
    }
  });
});
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8 relative z-10">
    <h1 class="text-4xl font-extrabold text-white border-b-4 border-mzansi-green pb-2 inline-block">
      Live Developer Feed
    </h1>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 space-y-4">
      <div class="w-12 h-12 border-4 border-gray-700 border-t-mzansi-green rounded-full animate-spin"></div>
      <p class="text-mzansi-green font-bold animate-pulse">Waking up the server...</p>
    </div>

    <div v-else-if="projects.length > 0" class="space-y-8">
      <ProjectCard 
        v-for="project in projects" 
        :key="project.id" 
        :project="project"
        :authorProfile="authorProfiles[project.author]"
        :currentUserEmail="currentUserEmail"
        :currentUserProfile="currentUserProfile"
      />
    </div>
    
    <div v-else class="text-center text-gray-500 italic py-10">
      No projects built yet. Be the first!
    </div>
  </div>
</template>