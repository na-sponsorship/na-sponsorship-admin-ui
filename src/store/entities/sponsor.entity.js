import { Model } from "@vuex-orm/core";
import axios from "axios";
import store from "store";

export default class Sponsor extends Model {
  static entity = "sponsors";

  static fields() {
    return {
      firstName: this.attr(null),
      lastName: this.attr(null),
      email: this.attr(""),
      children: this.attr([]),
    };
  }

  static getAxiosInstance() {
    return axios.create({
      baseURL: process.env.VUE_APP_API,
      headers: {
        Authorization: `Bearer ${store.get("access_token")}`,
      },
    });
  }

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}
