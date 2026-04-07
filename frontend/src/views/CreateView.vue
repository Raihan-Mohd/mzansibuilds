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

const polishPitch = async () => {
  if (!description.value) {
    alert("Please type a rough idea in the description box first!");
    return;
  }
  
  isPolishing.value = true;
  
  try {
    const response = await axios.post('http://localhost:5000/api/polish-pitch', {
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
      author: auth.currentUser.email 
    };

    await axios.post('http://localhost:5000/api/projects', projectData);
    router.push('/feed');
    
  } catch (error) {
    console.error(error);
    alert('Failed to save project. Is the backend running?');
  }
};
</script>

<template>
  <div class="p-8 max-w-2xl mx-auto">
    <div class="bg-white p-8 rounded-xl shadow-lg border-t-4 border-mzansi-green">
      <h1 class="text-3xl font-extrabold text-mzansi-dark mb-6">Build in Public</h1>
      
      <form @submit.prevent="submitProject" class="space-y-6">
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Project Title</label>
          <input v-model="title" type="text" required 
                 class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mzansi-green outline-none transition" 
                 placeholder="e.g. MzansiBuilds Platform">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">GitHub Repository URL (Optional)</label>
          <input v-model="githubUrl" type="url" 
                 class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mzansi-green outline-none transition" 
                 placeholder="https://github.com/your-username/repo-name">
        </div>

        <div>
          <div class="flex justify-between items-end mb-1">
            <label class="block text-sm font-semibold text-gray-700">Description</label>
            <button @click.prevent="polishPitch" :disabled="isPolishing"
                    class="text-xs bg-purple-100 text-purple-700 font-bold px-3 py-1.5 rounded hover:bg-purple-200 transition disabled:opacity-50 flex items-center gap-1">
              <span>✨</span>
              {{ isPolishing ? 'Polishing...' : 'Polish with AI' }}
            </button>
          </div>
          <textarea v-model="description" required rows="5"
                    class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400 outline-none transition" 
                    placeholder="Type a rough sentence about your project, then click 'Polish with AI' to make it sound professional!"></textarea>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Current Stage</label>
          <select v-model="stage" 
                  class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mzansi-green outline-none transition">
            <option>Idea</option>
            <option>Prototyping</option>
            <option>Development</option>
            <option>Testing</option>
          </select>
        </div>

        <button type="submit" 
                class="w-full bg-mzansi-dark text-white font-bold text-lg py-3 rounded hover:bg-mzansi-green transition duration-300">
          Publish Project
        </button>

      </form>
    </div>
  </div>
</template>