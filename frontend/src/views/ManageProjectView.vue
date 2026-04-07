<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const route = useRoute();
const router = useRouter();
const projectId = route.params.id; 

const project = ref(null);
const newMilestone = ref('');
const isSaving = ref(false);

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.push('/login');
      return;
    }
    await loadProject();
  });
});

const loadProject = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
    project.value = response.data;
    
    // Security check: Only the author can manage this project
    if (project.value.author !== auth.currentUser.email) {
      alert("You do not have permission to edit this project.");
      router.push('/feed');
    }
  } catch (error) {
    console.error("Failed to load project", error);
  }
};

const saveUpdates = async () => {
  isSaving.value = true;
  try {
    await axios.put(`http://localhost:5000/api/projects/${projectId}`, project.value);
    alert('Updates saved successfully!');
  } catch (error) {
    console.error("Failed to save", error);
  } finally {
    isSaving.value = false;
  }
};

const addMilestone = async () => {
  if (!newMilestone.value) return;
  
  const milestoneData = {
    text: newMilestone.value,
    date: new Date().toLocaleDateString()
  };
  
  // Add to local state
  if (!project.value.milestones) project.value.milestones = [];
  project.value.milestones.unshift(milestoneData); // Add to beginning of array
  
  newMilestone.value = ''; // Clear input
  await saveUpdates(); // Save to database
};

const markAsComplete = async () => {
  const confirmed = confirm("Are you sure? This will lock the project and send it to the Celebration Wall!");
  if (confirmed) {
    project.value.status = 'Completed';
    project.value.stage = 'Launched';
    await saveUpdates();
    router.push('/celebration'); // Teleport to the confetti
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8" v-if="project">
    
    <div class="flex justify-between items-center border-b border-gray-800 pb-4">
      <h1 class="text-3xl font-extrabold text-white">Manage Project</h1>
      <button @click="markAsComplete" class="bg-gradient-to-r from-mzansi-green to-emerald-400 text-mzansi-dark font-extrabold px-6 py-2 rounded-full hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">
        🚀 Mark as Complete
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-mzansi-card p-6 rounded-xl border border-gray-800 space-y-4">
        <h2 class="text-xl font-bold text-mzansi-green mb-4">Edit Details</h2>
        
        <div>
          <label class="block text-sm font-semibold text-gray-400 mb-1">Title</label>
          <input v-model="project.title" type="text" class="w-full p-2 bg-mzansi-dark border border-gray-700 text-white rounded outline-none focus:border-mzansi-green">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-400 mb-1">Description</label>
          <textarea v-model="project.description" rows="4" class="w-full p-2 bg-mzansi-dark border border-gray-700 text-white rounded outline-none focus:border-mzansi-green"></textarea>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-400 mb-1">Support Required</label>
          <input v-model="project.supportRequired" type="text" class="w-full p-2 bg-mzansi-dark border border-gray-700 text-white rounded outline-none focus:border-mzansi-green">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-400 mb-1">Stage</label>
          <select v-model="project.stage" class="w-full p-2 bg-mzansi-dark border border-gray-700 text-white rounded outline-none focus:border-mzansi-green">
            <option>Idea</option>
            <option>Prototyping</option>
            <option>Development</option>
            <option>Testing</option>
          </select>
        </div>
        
        <button @click="saveUpdates" :disabled="isSaving" class="w-full bg-gray-800 text-white border border-gray-600 font-bold py-2 rounded hover:bg-gray-700 transition">
          {{ isSaving ? 'Saving...' : 'Save Edits' }}
        </button>
      </div>

      <div class="bg-mzansi-card p-6 rounded-xl border border-gray-800 flex flex-col">
        <h2 class="text-xl font-bold text-purple-400 mb-4">Project Timeline</h2>
        
        <div class="flex gap-2 mb-6">
          <input v-model="newMilestone" @keyup.enter="addMilestone" type="text" placeholder="e.g. Deployed the backend!" class="flex-grow p-2 bg-mzansi-dark border border-gray-700 text-white rounded outline-none focus:border-purple-500">
          <button @click="addMilestone" class="bg-purple-600 text-white px-4 py-2 rounded font-bold hover:bg-purple-500 transition">Add</button>
        </div>

        <div class="flex-grow overflow-y-auto space-y-4 pr-2">
          <div v-for="(milestone, index) in project.milestones" :key="index" class="border-l-2 border-purple-500 pl-4 py-1 relative">
            <div class="absolute w-3 h-3 bg-purple-500 rounded-full -left-[7px] top-2"></div>
            <p class="text-white font-medium">{{ milestone.text }}</p>
            <p class="text-xs text-gray-500">{{ milestone.date }}</p>
          </div>
          <div v-if="!project.milestones || project.milestones.length === 0" class="text-gray-500 italic text-sm">
            No milestones added yet. Log your first win!
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>