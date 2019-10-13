import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import store from "store";
import { isUndefined, get } from "lodash";
import VuexORM from "@vuex-orm/core";
import VuexORMAxios from "@vuex-orm/plugin-axios";

// Entities
import Child from "@entities/child.entity";

Vue.use(Vuex);

const database = new VuexORM.Database();

// Register models to Database
database.register(Child);

const token = store.get("access_token");

if (!isUndefined(token)) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
axios.defaults.baseURL = process.env.VUE_APP_API;

// VuexORM Plugins
VuexORM.use(VuexORMAxios, {
  database,
  http: {
    axios,
    onResponse: response =>
      get(response, "data.items", get(response, "data", response)),
  },
});

export default new Vuex.Store({
  plugins: [VuexORM.install(database)],
});
