<template>
    <template v-if="isLoading">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">📊 Statusuri globale ale reclamațiilor</div>
                <Chart type="bar" :data="globalStatusData" :options="chartOptions" class="h-80" />
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">👤 Top utilizatori după număr de reclamații</div>
                <ul class="list-none p-0 m-0 space-y-4">
                    <li v-for="(user, index) in topUsers" :key="index" class="flex justify-between">
                        <span>{{ user.name }}</span>
                        <span class="text-blue-600 font-semibold">{{ user.count }} reclamații</span>
                    </li>
                </ul>
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">⏱️ Timp mediu de rezolvare</div>
                <Chart type="line" :data="averageResolutionTime" :options="lineOptions" class="h-80" />
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">⚠️ Reclamații urgente / blocate</div>
                <Chart type="doughnut" :data="urgentBlockedData" :options="doughnutOptions" class="max-w-sm mx-auto" />
                <p class="text-center text-muted-color mt-4">Procentaj din total reclamații</p>
            </div>

            <div class="card xl:col-span-2">
                <div class="flex justify-between items-center mb-4">
                    <div class="font-semibold text-xl">📈 Evoluția reclamațiilor în timp</div>
                    <Button @click="exportData" icon="pi pi-download" label="Exportă CSV" class="p-button-sm p-button-outlined" />
                </div>
                <div class="w-full h-80 relative">
                    <Chart type="line" :data="complaintsOverTime" :options="lineOptions" class="w-full h-full" />
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

<script setup="ts">
import {computed, onMounted, ref} from 'vue'
import axios from "axios";

const complaints = ref([]);
const users = ref([]);
const isLoading = ref(false);

const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
};

const globalStatusData = computed(() => {
    const statusTypes = ['Rezolvat', 'În progres', 'În așteptare'];
    const statusData = { 'Rezolvat': 0, 'În progres': 0, 'În așteptare': 0 };

    complaints.value.forEach((complaint) => {
        if (statusTypes.includes(complaint.status)) {
            statusData[complaint.status] += 1;
        }
    });

    return {
        labels: statusTypes,
        datasets: [
            {
                label: 'Număr reclamații',
                backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
                data: statusTypes.map(status => statusData[status])
            }
        ]
    };
});

const topUsers = computed(() => {
    const userComplaintMap = {};

    complaints.value.forEach((complaint) => {
        const userId = complaint.user_id;

        let user_index = users.value.findIndex(item => item.id == complaint.user_id);

        if(user_index >= 0)
        {
            let name = users.value[user_index].last_name + ' ' + users.value[user_index].first_name;
            if (!userComplaintMap[userId]) {
                userComplaintMap[userId] = { name: name, count: 0 };
            }

            userComplaintMap[userId].count += 1;
        }

    });

    const sortedUsers = Object.values(userComplaintMap).sort((a, b) => b.count - a.count);

    return sortedUsers.slice(0, 5);
});

function formatDateToMonth(dateInput) {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
}

const averageResolutionTime = computed(() => {
    const resolutionTimesByMonth = {};

    complaints.value.forEach(complaint => {
        if (complaint.status === 'Rezolvat' && complaint.updated_at && complaint.created_at) {
            const month = formatDateToMonth(complaint.updated_at);
            const diff = (new Date(complaint.updated_at) - new Date(complaint.created_at)) / (1000 * 60 * 60 * 24);

            if (!resolutionTimesByMonth[month]) {
                resolutionTimesByMonth[month] = [];
            }
            resolutionTimesByMonth[month].push(diff);
        }
    });

    const labels = Object.keys(resolutionTimesByMonth).sort();
    const data = labels.map(month => {
        const times = resolutionTimesByMonth[month];
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        return Number(avg.toFixed(2));
    });

    return {
        labels,
        datasets: [
            {
                label: 'Timp mediu de rezolvare (zile)',
                data,
                fill: false,
                borderColor: '#2563eb',
                tension: 0.1,
            }
        ]
    };
});

const urgentBlockedData = computed(() => {
    const total = complaints.value.length;

    const urgentCount = complaints.value.filter(c => c.priority == 5).length;
    const blockedCount = complaints.value.filter(c => c.priority == 2).length;
    const othersCount = total - urgentCount - blockedCount;

    return {
        labels: ['Urgente', 'Prioritar', 'Altele'],
        datasets: [
            {
                data: [urgentCount, blockedCount, othersCount],
                backgroundColor: ['#dc2626', '#9ca3af', '#3b82f6'], // roșu, gri, albastru
                hoverBackgroundColor: ['#b91c1c', '#6b7280', '#2563eb'],
            }
        ]
    };
});

const complaintsOverTime = computed(() => {
    const countsByMonth = {};

    complaints.value.forEach(complaint => {
        const month = formatDateToMonth(complaint.created_at); // ex: '2024-05'
        countsByMonth[month] = (countsByMonth[month] || 0) + 1;
    });

    const labels = Object.keys(countsByMonth).sort();
    const data = labels.map(label => countsByMonth[label]);

    return {
        labels,
        datasets: [
            {
                label: 'Număr reclamații',
                data,
                fill: false,
                borderColor: '#2563eb',
                tension: 0.1
            }
        ]
    };
});

const getComplaints = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/complaints').then((response) => {
        response.data.data.forEach((complaint) => {
            complaints.value.push(complaint);
        })
    })
}

const getUsers = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/users').then((response) => {
        response.data.data.forEach((user) => {
            users.value.push(user);
        })
    })
}

function exportData() {
    const labels = complaintsOverTime.value.labels;
    const data = complaintsOverTime.value.datasets[0].data;

    let csvContent = 'Luna,Numar reclamatii\n';
    labels.forEach((label, index) => {
        csvContent += `${label},${data[index]}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'evolutie_reclamatii.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

onMounted(async() => {
    await getComplaints();
    await getUsers();

    isLoading.value = true;
})

</script>
