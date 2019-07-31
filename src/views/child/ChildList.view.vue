<template>
  <v-data-table
    :headers="headers"
    :items="children"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Children</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">Add Child</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ dialogTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      v-model="editedItem.firstName"
                      label="First Name"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1">Cancel</v-btn>
              <v-btn color="blue darken-1">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      dialog: false,
      editedIndex: -1,
      editedItem: {
        firstName: ""
      },
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
  },
  computed: {
    dialogTitle() {
      return this.editedIndex === -1 ? "Add Child" : "Edit Child";
    }
  }
};
</script>
