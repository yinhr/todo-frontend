<template>
  <div class="max-w-5xl mx-auto flex">
    <div class="hidden md:block md:w-1/5 py-8">
      <div @click="orderByDeadline" class="p-4 cursor-pointer hover:bg-gray-200" 
                                             v-bind:class="{ 'bg-green-400': isOrderedByDeadline, 'hover:bg-green-500': isOrderedByDeadline  }">
        <span><font-awesome-icon icon="calendar-check" class="mr-2" />期限順</span>
      </div>
      <div @click="orderByCreatedDateDesc" class="p-4 cursor-pointer hover:bg-gray-200" 
                                             v-bind:class="{ 'bg-green-400': isOrderedByCreatedDateDesc, 'hover:bg-green-500': isOrderedByCreatedDateDesc  }">
        <span><font-awesome-icon icon="calendar-plus" class="mr-2" />新しい順</span>
      </div>
      <div @click="orderByCreatedDateAsc" class="p-4 cursor-pointer hover:bg-gray-200" 
                                             v-bind:class="{ 'bg-green-400': isOrderedByCreatedDateAsc, 'hover:bg-green-500': isOrderedByCreatedDateAsc  }">
        <span><font-awesome-icon icon="calendar-plus" class="mr-2" />古い順</span>
      </div>
    </div>
    <div id="itemList" class="min-h-screen py-8 w-full md:w-4/5">
      <div class="px-4">
        <div class="mb-4" v-bind:class="{message:true, alert:levelError, info:levelInfo}" v-if="messages.length">
          <ul class="list-disc">
            <!-- eslint-disable-next-line -->
            <li class="ml-4" v-for="message in messages">
              <p class="text-sm">{{ message }}</p>
            </li>
          </ul>
        </div>
        <label for="" class="block text-xl"></label>
        <input type="text" v-model="query" class="w-full p-2 block rounded border-2 border-grey-900 focus:border-green-300 focus:outline-none">
        <div class="flex items-center py-4">
          <toggle-button v-model="toggleDone"
                         :width=100
                         :color="{checked: '#f56565', unchecked: '#48bb78'}"
                         :labels="{checked: '未完了のみ', unchecked: '完了分も表示'}" 
                         class ="mr-2"/>
          <toggle-button v-model="toggleImportance"
                         :width=100
                         :color="{checked: '#f56565', unchecked: '#48bb78'}"
                         :labels="{checked: '重要タスク', unchecked: '全て'}" 
                         class ="mr-2"/>
        </div>
      </div>
      <Item v-for="todo in filteredList" v-bind:key="todo.id" v-bind:todo="todo" @removed="removeItem"></Item>
      <div class="w-full px-1 py-4 flex justify-center" v-if="!completed">
        <button class="block font-black w-64 p-2 rounded bg-green-300 hover:bg-green-400" @click="infiniteHandler">さらに読込む...</button>
      </div>
    </div>
  </div>
</template>

<script>
import { RepositoryFactory } from "@/backend/repositoryFactory"
const TodoRepository =  RepositoryFactory.get('todo')
import Item from '@/components/Item.vue'
export default {
  components: {
    Item
  },
  created() {
    this.$store.commit("clearMessage")
    this.infiniteHandler()
  },
  data: function() {
    return {
      query: '',
      toggleDone: false,
      toggleImportance: false,
      cursor: 0,
      orderBy: "due",
      direction: "asc",
      completed: false,
      todos: []
    }
  },
  computed: {
    messages: function() {
      return this.$store.state.messages
    },
    levelError: function() {
      return this.$store.state.level === this.$store.state.error
    },
    levelInfo: function() {
      return this.$store.state.level === this.$store.state.info
    },
    isOrderedByDeadline: function() {
      return this.$store.state.isOrderedByDeadline
    },
    isOrderedByCreatedDateAsc: function() {
      return this.$store.state.isOrderedByCreatedDateAsc
    },
    isOrderedByCreatedDateDesc: function() {
      return this.$store.state.isOrderedByCreatedDateDesc
    },
    filteredList: function() {
      let ret = this.todos.slice();

      if (this.toggleDone) {
        ret = ret.filter(todo => !todo.done);
      }

      if (this.toggleImportance) {
        ret = ret.filter(todo => todo.vital);
      }

      ret = ret.filter(todo => todo.title.match(this.query));

      if (this.isOrderedByDeadline) {
        ret.sort((a, b) => this.sortBy(a.due, b.due));
      }

      if (this.isOrderedByCreatedDateDesc) {
        ret.sort((a, b) => this.sortBy(b.createdat, a.createdat));
      }

      if (this.isOrderedByCreatedDateAsc) {
        ret.sort((a, b) => this.sortBy(a.createdat, b.createdat));
      }

      return ret.filter(todo => todo.title.match(this.query));
    }
  },
  methods: {
    infiniteHandler: function() {
      TodoRepository.fetch(this.cursor, this.orderBy, this.direction)
        .then(response => this.fetchSuccessful(response))
        .catch(error => this.fetchFailed(error))
    },
    fetchSuccessful: function(response) {
      if (this.cursor === 0) {
        this.todos = []
      }
      if (response.status == 200) {
        if (response.data.length < 5) {
          this.completed = true
        }
        this.todos = this.todos.concat(response.data)
        this.cursor = this.todos.length
      }
    },
    fetchFailed: function(error) {
      this.pushMessage(error.response.data.message, this.$store.state.error)
    },
    removeItem: function(id) {
      const index = this.todos.findIndex((v) => v.id === id)
      this.todos.splice(index, 1)
    },
    pushMessage: function(message, level) {
      this.$store.commit("pushMessage", {message:message, level:level})
    },
    sortBy: function(a, b) {
      let comp = 0;
      if (a > b) {
        comp = 1;
      } else if (a < b) {
        comp = -1;
      }
      return comp;
    },
    orderByDeadline: function() {
      this.cursor = 0
      this.completed = false
      this.orderBy = "due"
      this.direction = "asc"
      this.infiniteHandler()
      this.$store.commit("orderByDeadline");
    },
    orderByCreatedDateDesc: function() {
      this.cursor = 0
      this.completed = false
      this.orderBy = "created_at"
      this.direction = "desc"
      this.infiniteHandler()
      this.$store.commit("orderByCreatedDateDesc");
    },
    orderByCreatedDateAsc: function() {
      this.cursor = 0
      this.completed = false
      this.orderBy = "created_at"
      this.direction = "asc"
      this.infiniteHandler()
      this.$store.commit("orderByCreatedDateAsc");
    }
  }
}
</script>
