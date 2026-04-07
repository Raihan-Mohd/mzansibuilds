<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const router = useRouter();

onAuthStateChanged(auth, (user) => {
  if (!user) {
    router.push('/login');
  }
});

// Form Variables
const title = ref('');
const description = ref('');
const stage = ref('Idea'); 
const githubUrl = ref(''); 
const isPolishing = ref(false); 
const supportRequired = ref('');

const polishPitch = async () => {
  if (!description.value) {
    alert("Please type a rough idea in the description box first!");
    return;
  }
  
  isPolishing.value = true;
  
  try {
    const response = await axios.post('https://mzansibuilds-api.onrender.com/api/polish-pitch', {
      roughText: description.value
    });
    
    description.value = response.data.polishedText;
    
  } catch (error) {
    console.error("AI connection failed:", error);
    alert("Failed to connect to AI. Check if backend is running.");
  } finally {
    isPolishing.value = false;
  }
};

// The Submit Function
const submitProject = async () => {
  try {
    const projectData = {
      title: title.value,
      description: description.value,
      stage: stage.value,
      githubUrl: githubUrl.value, 
      status: 'in-progress',
      author: auth.currentUser.email,
      supportRequired: supportRequired.value
    };

    await axios.post('https://mzansibuilds-api.onrender.com/api/projects', projectData);
    router.push('/feed');
    
  } catch (error) {
    console.error(error);
    alert('Failed to save project. Is the backend running?');
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-mzansi-card p-8 rounded-xl shadow-2xl border border-gray-800 border-t-4 border-t-mzansi-green">
      <h1 class="text-3xl font-extrabold text-white mb-6">Build in Public</h1>
      
      <form @submit.prevent="submitProject" class="space-y-6">
        
        <div>
          <label class="block text-sm font-semibold text-gray-400 mb-2">Project Title</label>
          <input v-model="title" type="text" required 
                 class="w-full p-3 bg-mzansi-dark border border-gray-700 text-white rounded-md focus:ring-2 focus:ring-mzansi-green focus:border-transparent outline-none transition-all placeholder-gray-600" 
                 placeholder="e.g. MzansiBuilds Platform">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-400 mb-2">GitHub Repository URL (Optional)</label>
          <input v-model="githubUrl" type="url" 
                 class="w-full p-3 bg-mzansi-dark border border-gray-700 text-white rounded-md focus:ring-2 focus:ring-mzansi-green focus:border-transparent outline-none transition-all placeholder-gray-600" 
                 placeholder="https://github.com/your-username/repo-name">
        </div>

        <div>
          <div class="flex justify-between items-end mb-2">
            <label class="block text-sm font-semibold text-gray-400">Description</label>
            <button @click.prevent="polishPitch" :disabled="isPolishing"
                    class="text-xs bg-purple-900/30 text-purple-400 border border-purple-500/30 font-bold px-3 py-1.5 rounded hover:bg-purple-900/50 hover:text-purple-300 transition-all disabled:opacity-50 flex items-center gap-1">
              <span>✨</span>
              {{ isPolishing ? 'Polishing...' : 'Polish with AI' }}
            </button>
          </div>
          <textarea v-model="description" required rows="5"
                    class="w-full p-3 bg-mzansi-dark border border-gray-700 text-white rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-600" 
                    placeholder="Type a rough sentence about your project..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-400 mb-2">Support Required (Optional)</label>
          <input v-model="supportRequired" type="text" 
                 class="w-full p-3 bg-mzansi-dark border border-gray-700 text-white rounded-md focus:ring-2 focus:ring-mzansi-green outline-none transition-all placeholder-gray-600" 
                 placeholder="e.g. Need a UI Designer, Looking for QA testers">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-400 mb-2">Current Stage</label>
          <select v-model="stage" 
                  class="w-full p-3 bg-mzansi-dark border border-gray-700 text-white rounded-md focus:ring-2 focus:ring-mzansi-green focus:border-transparent outline-none transition-all">
            <option class="bg-mzansi-dark text-white">Idea</option>
            <option class="bg-mzansi-dark text-white">Prototyping</option>
            <option class="bg-mzansi-dark text-white">Development</option>
            <option class="bg-mzansi-dark text-white">Testing</option>
          </select>
        </div>

        <button type="submit" 
                class="w-full bg-mzansi-green text-mzansi-dark font-extrabold text-lg py-3 rounded-md hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 mt-4">
          Publish Project
        </button>

      </form>
    </div>
  </div>
</template>