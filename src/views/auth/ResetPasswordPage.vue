<template>
    <FloatingConfigurator />
    <div class="flex items-center justify-center min-h-screen overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, color-mix(in srgb, var(--primary-color), transparent 60%) 10%, var(--surface-ground) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                    <img src="@/assets/ClaimFlow.png" alt="Claim Flow" class="w-72 h-auto mt-5"/>
                    <div class="mt-4">
                        <label for="forgot_password" class="block text-[#213c8d] dark:text-surface-0 font-medium text-xl mb-2">Parola noua</label>
                        <Password id="forgot_password" v-model="new_password" placeholder="Parolă" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <label for="forgot_password" class="block text-[#213c8d] dark:text-surface-0 font-medium text-xl mb-2">Confirma parola</label>
                        <Password id="forgot_password" v-model="confirm_password" placeholder="Parolă" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                    </div>
                    <Button @click="confirmPassword()" label="Schimba parola" class="w-full mt-5"></Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import {ref} from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const router = useRouter();
const route = useRoute();

const token = route.query.token;
const email = route.query.email;

const new_password = ref('');
const confirm_password = ref('');
const user = JSON.parse(localStorage.getItem('user'));

console.log(token, email);

const confirmPassword = async () => {
    await axios.post('https://api.claim-flow.dev.eiddew.com/api/reset-password',
        {
            email: user.email,
            token: token,
            password: new_password.value,
            password_confirmation: confirm_password.value
        }).then(async (response) => {
        Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success"
        });
    })
}

</script>
