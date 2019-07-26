<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="children"
      :items-per-page="5"
      class="elevation-1"
    ></v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      headers: [
        {
          text: "First Name",
          sortable: true,
          value: "firstName"
        },
        {
          text: "Last Name",
          sortable: true,
          value: "lastName"
        },
      ],
      children: []
    };
  },
  created() {
    axios.get(`${process.env.VUE_APP_API}/children`).then(children => {
      this.children = children.data.items;
    });
  }
};
</script>