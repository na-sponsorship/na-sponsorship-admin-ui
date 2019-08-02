import axios from "axios";
import store from "store";
import { isUndefined } from "lodash";

export default {
  install: Vue => {
    const token = store.get("access_token");

    if (!isUndefined(token)) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    Vue.prototype.$axios = axios;
  }
};
