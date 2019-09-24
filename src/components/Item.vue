<template>
  <div class="hover:bg-gray-200 todo-item border-b-2 p-4">
    <div v-if="confirming" class="fixed inset-0 w-full min-h-screen text-center bg-gray-900 z-40 opacity-50"></div>
    <div v-if="confirming" class="fixed inset-0 flex justify-center px-4 min-h-screen z-50">
      <div class="self-center bg-white rounded text-black px-8 py-4">
        <div class="text-sm">
          <p>{{ todo.title }}</p>
        </div>
        <div class="py-2 text-center text-sm">
          <p>このタスクを削除しますか？</p>
        </div>
        <div class="py-2 flex justify-around">
          <button class="text-white py-1 px-2 bg-red-400 hover:bg-red-500 rounded" @click="removeTodo(todo.id)">削除</button>
          <button class="text-white py-1 px-2 bg-blue-400 hover:bg-blue-500 rounded" @click="confirming=false">キャンセル</button>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between py-2">
      <div class="flex items-center w-4/5 min-width">
        <div class="mr-2">
          <input type="checkbox" v-bind:id="'checkbox-'+todo.id" v-model="todo.done" v-on:change="changeTodoStatus(todo)">
          <label v-bind:for="'checkbox-'+todo.id" class="main-checkbox"><span></span></label>
        </div>
        <div class="text-md min-width cursor-pointer" @click="toggle"><p class="break-words">{{ todo.title }}</p></div>
      </div>
      <div class="flex items-center justify-end w-1/4">
        <div class="mr-4"><font-awesome-icon icon="exclamation" v-if="todo.vital" class="text-red-500" /></div>
        <div class="mr-4"><router-link :to="{name: 'edit-item', params: {id: todo.id}}"><font-awesome-icon icon="edit" class="text-gray-600 hover:text-green-500" /></router-link></div>
        <div><font-awesome-icon icon="trash" class="text-gray-600 cursor-pointer hover:text-orange-600" @click="confirming=true"/></div>
      </div>
    </div>
    <div class="flex items-center justify-start px-8">
      <div class="text-xs w-24">
        <span><font-awesome-icon icon="calendar-check" class="text-sm text-gray-600 mr-2" />{{ dateformatter(todo.due) }}</span>
      </div>
      <div class="text-xs w-24">
        <span><font-awesome-icon icon="calendar-plus" class="text-sm text-gray-600 mr-2" />{{ dateformatter(todo.createdat) }}</span>
      </div>
    </div>
    <transition
      name="task-accordion"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:before-leave="beforeLeave"
      v-on:leave="leave"
    >
      <div v-if="show">
        <div v-for="task in todo.tasks" v-bind:key="task.id" class="max-w-2xl flex items-center py-1 px-8">
          <div class="flex items-center mr-2">
            <input type="checkbox" v-bind:id="'checkbox-'+task.id" v-model="task.done" v-on:change="changeTaskStatus(task)">
            <label v-bind:for="'checkbox-'+task.id" class="sub-checkbox"><span></span></label>
          </div>
          <div class="min-width"><p class="break-words">{{ task.title }}</p></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from 'moment'
