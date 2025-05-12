<template>
    <div class="mt-24 px-6 xl:px-20">
        <div class="flex flex-col-reverse xl:flex-row items-center justify-between bg-white rounded-2xl shadow-md p-10">
            <div class="w-full xl:w-1/2 mt-10 xl:mt-0">
                <h1 class="text-4xl font-bold mb-6 text-surface-900">Reclamația ta, soluția noastră!</h1>
                <p class="text-lg text-gray-600 mb-6">Introdu problema ta, iar sistemul nostru inteligent o va analiza, clasifica și îți va spune exact ce pași trebuie să urmezi.</p>
                <div v-if="isLoggedIn">
                    <router-link to="/dashboard">
                        <button class="bg-primary text-white py-3 px-6 rounded-xl shadow hover:bg-primary-dark transition">
                            Mergi la dashboard
                        </button>
                    </router-link>
                </div>
                <div v-else>
                    <p class="text-xl font-semibold bg-primary/20 mb-6 p-4 rounded-lg shadow-md">
                        Beneficiezi de ghiduri pas cu pas, notificări și soluții rapide. Începe chiar acum!
                    </p>
                    <div class="flex flex-col items-center mb-6">
                        <h2 class="text-xl font-semibold text-surface-900 mb-4">Nu ai un cont?</h2>
                        <router-link to="/register">
                            <button class="bg-secondary py-3 px-6 rounded-xl shadow hover:bg-secondary-dark transition mb-4">
                                Înregistrează-te
                            </button>
                        </router-link>
                        <p class="text-sm text-gray-500">Ai deja un cont? <router-link to="/login" class="text-primary font-semibold">Autentifică-te</router-link></p>
                    </div>
                </div>
            </div>
            <div class="w-full xl:w-1/2 flex justify-center">
                <img src="@/assets/Chatbot.jpg" alt="Chatbot" class="max-w-xs xl:max-w-md rounded-xl shadow-md" />
            </div>
        </div>
        <div v-if="isLoggedIn">
            <div class="mt-10 bg-white p-8 rounded-xl shadow text-center">
            <h2 class="text-2xl font-semibold text-surface-900 mb-6">Cum Funcționează Aplicația?</h2>
            <p class="text-lg text-gray-600 mb-6">Aplicatia noastră te ajută să rezolvi rapid orice problemă, urmând pașii simpli de mai jos:</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                    <i class="pi pi-pencil text-4xl text-primary mb-4"></i>
                    <h3 class="text-xl font-semibold mb-2">1. Introdu Problema</h3>
                    <p class="text-gray-600">Scrie o descriere clară a problemei tale și indică locația. Sistemul nostru va analiza automat informațiile.</p>
                </div>
                <div>
                    <i class="pi pi-check-circle text-4xl text-primary mb-4"></i>
                    <h3 class="text-xl font-semibold mb-2">2. Clasificare Automată</h3>
                    <p class="text-gray-600">Aplicatia va clasifica problema și va detecta sectorul pe baza adresei introduse.</p>
                </div>
                <div>
                    <i class="pi pi-arrow-right text-4xl text-primary mb-4"></i>
                    <h3 class="text-xl font-semibold mb-2">3. Urmează Pașii</h3>
                    <p class="text-gray-600">Primești pașii concreți pe care trebuie să-i urmezi pentru a rezolva problema rapid.</p>
                </div>
            </div>
            <button @click="goToChatbot()" class="mt-6 bg-primary text-white py-3 px-6 rounded-xl shadow hover:bg-primary-dark transition">
                Începe o conversație
            </button>
        </div>
        </div>
        <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <i class="pi pi-compass text-3xl text-primary mb-4"></i>
                <h3 class="text-xl font-semibold mb-2">Detecție automată</h3>
                <p class="text-gray-600">Sistemul recunoaște automat categoria problemei și sectorul pe baza adresei.</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <i class="pi pi-send text-3xl text-primary mb-4"></i>
                <h3 class="text-xl font-semibold mb-2">Pași clari de urmat</h3>
                <p class="text-gray-600">Primești ghid personalizat pentru rezolvarea rapidă a reclamației tale.</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <i class="pi pi-chart-line text-3xl text-primary mb-4"></i>
                <h3 class="text-xl font-semibold mb-2">Urmărire în timp real</h3>
                <p class="text-gray-600">Monitorizezi statusul reclamației tale direct din dashboard.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {useRouter} from "vue-router";

const isLoggedIn = ref(false)
const router = useRouter();

const goToChatbot = () => {
    router.push({name: 'chatbot'});
}

onMounted(() => {
    const user = localStorage.getItem('user') // sau 'token', după cum ai tu

    console.log(user)
    isLoggedIn.value = !!user
})
</script>
