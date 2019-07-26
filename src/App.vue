<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Noah's Arc</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
      </v-btn>
    </v-app-bar>

    <v-content>
      <ChildList />
    </v-content>
    <v-btn fixed dark fab bottom right color="pink">
      <v-icon>fa-plus</v-icon>
    </v-btn>
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
