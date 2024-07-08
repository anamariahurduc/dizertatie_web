<template>
  <div class="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
    <div class="max-w-screen-xl sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
      <div class="lg:w-1/2 xl:w-5/12">
        <div>
<!--          <img src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"-->
<!--               class="w-32 mx-auto" />-->
        </div>
        <div class="flex flex-col items-center">
          <div class="w-auto bg-contain bg-center bg-no-repeat">
            <img src="@/assets/complaint.png"/>
          </div>
          <h1 class="text-3xl font-extrabold">
            Sign up
          </h1>
          <div class="w-full flex-1 mt-10">
            <div class="mx-auto max-w-xs">
              <input
                  class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email" placeholder="Email" />
              <input
                  class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password" placeholder="Password" />
              <a href="#" class="font-medium text-sm text-blue-400 hover:text-blue-500">Forgot password?</a>

              <button
                  class="mt-5 tracking-wide font-semibold bg-blue-400 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                <svg class="w-6 h-6 -ml-2" fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
                <span class="ml-3">Sign Up</span>
              </button>
            </div>

            <div class="mx-auto max-w-xs">
              <div class="my-12 border-b text-center">
                <div
                    class="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Do you have not account yet?
                </div>
              </div>
              <button
                  class="mt-5 tracking-wide font-semibold bg-blue-400 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  @click="register()">
                <span class="ml-3">Register now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import axios from "axios";

const username = ref('');
const password = ref('');
const login = async() => {
  await axios.post('http://127.0.0.1:5173/api/login', {
    user_name: username.value,
    password: password.value
  }).then((response) => {

    console.log(response);
    // if(response.data.status){
    //   userStore.setUserId(response.data.user.userId);
    //   userStore.setUserName(username.value);
    //   router.push('/');
    // }
  })
}

</script>