import { RepositoryFactory } from "@/backend/repositoryFactory"
const TodoRepository =  RepositoryFactory.get('todo')
export default {
  updated() {
    this.$store.commit("clearMessage")
  },
  data: function() {
    return {
      show: false,
      confirming: false
    }
  },
  props: {
    todo: {
      id: String,
      title: String,
      due: null,
      createdat: null,
      done: Boolean,
      vital: Boolean,
      tasks: Array,
    }
  },
  methods: {
    toggle: function() {
      this.show = !this.show;
    },
    beforeEnter: function(e) {
      e.style.height = '0';
    },
    enter: function(e) {
      e.style.height = e.scrollHeight + 'px';
    },
    beforeLeave: function(e) {
      e.style.height = e.scrollHeight + 'px';
    },
    leave: function(e) {
      e.style.height = '0';
    },
    dateformatter: function(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    removeTodo: function(id) {
      this.$store.commit("clearMessage")
      this.confirming = false
      TodoRepository.delete(id)
        .then(response => this.removeSuccessful(response))
        .catch(error => this.removeFailed(error))
    },
    removeSuccessful: function(response) {
      if (response.status == 200) {
        this.pushMessage("正常に削除しました", this.$store.state.info)
        this.$emit('removed', this.todo.id)
      }
    },
    removeFailed: function(error) {
      this.pushMessage(error.response.data.message, this.$store.state.error)
    },
    change: function() {
      TodoRepository.patch(this.todo)
        .catch(error => this.failed(error))
    },
    changeTodoStatus: function(todo) {
      TodoRepository.patchTodo(todo)
        .catch(error => this.failed(error))
    },
    changeTaskStatus: function(task) {
      TodoRepository.patchTask(task)
        .catch(error => this.failed(error))
    },
    failed: function(error) {
      this.pushMessage(error.response.data.message, this.$store.state.error)
    },
    pushMessage: function(message, level) {
      this.$store.commit("pushMessage", {message:message, level:level})
    },
  }
}
</script>

<style>
.min-width {
  min-width: 1px;
}

.main-checkbox, .sub-checkbox {
  display: inline-block;
  cursor: pointer;
  position: relative;
}

.main-checkbox span {
  display: inline-block;
  position: relative;
  background-color: transparent;
  width: 25px;
  height: 25px;
  transform-origin: center;
  border: 2px solid #68D391;
  border-radius: 20%;
  vertical-align: -6px;
  transition: background-color 150ms 200ms, transform 350ms cubic-bezier(0.78, -1.22, 0.17, 1.89);
}

.sub-checkbox span {
  display: inline-block;
  position: relative;
  background-color: transparent;
  width: 17px;
  height: 17px;
  transform-origin: center;
  border: 2px solid #68D391;
  border-radius: 20%;
  vertical-align: -5px;
  transition: background-color 150ms 200ms, transform 350ms cubic-bezier(0.78, -1.22, 0.17, 1.89);
}

.main-checkbox span:before {
  content: "";
  width: 0px;
  height: 2px;
  border-radius: 2px;
  background: #68D391;
  position: absolute;
  transform: rotate(45deg);
  top: 11px;
  left: 7px;
  transition: width 50ms ease 50ms;
  transform-origin: 0% 0%;
}

.sub-checkbox span:before {
  content: "";
  width: 0px;
  height: 2px;
  border-radius: 2px;
  background: #68D391;
  position: absolute;
  transform: rotate(45deg);
  top: 7px;
  left: 4px;
  transition: width 50ms ease 50ms;
  transform-origin: 0% 0%;
}

.main-checkbox span:after {
  content: "";
  width: 0;
  height: 2px;
  border-radius: 2px;
  background: #68D391;
  position: absolute;
  transform: rotate(305deg);
  top: 14px;
  left: 8px;
  transition: width 50ms ease;
  transform-origin: 0% 0%;
}

.sub-checkbox span:after {
  content: "";
  width: 0;
  height: 2px;
  border-radius: 2px;
  background: #68D391;
  position: absolute;
  transform: rotate(305deg);
  top: 10px;
  left: 5px;
  transition: width 50ms ease;
  transform-origin: 0% 0%;
}

.main-checkbox:hover span:before {
  width: 5px;
  transition: width 100ms ease;
}

.sub-checkbox:hover span:before {
  width: 4px;
  transition: width 100ms ease;
}

.main-checkbox:hover span:after {
  width: 10px;
  transition: width 150ms ease 100ms;
}

.sub-checkbox:hover span:after {
  width: 8px;
  transition: width 150ms ease 100ms;
}

input[type="checkbox"] {
  display: none;
}
input[type="checkbox"]:checked + label.main-checkbox span {
  background-color: #68D391;
  transform: scale(1.1);
}
input[type="checkbox"]:checked + label.main-checkbox span:after {
  width: 10px;
  background: #fff;
}
input[type="checkbox"]:checked + label.main-checkbox span:before {
  width: 5px;
  background: #fff;
}
input[type="checkbox"]:checked + label.sub-checkbox span {
  background-color: #68D391;
}
input[type="checkbox"]:checked + label.sub-checkbox span:after {
  width: 10px;
  background: #fff;
}
input[type="checkbox"]:checked + label.sub-checkbox span:before {
  width: 5px;
  background: #fff;
}

.task-accordion-enter-active { 
  animation-duration: 0.3s;
  animation-fill-mode: both;
  transition: height 0.3s ease-in-out;
  animation-name: task-accordion-open;
}

.task-accordion-leave-active {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  transition: height 0.3s ease-in-out;
  animation-name: task-accordion-close;
}

@keyframes task-accordion-open {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.1
  }
  100% {
    opacity: 1;
  }
}
@keyframes task-accordion-close {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.1
  }
  100% {
    opacity: 0;
  }
}

caret {
  width: 20px;
  height: 20px;
}
</style>
