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
  <div class="min-h-[80vh] flex items-center justify-center bg-mzansi-light">
    <div class="bg-white p-12 rounded-2xl shadow-xl border-t-8 border-mzansi-green text-center max-w-2xl">
      <h1 class="text-5xl font-extrabold text-mzansi-dark mb-4">
        You <span class="text-mzansi-green">Shipped</span> It! 🚀
      </h1>
      <p class="text-xl text-gray-600 font-semibold mb-8">
        Welcome to the Celebration Wall. This is where Mzansi developers come to celebrate shipping real code to the real world.
      </p>
      <RouterLink to="/feed" class="bg-mzansi-dark text-white font-bold py-3 px-8 rounded-full hover:bg-mzansi-green transition duration-300">
        Back to the Feed
      </RouterLink>
    </div>
  </div>
</template>