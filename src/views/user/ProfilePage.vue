<template>
    <Fluid>
        <div class="flex">
            <div class="card flex flex-col gap-4 w-1/2">
                <h2 class="text-2xl font-bold text-gray-800">Informații personale</h2>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-1/2">
                        <label for="firstname">Nume</label>
                        <InputText v-model="user.first_name" id="firstname" type="text" />
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 w-1/2">
                    <label for="lastname">Prenume</label>
                    <InputText v-model="user.last_name" id="lastname" type="text" />
                </div>
                <div class="flex flex-wrap gap-2 w-1/2">
                    <label for="email">Email</label>
                    <InputText v-model="user.email" id="email" type="text" />
                </div>
<!--                <div class="flex flex-wrap gap-2 w-1/2">-->
<!--                    <label for="password" class="dark:text-surface-0 font-medium">Parolă</label>-->
<!--                    <Password id="password" v-model="user.password" placeholder="Parolă" :toggleMask="true" :feedback="false" class="w-full" />-->
<!--                </div>-->
<!--                <div class="flex flex-col md:flex-row gap-4">-->
<!--                    <div class="flex flex-wrap gap-2 w-full">-->
<!--                        <label for="state">Sector</label>-->
<!--                        <Select id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select One" class="w-full"></Select>-->
<!--                    </div>-->
<!--                </div>-->

