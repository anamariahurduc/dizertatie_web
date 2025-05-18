<template>
    <div class="flex w-full">
        <div class="m-2 w-full border flex flex-col rounded-t-xl">
            <div class="card flex flex-col gap-4 w-full bg-white p-6 rounded-xl shadow-md">
                <h2 class="text-xl text-gray-800 font-semibold text-center">
                    Salut! Sunt aici pentru a te ajuta să raportezi rapid probleme legate de orașul tău.
                </h2>

                <template v-if="!conversationStarted">
                    <p class="text-gray-600 text-center mb-6">
                        Fie că e vorba de gropi, iluminat sau salubritate, apasă pe butonul de mai jos pentru a începe o conversație.
                    </p>
                    <div class="flex justify-center">
                        <Button @click="startNewConversation()" label="Începe o conversație" class="w-1/2 px-6 py-3 mt-5 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg">
                        </Button>
                    </div>
                </template>
            </div>

            <template v-if="conversationStarted">
                <header class="w-full bg-primary-500 flex justify-between px-4 py-2 rounded-t-lg items-center">
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
                <div class="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg shadow-md max-h-96 overflow-auto">
                    <div v-for="(message, index) in messages" :key="index" class="flex items-end" :class="message.sender === 'bot' ? '' : 'flex-row-reverse'">
                        <div v-if="message.sender === 'bot'" class="rounded bg-primary-500 w-8 aspect-square p-1.5">
                            <!-- Icona bot -->
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
                                ? 'mx-2 p-4 rounded bg-gray-200 text-black text-lg leading-relaxed'
                                : 'mx-2 p-4 rounded bg-primary-500 text-white text-lg leading-relaxed'">
                            <span v-html="convertLinks(message.message)"></span>
                        </p>


                        <!-- Upload image request in conversatie -->
                        <div v-if="awaitingImageMessage(message.conversation_id, message.message)" class="mx-2 p-4 rounded bg-gray-200 text-black text-lg leading-relaxed flex flex-col gap-2">
                            <FileUpload name="image"
                                        @uploader="onUpload"
                                        :multiple="false"
                                        accept="image/*"
                                        :maxFileSize="1000000"
                                        customUpload />
                        </div>
                    </div>
                </div>

                <!-- Message input -->
                <div v-if="checkIfConversationClosed.status != 'awaiting_feedback'" class="flex items-center my-2 mx-1">
                    <textarea v-model="user_message" id="chat" rows="1" class="block mx-4 p-2.5 w-full text-lg text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
                    <button @click="sendMessage" type="submit" class="items-center aspect-square h-9 bg-primary-500 inline-flex justify-center p-2 text-white rounded-full cursor-pointer hover:bg-primary-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M4.4 19.425q-.5.2-.95-.088T3 18.5V14l8-2l-8-2V5.5q0-.55.45-.837t.95-.088l15.4 6.5q.625.275.625.925t-.625.925z" />
                        </svg>
                    </button>
                </div>

            </template>
        </div>
    </div>
</template>

<script setup lang="ts">

import {computed, onMounted, ref} from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import {useToast} from "primevue/usetoast";

const user_message = ref('');
const conversation_id = ref('');
const messages = ref([]);
const domains = ref([
    { name: 'ADMINISTRATIA PUBLICĂ LOCALĂ', code: '1' },
    { name: 'PROBLEME DE MEDIU ȘI SALUBRITATE', code: '2' },
    { name: 'PROBLEME DE INFRASTRUCTURĂ', code: '3' },
    { name: 'SERVICII PUBLICE ȘI UTILITĂȚI', code: '4' },
]);
const conversationStarted = ref(false);
const user = JSON.parse(localStorage.getItem('user'));
const sector = ref('');
const convertLinks = computed(() => (message) => {
    const urlPattern = /(\bhttps?:\/\/[^\s]+)/g;
    return message.replace(urlPattern, '<a href="$1" target="_blank" class="text-blue-500 hover:underline">$1</a>');
})

const conversations = ref([]);
const awaitingImageMessage = computed(() => (conversation_id, message) => {
    let conversation_index = conversations.value.findIndex(item => item.id == conversation_id);

    if (conversation_index === -1) {
        return false;
    }

    if (conversations.value[conversation_index].status === undefined) {
        return false;
    }

    if ((conversations.value[conversation_index].status === 'awaiting_image_confirmation') && (message.includes('Vă rugăm să încărcați o imagine relevantă'))) {
        return true;
    } else {
        return false;
    }
});

const checkIfConversationClosed = computed(() => {
    let conversation_index = conversations.value.findIndex(item => item.id == conversation_id.value);

    if (conversation_index === -1) {
        return false;
    }

    if (conversations.value[conversation_index].status === undefined) {
        return false;
    }

    if(conversations.value[conversation_index].status == 'awaiting_feedback' || conversations.value[conversation_index].status == 'closed')
    {
        conversationStarted.value = false;
    }
    return conversations.value[conversation_index];
});

const startNewConversation = async () => {
    messages.value = [];
    let start_conversation_message = 'Spune-ti ne pe ce strada ati descoperit problema';
    await axios.post('https://api.claim-flow.dev.eiddew.com/api/start-conversation', {
        start_message: start_conversation_message,
    }).then((response) => {

        conversationStarted.value = true;

        let new_bot_response = {
            message: start_conversation_message,
            conversation_id: response.data.conversation_id,
            sender: 'bot'
        }
        messages.value.push(new_bot_response);

        conversation_id.value = response.data.conversation_id;

        getConversations();
    }).catch((error) => {
        Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error"
        })
    })

}

