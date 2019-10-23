import { Model } from "@vuex-orm/core";
import { isNull } from "lodash";

export default class User extends Model {
  static entity = "users";

  static fields() {
    return {
      id: this.attr(null),
      username: this.attr(null),
      firstName: this.attr(null),
      lastName: this.attr(null),
      password: this.attr(null),
      role: this.attr("Editor"),
    };
  }

  static methodConf = {
    http: {
      url: "auth",
    },
    methods: {
      $fetch: {
        http: {
          url: "/users",
        },
      },
      $delete: {
        http: {
          url: "/users/:id",
        },
      },
      $create: {
        http: {
          url: "/register",
        },
      },
    },
  };

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}
