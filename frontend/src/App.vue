<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import axios from 'axios'

const router = useRouter()
const currentUser = ref(null)
const userProfile = ref(null) 

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    if (user) {
      try {
        const response = await axios.get(`https://mzansibuilds-api.onrender.com/api/users/${user.email}`)
        userProfile.value = response.data
      } catch (error) {
        console.error("Failed to load global profile", error)
      }
    } else {
      userProfile.value = null // Clear it when log out
    }
  })
})

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/feed')
  } catch (error) {
    console.error("Logout failed", error)
  }
}
</script>

<template>
  <div class="min-h-screen font-sans flex flex-col relative">
    
    <nav class="fixed w-full z-50 bg-mzansi-dark/80 backdrop-blur-md border-b border-gray-800">
      <div class="max-w-6xl mx-auto flex justify-between items-center p-4">
        
        <RouterLink to="/" class="text-2xl font-extrabold text-white tracking-tight">
          Mzansi<span class="text-mzansi-green drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">Builds</span>
        </RouterLink>

        <div class="flex items-center space-x-6 font-semibold">
          <RouterLink to="/feed" class="text-gray-400 hover:text-white transition-colors">Live Feed</RouterLink>

          <RouterLink to="/celebration" class="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
            <span>🎉</span> The Wall
          </RouterLink>

          <template v-if="currentUser">
            <RouterLink to="/create" class="bg-mzansi-green text-mzansi-dark px-4 py-2 rounded-md hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
              + New Project
            </RouterLink>
            
            <RouterLink to="/profile" class="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-lg transition-transform group-hover:scale-110 shadow-lg border border-gray-700" 
                   :class="userProfile?.avatarClass || 'bg-gray-800'">
                {{ userProfile?.avatarIcon || '👤' }}
              </div>
              <span class="hidden sm:inline font-bold">{{ userProfile?.displayName || 'Set Profile' }}</span>
            </RouterLink>
            
            <button @click="handleLogout" class="text-sm font-bold text-gray-500 hover:text-red-400 transition-colors ml-2 border-l border-gray-700 pl-4">
              Logout
            </button>
          </template>

          <template v-else>
            <RouterLink to="/login" class="border border-mzansi-green text-mzansi-green px-4 py-2 rounded-md hover:bg-mzansi-green hover:text-mzansi-dark transition-all">
              Log In
            </RouterLink>
          </template>

        </div>
      </div>
    </nav>

    <main class="flex-grow pt-24 pb-12 px-4">
      <RouterView v-slot="{ Component, route }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </RouterView>
    </main>

  </div>
</template>

<style>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>