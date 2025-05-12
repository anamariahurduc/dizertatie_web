<template>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white shadow rounded-lg p-4 text-center">
            <div class="text-sm text-gray-500">Total reclamații</div>
            <div class="text-2xl font-bold text-primary">10</div>
        </div>
        <div class="bg-white shadow rounded-lg p-4 text-center">
            <div class="text-sm text-gray-500">În progres</div>
            <div class="text-2xl font-bold text-yellow-500">2</div>
        </div>
        <div class="bg-white shadow rounded-lg p-4 text-center">
            <div class="text-sm text-gray-500">Rezolvate</div>
            <div class="text-2xl font-bold text-green-500">3</div>
        </div>
        <div class="bg-white shadow rounded-lg p-4 text-center">
            <div class="text-sm text-gray-500">Nerezolvate</div>
            <div class="text-2xl font-bold text-red-500">3</div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
        <div class="bg-white shadow rounded-lg p-4 text-center">
            <div class="text-sm text-gray-500">Număr total de utilizatori</div>
            <div class="text-2xl font-bold text-surface-900">5</div>

            <router-link to="/admin/users" class="inline-block mt-4 bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-dark transition">
                Vezi toți utilizatorii
            </router-link>
        </div>
    </div>


</template>

<script setup>

</script>
