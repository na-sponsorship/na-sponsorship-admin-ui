import Vue from "vue";
import Vuex from "vuex";
import store from "store";
import { get } from "lodash";
import VuexORM from "@vuex-orm/core";
import VuexORMAxios from "@vuex-orm/plugin-axios";

import router from "../router";
import logrocketPlugin from "./plugins/logrocket.plugin";

// Entities
import Child from "@entities/child.entity";
import Sponsor from "@entities/sponsor.entity";
import User from "@entities/user.entity";

// Modules
import app from "./modules/app.module";

Vue.use(Vuex);

const database = new VuexORM.Database();

// Register models to Database
database.register(Child);
database.register(Sponsor);
database.register(User);

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
  modules: {
    app,
  },
  plugins: [VuexORM.install(database), logrocketPlugin],
});
