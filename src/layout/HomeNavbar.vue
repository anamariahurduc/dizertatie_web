<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/dashboard" class="layout-topbar-logo">
                <div class="bg-contain bg-center flex bg-no-repeat">
                    <img src="@/assets/ClaimFlowLogo.png" class="w-60 h-auto ml-6 mb-1"/>
                </div>
                <div class="bg-contain bg-center flex bg-no-repeat">
                    <img src="@/assets/ClaimFlowText.png" class="h-auto mt-16 "/>-->
                </div>

            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" @click="toggleMenu">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                    <Menu ref="menu" :model="profileMenuItems" :popup="true" />
                </div>
            </div>
        </div>
    </div>
        <div class="">
            <router-view />
        </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import AppConfigurator from './AppConfigurator.vue';
import {ref} from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import {useCookies} from "vue3-cookies";
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/authStore.ts";

const { cookies } = useCookies();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
const menu = ref(null);

const logout = async () => {
    await axios.post('https://api.claim-flow.dev.eiddew.com/api/logout').then((response) => {
        cookies.remove("token");
        axios.defaults.headers.common['Authorization'] = null;
        localStorage.removeItem('user');  // Înlocuiește 'token' cu cheia corectă dacă folosești altceva pentru stocare
        localStorage.clear();

        router.push('/login');
    }).catch((error) => {
    });
};

const profileMenuItems = ref([
    {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
        command: logout
    },
    {
        separator: true
    },
]);

function toggleMenu(event) {
    menu.value.toggle(event);
}
</script>
