<script setup>
import { ref } from 'vue';
import axios from 'axios'; // used to talk to nodejs backend
import { useToast } from 'vue-toastification';

// defineProps here defines the data that the parent page (like FeedView) passes down into this individual card
const props = defineProps({
  project: { type: Object, required: true },
  authorProfile: { type: Object, default: () => ({}) },
  currentUserEmail: { type: String, default: '' },
  currentUserProfile: { type: Object, default: () => null }
});

const toast = useToast();

const isCommentsOpen = ref(false);
const isMilestonesOpen = ref(false);
const newCommentText = ref('');

// Here it makes local copies of the comments/collaborators arrays
// This is so that when a user clicks "Post Comment", we can add it to this local list and the screen updates instantly
const localComments = ref(props.project.comments || []);
const localCollaborators = ref(props.project.collaborators || []);

// Function to open/close the comments dropdown
const toggleComments = () => {
  isCommentsOpen.value = !isCommentsOpen.value;
  isMilestonesOpen.value = false;
};

// Function to open/close the milestones dropdown
const toggleMilestones = () => {
  isMilestonesOpen.value = !isMilestonesOpen.value;
  isCommentsOpen.value = false;
};

// Function that runs when the user clicks "Post" on a comment
const submitComment = async () => {
  if (!newCommentText.value.trim() || !props.currentUserProfile) {
    toast.warning("Please set up your profile first to leave a comment!");
    return;
  }
  try {
    // Sends the comment text to the backend to be saved in Firebase
    const response = await axios.post(`https://mzansibuilds-api.onrender.com/api/projects/${props.project.id}/comments`, {
      text: newCommentText.value,
      author: props.currentUserProfile.displayName,
      avatarIcon: props.currentUserProfile.avatarIcon
    });
    // Adds the new comment to our local screen so the user sees it immediately
    localComments.value.push(response.data);
    newCommentText.value = '';
    toast.success("Comment posted!");
  } catch (error) {
    toast.error("Failed to post comment.");
  }
};

// Function that runs when a user clicks the "Raise Hand" button
const toggleHand = async () => {
  if (!props.currentUserEmail) {
    toast.warning("Please log in to raise your hand!");
    return;
  }
  try {
    // Tell the backend to either add or remove the user from this project's list
    const response = await axios.post(`https://mzansibuilds-api.onrender.com/api/projects/${props.project.id}/raise-hand`, {
      userEmail: props.currentUserEmail
    });
    
    // Update the visual button depending on what the backend decided
    if (response.data.status === 'added') {
      localCollaborators.value.push(props.currentUserEmail);
      toast.success("Hand raised!");
    } else {
        // filter() creates a new array that removes the user's email if they lowered their hand
      localCollaborators.value = localCollaborators.value.filter(e => e !== props.currentUserEmail);
      toast.info("Hand lowered.");
    }
  } catch (error) {
    toast.error("Failed to toggle hand.");
  }
};
</script>

<template>
  <div class="bg-mzansi-card p-6 rounded-xl shadow-2xl border border-gray-800 transition-all duration-300 group hover:border-gray-600">
    
    <div class="flex justify-between items-start mb-4">
      <RouterLink :to="`/developer/${project.author}`" class="flex items-center gap-4 cursor-pointer group/author">
        <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner border border-gray-700 transition-transform group-hover/author:scale-110"
             :class="authorProfile?.avatarClass || 'bg-gray-800'">
          {{ authorProfile?.avatarIcon || '👤' }}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-2xl font-bold text-white group-hover:text-mzansi-green transition-colors">{{ project.title }}</h3>
            <a v-if="project.githubUrl" :href="project.githubUrl" @click.stop target="_blank" class="text-gray-500 hover:text-white transition-colors" title="View Repository">
              🔗
            </a>
          </div>
          <p class="text-sm text-gray-400 font-medium group-hover/author:text-white transition-colors">By {{ authorProfile?.displayName || 'Anonymous Developer' }}</p>
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
      <button @click="toggleComments" :class="isCommentsOpen ? 'text-white' : 'text-gray-500'" class="text-sm font-semibold hover:text-white transition-colors flex items-center gap-2">
        <span>💬</span> {{ localComments.length }} Comments
      </button>

      <button @click="toggleHand" 
              :class="localCollaborators.includes(currentUserEmail) ? 'text-mzansi-green border-b border-mzansi-green pb-1' : 'text-gray-500 hover:text-mzansi-green'"
              class="text-sm font-semibold transition-colors flex items-center gap-2">
        <span>✋</span> {{ localCollaborators.includes(currentUserEmail) ? 'Hand Raised' : 'Raise Hand' }}
      </button>

      <button @click="toggleMilestones" :class="isMilestonesOpen ? 'text-purple-400' : 'text-gray-500'" class="text-sm font-semibold hover:text-purple-400 transition-colors flex items-center gap-2 ml-4">
        <span>📈</span> View Progress
      </button>

      <RouterLink v-if="project.author === currentUserEmail" :to="`/manage/${project.id}`" 
                  class="ml-auto text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 bg-purple-900/20 px-3 py-1.5 rounded hover:bg-purple-900/40">
        <span>⚙️</span> Manage
      </RouterLink>
    </div>

    <div v-if="isCommentsOpen" class="mt-6 border-t border-gray-800 pt-6 animate-fade-in">
      <div class="space-y-4 mb-4 max-h-48 overflow-y-auto pr-2">
        <div v-for="(comment, index) in localComments" :key="index" class="bg-mzansi-dark p-3 rounded-lg border border-gray-700">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xl">{{ comment.avatarIcon }}</span>
            <span class="text-sm font-bold text-gray-300">{{ comment.author }}</span>
          </div>
          <p class="text-gray-400 text-sm pl-8">{{ comment.text }}</p>
        </div>
        <div v-if="localComments.length === 0" class="text-gray-500 italic text-sm pl-2">
          No comments yet. Start the conversation!
        </div>
      </div>
      <div class="flex gap-2">
        <input v-model="newCommentText" @keyup.enter="submitComment" type="text" placeholder="Type an encouraging comment..." 
               class="flex-grow p-2 bg-mzansi-dark border border-gray-700 text-white rounded outline-none focus:border-mzansi-green placeholder-gray-600 text-sm">
        <button @click="submitComment" class="bg-mzansi-green text-mzansi-dark font-bold px-4 py-2 rounded text-sm hover:bg-emerald-400 transition">
          Post
        </button>
      </div>
    </div>

    <div v-if="isMilestonesOpen" class="mt-6 border-t border-gray-800 pt-6 animate-fade-in">
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
</template>

<style scoped>
/* custom css to make the dropdown animate better and more smoothly */
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>