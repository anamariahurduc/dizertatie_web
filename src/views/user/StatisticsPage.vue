<template>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <!-- Distribuția statusurilor per categorie -->
        <div class="card">
            <div class="font-semibold text-xl mb-4">📊 Distribuția statusurilor per categorie</div>
            <Chart type="bar" :data="categoryStatusPercentages" :options="chartOptions" class="h-80" />
        </div>

        <!-- Distribuția categoriilor -->
        <div class="card">
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
        </div>

        <!-- Reclamații în timp -->
        <div class="card">
            <div class="font-semibold text-xl mb-4">📈 Evoluția reclamațiilor</div>
            <Chart type="line" :data="complaintsOverTime" :options="lineOptions" class="h-80" />
        </div>

        <!-- Rata de rezolvare -->
        <div class="card">
            <div class="font-semibold text-xl mb-4">✅ Rata de rezolvare</div>
            <Chart type="doughnut" :data="resolutionRateData" :options="doughnutOptions" class="max-w-sm mx-auto" />
            <p class="text-center text-muted-color mt-4">Procentaj din total reclamații</p>
        </div>
    </div>
</template>
<!--<div class="card">-->
<!--<div class="flex items-center justify-between mb-6">-->
<!--    <div class="font-semibold text-xl">Notificări</div>-->
<!--    <div>-->
<!--        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu1.toggle($event)"></Button>-->
<!--        <Menu ref="menu1" :popup="true" :model="items" class="!min-w-40"></Menu>-->
<!--    </div>-->
<!--</div>-->
<!--<span class="block text-muted-color font-medium mb-4">ASTĂZI</span>-->
<!--<ul class="p-0 mx-0 mt-0 mb-6 list-none">-->
<!--    <li class="flex items-center py-2 border-b border-surface">-->
<!--        <div class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full mr-4 shrink-0">-->
<!--            <i class="pi pi-check !text-xl text-green-500"></i>-->
<!--        </div>-->
<!--        <span class="text-surface-900 dark:text-surface-0 leading-normal"-->
<!--        >Statusul reclamatiei copaci netoaletați, risc de accidente s-a modificat în-->
<!--                                    <span class="text-surface-700 dark:text-surface-100"> <span class="text-primary font-bold"> rezolvat.</span></span>-->
<!--                                </span>-->
<!--    </li>-->
<!--    <li class="flex items-center py-2">-->
<!--        <div class="w-12 h-12 flex items-center justify-center bg-yellow-100 dark:bg-yellow-400/10 rounded-full mr-4 shrink-0">-->
<!--            <i class="pi pi-bell !text-xl text-yellow-500"></i>-->
<!--        </div>-->
<!--        <span class="text-surface-700 dark:text-surface-100 leading-normal">Statusul reclamației timp lung de așteptare la ghișeu s-a modificat <span class="text-primary font-bold">în progres.</span></span>-->
<!--    </li>-->
<!--</ul>-->
<!--<span class="block text-muted-color font-medium mb-4">IERI</span>-->
<!--<ul class="p-0 m-0 list-none mb-6">-->
<!--    <li class="flex items-center py-2 border-b border-surface">-->
<!--        <div class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full mr-4 shrink-0">-->
<!--            <i class="pi pi-check !text-xl text-green-500"></i>-->
<!--        </div>-->
<!--        <span class="text-surface-900 dark:text-surface-0 leading-normal">-->
<!--                                <span class="text-surface-700 dark:text-surface-100">Reclamația depozit ilegal de deșeuri în apropierea parcului a fost adăugată cu <span class="text-primary font-bold">succes.</span></span>-->
<!--                            </span>-->
<!--    </li>-->
<!--</ul>-->
<!--</div>-->
<script setup="ts">
import {useLayout} from "@/layout/composables/layout";
import {computed, onMounted, ref} from "vue";
import axios from "axios";

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const complaints = ref([]);
const categoryStatusPercentages = computed(() => {
    const categoryData = {};

    complaints.value.forEach((complaint) => {
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
        categoryCount[complaint.category] = (categoryCount[complaint.category] || 0) + 1;
    });

    const percentages = {};
    Object.keys(categoryCount).forEach((category) => {
        percentages[category] = ((categoryCount[category] / totalComplaints) * 100).toFixed(2);
    });

    console.log(percentages);
    return percentages;
})

const complaintsOverTime = {
    labels: ['Ian', 'Feb', 'Mar', 'Apr', 'Mai'],
    datasets: [
        {
            label: 'Reclamații',
            data: [12, 19, 8, 15, 22],
            fill: false,
            borderColor: '#3b82f6',
            tension: 0.3,
        },
    ],
};

const resolutionRateData = {
    labels: ['Rezolvate', 'Nerezolvate'],
    datasets: [
        {
            data: [65, 35],
            backgroundColor: ['#22c55e', '#ef4444'],
            hoverBackgroundColor: ['#16a34a', '#dc2626'],
        },
    ],
};
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
    console.log(rowData)
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
