import Vue from "vue";
import vueFilePond from "vue-filepond";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "./plugins/axios";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import Cloudinary from "cloudinary-vue";
import "./validation";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

// FilePond plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

Vue.config.productionTip = false;

Vue.component(
  "FilePond",
  vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview)
);
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);

Vue.use(Cloudinary, {
  configuration: {
    cloudName: process.env.VUE_APP_CLAUDINARY_CLOUD_NAME,
  },
});
Vue.use(axios);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount("#app");
