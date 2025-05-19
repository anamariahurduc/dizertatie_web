<template>
    <div class="space-y-10">
        <div class="bg-gradient-to-r from-primary to-purple-600 text-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div class="text-lg font-semibold">📊 Dashboard Admin</div>
            <div class="flex gap-4 mt-2 md:mt-0">
                <div>Total reclamații: <strong class="font-bold">10</strong></div>
                <div>Utilizatori activi: <strong class="font-bold">2</strong></div>
            </div>
        </div>
        <section>
            <h2 class="text-lg font-semibold text-gray-700 mb-2">🧾 Situație reclamații</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white shadow rounded-lg p-4 text-center">
                    <div class="text-sm text-gray-500">Total reclamații</div>
                    <div class="text-2xl font-bold text-primary mb-4">10</div>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="bg-sky-50 p-2 rounded-lg">
                            <div class="text-sky-600 font-bold">Manual</div>
                            <div class="text-lg font-bold">6</div>
                        </div>
                        <div class="bg-purple-50 p-2 rounded-lg">
                            <div class="text-purple-600 font-bold">Chatbot</div>
                            <div class="text-lg font-bold">4</div>
                        </div>
                    </div>
                </div>
                <div class="bg-white shadow rounded-lg p-4 text-center col-span-1 md:col-span-3">
                    <div class="text-sm text-gray-500 mb-3">Status reclamații</div>
                    <div class="flex justify-around text-xs">
                        <div class="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full font-semibold">În progres: 2</div>
                        <div class="bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold">Rezolvate: 3</div>
                        <div class="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">Nerezolvate: 3</div>
                    </div>
                </div>
            </div>
        </section>
        <section>
            <h2 class="text-lg font-semibold text-gray-700 mb-2">👤 Statistici utilizatori</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white shadow rounded-lg p-4 text-center">
                    <div class="text-sm text-gray-500">Utilizatori activi (30 zile)</div>
                    <div class="text-2xl font-bold text-primary">2</div>
                </div>
                <div class="bg-white shadow rounded-lg p-4 text-center">
                    <div class="text-sm text-gray-500">Utilizatori inactivi</div>
                    <div class="text-2xl font-bold text-gray-700">5</div>
                </div>
                <div class="bg-white shadow rounded-lg p-4 text-center">
                    <div class="text-sm text-gray-500">2FA activ</div>
                    <div class="text-2xl font-bold text-green-600">5</div>
                </div>
                <div class="bg-white shadow rounded-lg p-4 text-center">
                    <div class="text-sm text-gray-500">2FA inactiv</div>
                    <div class="text-2xl font-bold text-red-600">2</div>
                </div>
            </div>
            <div class="text-center mt-6 mb-8">
                <router-link to="/admin/users" class="inline-block bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary-dark transition">
                    Vezi toți utilizatorii
                </router-link>
            </div>
        </section>
    </div>

    <div class="bg-white shadow rounded-lg p-4 mb-8">
        <h2 class="text-lg font-semibold mb-4">Ultimele reclamații</h2>
        <ul>
            <li v-for="reclamatie in complaints" :key="reclamatie.id" class="border-b py-2 flex justify-between items-center">
                <div>
                    <strong>#{{ reclamatie.id }}</strong> - {{ reclamatie.title }}
                    <span :class="getStatusClass(reclamatie.status)" class="ml-2 text-xs font-semibold px-2 py-1 rounded">
                        {{ reclamatie.status }}
                    </span>
                </div>
                <router-link :to="`/admin/reclamatii/${reclamatie.id}`" class="text-primary hover:underline">
                    Vezi / Editează
                </router-link>
            </li>
        </ul>
        <router-link to="/admin/reclamatii" class="inline-block mt-4 bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-dark transition">
            Vezi toate reclamațiile
        </router-link>
    </div>
</template>

<script setup>

import axios from "axios";
import {onMounted, ref} from "vue";

const complaints = ref([]);

const getComplaints = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/complaints').then((response) => {
        response.data.data.forEach((complaint) => {
            complaints.value.push(complaint);
        })
    })
}

function getStatusClass(status) {
    switch (status) {
        case 'Rezolvat':
            return 'bg-green-100 text-green-700';
        case 'În progres':
            return 'bg-yellow-100 text-yellow-700';
        case 'În așteptare':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
}
onMounted(() => {
    getComplaints();
})
</script>
