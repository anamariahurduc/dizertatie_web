import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', () => {
    const loggedInUser = ref({});

    function setUser(user) {
        loggedInUser.value = user;
        sessionStorage.setItem('authUser', JSON.stringify(loggedInUser.value));
    }

    function getUserId() {
        loggedInUser.value = JSON.parse(sessionStorage.getItem('authUser'));
        if(loggedInUser) {
            return loggedInUser.value.id;
        } else {
            return 0;
        }
    }

    function getUser() {
        return JSON.parse(sessionStorage.getItem('authUser'));
    }

    function updateShareLocation(enabled: number) {
        let user = JSON.parse(sessionStorage.getItem('authUser'))
        user.share_locations = enabled;
        sessionStorage.setItem('authUser', JSON.stringify(user))
    }

    function removeUser() {
        sessionStorage.removeItem('authUser');
        loggedInUser.value = {};

    }

    return { loggedInUser, setUser, getUserId, getUser, updateShareLocation, removeUser}
})
