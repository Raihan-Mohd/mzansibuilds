<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const router = useRouter()
const currentUser = ref(null)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
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
  <div class="min-h-screen bg-mzansi-light font-sans flex flex-col">
    
    <nav class="bg-white shadow border-b-4 border-mzansi-green p-4">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        
        <RouterLink to="/" class="text-2xl font-extrabold text-mzansi-dark">
          Mzansi<span class="text-mzansi-green">Builds</span>
        </RouterLink>

        <div class="flex items-center space-x-6 font-semibold">
          <RouterLink to="/feed" class="text-gray-600 hover:text-mzansi-green transition">Live Feed</RouterLink>

          <template v-if="currentUser">
            <RouterLink to="/create" class="bg-mzansi-dark text-white px-4 py-2 rounded hover:bg-mzansi-green transition">
              + New Project
            </RouterLink>
            <button @click="handleLogout" class="text-sm font-bold text-red-500 hover:underline">
              Logout
            </button>
          </template>

          <template v-else>
            <RouterLink to="/login" class="bg-mzansi-green text-white px-4 py-2 rounded hover:bg-mzansi-dark transition">
              Log In
            </RouterLink>
          </template>

        </div>
      </div>
    </nav>

    <main class="flex-grow">
      <RouterView />
    </main>

  </div>
</template>