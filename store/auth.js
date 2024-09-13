import { defineStore } from 'pinia';
import { useFetch, useCookie } from '#app'; // Nuxt 3's hooks

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    loading: false,
  }),
  actions: {
    async authenticateUser(payload) {
      const { username, password } = payload;

      const { data, pending } = await useFetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), // Send the payload as JSON
      });

      // Bind loading state to pending status
      this.loading = pending;

      // If the response contains data, store the token in a cookie and set authenticated to true
      if (data.value) {
        const token = useCookie('token'); // Use Nuxt's cookie management hook
        token.value = data.value.token; // Store token in the cookie
        this.authenticated = true; // Update the state to reflect authentication
      }
    },
    logUserOut() {
      // Clear token from the cookie and set authenticated state to false
      const token = useCookie('token'); // Use the same cookie hook
      this.authenticated = false;
      token.value = null; // Clear the token
    },
  },
});
