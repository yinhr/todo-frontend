import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isOrderedByDeadline: true,
    isOrderedByCreatedDateDesc: false,
    isOrderedByCreatedDateAsc: false,
    info: 0,
    error: 1,
    level: 1,
    messages: [],
    cursor: '',
  },
  mutations: {
    orderByDeadline(state) {
      state.isOrderedByDeadline = true;
      state.isOrderedByCreatedDateDesc = false;
      state.isOrderedByCreatedDateAsc = false;
    },
    orderByCreatedDateDesc(state) {
      state.isOrderedByDeadline = false;
      state.isOrderedByCreatedDateDesc = true;
      state.isOrderedByCreatedDateAsc = false;
    },
    orderByCreatedDateAsc(state) {
      state.isOrderedByDeadline = false;
      state.isOrderedByCreatedDateDesc = false;
      state.isOrderedByCreatedDateAsc = true;
    },
    pushMessage(state, {message, level}) {
      state.level = level;
      state.messages.push(message);
    },
    clearMessage(state) {
      state.messages = [];
    }
  },
  actions: {
  }
})
