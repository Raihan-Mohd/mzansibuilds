<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-mzansi-light font-sans flex flex-col">
    
    <nav class="bg-white shadow border-b-4 border-mzansi-green p-4">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <RouterLink to="/" class="text-2xl font-extrabold text-mzansi-dark">
          Mzansi<span class="text-mzansi-green">Builds</span>
        </RouterLink>

        <div class="space-x-6 font-semibold">
          <RouterLink to="/feed" class="text-gray-600 hover:text-mzansi-green">Live Feed</RouterLink>
          <RouterLink to="/create" class="bg-mzansi-dark text-white px-4 py-2 rounded hover:bg-mzansi-green">
            + New Project
          </RouterLink>
        </div>
      </div>
    </nav>

    <main class="flex-grow">
      <RouterView />
    </main>

  </div>
</template>