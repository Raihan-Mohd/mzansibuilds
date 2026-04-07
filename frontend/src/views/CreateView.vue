<script setup>
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; 

const router = useRouter(); 

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // If they aren't logged in, kick them back to the login page
    router.push('/login');
  }
});

const title = ref('');
const description = ref('');
const stage = ref('Idea'); 

const submitProject = async () => {
  try {
    const projectData = {
      title: title.value,
      description: description.value,
      stage: stage.value,
      status: 'in-progress'
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
          <label class="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea v-model="description" required rows="4"
                    class="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-mzansi-green outline-none transition" 
                    placeholder="What are you building?"></textarea>
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