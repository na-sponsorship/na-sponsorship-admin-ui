<template lang="pug">
	div
		v-navigation-drawer(v-model="drawer" app)
			v-list(dense)
				v-list-item(@click="")
					v-list-item-action: v-icon fa-home
					v-list-item-content: v-list-item-title Children
		v-app-bar(app dark color="indigo")
			v-app-bar-nav-icon(@click.stop="drawer = !drawer")
			v-toolbar-title {{$route.meta.title}}    
			v-spacer
			v-toolbar-items
				v-btn(text @click="logout()") Logout
		v-content: v-layout: v-flex: router-view.ma-5
</template>

<script>
export default {
  data() {
    return {
      drawer: true
    };
  },
  methods: {
    logout() {
      this.$router.replace("/");
    }
  }
};
</script>
