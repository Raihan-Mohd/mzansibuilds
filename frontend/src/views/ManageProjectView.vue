<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const route = useRoute();
const router = useRouter();
const projectId = route.params.id;

// state variables
const project = ref(null);
const newMilestone = ref('');
const isSaving = ref(false);

// Store profiles of people who want to collaborate
const collaboratorProfiles = ref([]);

//on page load
onMounted(() => {
  // First, verify they are logged in
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      router.push('/login');
      return;
    }
    // If logged in, go fetch the project details
    await loadProject();
  });
});

// load collaborators
// This takes the list of emails (people who raised hands) and fetches their names and avatars
const loadCollaboratorProfiles = async (emails) => {
  if (!emails || emails.length === 0) return;
  
  const profiles = [];
  // Loop through each email and ask the database for their profile
  for (const email of emails) {
    try {
      const res = await axios.get(`https://mzansibuilds-api.onrender.com/api/users/${email}`);
      if (res.data) profiles.push(res.data);
    } catch (err) {
      console.error("Failed to load profile for", email);
    }
  }
  collaboratorProfiles.value = profiles; // Update the screen with the fetched profiles
};

// load main project
const loadProject = async () => {
  try {
    // Ask the backend for the project matching the ID in our URL
    const response = await axios.get(`https://mzansibuilds-api.onrender.com/api/projects/${projectId}`);
    project.value = response.data;
    
    // security check, If the person viewing this page is not the author of the project, kick them out
    if (project.value.author !== auth.currentUser.email) {
      alert("You do not have permission to edit this project.");
      router.push('/feed');
      return;
    }

    // Load the profiles of anyone who raised their hand
    if (project.value.collaborators) {
      await loadCollaboratorProfiles(project.value.collaborators);
    }
  } catch (error) {
    console.error("Failed to load project", error);
  }
};

// update project
const saveUpdates = async () => {
  isSaving.value = true;
  try {
    await axios.put(`https://mzansibuilds-api.onrender.com/api/projects/${projectId}`, project.value);
    alert('Updates saved successfully!');
  } catch (error) {
    console.error("Failed to save", error);
  } finally {
    isSaving.value = false;
  }
};

// add milestone
const addMilestone = async () => {
  if (!newMilestone.value) return;
  const milestoneData = { text: newMilestone.value, date: new Date().toLocaleDateString() };
  if (!project.value.milestones) project.value.milestones = [];
  project.value.milestones.unshift(milestoneData);
  newMilestone.value = '';
  await saveUpdates();
};

//complete project
const markAsComplete = async () => {
  const confirmed = confirm("Are you sure? This will lock the project and send it to the Celebration Wall!");
  if (confirmed) {
    project.value.status = 'Completed';
    project.value.stage = 'Launched';
    await saveUpdates();
    router.push('/celebration');
  }
};

