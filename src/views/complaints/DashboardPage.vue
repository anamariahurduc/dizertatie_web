<template>
    <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12">
            <div class="bg-white shadow rounded-lg p-6 mb-6">
                <h2 class="text-2xl font-semibold">Salut, {{ user.first_name }}! 👋</h2>
                <p class="text-gray-500 mt-1">Bine ai revenit în platforma de gestionare a reclamațiilor.</p>
            </div>
            <div class="bg-white shadow rounded-lg p-6 mb-6">
                <p class="text-lg font-semibold mb-4 text-gray-700">🔢 Activitatea ta:</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <div class="text-sm text-gray-500">Total reclamații</div>
                        <div class="text-2xl font-bold text-primary">{{ getMyComplaintsNumber }}</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <div class="text-sm text-gray-500">În progres</div>
                        <div class="text-2xl font-bold text-yellow-500">{{ getInProgressComplaintsNumber(true, false, false) }}</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <div class="text-sm text-gray-500">Rezolvate</div>
                        <div class="text-2xl font-bold text-green-500">{{ getInProgressComplaintsNumber(false, true, false) }}</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <div class="text-sm text-gray-500">Nerezolvate</div>
                        <div class="text-2xl font-bold text-red-500">{{ getInProgressComplaintsNumber(false, false, true) }}</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <div class="text-sm text-gray-500">Conversații chatbot</div>
                        <div class="text-2xl font-bold text-indigo-500">{{ getConversationsNumber }}</div>
                    </div>
                </div>
            </div>
            <div class="bg-white shadow rounded-lg p-6 mb-6">
                <p class="text-lg font-semibold mb-4">🕒 Ultimele reclamații:</p>
                <ul class="divide-y divide-gray-200">
                    <li
                        v-for="reclamatie in getRecentComplaints"
                        :key="reclamatie.id"
                        class="py-3 flex justify-between items-center"
                    >
                        <div>
                            <p class="font-medium text-gray-800">{{ reclamatie.title }}</p>
                            <p class="text-sm text-gray-500">
                                Trimis pe {{ formattedDate(reclamatie.created_at) }}
                            </p>
                        </div>
                        <button
                            @click="goToComplaint(reclamatie.id)"
                            class="text-primary text-sm font-semibold"
                        >
                            Detalii
                        </button>
                    </li>
                </ul>
            </div>

            <!-- Acțiuni rapide -->
            <div class="bg-white shadow rounded-lg p-6">
                <p class="text-lg font-semibold mb-4">🔧 Acțiuni rapide:</p>
                <div class="flex flex-col sm:flex-row gap-4">
                    <button @click="$router.push('/new-claim')" class="btn btn-primary w-full sm:w-auto">
                        ➕ Trimite reclamație nouă
                    </button>
                    <button @click="$router.push('/chatbot')" class="btn btn-secondary w-full sm:w-auto">
                        💬 Chatbot
                    </button>
                    <button @click="$router.push('/my-complaints')" class="btn btn-outline w-full sm:w-auto">
                        📁 Vezi toate reclamațiile
                    </button>
                </div>
            </div>
        </div>

        <!-- Coloana secundară: spațiu pentru viitor -->
        <div class="col-span-12 xl:col-span-4">
            <!-- Poți adăuga pe viitor: rapoarte rapide, activitate recentă, notificări etc. -->
        </div>
    </div>
</template>

<script setup>
import { ProductService } from '@/service/ProductService';
import {computed, onMounted, ref, watch} from 'vue';
import axios from "axios";
import {useRouter} from "vue-router";

const complaints = ref([]);
const conversations = ref([]);
const user = JSON.parse(localStorage.getItem('user'));
const router = useRouter();

const getComplaints = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/complaints').then((response) => {
        response.data.data.forEach((complaint) => {
            complaints.value.push(complaint);
        })
    })
}

const formattedDate = computed(() => (date) => {
    return new Date(date).toLocaleString('ro-RO', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
})
const post = async () => {
    await axios.post('https://api.claim-flow.dev.eiddew.com/api/complaints').then((response) => {
        console.log(response)
    })
}

const goToComplaint = (complaint_id) => {
    router.push({ name: 'complaint', params: { id: complaint_id } });
}

const getRecentComplaints = computed(() => {
    let recentComplaints = [];
    console.log(complaints.value)
    recentComplaints = complaints.value.slice(-3);
    console.log(recentComplaints)
    return recentComplaints;
})


const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' }
]);

const getMyComplaintsNumber = computed(() => {
    let my_complaints = 0;
    complaints.value.forEach((complaint) => {
        if(complaint.user_id == user.id)
        {
            my_complaints ++;
        }
    })

    return my_complaints;
})

const getInProgressComplaintsNumber = computed(() => (in_progress, completed, awaiting) => {
    let number_complaints = 0;
    let in_progress_complaints = 0;
    let completed_complaints = 0;
    let in_waiting_complaints = 0;
    complaints.value.forEach((complaint) => {
        if((complaint.user_id == user.id) && (complaint.status == 'În progres') && (in_progress == true))
        {
            in_progress_complaints++;
            number_complaints = in_progress_complaints;
        } else if((complaint.user_id == user.id) && (complaint.status == 'Rezolvat') && (completed == true)) {
            completed_complaints++;
            number_complaints = completed_complaints;
        } else if((complaint.user_id == user.id) && (complaint.status == 'În așteptare') && (awaiting == true)) {
            in_waiting_complaints++;
            number_complaints = in_waiting_complaints;
        }
    })

    return number_complaints;
})

const getConversationsNumber = computed(() => {
    let my_conversations = 0;
    conversations.value.forEach((conversation) => {
        if(conversation.user_id == user.id)
        {
            my_conversations ++;
        }
    })

    return my_conversations;
})

const getConversations = async () => {
    conversations.value = [];
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/conversations').then((response) => {
        response.data.data.forEach((conversation) => {
            conversations.value.push(conversation);
        })
    })
}

onMounted(() => {
    getComplaints();
    getConversations();
    // post();
});

</script>
