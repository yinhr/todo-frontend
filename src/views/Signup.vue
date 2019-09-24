<template>
  <div class="p-4 mt-1">
    <div class="max-w-lg mx-auto p-2">
      <h1 class="text-4xl font-bold">新規登録</h1>
      <form @submit.prevent="signup" novalidate>
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
        <div class="my-4">
          <label for="password" class="block text-xl"><span class="mr-2"><font-awesome-icon icon="unlock"/></span>パスワード</label>
          <input type="password" id="password" v-model="password" class="p-2 block w-full rounded border border-grey-800">
        </div>
        <div class="mb-8">
          <label for="password_confirmation" class="block text-xl"><span class="mr-2"><font-awesome-icon icon="unlock"/></span>パスワード（確認）</label>
          <input type="password" id="password_confirmation" v-model="password_confirmation" class="p-2 block w-full rounded border border-grey-800">
        </div>
        <button type="submit" class="w-full border rounded p-2 font-bold bg-green-400">アカウント登録</button>
      </form>
      <router-link to="/signin" class="block underline my-4 text-blue-500 hover:text-blue-700">アカウントをお持ちの方</router-link>
    </div>
  </div>
</template>

<script>
import { RepositoryFactory } from "@/backend/repositoryFactory"
const SignupRepository =  RepositoryFactory.get('signup')

export default {
  title: '新規登録',
  data () {
    return {
      email: '',
      password: '',
      password_confirmation: '',
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
    signup: function() {
      if (this.validInput()) {
        SignupRepository.post({ email: this.email, password: this.password, password_confirmation: this.password_confirmation})
          .then(response => this.signupSuccessful(response))
          .catch(error => this.signupFailed(error))
      }
    },
    validInput: function() {
      this.errors = [];
      if (!this.email) {
        this.errors.push('メールアドレスは必須');
      } else if (!this.validEmail(this.email)) {
        this.errors.push('無効なメールアドレス');
      }
      if (!this.password || !this.password_confirmation) {
        this.errors.push('パスワードは必須');
      } else if (!this.validPassword(this.password)) {
        this.errors.push('パスワードは半角英数字を含む8~50文字');
      } else if (!(this.password == this.password_confirmation)) {
        this.errors.push('パスワードが不一致');
      }
      return !this.errors.length
    },
    validEmail: function(email) {
      // eslint-disable-next-line
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email)
    },
    validPassword: function(password) {
      let re = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,50}$/i;
      return re.test(password)
    },
    signupSuccessful: function(response) {
      if (response.status == 200) {
        localStorage.signedIn = true
        this.$router.replace('/home')
      }
    },
    signupFailed: function(error) {
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
