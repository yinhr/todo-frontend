<template>
  <header id="header" class="sticky top-0 bg-white shadow-lg">
    <nav class="flex items-center justify-between flex-wrap px-4 py-3 max-w-5xl mx-auto">
      <div class="max-w-xl flex items-center flex-shrink-0">
        <div class="relative" @click="isActiveMenu = !isActiveMenu" v-if="isHomeHeader">
          <font-awesome-icon icon="bars" class="md:hidden mr-3 text-gray-500 text-lg" />
        </div>
        <transition name="sideMenu">
          <div v-if="isActiveMenu" class="z-20 min-h-full w-48 inset-0 fixed bg-gray-800">
            <div @click="isActiveMenu = false" class="p-4">
              <font-awesome-icon icon="angle-double-left" class="text-white" />
            </div>
            <div @click="orderByDeadline" class="p-4 text-gray-100" v-bind:class="{ 'bg-gray-900': isOrderedByDeadline }">
              <span><font-awesome-icon icon="calendar-check" class="mr-2" />期限順</span>
            </div>
            <div @click="orderByCreatedDateAsc" class="p-4 text-gray-100" v-bind:class="{ 'bg-gray-900': isOrderedByCreatedDateAsc }">
              <span><font-awesome-icon icon="calendar-plus" class="mr-2" />新しい順</span>
            </div>
            <div @click="orderByCreatedDateDesc" class="p-4 text-gray-100" v-bind:class="{ 'bg-gray-900': isOrderedByCreatedDateDesc }">
              <span><font-awesome-icon icon="calendar-plus" class="mr-2" />古い順</span>
            </div>
          </div>
        </transition>
        <router-link to="/home" class="block">
          <div class="flex">
            <font-awesome-icon icon="check-square" class="self-center text-green-400 text-2xl mr-2" />
            <span class="self-center font-black text-lg">TODO</span>
          </div>
        </router-link>
      </div>
      <div class="flex items-center">
        <router-link to="/todo/new" class="block">
          <div class="bg-green-500 hover:bg-green-600 rounded py-1 px-2 mr-3 cursor-pointer">
            <span class="text-white text-xs font-bold">新規作成</span>
          </div>
        </router-link>
        <div class="relative" @click="isActive = !isActive">
          <font-awesome-icon icon="th" class="text-xl text-gray-500 cursor-pointer hover:text-gray-600"/>
          <transition>
            <div v-if="isActive" class="w-48 absolute z-20 right-0 my-5 bg-white shadow-md rounded text-left text-sm">
              <div class="mx-2 p-2 border-b">
                <p class="text-gray-800 hover:text-green-500 cursor-pointer">
                  <span class="mr-2"><font-awesome-icon icon="user"/></span>
                  マイページ
                </p>
              </div>
              <div @click="signOut" class="mx-2 p-2">
                <p class="text-gyar-800 hover:text-green-500 cursor-pointer">
                  <span class="mr-2"><font-awesome-icon icon="sign-out-alt"/></span>
                  ログアウト
                </p>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </nav>
    <div class="w-screen h-screen absolute inset-0 z-10" @click="isActive = false" v-if="isActive"></div>
    <div class="w-screen h-screen absolute inset-0 z-10" @click="isActiveMenu = false" v-if="isActiveMenu"></div>
  </header>
</template>

<script>
import { RepositoryFactory } from "@/backend/repositoryFactory"
const SigninRepository =  RepositoryFactory.get('signin')
export default {
  data() {
    return {
      isActive: false,
      isActiveMenu: false,
    }
  },
  props: {
    parentComponent: {
      type: String
    }
  },
  computed: {
    isOrderedByDeadline: function() {
      return this.$store.state.isOrderedByDeadline
    },
    isOrderedByCreatedDateAsc: function() {
      return this.$store.state.isOrderedByCreatedDateAsc;
    },
    isOrderedByCreatedDateDesc: function() {
      return this.$store.state.isOrderedByCreatedDateDesc
    },
    isHomeHeader: function() {
      return this.parentComponent === "home"
    }
  },
  methods: {
    orderByDeadline: function() {
      this.$store.commit("orderByDeadline");
    },
    orderByCreatedDateDesc: function() {
      this.$store.commit("orderByCreatedDateDesc");
    },
    orderByCreatedDateAsc: function() {
      this.$store.commit("orderByCreatedDateAsc");
    },
    signOut: function() {
      SigninRepository.delete()
        .then(response => this.signoutSuccessful(response))
        .catch(error => this.signoutFailed(error))
    },
    signoutSuccessful: function(response) {
      if (response.status == 200) {
        delete localStorage.signedIn
        this.$store.commit("clearMessage")
        this.$router.replace('/')
      }
    },
    signoutFailed: function(error) {
      if (error.response) {
        delete localStorage.signedIn
        this.$store.commit("clearMessage")
        this.$router.replace('/')
      }
    }
  }
}
</script>

<style>
#header {
  z-index: 5;
}

.sideMenu-enter-active, .sideMenu-leave-active {
  transform: translate(0px, 0px);
  transition: transform 0.15s cubic-bezier(0, 0, 0.2, 1) 0s;
}

.sideMenu-enter, .sideMenu-leave-to {
  transform: translateX(-100vw) translateX(0px);
}
.v-enter-active, .v-leave-active {
  transition: all .3s;
}

.v-enter {
  transform: translateY(15px);
}

.v-enter, .v-leave-to {
  opacity: 0;
}
</style>
