<script setup>
import { ref } from 'vue';
import axios from 'axios';

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

    const response = await axios.post('http://localhost:5000/api/projects', projectData);
    
    alert('Success! ' + response.data.message);
    title.value = '';
    description.value = '';
    
  } catch (error) {
    console.error(error);
    alert('Axios crashed. Check that the backend is running');
  }
};
</script>

<template>
  <div class="min-h-screen bg-mzansi-light flex items-center justify-center p-6">
    
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-mzansi-green">
      <h1 class="text-2xl font-bold text-mzansi-dark mb-6">Create a New Project</h1>
      
      <form @submit.prevent="submitProject" class="space-y-4">
        
        <div>
          <label class="block text-sm font-semibold text-gray-700">Project Title</label>
          <input v-model="title" type="text" required 
                 class="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-mzansi-green outline-none" 
                 placeholder="eg. MzansiBuilds Platform">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700">Description</label>
          <textarea v-model="description" required rows="3"
                    class="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-mzansi-green outline-none" 
                    placeholder="What are you building?"></textarea>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700">Current Stage</label>
          <select v-model="stage" 
                  class="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-mzansi-green outline-none">
            <option>Idea</option>
            <option>Prototyping</option>
            <option>Development</option>
            <option>Testing</option>
          </select>
        </div>

        <button type="submit" 
                class="w-full bg-mzansi-dark text-white font-bold py-2 px-4 rounded hover:bg-mzansi-green transition duration-300">
          Publish Project
        </button>

      </form>
    </div>

  </div>
</template>