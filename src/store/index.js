import Vue from "vue";
import Vuex from "vuex";
import store from "store";
import { get } from "lodash";
import VuexORM from "@vuex-orm/core";
import VuexORMAxios from "@vuex-orm/plugin-axios";
import router from "../router";

// Entities
import Child from "@entities/child.entity";

Vue.use(Vuex);

const database = new VuexORM.Database();

// Register models to Database
database.register(Child);

// VuexORM Plugins
VuexORM.use(VuexORMAxios, {
  database,
  http: {
    baseURL: process.env.VUE_APP_API,
    access_token: () => store.get("access_token"),
    onResponse: response =>
      get(response, "data.items", get(response, "data", response)),
    onUnauthorised() {
      router.replace({
        name: "login",
        params: { returnTo: router.currentRoute.name },
      });
    },
  },
});

export default new Vuex.Store({
  plugins: [VuexORM.install(database)],
});
