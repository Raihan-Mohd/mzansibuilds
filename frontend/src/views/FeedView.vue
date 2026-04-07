<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const projects = ref([]);
const currentUserEmail = ref('');
const currentUserProfile = ref(null); 

const activeCommentSection = ref(null);
const newCommentText = ref('');

const fetchProjects = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/projects');
    projects.value = response.data;
  } catch (error) {
    console.error("Failed to load feed", error);
  }
};

const fetchUserProfile = async (email) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/users/${email}`);
    if (response.data) currentUserProfile.value = response.data;
  } catch (error) {
    console.error("Failed to load profile", error);
  }
};

onMounted(() => {
  fetchProjects();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUserEmail.value = user.email;
      fetchUserProfile(user.email);
    }
  });
});

const toggleComments = (projectId) => {
  if (activeCommentSection.value === projectId) {
    activeCommentSection.value = null; // Close it if already open
  } else {
    activeCommentSection.value = projectId; // Open this one
  }
};

const submitComment = async (projectId) => {
  if (!newCommentText.value.trim() || !currentUserProfile.value) {
    alert("Please set up your profile first to leave a comment!");
    return;
  }

  try {
    const response = await axios.post(`http://localhost:5000/api/projects/${projectId}/comments`, {
      text: newCommentText.value,
      author: currentUserProfile.value.displayName,
      avatarIcon: currentUserProfile.value.avatarIcon
    });

    // Update the local view instantly without refreshing the page
    const project = projects.value.find(p => p.id === projectId);
    if (!project.comments) project.comments = [];
    project.comments.push(response.data);
    
    newCommentText.value = ''; // Clear input
  } catch (error) {
    console.error("Failed to post comment", error);
  }
};

const raiseHand = async (projectId) => {
  if (!currentUserEmail.value) return;
  
  try {
    await axios.post(`http://localhost:5000/api/projects/${projectId}/raise-hand`, {
      userEmail: currentUserEmail.value
    });
    
    // Update local view
    const project = projects.value.find(p => p.id === projectId);
    if (!project.collaborators) project.collaborators = [];
    if (!project.collaborators.includes(currentUserEmail.value)) {
      project.collaborators.push(currentUserEmail.value);
    }
    
    alert("Hand raised! The author has been notified.");
  } catch (error) {
    console.error("Failed to raise hand", error);
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <h1 class="text-4xl font-extrabold text-white border-b-4 border-mzansi-green pb-2 inline-block">
      Live Developer Feed
    </h1>
    
    <div v-for="project in projects" :key="project.id" 
         class="bg-mzansi-card p-6 rounded-xl shadow-2xl border border-gray-800 transition-all duration-300 group">
      
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-2xl font-bold text-white group-hover:text-mzansi-green transition-colors">{{ project.title }}</h3>
          <p class="text-xs text-gray-500 mt-1">Built by: {{ project.author }}</p>
        </div>
        
        <span :class="project.status === 'Completed' ? 'bg-purple-900 text-purple-300 border-purple-500/30' : 'bg-mzansi-dark text-mzansi-green border-mzansi-green/30'" 
              class="text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wide border">
          {{ project.stage }}
        </span>
      </div>
      
      <p class="text-gray-300 text-lg mb-4 leading-relaxed">{{ project.description }}</p>

      <div v-if="project.supportRequired" class="mb-6 inline-block bg-purple-900/20 border border-purple-500/30 text-purple-300 text-sm font-semibold px-3 py-1.5 rounded-md">
        🤝 Seeking: {{ project.supportRequired }}
      </div>
      
      <div class="flex items-center space-x-6 border-t border-gray-800 pt-4">
        
        <button @click="toggleComments(project.id)" class="text-sm font-semibold text-gray-500 hover:text-white transition-colors flex items-center gap-2">
          <span>💬</span> {{ project.comments ? project.comments.length : 0 }} Comments
        </button>

        <button @click="raiseHand(project.id)" 
                :disabled="project.collaborators && project.collaborators.includes(currentUserEmail)"
                :class="project.collaborators && project.collaborators.includes(currentUserEmail) ? 'text-mzansi-green cursor-default' : 'text-gray-500 hover:text-mzansi-green'"
                class="text-sm font-semibold transition-colors flex items-center gap-2">
          <span>✋</span> {{ project.collaborators && project.collaborators.includes(currentUserEmail) ? 'Hand Raised' : 'Raise Hand' }}
        </button>

        <RouterLink v-if="project.author === currentUserEmail" :to="`/manage/${project.id}`" 
                    class="ml-auto text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 bg-purple-900/20 px-3 py-1.5 rounded hover:bg-purple-900/40">
          <span>⚙️</span> Manage
        </RouterLink>
      </div>

      <div v-if="activeCommentSection === project.id" class="mt-6 border-t border-gray-800 pt-6 animate-fade-in">
        
        <div class="space-y-4 mb-4 max-h-48 overflow-y-auto pr-2">
          <div v-for="(comment, index) in project.comments" :key="index" class="bg-mzansi-dark p-3 rounded-lg border border-gray-700">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xl">{{ comment.avatarIcon }}</span>
              <span class="text-sm font-bold text-gray-300">{{ comment.author }}</span>
            </div>
            <p class="text-gray-400 text-sm pl-8">{{ comment.text }}</p>
          </div>
          <div v-if="!project.comments || project.comments.length === 0" class="text-gray-500 italic text-sm pl-2">
            No comments yet. Start the conversation!
          </div>
        </div>

        <div class="flex gap-2">
          <input v-model="newCommentText" @keyup.enter="submitComment(project.id)" type="text" placeholder="Type an encouraging comment..." 
                 class="flex-grow p-2 bg-mzansi-dark border border-gray-700 text-white rounded outline-none focus:border-mzansi-green placeholder-gray-600 text-sm">
          <button @click="submitComment(project.id)" class="bg-mzansi-green text-mzansi-dark font-bold px-4 py-2 rounded text-sm hover:bg-emerald-400 transition">
            Post
          </button>
        </div>

      </div>

    </div>
    
    <div v-if="projects.length === 0" class="text-center text-gray-500 italic py-10">
      No projects built yet. Be the first!
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>