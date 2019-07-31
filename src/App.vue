<template>
  <v-app>
    <v-container>
      <router-view :key="$route.fullPath"></router-view>
    </v-container>
  </v-app>
</template>

<script>
import ChildList from "./views/child/ChildList.view";

export default {
  name: "App",
  components: {
    ChildList
  },
  data: () => ({
    //
  })
};
</script>
