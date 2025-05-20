<template>
    <template v-if="isLoading">
        <div class="grid grid-cols-12 gap-5">
            <div class="col-span-12">
                <div class="bg-white shadow rounded-lg p-6 mb-6 relative">
                    <div
                        :class="[
                        'absolute top-4 right-4 px-3 py-1 rounded-full text-white font-semibold text-sm',
                        user.status === 'activ' ? 'bg-green-500' : 'bg-gray-500'
                      ]"
                    >
                        {{ user.status }}
                    </div>

                    <h2 class="text-2xl font-semibold mb-4">Editare utilizator</h2>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <p class="text-sm text-gray-500">Nume</p>
                            <input
                                v-model="user.last_name"
                                type="text"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary-200 focus:border-primary-300"
                            />
                        </div>

                        <div>
                            <p class="text-sm text-gray-500">Prenume</p>
                            <input
                                v-model="user.first_name"
                                type="text"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary-200 focus:border-primary-300"
                            />
                        </div>

                        <div>
                            <p class="text-sm text-gray-500">Email</p>
                            <input
                                v-model="user.email"
                                type="email"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary-200 focus:border-primary-300"
                            />
                        </div>

                        <div>
                            <p class="text-sm text-gray-500">Rol</p>
                            <select
                                v-model="user.role"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring focus:ring-primary-200 focus:border-primary-300"
                            >
                                <option value="admin">Administrator</option>
                                <option value="user">Utilizator</option>
                            </select>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Autentificare 2FA</p>
                            <select
                                v-model="user.is_enable_2fa"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring focus:ring-primary-200 focus:border-primary-300"
                            >
                                <option value="1">Activ</option>
                                <option value="0">Inactiv</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex justify-between mt-6">
                        <button
                            @click="goBack()"
                            class="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 transition"
                        >
                            ← Înapoi la utilizatori
                        </button>

                        <Button @click="updateUser(user.id)">Salvează modificările</Button>
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
import { ref, onMounted } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import axios from 'axios'
import Swal from "sweetalert2";
const router = useRouter();

const route = useRoute();
const userId = route.params.id;
const user = ref({});
const complaints = ref([]);
const isLoading = ref(false);
const getUser = async () => {
    await axios.get(`https://api.claim-flow.dev.eiddew.com/api/users/${userId}`)
        .then((response) => {
            user.value = response.data.data;

            let complaint_index = complaints.value.findIndex(item => item.user_id == user.value.id);

            if(complaint_index >= 0)
            {
                user.value.status = 'activ';
            } else {
                user.value.status = 'inactiv';
            }
        })
        .catch((error) => {
            console.error(error);
        });
}
const updateUser = async (userId) => {
    try {
        const response = await axios.patch(`https://api.claim-flow.dev.eiddew.com/api/users/${userId}`, {
            last_name: user.value.last_name,
            first_name: user.value.first_name,
            email: user.value.email,
            role: user.value.role,
            is_enable_2fa: user.value.is_enable_2fa
        })

        user.value = response.data.data

        Swal.fire({
            title: "Success",
            text: 'Utilizator actualizat cu succes!',
            icon: "success"
        });
    } catch (error) {
        Swal.fire({
            title: "Erorr",
            text: 'Eroare la actualizare utilizator!',
            icon: "error"
        });
    }
}

const getComplaints = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/complaints').then((response) => {
        response.data.data.forEach((complaint) => {
            complaints.value.push(complaint);
        })
    })
}
const goBack = () => {
    router.push({ name: 'admin-users' });
}

onMounted(async () => {
    await getComplaints();
    await getUser();

    isLoading.value = true;
})

</script>
