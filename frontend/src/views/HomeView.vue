<template>
  <div class="relative flex flex-col items-center justify-center min-h-[75vh] text-center px-4 overflow-hidden rounded-3xl animate-gradient-bg bg-[length:400%_400%] bg-gradient-to-br from-mzansi-dark via-gray-900 to-mzansi-dark border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] mt-4">
    
    <div class="absolute top-10 left-10 w-72 h-72 bg-mzansi-green/10 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
    <div class="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
    <div class="absolute -bottom-8 left-1/2 w-72 h-72 bg-emerald-500/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>

    <div class="relative z-10 space-y-6">
      
      <h1 class="text-5xl md:text-7xl font-extrabold text-white tracking-tight animate-slide-up" style="animation-delay: 0.1s; animation-fill-mode: both;">
        Build in <span class="text-transparent bg-clip-text bg-gradient-to-r from-mzansi-green to-emerald-300 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">Public</span>
      </h1>
      
      <p class="text-xl text-gray-400 max-w-2xl font-medium leading-relaxed mx-auto animate-slide-up" style="animation-delay: 0.3s; animation-fill-mode: both;">
        The premier platform for Mzansi developers to pitch ideas, find collaborators, and ship real code.
      </p>
      
      <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4 animate-slide-up" style="animation-delay: 0.5s; animation-fill-mode: both;">
        <RouterLink to="/create" class="bg-mzansi-green text-mzansi-dark font-extrabold text-lg px-8 py-4 rounded-full hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all duration-300 hover:-translate-y-1">
          Start Building
        </RouterLink>
        <RouterLink to="/feed" class="bg-mzansi-card border border-gray-700 text-white font-bold text-lg px-8 py-4 rounded-full hover:border-mzansi-green hover:bg-gray-800 transition-all duration-300 hover:-translate-y-1">
          Explore Feed
        </RouterLink>
      </div>

    </div>
  </div>
</template>