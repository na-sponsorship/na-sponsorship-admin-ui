<template lang="pug">
	v-container(fluid fill-height).indigo.darken-2.align-start
		v-row(dense)
			v-col.flex-grow-0.mx-5.mt-10
				img(:src="logo" width="100%").mt-n10.mb-2
				v-card(flat)
					v-navigation-drawer(floating permanent)
						v-list(dense rounded)
							v-list-item(v-for="(item, index) in items" :key="index" link :to="item.path" exact v-if="hasPermission(item.role, role)")
								v-list-item-icon.mr-4: v-icon {{item.icon}}
								v-list-item-content: v-list-item-title {{item.title}}
							v-list-item(@click="logout()")
								v-list-item-content.red--text.accent-4: v-list-item-title Log out
			v-col.flex-grow-1
				v-card(elevation="12" shaped)
					v-card-title {{$route.meta.title}}
					v-card-text
						router-view
</template>

<script>
import store from "store";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      logo: require("../../assets/light@3x.png"),
      items: [
        { title: "Children", icon: "fa-tachometer-alt", path: "/dashboard" },
        {
          title: "Sponsors",
          icon: "fa-hand-holding-heart",
          path: "/dashboard/sponsors",
        },
        {
          title: "Users",
          icon: "fa-users",
          path: "/dashboard/users",
          role: ["Admin"],
        },
      ],
    };
  },
  computed: {
    ...mapGetters("app", ["role"]),
  },
  methods: {
    hasPermission(requiredPermission, userRole) {
      if (!requiredPermission) {
        return true;
      }

      return requiredPermission.includes(userRole);
    },
    logout() {
      store.remove("access_token");
      this.$router.replace("/");
    },
  },
};
</script>
