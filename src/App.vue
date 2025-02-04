<script setup>
import axios from "axios";
import {useCookies} from "vue3-cookies";
import {useRouter} from "vue-router";

const router = useRouter();
const {cookies} = useCookies();

axios.interceptors.response.use(
    (response) => response,

    async (error) => {
        const { status, config: originalRequest } = error.response;

        if (status === 401) {
           //sa il trimiti pe login
            await router.push('/login');
        }

        return Promise.reject(error);
    }
);

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = `Bearer ${cookies.get('token')}`;


</script>

<template>
    <router-view />
</template>

<style scoped></style>