<!--                <div class="flex flex-wrap">-->
<!--                    <label for="address">Adresa</label>-->
<!--                    <Textarea id="address" rows="4" />-->
<!--                </div>-->

                <div class="flex flex-wrap gap-2 w-1/2">
                    <Button @click="changeProfileData()" label="Actualizeaza" class="w-1/2 mt-5"></Button>
                </div>
            </div>
        </div>

        <div class="flex mt-4">
            <div class="card w-full p-6 flex flex-col gap-6">
                <h2 class="text-2xl font-bold text-gray-800">Securitate</h2>

                <div class="flex justify-between items-center">
                    <span class="text-lg font-medium">Parolă</span>
                    <Button
                        @click="changePassword"
                        class="p-button max-w-fit flex items-center"
                        :disabled="isLoading"
                    >
                        <svg
                            v-if="isLoading"
                            class="w-5 h-5 animate-spin mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path
                                d="M4 12a8 8 0 0 1 16 0"
                                stroke="currentColor"
                                stroke-width="4"
                            ></path>
                        </svg>

                        <span>Schimba parola</span>
                    </Button>
                </div>

                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <span class="text-lg font-medium">Autentificare 2FA:</span>
                        <template v-if="is_active_2fa">
                            <svg class="w-6 h-6" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="256" cy="256" r="256" fill="#4bae4f" />
                                <path d="M357.2 165.9l-95.4-37.2c-3.7-1.5-7.9-1.5-11.6 0l-95.4 37.2c-6.2 2.4-10.2 8.4-10.2 15 .1 6.8.3 13.5.6 19.8 1.3 26.7 4.3 52.9 9.1 78 3.1 16.2 12.9 33.5 29.1 51.3s40.2 37.3 64.2 52.1c2.6 1.6 5.5 2.4 8.4 2.4s5.8-.8 8.4-2.4c24-14.9 48-34.4 64.2-52.1 16.2-17.8 26-35.1 29.1-51.4 4.7-24.9 7.8-51.1 9.1-77.9.3-7 .6-13.6.6-19.8.1-6.5-4-12.6-10.2-15zm-116.5 92.5 44.1-39.7c6.6-5.9 16.7-5.4 22.6 1.2s5.4 16.7-1.2 22.6l-54.9 49.4c-3 2.7-6.9 4.1-10.7 4.1-3.9 0-7.7-1.4-10.8-4.2l-24.1-21.9c-6.5-5.9-7-16.1-1.1-22.6s16.1-7 22.6-1.1z" fill="#fff" />
                            </svg>
                            <span class="text-green-700 font-semibold">Activ</span>
                        </template>
                        <template v-else>
                            <svg class="w-6 h-6" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="256" cy="256" r="256" fill="#fc0005" />
                                <path d="m241.783 400.529c-22.176-10.018-44.971-22.825-64.163-39.386-19.545-16.865-35.29-37.572-42.847-63.114-2.742-9.266-3-21.534-3.195-30.922l-.019-.872c-.136-6.425-.17-12.9-.145-19.4.025-6.517.109-12.946.208-19.339.117-7.532.295-14.764.473-22 .275-11.183.551-22.371.587-33.3l.076-22.71a7.5 7.5 0 0 1 6.566-7.439l22.518-2.863a301.872 301.872 0 0 0 39.145-7.366c13.125-3.508 25.709-8.264 34.936-14.764l13.752-9.687a7.513 7.513 0 0 1 8.524-.083l14.081 8.43a171.615 171.615 0 0 0 36.563 16.491 174.194 174.194 0 0 0 39.422 7.543l23.908 1.816a7.518 7.518 0 0 1 6.959 7.5h.008v23.977c0 11.8.331 22.469.661 33.124.214 6.937.429 13.871.564 21.067.106 5.67.191 11.381.219 17.172s0 11.547-.125 17.259c-.1 4.775-.232 9.8-.542 14.4a116.954 116.954 0 0 1 -1.842 14.886c-5.549 27.705-21.384 50.044-41.764 68.106-19.919 17.653-44.1 31.126-67.073 41.482l-10.643 4.8a7.494 7.494 0 0 1 -6.173 0l-10.639-4.806zm-54.345-50.729c17.891 15.439 39.443 27.514 60.518 37.035l7.556 3.413 7.553-3.406c21.862-9.857 44.76-22.574 63.31-39.014 18.09-16.031 32.112-35.69 36.943-59.815a101.367 101.367 0 0 0 1.607-12.947c.331-4.911.45-9.45.542-13.7.123-5.665.152-11.3.125-16.907s-.112-11.289-.219-17c-.126-6.75-.345-13.819-.564-20.891-.359-11.6-.719-23.215-.719-33.535v-17.01l-16.942-1.287a189.252 189.252 0 0 1 -42.832-8.19 186.578 186.578 0 0 1 -39.738-17.961l-10.24-6.131-9.773 6.884c-10.862 7.651-25.08 13.09-39.7 17a317.742 317.742 0 0 1 -41.143 7.719l-16 2.034-.054 16.1c-.038 11.342-.313 22.5-.587 33.657-.182 7.384-.364 14.766-.473 21.821-.1 6.426-.184 12.839-.208 19.163-.025 6.345.01 12.711.145 19.1l.019.872c.177 8.477.409 19.555 2.607 26.983 6.644 22.458 20.722 40.867 38.261 56zm-22.322-184.955a7.5 7.5 0 0 0 -6.566 7.439c-.019 5.667-.224 14.852-.464 25.581-.747 33.414-1.824 81.615 1.492 92.825q7.673 25.932 31.378 47.713 23.084 21.208 61.476 38.552a7.494 7.494 0 0 0 6.173 0q41.081-18.523 64.467-40.841 24.2-23.089 29.637-50.246c3.062-15.3 1.924-56.541 1.1-86.586-.286-10.376-.533-19.324-.533-26.244h-.008a7.516 7.516 0 0 0 -6.959-7.5 200.048 200.048 0 0 1 -45.389-8.707 197.329 197.329 0 0 1 -41.583-18.724 7.516 7.516 0 0 0 -8.513.091q-13.425 9.458-34.571 16.088-21.732 6.815-51.133 10.554zm55.6 3.791a300.287 300.287 0 0 1 -47.244 10.211c-.083 5.37-.231 11.979-.4 19.312-.725 32.448-1.772 79.254.9 88.3q6.482 21.908 27.145 40.893 20.37 18.715 54.4 34.5 36.547-16.9 57.2-36.607 20.711-19.764 25.228-42.309c2.773-13.86 1.666-54 .859-83.235-.209-7.582-.4-14.477-.5-19.788a213.567 213.567 0 0 1 -41.919-8.725 211.452 211.452 0 0 1 -40.976-17.988q-14.28 9.042-34.7 15.443zm-.563 63.384 25.206 25.206-25.206 25.206a7.524 7.524 0 1 0 10.647 10.641l25.2-25.206 25.207 25.206a7.524 7.524 0 0 0 10.641-10.641l-25.206-25.206 25.206-25.206a7.525 7.525 0 1 0 -10.642-10.641l-25.206 25.206-25.2-25.206a7.524 7.524 0 1 0 -10.641 10.641zm126.994-77.279a189.252 189.252 0 0 1 -42.832-8.19 186.578 186.578 0 0 1 -39.738-17.961l-10.24-6.131-9.773 6.884c-10.862 7.651-25.08 13.09-39.7 17a317.742 317.742 0 0 1 -41.143 7.719l-16 2.034-.054 16.1c-.038 11.342-.313 22.5-.587 33.657-.182 7.384-.364 14.766-.473 21.821-.1 6.426-.184 12.839-.208 19.163-.025 6.345.01 12.711.145 19.1l.019.872c.177 8.477.409 19.555 2.607 26.983 6.644 22.458 20.722 40.867 38.261 56 17.891 15.439 39.443 27.514 60.518 37.035l7.556 3.413 7.553-3.406c21.862-9.857 44.76-22.574 63.31-39.014 18.09-16.031 32.112-35.69 36.943-59.815a101.367 101.367 0 0 0 1.607-12.947c.331-4.911.45-9.45.542-13.7.123-5.665.152-11.3.125-16.907s-.112-11.289-.219-17c-.126-6.75-.345-13.819-.564-20.891-.359-11.6-.719-23.215-.719-33.535v-17.01l-16.942-1.287zm-46.231 2.095a197.329 197.329 0 0 1 -41.583-18.724 7.516 7.516 0 0 0 -8.513.091q-13.425 9.458-34.571 16.088-21.732 6.815-51.133 10.554a7.5 7.5 0 0 0 -6.566 7.439c-.019 5.667-.224 14.852-.464 25.581-.747 33.414-1.824 81.615 1.492 92.825q7.673 25.932 31.378 47.713 23.084 21.208 61.476 38.552a7.5 7.5 0 0 0 6.174 0q41.081-18.523 64.467-40.841 24.2-23.089 29.637-50.246c3.062-15.3 1.924-56.541 1.1-86.586-.286-10.376-.533-19.324-.533-26.244h-.008a7.516 7.516 0 0 0 -6.959-7.5 200.048 200.048 0 0 1 -45.394-8.702z" fill="#fff" fill-rule="evenodd"/>
                            </svg>
                            <span class="text-red-600 font-semibold">Inactiv</span>
                        </template>
                    </div>
                    <Button
                        :label="is_active_2fa ? 'Dezactivează 2FA' : 'Activează 2FA'"
                        :class="{
                            'p-button-success': !is_active_2fa,
                            'p-button-danger': is_active_2fa,
                            'p-button-outlined': true,
                            'max-w-fit': true
                        }"
                        @click="toggle2FA()"
                    />
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import axios from "axios";
import Swal from "sweetalert2";

