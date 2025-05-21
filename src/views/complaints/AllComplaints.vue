<template>
    <div class="col-span-12 xl:col-span-6">
        <div class="card">
            <div class="font-semibold text-xl mb-4">Reclamațiile mele</div>
            <template v-if="complaints.length > 0">
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
                    <Column header="Acțiuni" style="width: 20%">
                        <template #body="slotProps">
                            <button
                                class="text-primary font-medium hover:underline"
                                @click="goToComplaintPage(slotProps.data.id)"
                            >
                                Detalii
                            </button>
                        </template>
                    </Column>
                </DataTable>
            </template>
            <template v-else>
                <div class="text-center p-6 text-gray-500 italic">
                    Nu există reclamații de afișat.
                </div>
            </template>
        </div>
    </div>
</template>

<script setup="ts">
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

const complaints = ref([]);
const router = useRouter();
const user = JSON.parse(localStorage.getItem('user'));

const goToComplaintPage = (complaint_id) => {
    router.push({ name: 'complaint', params: { id: complaint_id } });
}
const getComplaints = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/complaints').then((response) => {
        response.data.data.forEach((complaint) => {
            if(complaint.user_id == user.id)
            {
                complaints.value.push(complaint);
            }
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

onMounted(() => {
    getComplaints();
})
</script>
