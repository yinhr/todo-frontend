<template>
  <div class="p-4 mt-1">
    <div class="max-w-lg mx-auto p-2">
      <h1 class="text-4xl font-bold">ログイン</h1>
      <form @submit.prevent="signin"  novalidate>
        <div v-bind:class="{message:true, alert:true}" v-if="errors.length">
          <ul class="list-disc">
            <!-- eslint-disable-next-line -->
            <li class="ml-4" v-for="error in errors">
              <p class="text-sm">{{ error }}</p>
            </li>
          </ul>
        </div>
        <div class="my-4">
          <label for="email" class="block text-xl"><span class="mr-2"><font-awesome-icon icon="envelope"/></span>メールアドレス</label>
          <input type="email" id="email" v-model="email" class="p-2 block w-full rounded border border-grey-800">
        </div>
        <div class="mb-8">
          <label for="password" class="block text-xl"><span class="mr-2"><font-awesome-icon icon="unlock"/></span>パスワード</label>
          <input type="password" id="password" v-model="password" class="p-2 block w-full rounded border border-grey-800">
        </div>
        <button type="submit" class="w-full border rounded p-2 font-bold bg-green-400">ログイン</button>
      </form>
      <router-link to="/signup" class="block underline my-4 text-blue-500 hover:text-blue-700">アカウント新規登録</router-link>
    </div>
  </div>
</template>

<script>
import { RepositoryFactory } from "@/backend/repositoryFactory"
const SigninRepository =  RepositoryFactory.get('signin')
export default {
  title: 'ログイン',
  data () {
    return {
      email: '',
      password: '',
      errors: []
    }
  },
  created () {
    this.checkedSignedIn()
  },
  updated () {
    this.checkedSignedIn()
  },
  methods: {
    signin: function() {
      if (this.validInput()) {
        SigninRepository.post({ email: this.email, password: this.password})
          .then(response => this.signinSuccessful(response))
          .catch(error => this.signinFailed(error))
      }
    },
    validInput: function() {
      this.errors = [];
      if (!this.email || !this.password) {
        this.errors.push('メールアドレス、パスワードを入力してください');
      }
      return !this.errors.length
    },
    signinSuccessful: function(response) {
      if (response.status == 200) {
        localStorage.signedIn = true
        this.$router.replace('/home')
      }
    },
    signinFailed: function(error) {
      this.errors.push(error.response.data.message)
      delete localStorage.signedIn
    },
    checkedSignedIn() {
      if (localStorage.signedIn) {
        this.$router.replace('/home')
      } else {
        delete localStorage.signedIn
      }
    }
  }
}
</script>
