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

                            <select
                                v-model="complaint.status"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring focus:ring-primary-200 focus:border-primary-300"
                            >
                                <option value="În așteptare">În așteptare</option>
                                <option value="În progres">În progres</option>
                                <option value="Rezolvat">Rezolvat</option>
                            </select>
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

                <div class="flex justify-between mt-6">
                    <button
                        @click="goBack()"
                        class="btn btn-outline"
                    >
                        ← Înapoi la reclamații
                    </button>

                    <Button @click="updateStatus(complaint.status, complaint.id)">Salvează modificările</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import axios from "axios";
import {computed} from "vue";
import Swal from "sweetalert2";

const complaint = ref({});

const route = useRoute();
const complaintId = route.params.id;
const router = useRouter();

const formattedDate = computed(() => (date) => {
    return new Date(date).toLocaleString('ro-RO', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
})

const goBack = () => {
    router.push({ name: 'edit-complaints' });
}
const getComplaint = async () => {
    await axios.get(`https://api.claim-flow.dev.eiddew.com/api/complaints/${complaintId}`)
        .then((response) => {
            complaint.value = response.data.data;
        })
        .catch((error) => {
            console.error(error);
        });
}
const updateStatus = async (complaintStatus, complaintId) => {
    await axios.patch(`https://api.claim-flow.dev.eiddew.com/api/complaints/${complaintId}`, {
        status: complaintStatus
    }).then((response) => {
            complaint.value = response.data.data;
            Swal.fire({
                title: "Success",
                text: 'Reclamație actualizată cu succes!',
                icon: "success"
            });
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
