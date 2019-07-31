<template lang="pug">
  v-container(fluid fill-height)
    v-layout(align-center justify-center)
      v-flex(xs12 sm8 md5 lg3): v-card.elevation-12
        v-toolbar(color="primary" dark flat): v-toolbar-title Noah's Arc Admin
        v-card-text: v-form
          v-text-field(label="Username" prepend-icon="fa-user-alt" type="text" v-model="credentials.username")
          v-text-field(label="Password" prepend-icon="fa-lock" type="password" v-model="credentials.password")
        v-card-actions
          v-spacer
          v-btn(color="primary" @click="login(credentials)") Login
</template>

<script>
export default {
  data() {
    return {
      credentials: {
        username: null,
        password: null
      }
    };
  },
  methods: {
    login() {
      this.$router.replace("/dashboard");
    }
  }
};
</script>
