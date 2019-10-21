import { Model } from "@vuex-orm/core";
import axios from "axios";
import store from "store";

export default class Child extends Model {
  static entity = "children";

  static fields() {
    return {
      id: this.attr(null),
      firstName: this.attr(null),
      lastName: this.attr(""),
      gender: this.attr(""),
      dateOfBirth: this.attr(null),
      image: this.attr(""),
      grade: this.attr(""),
      story: this.attr(""),
      sponsorsNeeded: this.attr(2),
      activeSponsors: this.attr(0),
      archived: this.attr(false),
      sponsors: this.attr([]),
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

  async archive() {
    return await Child.getAxiosInstance().post(`/children/archive/${this.id}`);
  }

  async unarchive() {
    return await Child.getAxiosInstance().post(
      `/children/unarchive/${this.id}`
    );
  }
}