const onUpload1 = async (event) => {
    const file = event.files[0];

    const formData = new FormData();

    formData.append('image', file);
    formData.append('user_id', user.id);
    formData.append('conversation_id', conversation_id.value);

    await axios.post('https://api.claim-flow.dev.eiddew.com/api/classify-image', formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            user_message.value = 'Imagine clasificata cu succes in categoria ' + response.data.data.category.toLowerCase();

            Swal.fire({
                title: "Success",
                text: response.data.message,
                icon: "success"
            });
        })
        .catch((error) => {
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || error.message,
                icon: "error"
            });
        });
};

const sendMessage1 = async(file) => {
    const formData = new FormData();
    formData.append('user_message', user_message.value);
    formData.append('conversation_id', conversation_id.value);
    formData.append('image', file);

    await axios.post('https://api.claim-flow.dev.eiddew.com/api/send-message', {
        user_message: user_message.value,
        conversation_id: conversation_id.value,
    }).then((response) => {

        Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success"
        });

        let new_user_message = {
            message: user_message.value,
            conversation_id: response.data.conversation_id,
            sender: 'user'
        }
        messages.value.push(new_user_message);

        let new_bot_response = {
            message: response.data.bot_response,
            conversation_id: response.data.conversation_id,
            sender: 'bot'
        }
        messages.value.push(new_bot_response);

        let data = {
            conversation_id: response.data.conversation_id,
            bot_response: response.data.bot_response,
            user_id: response.data.user_id,
            messages: messages.value,
            conversation_status: response.data.status,
            category: response.data.category,
            sector: response.data.sector,
        }

        storeConversation(data);

        conversation_id.value = response.data.conversation_id;
        user_message.value = '';

        getConversations();
    }).catch((error) => {
        Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error"
        })
    })
}

const onUpload = async (event) => {
    const file = event.files[0];
    if (file instanceof File) {
        await sendMessage(file);
    } else if (file.objectURL) {
        const blob = await fetch(file.objectURL).then(r => r.blob());
        const realFile = new File([blob], file.name || 'upload.jpg', { type: blob.type });
        await sendMessage(realFile);
    } else {
        console.error('Nu am putut extrage fișierul.');
    }
};
const sendMessage = async(file) => {
    const formData = new FormData();
    formData.append('conversation_id', conversation_id.value);
    formData.append('image', file);
    if (file instanceof File) {
        user_message.value = 'Imagine trimisa!'
    }

    formData.append('user_message', user_message.value);

    await axios.post('https://api.claim-flow.dev.eiddew.com/api/send-message', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }}).then((response) => {
        Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success"
        });

        if(response.data.status == 'closed')
        {
            storeComplaint(response.data.conversation_id);
        }

        let new_user_message = {
            message: user_message.value,
            conversation_id: response.data.conversation_id,
            sender: 'user'
        }
        messages.value.push(new_user_message);

        let new_bot_response = {
            message: response.data.bot_response,
            conversation_id: response.data.conversation_id,
            sender: 'bot'
        }
        messages.value.push(new_bot_response);

        let data = {
            conversation_id: response.data.conversation_id,
            bot_response: response.data.bot_response,
            user_id: response.data.user_id,
            messages: messages.value,
            conversation_status: response.data.status,
            category: response.data.category,
            sector: response.data.sector,
            description: ''
        }

        if(response.data.hasOwnProperty('category'))
        {
            data.description = user_message.value;
        }

        storeConversation(data);

        conversation_id.value = response.data.conversation_id;
        user_message.value = '';
        sector.value = response.data.sector;
        getConversations();
    }).catch((error) => {
        Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error"
        })
    })
}

const getMessages = async () => {
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/get-messages').then((response) => {
        response.data.forEach((message) => {
            messages.value.push(message);
        })
    })
}

const storeConversation = async(data) => {
    await axios.post('http://api.claim-flow.dev.eiddew.com/api/chat', {
        user_message: user_message.value,
        conversation_id: data.conversation_id,
        bot_response: data.bot_response,
        user_id: data.user_id,
        conversation_status: data.conversation_status,
        category: data.category,
        sector: data.sector,
        description: data.description
    }).then((response) => {
    }).catch((error) => {
        Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error"
        })
    })
}

const storeComplaint = async(conversation_id) => {
    let conversation_index = conversations.value.findIndex(item => item.id == conversation_id);

    if (conversation_index === -1) {
        console.error('Conversation not found');
        return;
    }

    let conversation = conversations.value[conversation_index];

    const tipProblema = "Sesizare";
    const title = tipProblema +  ' raportată în ' + conversation.sector;
    const description = 'A fost raportată o problemă de tip ' + conversation.category + ':' + conversation.description;
    const category = conversation.category.replace('/', ' / ').replace(/\b\w/g, c => c.toUpperCase()); // capitalize

    console.log('Trimitem complaint:', { title, description, category });

    await axios.post('http://api.claim-flow.dev.eiddew.com/api/complaints', {
        title: title,
        description: description,
        category: category,
        address: conversation.sector,
        user_id: user.id
    }).then((response) => {
    }).catch((error) => {
        Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error"
        })
    })
}

const getConversations = async () => {
    conversations.value = [];
    await axios.get('https://api.claim-flow.dev.eiddew.com/api/conversations').then((response) => {
        response.data.data.forEach((conversation) => {
            conversations.value.push(conversation);
        })
    })
}

onMounted(() => {
    getMessages();
});

</script>

