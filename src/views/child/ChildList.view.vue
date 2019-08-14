<template lang="pug">
  v-data-table.elevation-1(:headers="headers" :items="children" :items-per-page="5")
    template(v-slot:top)
      v-toolbar(flat color="white")
        v-toolbar-title Children
        v-spacer
        v-dialog(v-model="dialog" max-width="800px" persistent)
          template(v-slot:activator="{on}")
            v-btn.mb-2(color="primary" dark v-on="on") Add Child
          ChildEditDialog(@dismissed="dialog = false")
          
</template>

<script>
import axios from "axios";
import store from "store";

import ChildEditDialog from "./ChildEdit.dialog";

export default {
  components: { ChildEditDialog },
  data() {
    return {
      dialog: false,
      editedIndex: -1,
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
        }
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
