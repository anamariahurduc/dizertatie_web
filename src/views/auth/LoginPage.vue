<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="w-auto bg-contain bg-center bg-no-repeat ml-24 ">
                            <img src="@/assets/ClaimFlow.png" alt="Claim Flow" class="w-72 h-auto mt-5"/>
                        </div>
                        <span class="text-[#213c8d] text-2xl font-bold">Autentificare</span>
                    </div>

                    <div v-if="!is2faGenerated">
                        <label for="email1" class="block text-[#213c8d] dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Adresa e-mail" class="w-full md:w-[30rem] mb-8" v-model="username" />

                        <label for="password1" class="block text-[#213c8d] dark:text-surface-0 font-medium text-xl mb-2">Parolă</label>
                        <Password id="password1" v-model="password" placeholder="Parolă" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <Button @click="login()" label="Autentificare" class="w-full"></Button>

                        <div class="mx-auto">
                            <div class="border-b text-center">
                                <div
                                    class="leading-none px-2 inline-block text-m text-[#213c8d] tracking-wide font-medium bg-white transform translate-y-1/2">
                                    Nu ai un cont încă?
                                </div>
                            </div>
                            <Button @click="register()" label="Înregistrează-te" class="w-full mt-5"></Button>
                        </div>
                    </div>

                    <div v-if="is2faGenerated && !is2faVerified" class="flex flex-col items-center justify-center">
                        <template v-if="qrCodeUrl">
                            <p class="text-xl text-center mb-4">Scanați codul QR cu aplicația dvs. de autentificare</p>
                            <div class="flex justify-center mb-8">
                                <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="QR Code" class="w-[200px] h-[200px]" />
                            </div>
                        </template>

                        <p class="text-xl text-center mb-4">Introduceți codul 2FA</p>
                        <div class="w-full md:w-[30rem] mb-8">
                            <InputText v-model="code" placeholder="Introduceți codul 2FA" class="w-full" />
                        </div>
                        <Button @click="verify2faCode()" label="Verificați codul 2FA" class="w-full mt-5"></Button>
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
import {useAuthStore} from "@/stores/authStore";

const router = useRouter();
const username = ref('');
const password = ref('');
const checked = ref(false);
const qrCodeUrl = ref(null);
const code = ref('');
const is2faVerified = ref(false);
const is2faGenerated = ref(false);
const { cookies } = useCookies();
const authStore = useAuthStore();

const user = ref({});
const login = async() => {
    await axios.post('https://api.claim-flow.dev.eiddew.com/api/login', {
        email: username.value,
        password: password.value
    }).then((response) => {
        Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success"
        });

        cookies.set("token", response.data.token, '', '/');
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        is2faGenerated.value = true;

        if(response.data.user.google2fa_secret == null)
        {
            generate2fa();
        }
    }).catch((error) => {
        Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error"
        })
    })
}

const generate2fa = async () => {
    await axios.post('https://api.claim-flow.dev.eiddew.com/api/generate2faSecret').then(async (response) => {
        qrCodeUrl.value = await generateQrCode(response.data.qrCodeUrl)
    })
}

const generateQrCode = async (code) => {
    return QRCode.toDataURL(code);
}
const verify2faCode = async () => {
    await axios.post('https://api.claim-flow.dev.eiddew.com/api/verify2fa', {
        code: code.value
    }).then((response) => {
        Swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success"
        })

        authStore.setUser(response.data.user);
        authStore.setToken(response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        // cookies.set("token", response.data.token, '', '/');
        cookies.set("token", response.data.token, '', '/');
        localStorage.setItem('user', JSON.stringify(response.data.user));

        if(response.data.user.role == 'user')
        {
            router.push({ name: 'dashboard' });
        } else {
            router.push({ name: 'admin-dashboard' });
        }
    }).catch((error) => {
        Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error"
        })
    })
}
const getUser = async () => {
    try {
        const response = await axios.get('http://api.claim-flow.dev.eiddew.com/api/user');
    } catch (error) {
        console.error('Failed to fetch user:', error);
    }
};

const register = () => {
    router.push('/register');
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
