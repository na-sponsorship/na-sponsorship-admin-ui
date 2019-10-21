<template lang="pug">
  v-container(fluid fill-height)
    v-layout(align-center justify-center)
      v-flex(xs12 sm8 md5 lg3): v-card.elevation-12
        v-toolbar(color="primary" dark flat): v-toolbar-title Noah's Arc Admin
        v-card-text: v-form
          v-alert(v-show="incorrectPassword" type="error" dense) Incorrect username or password
          v-text-field(label="Username" prepend-icon="fa-user-alt" type="text" v-model="credentials.username")
          v-text-field(label="Password" prepend-icon="fa-lock" type="password" v-model="credentials.password" v-on:keydown.enter.prevent="login(credentials)")
        v-card-actions
          v-spacer
          v-btn(color="primary" @click="login(credentials)" :loading="loggingIn") Log In
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      incorrectPassword: false,
      loggingIn: false,
      credentials: {
        username: null,
        password: null,
      },
    };
  },
  methods: {
    ...mapActions("app", ["appLogin"]),
    async login(credentials) {
      this.loggingIn = true;

      const returnTo = this.$route.params.returnTo || "child.list";

      try {
        await this.appLogin(credentials);

        this.$router.replace({ name: returnTo });
      } catch {
        this.incorrectPassword = true;
      }

      this.loggingIn = false;
    },
  },
};
</script>
