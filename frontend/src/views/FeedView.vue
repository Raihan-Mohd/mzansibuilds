<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const projects = ref([]);
const currentUserEmail = ref('');
const currentUserProfile = ref(null);
const authorProfiles = ref({}); // Dictionary to store author avatars by email

// UI State Toggles
const activeCommentSection = ref(null);
const activeMilestoneSection = ref(null); // Tracks which timeline is open
const newCommentText = ref('');

const fetchAuthorProfile = async (email) => {
  if (authorProfiles.value[email]) return; 
  try {
    const res = await axios.get(`http://localhost:5000/api/users/${email}`);
    if (res.data) authorProfiles.value[email] = res.data;
  } catch (err) {
    console.error("Failed to load author profile", err);
  }
};

const fetchProjects = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/projects');
    projects.value = response.data;
    // Fetch avatars for every author on the feed
    projects.value.forEach(p => fetchAuthorProfile(p.author));
  } catch (error) {
    console.error("Failed to load feed", error);
  }
};

onMounted(() => {
  fetchProjects();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUserEmail.value = user.email;
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user.email}`);
        if (res.data) currentUserProfile.value = res.data;
      } catch (err) {}
    }
  });
});

const toggleComments = (projectId) => {
  activeCommentSection.value = activeCommentSection.value === projectId ? null : projectId;
  activeMilestoneSection.value = null; // Close milestones if open
};

const toggleMilestones = (projectId) => {
  activeMilestoneSection.value = activeMilestoneSection.value === projectId ? null : projectId;
  activeCommentSection.value = null; // Close comments if open
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
    const project = projects.value.find(p => p.id === projectId);
    if (!project.comments) project.comments = [];
    project.comments.push(response.data);
    newCommentText.value = '';
  } catch (error) {
    console.error("Failed to post comment", error);
  }
};

const toggleHand = async (projectId) => {
  if (!currentUserEmail.value) return;
  try {
    const response = await axios.post(`http://localhost:5000/api/projects/${projectId}/raise-hand`, {
      userEmail: currentUserEmail.value
    });
    
    const project = projects.value.find(p => p.id === projectId);
    if (!project.collaborators) project.collaborators = [];
    
    if (response.data.status === 'added') {
      project.collaborators.push(currentUserEmail.value);
    } else {
      project.collaborators = project.collaborators.filter(e => e !== currentUserEmail.value);
    }
  } catch (error) {
    console.error("Failed to toggle hand", error);
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8 relative z-10">
    <h1 class="text-4xl font-extrabold text-white border-b-4 border-mzansi-green pb-2 inline-block">
      Live Developer Feed
    </h1>
    
    <div v-for="project in projects" :key="project.id" 
         class="bg-mzansi-card p-6 rounded-xl shadow-2xl border border-gray-800 transition-all duration-300 group hover:border-gray-600">
      
      <div class="flex justify-between items-start mb-4">
        <RouterLink :to="`/developer/${project.author}`" class="flex items-center gap-4 cursor-pointer group/author">
          <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner border border-gray-700 transition-transform group-hover/author:scale-110"
               :class="authorProfiles[project.author]?.avatarClass || 'bg-gray-800'">
            {{ authorProfiles[project.author]?.avatarIcon || '👤' }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-2xl font-bold text-white group-hover:text-mzansi-green transition-colors">{{ project.title }}</h3>
              <a v-if="project.githubUrl" :href="project.githubUrl" @click.stop target="_blank" class="text-gray-500 hover:text-white transition-colors" title="View Repository">
                </a>
            </div>
            <p class="text-sm text-gray-400 font-medium group-hover/author:text-white transition-colors">By {{ authorProfiles[project.author]?.displayName || 'Anonymous Developer' }}</p>
          </div>
        </RouterLink>
        
        <span :class="project.status === 'Completed' ? 'bg-purple-900 text-purple-300 border-purple-500/30' : 'bg-mzansi-dark text-mzansi-green border-mzansi-green/30'" 
              class="text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wide border">
          {{ project.stage }}
        </span>
      </div>
      
      <p class="text-gray-300 text-lg mb-4 leading-relaxed pl-16">{{ project.description }}</p>

      <div v-if="project.supportRequired" class="mb-6 ml-16 inline-block bg-purple-900/20 border border-purple-500/30 text-purple-300 text-sm font-semibold px-3 py-1.5 rounded-md">
        🤝 Seeking: {{ project.supportRequired }}
      </div>
      
      <div class="flex items-center space-x-6 border-t border-gray-800 pt-4 mt-2">
        
        <button @click="toggleComments(project.id)" :class="activeCommentSection === project.id ? 'text-white' : 'text-gray-500'" class="text-sm font-semibold hover:text-white transition-colors flex items-center gap-2">
          <span>💬</span> {{ project.comments ? project.comments.length : 0 }} Comments
        </button>

        <button @click="toggleHand(project.id)" 
                :class="project.collaborators?.includes(currentUserEmail) ? 'text-mzansi-green border-b border-mzansi-green pb-1' : 'text-gray-500 hover:text-mzansi-green'"
                class="text-sm font-semibold transition-colors flex items-center gap-2">
          <span>✋</span> {{ project.collaborators?.includes(currentUserEmail) ? 'Hand Raised' : 'Raise Hand' }}
        </button>

        <button @click="toggleMilestones(project.id)" :class="activeMilestoneSection === project.id ? 'text-purple-400' : 'text-gray-500'" class="text-sm font-semibold hover:text-purple-400 transition-colors flex items-center gap-2 ml-4">
          <span>📈</span> View Progress
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

      <div v-if="activeMilestoneSection === project.id" class="mt-6 border-t border-gray-800 pt-6 animate-fade-in">
        <h4 class="text-purple-400 font-bold mb-4 text-sm tracking-widest uppercase">Project Timeline</h4>
        <div class="space-y-4 max-h-48 overflow-y-auto pr-2 pl-2">
          <div v-for="(milestone, index) in project.milestones" :key="index" class="border-l-2 border-purple-500 pl-4 py-1 relative">
            <div class="absolute w-3 h-3 bg-purple-500 rounded-full -left-[7px] top-2"></div>
            <p class="text-white font-medium">{{ milestone.text }}</p>
            <p class="text-xs text-gray-500">{{ milestone.date }}</p>
          </div>
          <div v-if="!project.milestones || project.milestones.length === 0" class="text-gray-500 italic text-sm">
            No milestones logged yet. They are working on it!
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>