// Delete Project Logic
const deleteProject = async () => {
  const confirmed = confirm("⚠️ DANGER: Are you absolutely sure you want to delete this project? This cannot be undone.");
  if (confirmed) {
    try {
      await axios.delete(`https://mzansibuilds-api.onrender.com/api/projects/${projectId}`);
      router.push('/feed');
    } catch (error) {
      console.error("Failed to delete project", error);
      alert("Could not delete the project.");
    }
  }
};
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8 pb-12" v-if="project">
    
    <div class="flex justify-between items-center border-b border-gray-800 pb-4">
      <h1 class="text-3xl font-extrabold text-white">Manage Project</h1>
      <button @click="markAsComplete" class="bg-gradient-to-r from-mzansi-green to-emerald-400 text-mzansi-dark font-extrabold px-6 py-2 rounded-full hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all">
        🚀 Mark as Complete
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div class="bg-mzansi-card p-6 rounded-xl border border-gray-800 space-y-4 shadow-xl">
        <h2 class="text-xl font-bold text-mzansi-green mb-4 flex items-center gap-2"><span>✏️</span> Edit Details</h2>
        
        <div>
          <label class="block text-sm font-semibold text-gray-400 mb-1">Title</label>
          <input v-model="project.title" type="text" class="w-full p-3 bg-mzansi-dark border border-gray-700 text-white rounded outline-none focus:border-mzansi-green transition-all">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-400 mb-1">Description</label>
          <textarea v-model="project.description" rows="4" class="w-full p-3 bg-mzansi-dark border border-gray-700 text-white rounded outline-none focus:border-mzansi-green transition-all"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-400 mb-1">Support Required</label>
            <input v-model="project.supportRequired" type="text" placeholder="e.g. UI Designer" class="w-full p-3 bg-mzansi-dark border border-gray-700 text-white rounded outline-none focus:border-mzansi-green transition-all">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-400 mb-1">Stage</label>
            <select v-model="project.stage" class="w-full p-3 bg-mzansi-dark border border-gray-700 text-white rounded outline-none focus:border-mzansi-green transition-all">
              <option class="bg-mzansi-dark">Idea</option>
              <option class="bg-mzansi-dark">Prototyping</option>
              <option class="bg-mzansi-dark">Development</option>
              <option class="bg-mzansi-dark">Testing</option>
            </select>
          </div>
        </div>
        
        <button @click="saveUpdates" :disabled="isSaving" class="w-full bg-gray-800 text-white border border-gray-600 font-bold py-3 rounded hover:bg-gray-700 transition mt-4">
          {{ isSaving ? 'Saving...' : 'Save Edits' }}
        </button>
      </div>

      <div class="bg-mzansi-card p-6 rounded-xl border border-gray-800 flex flex-col shadow-xl">
        <h2 class="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2"><span>📈</span> Project Timeline</h2>
        
        <div class="flex gap-2 mb-6">
          <input v-model="newMilestone" @keyup.enter="addMilestone" type="text" placeholder="e.g. Deployed the backend!" class="flex-grow p-3 bg-mzansi-dark border border-gray-700 text-white rounded outline-none focus:border-purple-500 transition-all">
          <button @click="addMilestone" class="bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-500 transition shadow-lg">Add</button>
        </div>

        <div class="flex-grow overflow-y-auto space-y-4 pr-2 max-h-64">
          <div v-for="(milestone, index) in project.milestones" :key="index" class="border-l-2 border-purple-500 pl-4 py-1 relative">
            <div class="absolute w-3 h-3 bg-purple-500 rounded-full -left-[7px] top-2 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
            <p class="text-white font-medium">{{ milestone.text }}</p>
            <p class="text-xs text-gray-500">{{ milestone.date }}</p>
          </div>
          <div v-if="!project.milestones || project.milestones.length === 0" class="text-gray-500 italic text-sm">
            No milestones added yet. Log your first win!
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div class="bg-mzansi-card p-6 rounded-xl border border-gray-800 shadow-xl">
        <h2 class="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2"><span>🤝</span> Interested Collaborators</h2>
        <p class="text-sm text-gray-400 mb-4">These developers raised their hand to help out.</p>
        
        <div v-if="collaboratorProfiles.length > 0" class="space-y-3">
          <div v-for="profile in collaboratorProfiles" :key="profile.email" 
               class="flex items-center justify-between p-3 bg-mzansi-dark rounded-lg border border-gray-700">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl border border-gray-600" :class="profile.avatarClass || 'bg-gray-800'">
                {{ profile.avatarIcon || '👤' }}
              </div>
              <div>
                <p class="text-white font-bold text-sm">{{ profile.displayName }}</p>
                <p class="text-gray-500 text-xs">{{ profile.email }}</p>
              </div>
            </div>
            <a v-if="profile.githubUrl" :href="profile.githubUrl" target="_blank" class="text-blue-400 hover:text-blue-300 text-sm font-semibold">
              View GitHub &rarr;
            </a>
          </div>
        </div>
        
        <div v-else class="text-gray-500 italic text-sm p-4 bg-mzansi-dark rounded-lg border border-gray-800 text-center">
          No hands raised yet. Keep building!
        </div>
      </div>

      <div class="bg-mzansi-dark p-6 rounded-xl border border-red-900/50 shadow-xl relative overflow-hidden">
        <div class="absolute inset-0 bg-red-900/5 pointer-events-none"></div>
        
        <h2 class="text-xl font-bold text-red-500 mb-2 flex items-center gap-2 relative z-10"><span>⚠️</span> Danger Zone</h2>
        <p class="text-sm text-gray-400 mb-6 relative z-10">Once you delete a project, there is no going back. Please be certain.</p>
        
        <button @click="deleteProject" class="w-full bg-red-900/20 text-red-500 border border-red-900/50 font-bold py-3 rounded hover:bg-red-900/40 hover:text-red-400 transition relative z-10">
          Delete Project
        </button>
      </div>

    </div>
    
  </div>
</template>