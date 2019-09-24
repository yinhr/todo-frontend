<template>
  <div class="max-w-5xl mx-auto flex">
    <div v-if="confirming" class="fixed inset-0 w-full min-h-screen text-center bg-gray-900 z-40 opacity-50"></div>
    <div v-if="confirming" class="fixed inset-0 flex justify-center px-4 min-h-screen z-50">
      <div class="self-center bg-white rounded text-black px-8 py-4">
        <div class="py-2">
          <p>この内容で登録しますか？</p>
        </div>
        <div class="py-2 flex justify-around">
          <button class="text-white py-1 px-2 bg-blue-400 hover:bg-blue-500 rounded" @click="postTodo">登録</button>
          <button class="text-white py-1 px-2 bg-blue-400 hover:bg-blue-500 rounded" @click="confirming=false">キャンセル</button>
        </div>
      </div>
    </div>
    <div class="min-h-screen py-8 w-full max-w-2xl mx-auto">
      <div class="px-4">
        <div v-bind:class="{message:true, alert:levelError, info:levelInfo}" v-if="messages.length">
          <ul class="list-disc">
            <!-- eslint-disable-next-line -->
            <li class="ml-4" v-for="message in messages">
              <p class="text-sm">{{ message }}</p>
            </li>
          </ul>
        </div>
        <div class="flex py-2">
          <font-awesome-icon icon="tasks" class="text-xl self-center mr-2"/>
          <h1 class="text-xl self-center">新しいタスク</h1>
        </div>
        <div class="py-2">
          <label for="taskTitle"></label>
          <input type="text" id="taskTitle" v-model="todo.title" class="w-full p-1 block rounded border-2 border-gray-400 focus:border-green-400 focus:outline-none" placeholder="新しいタスク">
        </div>
        <div class="flex w-full py-2">
          <div class="w-2/3">
            <label for="due"></label>
            <datepicker :language="ja" :format="dateformatter" :input-class="{datepicker: true}" :placeholder="due" id="due" v-model="todo.due"></datepicker>
          </div>
          <div class="w-1/3 flex justify-center">
            <label for="vital"></label>
            <toggle-button v-model="todo.vital" :sync="true" :width=70 :color="{checked: '#f56565', unchecked: '#48bb78'}" :labels="{checked: '重要', unchecked: '一般'}" class="self-center"/>
          </div>
        </div>
        <div class="bg-gray-300 rounded w-full p-4 my-4">
          <div v-for="task in tasks" v-bind:key="task.id" class="flex mb-4">
            <input type="text" id="task" v-model="task.title" class="py-1 px-2 block w-full rounded border-2 border-gray-400 focus:border-green-400 focus:outline-none" placeholder="サブタスク">
            <div class="self-center mx-4">
              <font-awesome-icon icon="times-circle" class="cursor-pointer text-xl text-red-400" @click="removeTask(task.id)"/>
            </div>
          </div>
          <button class="text-white text-sm py-1 px-2 bg-green-400 rounded" @click="addTask">サブタスクを追加</button>
        </div>
        <button class="text-white py-1 px-2 bg-blue-400 hover:bg-blue-500 rounded" @click="confirmSubmit">登録</button>
      </div>
    </div>
  </div>
</template>

<script>
import { RepositoryFactory } from "@/backend/repositoryFactory"
const TodoRepository =  RepositoryFactory.get('todo')
import { ja } from 'vuejs-datepicker/dist/locale'
import moment from 'moment'
export default {
  data () {
    return {
      due: '期限',
      ja: ja,
      confirming: false,
      taskid: 0,
      tasks: [],
      todo: {
        title: '',
        vital: false,
        due: null,
        tasks: []
      }
    }
  },
  created () {
    this.$store.commit("clearMessage")
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
    }
  },
  methods: {
    dateformatter: function(date) {
      return moment(date).format('YYYY/MM/DD')
    },
    addTask: function() {
      this.$store.commit("clearMessage")
      if (this.tasks.length >= 5) {
        this.pushMessage("サブタスクは5個まで登録できます", this.$store.state.error)
        return 
      }
      this.tasks.push({id: this.taskid++, title: '', done: false})
    },
    removeTask: function(id) {
      const index = this.tasks.findIndex((v) => v.id === id);
      this.tasks.splice(index, 1);
      this.$store.commit("clearMessage")
    },
    confirmSubmit: function() {
      this.confirming = true
    },
    postTodo: function() {
      if (this.validForm()) {
        if (this.tasks.length) {
          this.tasks = this.tasks.filter(v => v.title.trim() !== '')
          this.todo.tasks = this.tasks.map(v => {
            let rtasks = {};
            rtasks['title'] = v.title;
            rtasks['done'] = v.done;
            return rtasks;
          });
        }
        TodoRepository.post({title: this.todo.title, vital: this.todo.vital, done: false, due: this.todo.due, tasks: this.todo.tasks})
          .then(response => this.success(response))
          .catch(error => this.failed(error))
      }
      this.confirming = false
    },
    validForm: function() {
      this.$store.commit("clearMessage")
      if (!this.todo.title) {
        this.pushMessage("新しいタスクを入力してください", this.$store.state.error)
      }
      if (this.todo.due == null) {
        this.pushMessage("期限を選択してください", this.$store.state.error)
      }
      return !this.messages.length
    },
    pushMessage: function(message, level) {
      this.$store.commit("pushMessage", {message:message, level:level})
    },
    success: function(response) {
      if (response.status == 200) {
        this.pushMessage("タスクを登録しました", this.$store.state.info)
        this.initForm()
      }
    },
    failed: function(error) {
      this.pushMessage(error.response.data.message, this.$store.state.error)
    },
    initForm: function() {
      this.taskid = 0
      this.tasks = []
      this.todo.title = ''
      this.todo.vital = false
      this.todo.due = ''
      this.todo.tasks = []
    }
  }
}
</script>

<style>
.datepicker {
  @apply w-full;
  @apply py-1;
  @apply px-2;
  @apply border;
  @apply border-2;
  @apply border-gray-400;
  @apply rounded;
}

.datepicker:focus {
  @apply border-green-400;
  @apply outline-none;
}

</style>
