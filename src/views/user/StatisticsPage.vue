<template>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <template v-if="categoryStatusPercentages.labels.length > 0">
            <div class="card">
                <div class="font-semibold text-xl mb-4">📊 Distribuția statusurilor per categorie</div>
                <Chart type="bar" :data="categoryStatusPercentages" :options="chartOptions" class="h-80" />
            </div>
        </template>
        <template v-else>
            <div class="card">

            <div class="text-center text-gray-500 italic py-10">
                Nu există date pentru afișarea graficului.
            </div>
            </div>
        </template>


        <div class="card">
            <template v-if="!hasNoValidData">
                <div class="font-semibold text-xl mb-4">📁 Distribuția categoriilor</div>
                <ul class="list-none p-0 m-0 space-y-6">
                <li
                    v-for="(key, index) in Object.keys(categoryPercentages)"
                    :key="index"
                    class="flex flex-col md:flex-row md:items-center md:justify-between"
                >
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium mr-2">{{ key }}</span>
                        <div class="text-sm text-muted-color">Categorie</div>
                    </div>
                    <div class="mt-2 md:mt-0 flex items-center gap-3">
                        <div class="w-48 bg-surface-300 dark:bg-surface-500 h-2 rounded overflow-hidden">
                            <div
                                :class="getBarColor(key)"
                                class="h-2 rounded"
                                :style="{ width: categoryPercentages[key] + '%' }"
                            ></div>
                        </div>
                        <span class="text-orange-500 font-medium">{{ categoryPercentages[key] }}%</span>
                    </div>
                </li>
            </ul>
            </template>
            <template v-else>
                <div class="card">
                    <div class="text-center text-gray-500 italic py-10">
                        Nu există date pentru afișarea graficului.
                    </div>
                </div>
            </template>
        </div>

        <div class="card">
            <template v-if="!hasNoComplaintsOverTime">
                <div class="font-semibold text-xl mb-4">📈 Evoluția reclamațiilor</div>
                <Chart type="line" :data="complaintsOverTime" :options="lineOptions" class="h-80" />
            </template>
            <template v-else>
                <div class="card">
                    <div class="text-center text-gray-500 italic py-10">
                        Nu există date pentru afișarea graficului.
                    </div>
                </div>
            </template>
        </div>

        <div class="card">
            <template v-if="!hasNoResolutionData">
                <div class="font-semibold text-xl mb-4">✅ Rata de rezolvare</div>
                <Chart type="doughnut" :data="resolutionRateData" :options="doughnutOptions" class="max-w-sm mx-auto" />
                <p class="text-center text-muted-color mt-4">Procentaj din total reclamații</p>
            </template>
            <template v-else>
                <div class="card">
                    <div class="text-center text-gray-500 italic py-10">
                        Nu există date pentru afișarea graficului.
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup="ts">
import {useLayout} from "@/layout/composables/layout";
import {computed, onMounted, ref} from "vue";
import axios from "axios";

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const user = JSON.parse(localStorage.getItem('user'));
const complaints = ref([]);

const hasNoValidData = computed(() => {
    const percentages = categoryPercentages.value;
    return Object.keys(percentages).length === 0 || Object.values(percentages).every(p => Number(p) === 0);
});

const categoryStatusPercentages = computed(() => {
    const categoryData = {};

    complaints.value.forEach((complaint) => {
        if (complaint.user_id !== user.id) return;

        if (!categoryData[complaint.category]) {
            categoryData[complaint.category] = { 'Rezolvat': 0, 'În progres': 0, 'În așteptare': 0, total: 0 };
        }
        categoryData[complaint.category][complaint.status] += 1;
        categoryData[complaint.category].total += 1;
    });

    const categories = Object.keys(categoryData);
    const statusTypes = ['Rezolvat', 'În progres', 'În așteptare'];

    const datasets = statusTypes.map((status, index) => {
        return {
            label: status,
            data: categories.map(category =>
                ((categoryData[category][status] / categoryData[category].total) * 100).toFixed(2)
            ),
            backgroundColor: ["#22c55e", "#facc15", "#ef4444"][index], // Verde, Galben, Roșu
            hoverBackgroundColor: ["#16a34a", "#eab308", "#dc2626"][index]
        };
    });

    return {
        labels: categories,
        datasets: datasets
    };
});

const categoryPercentages = computed(() => {
    const categoryCount = {};
    const totalComplaints = complaints.value.length;

    if (totalComplaints === 0) return {};

    complaints.value.forEach((complaint) => {
        if (complaint.user_id !== user.id) return;

        categoryCount[complaint.category] = (categoryCount[complaint.category] || 0) + 1;
    });

    const percentages = {};
    Object.keys(categoryCount).forEach((category) => {
        percentages[category] = ((categoryCount[category] / totalComplaints) * 100).toFixed(2);
    });

    return percentages;
})

const hasNoComplaintsOverTime = computed(() => {
    return complaintsOverTime.value.datasets[0].data.every(count => count === 0);
});

const complaintsOverTime = computed(() => {
    const monthlyCount = Array(12).fill(0); // 12 luni

    complaints.value.forEach((complaint) => {
        if (complaint.user_id !== user.id) return;

        const date = new Date(complaint.created_at);
        const monthIndex = date.getMonth(); // 0 (Ian) - 11 (Dec)
        monthlyCount[monthIndex]++;
    });

    return {
        labels: ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'],
        datasets: [
            {
                label: 'Reclamații',
                data: monthlyCount,
                fill: false,
                borderColor: '#3b82f6',
                tension: 0.3,
            },
        ],
    };
});

const hasNoResolutionData = computed(() => {
    const data = resolutionRateData.value.datasets[0].data;
    return data[0] === 0 && data[1] === 0;
});

const resolutionRateData = computed(() => {
    let resolved = 0;
    let unresolved = 0;

    complaints.value.forEach((complaint) => {
        if (complaint.user_id !== user.id) return;

        if (complaint.status === 'Rezolvat') {
            resolved++;
        } else {
            unresolved++;
        }
    });

    return {
        labels: ['Rezolvate', 'Nerezolvate'],
        datasets: [
            {
                data: [resolved, unresolved],
                backgroundColor: ['#22c55e', '#ef4444'],
                hoverBackgroundColor: ['#16a34a', '#dc2626'],
            },
        ],
    };
});
const getBarColor = (category) => {
    switch (category) {
        case 'Salubritate':
            return 'bg-orange-500';
        case 'infrastructura':
            return 'bg-cyan-500';
        case 'Infrastructura':
            return 'bg-green-500';
        case 'spatii verzi':
            return 'bg-purple-500';
        default:
            return 'bg-gray-500';
    }
}
const getStatusClass = (rowData) => {
    if (rowData.status === 'Rezolvat') {
        return 'text-green-500';
    } else if (rowData.status === 'În progres') {
        return 'text-yellow-500';
    } else if (rowData.status === 'În așteptare') {
        return 'text-red-500';
    }
    return ''; // În caz că nu există un status valid
}

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "top"
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 100
        }
    }
});

const lineOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
    },
};

const doughnutOptions = {
    cutout: '70%',
    plugins: {
        legend: {
            position: 'bottom',
        },
    },
};
const getComplaints = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/complaints').then((response) => {
        response.data.data.forEach((complaint) => {
            complaints.value.push(complaint);
        })
    })
}

onMounted(() => {
    getComplaints();
})
</script>
