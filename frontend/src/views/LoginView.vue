<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const router = useRouter();

const email = ref('');
const password = ref('');
const isRegistering = ref(false); 
const errorMessage = ref('');

const handleEmailAuth = async () => {
  try {
    if (isRegistering.value) {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
    } else {
      await signInWithEmailAndPassword(auth, email.value, password.value);
    }
    router.push('/feed'); 
  } catch (error) {
    errorMessage.value = error.message; 
  }
};

const handleGoogleLogin = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    router.push('/feed');
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-10">
    <div class="bg-mzansi-card p-8 rounded-xl shadow-2xl border border-gray-800 border-t-4 border-t-mzansi-green">
      
      <h1 class="text-3xl font-extrabold text-white mb-2 text-center">
        {{ isRegistering ? 'Join the Community' : 'Welcome Back' }}
      </h1>
      <p class="text-center text-gray-400 mb-6 font-medium">
        {{ isRegistering ? 'Create your developer account' : 'Sign in to pitch your next project' }}
      </p>

      <button @click="handleGoogleLogin" 
              class="w-full flex items-center justify-center gap-3 bg-gray-800 border border-gray-700 text-white font-bold py-3 px-4 rounded hover:bg-gray-700 transition duration-300 mb-6 shadow-md">
        <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>

      <div class="relative flex py-2 items-center mb-6">
        <div class="flex-grow border-t border-gray-800"></div>
        <span class="flex-shrink-0 mx-4 text-gray-500 text-sm font-semibold">Or with email</span>
        <div class="flex-grow border-t border-gray-800"></div>
      </div>

      <form @submit.prevent="handleEmailAuth" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-400 mb-1">Email</label>
          <input v-model="email" type="email" required 
                 class="w-full p-3 bg-mzansi-dark border border-gray-700 text-white rounded focus:ring-2 focus:ring-mzansi-green outline-none placeholder-gray-600" 
                 placeholder="developer@mzansi.com">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-400 mb-1">Password</label>
          <input v-model="password" type="password" required minlength="6"
                 class="w-full p-3 bg-mzansi-dark border border-gray-700 text-white rounded focus:ring-2 focus:ring-mzansi-green outline-none placeholder-gray-600" 
                 placeholder="••••••••">
        </div>

        <p v-if="errorMessage" class="text-red-400 text-sm font-semibold text-center">{{ errorMessage }}</p>

        <button type="submit" 
                class="w-full bg-mzansi-green text-mzansi-dark font-extrabold text-lg py-3 rounded hover:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)] transition duration-300">
          {{ isRegistering ? 'Create Account' : 'Log In' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm font-semibold text-gray-400">
        {{ isRegistering ? 'Already have an account?' : "Don't have an account?" }}
        <button @click="isRegistering = !isRegistering" class="text-mzansi-green hover:text-emerald-400 hover:underline focus:outline-none ml-1">
          {{ isRegistering ? 'Log In' : 'Sign Up' }}
        </button>
      </p>

    </div>
  </div>
</template>