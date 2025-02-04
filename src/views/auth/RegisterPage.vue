<template>
    <FloatingConfigurator/>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="w-auto bg-contain bg-center bg-no-repeat ml-24 ">
                            <img src="@/assets/ClaimFlow.png" class="w-72 h-auto mt-5"/>
                        </div>
                        <span class="text-[#213c8d] text-2xl font-bold">Register</span>
                    </div>

                    <div>
                        <label for="first_name" class="block text-[#213c8d] dark:text-surface-0 text-xl font-medium mb-2">First Name</label>
                        <InputText id="first_name" type="text" placeholder="First Name" class="w-full md:w-[30rem] mb-8" v-model="first_name" />

                        <label for="last_name" class="block text-[#213c8d] dark:text-surface-0 text-xl font-medium mb-2">Last Name</label>
                        <InputText id="last_name" type="text" placeholder="Last Name" class="w-full md:w-[30rem] mb-8" v-model="last_name" />

                        <label for="email1" class="block text-[#213c8d] dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="username" />

                        <label for="password1" class="block text-[#213c8d] dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <Button @click="register()" label="Register" class="w-full"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import {useRouter} from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import {useCookies} from "vue3-cookies";

const router = useRouter();
const username = ref('');
const password = ref('');
const last_name = ref('');
const first_name = ref('');
const checked = ref(false);

const register = async() => {
    await axios.post('http://anamaria.hurduc.master.develop.eiddew.com/api/register', {
        first_name: first_name.value,
        last_name: last_name.value,
        email: username.value,
        password: password.value
    }).then((response) => {
        Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success"
        });
    }).catch((error) => {
        console.log(error);
        Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error"
        })
    })
}

</script>


<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
