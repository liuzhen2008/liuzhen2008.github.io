import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  flowResults: []
};

const mutations = {
  INCREMENT (state) {
    state.count++
  },
  DECREMENT (state) {
    state.count--
  },
  addFlowResult (state, result) {
    state.flowResults.unshift(result);
  },
  clearFlowResults (state) {
    state.flowResults = [];
  }
};

const actions = {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('INCREMENT')
    }, 200)
  },

  addFlowResult ({ commit }, data) {
    commit('addFlowResult', data);
  },
  clearFlowResults({ commit }, data) {
    commit('clearFlowResults', data);
  }
};


const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
