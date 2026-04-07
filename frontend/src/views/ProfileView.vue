<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const userEmail = ref('');
const displayName = ref('');
const bio = ref('');
const githubUrl = ref('');
const selectedAvatar = ref(null);
const isSaving = ref(false);
const saveMessage = ref('');

// Avatar Options
const avatars = [
  { id: 'neon', class: 'bg-gradient-to-br from-emerald-400 to-cyan-400', icon: '⚡' },
  { id: 'cyber', class: 'bg-gradient-to-br from-purple-500 to-indigo-500', icon: '👾' },
  { id: 'hacker', class: 'bg-mzansi-dark border-2 border-mzansi-green shadow-[0_0_10px_rgba(16,185,129,0.5)]', icon: '💻' },
  { id: 'sunset', class: 'bg-gradient-to-br from-orange-400 to-rose-400', icon: '🔥' },
  { id: 'matrix', class: 'bg-gradient-to-b from-green-900 to-black border border-green-500', icon: '👁️' },
  { id: 'ghost', class: 'bg-gray-100 text-black', icon: '👻' }
];

// Security Guard & Data Fetcher
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = '/login'; // Kick out guests
      return;
    }
    userEmail.value = user.email;
    
    // Check if they already have a profile saved in backend
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user.email}`);
      if (response.data) {
        displayName.value = response.data.displayName || '';
        bio.value = response.data.bio || '';
        githubUrl.value = response.data.githubUrl || '';
        
        // Find their saved avatar from list
        const savedAvatar = avatars.find(a => a.icon === response.data.avatarIcon);
        if (savedAvatar) selectedAvatar.value = savedAvatar;
      } else {
        selectedAvatar.value = avatars[0]; // Default to first avatar if brand new
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  });
});

const saveProfile = async () => {
  isSaving.value = true;
  saveMessage.value = '';
  
  try {
    await axios.post('http://localhost:5000/api/users', {
      email: userEmail.value,
      displayName: displayName.value,
      bio: bio.value,
      githubUrl: githubUrl.value,
      avatarClass: selectedAvatar.value.class,
      avatarIcon: selectedAvatar.value.icon
    });
    saveMessage.value = 'Profile successfully updated!';
    setTimeout(() => saveMessage.value = '', 3000); // Clear message after 3 seconds
  } catch (error) {
    console.error("Failed to save", error);
    saveMessage.value = 'Error saving profile.';
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="bg-mzansi-card p-8 rounded-xl shadow-2xl border border-gray-800 border-t-4 border-t-purple-500">
      <h1 class="text-3xl font-extrabold text-white mb-2">Developer Identity</h1>
      <p class="text-gray-400 mb-8">Customize how the MzansiBuilds community sees you.</p>
      
      <form @submit.prevent="saveProfile" class="space-y-8">
        
        <div>
          <label class="block text-sm font-semibold text-gray-400 mb-4">Choose your Avatar</label>
          <div class="flex flex-wrap gap-4">
            <div v-for="avatar in avatars" :key="avatar.id" 
                 @click="selectedAvatar = avatar"
                 :class="[
                   'w-16 h-16 rounded-full flex items-center justify-center text-2xl cursor-pointer transition-all duration-300',
                   avatar.class,
                   selectedAvatar?.id === avatar.id ? 'ring-4 ring-offset-2 ring-offset-mzansi-card ring-white scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'
                 ]">
              {{ avatar.icon }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-400 mb-2">Display Name</label>
            <input v-model="displayName" type="text" required 
                   class="w-full p-3 bg-mzansi-dark border border-gray-700 text-white rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-gray-600" 
                   placeholder="e.g. CodeNinja99">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-400 mb-2">GitHub URL</label>
            <input v-model="githubUrl" type="url" 
                   class="w-full p-3 bg-mzansi-dark border border-gray-700 text-white rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-gray-600" 
                   placeholder="https://github.com/username">
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-400 mb-2">About Me</label>
          <textarea v-model="bio" rows="3"
                    class="w-full p-3 bg-mzansi-dark border border-gray-700 text-white rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-gray-600" 
                    placeholder="What are your favorite tech stacks?"></textarea>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-gray-800">
          <p :class="saveMessage.includes('Error') ? 'text-red-400' : 'text-mzansi-green'" class="font-bold">
            {{ saveMessage }}
          </p>
          <button type="submit" :disabled="isSaving"
                  class="bg-purple-600 text-white font-extrabold px-8 py-3 rounded-md hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 disabled:opacity-50">
            {{ isSaving ? 'Saving...' : 'Save Profile' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>