const password = ref('');
const user = ref({});
const is_active_2fa = ref(false);

const dropdownItems = ref([
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
]);
const isLoading = ref(false);
const getUserData = () => {
    const user_storage_data = JSON.parse(localStorage.getItem('user'));
    user.value.first_name = user_storage_data.first_name;
    user.value.last_name = user_storage_data.last_name;
    user.value.email = user_storage_data.email;
}

const changeProfileData = async () => {

}
const getUser = async () => {
    axios.get('http://api.claim-flow.dev.eiddew.com/api/user').then(async (response) => {
        user.value.first_name = response.data.first_name;
        user.value.last_name = response.data.last_name;
        user.value.email = response.data.email;

        if(response.data.is_enable_2fa === 0)
        {
            is_active_2fa.value = false;
        } else {
            is_active_2fa.value = true;
        }
    })
};
const toggle2FA = () => {
    if(is_active_2fa.value)
    {
        axios.post('https://api.claim-flow.dev.eiddew.com/api/deactivate2fa').then(async (response) => {
            await Swal.fire({
                title: "Success",
                text: response.data.message,
                icon: "success"
            });

            await getUser();
        })
    } else {
        axios.post('https://api.claim-flow.dev.eiddew.com/api/activate2fa').then(async (response) => {
            await Swal.fire({
                title: "Success",
                text: response.data.message,
                icon: "success"
            });

            await getUser();
        })
    }
}

const changePassword = async () => {
    isLoading.value = true;
    await axios.post('https://api.claim-flow.dev.eiddew.com/api/forgot-password', {email: user.value.email}).then(async (response) => {
        Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success"
        });
        isLoading.value = false;
    })
}

onMounted(() => {
    getUser();
});

</script>
