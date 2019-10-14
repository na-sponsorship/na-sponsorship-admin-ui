import { Model } from "@vuex-orm/core";

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
    };
  }
}
