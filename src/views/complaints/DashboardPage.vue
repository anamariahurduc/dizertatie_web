<template>
    <template v-if="isLoading">
        <div class="grid grid-cols-12 gap-5">
            <div class="col-span-12">
                <div class="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 class="text-2xl font-semibold">Salut, {{ user.first_name }}! 👋</h2>
                    <p class="text-gray-500 mt-1">Bine ai revenit în platforma de gestionare a reclamațiilor.</p>
                </div>

                <div v-if="userNotifications.length > 0" class="mt-4 mb-4">
                    <div class="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md shadow-md">
                        <p class="font-semibold text-base mb-3">🔔 Ai notificări noi</p>

                        <ul class="space-y-3">
                            <li
                                v-for="notification in userNotifications"
                                :key="notification.id"
                                class="text-sm flex justify-between items-start"
                            >
                                <div class="flex items-start space-x-2">
                                    <div>
                                        <p class="font-semibold text-sm sm:text-base">
                                            📄 <span class="text-primary truncate">{{ notification.title }}</span>
                                        </p>
                                        <p class="font-medium text-sm sm:text-base">
                                            Statusul reclamației a fost actualizat în
                                            <span
                                                :class="{
                                                  'text-yellow-600 font-semibold': notification.status === 'În progres',
                                                  'text-green-600 font-semibold': notification.status === 'Rezolvat',
                                                  'text-red-600 font-semibold': notification.status === 'În așteptare'
                                                }"
                                                                            >
                                                {{ notification.status }}
                                              </span>
                                        </p>
                                        <p class="text-xs text-gray-500">
                                            {{ formattedDate(notification.created_at) }}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        class="text-primary text-xs sm:text-sm font-semibold hover:underline"
                                        @click="readNotification(notification.id, notification.complaint_id)"
                                    >
                                        Vezi reclamația
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
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
                            <div class="text-2xl font-bold text-yellow-500">{{ getComplaintsNumber(true, false, false) }}</div>
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
                    <template v-if="getRecentComplaints.length > 0">
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
                    </template>
                    <template v-else>
                        <div class="text-gray-500 text-sm text-center py-6">
                            Nu există reclamații recente.
                        </div>
                    </template>
                </div>
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
        </div>
    </template>
    <template v-else>
        <div class="flex flex-col items-center justify-center min-h-[200px]">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="5" animationDuration=".5s" />
            <p class="mt-4 text-gray-500 text-sm">Se încarcă...</p>
        </div>
    </template>
</template>

<script setup>
import { ProductService } from '@/service/ProductService';
import {computed, onMounted, ref, watch} from 'vue';
import axios from "axios";
import {useRouter} from "vue-router";
import Swal from "sweetalert2";

const complaints = ref([]);
const conversations = ref([]);
const user = JSON.parse(localStorage.getItem('user'));
const router = useRouter();

const isLoading = ref(false);

const userNotifications = ref([]);
const getComplaints = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/complaints').then((response) => {
        response.data.data.forEach((complaint) => {
            complaints.value.push(complaint);
        })
    })
}

const statusLabel = (status) => {
    switch (status) {
        case 'in_progress':
            return 'În progres';
        case 'resolved':
            return 'Rezolvat';
        case 'unresolved':
            return 'În așteptare';
        default:
            return 'Necunoscut';
    }
};
const getNotifications = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/getNotifications').then((response) => {
        userNotifications.value = []; // Resetăm notificările — evităm dubluri

        response.data.data.forEach((notification) => {
            const complaintIndex = complaints.value.findIndex(item => item.id == notification.complaint_id);

            if (complaintIndex >= 0) {
                const complaint = complaints.value[complaintIndex];

                const complaintDate = new Date(complaint.updated_at);
                const seenDateRaw = notification.last_seen_at ? new Date(notification.last_seen_at) : null;

                const notificationDate = seenDateRaw ? new Date(seenDateRaw.getTime() + 3 * 60 * 60 * 1000) : null;

                const shouldShow = !notificationDate || complaintDate > notificationDate;

                if (shouldShow) {
                    userNotifications.value.push({
                        id: notification.id,
                        complaint_id: complaint.id,
                        title: complaint.title,
                        status: complaint.status,
                        created_at: notification.updated_at,
                        last_seen_at: notification.last_seen_at,
                    });
                }
            }
        });
    });
}

const formattedDate = computed(() => (date) => {
    return new Date(date).toLocaleString('ro-RO', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
})

const readNotification = async (notification_id, complaint_id) => {
    await axios.patch(`https://api.claim-flow.dev.eiddew.com/api/readNotification/${notification_id}`).then((response) => {
        Swal.fire({
            title: "Success",
            text: 'Reclamație actualizată cu succes!',
            icon: "success"
        });

        router.push({ name: 'complaint', params: { id: complaint_id } });

    })
        .catch((error) => {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: 'Reclamația nu a putut fi actualizată!',
                icon: "error"
            });
        });

}
const goToComplaint = (complaint_id) => {
    router.push({ name: 'complaint', params: { id: complaint_id } });
}

const getRecentComplaints = computed(() => {
    let recentComplaints = [];

    complaints.value.forEach((complaint) => {
        if(complaint.user_id == user.id)
        {
            recentComplaints.push(complaint);
        }
    })

    recentComplaints = recentComplaints.slice(-3);

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

const getComplaintsNumber = computed(() => (in_progress, completed, awaiting) => {
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

onMounted(async () => {
    await getComplaints();
    await getConversations();
    await getNotifications()

    isLoading.value = true;
});

</script>
