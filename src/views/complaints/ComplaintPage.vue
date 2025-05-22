<template>
    <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12">
            <div class="bg-white shadow rounded-lg p-6 mb-6">
                <div class="bg-white shadow rounded-lg p-6 mb-6 relative">
                    <div
                        :class="[
                          'absolute top-4 right-4 px-3 py-1 rounded-full text-white font-semibold text-sm',
                          complaint.status === 'În progres' ? 'bg-yellow-500' :
                          complaint.status === 'Rezolvat' ? 'bg-green-500' :
                          complaint.status === 'În așteptare' ? 'bg-red-500' :
                          'bg-gray-500'
                        ]"
                    >
                        {{ complaint.status }}
                    </div>

                    <h2 class="text-2xl font-semibold mb-2">Detalii reclamație</h2>
                    <p class="text-gray-700 mb-4 font-medium">{{ complaint.title }}</p>
                    <p class="text-gray-600 mb-6">{{ complaint.description }}</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p class="text-sm text-gray-500">Categorie</p>
                        <p class="font-semibold text-gray-800">{{ complaint.category }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Status</p>
                        <p
                            :class="{
                                'text-yellow-500': complaint.status === 'În progres',
                                'text-green-500': complaint.status === 'Rezolvat',
                                'text-red-500': complaint.status === 'În așteptare'
                              }"
                            class="font-semibold"
                        >
                            {{ complaint.status }}
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Data creării</p>
                        <p class="font-semibold text-gray-800">{{ formattedDate(complaint.created_at) }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Ultima actualizare</p>
                        <p class="font-semibold text-gray-800">{{ formattedDate(complaint.updated_at) }}</p>
                    </div>
                </div>

                <button
                    @click="$router.back()"
                    class="btn btn-outline mt-4"
                >
                    ← Înapoi la reclamații
                </button>
            </div>
        </div>

<!--        <div class="col-span-12 xl:col-span-4">-->
<!--            <div class="bg-white shadow rounded-lg p-6 mb-6">-->
<!--                <p class="text-lg font-semibold mb-4">🔧 Acțiuni rapide:</p>-->
<!--                <div class="flex flex-col gap-4">-->
<!--                    <button @click="$router.push('/new-claim')" class="btn btn-primary w-full">-->
<!--                        ➕ Trimite reclamație nouă-->
<!--                    </button>-->
<!--                    <button @click="$router.push('/chatbot')" class="btn btn-secondary w-full">-->
<!--                        💬 Chatbot-->
<!--                    </button>-->
<!--                    <button @click="$router.push('/my-complaints')" class="btn btn-outline w-full">-->
<!--                        📁 Vezi toate reclamațiile-->
<!--                    </button>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import {computed} from "vue";

const complaint = ref({});

const route = useRoute();
const complaintId = route.params.id;
const newComment = ref('');


const formattedDate = computed(() => (date) => {
    return new Date(date).toLocaleString('ro-RO', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
})
const getComplaint = async () => {
    await axios.get(`https://api.claim-flow.dev.eiddew.com/api/complaints/${complaintId}`)
        .then((response) => {
            complaint.value = response.data.data;
        })
        .catch((error) => {
            console.error(error);
        });
}
function addComment() {
    if (newComment.value.trim() === '') return;
    complaint.value.comments.push({
        id: complaint.value.comments.length + 1,
        author: 'Utilizator',
        date: new Date().toISOString(),
        text: newComment.value.trim()
    });
    newComment.value = '';
}

function editComplaint() {
    // Navighează la pagina de editare sau deschide modal
    alert('Funcționalitate de editare în dezvoltare');
}
function closeComplaint() {
    // Actualizează status, etc.
    alert('Funcționalitate de închidere în dezvoltare');
}

onMounted(() => {
    getComplaint();
})
</script>

<style scoped>
.btn {
    @apply px-4 py-2 rounded font-semibold transition-colors;
}
.btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
}
.btn-outline {
    @apply border border-gray-500 text-gray-700 hover:bg-gray-100;
}
.btn-danger {
    @apply bg-red-600 text-white hover:bg-red-700;
}
</style>
