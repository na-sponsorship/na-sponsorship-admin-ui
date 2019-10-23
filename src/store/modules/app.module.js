import axios from "axios";
import store from "store";
import jwtDecode from "jwt-decode";
import LogRocket from "logrocket";

const token = store.get("access_token");

export default {
  namespaced: true,
  state: {
    user: token ? jwtDecode(token) : {},
  },
  mutations: {
    setUser(state, user) {
      LogRocket.identify(user.id, {
        name: `${user.firstName} ${user.lastName}`,
        email: user.username,
      });
      state.user = user;
    },
  },
  actions: {
    async appLogin({ commit }, credentials) {
      const { data } = await axios.post(
        `${process.env.VUE_APP_API}/auth/login`,
        credentials
      );

      store.set("access_token", data.access_token);
      commit("setUser", jwtDecode(data.access_token));
    },
  },
  getters: {
    role(state) {
      return state.user.role;
    },
  },
};
