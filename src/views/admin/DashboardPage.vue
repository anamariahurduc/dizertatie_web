<template>
    <div class="space-y-10">
        <div class="bg-gradient-to-r from-primary to-purple-600 text-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div class="text-xl font-semibold">📊 Dashboard Admin</div>
            <div class="flex gap-4 mt-2 md:mt-0">
                <div>Total reclamații: <strong class="font-bold">10</strong></div>
                <div>Utilizatori activi: <strong class="font-bold">2</strong></div>
            </div>
        </div>
        <section>
            <h2 class="text-xl font-semibold text-gray-700 mb-2">🧾 Situație reclamații</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white shadow rounded-lg p-4 text-center">
                    <div class="text-lg font-semibold text-gray-700 mb-5">Reclamații</div>
                    <div class="text-2xl font-bold text-primary mb-4">{{complaints.length}}</div>
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
                <div class="bg-white shadow-lg rounded-2xl p-6 text-center col-span-1 md:col-span-3">
                    <div class="text-lg font-semibold text-gray-700 mb-5">Status reclamații</div>
                    <div class="flex flex-col md:flex-row justify-around gap-4 text-sm md:text-base font-medium">
                        <div class="flex flex-col items-center justify-center gap-2 bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full shadow-inner">
                            <span>În progres</span>
                            <span class="text-xl font-bold">{{getComplaintsNumber(true, false, false)}}</span>
                        </div>

                        <div class="flex flex-col items-center justify-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full shadow-inner">
                            <span>Rezolvate</span>
                            <span class="text-xl font-bold">{{getComplaintsNumber(false, true, false)}}</span>
                        </div>

                        <div class="flex flex-col items-center justify-center gap-2 bg-red-100 text-red-700 px-5 py-2 rounded-full shadow-inner">
                            <span>Nerezolvate</span>
                            <span class="text-xl font-bold">{{getComplaintsNumber(false, false, true)}}</span>
                        </div>

                    </div>
                </div>
            </div>
        </section>
        <section>
            <h2 class="text-xl font-semibold text-gray-700 mb-2">👤 Statistici utilizatori</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white shadow rounded-lg p-4 text-center">
                    <div class="text-lg text-gray-500">Utilizatori activi (30 zile)</div>
                    <div class="text-2xl font-bold text-primary">{{getActiveUsers}}</div>
                </div>
                <div class="bg-white shadow rounded-lg p-4 text-center">
                    <div class="text-lg text-gray-500">Utilizatori inactivi</div>
                    <div class="text-2xl font-bold text-gray-700">{{getInactiveUsers}}</div>
                </div>
                <div class="bg-white shadow rounded-lg p-4 text-center">
                    <div class="text-lg text-gray-500">2FA activ</div>
                    <div class="text-2xl font-bold text-green-600">{{getActive2FA}}</div>
                </div>
                <div class="bg-white shadow rounded-lg p-4 text-center">
                    <div class="text-lg text-gray-500">2FA inactiv</div>
                    <div class="text-2xl font-bold text-red-600">{{getInactive2FA}}</div>
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
                <button
                    class="text-primary font-medium hover:underline"
                    @click="editComplaint(reclamatie.id)">
                    Vezi / Editează
                </button>
            </li>
        </ul>
        <Button @click="goToComplaints()" class="mt-2">Vezi toate reclamațiile</Button>
    </div>
</template>

<script setup>

import axios from "axios";
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const complaints = ref([]);
const router = useRouter();
const users = ref([]);

const getUsers = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/users').then((response) => {
        response.data.data.forEach((user) => {
            users.value.push(user);
        })
    })
}
const getComplaints = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/complaints').then((response) => {
        response.data.data.forEach((complaint) => {
            complaints.value.push(complaint);
        })
    })
}

const goToComplaints = () => {
    router.push({ name: 'edit-complaints'});
}
const editComplaint = (complaint_id) => {
    router.push({ name: 'edit-complaint', params: { id: complaint_id } });
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

const getActiveUsers = computed(() => {
    let active_users_number = 0;

    users.value.forEach((user) => {
        if(user.role === 'user')
        {
            let complaint_index = complaints.value.findIndex(item => item.user_id == user.id);
            if(complaint_index >= 0)
            {
                active_users_number++;
            }
        }
    })

    return active_users_number;
})

const getInactiveUsers = computed(() => {
    let inactive_users_number = 0;

    users.value.forEach((user) => {
        if(user.role === 'user')
        {
            let complaint_index = complaints.value.findIndex(item => item.user_id == user.id);
            if(complaint_index < 0)
            {
                inactive_users_number++;
            }
        }
    })

    return inactive_users_number;
})

const getInactive2FA = computed(() => {
    let inactive_2fa_users_number = 0;

    users.value.forEach((user) => {
        if(user.is_enable_2fa == 0)
        {
            inactive_2fa_users_number++;
        }
    })

    return inactive_2fa_users_number;
})

const getActive2FA = computed(() => {
    let active_2fa_users_number = 0;

    users.value.forEach((user) => {
        if(user.is_enable_2fa == 1)
        {
            active_2fa_users_number++;
        }
    })

    return active_2fa_users_number;
})

const getInProgressComplaintsNumber = computed(() => {
    let in_progress_complaints = 0;

    complaints.value.forEach((complaint) => {
        if(complaint.status == "În progres")
        {
            in_progress_complaints++;
        }
    })
    return in_progress_complaints;
})


const getComplaintsNumber = computed(() => (in_progress, completed, awaiting) => {
    let number_complaints = 0;
    let in_progress_complaints = 0;
    let completed_complaints = 0;
    let in_waiting_complaints = 0;
    complaints.value.forEach((complaint) => {
        if((complaint.status === 'În progres') && (in_progress === true))
        {
            in_progress_complaints++;
            number_complaints = in_progress_complaints;
        } else if((complaint.status === 'Rezolvat') && (completed === true)) {
            completed_complaints++;
            number_complaints = completed_complaints;
        } else if((complaint.status === 'În așteptare') && (awaiting === true)) {
            in_waiting_complaints++;
            number_complaints = in_waiting_complaints;
        }
    })

    return number_complaints;
})
onMounted(() => {
    getComplaints();
    getUsers();
})
</script>
