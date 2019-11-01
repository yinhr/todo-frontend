<template>
  <div class="top bg-gray-100 w-full min-h-screen flex justify-center">
    <div class="self-center p-2">
      <h1 class="text-center text-3xl font-black py-8">TODO</h1>
      <div class="md:flex">
        <div class="md:mr-8">
          <img class="w-64 h-64 rounded-full" :src="backgroundImage" alt="">
        </div>
        <div class="text-center self-center">
          <router-link to="/signup" class="block rounded text-xl p-4 hover:bg-green-300">新規登録はこちら</router-link>
          <router-link to="/signin" class="block rounded text-xl p-4 hover:bg-green-300">ログインはこちら</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackGroundImagePath from "@/assets/list.png"

export default {
  data() {
    return {
      backgroundImage: BackGroundImagePath,
    }
  },
  created () {
    this.checkedSignedIn()
  },
  updated () {
    this.checkedSignedIn()
  },
  methods: {
    checkedSignedIn: function() {
      if (localStorage.signedIn) {
        this.$router.replace('/home')
      } else {
        delete localStorage.signedIn
      }
    }
  }
}
</script>
