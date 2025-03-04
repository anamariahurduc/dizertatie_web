<template>
    <div>
        <label for="domain">Domeniu</label>
        <Select @change="selectDomain()" id="domain" v-model="domainSelected" :options="domains" optionLabel="name" placeholder="Selectează un domeniu" class="w-full"></Select>
    </div>

    <div>
        <label for="problem">Problemă</label>
        <Select @change="sendDomainAndProblem()" id="problem" v-model="problemSelected" :options="domainProblems" optionLabel="name" placeholder="Selectează o problemă" class="w-full"></Select>
    </div>

    <div class="flex w-full">
        <div class="m-2 w-full border flex flex-col rounded-t-xl">
            <header class="w-full bg-primary-500 flex justify-between px-2 py-1 rounded-t-lg items-center">
                <h2 class="text-xl font-semibold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 w-6" viewBox="0 0 24 24">
                        <g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#ffffff">
                            <path d="M4 15.5a2 2 0 1 1 0-4m16 4a2 2 0 1 0 0-4M7 7V4m10 3V4" />
                            <circle cx="7" cy="3" r="1" />
                            <circle cx="17" cy="3" r="1" />
                            <path d="M13.5 7h-3c-2.828 0-4.243 0-5.121.909S4.5 10.281 4.5 13.207s0 4.389.879 5.298c.878.909 2.293.909 5.121.909h1.025c.792 0 1.071.163 1.617.757c.603.657 1.537 1.534 2.382 1.738c1.201.29 1.336-.111 1.068-1.256c-.076-.326-.267-.847-.066-1.151c.113-.17.3-.212.675-.296c.591-.132 1.079-.348 1.42-.701c.879-.91.879-2.372.879-5.298s0-4.389-.879-5.298C17.743 7 16.328 7 13.5 7" />
                            <path d="M9.5 15c.57.607 1.478 1 2.5 1s1.93-.393 2.5-1m-5.491-4H9m6.009 0H15" />
                        </g>
                    </svg>
                    Chatbot reclamații
                </h2>
                <span class="text-white aspect-square w-8 cursor-pointer p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="#ffffff" d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12L5.293 6.707a1 1 0 0 1 0-1.414" />
                    </svg>
                </span>
            </header>

            <!-- Chat messages -->
            <div class="flex flex-col gap-4 p-2 select-none">
                <div v-for="(message, index) in messages" :key="index" class="flex items-end" :class="message.sender === 'bot' ? '' : 'flex-row-reverse'">
                    <div v-if="message.sender === 'bot'" class="rounded bg-primary-500 w-8 aspect-square p-1.5">
                        <!-- Bot SVG Icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#ffffff">
                                <path d="M4 15.5a2 2 0 1 1 0-4m16 4a2 2 0 1 0 0-4M7 7V4m10 3V4" />
                                <circle cx="7" cy="3" r="1" />
                                <circle cx="17" cy="3" r="1" />
                                <path d="M13.5 7h-3c-2.828 0-4.243 0-5.121.909S4.5 10.281 4.5 13.207s0 4.389.879 5.298c.878.909 2.293.909 5.121.909h1.025c.792 0 1.071.163 1.617.757c.603.657 1.537 1.534 2.382 1.738c1.201.29 1.336-.111 1.068-1.256c-.076-.326-.267-.847-.066-1.151c.113-.17.3-.212.675-.296c.591-.132 1.079-.348 1.42-.701c.879-.91.879-2.372.879-5.298s0-4.389-.879-5.298C17.743 7 16.328 7 13.5 7" />
                                <path d="M9.5 15c.57.607 1.478 1 2.5 1s1.93-.393 2.5-1m-5.491-4H9m6.009 0H15" />
                            </g>
                        </svg>
                    </div>
                    <div v-else class="rounded bg-primary-500 w-8 aspect-square p-1.5 flex items-center justify-center text-white">
                        U
                    </div>
                    <p :class="message.sender === 'bot'
                            ? 'mx-2 p-5 rounded bg-gray-200 leading-4 text-lg'
                            : 'mx-2 p-5 rounded bg-primary-500 leading-4 text-lg text-white'">
                        {{ message.message }}
                    </p>
                    <!-- Afișează selectul pentru sector dacă nu există sector -->
                    <div v-if="message.message === 'Sectorul menționat nu există. Vă rugăm să selectați un sector valid:'">
                        <select v-model="selectedSector" @change="sendSector(message)" class="mt-2 p-2 border rounded">
                            <option disabled value="">Alegeți un sector</option>
                            <option v-for="sector in ['Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5', 'Sector 6']" :key="sector" :value="sector">
                                {{ sector }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>


            <!-- Message input -->
            <div class="flex items-center my-2 mx-1">
                <textarea v-model="user_message" id="chat" rows="1" class="block mx-4 p-2.5 w-full text-lg text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
                <button @click="sendMessage" type="submit" class="items-center aspect-square h-9 bg-primary-500 inline-flex justify-center p-2 text-white rounded-full cursor-pointer hover:bg-primary-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M4.4 19.425q-.5.2-.95-.088T3 18.5V14l8-2l-8-2V5.5q0-.55.45-.837t.95-.088l15.4 6.5q.625.275.625.925t-.625.925z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>

import {computed, onMounted, ref} from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const user_message = ref('');
const messages = ref([]);
const domains = ref([
    { name: 'ADMINISTRATIA PUBLICĂ LOCALĂ', code: '1' },
    { name: 'PROBLEME DE MEDIU ȘI SALUBRITATE', code: '2' },
    { name: 'PROBLEME DE INFRASTRUCTURĂ', code: '3' },
    { name: 'SERVICII PUBLICE ȘI UTILITĂȚI', code: '4' },
]);
const no_sector = ref(false);
const selectedSector = ref('');
const domainSelected = ref({
    name: '',
    code: ''
});
const problemSelected = ref({
    name: '',
    code: ''
});
const domainProblems = ref([]);

const selectDomain = async () => {
    domainProblems.value = [];
    if(domainSelected.value.name === 'ADMINISTRATIA PUBLICĂ LOCALĂ')
    {
        domainProblems.value.push({name: 'întârzieri în eliberarea documentelor', code: '1'});
        domainProblems.value.push({name: 'probleme cu colectarea taxelor și impozitelor', code: '2'});
    }
    if(domainSelected.value.name === 'PROBLEME DE MEDIU ȘI SALUBRITATE')
    {
        domainProblems.value.push({name: 'copac căzut pe trotuar', code: '1'});
        domainProblems.value.push({name: 'colectarea gunoiului', code: '2'});
        domainProblems.value.push({name: 'gestionarea deșeurilor', code: '3'});
    }
    if(domainSelected.value.name === 'PROBLEME DE INFRASTRUCTURĂ')
    {
        domainProblems.value.push({name: 'gropi și/sau denivelări', code: '1'});
        domainProblems.value.push({name: 'lipsă marcaje rutiere și/sau indicatoare', code: '2'});
    }
    if(domainSelected.value.name === 'SERVICII PUBLICE ȘI UTILITĂȚI')
    {
        domainProblems.value.push({name: 'defecțiuni rețea gaz', code: '1'});
        domainProblems.value.push({name: 'lipsă încălzire', code: '2'});
        domainProblems.value.push({name: 'lipsă apă curentă', code: '3'});
    }
}

const sendSector = async (message) => {
    let user_message = '';
    let user_message_index = messages.value.findIndex(item => item.conversation_id === message.conversation_id);

    if(user_message_index >= 0)
    {
        if(messages.value[user_message_index].sender === 'user')
        {
            user_message = messages.value[user_message_index].message;
        }
    }

    await axios.post('https://anamaria.hurduc.master.develop.eiddew.com/api/send-sector', {
        sector: selectedSector.value,
        user_message: user_message
    }).then((response) => {
        console.log('aaaaaaaaaaaaaa', selectedSector.value)
        Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success"
        });

    }).catch((error) => {
        Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error"
        })
    })
}
const sendDomainAndProblem = async () => {
    await axios.post('https://anamaria.hurduc.master.develop.eiddew.com/api/send-domain-and-problem', {
        domain: domainSelected.value,
        problem: problemSelected.value,
    }).then((response) => {
        Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success"
        });

    }).catch((error) => {
        Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error"
        })
    })
}
const sendMessage = async() => {
    await axios.post('https://anamaria.hurduc.master.develop.eiddew.com/api/send-message', {
        user_message: user_message.value,
    }).then((response) => {
        console.log(response)
        Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success"
        });

        let new_user_message = {
            message: user_message.value,
            sender: 'user'
        }
        messages.value.push(new_user_message);

        let new_bot_response = {
            message: response.data.bot_response,
            sender: 'bot'
        }
        messages.value.push(new_bot_response);

        if(response.data.bot_response === 'Sectorul menționat nu există. Vă rugăm să selectați un sector valid din lista de mai jos.')
        {
            no_sector.value = true;
        }
        user_message.value = '';
    }).catch((error) => {
        Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error"
        })
    })
}

const getMessages = async () => {
    await axios.get('https://anamaria.hurduc.master.develop.eiddew.com/api/get-messages').then((response) => {
        response.data.forEach((message) => {
            messages.value.push(message);
        })
    })
}


onMounted(() => {
    getMessages();
});

</script>

