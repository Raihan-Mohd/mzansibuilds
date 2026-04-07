<script setup>
import { onMounted } from 'vue';
import confetti from 'canvas-confetti';

onMounted(() => {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#10b981', '#111827', '#ffffff'] });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#10b981', '#111827', '#ffffff'] });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
});
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center">
    
    <div class="bg-mzansi-card p-12 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.15)] border border-gray-800 border-t-8 border-t-mzansi-green text-center max-w-2xl relative overflow-hidden">
      
      <div class="absolute inset-0 bg-gradient-to-b from-mzansi-green/5 to-transparent pointer-events-none"></div>

      <h1 class="text-5xl font-extrabold text-white mb-4 relative z-10">
        You <span class="text-mzansi-green drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">Shipped</span> It! 🚀
      </h1>
      
      <p class="text-xl text-gray-400 font-medium mb-10 relative z-10">
        Welcome to the Celebration Wall. This is where Mzansi developers come to celebrate shipping real code to the real world.
      </p>
      
      <RouterLink to="/feed" class="inline-block bg-mzansi-green text-mzansi-dark font-bold py-3 px-8 rounded-full hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 relative z-10">
        Back to the Feed
      </RouterLink>
      
    </div>
    
  </div>
</template>