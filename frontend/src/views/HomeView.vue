<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    
    <h1 class="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
      Build in <span class="text-transparent bg-clip-text bg-gradient-to-r from-mzansi-green to-emerald-300 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">Public</span>
    </h1>
    
    <p class="text-xl text-gray-400 mb-10 max-w-2xl font-medium leading-relaxed">
      The premier platform for Mzansi developers to pitch ideas, find collaborators, and ship real code.
    </p>
    
    <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
      <RouterLink to="/create" class="bg-mzansi-green text-mzansi-dark font-extrabold text-lg px-8 py-4 rounded-full hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all duration-300">
        Start Building
      </RouterLink>
      <RouterLink to="/feed" class="bg-mzansi-card border border-gray-700 text-white font-bold text-lg px-8 py-4 rounded-full hover:border-mzansi-green hover:bg-gray-800 transition-all duration-300">
        Explore Feed
      </RouterLink>
    </div>

  </div>
</template>