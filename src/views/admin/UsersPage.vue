<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Utilizatori</div>
        <DataTable :value="users" :rows="5" :paginator="true" responsiveLayout="scroll">
            <Column field="last_name" header="Nume" :sortable="true" style="width: 20%"></Column>
            <Column field="first_name" header="Prenume" :sortable="true" style="width: 20%"></Column>
            <Column field="email" header="Email" :sortable="true" style="width: 20%"></Column>
            <Column field="created_at" header="Data inregistrarii" :sortable="true" style="width: 30%">
                <template #body="slotProps">
                    {{ formattedDate(slotProps.data.created_at) }}
                </template>
            </Column>
            <Column header="Acțiuni" style="width: 20%">
                <template #body="slotProps">
                    <button
                        class="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 transition mb-2"
                        @click="editUser(slotProps.data)"
                    >
                        Editează
                    </button>
                    <button
                        class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        @click="deleteUser(slotProps.data)"
                    >
                        Șterge
                    </button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import axios from "axios";
import {computed, onMounted, ref} from "vue";

const users = ref([]);
const getUsers = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/users').then((response) => {
        response.data.data.forEach((user) => {
            users.value.push(user);
        })
    })
}

const formattedDate = computed(() => (date) => {
    console.log(date)
    return new Date(date).toLocaleString('ro-RO', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
})

const editUser = async () => {

}

const deleteUser = async () => {

}

onMounted(() => {
    getUsers();

    console.log(users.value)
})
</script>
