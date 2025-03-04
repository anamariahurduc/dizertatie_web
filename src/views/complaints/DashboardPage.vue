<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Reclamatii recente</div>
                <DataTable :value="complaints" :rows="5" :paginator="true" responsiveLayout="scroll">
                    <Column field="titlu" header="Titlu" :sortable="true" style="width: 35%"></Column>
                    <Column field="categorie" header="Categorie" :sortable="true" style="width: 35%"></Column>
                    <Column field="status" header="Status" :sortable="true" style="width: 35%"></Column>
<!--                    <Column style="width: 15%" header="View">-->
<!--                        <template #body="slotProps">-->
<!--                            <Button icon="pi pi-search" type="button" class="p-button-text" @click="viewComplaint(slotProps.data)"></Button>-->
<!--                        </template>-->
<!--                    </Column>-->
                </DataTable>
            </div>
            <div class="card">
                <div class="flex justify-between items-center mb-6">
                    <div class="font-semibold text-xl">Distribuția categoriilor</div>
<!--                    <div>-->
<!--                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu2.toggle($event)"></Button>-->
<!--                        <Menu ref="menu2" :popup="true" :model="items" class="!min-w-40"></Menu>-->
<!--                    </div>-->
                </div>
                <ul class="list-none p-0 m-0">
                    <template v-for="(key) in Object.keys(categoryPercentages)">
                    <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">{{ key }}</span>
                            <div class="mt-1 text-muted-color">Categorie</div>
                        </div>
                        <div class="mt-2 md:mt-0 flex items-center">
<!--                            <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">-->
<!--                                <div class="bg-orange-500 h-full" style="width: 20%"></div>-->
<!--                            </div>-->
                            <div
                                class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24"
                                style="height: 8px"
                            >
                                <div
                                    :class="getBarColor(key)"
                                    class="h-full"
                                    :style="{ width: categoryPercentages[key] + '%' }"
                                ></div>
                            </div>
                            <span class="text-orange-500 ml-4 font-medium">{{ categoryPercentages[key] }}%</span>
                        </div>
                    </li>
                    </template>
                </ul>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Distribuția statusurilor per categorie</div>
                <Chart type="bar" :data="categoryStatusPercentages" :options="chartOptions" class="h-80" />

            </div>
            <div class="card">
                <div class="flex items-center justify-between mb-6">
                    <div class="font-semibold text-xl">Notificări</div>
                    <div>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu1.toggle($event)"></Button>
                        <Menu ref="menu1" :popup="true" :model="items" class="!min-w-40"></Menu>
                    </div>
                </div>

                <span class="block text-muted-color font-medium mb-4">ASTĂZI</span>
                <ul class="p-0 mx-0 mt-0 mb-6 list-none">
                    <li class="flex items-center py-2 border-b border-surface">
                        <div class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full mr-4 shrink-0">
                            <i class="pi pi-check !text-xl text-green-500"></i>
                        </div>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal"
                            >Statusul reclamatiei copaci netoaletați, risc de accidente s-a modificat în
                            <span class="text-surface-700 dark:text-surface-100"> <span class="text-primary font-bold"> rezolvat.</span></span>
                        </span>
                    </li>
                    <li class="flex items-center py-2">
                        <div class="w-12 h-12 flex items-center justify-center bg-yellow-100 dark:bg-yellow-400/10 rounded-full mr-4 shrink-0">
                            <i class="pi pi-bell !text-xl text-yellow-500"></i>
                        </div>
                        <span class="text-surface-700 dark:text-surface-100 leading-normal">Statusul reclamației timp lung de așteptare la ghișeu s-a modificat <span class="text-primary font-bold">în progres.</span></span>
                    </li>
                </ul>

                <span class="block text-muted-color font-medium mb-4">IERI</span>
                <ul class="p-0 m-0 list-none mb-6">
                    <li class="flex items-center py-2 border-b border-surface">
                        <div class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full mr-4 shrink-0">
                            <i class="pi pi-check !text-xl text-green-500"></i>
                        </div>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal">
                            <span class="text-surface-700 dark:text-surface-100">Reclamația depozit ilegal de deșeuri în apropierea parcului a fost adăugată cu <span class="text-primary font-bold">succes.</span></span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ProductService } from '@/service/ProductService';
import {computed, onMounted, ref, watch} from 'vue';
import axios from "axios";

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const complaints = ref([]);

const getComplaints = async () => {
    await axios.get('https://anamaria.hurduc.master.develop.eiddew.com/api/complaints').then((response) => {
        response.data.data.forEach((complaint) => {
            complaints.value.push(complaint);
        })
    })
}

const post = async () => {
    await axios.post('https://anamaria.hurduc.master.develop.eiddew.com/api/complaints').then((response) => {
        console.log(response)
    })
}

const categoryStatusPercentages = computed(() => {
    const categoryData = {};

    // Grupăm reclamațiile pe categorii și statusuri
    complaints.value.forEach((complaint) => {
        if (!categoryData[complaint.categorie]) {
            categoryData[complaint.categorie] = { 'Rezolvat': 0, 'În progres': 0, 'În așteptare': 0, total: 0 };
        }
        categoryData[complaint.categorie][complaint.status] += 1;
        categoryData[complaint.categorie].total += 1;
    });

    // Calculăm procentele pentru fiecare status din fiecare categorie
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
        categoryCount[complaint.categorie] = (categoryCount[complaint.categorie] || 0) + 1;
    });

    const percentages = {};
    Object.keys(categoryCount).forEach((category) => {
        percentages[category] = ((categoryCount[category] / totalComplaints) * 100).toFixed(2);
    });

    console.log(percentages);
    return percentages;
})
const getBarColor = (category) => {
    switch (category) {
        case 'Servicii Publice':
            return 'bg-orange-500';
        case 'Infrastructură':
            return 'bg-cyan-500';
        case 'Mediu':
            return 'bg-green-500';
        case 'Administrație':
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
const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-trash' }
]);

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

onMounted(() => {
    getComplaints();
    post();
});

</script>
