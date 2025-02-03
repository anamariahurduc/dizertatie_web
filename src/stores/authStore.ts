import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', () => {
    const loggedInUser = ref({});

    function setUser(user) {
        loggedInUser.value = user;
        sessionStorage.setItem('authUser', JSON.stringify(loggedInUser.value));
    }

    function getUser() {
        return JSON.parse(sessionStorage.getItem('authUser'));
    }

    function removeUser() {
        sessionStorage.removeItem('authUser');
        loggedInUser.value = {};

    }

    return { loggedInUser, setUser, getUser, removeUser}
})
