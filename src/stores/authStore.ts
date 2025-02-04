import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";

export const useAuthStore = defineStore('authStore', () => {
    const loggedInUser = ref({});
    const authToken = ref(null);

    function setUser(user) {
        loggedInUser.value = user;
        sessionStorage.setItem('authUser', JSON.stringify(loggedInUser.value));
    }

    function setToken(token){
        authToken.value = token;
        sessionStorage.setItem('authToken', JSON.stringify(authToken.value));
    }
    function getUser() {
        return JSON.parse(sessionStorage.getItem('authUser'));
    }

    function removeUser() {
        sessionStorage.removeItem('authUser');
        loggedInUser.value = {};

    }

    return { loggedInUser, authToken,setUser, setToken,getUser, removeUser}
})
