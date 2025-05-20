<template>
    <template v-if="isLoading">
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Reclamațiile mele</div>
                <DataTable :value="complaints" :rows="5" :paginator="true" responsiveLayout="scroll">
                    <Column field="title" header="Titlu" :sortable="true" style="width: 30%"></Column>
                    <Column field="category" header="Categorie" :sortable="true" style="width: 30%"></Column>
                    <Column field="status" header="Status" :sortable="true" style="width: 20%">
                        <template #body="slotProps">
                        <span
                            class="px-2 py-1 rounded-full text-xs font-semibold"
                            :class="getStatusClass(slotProps.data.status)"
                        >
                          {{ slotProps.data.status }}
                        </span>
                        </template>
                    </Column>
                    <Column header="Utilizator">
                        <template #body="slotProps">
                            <div class="flex flex-col">
                                <span class="font-medium text-gray-800">{{ slotProps.data.name }}</span>
                                <span class="text-xs text-gray-500">{{ slotProps.data.email }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column header="Acțiuni" style="width: 20%">
                        <template #body="slotProps">
                            <button
                                class="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 transition mb-2"
                                @click="goToComplaintPage(slotProps.data.id)"
                            >
                                Editează
                            </button>
                            <button
                                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                @click="deleteComplaint(slotProps.data.id)"
                            >
                                Șterge
                            </button>
                        </template>
                    </Column>
                </DataTable>
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

<script setup="ts">
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import Swal from "sweetalert2";

const complaints = ref([]);
const router = useRouter();
const users = ref([]);
const isLoading = ref(false);
const goToComplaintPage = (complaint_id) => {
    router.push({ name: 'edit-complaint', params: { id: complaint_id } });
}

const deleteComplaint = async (complaintId) => {
    const result = await Swal.fire({
        title: "Ești sigur?",
        text: "Această acțiune va șterge reclamația definitiv.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Da, șterge!",
        cancelButtonText: "Anulează"
    });

    if(result.isConfirmed)
    {
        try{
            await axios.delete(`https://api.claim-flow.dev.eiddew.com/api/complaints/${complaintId}`).then((response) => {
                if(response.status === 200)
                {
                    let complaint_index = complaints.value.findIndex(item => item.id == complaintId);

                    if(complaint_index >= 0)
                    {
                        complaints.value.splice(complaint_index, 1);
                    }

                    Swal.fire({
                        title: "Success",
                        text: 'Reclamația a fost ștearsă cu succes!',
                        icon: "success"
                    });
                }
            })
        } catch (error) {
            Swal.fire({
                title: "Eroare!",
                text: "A apărut o problemă la ștergerea reclamației.",
                icon: "error"
            });
        }
    }
}
const getComplaints = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/complaints').then((response) => {
        response.data.data.forEach((complaint) => {

            let user_index = users.value.findIndex(item => item.id == complaint.user_id);

            if(user_index >= 0)
            {
                complaint.email = users.value[user_index].email;
                complaint.name = users.value[user_index].last_name + ' ' + users.value[user_index].first_name;
            }

            complaints.value.push(complaint);
        })
    })
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'rezolvat':
            return 'bg-green-100 text-green-800';
        case 'în progres':
            return 'bg-yellow-100 text-yellow-800';
        case 'în așteptare':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

const getUsers = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/users').then((response) => {
        response.data.data.forEach((user) => {
            users.value.push(user);
        })
    })
}

onMounted(async () => {
    await getUsers();
    await getComplaints();

    isLoading.value = true;
})
</script>
